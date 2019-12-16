import 'mocha'

import fs from 'fs';
import path from 'path';
import { Community, Repo } from 'tupelo-wasm-sdk';
const MemoryDatastore: any = require('interface-datastore').MemoryDatastore;

// we only want to set the default *once* and not every time, so use a promise
let beforePromise: Promise<boolean>

before(() => {
  if (beforePromise !== undefined) {
    return beforePromise;
  }
  beforePromise = new Promise(async (res, rej) => {
    console.log("setting up repo")
    const repo = new Repo('test', {
      lock: 'memory',
      storageBackends: {
        root: MemoryDatastore,
        blocks: MemoryDatastore,
        keys: MemoryDatastore,
        datastore: MemoryDatastore
      }
    })
    await repo.init({})
    await repo.open()

    const tomlFile = path.join(__dirname, 'notarygroup.toml')
    const tomlConfig = fs.readFileSync(tomlFile).toString()

    console.log("resetting community to a test community")
    const testCommunity = await Community.fromNotaryGroupToml(tomlConfig, repo)
    Community.setDefault(testCommunity)
    res(true)
  })
  return beforePromise
})