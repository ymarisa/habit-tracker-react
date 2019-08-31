import React, { Component } from 'react';
import './App.css';
import data from "./data.json";
import HabitLabelContainer from './components/HabitLabelContainer/HabitLabelContainer.js';
import DateHeader from './components/DateHeader/DateHeader.js';
import HabitRow from './components/HabitRow/HabitRow.js';
import PickerCol from './components/PickerCol/PickerCol.js';

// import HabitLabel from './components/HabitLabel/HabitLabel.js'

let getSlice = (data, index) => {   //when date is in the data, pass date, then use .filter and dateInRange to either set val or set 0
  let slice = [];
  data.forEach((habit) => {
    slice.push(habit["score"][index]);
  })
  return slice;
}

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

function* weirdoGenerator(){
  yield 1;
  yield 2;
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
    // console.log("index: ", index);
    let startDate = new Date(start);
    
    let queryDate = new Date()
    queryDate.setDate(startDate.getUTCDate() + index);
    
    let endDate = new Date();
    endDate.setDate(startDate.getUTCDate() + (this.state.mainGridDayNum - 1));
    
    // console.log(startDate.toISOString());
    // console.log(queryDate.toISOString());
    // console.log(endDate.toISOString());
    
    if (queryDate >= startDate && queryDate <= endDate) {
      // console.log(true);
      return true;
    } else {
      // console.log(false);
      return false;
    }
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
      let stringi = '';
      if (i < 10) {
        stringi = '0' + i;
      } else {
        stringi = i.toString();
      }
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

    // this.dateInRange("2020-08-19", 0);
    // this.state.data.map((habit, index) => habit["score"].filter)

    // test code for getting week data
    // let foo = this.state.data.map((habit, index) => [habit["type"], habit["score"].filter(this.dateInRange)])
    // let foo = this.state.data.map((e, i) => console.log(e));
    
    // console.log("foo", foo(0));
    console.log(this.state.maxDays, maxDays);

   
    for( let o of weirdoGenerator()) {
      console.log(o);
    }

    // for (let week of generateWeek(this.state.data, maxDays)) {
    //   console.log("fooweek: ", week);
    // }

    // generateWeek(this.state.data, maxDays).forEach((week) => {console.log(week)})

    [...generateWeek(this.state.data, maxDays)].forEach((week) => console.log(week));

  //   let weekGenerator = generateWeek(this.state.data, maxDays);
  //   let done = false;
  //   while (!done) {
  //     let week = weekGenerator.next()
  //     console.log(week.value);
  //     done = week.done;
  //   }
  //   console.log("generator: ", weekGenerator.return());
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
            // labels={this.state.abels}
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

          {/* row 3 */}
          <div className="picker-container">
            <div className="picker">
              {
                [...generateWeek(this.state.data, this.state.maxDays)].map((week) => (
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
