import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      minutes: '',
      miles: ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onMinutesChange = this.onMinutesChange.bind(this);
    // this.onMilesChange = this.onMilesChange.bind(this);
  }

  onFormSubmit(e){
    e.preventDefault()
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
  
  render() {
    return (
      <div>
        <h1>Run Tracker</h1>
        <form onSubmit={this.onFormSubmit}>
          <input type="text" placeholder="minutes" value={this.state.minutes} onChange={this.onMinutesChange} />
          <input type="text" placeholder="miles" value={this.state.miles} onChange={(e) => this.onMilesChange(e.target.value) }/>
          <button type="submit">Submit</button>
        </form>
        
      </div>
    );
  }
}

export default App;

