// import walletSigner from "../service/signerCnf"

import { useState, useEffect } from "react";
import CardComponent from "./component/card";
import { polygonZkEvmTestnet } from "viem/chains";
import demoAbi from "../demoSmartContract/demoAbi.json";
import { createPublicClient, http } from "viem";

import {
    getAccount,
  readContract,
    writeContract,
    waitForTransaction,
    useContractRead
  } from "@wagmi/core";

export default function AdminPanel() {
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

    // interval check whether user has connected or disconnected wallet
    const interval = setInterval(() => {
      const { address, isConnected } = getAccount();
      setConnectedAddress(address);
      setAddressIsConnected(isConnected);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

    const myZkEVMSmartContractAddress =
    "0xcf0c9bbd5f844eff046ea14704cb2c0bbff3c2c2";

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
          await getProposols();
          setIsLoading(false);
        } else {
          alert("Connect wallet to update blockchain data");
        }
      }

      const getProposols = async () => {
        try {
            const data = await readContract({
                  ...contractConfig,
              functionName: "viewProposals",
              args: [parseInt(sessionId)],
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
            await getProposols();
            setIsLoading(false);
          } else {
            alert("Connect wallet to update blockchain data");
          }
      }



    return (
        <div className="bg-neutral-100 flex flex-wrap justify-center md:order-2">
            <button className="bg-indigo-700 text-white py-2 px-5 ms-4 rounded-lg text-lg" onClick={generateNewSession}>+ Generate New Session</button>
            {sessionId === 0 ? <></> :<h1 className="p-3">Session Id : {sessionId}</h1>}


            <div className="grid grid-cols-3 gap-5 m-4">
                {sessions == [] ? sessions.map((data, index) => <CardComponent cardIndex={index}  />) : <></>}
                <div className="bg-white grid grid-rows-4 grid-flow-row gap-4 shadow-lg p-4 rounded-lg">
                    <div className="row-span-4 col-span-4 text-center text-2xl"><button onClick={createProposol}>+</button></div>
                </div>
            </div>
        </div>
    )
}