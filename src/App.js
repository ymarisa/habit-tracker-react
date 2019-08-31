import React, { Component } from 'react';
import './App.css';
import data from "./data.json";
import HabitLabelContainer from './components/HabitLabelContainer/HabitLabelContainer.js';
import DateHeader from './components/DateHeader/DateHeader.js';
import HabitRow from './components/HabitRow/HabitRow.js';
import PickerCol from './components/PickerCol/PickerCol.js';

// choose one day's worth of scores (data is stored as array for each habit, so need to slice across)
let getSlice = (data, index) => {   //TODO: when date is in the data fetched remotely, pass date, then use .filter and dateInRange to either set val or set 0
  let slice = [];
  data.forEach((habit) => {
    slice.push(habit["score"][index]);
  })
  return slice;
}

// yields array of 7 score cols (1 col is all habits across one day) to make up a week, used by week picker
function* generateWeek(data, maxDays) {
  let end = maxDays
  let week = [];
  for (let i = 0; i < end; i++) {
    week.push(getSlice(data, i));
    if (i % 7 === 6) {
      yield week;
      week = [];
    }
  }
}

class App extends Component{
  state = {
    data: data,
    startDate: '2019-08-12',
    dayNames: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    dayNums: [], // for the date label, eg 12, 13, 14 
    mainGridDayNum: 7,
    habitLabels:[],
    maxDays: 0,
  }

  dateInRange = (start, index) => {
    // fn for use with .filter, returns true if date is within 7 days of start, false if not
    let startDate = new Date(start);
    
    let queryDate = new Date()
    queryDate.setDate(startDate.getUTCDate() + index);
    
    let endDate = new Date();
    endDate.setDate(startDate.getUTCDate() + (this.state.mainGridDayNum - 1));
    
    if (queryDate >= startDate && queryDate <= endDate) {
      return true;
    } else {
      return false;
    }
  }

  showSummary = (day, habitN) => {
    // onclick fn for showing day and habit summaries on the main grid
    // need to refactor old one from vanilla javascript project
    console.log(day, habitN);
  }

  updateDateRowState = (startDate, nDays) => {
    // fn for when the main grid is updated to show a different week
    let day_part = parseInt(startDate.split("-")[2]);
    console.log(day_part);
    let days = this.state.dayNums;
    for (let i = day_part; i < day_part + nDays; i++) {
      let stringi = '';
      if (i < 10) {
        stringi = '0' + i;
      } else {
        stringi = i.toString();
      }
      days.push(stringi);
    }

    this.setState({
      dayNums: days,
    })
  }

  doFetch = () => {
    // placeholder for when I need to fetch instead of load local file
    this.state.data.forEach( (habitData) => {
      console.log(habitData["title"]);
    })
  }

  componentDidMount = (ev) => {
    // console.log("componentDidMount");
    this.doFetch();
    document.body.style.background = "#37495D";
    
    // set state: dates
    this.updateDateRowState('2019-08-12', 7);
    
    // set state: labels from data
    if (this.state.habitLabels.length === 0) {
      this.setState({
        habitLabels: this.state.data.map((habit) => habit["title"])
      });
    }

    // longest number of records among habits
    let maxDays = this.state.data.map(x => x.score.length).reduce((a, b) => Math.max(a, b));
    this.setState({
      maxDays: maxDays
    })
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

          {/* Grid row 2 */}
          <HabitLabelContainer
            labels={this.state.habitLabels}
            showSummary={(day, habitN) => {this.showSummary(day, habitN)}}
          />

          <div className="content">
            
            <DateHeader
              dayNames={this.state.dayNames}
              dayNums={this.state.dayNums}
              showSummary={(day, habitN) => {this.showSummary(day, habitN)}}
            />

            <div className="habit-grid">
              {this.state.data
                .filter(row => this.state.habitLabels.indexOf(row["title"] >= 0 ))  // only habits where labels are showing
                .map((row, index) => (
                <HabitRow
                  index={index}                                                           // needed to determine color
                  type={row["type"]}                                                      // needed to determine boolean or number type
                  data={
                    row["score"]
                      .filter((element, index) => {
                        return this.dateInRange(this.state.startDate, index);
                      })
                      // .filter(this.dateInRange)                                           // only dates within the week range from start date
                      .map((score) => (
                        row["type"] !== "number" ? score : (score/row["dGoal"]) * 100     // number scores should be % of goal
                      ))
                  }
                />
                ))
              }
            </div>
          </div>

          <div className="habit-summary-container">
            <span className="spacer-label"></span>
            <span className="spacer-label padding-bottom"></span>
          </div>

          {/* Grid row 3 */}
          {/* create week picker */}
          <div className="picker-container"> 
            <div className="picker">
              {
                [...generateWeek(this.state.data, this.state.maxDays)].map((week) => (    // slice habit arrays into a week's worth of date cols 
                  <div className="picker-week">
                    {week.map((col) => (<PickerCol col={col}/>))}
                  </div>
                ))
              }
            </div>
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
