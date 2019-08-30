import React, { Component } from 'react';
import './NumberCell.css';

class NumberCell extends Component {
    render() {
        let backgroundStyle = this.props.score >= 0 ? "var(--habit-" + this.props.index : "var(--striped-background-" + this.props.index;
        const incompleteStyle = {
            background: backgroundStyle,
            height: Math.floor(this.props.score) + "%",
        }
        return (
            (this.props.score === 100) ? 
                <span style={{background: backgroundStyle}} className={"complete"}></span> 
                :
                <span className="incomplete">
                    <span style={incompleteStyle} className="complete partial"></span>
                </span>
        
            
        );
    }
}
export default NumberCell;