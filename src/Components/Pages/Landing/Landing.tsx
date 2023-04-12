import './Landing.scss'
import React, {useEffect, useRef, useState} from "react";
import {useStore} from "effector-react";


import Header from "./Header";
import ProfilePopUp from "./ProfilePopUp";
import BuyTokens from "./BuyTokens";
import StakingPools from "./StakingPools";
import {ethers} from "ethers";
import modalTypes from "../../../services/modals/modalTypes";
import {modal$} from "../../../services/modals";
import classNames from "classnames";


interface ILanding {

}

const Landing: React.FC<ILanding> = () => {
    const modal = useStore(modal$)
    const isMobile = window.innerWidth < 1366
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

  



    const connectWallet = async () => {
        try {
            await wallet.connect()
            const addr = await wallet.getAddr()
            addr && setAddr(addr)
            const balanceTokens = await wallet.getTokenBalance()
            const _msBalance = await wallet.getMSTokenBalance();
            setTokenBalance((ethers.utils.formatEther(balanceTokens)))            
            setMCBalance(ethers.utils.formatEther(_msBalance));

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

    
    return (
        <div className={classNames({
            'landing': true,
            // 'landing--loading': !walletIsLoading,
        })}>
            <Header />
            <div className={'landing-body'}>
                <BuyTokens/>
            </div>
            <div style={{paddingTop: '150px'}} className={'landing__support'}>
            </div>
        </div>
    )
}

export default Landing;

