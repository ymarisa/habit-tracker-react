import React, { Component } from 'react';
import './Picker.css';
import PickerCol from '../PickerCol/PickerCol'

var moment = require('moment');
moment.defaultFormat = "YYYY-MM-DD"

let addNDays = (dateString, n) => {
  // dateString.split("-");
  return(moment(dateString).add(n, 'days').format());
}

// choose one day's worth of scores (data is stored as array for each habit, so need to slice across)
// consider turning this into a generator
let getSlice = (data, date) => {   //TODO: when date is in the data fetched remotely, pass date, then use .filter and dateInRange to either set val or set 0
  let slice = [];
  // console.log(date);
  data.forEach((habit) => {
    // console.log(habit);
    let habitScore = 0;
    for (let log of habit.logs) {
      if (log.date === date) {
        habitScore = log.score;
        break;
      }
    }
    slice.push(habitScore);
  })
  return slice;
}

// yields array of 7 score cols (1 col is all habits across one day) to make up a week, used by week picker
function* generateWeeks(data, startDate, maxDays) {
  let end = maxDays
  let week = [];
  for (let i = 0; i < end; i++) {
    let iDate = addNDays(startDate, i);
    week.push(getSlice(data, iDate));
    if (i % 7 === 6) {
      yield week;
      week = [];
    }
  }
}

class Picker extends Component {
    render() {
        return (
            <div className="Picker"> 
                <div className="Picker-allScores">
                {
                    [...generateWeeks(this.props.data, this.props.pickerStartDate, this.props.maxDays)].map((week, wIndex) => (    // slice habit arrays into a week's worth of date cols 
                    <div key={wIndex} className="Picker-week">
                        {week.map((col, cIndex) => (
                        <PickerCol key={cIndex} col={col} wIndex={wIndex} pickerStartDate={this.props.pickerStartDate} picker={this.props.changeStartDate}/>
                        ))}
                    </div>
                    ))
                }
                </div>
                <div className="Picker-labelContainer">
                <span className="Picker-label"></span>
                <span className="Picker-label"></span>
                <span className="Picker-label"></span>
                <span className="Picker-label"></span>
                <span className="Picker-label"></span>
                </div>
            </div>
        );
    }
}

export default Picker;