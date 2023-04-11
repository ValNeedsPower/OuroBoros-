import './ConnectWalletBtn.scss'
import React, {useState} from "react";
import classNames from "classnames";
import DropDownButton from "../../SvgIcon/DropDownButton";
import modalTypes from "../../../services/modals/modalTypes";
import {showModal} from "../../../services/modals";

interface IConnectWalletBtn {
    addr: string;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const ConnectWalletBtn: React.FC<IConnectWalletBtn> = ({addr, connectWallet, disconnectWallet}) => {
    const [showDropdown, setShowDropdown] = useState(false)

    const formatAddr = () => {
        const splitAddr = addr.split('')
        const firstPart = splitAddr.slice(0, 3).join('') //TODO slice to 5
        const secondPart = splitAddr.slice(38, splitAddr.length).join('')
        return firstPart + '...' + secondPart
    }

    const handleDisconnect = () =>{
        disconnectWallet()
        setShowDropdown(false)
    }
    const handleConnect = () =>{
        connectWallet()
        setShowDropdown(false)
    }

    return (
        <div className={classNames({
            'ui-wallet-connect': true,
            'ui-wallet-connect--connected': addr
        })}
             // onClick={() => setShowDropdown(!showDropdown)}
        >
            <div className={classNames({
                'ui-wallet-connect__wrapper': true,
                'ui-wallet-connect__wrapper--connected': addr
            })}
                 onClick={() => !addr && handleConnect() || showDropdown && setShowDropdown(false)}
            >
                <div className={'ui-wallet-connect__body'} onClick={() => setShowDropdown(true)}>
                    {addr ? <p>{formatAddr()}</p> : <p>Подключить кошелек</p>}
                    {addr ?
                        <div className={classNames({
                            'dropdown-button': true,
                            'dropdown-button--show': showDropdown
                        })}
                        >
                            <DropDownButton/>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>

            {showDropdown &&
                <div className={'ui-wallet-connect__dropdown'}>
                    <button onClick={() => showModal({type: modalTypes.PROFILE_POPUP, props: {}}) && setShowDropdown(false)}><p>Профиль</p>
                    </button>
                    <button onClick={handleDisconnect}><p>Отключить</p></button>
                </div>
            }
        </div>
    )
}

export default ConnectWalletBtn;