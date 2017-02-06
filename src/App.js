import React, { Component } from 'react';
import './App.css';
import {addWorkout, generateID, removeWorkout} from './lib/workoutHelpers';
import {loadWorkouts, createWorkout, destroyWorkout } from './lib/workoutService';

class App extends Component {
  constructor() {
    super();
    this.state = {
      minutes: '',
      miles: '',
      currentID: generateID(),
      workouts: []
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onMinutesChange = this.onMinutesChange.bind(this);
    // this.onMilesChange = this.onMilesChange.bind(this);
    
  }

  componentDidMount(){    
    loadWorkouts()
    .then(workouts => this.setState({workouts : workouts}))
  }

  onFormSubmit(e){
    e.preventDefault()
    const nextID = this.state.currentID + 1;
    const newWorkout = {id: this.state.currentID, minutes: this.state.minutes, miles: this.state.miles}
    const updatedWorkouts = addWorkout(this.state.workouts, newWorkout);
    this.setState({
      minutes: '',
      miles: '',
      currentID: nextID,
      workouts: updatedWorkouts
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
  }

  handleRemove = (id, e) => {
    e.preventDefault();
    const updatedWorkouts = removeWorkout(this.state.workouts, id);
    this.setState({ workouts: updatedWorkouts})
    destroyWorkout(id)
      .then(() => this.showTempMessage('Workout Removed'))
  }
  
  render() {
    return (
      <div className="container">
        <h1>Run Tracker</h1>
        <form onSubmit={this.onFormSubmit}>
          <label htmlFor="minutes">Minutes:</label>&nbsp;
          <input type="text" placeholder="minutes" value={this.state.minutes} onChange={this.onMinutesChange} />
          <br />
          <label htmlFor="miles">Miles:</label>&nbsp;
          <input type="text" placeholder="miles" value={this.state.miles} onChange={(e) => this.onMilesChange(e.target.value) }/>
          <br />
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
        { this.state.message && <div className="success">{this.state.message}</div> }
        <div className="col-sm-8">
          <table className='table'>
            <tbody>
              <tr><th>&nbsp;</th><th>ID</th><th>Minutes</th><th>Miles</th></tr>
              {this.state.workouts.map(workout => {
                return (
                  <tr key={workout.id}>
                    <td><a href="#" key={workout.id} onClick={(e) => this.handleRemove(workout.id, e)}>X</a></td>
                    <td>{workout.id}</td>
                    <td>{workout.minutes}</td>
                    <td>{workout.miles}</td>
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
