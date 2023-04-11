import React from 'react';
import IconModal from "../../UI/IconModal";

const TooltipIcon = props => (
    <IconModal viewBox="0 0 14 14" {...props}>
        <circle cx="7" cy="7" r="6.5" stroke="white" strokeOpacity="0.6"/>
        <path d="M7 6.5V10.5" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="4" r="1" fill="white" fillOpacity="0.6"/>
    </IconModal>
);

export default TooltipIcon;
