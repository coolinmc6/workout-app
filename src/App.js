import React, { Component } from 'react';
import './App.css';
import {addWorkout, generateID, removeWorkout} from './lib/workoutHelpers';
import {loadWorkouts, createWorkout, destroyWorkout } from './lib/workoutService';
import {timeStamp} from './lib/utils';
import WorkoutForm from './components/WorkoutForm';
import StatusForm from './components/StatusForm';

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
        <h1>Workout Tracker</h1>
        <div className="col-sm-7 logger">
          <h2>Log a Workout</h2>
          <WorkoutForm  miles={this.state.miles}
                        minutes={this.state.minutes}
                        milesHandler={(e) => this.onMilesChange(e.target.value)}
                        minutesHandler={this.onMinutesChange}
                        submitHandler={submitHandler}/>

          { this.state.errorMessage && <span className="error">{this.state.errorMessage}</span> }
          { this.state.message && <div className="success">{this.state.message}</div> }
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

        <div className="col-sm-5 status">
          <h2>Workout Status</h2>
          <StatusForm />



        </div>
        
      </div> 

    );
  }
}

export default App;

// ES5<td><a href="#" key={workout.id} onClick={this.handleRemove.bind(this, workout.id)}>X</a></td>
// ES6<td><a href="#" key={workout.id} onClick={(e) => this.handleRemove(workout.id, e)}>X</a></td> 
