import React, { Component } from 'react';
import './App.css';
import data from "./data.json";
import HabitLabelContainer from './components/HabitLabelContainer/HabitLabelContainer.js';
import DateHeader from './components/DateHeader/DateHeader.js';

// import HabitLabel from './components/HabitLabel/HabitLabel.js'

class App extends Component{
  state = {
    startDate: '2019-08-12',
    habitLabels: data.map((habit) => (
      habit["title"]
    )),
    dayNames: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    mainGridDayNum:7,
    dayNums: [],
  }

  showSummaryOld = (day, habitN) => {
    /*
        showSummary(int, int)
        day can be null if habit label is clicked (not a cell in the grid)
        habitN can be null if a day label is clicked
    */

    let habitSummaryNodes = document.querySelectorAll('.habit-summary');
    let daySummaryNodes = document.querySelectorAll('.day-summary');

    let dayToggle = false;
    let habitToggle = false;

    /*
        Turn off summary if the same thing is clicked twice.
        If cell already shows both summaries, turn them off.
        If clicking a label and there no summary on the other axis, it's the 2nd click so turn off.
        See truth tables in img/toggle_cell_truth_tables.jpg
     */
    if (day !== null && habitN !== null) {
        if (habitSummaryNodes[habitN].innerText !== "" && daySummaryNodes[day].innerText !== "") {
            // console.log("clicked same cell, turn off summaries")
            dayToggle = true;
            habitToggle = true;
        }
    } else if (day === null) {
        // node list to array, then check if one of the day summaries are on
        let newCellSameRow = Array.from(daySummaryNodes).some((item) => item.innerText !== "");
        if (!newCellSameRow && habitSummaryNodes[habitN].innerText !== "") {
            // console.log("clicked habit label with no day summaries on, turn off habit summary")
            habitToggle = true;
        }
    } else if (habitN === null) { // day label clicked
        // node list to array, then check if one of the habit summaries are on
        let newCellSameRow = Array.from(habitSummaryNodes).some((item) => item.innerText !== "");
        if (!newCellSameRow && daySummaryNodes[day].innerText !== "") {
            // console.log("clicked day label with no habit summaries on, turn off habit summary")
            dayToggle = true;
        }
    }

    // clear all results
    habitSummaryNodes.forEach((item) => item.innerText = "");
    daySummaryNodes.forEach((item) => item.innerText = "");

    // show results
    if (habitN !== null && !habitToggle) {
        habitSummaryNodes[habitN].innerText = "TEMP";
    }
    if (day !== null && !dayToggle) {
        daySummaryNodes[day].innerText = "TEMP";
    }
  }

  showSummary = (day, habitN) => {
    console.log(day, habitN);
  }

  updateDateRowState = (startDate, nDays) => {
    let day_part = parseInt(startDate.split("-")[2]);
    console.log(day_part);
    let days = this.state.dayNums;
    for (let i = day_part; i < day_part + nDays; i++) {
      let stringi = i.toString();
      // console.log(stringi)
      days.push(stringi);
    }
    // console.log(days);

    this.setState({
      dayNums: days,
    })
  }

  doFetch = () => {
    // console.log("doFetch");
    this.state.habitLabels.forEach( (label) => {
      console.log(label);
    })
  }

  componentDidMount = (ev) => {
    // console.log("componentDidMount");
    this.doFetch();
    document.body.style.background = "#37495D";
    this.updateDateRowState('2019-08-12', 7);

  }

  render() {
    return (
      <div className="App">
        <div className="grid-container">
          {/* row 1 */}
          <div className="grid-side-left"></div>

          <div className="title">
            <h1>Habit Tracker</h1>
          </div>

          <div className="grid-side-right"></div>

          {/* row 2 */}
          <HabitLabelContainer
            labels={this.state.habitLabels}
            habitClick={(day, habitN) => {this.showSummary(day, habitN)}}
          />

          <div className="content">
            <DateHeader
              dayNames={this.state.dayNames}
              dayNums={this.state.dayNums}
              dateClick={(day, habitN) => {this.showSummary(day, habitN)}}
            />

            <div className="habit-grid">
              
            </div>
          </div>

          <div className="habit-summary-container">
            <span className="spacer-label"></span>
            <span className="spacer-label padding-bottom"></span>
          </div>

          {/* row 3 */}
          <div className="picker-container">
            <div className="picker"></div>
            <div className="picker-label-container">
              <span className="picker-label"></span>
              <span className="picker-label"></span>
              <span className="picker-label"></span>
              <span className="picker-label"></span>
              <span className="picker-label"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
