import 'mocha'
import {expect} from 'chai'
import AccessControllers from 'orbit-db-access-controllers'
import {TupeloAccessController} from './access'
import Identities, { Identity } from 'orbit-db-identity-provider'
import { Community, EcdsaKey, ChainTree, setDataTransaction, setOwnershipTransaction, Tupelo } from 'tupelo-wasm-sdk'
import { TupeloIdentityProvider, TupeloIdentityProviderOptions} from './identity'
import path from 'path'
import rmrf from 'rimraf'
import OrbitDB from 'orbit-db'

const OrbitDBMaker:any = require('orbit-db')

import IPFS from 'ipfs';

const accessType = TupeloAccessController.type
const type = TupeloIdentityProvider.type

const Keystore: any = require('orbit-db-keystore')

const keypath = path.resolve('./test/keys')

describe("TupeloAccessController", ()=> {
    let community: Community
    let keystore: any

    before(async () => {
        rmrf.sync(keypath)
        community = await Community.getDefault()
        TupeloIdentityProvider.community = Community.getDefault()
        Identities.addIdentityProvider(TupeloIdentityProvider)
        AccessControllers.addAccessController({AccessController: TupeloAccessController})
        keystore = new Keystore(keypath)
    })

    after(async () => {
        await keystore.close()
        rmrf.sync(keypath)
    })


    it('allows access', async () => {
        return new Promise(async (res,rej)=> {
            const key = await EcdsaKey.generate()
            const tree = await ChainTree.newEmptyTree(community.blockservice, key)
            const addr = await key.address()
            const did = await tree.id()
            if (did === null) {
                throw new Error("null did")
            }
            await community.playTransactions(tree, [setDataTransaction("no", "nothing")])

            const opts: TupeloIdentityProviderOptions = { type, keystore, tree, did }
    
            const identity = await Identities.createIdentity(opts)
            expect(identity.id).to.equal(did)
            const ipfs = new IPFS({})
            
            ipfs.on('ready', async ()=> {
                const dbKey = await EcdsaKey.generate()
                const dbTree = await ChainTree.newEmptyTree(community.blockservice, dbKey)
                const did = await dbTree.id()
                if (did === null ) {
                    throw new Error("no null tips")
                }
                const orbitdb:any = await OrbitDBMaker.createInstance(ipfs, {
                    AccessControllers: AccessControllers,
                })
    
                const db = await orbitdb.keyvalue('testdb', {
                    accessController: {
                        type: accessType,
                        write: [identity.id],
                        did: did,
                    }
                })

                console.log("setting orbit db on", did, "with db addr: ", db.address.toString())
                await community.playTransactions(dbTree, [setDataTransaction(db.address.toString(), [identity.id])])
                // console.log('from test: ', await community.getTip(did))
                db.setIdentity(identity)

                setTimeout(async ()=> {
                    await community.nextUpdate()
                    console.log("now attempting to set identity")
                    await db.set("test", "hello")
                    res()
                }, 500)

               
            })
            
        })
       
    }).timeout(10000)
    
    
})