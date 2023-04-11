import './InfoTooltip.scss'
import React, {useState} from "react";
import TooltipIcon from "../../SvgIcon/TooltipIcon";

interface IInfoTooltip {
    text: string,
    children?: React.ReactNode
}

const InfoTooltip: React.FC<IInfoTooltip> = ({text, children}) => {
    const [showDropdown, setShowDropdown] = useState(false)
    return (
        <div className={'ui-tooltip'}>
            <div className={'ui-tooltip__icon'}
                 onMouseEnter={() => setShowDropdown(!showDropdown)}
                 onMouseLeave={() => setShowDropdown(!showDropdown)}
            >
                <TooltipIcon/>
            </div>
            {children}
            {showDropdown && <div className={'ui-tooltip__dropdown'}>
                <p>{text}</p>
            </div>}
        </div>
    )
}

export default InfoTooltip;