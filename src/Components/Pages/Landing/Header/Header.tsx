import './index.scss'
import React, {useState} from "react";

import Menu from "../../../SvgIcon/Menu";
import ConnectWalletBtn from "../../../UI/ConnectWalletBtn";
import classNames from "classnames";
import X from "../../../SvgIcon/X";

interface IHeader {
    addr: string;
    connectWallet: () => void;
    disconnectWallet: () => void;
    scrollToPools: () => void
}

const Header: React.FC<IHeader> = ({addr, connectWallet, disconnectWallet, scrollToPools}) => {
    const isMobile = window.innerWidth < 1366
    const [showMenu, setShowMenu] = useState(false)

    const styles = {
        img: {
          width: "120px",
          // other styles for before screen size 1300
        },
      };

    const handleDisconnect = () => {
        disconnectWallet()
        setShowMenu(false)
    }

    if (isMobile) {
        return (
            <div className={classNames({
                'landing-header': true,
                'landing-header--open': showMenu,
            })}>
                <div className={'landing-header__wrapper'}>
                    <div className={'landing-header__logo'}>
                      <img style={styles.img} className="my-svg-img" src="./logo_main.svg" alt="logotype" />
                    </div>
                    <div className={'landing-header__btn'}>
                        <ConnectWalletBtn addr={addr} connectWallet={connectWallet}
                                          disconnectWallet={handleDisconnect}/>
                    </div>
                   {/** <div className={'landing-header__menu'} onClick={() => setShowMenu(!showMenu)}>
                        {!showMenu ? <Menu/> : <X/>}
                    </div> */}
                </div>

               {/** {showMenu && <p onClick={() => scrollToPools()}>Инструменты</p>}*/} 
            </div>
        )
    }

    return (
        <div className={'landing-header'}>
            <div className={'landing-header'}>
                <div className={'landing-header__wrapper'}>
                    <div className={'landing-header__logo'}>
                    <img src="./logo_main.svg" alt="logotype" />
                    </div>
                    <div className={'landing-header__buttons'}>
                        {/*<p onClick={() => scrollToPools()}>Инструменты</p>*/}
                        <ConnectWalletBtn
                            addr={addr}
                            connectWallet={connectWallet}
                            disconnectWallet={disconnectWallet}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;