import React from 'react';
import IconModal from "../../UI/IconModal";

const TokenLogo = props => (
    <IconModal viewBox="0 0 70 70" {...props}>
        <circle cx="35" cy="35" r="35" fill="#FF439D"/>
        <path d="M14 17.5H17.9C18.4523 17.5 18.9 17.9477 18.9 18.5V51.8H14V17.5Z" fill="white"/>
        <path d="M51.1 18.5C51.1 17.9477 51.5477 17.5 52.1 17.5H56V51.8H51.1V18.5Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd"
              d="M22.4176 47.2676L51.8176 17.8676L55.2824 21.3324L25.8824 50.7324L22.4176 47.2676Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd"
              d="M18.5324 17.8676L47.9324 47.2676L44.4676 50.7324L15.0676 21.3324L18.5324 17.8676Z" fill="white"/>
    </IconModal>
);

export default TokenLogo;
