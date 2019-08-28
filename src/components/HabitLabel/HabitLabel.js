import React, { Component } from 'react';
import './HabitLabel.css';

class HabitLabel extends Component {
    render() {
        return (
            <span>{this.props.label}</span>
        );
    }
}
export default HabitLabel;