import React, {PropTypes, Component} from 'react';
import { Link, Redirect, browserHistory } from 'react-router';
import './NewsTabs.css';
import Auth from '../Auth/Auth';

const news_classes = require('../news_classes.json');


class NewsTabs extends Component {
	constructor() {
		super();
		this.state = {redirect:false, path:null};
	}

	handleOnClick(){
		console.log('click redirect');
		this.setState({redirect:true});
	}

	render(){
		//console.log('in newstabs');
		const news_tabs = news_classes['classes'].map(function(news_class) {
			var tab = news_class.split(' ');
			//return (<li className="tab"><Link to={'/topics/' + tab[0]} className={(window.location.pathname==="/topics/" + tab[0]) ? "active" : ""}>{news_class}</Link></li>)
			return (<li className="tab" ><a onClick={()=>{browserHistory.push('/topics/'+tab[0]);}} className={(window.location.pathname==="/topics/" + tab[0]) ? "active" : ""} >{news_class}</a></li>);
		});
		//console.log(this.state.news);

		
		return (
			<ul className="tabs tabs-transparent tabs-fixed-width">
				<li className="tab" ><a onClick={()=>{browserHistory.push('/');}} className={ (window.location.pathname==="/") ? "active" : ""}>Home</a></li>
				{news_tabs}
			</ul>
		);
	}
}

export default NewsTabs;