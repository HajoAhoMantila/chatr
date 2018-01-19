#!/bin/sh

# Basic node environment setup. Assumes nvm (https://github.com/creationix/nvm) is available.

nvm install 8.9.4

npm install -g yarn

yarn install
