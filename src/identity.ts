import Identities, {IdentityProvider, IdentityAsJson, IdentityProviderOptions } from 'orbit-db-identity-provider'
import {ChainTree, EcdsaKey, Tupelo, Community} from 'tupelo-wasm-sdk'
import { Signature } from 'tupelo-messages/signatures/signatures_pb';

// see https://github.com/orbitdb/orbit-db-identity-provider/blob/master/src/identity-provider-interface.js

const type = 'tupelo-identity'

const authenticationPath = "tree/_tupelo/authentications"

export interface TupeloIdentityProviderOptions extends IdentityProviderOptions {
    did: string, // getting the did from the chaintree is an async operation and getId is not, so need both
    tree: ChainTree,
}

export class TupeloIdentityProvider extends IdentityProvider {
    static get type() { return type }
    static async verifyIdentity(identity:IdentityAsJson) {
        console.log("verifying identity: ", identity)
        const c = await Community.getDefault()
        const tip = await c.getTip(identity.id)
        const tree = new ChainTree({
            store: c.blockservice,
            tip: tip,
        })
        const {value} = await tree.resolve(authenticationPath)

        for (const addr of value) {
            try {
                const verified = await Tupelo.verifyMessage(addr, Buffer.from(identity.publicKey + identity.signatures.id), Signature.deserializeBinary(Buffer.from(identity.signatures.publicKey, 'base64')))
                if (verified) {
                    return true
                }
            } catch(e) {
                console.error("error verifying: ", e)
            }
        }

        console.log("verifyIdentity: ", identity)
        // TODO: do this
        return false
    }

    tree:ChainTree
    did:string

    //TODO: should be more prescriptive typing here?
    constructor (options:TupeloIdentityProviderOptions) {
        super(options)
        if (options.tree === undefined || options.did === undefined) {
            throw new Error("missing tree or did from identity options")
        }

        if (!options.tree.key || options.tree.key.privateKey === undefined) {
            throw new Error("must have a chaintree with a private key")
        }

        this.tree = options.tree
        this.did = options.did
    }

    async getId(options={}) {
        return this.did
    }

    async signIdentity(data:any, options={}) {
        // console.log("data: ", data, "options: ", options)
        if (this.tree.key === undefined || this.tree.key.privateKey === undefined) {
            throw new Error("must have a chaintree with a private key")
        }
        const sig = await this.tree.key.signMessage(Buffer.from(data))
        return Buffer.from(sig.serializeBinary()).toString('base64')
    }

}
