import React, { Component } from 'react';
import './PickerCol.css';
import PickerCell from '../PickerCell/PickerCell.js';

class PickerCol extends Component {
    render() {
        // console.log(this.props.col);
        return (
            <div className="picker-col">
                {this.props.col.map((cellScore, index) => (
                    <PickerCell 
                        score={cellScore} 
                        index={index}
                        key={index}
                    />
                ))}
            </div>
        )
    }
}

export default PickerCol;