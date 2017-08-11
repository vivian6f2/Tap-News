import Base from './Base/Base';
import App from './App/App';
import LoginPage from './Login/LoginPage';
import SignUpPage from './SignUp/SignUpPage';
import Auth from './Auth/Auth';
import UserPreference from './UserPreference/UserPreference';

const routes = {
	component: Base,
	childRoutes: [
		{
			path: '/',
			getComponent: (location, callback) => {
				if(Auth.isUserAuthenticated()){
					callback(null, App);
				}else{
					callback(null, LoginPage);
				}
			}
		},
		{
			path: '/login',
			component: LoginPage
		},
		{
			path: '/signup',
			component: SignUpPage
		},
		{
			path: '/logout',
			onEnter: (nextState, replace) => {
				Auth.deauthenticateUser();
				//Change current URL to /
				replace('/');
			}
		},
		{
			path: '/topics/:topic',
			getComponent: (location, callback) => {
				if(Auth.isUserAuthenticated()){
					callback(null, App);
				}else{
					callback(null, LoginPage);
				}
			}
		},
		{
			path: '/search/:keyword',
			getComponent: (location, callback) => {
				if(Auth.isUserAuthenticated()){
					callback(null, App);
				}else{
					callback(null, LoginPage);
				}
			}
		},
		{
			path: '/user/:list',
			getComponent: (location, callback) => {
				if(Auth.isUserAuthenticated()){
					callback(null, App);
				}else{
					callback(null, LoginPage);
				}
			}
		},
		{
			path: '/profile/preference',
			getComponent: (location, callback) => {
				if(Auth.isUserAuthenticated()){
					callback(null, UserPreference);
				}else{
					callback(null, LoginPage);
				}
			}
		}
	]
};

export default routes;