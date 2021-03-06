import React, { Component, PropTypes } from 'react';
import * as firebase from 'firebase';

class Login extends Component {

	constructor(props) {
		super(props);
	}

	static contextTypes = {
		router: PropTypes.object
	}

	handleClick() {
		var provider = new firebase.auth.GoogleAuthProvider();;
		let self = this;
		firebase.auth().signInWithPopup(provider).then(function(result) {
		  self.context.router.push("/postsfeed");
		}).catch(function(error) {
		});
	}

	render() {
		return(
			<div className="sign-in-div">
				<button className="sign-in-button" onClick={this.handleClick.bind(this)}>
					Sign in with Google
				</button>
			</div>
		);
	}
}

export default Login;