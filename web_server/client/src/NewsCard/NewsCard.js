import React from 'react';
import './NewsCard.css';
import Auth from '../Auth/Auth';
import logo from '../App/logo.png';

class NewsCard extends React.Component {
	constructor() {
		super();
		this.state = {reRender:false};
	}
	redirectToUrl(event, url) {
		event.preventDefault();
		this.sendClickLog();
    	window.open(url, '_blank');
	}

	sendClickLog(){//http://localhost:3000
		let url = '/news/userId/' + Auth.getEmail() + '/newsId/' + encodeURIComponent(this.props.news.digest);
		let request = new Request(encodeURI(url), {
			method: 'POST',
			headers: {
				'Authorization': 'bearer ' + Auth.getToken(),
			},
			cache: 'no-cache'
		});
		fetch(request);
	}

	sendClickLikeLog(event, click){
		event.preventDefault();
		if(click){
			this.props.news.like = false;
			let digest = this.props.news.digest;
			console.log('unclick like: ' + digest);
			//http://localhost:3000
			let url = '/click/unlike/userId/' + Auth.getEmail() + '/newsId/' + encodeURIComponent(this.props.news.digest);
			console.log(url);
			let request = new Request(encodeURI(url), {
				method: 'POST',
				headers: {
					'Authorization': 'bearer ' + Auth.getToken(),
				},
				cache: 'no-cache'
			});
			fetch(request);
		}
		else{
			this.props.news.like = true;
			let digest = this.props.news.digest;
			console.log('click like: ' + digest);
			//http://localhost:3000
			let url = '/click/like/userId/' + Auth.getEmail() + '/newsId/' + encodeURIComponent(this.props.news.digest);
			console.log(url);
			let request = new Request(encodeURI(url), {
				method: 'POST',
				headers: {
					'Authorization': 'bearer ' + Auth.getToken(),
				},
				cache: 'no-cache'
			});
			fetch(request);
		}

		if(this.isInReadLater()){
			let digest = this.props.news.digest;
			let list = localStorage.getItem('readLater');
			list = JSON.parse(list);
			for(var index in list){
				if(this.props.news.digest === list[index]['digest']) {
					list[index]['like'] = this.props.news.like;
				}
			}
			localStorage.setItem('readLater', JSON.stringify(list));
		}

		this.setState({reRender:(!this.state.reRender)});
		//handler();
		
		event.stopPropagation();
	}

	sendClickReadLaterLog(event, handleChangeLabel){
		event.preventDefault();
		if(this.isInReadLater()){
			let digest = this.props.news.digest;
			console.log('unclick read later: ' + digest);
			let list = localStorage.getItem('readLater');
			list = JSON.parse(list);
			//delete list[this.props.news.digest];
			for(var index in list){
				if(this.props.news.digest === list[index]['digest']) {
					list.splice(index, 1);
				}
			}

			localStorage.setItem('readLater', JSON.stringify(list));
		}
		else{
			let digest = this.props.news.digest;
			console.log('click read later: ' + digest);
			if(localStorage.getItem('readLater') === null){
				let list = [];
				list.push(this.props.news);
				//console.log(list);
				localStorage.setItem('readLater', JSON.stringify(list));
			}
			else{
				let list = localStorage.getItem('readLater');
				list = JSON.parse(list);
				list.push(this.props.news);
				//console.log(list);
				localStorage.setItem('readLater', JSON.stringify(list));
			}

		}
		this.setState({reRender:(!this.state.reRender)});
		//handler();
		handleChangeLabel();
		event.stopPropagation();
	}

	isInReadLater(){
		if(localStorage.getItem('readLater') === null){
			return false
		}
		else{
			let list = localStorage.getItem('readLater');
			list = JSON.parse(list);
			//console.log(list);
			for(var index in list){
				if(this.props.news.digest === list[index]['digest']) {
					return true;
				}
			}
			return false;
		}

	}

	render (){
		return (
			<div className="row">
				<div className="col s12">
					<div className="card" onClick={(event) => this.redirectToUrl(event, this.props.news.url)}>
						<div className="card-image">
							<img src={this.props.news.urlToImage? this.props.news.urlToImage: logo} alt='news' />
							<div className="overlay"></div>
							<div className="ontop">
								<span className="card-title">{this.props.news.title}</span>
								<span className="btn-floating halfway-fab waves-effect waves-light btn-background btn-star" onClick={(event) => this.sendClickLikeLog(event,this.props.news.like)}><i className={(this.props.news.like) ?"small material-icons starClicked":"small material-icons starNonClick"}>grade</i></span>
								<span className="btn-floating halfway-fab waves-effect waves-light btn-background" onClick={(event) => this.sendClickReadLaterLog(event, this.props.handleChangeLabel)}><i className={(this.isInReadLater()) ? "small material-icons labelClicked":"small material-icons labelNonClick"}>label</i></span>
							</div>
						</div>
						<div className="card-content">
							<p className="news-description">{this.props.news.description}</p>
							<br/>
							<div>
								{this.props.news.reason != null && <div className='chip light-green lighten-2 news-chip grey darken-4 reason-chip'>{this.props.news.reason}</div>}
								{this.props.news.source != null && <div className='chip light-blue lighten-2 news-chip grey darken-4 source-chip'>{this.props.news.source}</div>}
								{this.props.news.time != null && <div className='chip amber lighten-2 news-chip grey darken-4 time-chip'>{this.props.news.time}</div>}
								{this.props.news.class != null && <div className='chip pink lighten-2 news-chip grey darken-4 class-chip'>{this.props.news.class}</div>}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default NewsCard;

			// <div className="news-container">
		 //        <div className='row'>
			// 		<div className='col s4 fill' onClick={(event) => this.redirectToUrl(event, this.props.news.url)}>
			// 			<img src={this.props.news.urlToImage} alt='news'/>
			// 		</div>
			// 		<div className="col s8">
			// 			<div className="news-intro-col" onClick={(event) => this.redirectToUrl(event, this.props.news.url)}>
			// 				<div className="news-intro-panel">
			// 					<h4>{this.props.news.title}</h4>
			// 					<div className="news-description">
			// 						<p>{this.props.news.description}</p>
			// 						<div>
			// 							{this.props.news.source != null && <div className='chip light-blue news-chip'>{this.props.news.source}</div>}
			// 							{this.props.news.reason != null && <div className='chip light-green news-chip'>{this.props.news.reason}</div>}
			// 							{this.props.news.time != null && <div className='chip amber news-chip'>{this.props.news.time}</div>}
			// 							{this.props.news.class != null && <div className='chip pink lighten-2 news-chip'>{this.props.news.class}</div>}
			// 						</div>
			// 						<div className="news-label">
			// 				            <span className={ (this.props.news.like) ? "forClick starClicked" : "forClick starNonClick"} onClick={(event) => this.sendClickLikeLog(event,this.props.news.like, this.props.handler)}><i className="small material-icons">grade</i></span>
			// 				        	<span className={ (this.isInReadLater()) ? "forClick labelClicked" : "forClick labelNonClick"} onClick={(event) => this.sendClickReadLaterLog(event, this.props.handler)}><i className="small material-icons">label</i></span>     
			// 		          		</div>
			// 					</div>
			// 				</div>
			// 			</div>
			// 		</div>
		 //        </div>
		 //    </div>

		// <a className="btn-floating halfway-fab waves-effect waves-light red"><i className="material-icons">add</i></a>
		//<span className={ (this.isInReadLater()) ? "btn-floating halfway-fab waves-effect waves-light labelClicked" : "btn-floating halfway-fab waves-effect waves-light labelNonClick"} onClick={(event) => this.sendClickReadLaterLog(event, this.props.handler)}><i className="small material-icons">label</i></span>     
					
					// <div className="horizontal">
					// 			<ul className="">
					// 				<li><span className={ (this.props.news.like) ? "btn-floating halfway-fab waves-effect waves-light starClicked" : "btn-floating halfway-fab waves-effect waves-light btn-floating starNonClick"} onClick={(event) => this.sendClickLikeLog(event,this.props.news.like, this.props.handler)}><i className="small material-icons">grade</i></span></li>
					// 				<li><span className={ (this.isInReadLater()) ? "btn-floating halfway-fab waves-effect waves-light labelClicked" : "btn-floating halfway-fab waves-effect waves-light labelNonClick"} onClick={(event) => this.sendClickReadLaterLog(event, this.props.handler)}><i className="small material-icons">label</i></span></li>     
					// 			</ul>
					// 		</div>