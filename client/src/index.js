import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatrApp from './ChatrApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ChatrApp />, document.getElementById('root'));
registerServiceWorker();
