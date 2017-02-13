import axios from 'axios';

const baseURL = 'http://localhost:8080/statuses';

// the array of what I am grabbing is all based on the baseURL.  Nothing in the loadFeed() function 
// specifies specifically what I'm trying to grab.
export const loadFeed = () => {
	return fetch(baseURL)
		.then(response => response.json())
}

export const createStatus = (status) => {
	return fetch(baseURL, {
		method: 'POST',
		headers: {
			"Accept": 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(status)
	}).then(res => res.json())
}

export const deleteStatus = (id) => {
	return axios({
	  method: 'delete',
	  url: `${baseURL}/${id}`
	});
}

