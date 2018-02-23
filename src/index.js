import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Routes from './routes';
import * as firebase from 'firebase';

// Initialized Firebase here

var config = {
    apiKey: "AIzaSyDE6kvOb4x1Kkvk8SLUKMatERDrjJM4dD8",
    authDomain: "subhojits-project.firebaseapp.com",
    databaseURL: "https://subhojits-project.firebaseio.com",
    projectId: "subhojits-project",
    storageBucket: "subhojits-project.appspot.com",
    messagingSenderId: "709947698373"
};
firebase.initializeApp(config);

firebase.auth().languageCode = 'en';

// Have set the route here

ReactDOM.render(
	<Router history={browserHistory} routes={Routes} />,
	document.querySelector('.container')
);