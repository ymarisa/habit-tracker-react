import React, { Component } from 'react';
import './App.css';
import HabitLabelContainer from './components/HabitLabelContainer/HabitLabelContainer.js';
import DateHeader from './components/DateHeader/DateHeader.js';
import HabitRow from './components/HabitRow/HabitRow.js';
import Picker from './components/Picker/Picker.js';

var moment = require('moment');
moment.defaultFormat = "YYYY-MM-DD"

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

  getDateRowState = (startDate, nDays) => {
    let startDateM = moment(startDate);
    let dayNums = [startDateM.format("DD")];
    for (let i = 1; i < nDays; i++) {
      dayNums.push(startDateM.add(1, 'days').format("DD"))
    }
    return dayNums;
  }

  changeStartDate = (startDate) => {
    let dayNums = this.getDateRowState(startDate, this.state.mainGridDayNum);
    this.setState({
      gridStartDate: startDate,
      dayNums: dayNums,
    });
  }

  doFetch = () => {
    // placeholder for when I need to fetch instead of load local file
    // fetch('/habits/')
    fetch('https://aqueous-gorge-41682.herokuapp.com/habits/')
      .then(response => {console.log(response); return response.json();})
      .then(data => {
        console.log('got data back', data);
        
        // get start date
        let sD = '2019-08-12'  // hard coded for now

        // set date array to show in header
        let dayNums = this.getDateRowState(sD, this.state.mainGridDayNum);

        // longest number of records among habits
        let maxDays = data.map(x => x.logs.length).reduce((a, b) => Math.max(a, b));

        let habitFilteredData = [];
        if (this.state.habitLabels.length > 0) {
          // change data to match labels
          habitFilteredData = data.filter(habit => this.state.habitLabels.indexOf(habit["title"] >= 0));
        } else {
          habitFilteredData = data;
        }
        this.setState({
          gridStartDate: sD,
          pickerStartDate: sD,
          data: data,
          dayNums: dayNums,
          maxDays: maxDays,
          habitLabels: data.map((habit) => habit["title"]),
          habitFilteredData: habitFilteredData,
          notLoaded: false,
        });

      })
  }

  componentDidMount = (ev) => {
    console.log("componentDidMount");
    this.doFetch();
    document.body.style.background = "#37495D";
  }

  printMe = (thing) => {
    console.log(thing);
    return thing;
  }

  render() {
    return (
      this.state.notLoaded ? <div style={{color: "white"}}>Loading</div> :
      <div className="App">
        <div className="grid-container">

          {/* Grid row 1 */}
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
                  data={row.logs
                      .filter((log) => this.dateInRange(this.state.gridStartDate, log.date))
                      .map((log) => log.score)}
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
          {
            <Picker
              data={this.state.data}
              pickerStartDate={this.state.pickerStartDate}
              maxDays={this.state.maxDays}
              changeStartDate={this.changeStartDate}
            />
          }
        </div>
      </div>
    );
  }
}

export default App;
