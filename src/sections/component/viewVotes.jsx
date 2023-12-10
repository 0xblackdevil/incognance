import { useState, useEffect, useRef } from "react";
import { polygonZkEvmTestnet } from "viem/chains";
import demoAbi from "../../demoSmartContract/demoAbi.json";
import { createPublicClient, http } from "viem";

import {
    getAccount,
    readContract,
    writeContract,
    waitForTransaction,
    useContractRead
} from "@wagmi/core";

export default function ViewVotes(props) {


    const [showData, setShowData] = useState(null);
    const [proposols, setProposals] = useState([]);
    const [proposol, setProposal] = useState();
    const [publicClient, setPublicClient] = useState();
    const [connectedAddress, setConnectedAddress] = useState();
    const [addressIsConnected, setAddressIsConnected] = useState(false);

    const chain = polygonZkEvmTestnet;
    const chainId = polygonZkEvmTestnet.id;

    useEffect(() => {
        // console.log(props.id)
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


    useEffect(()=>{

        getProposols();
    },[])

    const getProposols = async () => {

        try {
            const response = await readContract({
                ...contractConfig,
                functionName: "viewProposal",
                args: [props.sId, props.proposalId],
            });
            console.log("res", response);
            setProposal(response);
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const voteReading = async (index) => {
        if (addressIsConnected) {
            // const { hash } = await writeContract({
            //     ...contractConfig,
            //     functionName: "viewResult",
            //     args: [parseInt(data.sessionId), index],
            // });

            // const data = await waitForTransaction({
            //     hash,
            // });
            
            // console.log(parseInt(data.logs[0].data));
        } else {
            alert("Connect wallet to update blockchain data");
        }
    }

    return (
       <>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{proposol.description}</td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{parseInt(proposol.votes)}</td>
       </>
    );
}