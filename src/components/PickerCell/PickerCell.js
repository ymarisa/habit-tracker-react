import React, { Component } from 'react';
import './PickerCell.css';

class PickerCell extends Component {
    render() {
        let score = this.props.score;
        let style = {}
        if (score < 0) {
            style.background = "var(--habit-" + this.props.index + ")";
            style.opacity = "0.4";
            style.border = "1px solid var(--habit-" + this.props.index + ")";
        } else if (score === 0) {
            style.background = "var(--my-white)";
            style.border = "1px solid var(--my-white)";
        } else {
            style.background = "var(--habit-" + this.props.index + ")";
            style.border = "1px solid var(--habit-" + this.props.index + ")";
        }
        return (
            <div style={style} className="PickerCell" onClick={() => this.props.picker(this.props.weekStartDate)}></div>
        )
    }
}
export default PickerCell;