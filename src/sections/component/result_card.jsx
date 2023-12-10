import { useState, useEffect, useRef } from "react";
import { polygonZkEvmTestnet } from "viem/chains";
import demoAbi from "../../demoSmartContract/demoAbi.json";
import { createPublicClient, http } from "viem";
import ViewVotes from "./viewVotes";

import {
    getAccount,
    readContract,
    writeContract,
    waitForTransaction,
    useContractRead
} from "@wagmi/core";

export default function ResultCard(data) {


    const [showData, setShowData] = useState(null);
    const [proposols, setProposals] = useState([]);
    const [publicClient, setPublicClient] = useState();
    const [connectedAddress, setConnectedAddress] = useState();
    const [addressIsConnected, setAddressIsConnected] = useState(false);

    const chain = polygonZkEvmTestnet;
    const chainId = polygonZkEvmTestnet.id;

    useEffect(() => {
        console.log("Result Card" + data);
        // A Public Client is an interface to "public" JSON-RPC API methods
        // such as retrieving block numbers, transactions, reading from smart contracts, etc
        const newPublicClient = createPublicClient({
            chain,
            transport: http(),
        });
        setPublicClient(newPublicClient);
        setProposals([]);

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


    useEffect(() => {
        console.log(data.sessionId);
        getProposols();
    }, [])

    const getProposols = async () => {
        console.log(parseInt(data.sessionId));
        try {
            const response = await readContract({
                ...contractConfig,
                functionName: "viewProposals",
                args: [parseInt(data.sessionId)],
            });
            console.log(response);
            setProposals(response);
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const voteReading = async (index) => {
        if (addressIsConnected) {
            const { hash } = await writeContract({
                ...contractConfig,
                functionName: "viewResult",
                args: [parseInt(data.sessionId), index],
            });

            const data = await waitForTransaction({
                hash,
            });

            console.log(parseInt(data.logs[0].data));
        } else {
            alert("Connect wallet to update blockchain data");
        }
    }

    return (
        <article class="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
            <div class="flex items-start sm:gap-8">


                <div>
                    <strong
                        class="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white w-1/2"
                    >
                        {String(data.sessionId)}
                    </strong>

                    <div class="overflow-x-auto mt-3">
                        <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead class="ltr:text-left rtl:text-right">
                                <tr>
                                    <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
                                    <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Title</th>
                                    <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Description</th>
                                    <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Total Votes</th>

                                </tr>
                            </thead>

                            {/* {data.map((data,index) => )} */}
                            {/* {data} */}

                            {proposols.map((title, index) =>(
                            <tbody class="divide-y divide-gray-200">
                                <tr class="odd:bg-gray-50">
                                    <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{String(index)}</td>
                                    <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{String(title)}</td>
                                    <ViewVotes proposalId={index} sId={data.sessionId}/>


                                </tr>
                            </tbody>  ))}
                        </table>
                    </div>
                </div>
            </div>
        </article>
    );
}