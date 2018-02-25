import React, { Component, PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router';

const url = "https://api.myjson.com/bins/f0475";

class UserDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			details: [],
			name: '',
			profileimage: '',
			brand: '',
			image:'',
			description: '',
			email: ''
		};
		// this.getDetails = this.getDetails.bind(this);
	}

	componentWillMount() {

		// console.log(this.props.location.state.element.first_name);
		let element = this.props.location.state.element;

		let name = element.first_name + ' ' + element.last_name;

		this.setState({
			name: name,
			profileimage: element.profile_image,
			description: element.description,
			brand: element.brand,
			image: element.image,
			description: element.description,
			email: element.email
		});
	}

	render() {
		return(
			<div>
				<Link to="/postsfeed" className="btn btn-primary">Back</Link>
				<Card className="container details-div">
					<CardHeader
						title={this.state.name}
						avatar={this.state.profileimage}
						subtitle={this.state.description}
						subtitleStyle={{ color: 'darkred', fontWeight: 'bold'}}
					/>
					<div className="email-div"> <strong className="email-text">Email id:</strong> &nbsp; {this.state.email} </div>
					<CardMedia
						overlay={<CardTitle title={this.state.brand} subtitle="Brand" />}
					>
						<img src={this.state.image} className="details-brand-image" alt="" />
					</CardMedia>
					<CardTitle title={this.state.brand} />
				</Card>
			</div>
		);
	}
}

export default UserDetails;