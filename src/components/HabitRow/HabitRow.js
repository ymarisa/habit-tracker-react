import React, { Component } from 'react';
import './HabitRow.css';
import BooleanCell from '../BooleanCell/BooleanCell.js'
import NumberCell from '../NumberCell/NumberCell.js'

class HabitRow extends Component {
    render() {
        return (
            <div className='habit-row'>
                {this.props.data.map((score, index) =>
                    (this.props.type === "IntegerField") ? 
                    <NumberCell key={index} score={score} goal={this.props.goal} index={this.props.index}/> : 
                    <BooleanCell key={index} score={score} index={this.props.index}/>)
                }
            </div>
        );
    }
}

export default HabitRow;
