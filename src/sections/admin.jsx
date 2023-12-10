// import walletSigner from "../service/signerCnf"

import { useState, useEffect, useRef } from "react";
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
        setSessions([]);

        // interval check whether user has connected or disconnected wallet
        const interval = setInterval(() => {
            const { address, isConnected } = getAccount();
            setConnectedAddress(address);
            setAddressIsConnected(isConnected);
        }, 1000);

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
    const [formOpen, setFormOpen] = useState(false);

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);

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
        console.log(sessionId);
        try {
            const data = await readContract({
                ...contractConfig,
                functionName: "viewProposals",
                args: [sessionId],
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
                args: [sessionId, title, description]
            });
            setIsLoading(true);
            const data = await waitForTransaction({
                hash,
            });
            console.log(data);
            setFormOpen(false);
            await getProposols();
            setIsLoading(false);
        } else {
            alert("Connect wallet to update blockchain data");
        }
    }



    return (
        <div className=" flex flex-wrap justify-center md:order-2">
            <button className="bg-indigo-700 text-white py-2 px-5 ms-4 rounded-lg text-lg" onClick={generateNewSession}>+ Generate New Session</button>
            <br />
            {sessionId === 0 ? <></> : <h1 className="p-3">Session Id : {sessionId}</h1>}

            {formOpen ?

(<div class="flow-root w-1/2 mt-5 mx-5 flex justify-center bg-white p-5 border-2">
    <dl class="-my-3 divide-y divide-gray-100 text-sm">

        <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900">Title</dt>

                <input onChange={e => setTitle(e.target.value)} class="w-full text-base text-gray-700 sm:col-span-2" placeholder="Entery your proposal title" />

        </div>

        <br />

        <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium  text-gray-900">Details</dt>

            <textarea onChange={e=>setDescription(e.target.value)} className="w-full text-base text-gray-700 sm:col-span-2" placeholder="Enter detail about a proposal"></textarea>

        </div>

        <button onClick={createProposol} className="bg-indigo-700 text-white px-5 py-3 rounded-lg" >submit</button>
    </dl>
</div>)
: <></>}

            <div className="grid grid-cols-3 gap-5 m-4">
                {sessions == [] ? <></> : sessions.map((data, index) => <CardComponent cardData={data} index={index} />)}
                <div className="bg-white grid grid-rows-4 grid-flow-row gap-4 shadow-lg p-4 rounded-lg">
                    <div className="row-span-4 col-span-4 text-center text-2xl"><button onClick={() => setFormOpen(true)}>+</button></div>
                </div>
            </div>

            
        </div>
    )
}