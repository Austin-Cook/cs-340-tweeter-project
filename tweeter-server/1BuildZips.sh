#!/bin/bash

# use set -e to terminate the script on error
set -e

# build tweeter-shared
cd ../tweeter-shared
npm run build

# build tweeter-server
cd ../tweeter-server
npm run build

# create zips for dist (lambdas) and nodejs (lambda layer of dependencies)
./updateDistZip.sh
./updateNodejsZip.sh