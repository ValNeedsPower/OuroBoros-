import "./index.scss";
import React, { useState } from "react";

import Menu from "../../../SvgIcon/Menu";
import ConnectWalletBtn from "../../../UI/ConnectWalletBtn";
import classNames from "classnames";
import X from "../../../SvgIcon/X";

interface IHeader {}

const Header: React.FC<IHeader> = () => {
  const isMobile = window.innerWidth < 1366;
  const [addr, setAddr] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const styles = {
    img: {
      width: "120px",
      // other styles for before screen size 1300
    },
  };

  const disconnectWallet = () => {
    setAddr("");
    setShowMenu(false);
  };

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      window.open(`https://metamask.app.link/dapp/${window.location.host}`);
      return;
    }
    if (!ethereum.isConnected()) {
      return;
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddr(accounts[0]);
      sessionStorage.setItem("currentAccount", accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  if (isMobile) {
    return (
      <div
        className={classNames({
          "landing-header": true,
          "landing-header--open": showMenu,
        })}
      >
        <div className={"landing-header__wrapper"}>
          <div className={"landing-header__logo"}>
            <img
              style={styles.img}
              className="my-svg-img"
              src="./logo_main.svg"
              alt="logotype"
            />
          </div>
          <div className={"landing-header__btn"}>
            <ConnectWalletBtn
              addr={addr}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={"landing-header"}>
      <div className={"landing-header"}>
        <div className={"landing-header__wrapper"}>
          <div className={"landing-header__logo"}>
            <img src="./logo_main.svg" alt="logotype" />
          </div>
          <div className={"landing-header__buttons"}>
            <ConnectWalletBtn
              addr={addr}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
