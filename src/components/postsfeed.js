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
			myname: '',
			response: [],
			end_index: 10,
			hide_button: false,
			arr: [],
			hideLike: false,
			localLikes: []
		};
		this.getPosts = this.getPosts.bind(this);
	}

	componentWillMount() {

		var localLikes = localStorage.getItem('likes');
		this.setState({ localLikes: localLikes });

		const self=this;
	    firebase.auth().onAuthStateChanged(function(user) {
	      if (user!=null) {

	        /* fetching the image from Google profile */
	  
	        self.setState({
	        	image: user.photoURL,
	        	myname: user.displayName
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
						
						<div>
							<LikeComments key={element.user_name} image={this.state.image} myname={this.state.myname} id={element.user_name} elements={element} />
						</div>
					</Card>
				)
			}, this)
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

class LikeComments extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			hideLike: true,
			arr: [],
			hideLikeButton: false,
			hideUnlike: true,
			hideText: true,
			textDiv: true,
			textvalue: '',
			hideComments: true,
			mycomments: []
		};
		this.getComments = this.getComments.bind(this);
	}
	componentWillMount() {
		let likes = [];
		
		var localLikes = localStorage.getItem('likes');

		if( localLikes!=null ) {
			this.state.arr = localLikes.split(",");
			
			for(var i=0; i<this.state.arr.length; i++) {
				if( this.props.id == this.state.arr[i] ) {
					this.setState({ hideLike: false, hideLikeButton: true, hideUnlike: false });
				}
			}
		}
	}
	onPostLike(username) {
		this.state.arr.push(username);
		localStorage.setItem('likes', this.state.arr);
		this.setState({ hideLike: false, hideLikeButton: true, hideUnlike: false });
	}
	onPostUnlike(username) {
		let likes = [];
		var localLikes = localStorage.getItem('likes');
		likes = localLikes.split(",");
		var useindex = likes.indexOf(username);
		if(useindex > -1) {
			likes.splice(useindex, 1);
		}
		localStorage.setItem('likes', likes);
		this.setState({ hideLike: true, hideLikeButton: false, hideUnlike: true });
	}
	onComment(username) {
		this.setState({
			textDiv: !this.state.textDiv
		});

		var comments = [];
		var localComments = localStorage.getItem('comments');

		if( localComments!=null ) {
			comments = JSON.parse(localComments);
		}
		this.setState({
			mycomments: comments
		});

	}
	onTextChange(e) {
		this.setState({ textvalue: e.target.value });
	}
	handleSubmit(e) {
		e.preventDefault();
		var comments = [];
		// console.log(this.state.textvalue);
		var a = { username: e.currentTarget.id, comment: this.state.textvalue };
		// console.log(a);
		var localComments = localStorage.getItem('comments');
		if(localComments!=null) {
			comments = JSON.parse(localComments);
		}
		comments.push(a);
		localStorage.setItem('comments', JSON.stringify(comments));
		// console.log(comments);
		this.setState({
			mycomments: comments,
			textvalue: ''
		});
		// this.setState({ hideComments: false });

	}

	getComments() {
		let htmlContent = [];
		if(this.state.mycomments != []) {
			this.state.mycomments.forEach(function(element, index) {
				// console.log(element.comment);
				if(this.props.id == element.username) {
					htmlContent.push(
						<div key={index}>
							<Card>
								<CardHeader
									title={this.props.myname}
									avatar={this.props.image}
									subtitle={element.comment}
									subtitleStyle={{ color: 'black', fontWeight: 'bold'}}
								/>
							</Card><br/>
						</div>
					)
				}
			}, this)
		}
		return htmlContent;
	}

	render() {
		// const { fields: { textvalue }, handleSubmit } = this.props;
		return(
			<div>
				<CardActions>
					<FlatButton label="Like" hidden={this.state.hideLikeButton} onClick={this.onPostLike.bind(this, this.props.id)} />
					<FlatButton label="Unlike" hidden={this.state.hideUnlike} onClick={this.onPostUnlike.bind(this, this.props.id)} />
					<FlatButton label="Comment" onClick={this.onComment.bind(this, this.props.id)} />
				</CardActions>
				<div hidden={this.state.hideLike}> <strong>{this.props.myname}</strong> liked this </div>
				<div hidden={this.state.textDiv}>
					<form id={this.props.id} onSubmit={this.handleSubmit.bind(this)}>
						<input type="text" value={this.state.textvalue} onChange={this.onTextChange.bind(this)} />	
					</form><br/>
					{this.getComments()}
				</div>
			</div>
		);
	}
}

export default PostsFeed;