const baseURL = 'http://localhost:8080/workouts';

export const loadWorkouts = () => {
	return fetch(baseURL)
		.then(response => response.json())
}

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

export const destroyWorkout = (id) => {
	return fetch(`${baseURL}/${id}`, {
		method: 'DELETE',
		headers: {
			"Accept": 'application/json',
			'Content-Type': 'application/json'
		},
	})
}
