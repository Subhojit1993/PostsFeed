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
			name: '',
		};
	}

	componentWillMount() {
		let name = this.props.location.state.element.first_name + ' ' + this.props.location.state.element.last_name;
		this.state.name = name;
	}

	render() {
		return(
			<div>
				<Link to="/postsfeed" className="btn btn-primary">Back</Link>
				<Card className="container details-div">
					<CardHeader
						title={this.state.name}
						avatar={this.props.location.state.element.profileimage}
						subtitle={this.props.location.state.element.description}
						subtitleStyle={{ color: 'darkred', fontWeight: 'bold'}}
					/>
					<div className="email-div"> <strong className="email-text">Email id:</strong> &nbsp; {this.props.location.state.element.email} </div>
					<CardMedia
						overlay={<CardTitle title={this.props.location.state.element.brand} subtitle="Brand" />}
					>
						<img src={this.props.location.state.element.image} className="details-brand-image" alt="" />
					</CardMedia>
					<CardTitle title={this.props.location.state.element.brand} />
				</Card>
			</div>
		);
	}
}

export default UserDetails;