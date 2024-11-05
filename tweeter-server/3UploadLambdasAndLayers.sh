#!/bin/bash

# use set -e to terminate the script on error
set -e

# upload lambdas to cloud and uploat and attach new layer
./uploadLambdas.sh
./updateLayers.sh
