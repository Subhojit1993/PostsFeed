import React, { Component } from 'react';
import * as firebase from 'firebase';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import { Link } from 'react-router';

const url = "https://api.myjson.com/bins/f0475";

class PostsFeed extends Component {

	constructor(props) {
		super(props);
		this.state = {
			image: '',
			response: [],
			end_index: 10,
			hide_button: false
		};
		this.getPosts = this.getPosts.bind(this);
	}

	componentWillMount() {

		const self=this;
	    firebase.auth().onAuthStateChanged(function(user) {
	      if (user!=null) {

	        /* fetching the image from Google profile */
	  
	        self.setState({
	        	image: user.photoURL
	        });
	      } 
	      if(user==null) {
	          window.location = '/';
	      }
	    });

	    axios.get(url).then(function(response){
			self.setState({
				response: response
			});
		});

	}

	getPosts() {
		let htmlContent = [];
		if(this.state.response.data != undefined) {
			// console.log(this.state.response.data);
			Object.values(this.state.response.data).slice(0, this.state.end_index).forEach(function(element) {
				let name = element.first_name + ' ' + element.last_name;
				htmlContent.push(
					<Card key={element.user_name} className="container card-class-two">
						<Link 
						to={{ 
							pathname: "/postsfeed/" + element.user_name, 
							state: { element }
							}} 
						>
							<CardHeader
							  title={name}
							  avatar={element.profile_image}
							  subtitle={element.description}
							  subtitleStyle={{ color: 'darkred', fontWeight: 'bold'}}
							/>
						</Link>
						<CardMedia
						  overlay={<CardTitle title={element.brand} />}
						>
						  <img src={element.image} className="brand-image" alt="" />
						</CardMedia>
						<CardTitle title={element.brand} />
						<CardActions>
						  <FlatButton label="Like" />
						  <FlatButton label="Comment" />
						</CardActions>
					</Card>
				)
			})
		}
		return htmlContent;
	}

	countIndex() {

		// let startindex = this.state.end_index;
		let endindex = this.state.end_index + 10;

		this.setState({
			end_index: endindex
		});

		if(endindex == Object.values(this.state.response.data).length) {
			this.setState({ hide_button: true});
		}

	}

	render() {
		return(
			<div className="container">
				<Card className="container card-class-one">
					<CardHeader
						title="Posts Feed"
						avatar={this.state.image}
					/>
					<div className="line" />
					{this.getPosts()}
					<div className="container button-div">
						<button className="show-more-button" hidden={this.state.hide_button} onClick={this.countIndex.bind(this)}>Show more..</button>
					</div>
				</Card>
			</div>
		);
	}
}

export default PostsFeed;