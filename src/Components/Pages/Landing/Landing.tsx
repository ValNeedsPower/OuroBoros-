import './Landing.scss'
import React, {useEffect, useRef, useState} from "react";
import {useStore} from "effector-react";

import {MetamaskWallet} from "../../../services/wallet/metamask-wallet";
import Header from "./Header";
import ProfilePopUp from "./ProfilePopUp";
import BuyTokens from "./BuyTokens";
import StakingPools from "./StakingPools";
import {ethers} from "ethers";
import modalTypes from "../../../services/modals/modalTypes";
import {modal$} from "../../../services/modals";
import {PoolType} from "./StakingPools/StakingPools";
import classNames from "classnames";


interface ILanding {

}

const Landing: React.FC<ILanding> = () => {
    const modal = useStore(modal$)
    const isMobile = window.innerWidth < 1366
    const [walletIsLoading, setWalletIsLoading] = useState(false)
    const [wallet, setWallet] = useState<any>(null)
    const [addr, setAddr] = useState<any>('')
    const [refCode, setRefCode] = useState('')
    const [tokenBalance, setTokenBalance] = useState('')
    const [stakes, setStakes] = useState<any>([])
    const [teamInfo, setTeamInfo] = useState([])
    const [poolsInfo, setPoolsInfo] = useState<any>([])
    const [refReward, serRefReward] = useState('')

    const [mcBalance, setMCBalance] = useState('')  // balance ms

    const poolRef = useRef(null)

    const initBcData = async () => {
        const wallet = await new MetamaskWallet()
        wallet && setWallet(wallet)


        setWalletIsLoading(true)
    }

    useEffect(() => {
        initBcData()
    }, [])

    // useEffect(() => {
    //     wallet?.on('MSmartPurchased', (amount: string) => {
    //         const total = Number(formatEther(amount)) + Number(tokenBalance)
    //         console.log(total)
    //         setTokenBalance(total.toString())
    //     })
    // }, [wallet, tokenBalance])


    const connectWallet = async () => {
        try {
            await wallet.connect()
            const addr = await wallet.getAddr()
            addr && setAddr(addr)
            const balanceTokens = await wallet.getTokenBalance()
            const _msBalance = await wallet.getMSTokenBalance();
            setTokenBalance((ethers.utils.formatEther(balanceTokens)))            
            setMCBalance(ethers.utils.formatEther(_msBalance));
            const stakes = await wallet.getStakes()
            setStakes(stakes)
            const team = await wallet.getTeamInfo()
            setTeamInfo(team)
            const referralRew = await wallet.getReferralRewards()
            referralRew && serRefReward(ethers.utils.formatEther(referralRew))

            

            // console.log({
            //     addr: addr, wallet: wallet,
            //     mcTokens: ethers.utils.formatEther(balanceTokens),
            //     stakes: stakes, team: team, pools: pools,
            //     refRew: referralRew
            // })
        } catch (e: any) {
            console.log(e)
            switch (e.code === 4200) {
                case isMobile:
                    window.open('https://metamask.app.link/dapp/172.20.10.7:3000/payments/')
                    break

                case !isMobile:
                    window.open('https://metamask.io/')
                    break
            }

        }
    }

    const disconnectWallet = async () => {
        try {
            wallet.disconnect()
            setWallet(null)
            setAddr('')
            setRefCode('')
            setTokenBalance('')
            setStakes([])
            setTeamInfo([])
        } catch (e) {
            console.error(e)
        }
    }

    const buyMc = async (amount: string) => {
        try {
            await wallet.buyToken(amount)
        } catch (e) {
            console.error(e)
        }
    }

    const scrollToPools = () => {
        if (poolRef && poolRef.current) {
            // poolRef.current.scrollIntoView({behavior: "smooth", block: "nearest"});
        }
    }

    const generateRefCode = async () => {
        try {
            const refCode = await wallet.generateRefCode(addr)
            setRefCode(refCode)
        } catch (e) {
            console.error(e)
        }
    }

    const stake = async (type: PoolType, amount: string, period: string) => {
        try {
            await wallet.stakeTokens(type, amount, period)
        } catch (e) {
            console.error(e)
        }
    }

    const claimReward = async (type: PoolType, index: number) => {
        try {
            await wallet.claimRewards(type, index)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className={classNames({
            'landing': true,
            // 'landing--loading': !walletIsLoading,
        })}>
            <Header scrollToPools={scrollToPools} addr={addr} connectWallet={connectWallet}
                    disconnectWallet={disconnectWallet}/>
            <div className={'landing-body'}>
                {modal.type === modalTypes.PROFILE_POPUP &&
                    <ProfilePopUp referralRewards={refReward} balance={mcBalance} team={teamInfo}
                                  generateRefCode={generateRefCode} refCode={refCode}/>
                }
                <BuyTokens balance={tokenBalance} wallet={wallet} buyMc={buyMc}/>
               <div style={{display: 'none'}}>  <StakingPools refProp={poolRef} wallet={wallet} claimReward={claimReward} stakes={stakes} stake={stake}
                              balance={mcBalance} poolsTvl={poolsInfo} {...modal.props}/> </div>
            </div>
            <div className={'landing__support'} />
        </div>
    )
}

export default Landing;

