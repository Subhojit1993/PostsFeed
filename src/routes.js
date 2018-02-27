import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Login from './components/login';
import App from './components/app';
import PostsFeed from './components/postsfeed';
import UserDetails from './components/user_details';

export default (
	<Route path="/" component={App} >
		<Route path="login" component={Login} />
		<Route path="postsfeed" component={PostsFeed} />
		<Route path="postsfeed/:username" component={UserDetails} />
	</Route>
);