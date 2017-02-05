const baseURL = 'http://localhost:8080/workouts';

export const loadWorkouts = () => {
	return fetch(baseURL)
		.then(response => response.json())
}