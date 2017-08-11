import React from 'react';
import './NewsPanel.css';
import NewsCard from '../NewsCard/NewsCard';
import _ from 'lodash';
import Auth from '../Auth/Auth';
import ReadLaterList from '../ReadLaterList/ReadLaterList';

class NewsPanel extends React.Component {
	constructor() {
		super();
		this.state = {news:null, pageNum:1, loadedAll:false, topic:null, keyword:null, list:null, changeLabel:false};
		this.handleScroll = this.handleScroll.bind(this);
		//this.handleLocalStorageChange = this.handleLocalStorageChange.bind(this);
		this.handleChangeLabel = this.handleChangeLabel.bind(this);
	}
	componentDidMount() {
		this.loadMoreNews();
		this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
		window.addEventListener('scroll', this.handleScroll);
		//window.addEventListener('storage', this.handleLocalStorageChange);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps) console.log("nextProps: " + nextProps.topic + nextProps.keyword + nextProps.list);
		if(nextProps){
			if(nextProps.topic && (nextProps.topic !== this.state.topic)){
				this.setState({topic:nextProps.topic, news:null, loadedAll:false, pageNum:1, keyword:null, list:null});
			}
			else if(nextProps.keyword && (nextProps.keyword !== this.state.keyword)){
				this.setState({topic:null, news:null, loadedAll:false, pageNum:1, keyword:nextProps.keyword, list:null});
			}
			else if(nextProps.list && (nextProps.list !== this.state.list)){
				this.setState({topic:null, news:null, loadedAll:false, pageNum:1, keyword:null, list:nextProps.list});
			}
			else{
				this.setState({topic:null, news:null, loadedAll:false, pageNum:1, keyword:null, list:null});
			}
		}else{
			this.setState({topic:null, news:null, loadedAll:false, pageNum:1, keyword:null, list:null});
		}
		//console.log(this.state.loadedAll);
		this.loadMoreNews();
	}
	loadMoreNews() {
		if(this.state.loadedAll === true){
			return;
		}
		if(!this.props || (!this.props.topic && !this.props.keyword && !this.props.list)){
			//
			let url = '/news/userId/' + Auth.getEmail() + '/pageNum/' + this.state.pageNum;

			let require = new Request(encodeURI(url),{
				method: 'GET',
				headers: {
					'Authorization': 'bearer ' + Auth.getToken()
				},
				cache: 'no-cache'
			});
			fetch(require)
				.then((res) => res.json())
				.then((loadedNews) => {
					if(!loadedNews || loadedNews.length ===0){
						this.setState({loadedAll:true})
					}

					this.setState({
						news: this.state.news ? this.state.news.concat(loadedNews) : loadedNews,
						pageNum: this.state.pageNum + 1
					});
				})
			console.log("in homepage");
		}
		else{
			if(this.props.topic){
				console.log("in news panel search with topic!: " + this.props.topic);
				let url = '/news/userId/' + Auth.getEmail() + '/topic/' + this.props.topic + '/pageNum/' + this.state.pageNum;
				//console.log(encodeURI(url));

				let require = new Request(encodeURI(url),{
					method: 'GET',
					headers: {
						'Authorization': 'bearer ' + Auth.getToken()
					},
					cache: 'no-cache'
				});
				fetch(require)
					.then((res) => res.json())
					.then((loadedNews) => {
						if(!loadedNews || loadedNews.length ===0){
							this.setState({loadedAll:true})
						}

						this.setState({
							news: this.state.news ? this.state.news.concat(loadedNews) : loadedNews,
							pageNum: this.state.pageNum + 1
						});
					})
			}
			else if(this.props.keyword){
				console.log("in news panel search with keyword!: " + this.props.keyword);
				let url = '/news/userId/' + Auth.getEmail() + '/pageNum/' + this.state.pageNum + '/search/' + this.props.keyword;
				//console.log(encodeURI(url));

				let require = new Request(encodeURI(url),{
					method: 'GET',
					headers: {
						'Authorization': 'bearer ' + Auth.getToken()
					},
					cache: 'no-cache'
				});
				fetch(require)
					.then((res) => res.json())
					.then((loadedNews) => {
						if(!loadedNews || loadedNews.length ===0){
							this.setState({loadedAll:true})
						}

						this.setState({
							news: this.state.news ? this.state.news.concat(loadedNews) : loadedNews,
							pageNum: this.state.pageNum + 1
						});
					})
			}else if(this.props.list){
				if(this.props.list=='read_later'){
					console.log('in news panel user list: read_later');
					if(localStorage.getItem('readLater') === null){
						this.setState({loadedAll:true});
					}
					else{
						let list = localStorage.getItem('readLater');
						list = JSON.parse(list);
						//console.log(list);
						this.setState({news:list,loadedAll:true});
					}
				}
				else{
					console.log('in news panel user list: ' + this.props.list);
					let url = '/news/userId/' + Auth.getEmail() + '/list/' + this.props.list;
					//console.log(encodeURI(url));
					let require = new Request(encodeURI(url),{
						method: 'GET',
						headers: {
							'Authorization': 'bearer ' + Auth.getToken()
						},
						cache: 'no-cache'
					});
					fetch(require)
						.then((res) => res.json())
						.then((loadedNews) => {
							this.setState({loadedAll:true})

							this.setState({
								news: this.state.news ? this.state.news.concat(loadedNews) : loadedNews,
								pageNum: this.state.pageNum + 1
							});
						})
				}
			}
		}
	}
	handleChangeLabel(){
		this.setState({changeLabel:!(this.state.changeLabel)});
	}
	handleScroll(){
		let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
		if(((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) && this.state.loadedAll === false){
			console.log("Loading more news...");
			this.loadMoreNews();
		}
	}
	handleLocalStorageChange(){
		console.log('yeahhhh');
		if(this.props && this.props.list){
			console.log('localStorage changed');
			this.setState({loadedAll:false, news:null});
			this.loadMoreNews();
		}
	}
	renderNews(){
		//key={news.digest}
		const news_list = this.state.news.map(function(news) {
			return (
				<a className="list-group-item" href="#" key={news.digest}>
					<NewsCard news={news} handleChangeLabel={this.handleChangeLabel} changeLabel={this.state.changeLabel}/>
				</a>
			);
		}, this);
		//console.log(this.state.news);

		return (
			<div className="container-fluid">
				<div className="list-group">
					{news_list}
				</div>
			</div>
		);
	}
	renderReadLaterList(){
		if(!this.props || !(this.props.list=='read_later')){
			return (
				<ReadLaterList handleChangeLabel={this.handleChangeLabel} changeLabel={this.state.changeLabel}/>
			);
		}else{
			return;
		}
	}
	render() {
		if(this.state.news && this.state.news.length > 0){
			return (
				<div>
					{this.renderReadLaterList()}
					{this.renderNews()}
				</div>
			);
		}else if(this.state.loadedAll){
			return(
				<div>
					{this.renderReadLaterList()}
					No news!
				</div>
			);
		}else{
			return (
				<div>
					{this.renderReadLaterList()}
					<div className="progress changeMargin">
				    	<div className="indeterminate"></div>
					</div>
				</div>
			)
		}
	}
}


export default NewsPanel;