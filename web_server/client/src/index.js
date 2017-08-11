import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

//import 'materialize-css/node_modules/jquery/dist/jquery.js';
//import 'velocity-animate/velocity.js';
import 'materialize-css/dist/css/materialize.min.css';
//import 'materialize-css/dist/js/materialize.js';

window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js');
require('materialize-css/dist/js/materialize.min.js');

// var $ = require('jquery/dist/jquery.js');
// require('velocity-animate/velocity.js');
// require('materialize-css/dist/css/materialize.css');
// require('materialize-css/dist/js/materialize.js');

ReactDOM.render(
	<Router history={browserHistory} routes={routes} />, 
	document.getElementById('root')
);
