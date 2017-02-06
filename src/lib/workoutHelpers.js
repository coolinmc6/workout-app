export const addWorkout = (list, workout) => [...list, workout];

export const generateID = () => Math.floor(Math.random()*100000000);

export const removeWorkout = (list, id) => {
	const removeIndex = list.findIndex(workout => workout.id === id)
	return [
		...list.slice(0, removeIndex),
		...list.slice(removeIndex+1)
	]
}