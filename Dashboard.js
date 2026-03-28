// pages/index.js (Next.js 14 + wagmi/viem for wallet)
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { agentRegistryAbi } from '../abis/AgentRegistry';

export default function Dashboard() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const createAgent = (caps) => {
    writeContract({
      address: '0xAgentRegistry',
      abi: agentRegistryAbi,
      functionName: 'registerAgent',
      args: [caps]
    });
  };

  return (
    <div className="p-8">
      <ConnectButton />
      {address && (
        <button onClick={() => createAgent(['stock-analysis'])} className="bg-blue-500 p-2">
          Create Trading Agent
        </button>
      )}
      {/* Recharts: Messages/sec, fees */}
    </div>
  );
}
