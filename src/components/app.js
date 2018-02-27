import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase';

class App extends Component {

    static contextTypes = {
		router: PropTypes.object
    }
 
  	componentWillMount() {

		const self=this;
	    firebase.auth().onAuthStateChanged(function(user) {

	      /* Setting the routes if already authenticated */

	      if (user!=null) {
	  		  self.context.router.push("/postsfeed");
	      }
	      else {
	      	  self.context.router.push("/login");
	      }
	      
	    });
	}

  	render() {
	    return (
	      <MuiThemeProvider>
	      	<div>{this.props.children}</div>
	      </MuiThemeProvider>
	    );
  	}
}

export default App;