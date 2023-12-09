import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygonZkEvmTestnet } from "viem/chains";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Spinner,
  Card,
  Center,
  VStack,
} from "@chakra-ui/react";
import {
  getAccount,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import demoAbi from "./demoSmartContract/demoAbi.json";
import AdminPanel from "./sections/admin";

function VcGatedDapp() {
  const chain = polygonZkEvmTestnet;
  const chainId = polygonZkEvmTestnet.id;

  const [publicClient, setPublicClient] = useState();
  const [connectedAddress, setConnectedAddress] = useState();
  const [addressIsConnected, setAddressIsConnected] = useState(false);
  const [currentBlockNumber, setCurrentBlockNumber] = useState();
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);

  // variables specific to demo
  const myZkEVMSmartContractAddress =
    "0x75620cA86f29d27AB80278B5621647bd194E9645";

  const contractConfig = {
    address: myZkEVMSmartContractAddress,
    abi: demoAbi,
    chainId,
  };

  const [count, setCount] = useState();
  const [sessions, setSessions] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // A Public Client is an interface to "public" JSON-RPC API methods
    // such as retrieving block numbers, transactions, reading from smart contracts, etc
    const newPublicClient = createPublicClient({
      chain,
      transport: http(),
    });
    setPublicClient(newPublicClient);

    // interval check whether user has connected or disconnected wallet
    const interval = setInterval(() => {
      const { address, isConnected } = getAccount();
      setConnectedAddress(address);
      setAddressIsConnected(isConnected);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function readSessionValue() {
    try {
      const data = await readContract({
        ...contractConfig,
        functionName: "getSessions",
        chainId,
      });
      console.log("It will try")
      const newSessions = data;
      console.log(JSON.stringify(newSessions));
      setSessions(newSessions);
      return newSessions;
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  const generateNewSession = async () => {
    if (addressIsConnected) {
      const { hash } = await writeContract({
        ...contractConfig,
        functionName: "createVotingSession",
        args: [12],
      });
      setIsLoading(true);
      const data = await waitForTransaction({
        hash,
      });
      console.log("new session generated")
      await readSessionValue();
      setIsLoading(false);
    } else {
      alert("Connect wallet to update blockchain data");
    }
  }

  return (
    <div id="vc-gated-dapp h-full">
      <div className="bg-indigo-700 py-4">
        <Container maxW={"80%"}>
          <Flex justifyContent="space-between">
            <h1 className="text-xl text-white">DigitalVoting System</h1>
            <ConnectButton className="bg-white" showBalance={false} />
          </Flex>
        </Container>
      </div>

      <div className="bg-neutral-100 flex flex-wrap justify-center md:order-2">
            <div
              className={`rounded  border m-5 "bg-indigo-100 text-indigo-800 border-indigo-300 text-xs font-medium mr-2 px-2.5 py-0.5`}
            >
              Admin Panel
            </div>

            <div
              className={`rounded  border m-5 "bg-indigo-100 text-indigo-800 border-indigo-300 text-xs font-medium mr-2 px-2.5 py-0.5`}
            >
              Voter Panel
            </div>

            <div
              className={`rounded  border m-5 "bg-indigo-100 text-indigo-800 border-indigo-300 text-xs font-medium mr-2 px-2.5 py-0.5`}
            >
              Result
            </div>
          </div>

          <AdminPanel />
    </div>
  );
}

export default VcGatedDapp;
