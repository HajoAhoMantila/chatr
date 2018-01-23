[![Build Status](https://travis-ci.org/HajoAhoMantila/chatr.svg?branch=master)](https://travis-ci.org/HajoAhoMantila/chatr)

# chatr (https://chatr.herokuapp.com/)
Chat application MVP 

## Getting started

### Development dependencies

* The setup scripts for the dev environment assume nvm (Node Version Manager https://github.com/creationix/nvm) is available.
* A current version of Chrome is required for the functional tests 
 
### Development environment setup

To bootstrap the dev environment, source this script:

`. scripts/dev-setup.sh`

Later you can activate the environment using

`nvm use`

To run both client and server in dev mode with auto-reloading, run

`yarn start`

The React client listens at http://localhost:3000 and the backend at http://localhost:3001. 

### Running the tests

To run all tests (client, server and functional tests), run in the project root directory

 `yarn test`

The functional tests are BDD-style tests written with JsGiven (https://jsgiven.org/).
They will generate a pretty HTML test report at functional_tests/jGiven-report/index.html.

## Building & Deploying

### Running the integrated production build locally

To build and run the production build, run 

`yarn build`

and 

`yarn start:prod`

The integrated app will then listen at http://localhost:3001.

### Deploying to Heroku

To deploy a new revision to Heroku, run

`yarn deploy:prod`

This assumes you have previously set up a Heroku app using the Heroku CLI, e.g. 

`heroku login`
`heroku create chatr`
`heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs#yarn`
`git push heroku master`

### Testing the production app

To run the functional tests against the production app, execute 

`yarn test:prod`

(You will have to adapt the `CHATR_URL` specified in the `package.json` file.)