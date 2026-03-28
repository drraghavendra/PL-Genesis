// agent-messaging.js (npm i libp2p noise-ed25519)
// Simplified libp2p chat with encryption, fees, Filecoin

import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { ed25519 } from '@libp2p/crypto-keys';
import { tcp } from '@libp2p/tcp';
import fs from 'fs'; // For Filecoin curl sim

async function createAgent(id) {
  const key = await ed25519.generateKeypair();
  const node = await createLibp2p({
    addresses: { listen: ['/ip4/0.0.0.0/tcp/0'] },
    transports: [tcp()],
    connectionEncryption: [noise()],
    peerDiscovery: ['mdns'] // Kademlia in prod
  });

  await node.start();
  console.log(`${id} peerId: ${node.peerId.toString()}`);

  node.handle('/fgacp/1.0.0', ({ stream }) => {
    stream.on('data', async (data) => {
      const msg = JSON.parse(data.toString());
      if (verifySig(msg)) {
        const cid = await pinToFilecoin(msg.payload);
        console.log(`Pinned CID: ${cid}`);
      }
    });
  });

  return { node, key };
}

async function sendMessage(toPeer, payload, fee) {
  const msg = {
    from: 'did:fgacp:zk1abc',
    to: 'did:fgacp:zk1def',
    timestamp: Date.now(),
    payload: btoa(payload), // Encrypt with Noise
    fee_paid: fee,
    signature: 'sig' // sign(hash)
  };
  // Dial & stream to toPeer
  // Pay fee via ethers.js PaymentChannel
}

async function pinToFilecoin(json) {
  // Lotus API sim
  return 'bafybei...'; // Exec curl lotus client deal
}

// Demo: Trader -> Analyst
const trader = await createAgent('Trader');
const analyst = await createAgent('Analyst');
await sendMessage(analyst.node.peerId, 'Analyze AAPL', '0.001 ETH');
