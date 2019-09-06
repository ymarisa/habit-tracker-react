import React, { Component } from 'react';
import './NumberCell.css';

class NumberCell extends Component {
    render() {
        // console.log(this.props.score, this.props.goal);
        let score = (this.props.score/this.props.goal) * 100;
        console.log(score);
        let backgroundStyle = score >= 0 ? "var(--habit-" + this.props.index : "var(--striped-background-" + this.props.index;

        const incompleteStyle = {
            background: backgroundStyle,
            height: Math.floor(score) + "%",
        }
        return (
            (score === 100) ? 
                <span style={{background: backgroundStyle}} className={"complete"}></span> 
                :
                <span className="incomplete">
                    <span style={incompleteStyle} className="complete partial"></span>
                </span>
        
            
        );
    }
}
export default NumberCell;