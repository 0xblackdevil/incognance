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
    "0x3Baf2aa2aD287949590cD39a731fD17606c7D10F";

  const contractConfig = {
    address: myZkEVMSmartContractAddress,
    abi: demoAbi,
    chainId,
  };

  const [count, setCount] = useState();
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

  useEffect(() => {
    if (publicClient) {
      const readCount = async () => {
        await readCounterValue();
      };
      const checkCurrentBlockNumber = async () => {
        const blockNumber = await publicClient.getBlockNumber();
        setCurrentBlockNumber(blockNumber);
      };

      readCount();
      checkCurrentBlockNumber();
    }
  }, [publicClient]);

  async function readCounterValue() {
    try {
      const data = await readContract({
        ...contractConfig,
        functionName: "retrieve",
        chainId,
      });
      const newCount = JSON.parse(data);
      setCount(newCount);
      return newCount;
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  const incrementCounter = async () => {
    if (addressIsConnected) {
      const { hash } = await writeContract({
        ...contractConfig,
        functionName: "increment",
        // args: [69],
      });
      setIsLoading(true);
      const data = await waitForTransaction({
        hash,
      });
      await readCounterValue();
      setIsLoading(false);
    } else {
      alert("Connect wallet to update blockchain data");
    }
  };

  return (
    <div id="vc-gated-dapp">
      <div className="bg-indigo-700 py-4">
        <Container maxW={"80%"}>
          <Flex justifyContent="space-between">
            <h1 className="text-xl text-white">DigitalVoting System</h1>
            <ConnectButton className="bg-white" showBalance={false} />
          </Flex>
        </Container>
      </div>

      <Box>
        <Container maxW={"80%"} py={4}>
          <div>
            <Card my={4} p={4}>
              <Center>
                <VStack>
                  <Heading>Counter Dapp</Heading>

                  <p>The current count is</p>
                  <Heading>{isLoading ? <Spinner></Spinner> : count}</Heading>
                  <Button onClick={() => incrementCounter()}>
                    Increment counter
                  </Button>
                </VStack>
              </Center>
            </Card>
          </div>
        </Container>
      </Box>
    </div>
  );
}

export default VcGatedDapp;
