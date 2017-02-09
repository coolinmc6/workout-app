const baseURL = 'http://localhost:8080/statuses';

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