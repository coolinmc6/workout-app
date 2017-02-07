import React, { Component } from 'react';
import './App.css';
import {addWorkout, generateID, removeWorkout} from './lib/workoutHelpers';
import {loadWorkouts, createWorkout, destroyWorkout } from './lib/workoutService';
import {timeStamp} from './lib/utils';

class App extends Component {
  constructor() {
    super();
    this.state = {
      minutes: '',
      miles: '',
      currentID: generateID(),
      workouts: [],
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onMinutesChange = this.onMinutesChange.bind(this);
    // this.onMilesChange = this.onMilesChange.bind(this);
    this.handleEmptySubmit = this.handleEmptySubmit.bind(this);

    
  }

  componentDidMount(){    
    loadWorkouts()
    .then(workouts => this.setState({workouts : workouts}))
  }

  

  onFormSubmit(e){
    e.preventDefault()
    const nextID = this.state.currentID + 1;
    const timestamp = timeStamp();
    const newWorkout = {id: this.state.currentID, 
                        minutes: this.state.minutes, 
                        miles: this.state.miles, 
                        timestamp: timestamp}
    const updatedWorkouts = addWorkout(this.state.workouts, newWorkout);

    this.setState({
      minutes: '',
      miles: '',
      currentID: nextID,
      workouts: updatedWorkouts,
      errorMessage: ''
    })
    createWorkout(newWorkout)
      .then(() => this.showTempMessage('Workout added!  Great Job!'))
  }

  showTempMessage = (msg) => {
    this.setState({ message: msg})
    setTimeout(() => this.setState({message: ''}), 2500)
  }

  onMinutesChange(e){
    this.setState({
      minutes: e.target.value
    })
    
  }

  onMilesChange(term){
    this.setState({
      miles: term
    })
    // this.calculateMPH();
    

  }

  handleEmptySubmit(e) {
    e.preventDefault();
    this.setState({
      errorMessage: 'Please supply values for both the minutes and miles for your run.'
    })
  }

  handleRemove = (id, e) => {
    e.preventDefault();
    const updatedWorkouts = removeWorkout(this.state.workouts, id);
    this.setState({ workouts: updatedWorkouts})
    destroyWorkout(id)
      .then(() => this.showTempMessage('Workout Removed'))
  }
  
  render() {
    const submitHandler = (this.state.miles && this.state.minutes) ? this.onFormSubmit : this.handleEmptySubmit;
    return (
      <div className="container">
        <h1>Run Tracker</h1>
        <form onSubmit={submitHandler}>
          <label htmlFor="minutes">Minutes:</label>&nbsp;
          <input type="text" placeholder="minutes" value={this.state.minutes} onChange={this.onMinutesChange} />
          <br />
          <label htmlFor="miles">Miles:</label>&nbsp;
          <input type="text" placeholder="miles" value={this.state.miles} onChange={(e) => this.onMilesChange(e.target.value) }/>
          <br />
          <label htmlFor="mph">Miles Per Hour:</label>&nbsp;
          <input type="text" disabled value={(this.state.miles / (this.state.minutes / 60))} />&nbsp;&nbsp;&nbsp;
          <label htmlFor="minute-mile">Minutes per mile:</label>&nbsp;
          <input type="text" disabled value={this.state.minutes / this.state.miles} /><br />
          <button className="btn btn-primary" type="submit">Submit</button>

        </form>
        { this.state.errorMessage && <span className="error">{this.state.errorMessage}</span> }
        { this.state.message && <div className="success">{this.state.message}</div> }
        <div className="col-sm-6">
          <table className='table table-hover table-striped'>
            <tbody>
              <tr><th>Delete</th><th>ID</th><th>Minutes</th><th>Miles</th><th>Date/Time</th></tr>
              {this.state.workouts.map(workout => {
                return (
                  <tr key={workout.id}>
                    <td><a href="#" className="delete-workout" onClick={(e) => this.handleRemove(workout.id, e)}>X</a></td>
                    <td>{workout.id}</td>
                    <td>{workout.minutes}</td>
                    <td>{workout.miles}</td>
                    <td>{workout.timestamp}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
      </div>
    );
  }
}

export default App;

// ES5<td><a href="#" key={workout.id} onClick={this.handleRemove.bind(this, workout.id)}>X</a></td>
// ES6<td><a href="#" key={workout.id} onClick={(e) => this.handleRemove(workout.id, e)}>X</a></td> 
