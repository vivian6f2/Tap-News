import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import './Base.css';
import Auth from '../Auth/Auth';
import UserDropDown from '../UserDropDown/UserDropDown';
import SearchForm from '../SearchForm/SearchForm';
import NewsTabs from '../NewsTabs/NewsTabs';

const Base = ({ children }) => (
	
<div>
	<nav className="nav-extended grey darken-4">
		<div className="nav-wrapper">
			<a href="/" className="brand-logo">  Tap News</a>
			<ul id="nav-mobile" className="right">
				{Auth.isUserAuthenticated() ?
				(
					<div>
						<li><SearchForm /></li>
						<li><a className="dropdown-button" data-activates="userDropDown" data-beloworigin="true" >{Auth.getEmail()}</a></li>	
					</div>


				)
				:
				(
					<div>
						<li className="hide"><SearchForm /></li>
						<li><a className="dropdown-button hide" data-activates="userDropDown" data-beloworigin="true" >{Auth.getEmail()}</a></li>
						<li><Link to="/login">Log in</Link></li>
						<li><Link to="/signup">Sign up</Link></li>
					</div>
				)
				}
				<UserDropDown />
				
			</ul>
		</div>
		<div className="nav-content">
			<NewsTabs />
		</div>
	</nav>
	<br/>
	<br/>
	{children}
</div>
);

Base.propTypes = {
    children: PropTypes.object.isRequired
};


export default Base;


				// <li className="tab" ><Link to="/topics/Politics" className={ (window.location.pathname==="/topics/Politics") ? "active" : ""}>Politics & Government</Link></li>
				// <li className="tab" ><Link to="/topics/World" className={ (window.location.pathname==="/topics/World") ? "active" : ""}>World</Link></li>
				// <li className="tab" ><Link to="/topics/Sports" className={ (window.location.pathname==="/topics/Sports") ? "active" : ""}>Sports</Link></li>