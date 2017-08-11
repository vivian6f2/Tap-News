//UI Part

import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import './UserPreferenceForm.css';
var Range = require('react-range');

const loop = (list, onChange)=>{
	//DONE: add number on bar
	const preference_list = [];
	for(var index in list){
		preference_list.push(
			<div className="row clearMargin">
				<div className="input-field col s12 clearMargin">
					<p>{list[index][0]}</p>
					<div className="row clearMargin">
						<p className="col s1 clearMargin">1</p>
						<Range className="slider col s10 clearMargin" name={index} value={list[index][1]} min={1} max={5} onChange={onChange}/>
						<p className="col s1 clearMargin">5</p>
					</div>
				</div>
			</div>
		);
	}
	//console.log(this.state.news);
	return (
		<div>{preference_list}</div>
	);
}

const UserPreferenceForm = (
	{
		onSubmit,
		onChange,
		preference
	}) => (
	<div className='container'>
		<div className='card-panel preference_panel'>
			<form className="col s12" action="/" onSubmit={onSubmit}>
				<h4 className="center-align">Change your preference</h4>
				{loop(preference, onChange)}
				<br />
				<div className="row right-align">
					<input type="submit" className="waves-effect waves-light btn teal lighten-1" value='Change'/>
				</div>
			</form>
		</div>
	</div>
);

UserPreferenceForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	preference: PropTypes.array.isRequired
};

export default UserPreferenceForm;