#!/bin/sh

# Basic node environment setup. Assumes nvm (https://github.com/creationix/nvm) is available.
# Source this script to bootstrap the dev environment.

. scripts/dev-env.sh

nvm install $NODE_VERSION

npm install -g yarn

(cd functional_tests; yarn install)
