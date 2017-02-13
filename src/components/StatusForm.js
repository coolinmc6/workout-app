import React, { Component } from 'react';
import {addStatus, removeStatus} from '../lib/StatusHelpers';
import {loadFeed, createStatus, deleteStatus} from '../lib/StatusService';
import {generateID} from '../lib/workoutHelpers';
import {timeStamp} from '../lib/utils';

const FaHeart = require('react-icons/lib/fa/heart');
const FaTrash = require('react-icons/lib/fa/trash');


class StatusForm extends Component {
	constructor() {
		super();
		this.state = {
			status: '',
			feed: []
		}

		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
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

	showTempMessage = (msg) => {
	  this.setState({ message: msg})
	  setTimeout(() => this.setState({message: ''}), 2500)
	}

	handleRemove(e,id) {
		e.preventDefault();
		console.log(id)
		// const updatedStatuses = removeStatus(this.state.feed,id)
		// this.setState({
		// 	feed: updatedStatuses
		// });
		deleteStatus(id)
			.then(() => this.showTempMessage('Status successfully deleted.'))
			.then(() => loadFeed())
			.then(feed => this.setState({ feed }))
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

				{ this.state.message && <div className="success">{this.state.message}</div> }
				
				
				{ this.state.feed.map((status) => {
					return (
						<div className="status-box-container" key={status.id}>
							<div className='status-box' key={status.id} >{status.status}</div>
							<a href="#" onClick={(e) => this.handleRemove(e,status.id)}><FaTrash /></a>
						</div>
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


