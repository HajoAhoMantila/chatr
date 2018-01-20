#!/bin/sh

# Basic node environment setup. Assumes nvm (https://github.com/creationix/nvm) is available.
# Source this script to bootstrap the dev environment.

nvm install

npm install -g yarn

yarn
