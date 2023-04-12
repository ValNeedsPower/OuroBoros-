import "./index.scss";
import React, { useState } from "react";
import classNames from "classnames";
import { ethers } from "ethers";

interface IBuyTokens {}

const BuyTokens: React.FC<IBuyTokens> = () => {
  const [amount, setAmount] = useState(""); // Using state to manage the amount of tokens to buy
  const [isApproved, setIsApproved] = useState(false); // Using state to manage whether the user has approved the purchase
  const copyTokenAddress = () => {
    navigator.clipboard.writeText("0xdFEE3b8261C3fC2cB226D7D2857F968b54553E99");
  };
  const [clicked, setClicked] = useState(false);

  const [buttonText, setButtonText] = useState("Approve");

  const handleClick = () => {
    setClicked(!clicked);
  };

  function handleButtonClick() {
    handleClick();
    copyTokenAddress();
  }

  const [txStatus, setTxStatus] = useState("");
  

  const buy = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0xFF18765da35E1E2b0e99ddA0b7cAaCb8ed26D07D",
        [
          {
            inputs: [
              {
                internalType: "address",
                name: "_ouroborosToken",
                type: "address",
              },
              { internalType: "address", name: "_usdtToken", type: "address" },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          { anonymous: false, inputs: [], name: "SalePaused", type: "event" },
          { anonymous: false, inputs: [], name: "SaleUnpaused", type: "event" },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "buyer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "TokensPurchased",
            type: "event",
          },
          {
            inputs: [
              { internalType: "uint256", name: "usdtAmount", type: "uint256" },
            ],
            name: "buyTokens",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "isSaleActive",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "ouroborosToken",
            outputs: [
              { internalType: "contract ERC20", name: "", type: "address" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "saleActive",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "totalUsdtRaised",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "newOwner", type: "address" },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "usdtToken",
            outputs: [
              { internalType: "contract ERC20", name: "", type: "address" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "withdrawTOKEN",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "withdrawUSDT",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        signer
      );
      const tx = await contract.buyTokens(ethers.utils.parseEther(amount));
      const response = await tx.wait();
      console.log("response: ", response);
      setTxStatus("Transaction successful");
    } catch (error) {
      console.error(error);
    }
  };

  // Defining a mock function to approve the purchase
  const approve = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x4F0bB89a79F06A4f7daF6a399d80ce2912f00910",
        [
          { inputs: [], stateMutability: "nonpayable", type: "constructor" },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
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
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            inputs: [
              { internalType: "address", name: "owner", type: "address" },
              { internalType: "address", name: "spender", type: "address" },
            ],
            name: "allowance",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "account", type: "address" },
            ],
            name: "balanceOf",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              {
                internalType: "uint256",
                name: "subtractedValue",
                type: "uint256",
              },
            ],
            name: "decreaseAllowance",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "addedValue", type: "uint256" },
            ],
            name: "increaseAllowance",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "name",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "totalSupply",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "transfer",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "from", type: "address" },
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "transferFrom",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        signer
      );
      const tx = await contract.approve("0xFF18765da35E1E2b0e99ddA0b7cAaCb8ed26D07D", ethers.utils.parseEther(amount));
      const response = await tx.wait();
      console.log("response: ", response);
      setButtonText("Approved");
      setIsApproved(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Defining a function to handle changes to the amount of tokens being bought
  const handleChangeAmount = (e: any) => {
    setAmount(e.target.value);
  };

  return (
    <div className={"landing-buyTokens"}>
      <div className={"buy-token"}>
        <div className={"buy-token__header"}>
          <div className={"buy-token__header-logo"}>
            <img src="./token_logo.svg" alt="token logo" />
          </div>
        </div>
        <div className={"buy-token__body"}>
          <p style={{ marginTop: window.innerWidth < 1300 ? "10px" : "0" }}>
            1 Ouroboros = 1 USDT
          </p>
          <div className={"buy-token__body-input"}>
            <div className={"deposit-input"}>
              <input
                style={{ width: "170px", height: "30px" }}
                type={"number"}
                placeholder={"enter the amount"}
                value={amount}
                onChange={(e) => handleChangeAmount(e)}
              />
            </div>
          </div>
          <div className={"container"}>
            <div
              className={`buy-button-v2 ${
                isApproved ? "buy-button-v2--succ" : "buy-button-v2"}`}
              onClick={approve}
            >
              <p>{buttonText}</p>
            </div>
            <div
              className={`buy-button-v2 ${
                isApproved ? "buy-button-v2" : "buy-button-v2"
              }`}
              onClick={buy}
            >
              <p> Buy Token </p> 
            </div>
            <div >
            {txStatus && <div style={{fontSize:'12px', paddingBottom:'10px', marginTop:'-10px'}} className={"status"}>{txStatus}</div>}
            </div>
            <button  className={`buy-button-v3 ${clicked ? "buy-button-v3--clicked" : ""}`}
                  onClick={handleButtonClick}>
                    {clicked ? "address copied" : "copy token address"}
                  </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTokens;
