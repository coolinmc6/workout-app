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
				<input type="text" disabled value={(props.miles / (props.minutes / 60))} /><br />
				<label htmlFor="minute-mile">Minutes per mile:</label>&nbsp;
				<input type="text" disabled value={props.minutes / props.miles} /><br />
				<button className="btn btn-primary" type="submit">Submit</button>
			</form>
		</div>
	);
}

export default WorkoutForm;