import React, { Component } from 'react';
import './App.css';
import HabitLabelContainer from './components/HabitLabelContainer/HabitLabelContainer.js';
import DateHeader from './components/DateHeader/DateHeader.js';
import HabitRow from './components/HabitRow/HabitRow.js';
import PickerCol from './components/PickerCol/PickerCol.js';

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
    for (let log of habit["logs"]) {
      if (log["date"] === date) {
        habitScore = log["score"];
        // console.log(log);
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

class App extends Component{
  state = {
    data: [],
    habitFilteredData: [],
    pickerStartDate: '2019-08-12',
    gridStartDate: '2019-08-12',
    dayNames: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    dayNums: [], // for the date label, eg 12, 13, 14 
    mainGridDayNum: 7,
    habitLabels:[],
    maxDays: 0,
    notLoaded: true,
  }

  dateInRange = (startDate, queryDate) => {
    let startDateM = moment(startDate);
    let queryDateM = moment(queryDate);
    let endDateM = moment(startDate).add(6, 'days');
    return queryDateM.isSameOrAfter(startDateM) && queryDateM.isSameOrBefore(endDateM);
  }

  showSummary = (day, habitN) => {
    // onclick fn for showing day and habit summaries on the main grid
    // need to refactor old one from vanilla javascript project
    console.log(day, habitN);
  }

  updateDateRowState = (startDate) => {
    let startDateM = moment(startDate);
    let dayNums = [];
    for (let i = 0; i < this.state.mainGridDayNum; i++) {
      dayNums.push(startDateM.add(i, 'days').format("DD"))
    }
    this.setState({dayNums: dayNums});
  }

  updateDateRowState2 = (startDate, nDays) => {
    // fn for when the main grid is updated to show a different week
    let day_part = parseInt(startDate.split("-")[2]);
    console.log(day_part);
    let days = this.state.dayNums;
    for (let i = day_part; i < day_part + nDays; i++) {
      let stringi = '';
      if (i < 10) {
        stringi = '0' + i; // left pad 0 if lt 10
      } else {
        stringi = i.toString();
      }
      days.push(stringi);
    }

    this.setState({
      dayNums: days,
    })
  }

  changeStartDate = (startDate) => this.setState({startDate: startDate});

  doFetch = () => {
    // placeholder for when I need to fetch instead of load local file
    // fetch('/habits')
    fetch('/habits/')
      .then(response => response.json())
      .then(data => {
        console.log('got data back', data);
        
        // get start date
        let sD = '2019-08-12'  // hard coded for now

        // set date array to show in header
        this.updateDateRowState(sD);

        this.setState({data: data});

        // set state: labels from data
        this.setState({
          habitLabels: this.state.data.map((habit) => habit["title"])
        });

        let habitFilteredData = [];
        if (this.state.habitLabels.length > 0) {
          // change data to match labels
          habitFilteredData = data.filter(habit => this.state.habitLabels.indexOf(habit["title"] >= 0));
        } else {
          habitFilteredData = data;
        }
        this.setState({habitFilteredData: habitFilteredData});

        // longest number of records among habits
        let maxDays = this.state.data.map(x => x.logs.length).reduce((a, b) => Math.max(a, b));
        this.setState({ maxDays: maxDays });

        this.setState({ notLoaded: false});
      })
  }

  componentDidMount = (ev) => {
    console.log("componentDidMount");
    this.doFetch();
    document.body.style.background = "#37495D";

    // addNDays("2019-08-12");
  }

  render() {
    return (
      this.state.notLoaded ? <div style={{color: "white"}}>Loading</div> :
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

            {/* create main week grid */}
            <div className="habit-grid">
              {this.state.habitFilteredData                                         // create a HabitRow for each displayed habit
                .map((row, index) => (
                <HabitRow
                  key={index}
                  index={index}                                                     // needed to determine color
                  type={row.display_type}                                           // needed to determine boolean or number type
                  goal={row.daily_goal}
                  data={
                    row.logs
                      .filter((log) => this.dateInRange(this.state.gridStartDate, log.date))
                      .map((log) => log.score)
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
                [...generateWeeks(this.state.data, this.state.pickerStartDate, this.state.maxDays)].map((week, index) => (    // slice habit arrays into a week's worth of date cols 
                  <div key={index} className="picker-week">
                    {week.map((col, index) => (<PickerCol key={index} col={col}/>))}
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
