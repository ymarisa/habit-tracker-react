import React, { Component } from 'react';
import './BooleanCell.css';

class BooleanCell extends Component {
    render() {
        let classN = '';
        let backgroundStyle = '';
        if (this.props.score === 0) {
            classN = "incomplete";
        } else if (this.props.score < 0) {
            classN = "day-off";
            backgroundStyle = "var(--striped-background-" + this.props.index;
        } else {
            classN = "complete"
            backgroundStyle = "var(--habit-" + this.props.index;
        }
        return (
            <span style={{background: backgroundStyle}} className={classN}></span>
        );
    }
}
export default BooleanCell;