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

# Start the node.js server => separate tab
npm start
```
- if nothing populates initially, the web server may have loaded before the database server in which 
case you can just refresh your browser and the workouts should populate.

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
  - Delete Functionality: Give users the ability to delete workouts
  - Show an MPH gauge that changes as the user enters numbers
  - Add basic styling
  - Create a way to sort my array
  - Break them into different components

## 10. Deleting a Workout
- The way my app is written now, there is no obvious way to delete an item.  There is nowhere to click which means
that when I spit out my list of workouts, I'll need to also have a link for the user to click.  Also, now that
I am persisting workouts, I have a couple things to change: the database AND my state.
- When I create a workout (as described in #5 above), I: #1: create a workout object, #2: create a new array
that includes my old array PLUS my new workout object, #3: update state with my new array.
- Applying those steps to deleting, I think I need to: #1 find the workout I want to delete based on ID, #2: 
delete the item from my database, #3: create a new array that represents my database MINUS that workout, #4:
update my state to reflect that...let's see if that's what I do.

---
- Okay so I got it working but it was tricky:  
```javascript
handleRemove = (id, e) => {
  e.preventDefault();
  const updatedWorkouts = removeWorkout(this.state.workouts, id);
  this.setState({ workouts: updatedWorkouts})
  destroyWorkout(id)
    .then(() => this.showTempMessage('Workout Removed'))
}
```
- Like how I create a new workout, I have to create a new list of workouts by passing my current list of workouts
and the id that I want to remove to my removeWorkout() method.
- I then update my state by setting my workouts property to that updated array I received
- Lastly, I remove the workout from the database via my destroyWorkout() method.
- I just couldn't understand how to give my handleRemove() function another argument.  Each anchor tag, which 
I used for the 'delete' button,  needed to be able to send the id of the item that I wanted to delete.  
In looking at my past examples, I didn't understand what needed to happen but then I saw 
[this](http://stackoverflow.com/questions/29810914/react-js-onclick-cant-pass-value-to-method).
I needed to bind it...I still don't understand what this means but in playing around, I was able to come up
with two bits of code that work (and do the same thing).  This column is now the first one in my table:
```javascript
// ES5 => must bind handleRemove and then I can add arguments after 'this'
<td><a href="#" key={workout.id} onClick={this.handleRemove.bind(this, workout.id)}>X</a></td>

// ES6 => OR, I can do an arrow function.  I still don't quite get this 100% but I've seen this
// syntax before.
<td><a href="#" key={workout.id} onClick={(e) => this.handleRemove(workout.id, e)}>X</a></td> 
```
- Once I was able to successfully pass in my `workout.id` as well, I had to write two more methods: a
removeWorkout() method that would live in my workoutHelpers file and a destroyWorkout() method that 
would live in my workoutService file.
- My removeWorkout() is below:
```javascript
// ./src/lib/workoutHelpers.js
export const removeWorkout = (list, id) => {
  const removeIndex = list.findIndex(workout => workout.id === id)
  return [
    ...list.slice(0, removeIndex),
    ...list.slice(removeIndex+1)
  ]
}
```
  - The removeWorkout() function is like a surgery; I need to identify exactly which one I need to delete
  by looking for its unique id and then a return an array using the (spread?, rest?, both?) operator(s).  It
  takes in my entire list of workouts and returns an array that contains everything BUT the one I don't want.
  As a reminder, we do it this because we do NOT want to mutate the original array so this function has to
  return an array as such: [all items BEFORE the deleted item, all items AFTER the deleted item]
  - I'd like to do more work on this but I think I generally understand what's going on here
- My destroyWorkout() is below:
```javascript
// ./src/lib/workoutHelpers.js
export const destroyWorkout = (id) => {
  return fetch(`${baseURL}/${id}`, {
    method: 'DELETE',
    headers: {
      "Accept": 'application/json',
      'Content-Type': 'application/json'
    },
  })
}
```
  - This function uses fetch which I need to really dig into.  Anyway, it just needs to id of the workout
  that I am deleting and then I simply issue a DELETE request with that id in the URL.

- Updated next steps (not in any particular order):
  - ~~Add minutes, miles, timestamp and id to an array of objects containing all that stuff~~
  - ~~Fetch workouts from database.~~
  - Input validation to prevent users from submitting non-numbers or empty fields
  - ~~'Persist' the data into a JSON database => using Axios or fetch~~
  - ~~Show all of my workouts in a table~~
  - ~~Show a message to user that they have successfully entered a new workout~~
  - ~~Delete Functionality: Give users the ability to delete workouts~~
  - ~~Show an MPH gauge that changes as the user enters numbers~~
  - Add basic styling
  - Create a way to sort my array
  - Break them into different components

## 11. Show MPH gauge
- I was having trouble keeping this figure in state for some reason.  The calculations, when completed inline, 
are fine, but when calculated in a method and then called when either the miles or minutes changes, they
are all screwed up.  I don't understand why but I'll have to come back to it.

## 12. Input Validation: Empty Values
- Here is a quick list of the what I did:
  - I created a handleEmptySubmit() method that prevents default action and sets the property of an error
  message in state
  - I added a div that populates the error when a user enters an empty submit
  - I created a 'submitHandler' constant that, when a user submits, determines whether it gets the normal
  onFormSubmit or handleEmptySubmit methods
  - When I got those things working, I updated the onFormSubmit button to reset this.state.errorMessage to
  an empty string so that the message goes away
```javascript
handleEmptySubmit(e) {
  e.preventDefault();
  this.setState({
    errorMessage: 'Please supply values for both the minutes and miles for your run.'
  })
}
```
- Step #1: this isn't a complicated function but it's probably something that I'd need to write in tandem
with my error message.  I think that a good thing to remember is that I can have a div, which contains
only the contents of a particular state property, essentially be hidden UNTIL that state property actually
gets a value.  So in this case, this handleEmptySubmit simply has to prevent the default behavior (because
the event handler will be doing EITHER onFormSubmit or handleEmptySubmit) and then set the errorMessage 
property in state to my message.  So, after Step #1, I am simply setting the message, nothing has happened
yet.
- Step #2: I get to use that really cool pieces of code that I used before from my 'successful log' message:
`{ this.state.errorMessage && <span className="error">{this.state.errorMessage}</span> }`.  This pretty much 
says that if this.state.errorMessage is not empty, display it.  After adding some basic styling, we now have
a way to show users in bold, red font WHY we can't submit their blank form.
- Step #3: This is another cool piece of code that I'll need to remember: 

`const submitHandler = (this.state.miles && this.state.minutes) ? this.onFormSubmit : this.handleEmptySubmit;`

This constant, submitHandler, it checks to see that the user has entered SOMETHING into both the minutes
and miles inputs.  If they are both populated, then the handler that I will use is `this.onFormSubmit`; if
one or both are empty, we'll use `this.handleEmptySubmit`.  We then insert the constant `submitHandler` into
the event handler on my form: `<form onSubmit={submitHandler}>`.
- Step #3.5 ==> at this point, we are ALMOST there, but we have to remember to BIND the function. In another
example I saw, the programmer didn't have to but I believe he did a reason why, I just don't remember it now.
Anyway, here's what I added to the constructor: `this.handleEmptySubmit = this.handleEmptySubmit.bind(this);`

- Step #4: We now have a working error message BUT it never goes away...even once the user populates both 
fields and successfully logs a workout, it's still there. That is a quick fix: just update the onFormSubmit
function: `errorMessage: ''` => this sets the errorMessage to empty string which makes the message disappear.

- Updated next steps (not in any particular order):
  - ~~Add minutes, miles, timestamp and id to an array of objects containing all that stuff~~
  - ~~Fetch workouts from database.~~
  - ~~Input validation to prevent users from submitting empty fields~~
  - ~~'Persist' the data into a JSON database => using Axios or fetch~~
  - ~~Show all of my workouts in a table~~
  - ~~Show a message to user that they have successfully entered a new workout~~
  - ~~Delete Functionality: Give users the ability to delete workouts~~
  - ~~Show an MPH gauge that changes as the user enters numbers~~
  - ~~Add basic styling~~
  - Create a way to sort my array
  - Break them into different components

## 13. Timestamp
- This was a pain; Javascript doesn't have the best datetime functionality and I didn't feel like
bringing in a library.  What I learned, though, in trying to add a method to simply format a date, I
can't quite describe what the concept is called but this is what happens:
  - I tried defining a method called timeStamp() in my App class where everything is. One problem, however 
  was that in the onFormSubmit() method where I wanted to add the date, it couldn't find the method.  It
  kept coming up with timeStamp is undefined.  Doing `App.timeStamp()` didn't solve the problem either.
  - So...I created a new file /lib/utils.js to hold the method and simply imported it into my App.js file.
  I could now call it my onFormSubmit method.
  - Something else that I noticed was the syntax differences.  Here is how I define a method in my App class:
  ```javascript
  componentDidMount(){    
    loadWorkouts()
    .then(workouts => this.setState({workouts : workouts}))
  }

  // func name, parens, open curly brace
  // functionName(){
  ```
  - Outside of my App class:
  ```javascript
  export const timeStamp = () => {

  // export, const, func name, is (equals, assigned to), parens, fat arrow, open curly
  // export const funcName = () => {
  ```
  - I'd need to dig into WHY the difference between the snytax as well as why I couldn't access my function
  from inside App.
  - For now, just assume that any functions that aren't a handler of some kind or lifecycle method MUST be
  written outside of the App class.  So I bet that I could add the timeStamp method above the App class and 
  it'd work just fine.
  - **This may solve the issue I had with MPH in #11; I should take another look.**
- Anyway, the function that I used for my timestamp is largely from stackexchange; it's boring and more
manual than I would've hoped but self explanatory.

## 14. Break Into Components: WorkoutForm
- My current form element contains all the inputs for entering my minutes and miles figures as well as
the event handler for onSubmit.  So if I am going to break this out into a separate component, I'll need
to pass, as props, the following: minutes (state), miles (state), submitHandler (which is either
onFormSubmit or handleEmptySubmit), onMilesChange and onMinutesChange.  Here's a quick mock-up of my WorkoutForm:
```javascript
// WorkoutForm.js
<div>
  <form onSubmit={props.submitHandler}>
    <label htmlFor="minutes">Minutes:</label>&nbsp;
    <input type="text" placeholder="minutes" value={this.state.minutes} onChange={props.minutesHandler} />
    <br />
    <label htmlFor="miles">Miles:</label>&nbsp;
    <input type="text" placeholder="miles" value={props.miles} onChange={(e) => this.onMilesChange(e.target.value) }/>
    <br />
    <label htmlFor="mph">Miles Per Hour:</label>&nbsp;
    <input type="text" disabled value={(props.miles / (props.minutes / 60))} />&nbsp;&nbsp;&nbsp;
    <label htmlFor="minute-mile">Minutes per mile:</label>&nbsp;
    <input type="text" disabled value={props.minutes / props.miles} /><br />
    <button className="btn btn-primary" type="submit">Submit</button>
  </form>
</div>

// App.js
<WorkoutForm  submitHandler={submitHandler}
              milesHandler={(e) => this.onMilesChange(e.target.value)}
              minutesHandler={this.onMinutesChange}
              miles={this.state.miles}
              minutes={this.state.minutes} 
              />  
```

- Removed from App.js:
```javascript
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
```
This is the new WorkoutForm component:
```javascript
import React from 'react';

export const WorkoutForm = (props) => {

  return (
    <div>
      <form onSubmit={props.submitHandler}>
        <label htmlFor="minutes">Minutes:</label>&nbsp;
        <input type="text" placeholder="minutes" value={props.minutes} onChange={props.minutesHandler} />
        <br />
        <label htmlFor="miles">Miles:</label>&nbsp;
        <input type="text" placeholder="miles" value={props.miles} onChange={props.milesHandler}/>
        <br />
        <label htmlFor="mph">Miles Per Hour:</label>&nbsp;
        <input type="text" disabled value={(props.miles / (props.minutes / 60))} />&nbsp;&nbsp;&nbsp;
        <label htmlFor="minute-mile">Minutes per mile:</label>&nbsp;
        <input type="text" disabled value={props.minutes / props.miles} /><br />
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
```
- I struggled with a using `this.props.xxx` vs. `props.xxx`.  I have seen other components have a constructor
and have to use `this.props.xxx`.  In the component that I built, it's just a function that takes props as its
only argument which I can then insert use where I want.  I call each property by just doing `props.miles`, etc.
- Building this form in my App first and then bringing it over helped me better understand the parent-child
relationships of props and state.  It is in the child component that the 'onSubmit', or 'onChange' handlers
are because that is WHERE they are being initiated.  The child can be 'dumb' in that it doesn't have to know
what to do or what function to call, it just has to know the props name. 
  - On the parent side, where all of my methods are, what it needs to pass down in the form of a prop is 
  whatever would normally go inside the curly braces.  So my miles prop that I am passing down, I want it to
  come from state, thus `miles={this.state.miles}`.  To change the mile property, I also need to pass its
  associated onMilesChange handler.  The onChange handler was originally in the parent, App, but it's now in 
  the child component, WorkoutForm, which means that the onChange is NO LONGER in my App component.  This means
  that instead of `onChange={(e) => this.onMilesChange(e.target.value)}`, I need to pass that value between the
  curly braces into a prop that I called 'milesHandler'.  Here is what my App.js component looks like:
```javascript
<WorkoutForm  miles={this.state.miles}
              minutes={this.state.minutes}
              milesHandler={(e) => this.onMilesChange(e.target.value)}
              minutesHandler={this.onMinutesChange}
              submitHandler={submitHandler}/>
```
  - A simple way to think about it is that the parent has the "good stuff" between the curly braces.  It's passing
  state or a method or whatever is really needed to make the app run.  It cannot, however, directly implement it; 
  it has to pass it into a property that its child can call.  The child component has all the good stuff in the
  props, it just needs to actually implement it.  That means it must actually implement the onChange, even if
  it doesn't know what's in it, it just has to pick the right one.  It has to put the prop associated with miles
  into the appropriate input element associated with miles.
  - Parent => puts the important stuff in little boxes labeled to reflect what each is supposed to do (e.g. miles, 
  minutes, submitHandler, etc.).
  - Child => takes each little box and follows the labels to put them into the appropriate elements or handlers.
  The milesHandler is supposed to go om the onChange handler for the miles input.  The submitHandler is supposed
  to go on the onSubmit handler of the form element.
  - Child => the child component can access each little box by referencing 'props', '.', and then the name of the
  prop it is grabbing. `onSubmit={props.submitHandler}`, `value={props.minutes}`, etc.
- Building a component that has to access `this.props.propName` would be a good exercise.  I need to understand
the difference.

- Updated next steps (not in any particular order):
  - Create a way to sort my array
  - Break them into different components: Table, Status logger
  - Moderately better styling
  - Review

## 15. Status Logger
- For my status logger, I need:
  - I need a submit button.
  - A "feed".
  - persist to db.json
- Steps as I do them:
  - ~~Create StatusForm component~~
  - ~~Build textarea~~
  - ~~Add button for Submit Status~~
  - ~~~default out the behavior~~~
  - ~~Update state on change of textarea AND make it controlled~~
  - ~~Add status to state.feed~~
  - ~~Simple render of status to my page so that I can see my statuses~~
  - ~~Add status to database onSubmit~~
  - Delete status
- Current status: I've been able to add a status to my database BUT I keep getting errors about children in a list
not having a key.  I'm trying to understand why the code below doesn't work:
```javascript
{ this.state.feed.map((status) => {
  return (
    <div className='status-box' key={status.id} >{status.status}</div>
  );
})}
```
- NEXT STEPS: describe where you are at right now and what you struggled with.  I tried to do most of this without
referring to my workouts functions / patterns too much. 
- Discussion points:
  - Creating state in my StatusForm and NOT my App component
  - The initial adding of a status to a 'feed'
  - Persisting my status
  - The key issue is still a problem => in my React devtools, each div has a unique id so I'm not sure what's going on
  - I am also struggling with getting glyphicons into my app...I have no idea why they aren't working.
  
### Building the Status Logger
- The Status Logger has a number of elements: textarea (to enter status), submit button (to save it), display area (to 
show past status updates).
- I was struggling to reconcile the two methods of building components; I couldn't understand why a child component
of App, for example, would ever have state...why wouldn't you just want App to hold it and all state simply be passed
down to the child component?  It was feeling like every component that I wrote would be a functional component except
for the one component, App, that I'd want to have state.  My question:
  - **Is there ever a time where I want my child component to have state (and thus be a class-based component) BUT**
  **its state does not need to be saved / recorded to the global state?**
- Anyway, I decided to make a class-based component with its own state which may create problems for me down the line
but for now, my `StatusForm />` state is completely separate from my `<App />` state.
- In building the component, it has the normal things I need:
  - constructor() method to call super(), initialize state, bind functions
  - componentDidMount() lifecycle method that loads my statuses
  - onStatusChange that records the value of my textarea onChange
  - onFormSubmit to submit my status
- None of the HTML, event handlers or the mapping of my statuses is too dissimilar so I want to focus on the other
items I had to build.
- To get this thing working, I had to create `StatusHelpers.js` and `StatusService.js` files, just like for my
workout logging.
- Let's look at the first part that I had to solve was adding a new status to my 'feed' array which is just a 
list of all my statuses.  To add something to my feed:
  - I need to create a `const newStatus` object that contains the fields that I want to save.  Initially, it was
  just the status (I added id and timestamp later), and it was an object that contained just one property, 'status', 
  and its contents were that of 'this.state.status' (the contents of the textarea element).  It looked something
  like this: `const newStatus = { status: this.state.status }
  - Next, I needed to get an updated array which contained my old array PLUS my new status.  The basics of what
  I'm trying to accomplish is this: `newFeed = oldFeed + newStatus`.  But how do I add to my old feed without
  mutating it?  I actually already did it for my workouts but I did it again for practice...I wrote a function in
  my StatusHelpers as follows: `export const addStatus = (feed, status) => [...feed, status]`.  It's always the
  same pattern and I should probably just log this somewhere...the function takes in the old array and the new
  item to add and returns it using the spread operator with the new item on the end.
  - After writing my addStatus function, I was able to create an updatedStatus variable as follows:
  `const updatedStatus = addStatus(this.state.feed,newStatus)`.  Now, I have exactly what I want which is my new
  feed that I can use to update my state.
  - Updating state is easy...I just need to put in my updated feed into the feed property and clear out state
  because we have it now and it allows users to start entering in a new status
  - NOTE: I feel like the normal flow of a production app would be to: (#1) add it to the database, (#2) 
  re-load the 20-50 most recent statuses, (#3) update my state to include those 20-50 statuses.  Maybe I'm wrong
  but my current state would be depenedent on just this user / session...if they were logged in somewhere else and
  added a status, they wouldn't have the most up-to-date feed, it would just be the 20 statuses they loaded 
  initially plus whatever statused they added.  I'll have to address this later.
  - Now that I've updated my state, I'll need to add it to my database.  This was pretty easy because I generally
  used the same pattern from my workoutService file.  I won't lay out the fetch API because I haven't really dug 
  into it yet but it is pretty much the exact same code for adding a workout except for the baseURL.
  - My next method will have to be Axios.

## 16. Importing Icons
- I still don't understand how to bring in glyphicons from bootstrap.  I ended up using React Icons, see 
[here](https://gorangajic.github.io/react-icons/fa.html) for more, but it has Font Awesome icons.  For now, 
these are the main steps (starting from the very beginning):
  - Install React Icons: `npm install react-icons --save`
  - Import the icon you want into the file you're using it: `const FaHeart = require('react-icons/lib/fa/heart')`.
  For some reason, the import didn't work for me.
  - Place it in the component like so: `<FaHeart />`
  - There is a huge list of icons at its [github page](https://gorangajic.github.io/react-icons/fa.html) so go there
  for a particular item.
- One cool thing to note that is probably not that mind-bending is that I can add `className="red"` and then
now that icon has the red class which I made `color: red;`.  Again, nothing special, but I wasn't 100% sure
on what I could do, especially with component that I didn't write.

















