
import OrbitDB from 'orbit-db'

const IPFS = require('ipfs');

const ipfs = new IPFS({
    repo: 'your-repo-path',
    start: true,
    config: {
      Addresses: {
        Swarm: [
          "/ip4/0.0.0.0/tcp/4002",
          "/ip4/127.0.0.1/tcp/4003/ws",
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        ]
      }
    },
  })

  console.log("waiting on IPFS ready")

// ipfs.on('ready', async () => {
//     console.log('connecting to peer')
//     const resp = await ipfs.swarm.connect('/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/QmTMYbyMfMwG7RgPe5PPNjGP6De9RyVu4XxiYnJutrzPEJ')
//     console.log('finished connecting: ', resp)

//     const orbitdb = await OrbitDB.createInstance(ipfs)
//     const db = await orbitdb.eventlog('example', { overwrite: true })
//     await db.load()
//     // const db = await orbitdb.keyvalue('first-database')
//     console.log(db.address.toString())
// })
ipfs.on('ready', async () => {
    // console.log('connecting to peer')
    // const resp = await ipfs.swarm.connect('/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/QmTMYbyMfMwG7RgPe5PPNjGP6De9RyVu4XxiYnJutrzPEJ')
    // console.log('finished connecting: ', resp)

    const orbitdb = await OrbitDB.createInstance(ipfs)
    console.log('opening db')
    const db = await orbitdb.open('/orbitdb/zdpuAqDw45Vnxtm37EiMRWreaYv7RmyJaP5sCjKaZ28oYssXh/frombrowser')

    // When database gets replicated with a peer, display results
    db.events.on('replicated', () => console.log('replicated'))
    // When we update the database, display result
    db.events.on('write', () => console.log('write'))

    db.events.on('replicate.progress', () => console.log('replicate progress'))

    // Hook up to the load progress event and render the progress
    let maxTotal = 0, loaded = 0
    db.events.on('load.progress', (address, hash, entry, progress, total) => {
      console.log('load progress')
    })

    db.events.on('ready', () => {console.log('database ready')})

    await db.load()
    // const db = await orbitdb.keyvalue('first-database')
    console.log(db.address.toString())
})