# README

**Objective:** Create a basic run tracker that collects miles run and time completed.  The
app will save those stats plus a timestamp and an MPH.  The following is a step-by-step
discussion in how I built the app along with questions I have and where I struggled.

## 0: Check it out!
- To see this app do its thing, do the following
```sh
git clone https://github.com/coolinmc6/workout-app.git
cd workout-app
npm i

# Start the database server
json-server -p 8080 --watch db.json

# Start the node.js server
npm start
```

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

---
- Next steps (not in any particular order):
  - Add minutes, miles, timestamp and id to an array of objects containing all that stuff
  - Input validation to prevent users from submitting non-numbers
  - 'Persist' the data into a JSON database => using Axios or fetch
  - Show all of my workouts in a table
  - Give users the ability to delete workouts

## 5. Add Workout Details to an Array
- In looking at some other projects, adding an item isn't too difficult.  One project I completed has a method for 
adding the todo item to state and another method for adding that item to the database.  This is what I will model
my add new workout method: `export const addTodo = (list, item) => [...list, item];`. It is a function that takes
in the current list of items and the new item and returns a new list with that item added, using the spread operator.
- Here is my resulting code:
```javascript
// App.js
// code
import {addWorkout} from './lib/workoutHelpers';

// update initial state object
this.state = {
  minutes: '',
  miles: '',
  currentID: 1, // NEW
  workouts: []  // NEW
}

// update onSubmit function
onFormSubmit(e){
  e.preventDefault()
  // ALL THIS BELOW IS NEW
  const nextID = this.state.currentID + 1;
  const newWorkout = {id: this.state.currentID, minutes: this.state.minutes, miles: this.state.miles}
  const updatedWorkouts = addWorkout(this.state.workouts, newWorkout);
  this.setState({
    minutes: '',
    miles: '',
    currentID: nextID,
    workouts: updatedWorkouts
  })
}

// ./src/lib/workoutHelpers.js
export const addWorkout = (list, workout) => [...list, workout];
```
- The following steps look tricky but they all make sense once I really broke it down:
  - Step #1: create a file to hold the function that does all of this.  I can do it all in one line and it really 
  doesn't need to be in the same file as the App.  So, I created `/src/lib/workoutHelpers.js` and each function
  will start with `export const` so that I can access it.  At the top of my App.js file, I need to import it by 
  doing this: `import {addWorkout} from './lib/workoutHelpers';`
  - Step #1 Summary: Add function to Helper, export function (from helper file), import function (in App.js)
  - Steps Roadmap: For my updated onSubmit function, I need to do the following things: (a) increment
  my currentID property, (b) set the contents of the newWorkout object, (c) set the contents of the entire updated
  workouts array, (d) update the state with my new values
  - Step #2: Each new workout is its own object.  What does that mean for me?  For me to add this workout to
  my workouts array, I should create it in a constant first and then I can work with it much easier.  So, first thing
  I do is: `const newWorkout = {id: this.state.currentID, minutes: this.state.minutes, miles: this.state.miles}`.
  As a quick run-through: my id is just whatever my currentID is, minutes and miles are from my state object which I
  already have.  At this point, I haven't really done anything...I have simply created an object that contains all
  the values that I WANT to add to my workouts array.
  - Step #3: Increment my id; this is pretty self explanatory: `const nextID = this.state.currentID + 1`
  - Step #4: Create a new array that includes all my workouts PLUS the most recent one that I've created.  THIS is
  where I can use the new method that I created called 'addWorkout' in my `./lib/workoutHelpers.js`.  My new
  array, called updatedWorkouts, will simply be assigned to the value of addWorkout(workouts array, new workout).
  Here it is: `const updatedWorkouts = addWorkout(this.state.workouts, newWorkout);`
  - Step #5: Again, I still haven't updated my state yet...right now, what I have is an updated list of workouts
  which NOW includes my newest workout.  In this step, I need to update my state using this.setState.  This part, 
  after all that I've done thus far, is actually quite easy...I just set my minutes and miles properties back to
  an empty string, my currentID is now 'nextID' which is simply 1 more, and workouts array is now set to my
  updatedWorkouts array that I created in Step #4.
- I know that's a lot of information but it's actually not that bad.  When I add a workout, I have to update my
state so that it includes all my previous workouts PLUS my newest one.  Breaking that process into a couple 
different steps, I can: (1) create a new workout object, (2) create a new array that equals the old array + the
new workout, (3) update my state with that new array.  The other parts that I added like resetting the miles and
minutes values just improves usability.
- Updated next steps (not in any particular order):
  - ~~Add minutes, miles, timestamp and id to an array of objects containing all that stuff~~
  - Input validation to prevent users from submitting non-numbers
  - 'Persist' the data into a JSON database => using Axios or fetch
  - Show all of my workouts in a table
  - Give users the ability to delete workouts
  - Show a message to user that they have successfully entered a new workout

## 6. Show All Workouts
- To show all my workouts, I'll need to iterate over that array...I know I've seen that before.  To do that, we 
need to use map.
- My solution is not the prettiest because I haven't broken anything out into separate components yet but
it does work and here it is:
```javascript
// code
<table className='table'>
  <tbody>
    <tr><th>ID</th><th>Minutes</th><th>Miles</th></tr>
    {this.state.workouts.map(workout => {
      return (
        <tr key={workout.id}>
          <td>{workout.id}</td>
          <td>{workout.minutes}</td>
          <td>{workout.miles}</td>
        </tr>
      )
    })}
  </tbody>
</table>
```
- I didn't have to change anything really, I simply had to display it.  The HTML is pretty straight forward
so let me discuss the mapping part of it: `{this.state.workouts.map(workout => `. I am passing in my current
array of workouts `this.state.workouts` to map which calls the function I wrote once for each item in the array.
My variable, `workout` represents the item in the array.  And for each one, I am returning everything between the
parentheses.  So for each one, I am giving each row a key of workout.id and then returning my id, minutes and 
miles in its own column.
- As I said, I've seen this all done cleaner but this will have to do for now.
- Updated next steps (not in any particular order):
  - ~~Add minutes, miles, timestamp and id to an array of objects containing all that stuff~~
  - Input validation to prevent users from submitting non-numbers
  - 'Persist' the data into a JSON database => using Axios or fetch
  - ~~Show all of my workouts in a table~~
  - Give users the ability to delete workouts
  - Show a message to user that they have successfully entered a new workout

## 7. Persist Workouts
- This is what I think I need to do: run json server, create db.json, create a fetching method to get persisted
workouts
- Make a `db.json` file in your repo's directory
- `json-server -p 8080 --watch db.json`
- create a workoutService.js file
- write fetch workouts function there
- Bring in those workouts by calling it in componentDidMount()
```sh
touch db.json
json-server -p 8080 --watch db.json
```
```javascript
// ./src/lib/workoutService.js
const baseURL = 'http://localhost:8080/workouts';

export const loadWorkouts = () => {
	return fetch(baseURL)
		.then(response => response.json())
}

// App.js
componentDidMount(){    
  loadWorkouts()
  .then(workouts => this.setState({workouts : workouts}))
}
```
- Okay, so it was successful but I had some problems finding the next ID based on the workouts currently in my
database...but I'll have to address that later.  This is what I did for this step:
- Step #1: I made my `db.json` file in my project's root directory.  I'm sure I don't NEED to do that but that's
how I first saw it done...
- Step #2: run the server: `json-server -p 8080 --watch db.json`
- Step #3: I created the file here: `./src/lib/workoutService.js`
- Step #4: I wrote the function using the fetch API but I don't know much about it and MDN lists it as an
'experimental' technology.  I should learn how to do that using Axios.  This function returns fetch(baseURL)
which, because it is just a GET request, I don't think it needs any special parameters.  It then, once it
gets the results, I think it converts it to JSON.
- Step #5: I used componentDidMount which is a lifecycle method that runs immediately after a component is
mounted.  For my app, I am calling my loadWorkouts() method and then setting my this.state.workouts to
the array that I receive from the database.
- Updated next steps (not in any particular order):
  - ~~Add minutes, miles, timestamp and id to an array of objects containing all that stuff~~
  - ~~Fetch workouts from database.~~
  - Input validation to prevent users from submitting non-numbers
  - 'Persist' the data into a JSON database => using Axios or fetch
  - ~~Show all of my workouts in a table~~
  - Give users the ability to delete workouts
  - Show a message to user that they have successfully entered a new workout

## 8. Add Workouts to Database
- The steps for this part are not too bad but I don't quite understand EVERYTHING yet.  I should probably re-write
this function using axios but I will use fetch for now.  Here are the basics:
  - create a `createWorkout()` method in `./src/lib/workoutService.js`.  The method will use fetch but will
  be a POST request, instead of a GET request. 
  - import the method into App.js
  - call `createWorkout()` inside my onSubmit method
- This is what I did:
```javascript
// ./src/lib/workoutService.js
export const createWorkout = (workout) => {
	return fetch(baseURL, {
		method: 'POST',
		headers: {
			"Accept": 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(workout)
	}).then(res => res.json())
}

// App.js
// code
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
  createWorkout(newWorkout) // NEW
}
```
- I don't understand everything about fetch but here are the basics:
  - after the baseURL, the next argument is an object with several properties.  One is the `method` I'm using, 
  POST, a `headers` property that accepts an object, and lastly is the body property which uses the
  JSON.stringify method on my workout.
  - Then, like my GET request, `.then(res => res.json())`
- All the work is done in my createWorkout() method so I just have to call it in onFormSubmit() and pass
it my newWorkout constant which I created to add it to my state.
- Updated next steps (not in any particular order):
  - ~~Add minutes, miles, timestamp and id to an array of objects containing all that stuff~~
  - ~~Fetch workouts from database.~~
  - Input validation to prevent users from submitting non-numbers
  - ~~'Persist' the data into a JSON database => using Axios or fetch~~
  - ~~Show all of my workouts in a table~~
  - Give users the ability to delete workouts
  - Show a message to user that they have successfully entered a new workout

## 9. Show Message After Successful Submission
- Here are the basics: 
  - I need the div where the message will show up
  - write a method that updates state with the message contents and THEN uses a setTimeout to set the message
  to an empty string
  - after successfully creating todo, call my method with the associated message
- I borrowed this code from another project; I don't know exactly how it works but what it's saying is if my
this.state.message is populated, with anything, my div will be displayed.  Here it is:
`{ this.state.message && <div className="success">{this.state.message}</div> }`
- Here is my showTempMessage function.  It takes a message as its argument and updates my message property
in state.  When my message property is updated, the div is displayed.  The setTimeout is just a function that
sets my state back to an empty string after 2.5 seconds.
```javascript
showTempMessage = (msg) => {
  this.setState({ message: msg})
  setTimeout(() => this.setState({message: ''}), 2500)
}
```
- Lastly, I add a `.then()` to my createWorkout() method in my onFormSubmit() method:
```javascript
// code
createWorkout(newWorkout)
  .then(() => this.showTempMessage('Workout added!  Great Job!'))
} // end of onFormSubmit() method
```
  - so, as you can see, the message I am showing the user is the argument that I am passing my showTempMessage()
  method.

- Updated next steps (not in any particular order):
  - ~~Add minutes, miles, timestamp and id to an array of objects containing all that stuff~~
  - ~~Fetch workouts from database.~~
  - Input validation to prevent users from submitting non-numbers or empty fields
  - ~~'Persist' the data into a JSON database => using Axios or fetch~~
  - ~~Show all of my workouts in a table~~
  - ~~Show a message to user that they have successfully entered a new workout~~
  - DELETE: Give users the ability to delete workouts
  - Show a MPH gauge that changes as the user enters numbers
  - Add basic styling
  - Create a way to sort my array
  - Break them into different components

