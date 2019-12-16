import 'mocha'
import { expect } from 'chai'
import { TupeloIdentityProvider, TupeloIdentityProviderOptions } from './identity'
import Identities from 'orbit-db-identity-provider'
import path from 'path'
import rmrf from 'rimraf'
import { ChainTree, EcdsaKey, Community, setOwnershipTransaction, setDataTransaction } from 'tupelo-wasm-sdk'

const Keystore: any = require('orbit-db-keystore')

const keypath = path.resolve('./test/keys')

const type = TupeloIdentityProvider.type

describe('TupeloIdentity', () => {
    let community: Community
    let keystore: any

    before(async () => {
        community = await Community.getDefault()
        rmrf.sync(keypath)
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

        await community.playTransactions(tree, [setOwnershipTransaction([addr])])
        // await community.playTransactions(tree, [setDataTransaction("test", "nothing")])

        const did = await tree.id()
        if (did === null) {
            throw new Error("null did")
        }

        const opts: TupeloIdentityProviderOptions = { type, keystore, tree, did }

        const identity = await Identities.createIdentity(opts)
        const verified = await Identities.verifyIdentity(identity)
        expect(verified).to.be.true
    }).timeout(10000)
})