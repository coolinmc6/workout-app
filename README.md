# README

**Objective:** Create a basic run tracker that collects miles run and time completed.  The
app will save those stats plus a timestamp and an MPH.  The following is a step-by-step
discussion in how I built the app along with questions I have and where I struggled.

## 1: Set-up & Basic Elements
- After getting rid of the boilerplate code from the `create-react-app` starter, I added
the basic elements that I will need to just submit a workout.

```javascript
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      minutes: '',
      miles: ''
    }
  }
  
  render() {
    return (
      <div>
        <h1>Run Tracker</h1>
        <form>
          <input type="text" name="minutes" />
          <input type="text" name="miles" />
          <button type="submit">Submit</button>
        </form>
        
      </div>
    );
  }
}

export default App;
```
- Here are the issues I have right now:
  - Submit button needs to have preventDefault()
  - State needs to grab minutes
  - State needs to grab miles
  - When submitted, minutes and miles must go into an array of workouts in state

## 2: preventDefault() for Submit Button
- Here's the solution and then I'll discuss:
```javascript
// code
	  this.onFormSubmit = this.onFormSubmit.bind(this);
	} // end of constructor

	onFormSubmit(e){
    	e.preventDefault()
  	}
  
  	render() {
	    return (
	      <div>
	        <h1>Run Tracker</h1>
	        <form onSubmit={this.onFormSubmit}>
// more code
```

- To solve this problem, I need to prevent the default behavior of the submit button which
is part of the form element.  
  - Point #1 is that the event handler is on the `<form>` element, not the submit button.
  - Point #2 is the method itself.  onFormSubmit takes one argument, the event, and then I need
  to just add `.preventDefault()`.
  - Point #3 I need to bind it in the constructor to use it.

## 3: Save Minutes to State
- Unlike jQuery, when I click 'submit' I won't be going to 'grab' the minutes, I should already 
"have" them.  That means that with each keyboard touch, my state must be updated.
- This is what I think I need to do:
  - define a function that updates state.minutes onChange
  - bind it in the constructor
  - have it be a 'controlled' element by setting its value to what the user enters
- I initially struggled completing this because I keep mixing up what looks like two ways to do
the same thing.  I am still fuzzy on why do one over the other so right now, I'm thinking I 
should just pick my favorite and get good at that.  Here's how I solved this:

```javascript
// in the constructor method, near the bottom:
this.onMinutesChange = this.onMinutesChange.bind(this)
// code
onMinutesChange(e){
  this.setState({
    minutes: e.target.value
  })
}

render() {
  return (
    <div>
      <h1>Run Tracker</h1>
      <form onSubmit={this.onFormSubmit}>
        <input type="text" placeholder="minutes" value={this.state.minutes} onChange={this.onMinutesChange} />
// code
```
- Understanding the `onChange` was difficult at first because I've seen it a number of ways.  Here is where
I got confused:
  - the onChange in the input element doesn't explicitly pass an argument, it simply calls `this.onMinutesChange`
  YET the method itself takes an argument, `e`.  I have seen this done another way which I should do for the
  miles input
- Step #1: Writing the onMinutesChange(e) method affects how you call the onChange handler, or vice
versa, so I wrote both at the same time using other projects I've done.  The basics are that whenever the 
minutes input changes, it calls `this.onMinutesChange`.  The `onMinutesChange` function takes an argument, `e`, 
and it sets the minutes property of state to equal `e.target.value` which is just what the user inputted.
- Step #2: I added `this.onMinutesChange = this.onMinutesChange.bind(this)` to the constructor.  I still don't know 
what this does 'officially'...I think it has something to do with setting the proper context for use of the word
'this'...I'll have to look it up later.
- Step #3: I set the value of the input to equal `this.state.minutes`.  This makes it a 'controlled' element.  
To double check that it works properly, use your React developer tools and you can see that the state is changing
for my 'minutes' property.

## 4: Save Miles to State
- So unlike the last one, I'm going to try to the other way that I've seen this done.  This step, however, should
largely be the same: bind function, write onMilesChange function, add onChange handler, make it a 'controlled'
element.
- Here is my solution:
```javascript
// code
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
// code
```
- NOTICE how I didn't bind the onMilesChange function...so I didn't need 
`this.onMilesChange = this.onMilesChange.bind(this)` in the constructor and I get no errors BUT I do get an error
when I don't bind my onMinutesChange() function.
  - the error: Uncaught TypeError: Cannot read property 'setState' of undefined
  - For whatever reason, I don't need to for this other version...let's look at the onChange handlers:
  ```javascript
	onChange={this.onMinutesChange}
	onChange={(e) => this.onMilesChange(e.target.value) }
  ```
  - Minutes => I am simply calling `this.onMinutesChange`...I'm thinking that with an event handler 
  (onSubmit, onChange, etc.) implicitly has the event itself as an argument.  That is why I would need to explicitly
  take an argument, `e`, and then grab that value by setting my state to `e.target.value`.
  - Miles => So whenever there is a change, I am running a function that takes an argument, `e`.  That function calls
  another function, onMilesChange() and the argument that it is called with is the value on the input that the user
  has entered, `e.target.value`.  
  - SPECULATION: This method would not require me to define the context because it doesn't need to.
  Because I am passing the value that the user has inputted, and NOT the event, the event would not need to be 
  bound to the input at all.  With onMinutesChange, the context isn't clear so it must be defined explicitly in the
  constructor.
- That's that for now...I think I prefer the 'Miles' way of explicitly defining the context in the constructor and then
grabbing the value




