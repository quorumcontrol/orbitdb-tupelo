import AccessController from "orbit-db-access-controllers/src/access-controller-interface";
import OrbitDB from "orbit-db";
import { ChainTree, Community } from "tupelo-wasm-sdk";
import { IdentityProvider } from "orbit-db-identity-provider";

const type = 'tupelo-access-controller'

export interface TupeloAccessControllerOptions {
    did: string
}

export class TupeloAccessController extends AccessController {
    did: string
    private tree?: ChainTree

    static get type() { return type }
    static async create(orbitdb: OrbitDB, opts: TupeloAccessControllerOptions) {
        console.log("create calld with options: ", opts)
        return new TupeloAccessController(opts)
    }

    constructor(opts: TupeloAccessControllerOptions) {
        super()
        this.did = opts.did.trim()
    }

    async canAppend(entry: LogEntry<any>, identityProvider: any): Promise<boolean> {
        if (!isValidDid(entry.identity.id)) {
            return Promise.resolve(false)
        }

        const c = await Community.getDefault()
        console.log('searching for did: "',this.did + "'")
        const dbTip = await c.getTip(this.did)
        const tree = new ChainTree({
            store: c.blockservice,
            tip: dbTip,
        })
        console.log("found tip, resolving", entry.id)
        const resp = await tree.resolve("/tree/data" + entry.id)
        console.log(resp)

        if ((resp.value as string[]).includes(entry.identity.id)) {
            return identityProvider.verifyIdentity(entry.identity)
        }       
        console.log("resolving")
        return Promise.resolve(false)
    }
    
    async save() {
        return {did: this.did}
    }

    async load(address:any) {
        console.log("load: ", address)
        return Promise.resolve(true)
    }


    // Returns the address of the contract used as the AC
    get address() {
        return this.did
    }

}

function isValidDid(did:string) {
    return did.startsWith("did:tupelo")
}