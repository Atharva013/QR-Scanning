import { ethers } from "ethers";
import axios from "axios";

// Replace with your deployed contract details
const CONTRACT_ADDRESS = "0x96B560e8485C78f961B9d6FEd035E5811a7A4837";
const CONTRACT_ABI = [
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          }
        ],
        "name": "addMedicine",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getMedicine",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "medicineCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_id", "type": "uint256" },
            { "internalType": "address", "name": "_newOwner", "type": "address" }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getMedicineOwner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_id", "type": "uint256" },
            { "internalType": "string", "name": "_ipfsHash", "type": "string" }
        ],
        "name": "addIPFSRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getPreviousOwners",
        "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getMedicineIPFSHistory",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_newIpfsHash",
                "type": "string"
            }
        ],
        "name": "addIPFSHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

];
const ALCHEMY_API = "https://eth-sepolia.g.alchemy.com/v2/c4wAqWJm4vzPTwH_SRdlDEpMLV7q0h-n";

const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/c4wAqWJm4vzPTwH_SRdlDEpMLV7q0h-n");
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

export const fetchMedicineData = async (medicineId) => {
    if (!medicineId) {
        alert("Enter a Medicine ID!");
        return null;
    }

    try {
        // ✅ Fetch ALL IPFS hashes (Medicine history)
        const ipfsHashes = await contract.getMedicineIPFSHistory(medicineId);
        console.log("Fetched IPFS Hashes:", ipfsHashes);

        if (!ipfsHashes || ipfsHashes.length === 0) {
            console.error("No IPFS hashes found.");
            return null;
        }

        // ✅ Fetch all records from IPFS and merge
        let combinedMedicineData = [];

        for (const hash of ipfsHashes) {
            if (!hash || hash.length < 46) {
                console.error("Invalid IPFS hash:", hash);
                continue;
            }

            try {
                const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);

                if (res.status !== 200) {
                    console.warn(`Failed to fetch from IPFS: ${res.statusText}`);
                    continue;
                }

                combinedMedicineData.push(res.data);
            } catch (fetchError) {
                console.error("Error fetching IPFS record:", fetchError);
            }
        }

        // ✅ Fetch the current owner
        const owner = await contract.getMedicineOwner(medicineId);
        console.log("Current Owner:", owner);

        // ✅ Fetch previous owners
        const previousOwners = await contract.getPreviousOwners(medicineId);
        console.log("Previous Owners:", previousOwners);

        return {
            medicineData: combinedMedicineData,
            currentOwner: owner,
            previousOwners: previousOwners
        };
    } catch (error) {
        console.error("Error fetching medicine data:", error);
        return null;
    }
};
