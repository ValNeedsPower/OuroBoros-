import './index.scss'
import React, {useState} from "react";
import CloseBtn from "../../../SvgIcon/CloseBtn";
import InfoTooltip from "../../../UI/InfoTooltip";
import classNames from "classnames";
import {showModal} from "../../../../services/modals";
import {PoolType} from "../StakingPools/StakingPools";
import {formatEther} from "ethers/lib/utils";

interface ISetupDepositPopUp {
    wallet: any, 
    stake: (type: PoolType, amount: string, period: string) => void,
    title: string,
    compound: boolean,
    type: PoolType,
    imgUrl: string,
    balance: string,
    poolsTvl: Array<bigint>
    propRef: any
}

const SetupDepositPopUp: React.FC<ISetupDepositPopUp> = (props) => {
    const [rangeStepSmall, setRangeStepSmall] = useState('1')
    const [rangeStep, setRangeStep] = useState('1')
    const [period, setPeriod] = useState('60')
    const [amount, setAmount] = useState('')
    const [allowance, setAllowance] = useState('')

    const [isApproved, setIsApproved] = useState(false);


    // Define a function to disable the stake button based on the amount and approval
    const disabled = (props.type === PoolType.TURBO || props.type === PoolType.TURBO_AUTO_COMPOUND
            ? (Number(amount) < 10000 || Number(amount) > 30000)
            : (Number(amount) < 100 || Number(amount) > 10000))
        || Number(amount) > Number(props.balance) || !isApproved;

    // Define a function for the small range slider to choose the deposit period
    const rangeSmall = () => {
        // Define a function to handle changes to the range slider
        const handleChangeRange = (value: string) => {
            switch (value) {
                case '1':
                    setPeriod('60')
                    break

                case '2':
                    setPeriod('120')
                    break

                case '3':
                    setPeriod('150')
                    break
            }
            setRangeStepSmall(value)
        }
        return (
            <div className={'ui-range-small'}>
                {rangeStepSmall !== '1' && <div className={'ui-range-small__marker1'}/>}
                <div className={'ui-range-small__marker2'}/>
                {rangeStepSmall !== '3' && <div className={'ui-range-small__marker3'}/>}
                <div className="ui-range-small__labels">
                    <p style={{
                        color: rangeStepSmall !== '1' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>8%</p>
                    <p style={{
                        color: rangeStepSmall !== '2' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>10%</p>
                    <p style={{
                        color: rangeStepSmall !== '3' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>12%</p>
                </div>
                <input type={'range'} step={1} min={1} max={3} value={rangeStepSmall}
                       onChange={(e) => handleChangeRange(e.target.value)}/>
                <div className="ui-range-small__labels">
                    <p style={{
                        color: rangeStepSmall !== '1' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>60</p>
                    <p style={{
                        color: rangeStepSmall !== '2' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>120</p>
                    <p style={{
                        color: rangeStepSmall !== '3' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>150</p>
                </div>
            </div>
        )
    }

    const range = () => {
        const handleChangeRange = (value: string) => {
            switch (value) {
                case '1':
                    setPeriod('60')
                    break

                case '2':
                    setPeriod('90')
                    break

                case '3':
                    setPeriod('150')
                    break

                case '4':
                    setPeriod('240')
                    break
            }
            setRangeStep(value)
        }
        return (
            <div className={'ui-range'}>
                {rangeStep !== '1' && <div className={'ui-range__marker1'}/>}
                <div className={'ui-range__marker2'}/>
                <div className={'ui-range__marker3'}/>
                {rangeStep !== '4' && <div className={'ui-range__marker4'}/>}

                <div className="ui-range__labels">
                    <p style={{
                        color: rangeStep !== '1' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>12%</p>
                    <p style={{
                        color: rangeStep !== '2' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>15%</p>
                    <p style={{
                        color: rangeStep !== '3' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>20%</p>
                    <p style={{
                        color: rangeStep !== '4' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>20%</p>
                </div>
                <input type={'range'} step={1} min={1} max={4} value={rangeStep}
                       onChange={(e) => handleChangeRange(e.target.value)}/>
                <div className="ui-range__labels">
                    <p style={{
                        color: rangeStep !== '1' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>60</p>
                    <p style={{
                        color: rangeStep !== '2' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>90</p>
                    <p style={{
                        color: rangeStep !== '3' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>150</p>
                    <p style={{
                        color: rangeStep !== '4' ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'
                    }}>240</p>
                </div>
            </div>
        )
    }

    const handleClose = () => {
        showModal({type: '', props: {}})
    }

    const checkAllowance = () => {
        const a = Number(allowance) >= Number(amount);
        return a && isApproved; 
    }

    const stakeMS = async() => {
        await props.wallet.stakeTokens(props.type, amount, period);
    } 

    const setA = async () => {
        try {
            const _allowance = await props.wallet.getMSAllowance();
            setAllowance(_allowance);
        } catch (e) {
            console.error(e)
        }
    }

    const approveMS = async() => {
        await props.wallet.approveMSToken(amount);
        setIsApproved(true);
    }

    

    const handleChangeAmount = (e: any) => {
        setAmount(e.target.value);
        setA();
    }

    const handleMax = (type: PoolType, amount: string) => {
        if (props.type === PoolType.TURBO || props.type === PoolType.TURBO_AUTO_COMPOUND) {
            if (Number(amount) < 10000 || Number(amount) > 30000) {
                setAmount(Math.min(Math.max(Number(amount), 10000), 30000).toFixed(0).toString());
            }
        } else {
            if (Number(amount) < 100 || Number(amount) > 10000) {
                setAmount(Math.min(Math.max(Number(amount), 100), 10000).toFixed(0).toString());
            }
        }
        setAmount(Number(amount).toFixed(0).toString());
    }

    const minMaxPlaceholder = props.type === PoolType.TURBO || props.type === PoolType.TURBO_AUTO_COMPOUND ? 'мин. 10 000 макс. 30 000' : 'мин. 100 макс. 10 000'
    const tooltip = props.type === PoolType.MEDIUM_AUTO_COMPOUND || props.type === PoolType.TURBO_AUTO_COMPOUND ? 'Сбор наград возможен только по истечении срока инвестиции' : 'Сбор наград возможен в любое время'
    return (
        <div className={'deposit-popup'} ref={props.propRef}>
            <div className={'deposit-popup__container'}>
                <div className={'deposit-popup__closeBtn'} onClick={handleClose}><CloseBtn/>
                </div>
                <div className={'deposit-popup__wrapper'}>
                    <div className={'deposit-popup__info'}>
                        <InfoTooltip text={tooltip}>
                            <h1>{props.title}</h1>
                        </InfoTooltip>
                        {props.compound && <h2>compound</h2>}
                        <p>TVL: <span>${Number(formatEther(props.poolsTvl[props.type])).toFixed(0)}</span></p>
                    </div>
                    <div className={'deposit-popup__deposit'}>
                        <h1>Депозит </h1>
                        <div className={'deposit-popup__deposit-input'}>
                            <input type={'number'} placeholder={minMaxPlaceholder} value={amount}
                                   onChange={e => handleChangeAmount(e)}/>
                        </div>
                        <div className={'deposit-popup__deposit-balance'}>
                            <p>balance:<span>{Number(props.balance).toFixed(0) || 0}</span></p>
                            <button onClick={() => handleMax(props.type, props.balance)}><p>max</p></button>
                        </div>
                    </div>
                    <div className={'deposit-popup__income'}>
                        <h1>Доход </h1>
                        <h2> <span>(дней)</span> Срок</h2>
                        <div className={'deposit-popup__income-range'}>
                            {(props.type === PoolType.TURBO_AUTO_COMPOUND || props.type === PoolType.TURBO) && range()}
                            {(props.type === PoolType.MEDIUM || props.type === PoolType.MEDIUM_AUTO_COMPOUND) && rangeSmall()}
                        </div>
                    </div>
                    {/*  <div className={'deposit-popup__referral'}>
                        <InfoTooltip text={''}>
                            <p>Реферальный код</p>
                        </InfoTooltip>
                        <div className={'deposit-popup__referral-input'}>
                            <input placeholder={'00000000'} />
                        </div>
                    </div>*/}
                    <div className={'container2'}> 
                        <div className={'deposit-popup__btn'}>
                            <div className={classNames({
                                'buy-button-v3': true
                            })}
                                onClick={() => approveMS()}
                            >
                                <p>Одобрить</p>
                            </div>
                        </div>
                        
                        <div className={'deposit-popup__btn'}>
                            <div className={`buy-button-v3 ${isApproved ? '' : 'buy-button-v3--inactive'}`}
                                onClick={() => !disabled && checkAllowance() && stakeMS()}>
                                <p>Инвестировать</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetupDepositPopUp;