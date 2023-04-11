import './index.scss'
import React, {useRef, useState} from "react";
import classNames from "classnames";
import TokenLogo from "../../../SvgIcon/TokenLogo";
import DropDownButton from "../../../SvgIcon/DropDownButton";
import {modal$, showModal} from "../../../../services/modals";
import modalTypes from "../../../../services/modals/modalTypes";
import {ethers} from "ethers";
import BigNumber from "bignumber.js";
import {formatEther} from "ethers/lib/utils";
import SetupDepositPopUp from "../SetupDepositPopUp";
import {useStore} from "effector-react";

export enum PoolType { MEDIUM, MEDIUM_AUTO_COMPOUND, TURBO, TURBO_AUTO_COMPOUND }

interface IStakingPools {
    wallet: any,
    stakes: any,
    poolsTvl: Array<BigNumber>,
    claimReward: (type: PoolType, index: number) => void
    refProp: any
    stake: (type: PoolType, amount: string, period: string) => void,
    title: string,
    compound: boolean,
    type: PoolType,
    imgUrl: string,
    balance: string,
}

interface ISType {
    title: string
    tvl: string
    hows: Array<string>
    compound: boolean
    imgUrl: string
}

const plateProps = [
    {
        title: 'SMART DIVIDEND MEDIUM',
        tvl: '$1,000,000',
        hows: ['Алгоритмичная торговля', 'Арбитраж криптовалют', 'Трейдинг на финансовых рынках'],
        compound: false,
        imgUrl: 'medium',
        type: PoolType.MEDIUM
    },
    {
        title: 'SMART DIVIDEND MEDIUM',
        tvl: '$1,000,000',
        compound: true,
        imgUrl: 'medium',
        type: PoolType.MEDIUM_AUTO_COMPOUND
    },
    {
        title: 'SMART DIVIDEND TURBO',
        tvl: '$1,000,000',
        compound: false,
        hows: ['Алгоритмичная торговля', 'Арбитраж криптовалют'],
        imgUrl: 'turbo',
        type: PoolType.TURBO
    },
    {
        title: 'SMART DIVIDEND TURBO',
        tvl: '$1,000,000',
        compound: true,
        imgUrl: 'turbo',
        type: PoolType.TURBO_AUTO_COMPOUND
    },
]
const depositProps = [
    {
        amount: 1000,
        date: 40,
        profit: 100,
    },
    {
        amount: 1000,
        date: 40,
        profit: 100,
    },
    {
        amount: 1000,
        date: 40,
        profit: 100,
    },
]

const StakingPools: React.FC<IStakingPools> = ({wallet, stakes, poolsTvl, claimReward, refProp, balance, stake}) => {
    const modal = useStore(modal$)
    const isMobile = window.innerWidth < 1366
    const [isChecked, setIsChecked] = useState(false);
    const popUpRef = useRef<any>(null)

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    const typePlate = (props: ISType, index: number) => {
        const handleMore = () => {
            showModal({type: modalTypes.SETUP_DEPOSIT, props: {...props}})
            scrollToPopUp()
        }
        return (
            <div className={'staking-type'}>
                <div className={classNames({
                    'bg': true,
                    'bg--side': props.imgUrl === 'turbo'
                })}
                     style={{
                         backgroundImage: `url(./images/staking/${props.imgUrl}.png)`
                     }}
                />
                <div className={'staking-type__wrapper'}>
                    <div className={'staking-type__about'}>
                        <h1>{props.title}</h1>
                        {props.compound && !isMobile && <h2>compound</h2>}
                        <p>TVL: <span>${Number(formatEther(poolsTvl[index].toString())).toFixed(0)}</span></p>
                    </div>
                    <div className={'staking-type__info'}>
                        {!props.compound && !isMobile && props.hows.map((i: string, index) => (
                            <p key={index}>{i}</p>
                        ))}
                    </div>
                    <div className={'staking-type__more'}>
                        <div className={classNames({
                            'ui-button-v2': true,
                            'ui-button-v2--small': true,
                            'ui-button-v2--cap': true,
                        })}
                             onClick={handleMore}
                        >
                            <p>Подробнее</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const tableRow = (props: any, index: number, disabledButton: any) => {
        const timestampStart = Number(formatEther(props[1])) * 1e18 * 1000
        const durationTimestamp = Number(formatEther(props[2])) * 1e18 * 1000;


        const date = new Date(timestampStart + durationTimestamp);
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;

        return (
            <div className={classNames({
                'table-row': true,
                'table-row--bordered': index % 2 !== 0 && depositProps.length !== 2,
                'table-row--br': index + 1 === 1 && depositProps.length === 2,
            })}>
                <div className={'table-row__amount'}>
                    <p>{ethers.utils.formatEther(props[0]).split('.')[0]}</p>
                    <TokenLogo/>
                </div>
                <div className={'table-row__date container'}>
                    <p> <b> прошло дней: </b> {daysSinceTimestamp(timestampStart)}  </p> 
                    <p>{<span>(инвестиция до {`${day}.${month}`})</span>}</p>
                </div>
                <div className={'table-row__profit'}>
                    <p>{Number(formatEther(props[7])).toFixed(0)}</p>
                    <div style={{width: '25px', display: 'flex', marginLeft: '8px'}}> 
                    <TokenLogo/>
                    </div>
                </div>
                <div className={'table-row__btn'}>
                    <div className={classNames({
                        'ui-button-v2': true,
                        'ui-button-v2--small': true,
                        'ui-button-v2--disabled': disabledButton
                    })}
                         onClick={() => !disabledButton && Date.now() < timestampStart + durationTimestamp && claimReward(props[6], props[5])}
                    >
                        <p>Забрать награды</p>
                    </div>
                </div>
            </div>
        )
    }

    const [showDropdown, setShowDropdown] = useState(false)
    const [state, setState] = useState({
        current: 'normal',
        next: 'compound',
    })

    const updateState = () => {
        if (state.current === 'normal') setState(prevState => ({...prevState, current: 'compound', next: 'normal'}))
        if (state.current === 'compound') setState(prevState => ({...prevState, next: 'compound', current: 'normal'}))
        setShowDropdown(!showDropdown)
    }

    const daysSinceTimestamp = (timestamp: number) => {
        const startDate = new Date(timestamp);
        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    const filterCondition = stakes.filter((item: any) => {
        if (!isChecked) {
            if (state.current === 'normal') {
                return item[6] === PoolType.MEDIUM
            } else if (state.current === 'compound') {
                return item[6] === PoolType.MEDIUM_AUTO_COMPOUND
            }
        } else {
            if (state.current === 'normal') {
                return item[6] === PoolType.TURBO
            } else if (state.current === 'compound') {
                return item[6] === PoolType.TURBO_AUTO_COMPOUND
            }
        }
    })

    const scrollToPopUp = () => {
        if (popUpRef && popUpRef.current) {
            console.log('scroll')
            popUpRef.current.scrollTo({behavior: "smooth", block: "nearest"});
        }
    }

    return (
        <div className={'landing-staking'} ref={refProp}>
            {modal.type === modalTypes.SETUP_DEPOSIT &&
                <SetupDepositPopUp propRef={popUpRef} wallet={wallet} stake={stake} balance={balance}
                                   poolsTvl={poolsTvl} {...modal.props}/>
            }
            <div className={'landing-staking__container'}>
                <div className={'landing-staking__type'}>
                    {poolsTvl.length > 0 && plateProps.map((i: any, index) => (
                        <div className={'landing-staking__type-wrapper'} key={index}>
                            {typePlate(i, index)}
                        </div>
                    ))}
                </div>
                {stakes.length > 0 && <div className={'landing-staking__deposits'}>
                    <div style={{marginTop: '100px'}} className={'landing-staking__deposits-filters'}>
                        <div className={classNames({
                            'switch-box': true,
                            'switch-box--checked': true,
                        })}>
                            <p className={!isChecked ? 'selected' : ''}>Medium</p>
                            <label className="switch">
                                <input type="checkbox" checked={isChecked} onChange={handleToggle}/>
                                <div className="slider round"/>
                            </label>
                            <p className={isChecked ? 'selected' : ''}>Turbo</p>
                        </div>

                        <div className={classNames({
                            'ui-selector': true,
                            'ui-selector--compound': state.current === 'compound',
                        })}>
                            <div className={'ui-selector__wrapper'} onClick={() => setShowDropdown(!showDropdown)}>
                                <p>{state.current}</p>
                                <div className={'ui-selector__btn'}>
                                    <DropDownButton/>
                                </div>
                            </div>
                            {showDropdown &&
                                <div className={'ui-selector__dropdown'} onClick={updateState}>
                                    <div className={'ui-selector__wrapper'}>
                                        <p>{state.next}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={'landing-staking__deposits-header'}>
                        <div><p>Депозит</p></div>
                        <div><p>Срок</p></div>
                        <div><p>Доход</p></div>
                    </div>
                    <div className={'landing-staking__deposits-table'}>
                        {stakes && filterCondition.map((i: any, index: any) => {
                            const disabledButton = i[6] === PoolType.TURBO_AUTO_COMPOUND || i[6] === PoolType.MEDIUM_AUTO_COMPOUND

                            return (<div className={'landing-staking__deposits-table-wrapper'} key={index}>
                                {tableRow(i, index, disabledButton)}
                            </div>)
                        })}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default StakingPools;