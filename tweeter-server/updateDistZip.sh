#!/bin/bash

# use set -e to terminate the script on error
set -e

cd dist
zip -r dist.zip .
mv dist.zip ../dist.zip
cd ..
