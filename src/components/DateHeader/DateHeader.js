import React, { Component } from 'react';
import './DateHeader.css';

class DateHeader extends Component {
    render() {
        return (
            <div>
                <div className="header-row" id="dayHeader">
                    {
                        this.props.dayNames.map((name, index) => (
                            <span key={name} onClick={() =>this.props.showSummary(null, index)}>{name}</span>
                        ))
                    }
                </div>
                <div className="header-row padding-bottom" id="dateHeader">
                    {
                        this.props.dayNums.map((num, index) => (
                            <span key={index} onClick={() =>this.props.showSummary(index, null)}>{num}</span>
                        ))
                    }
                </div>
            </div>
        );
    }
}
export default DateHeader;