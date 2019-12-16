import OrbitDB from 'orbit-db'

const IPFS = require('ipfs');

declare const window:any;

const ipfs = new IPFS({
        repo: '/orbitdb/examples/browser/new/ipfs/0.33.1',
        start: true,
        config: {
          Addresses: {
            Swarm: [
              // Use IPFS dev signal server
              // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
              '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
              // Use local signal server
              // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
            ]
          },
        }
      })

  console.log("waiting on IPFS ready")

ipfs.on('ready', async () => {
    console.log('ipfs ready');
})

window.OrbitDB = OrbitDB
window.ipfs = ipfs