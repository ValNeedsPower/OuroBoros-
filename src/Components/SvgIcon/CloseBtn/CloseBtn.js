import React from 'react';
import IconModal from "../../UI/IconModal";

const CloseBtn = props => (
    <IconModal viewBox="0 0 32 32" {...props}>
        <circle cx="16" cy="16" r="16" fill="#D545A3"/>
        <path d="M9 22.4351L22.435 9.00003" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M9 9.43506L22.435 22.8701" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    </IconModal>
);

export default CloseBtn;
