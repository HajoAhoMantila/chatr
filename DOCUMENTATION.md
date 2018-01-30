# Development documentation

## Decision log

### Node + React is used
...as the goal is to learn it.

### ES6 with ES7 extensions is used
It's the default used by create-react-app.

### JsGiven Scenario tests are written for functional tests
To have readable test output documenting the system behaviour.

### AirBnb JavaScript coding style is adopted (https://github.com/airbnb/javascript)
Seems to be a sane default choice.

### Only Immutable objects are used as React state objects
All objects set as state and passed as props must be immutable 
(as proposed by https://reactjs.org/docs/react-component.html#state).
This enforces explicit state handling, resulting in more understandable code and less bugs.

## Resources

### Basic node & tooling

nvm - Node Version Manager
https://github.com/creationix/nvm

Babel
https://babeljs.io/

updtr - automatic update + test of dependencies
https://github.com/peerigon/updtr

### Testing

Jest testrunner
https://facebook.github.io/jest/
https://facebook.github.io/jest/docs/en/getting-started.html

E2E Testing: React + Navalia 
https://codeburst.io/composable-end-to-end-tests-for-react-apps-2ec82170af62

Navalia
https://joelgriffith.github.io/navalia/

Example JsGiven BDD tests with Jest and Node 8 
https://github.com/jsGiven/jsGiven/tree/master/examples/jest-node-8 

SinonJS: Standalone test spies, stubs and mocks for JavaScript. 
http://sinonjs.org/

## Linting

AirBnb Code style
https://github.com/airbnb/javascript

ESLint for React with AirBnb configuration
https://groundberry.github.io/development/2017/06/11/create-react-app-linting-all-the-things.html

Webstorm configuration
https://www.themarketingtechnologist.co/eslint-with-airbnb-javascript-style-guide-in-webstorm/

### React

Create React App
https://github.com/facebookincubator/create-react-app

React Documentation
https://reactjs.org/docs/forms.html

Redux
https://github.com/reactjs/redux

React app directory layout
https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1

Real World React + Redux
https://github.com/gothinkster/react-redux-realworld-example-app

React testing
https://facebook.github.io/jest/docs/en/tutorial-react.html

Enzyme for component testing
http://airbnb.io/enzyme/

Immutability
http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/
https://facebook.github.io/immutable-js/

### Styling

https://react-bootstrap.github.io/


### Express & Socket.IO

https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34 
https://github.com/onedesign/express-socketio-tutorial

### Setup of integrated projects
React + Express + Heroku deployment 
https://originmaster.com/running-create-react-app-and-express-crae-on-heroku-c39a39fe7851

React + Node
https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/

### Travis CI

Ubuntu Trusty build environment
https://docs.travis-ci.com/user/reference/trusty/

Node.js
https://docs.travis-ci.com/user/languages/javascript-with-nodejs/

Chrome Headless
https://docs.travis-ci.com/user/chrome
