#!/bin/bash

# use set -e to terminate the script on error
set -e

mkdir -p nodejs
cp -r node_modules nodejs/node_modules
rm -rf nodejs/node_modules/tweeter-shared
cp -r ../tweeter-shared nodejs/node_modules/tweeter-shared
zip -r nodejs.zip nodejs
