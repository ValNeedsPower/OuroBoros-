import './index.scss'
import React, {useState} from "react";
import classNames from "classnames";
import InfoTooltip from "../../../UI/InfoTooltip";
import { ethers } from 'ethers';


// Defining the props for the component
interface IBuyTokens {
    buyMc: (amount: string) => void; // A function to buy tokens 
    wallet: any,                                    // An object containing information about the user's wallet
    balance: string                                 // A string representing the user's balance
}

// Defining the BuyTokens component
const BuyTokens: React.FC<IBuyTokens> = ({buyMc, wallet, balance}) => {
    const isMobile = window.innerWidth < 1366       // Storing whether the user is on a mobile device
    const [amount, setAmount] = useState('')        // Using state to manage the amount of tokens to buy
    const [allowance, setAllowance] = useState('')  // Using state to manage the allowance for buying tokens

    const [isApproved, setIsApproved] = useState(false); // Using state to manage whether the user has approved the purchase

    // Defining a function to check if the "buy" button should be disabled
    const disabledButton = () => {
        return Number(amount) > Number(balance) || !isApproved;
    }

    // Defining a function to buy tokens with the buyMc function passed as a prop
    // const buy = () => {
    //     buyMc(amount)
    // }

    const buy = async () => {
        console.log("buy");
        try {
            const provider = new ethers.providers.Web3Provider(wallet._provider);
            const signer = provider.getSigner();
            const contract = new ethers.Contract("0xFF18765da35E1E2b0e99ddA0b7cAaCb8ed26D07D", [{"inputs":[{"internalType":"address","name":"_ouroborosToken","type":"address"},{"internalType":"address","name":"_usdtToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"SalePaused","type":"event"},{"anonymous":false,"inputs":[],"name":"SaleUnpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"inputs":[{"internalType":"uint256","name":"usdtAmount","type":"uint256"}],"name":"buyTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isSaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ouroborosToken","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalUsdtRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtToken","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawTOKEN","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawUSDT","outputs":[],"stateMutability":"nonpayable","type":"function"}], signer);
            const tx = await  contract.buyTokens(ethers.utils.parseEther(amount))
            const response = await tx.wait();
            console.log("response: ", response);
        } catch (error) {
            console.error(error);
        }

    }
    
    // Defining a mock function to approve the purchase
    const approveMock = async () => {
        await wallet.approveToken(amount);
        setAllowance(amount);
        setIsApproved(true);
    }

    // Defining a function to set the allowance for buying tokens
    const setA = async () => {
        try {
            const _allowance = await wallet.getAllowance();
            setAllowance(_allowance);
        } catch (e) {
            console.error(e)
        }
    }

    // Defining a function to check if the user has enough allowance to buy tokens
    const checkAllowance = () => {
        const a = Number(allowance) >= Number(amount);
        return a && isApproved;
    }

    // Defining a function to handle changes to the amount of tokens being bought
    const handleChangeAmount = (e: any) => {
        setAmount(e.target.value);
        setA();
    }

    return (
        <div className={'landing-buyTokens'}>
            <div className={'buy-token'}>
                <div className={'buy-token__header'}>
                    <div className={'buy-token__header-logo'}>
                        <img src="./token_logo.svg" alt="token logo"/>
                    </div>
                </div>
                <div className={'buy-token__body'}>
                    <p style={{ marginTop: window.innerWidth < 1300 ? '10px' : '0' }}>1 Ouroboros = 1 USDT</p>
                    <div className={'buy-token__body-input'}>
                        <div className={'deposit-popup__deposit-input'}>
                            <input style={{width: '170px', height: '30px'}}
                                type={'number'}
                                placeholder={'Введите Сумму'}
                                value={amount}
                                onChange={(e) => handleChangeAmount(e)}
                            />
                        </div>
                    </div>
                    <div className={'container'}> 
                        <div className={classNames({
                            'buy-button-v2': true,
                        })}
                        onClick={() => approveMock()}
                        >
                            <p>Одобрить</p>
                        </div>
                            <div  className={`buy-button-v2 ${isApproved ? '' : 'buy-button-v2--inactive'}`}
                            onClick={() => (!disabledButton() && checkAllowance() && wallet) && buy()}>
                            <p> Купить </p>
                            </div>
                    </div>
                  
                </div>
            </div>
        </div>
    )
}

export default BuyTokens;