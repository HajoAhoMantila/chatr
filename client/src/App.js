import React, {Component} from 'react';
import './App.css';
import NicknameForm from './components/NicknameForm.js'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {nickname: ''};
    }

    setNickname(nickname) {
        console.log("setNickname " + nickname)
        this.setState({nickname: nickname});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">chatr</h1>
                    <div id="nickname">{this.state.nickname}</div>
                </header>
                <NicknameForm setNicknameCallback={this.setNickname.bind(this)}/>
            </div>
        );
    }
}

export default App;
