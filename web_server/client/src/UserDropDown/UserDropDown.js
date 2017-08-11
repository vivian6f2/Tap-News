import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router';
import './UserDropDown.css';
import Auth from '../Auth/Auth';

class UserDropDown extends Component {
	clickEvent(){
		console.log("click user profile");
	}
    render() {
	    return (
			<div>	
				<ul id="userDropDown" className="dropdown-content">
					<li><Link to="/profile/preference">My preference</Link></li>
					<li><Link to="/user/like_list">Like list</Link></li>
					<li><Link to="/user/read_later">Read later</Link></li>
					<li className="divider"></li>
					<li><Link to="/logout">Log out</Link></li>
				</ul>
			</div>
	    );
    }
}

export default UserDropDown;