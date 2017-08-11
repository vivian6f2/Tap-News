import React from 'react';
import './ReadLaterList.css';
import Auth from '../Auth/Auth';

class ReadLaterList extends React.Component {
	constructor() {
		super();
		this.state = {list:null, showList:false};
		this.getReadLaterList();
	}

	componentDidMount(){
		//this.getReadLaterList();
	}

	redirectToUrl(event, url, digest) {
		event.preventDefault();
		this.sendClickLog(digest);
    	window.open(url, '_blank');
	}

	sendClickLog(digest){
		let url = '/news/userId/' + Auth.getEmail() + '/newsId/' + encodeURIComponent(digest);
		let request = new Request(encodeURI(url), {
			method: 'POST',
			headers: {
				'Authorization': 'bearer ' + Auth.getToken(),
			},
			cache: 'no-cache'
		});
		fetch(request);
	}

	getReadLaterList(){
		if(localStorage.getItem('readLater') === null){
			this.setState({list:null});
		}
		else{
			let list = localStorage.getItem('readLater');
			list = JSON.parse(list);
			if(list.length==0){
				this.setState({list:null});
			}
			else{
				this.setState({list:list});
			}
		}
	}

	clickReadLater(){
		if(this.state.showList){
			this.setState({showList:false});
		}
		else{
			this.getReadLaterList();
			this.setState({showList:true});
		}
	}

	removeNews(digest, handleChangeLabel){
		//console.log("hi");
		let list = localStorage.getItem('readLater');
		list = JSON.parse(list);
		//delete list[this.props.news.digest];
		for(var index in list){
			if(digest === list[index]['digest']) {
				list.splice(index, 1);
			}
		}

		localStorage.setItem('readLater', JSON.stringify(list));
		handleChangeLabel();
		this.getReadLaterList();
	}

	renderReadLaterList(){
		//this.getReadLaterList();
		let read_later_list = "";
		console.log(this.state.list);
		if(this.state.list!==null){
			read_later_list = this.state.list.map(function(list) {
				return (
					<tr>
						<td className="pointerEvent" onClick={() => this.removeNews(list.digest, this.props.handleChangeLabel)}><i className="tiny material-icons">close</i></td>
						<td className="pointerEvent" onClick={(event) => this.redirectToUrl(event, list.url, list.digest)}>{list.title}</td>
					</tr>
				);
			}, this);
		}else{
			read_later_list = "";
		}

		if(read_later_list !== "" && this.state.list!==null){
			//console.log("here");
			return (
				<div className="bottom-right-table readLaterList">
					<table className="bordered myTable">
						<tbody>
							{read_later_list}
						</tbody>
					</table>
				</div>
			);
		}else{
			//console.log('here!!');
			return(<div></div>);
		}
	}

	focusInCurrentTarget(relatedTarget, currentTarget){
		if (relatedTarget === null) return false;

		var node = relatedTarget.parentNode;

		while (node !== null) {
			if (node === currentTarget) return true;
			node = node.parentNode;
		}

		return false;
	}

	onBlur(e) {
		console.log('hi');
		if (!this.focusInCurrentTarget(e)) {
			console.log('table blurred');
		}
	}


	render() {
			return(
				<div>
					<div className={(this.state.showList? "":"hide")}>
						{this.renderReadLaterList()}
					</div>
					<div className="bottom-right-btn">
						<a className="btn-floating btn-large waves-effect waves-light btn-background" onClick={() => {this.clickReadLater()}}>
							<i className="large material-icons labelAbled">label</i>
						</a>
					</div>
				</div>
			);
		// }
		// else{
		// 	return(
		// 		<div className="fixed-action-btn">
		// 			<p className="btn-floating btn-large btn-background labelDisabled">
		// 				<i className="large material-icons labelDisabled">label</i>
		// 			</p>
		// 		</div>
		// 	);
		// }
	}
}


export default ReadLaterList;