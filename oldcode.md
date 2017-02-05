```javascript
// App.js
import React, { Component } from 'react';
// import RunForm from './components/runForm';
import './App.css';

class App extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     pastRuns: [],
  //     minutes: '',
  //     miles: ''
  //   }

  //   this.handleInputChange = this.handleMinutes.bind(this);
  // }

  // handleInputChange(e){
  //   this.setState({minutes: e.target.value})
  // }
  render() {
    return (
      <div>
        <h1>Run Tracker</h1>
        {/*<RunForm minutes={this.state.minutes} handleMinutes={e => this.handleInputChange(e)}/>*/}
      </div>
    );
  }
}

export default App;
```

```javascript
// components/RunForm.js
import React, { Component } from 'react';

class RunForm extends Component {
	constructor(props){
		super(props);

		this.state = { minutes: ''}
	}

	render() {
		return (
			<div>
				{/*<input type="text" placeholder="minutes" value={this.props.minutes}/>
				<input type="text" placeholder="miles"/> */}
				<button>Submit</button>
			</div>
		);
	}
}

export default RunForm;
```