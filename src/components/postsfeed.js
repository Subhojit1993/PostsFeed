import React, { Component } from 'react';
import * as firebase from 'firebase';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import axios from 'axios';
import { Link } from 'react-router';

const url = "https://api.jsonbin.io/b/5a92b3cba121bc097fe72ca9";

const signOutStyle = {
	backgroundColor: 'lightseagreen',
	color: 'white',
	fontWeight: 'bold',
	float: 'right',
	marginTop: '2%'
};

const signoutMainStyle = {
    width:'100%',
    textAlign: 'center',
    marginLeft:'0%'
};
const signoutActionStyle = {
    background: '#1E2430',
    color: 'white',
    textAlign: 'center'
};

const signoutStyle = {
    background: '#1E2430',
    color: 'white'
};

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
			localLikes: [],
			open_signout: false
		};
		this.getPosts = this.getPosts.bind(this);
		this.onSignOut = this.onSignOut.bind(this);
		this.onConfirmSignOut = this.onConfirmSignOut.bind(this);
		this.closeSignOut = this.closeSignOut.bind(this);
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

	componentDidMount() {
		const self=this;
	    firebase.auth().onAuthStateChanged(function(user) {
	      if(user==null) {
	          window.location = '/';
	      }
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

	onSignOut() {
		firebase.auth().signOut().then(function() {
	      console.log('Signed Out');
	      }, function(error) {
	      console.error('Sign Out Error', error);
	    });
	}

	closeSignOut(e) {
        e.preventDefault();
        this.setState({
            open_signout: false
        });
    };

	onConfirmSignOut(e) {
        e.preventDefault();
        this.onSignOut();
    }

    onSignOutClick() {
    	this.setState({
    		open_signout: true
    	})
    }

	render() {
		const actions = [
            <FlatButton
                    label="Yes"
                    primary={true}
                    onClick={this.onConfirmSignOut}
            />,
            <FlatButton
                    label="No"
                    primary={true}
                    onClick={this.closeSignOut}
            />,
        ];
		return(
			<div className="container">
				<Card className="container card-class-one">
					<div className="row">
						<div className="col-sm-4 col-xs-6">
							<CardHeader
								title="Posts Feed"
								avatar={this.state.image}
							/>
						</div>
						<div className="col-sm-8 col-xs-6">
							<FlatButton label="Sign Out" style={signOutStyle} onClick={this.onSignOutClick.bind(this)} />
						</div>
						<Dialog
	                        actions={actions}
	                        modal={false}
	                        open={this.state.open_signout}
	                        onRequestClose={this.closeSignOut}
	                        style={signoutMainStyle}
	                        bodyStyle={signoutStyle}
	                        actionsContainerStyle={signoutActionStyle}
	                    >
                        <strong> Are you sure you want to logout from the page? </strong>
                    </Dialog>
					</div>
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
		let likes = [];
		var localLikes = localStorage.getItem('likes');
		console.log(localLikes);
		if(localLikes != null) {
			likes = localLikes.split(",");
			this.state.arr = likes.concat(username);
		}
		else {
			this.state.arr.push(username);
		}
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
		var a = { username: e.currentTarget.id, comment: this.state.textvalue, image: this.props.image, myname: this.props.myname };
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
									title={element.myname}
									avatar={element.image}
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