import React, { Component } from 'react';
import './HabitRow.css';
import BooleanCell from '../BooleanCell/BooleanCell.js'
import NumberCell from '../NumberCell/NumberCell.js'

class HabitRow extends Component {
    render() {
        return (
            <div className='habit-row'>
                {this.props.data.map((score) =>
                    (this.props.type === "number") ? 
                    <NumberCell score={score} index={this.props.index}/> : 
                    <BooleanCell score={score} index={this.props.index}/>)
                }
            </div>
        );
    }
}

export default HabitRow;