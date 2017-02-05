export const addWorkout = (list, workout) => [...list, workout];

export const generateID = () => Math.floor(Math.random()*100000000);