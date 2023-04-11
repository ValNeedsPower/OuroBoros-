import './index.scss'
import React from "react";
import CloseBtn from "../../../SvgIcon/CloseBtn";
import classNames from "classnames";
import CopyIcon from "../../../SvgIcon/CopyIcon";
import InfoTooltip from "../../../UI/InfoTooltip";
import {showModal} from "../../../../services/modals";
import TokenLogo from '../../../SvgIcon/TokenLogo/TokenLogo';

interface IProfilePopUp {
    generateRefCode: () => void;
    refCode: string;
    team: Array<bigint>

    referralRewards: string

    balance: string
}

const ProfilePopUp: React.FC<IProfilePopUp> = ({generateRefCode, refCode, team, referralRewards, balance}) => {
    const isMobile = window.innerWidth < 1366
    const handleCopy = () => {
        navigator.clipboard.writeText(refCode);
    }

    if (isMobile) {
        return (
            <div className={'profile-popup-mobile'}>
                <div className={'profile-popup-mobile__container'}>
                    <div className={'profile-popup__closeBtn'} onClick={() => showModal({type: '', props: {}})}>
                        <CloseBtn/>
                    </div>
                    <div className={'profile-menu'}>
                        <div className={'profile-menu__topPick'}/>
                        <div className={'profile-menu__wrapper'}>
                            <div className={'profile-menu__info'}>
                                <div className={'profile-menu__info-deposit'}>
                                    <p>Депозит</p>
                                    <h1>MUSDT {(Number(balance) - Number(referralRewards)).toFixed(0)}</h1>
                                </div>

                                <div className={'profile-menu__info-br'}/>

                                <div className={'profile-menu__info-subinfo'}>
                                    <div className={'profile-menu__info-subinfo-team'}>
                                        <p>Команда</p>
                                        <span>{`${team[0]}`}</span>
                                    </div>
                                    <div className={'profile-menu__info-subinfo-turnover'}>
                                        <InfoTooltip
                                            text={'Сумма депозита тех, кто был привлечен по реферальной программе'}>
                                            <p>Оборот команды</p>
                                        </InfoTooltip>
                                        <span>{`$ ${team[1]}`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={'profile-menu__referral'}>

                                <div className={classNames({
                                    'ui-button-v2': true,
                                    'ui-button-v2--big': true,
                                })}
                                     onClick={generateRefCode}
                                >
                                    <p>Реферальная ссылка</p>
                                </div>
                                <InfoTooltip text={'Реферальная ссылка для создания команды '}>
                                    <div className={'profile-menu__referral-input'}>
                                        <input value={refCode} placeholder={'00000000'} readOnly/>
                                        <CopyIcon onClick={handleCopy}/>
                                    </div>
                                </InfoTooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={'profile-popup'}>
            <div className={'profile-popup__container'}>
                <div className={'profile-popup__closeBtn'} onClick={() => showModal({type: '', props: {}})}>
                    <CloseBtn/>
                </div>
                <div className={'profile-popup__menu'}>
                    <div className={'profile-menu'}>
                        <div className={'profile-menu__topPick'}/>
                        <div className={'profile-menu__wrapper'}>
                            <div className={'profile-menu__info'}>
                                <div className={'profile-menu__info-deposit'}>
                                    <p>Депозит</p>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}> 
                                    <p style={{width: '20px', height: '20px', marginRight: '10px'}}> <TokenLogo/> </p>
                                    <h1>  {(Number(balance) - Number(referralRewards)).toFixed(0)}</h1>
                                    </div>
                                </div>

                                <div className={'profile-menu__info-br'}/>

                                <div className={'profile-menu__info-subinfo'}>
                                    <div className={'profile-menu__info-subinfo-team'}>
                                        <p>Команда</p>
                                        <span>{`${team[0]}`}</span>
                                    </div>
                                    <div className={'profile-menu__info-subinfo-turnover'}>
                                        <InfoTooltip
                                            text={'Сумма депозита тех, кто был привлечен по реферальной программе'}>
                                            <p>Оборот команды</p>
                                        </InfoTooltip>
                                        <span>{` ${team[1]}`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={'profile-menu__referral'}>

                                <div className={classNames({
                                    'ui-button-v2': true,
                                    'ui-button-v2--big': true,
                                })}
                                     onClick={generateRefCode}
                                >
                                    <p>Реферальная ссылка</p>
                                </div>
                                <InfoTooltip text={'Реферальная ссылка для создания команды '}>
                                    <div className={'profile-menu__referral-input'}>
                                        <input placeholder={'00000000'} value={refCode} readOnly/>
                                        <CopyIcon onClick={handleCopy}/>
                                    </div>
                                </InfoTooltip>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'profile-popup__topImg'}/>
                <div className={'profile-popup__bottomImg'}/>
                <div className={'profile-popup__br'}/>
            </div>
        </div>
    )
}

export default ProfilePopUp;