import 'mocha'
import { expect } from 'chai';
import OrbitDB from 'orbit-db'
import IPFS from 'ipfs';

// const IPFS = require('ipfs');

describe("playing aorund", () => {
    it("works", (done) => {
        const ipfs = new IPFS({})
        ipfs.on('ready', async () => {
            const orbitdb = await OrbitDB.createInstance(ipfs)
            const db = await orbitdb.keyvalue('first-database')
            console.log(db.address.toString())
            expect(db).to.not.be.null
            done()
        })
    })
})