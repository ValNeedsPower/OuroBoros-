import './index.scss'
import React from "react";
import classNames from "classnames";

interface IHeroSection {
}

const HeroSection: React.FC<IHeroSection> = () => {
    const isMobile = window.innerWidth < 1366
    if (isMobile) {
        return (
            <div className={'landing-hero-mobile'}>
                <div className={'landing-hero-mobile__wrapper'}>
                    <h1>Инвестируй легко</h1>

                    <div className={'landing-hero-mobile__info'}>
                        <span>
                            <p>Средняя доходность 10% в месяц</p>
                            <p>Реферальная программа вознаграждений</p>
                            <p>Promotion-система, развитие комьюнити</p>
                        </span>
                        <h2>Создавай команду</h2>
                        <div className={classNames({
                            'ui-button': true,
                        })}>
                            <p>Присоединиться</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={'landing-hero'}>
            <div className={'landing-hero__wrapper'}>
                <div className={'landing-hero__left'}>
                    <h1>Инвестируй легко</h1>
                    <>
                        <p>Средняя доходность 10% в месяц</p>
                        <p>Реферальная программа вознаграждений</p>
                        <p>Promotion-система, развитие комьюнити</p>
                    </>
                    <h2>Создавай команду</h2>
                    <div className={classNames({
                        'ui-button': true,
                    })}>
                        <p className={'btn-center'}>Присоединиться</p>
                    </div>
                </div>
                <div className={'landing-hero__right'}>

                </div>
                {/*<div className={'landing-hero__support'}>*/}
                {/*    <p>Поддержка</p>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default HeroSection;