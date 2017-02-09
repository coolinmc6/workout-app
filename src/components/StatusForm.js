import React, { Component } from 'react';
import {addStatus} from '../lib/StatusHelpers';
import {loadFeed, createStatus} from '../lib/StatusService';
import {generateID} from '../lib/workoutHelpers';

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
		const newStatus = {status: this.state.status, id: generateID()};
		const updatedStatus = addStatus(this.state.feed,newStatus);
		this.setState({
			status: '',
			feed: updatedStatus
		})
		createStatus(newStatus);
	}

	render() {
		return (
			<div>
				<form onSubmit={this.onFormSubmit}>
				  <textarea className="status-area" onChange={this.onStatusChange} value={this.state.status}></textarea>
				  <button type="Submit" className="btn btn-info">Update Status</button>
				</form>
				
				{ this.state.feed.map((status) => {
					return (
						<div className='status-box' key={status.id} >{status.status}</div>
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


