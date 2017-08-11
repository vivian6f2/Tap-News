// import 'materialize-css/dist/css/materialize.min.css';
// import 'materialize-css/dist/js/materialize.js';
import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import NewsPanel from '../NewsPanel/NewsPanel';


class App extends Component {
  render() {
    // console.log('in App.js: ' + this.props.params.keyword);
    // console.log('in App.js: ' + this.props.params.topic);
    return (
      <div>
        <div className="container">
          <NewsPanel topic={this.props.params.topic} keyword={this.props.params.keyword} list={this.props.params.list}/>
        </div>
      </div>
    );
  }
}

export default App;

// <img className="logo" src={logo} alt="logo" />