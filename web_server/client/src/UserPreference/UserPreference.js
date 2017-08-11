import React, {PropTypes} from 'react';
import UserPreferenceForm from './UserPreferenceForm';
import Auth from '../Auth/Auth';
import { toast } from 'react-toastify';
const news_classes = require('../news_classes.json');

class UserPreference extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			preference: [],
			news:null,
			loadedAll:true
		};

		this.processForm = this.processForm.bind(this);
		this.changeForm = this.changeForm.bind(this);

	}

	componentDidMount(){
		this.getOriginalPreference();
		this.setState({news:null, loadedAll:true});
		console.log(this.props);
	}

	isclose(a, b){
		var rel_tol = 0.000000001;
		var abs_tol = 0.0;
    	return Math.abs(a-b) <= Math.max(rel_tol * Math.max(Math.abs(a), Math.abs(b)), abs_tol);
	}

	handleValue(){
		console.log('handle value');
		var preference = this.state.preference;
		var max_v = 0;
		var min_v = 2;
		for(var index in preference){
			max_v = Math.max(max_v, preference[index][1])
			min_v = Math.min(min_v, preference[index][1])
		}
		//console.log(max_v + "   " + min_v);
		//console.log(preference);
		if(this.isclose(max_v, min_v)){
			for(index in preference){
				preference[index][1] = 3;
			}
		}else{
			var dif = (max_v - min_v) / 5;
			for(index in preference){
				preference[index][1] = Math.ceil((preference[index][1]-min_v)/dif);
			}
		}
		this.setState({preference});
	}

	getOriginalPreference(){
		let url = '/user/preferenceModel/userId/' + Auth.getEmail() ;

		let require = new Request(encodeURI(url),{
				method: 'GET',
				headers: {
					'Authorization': 'bearer ' + Auth.getToken()
				},
				cache: 'no-cache'
			});
			fetch(require)
				.then((res) => res.json())
				.then((loadedModel) => {
					console.log(loadedModel);
					var preference = this.state.preference;
					for(var index in news_classes['classes']){
						var field = news_classes['classes'][index];
						//console.log(loadedModel[field]);
						var value = loadedModel[field];
						var temp = [field, value];//Math.ceil((value*100)/20)];
						preference.push(temp);
					}
					this.setState({preference});
					//console.log(this.state.preference);
					this.handleValue();
				})
		
	}

	processForm(event) {
		event.preventDefault();
		// post preference model to server
		let url = '/user/setPreferenceModel/userId/' + Auth.getEmail() ;

		let require = new Request(encodeURI(url),{
				method: 'POST',
				headers: {
					'Authorization': 'bearer ' + Auth.getToken(),
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				cache: 'no-cache',
				body: JSON.stringify({
					preference:this.state.preference
				})
			});
			fetch(require)
				.then((res) => res.json())
				.then((answer) => {
					//console.log(answer);
					// const Toast = ({answer}) => <div>{answer}</div>;
					// const options = {
					// 	onOpen: props => console.log('open'),
					// 	onClose: props => console.log('colose'),
					// 	autoClose: 6000,
					// 	type: toast.TYPE.INFO,
					// 	position: toast.POSITION.BOTTOM_CENTER
					// };
					// console.log(answer);
					//toast(<Toast answer="answer"/>, options);
					alert(answer);
				})
	}

	changeForm(event) {
		// console.log(event);
		// console.log(event.target.value);
		// console.log(event.target.name);
		var preference = this.state.preference;
		var index = event.target.name;
		preference[index][1] = parseInt(event.target.value);
		console.log(preference[index]);
		this.setState({preference});
		console.log(this.state.preference);
	}

	render() {
		return (
			<UserPreferenceForm
				onSubmit={this.processForm}
				onChange={this.changeForm}
				preference={this.state.preference}
			/>
		);
	}
}

// // To make react-router work
// UserPreference.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default UserPreference;