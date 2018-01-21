import React, { Component } from 'react';
import './App.css';
import NicknameForm from './components/NicknameForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { nickname: '' };
    this.setNickname = this.setNickname.bind(this);
  }

  setNickname(nickname) {
    this.setState({ nickname });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">chatr</h1>
          <div id="nickname">{this.state.nickname}</div>
        </header>
        <NicknameForm setNicknameCallback={this.setNickname} />
      </div>
    );
  }
}

export default App;
