// import walletSigner from "../service/signerCnf"

import { useState, useEffect } from "react";
import SessionCardComponent from "./component/sessionCard";
import { polygonZkEvmTestnet } from "viem/chains";
import demoAbi from "../demoSmartContract/demoAbi.json";
import { createPublicClient, http } from "viem";
import ResultCard from "./component/result_card";

import { useNavigation } from "react-router-dom";

import {
    getAccount,
  readContract,
    writeContract,
    waitForTransaction,
    useContractRead
  } from "@wagmi/core";

export default function Result() {

   
    const chain = polygonZkEvmTestnet;
    const chainId = polygonZkEvmTestnet.id;


  useEffect(() => {
    // A Public Client is an interface to "public" JSON-RPC API methods
    // such as retrieving block numbers, transactions, reading from smart contracts, etc
    const newPublicClient = createPublicClient({
      chain,
      transport: http(),
    });
    setPublicClient(newPublicClient);
    setSessions([]);

    // interval check whether user has connected or disconnected wallet
    const interval = setInterval(() => {
      const { address, isConnected } = getAccount();
      setConnectedAddress(address);
      setAddressIsConnected(isConnected);
    }, 1000);

    getSessions();

    return () => clearInterval(interval);
  }, []);

    const myZkEVMSmartContractAddress =
    "0x9FFdf0711C55a01c3a21Fe472AffD76D547d2088";

    const contractConfig = {
        address: myZkEVMSmartContractAddress,
        abi: demoAbi,
        chainId,
      };

    const [addressIsConnected, setAddressIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [publicClient, setPublicClient] = useState();
    const [connectedAddress, setConnectedAddress] = useState();

    const generateNewSession = async () => {
        if (addressIsConnected) {
          const { hash, response } = await writeContract({
            ...contractConfig,
            functionName: "createVotingSession",
          });
          setIsLoading(true);
          const data = await waitForTransaction({
            hash,
          });
          console.log("new session generated")
          setSessionId(parseInt(data.logs[0].data));
          setSessions([]);
          await getSessions();
          setIsLoading(false);
        } else {
          alert("Connect wallet to update blockchain data");
        }
      }

      const getSessions = async () => {
        console.log("fatch sessions");
        try {
            const data = await readContract({
                  ...contractConfig,
              functionName: "getSessions",
            });
            console.log(data);
            setSessions(data);
          } catch (err) {
            console.log("Error: ", err);
          }

      
      }

      const createProposol = async () => {
        if (addressIsConnected) {
            const { hash, response } = await writeContract({
              ...contractConfig,
              functionName: "createProposal",
              args: [sessionId, "First Proposol", "About it all..."]
            });
            setIsLoading(true);
            const data = await waitForTransaction({
              hash,
            });
            console.log(data);
            // await getProposols();
            setIsLoading(false);
          } else {
            alert("Connect wallet to update blockchain data");
          }
      }



    return (
        <div className=" flex flex-wrap justify-center md:order-2">
            <div className="grid grid-cols-2 gap-5 m-4">
               {sessions == [] ? <>No Sessions There</> : sessions.map((data, index) => <ResultCard sessionId={data}/>) }
            </div>
        </div>
    )
}