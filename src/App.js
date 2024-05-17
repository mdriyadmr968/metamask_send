import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import web3 from "web3";

function App() {
  let NXC_Address = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; //token contract address
  let receiptAccount = "0xBAD403bB667a6b79650CF14aAe44a42130A3Bd92"; //receive account address
  let accountId = "0xff0E4d9b903F11F305F3B840C7d64D09C8F62891"; //senders account address
  let sendAmount = 0.1;

  let NXC_Token_ABI = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_spender",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_from",
          type: "address",
        },
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
        {
          name: "_spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      payable: true,
      stateMutability: "payable",
      type: "fallback",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
  ];
  const getWeb3 = () => {
    if (window.ethereum) {
      let provider = new ethers.BrowserProvider(window.ethereum);
      return provider;
    } else {
      return false;
    }
  };

  const provider = getWeb3();

  const [isMetaMaskInstall, setIsMetaMaskInstall] = useState();
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(true);
  // const [accountId, setAccountId] = useState();
  const [networkVersion, setNetworkVersion] = useState();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const setAccountDetails = async () => {
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
      setIsMetaMaskConnected(false);
    } else {
      setIsMetaMaskConnected(true);
      // setAccountId(accounts[0]);
    }
  };
  // subscription for account change detection
  const accountChangeDetection = async () => {
    window.ethereum.on("accountsChanged", async function () {
      setIsDataLoading(true);
      await setAccountDetails().finally(() => setIsDataLoading(false));
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        await provider.send("eth_requestAccounts", []);
        setIsMetaMaskInstall(true);
        // first time set current network version Id.
        const { chainId } = await provider.getNetwork();
        setNetworkVersion(chainId);
        // first time call for load initial details
        await setAccountDetails();
        // subscription for account change detection
        await accountChangeDetection();
      } catch (e) {
        setIsMetaMaskInstall(false);
        setIsDataLoading(false);
        setIsMetaMaskConnected(false);
        const eMessage = e.message.split("{")[0] || "";
        console.log(eMessage);
      }
    };
    init().then((r) => setIsDataLoading(false));
  }, []);

  useEffect(() => {
    // Define the async function within useEffect
    const networkVersionChangeDetection = async () => {
      window.ethereum.on("chainChanged", function (networkId) {
        setNetworkVersion(Number(networkId));
      });
    };

    // Call the async function
    networkVersionChangeDetection();

    // Ensure proper cleanup to avoid memory leaks
    return () => {
      // Remove the listener if it's needed; replace with the appropriate cleanup code
      // window.ethereum.removeListener("chainChanged", networkVersionChangeDetection);
    };
  }, [networkVersion]);

  const nxcETHTransaction = async () => {
    //Calling the metamask plugin
    const Web3 = new web3(window.ethereum);

    //convert the integer into Ether standard
    // const ethValue = ethers.utils.toWei(sendAmount.toString(), "ether");

    // let eth = ethers.parseEther(sendAmount.toString());
    // const ethValue = ethers.formatEther(eth);

    const ethValue = ethers.parseUnits(sendAmount.toString(), 6);

    // const ethValueBigInt = 1n * 10n ** 6;
    //   const ethValue = Number(ethValueBigInt);

    //Intialize the contract
    var nxcTokenContract = new Web3.eth.Contract(NXC_Token_ABI, NXC_Address, {
      from: accountId,
    });
    console.log("nxcTokenContract", nxcTokenContract);
    console.log("accountId", accountId);
    // Call the contract method transfer to send token to recipient id
    nxcTokenContract.methods
      .transfer(receiptAccount, ethValue)
      .send({ from: accountId })
      .then((res) => {
        console.log(res);
      });

    // nxcTokenContract.methods.transfer(receiptAccount, ethValue);
  };

  return (
    <div className="App">
      <button onClick={nxcETHTransaction}>send erc20 token</button>
    </div>
  );
}

export default App;
