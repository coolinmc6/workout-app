export const timeStamp = () => {
	const monthNames = [
	  "January", "February", "March",
	  "April", "May", "June", "July",
	  "August", "September", "October",
	  "November", "December"
	];

	const date = new Date();
	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();
	const hour = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hour < 12 ? 'am' : 'pm';

	let timestamp = day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minutes + ampm;

	return timestamp;
}

