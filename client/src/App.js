import React, {Component} from 'react';
import './App.css';
import NicknameForm from './components/NicknameForm.js'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">chatr</h1>
                </header>
                <NicknameForm/>
            </div>
        );
    }
}

export default App;
