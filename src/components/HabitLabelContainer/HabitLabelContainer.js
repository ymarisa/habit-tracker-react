import React, { Component } from 'react';
import './HabitLabelContainer.css';

class HabitLabelContainer extends Component {
    render() {
        return (
            <div className="labels">
            <span className="spacer-label"></span>
            <span className="spacer-label padding-bottom"></span>
            {
              this.props.labels.map((habitLabel, index) => (
                <span key={habitLabel} className="habit-labels" onClick={() => this.props.showSummary(null, index)}>{habitLabel}</span>
              ))
            }
          </div>
        );
    }
}
export default HabitLabelContainer;