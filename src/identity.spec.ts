import 'mocha'
import { expect } from 'chai'
import { TupeloIdentityProvider, TupeloIdentityProviderOptions } from './identity'
import Identities from 'orbit-db-identity-provider'
import path from 'path'
import rmrf from 'rimraf'
import { ChainTree, EcdsaKey, Community, setOwnershipTransaction, setDataTransaction, Tupelo } from 'tupelo-wasm-sdk'
import CID from 'cids'

const Keystore: any = require('orbit-db-keystore')

const keypath = path.resolve('./test/keys')

const type = TupeloIdentityProvider.type

describe('TupeloIdentity', () => {
    let community: Community
    let keystore: any

    before(async () => {
        community = await Community.getDefault()
        rmrf.sync(keypath)
        TupeloIdentityProvider.community = Community.getDefault()
        Identities.addIdentityProvider(TupeloIdentityProvider)
        keystore = new Keystore(keypath)
    })

    after(async () => {
        await keystore.close()
        rmrf.sync(keypath)
    })

    it('gets the correct ID', async () => {
        const key = await EcdsaKey.generate()
        const tree = await ChainTree.newEmptyTree(community.blockservice, key)

        const did = await tree.id()
        if (did === null) {
            throw new Error("null did")
        }

        const opts: TupeloIdentityProviderOptions = { type, keystore, tree, did }

        const identity = await Identities.createIdentity(opts)
        expect(identity.id).to.equal(did)
    })

    it('verifies the identity', async ()=> {
        const key = await EcdsaKey.generate()
        const tree = await ChainTree.newEmptyTree(community.blockservice, key)
        const addr = await key.address()
        const did = await tree.id()
        if (did === null) {
            throw new Error("null did")
        }

        const resp = await community.playTransactions(tree, [setOwnershipTransaction([addr])])
        await waitForCommunityTip(community, did, new CID(Buffer.from(resp.getNewTip_asU8())))
        
        const opts: TupeloIdentityProviderOptions = { type, keystore, tree, did }

        const identity = await Identities.createIdentity(opts)
        const verified = await Identities.verifyIdentity(identity)
        expect(verified).to.be.true
    }).timeout(10000)
})


/**
 * Returns a promise that resolves when the apps community instance updates the
 * ChainTree specified by did to the expected tip tip
 */
export function waitForCommunityTip(c: Community, did: string, tip: CID) { // for some reason can't use CID as a type here easily
    return new Promise((resolve, reject) => {
        let count = 0
        const doCheck = async () => {
            await c.nextUpdate()
            let cTip: CID
            try {
                cTip = await c.getTip(did)
            } catch (e) {
                if (e === "not found") {
                    setTimeout(doCheck, 200)
                    return
                }
                throw new Error(e)
            }
            if (tip.equals(cTip)) {
                resolve()
                return
            }
            if (count > 60) {
                reject(new Error("timeout error, over 30s"))
                return
            }
            count++
            setTimeout(doCheck, 500)
        }
        doCheck()
    })
}