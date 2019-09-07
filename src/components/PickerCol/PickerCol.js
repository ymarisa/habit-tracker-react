import React, { Component } from 'react';
import './PickerCol.css';
import PickerCell from '../PickerCell/PickerCell.js';

var moment = require('moment');
moment.defaultFormat = "YYYY-MM-DD"

class PickerCol extends Component {
    render() {
        console.log(this.props.wIndex, moment(this.props.pickerStartDate).add(this.props.wIndex, "week").format());
        let weekStartDate = moment(this.props.pickerStartDate).add(this.props.wIndex, "week").format();
        return (
            <div className="picker-col">
                {this.props.col.map((cellScore, index) => (
                    <PickerCell 
                        score={cellScore} 
                        index={index}
                        key={index}
                        picker={this.props.picker}
                        weekStartDate={weekStartDate}
                    />
                ))}
            </div>
        )
    }
}

export default PickerCol;