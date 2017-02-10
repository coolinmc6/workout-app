import React, { Component } from 'react';
import {addStatus} from '../lib/StatusHelpers';
import {loadFeed, createStatus} from '../lib/StatusService';
import {generateID} from '../lib/workoutHelpers';
import {timeStamp} from '../lib/utils';

const FaHeart = require('react-icons/lib/fa/heart');


class StatusForm extends Component {
	constructor() {
		super();
		this.state = {
			status: '',
			feed: []
		}

		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
	}

	componentDidMount() {
		loadFeed()
			.then(feed => this.setState({ feed }))
	}

	onStatusChange(e) {
		const status = e.target.value;
		this.setState({ status })
	}

	onFormSubmit(e) {
		e.preventDefault();
		const timestamp = timeStamp();
		const newStatus = {status: this.state.status, id: generateID(), date: timestamp};
		const updatedStatus = addStatus(this.state.feed,newStatus);
		
		this.setState({
			status: '',
			feed: updatedStatus,
		})
		createStatus(newStatus);
	}

	render() {
		return (
			<div>
				
				<form onSubmit={this.onFormSubmit} className="status-form">
				  	<textarea className="status-area" onChange={this.onStatusChange} value={this.state.status}></textarea>
				  	<div className='btn-holder'>
				  		
				  		<button type="submit" className="btn btn-info update-status">Update Status</button>
			  		</div>
				</form>
				
				
				{ this.state.feed.map((status) => {
					return (
						<div><div className='status-box' key={status.id} >{status.status}</div><FaHeart className='red' />&nbsp;</div>
					);
				})}
				
				
			</div>
		);
	}
}

export default StatusForm;

// create new status object
// new array, updatedStatus, is equal to my addStatus(current list, new status)
// update state with updatedStatus array


