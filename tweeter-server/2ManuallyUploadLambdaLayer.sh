#!/bin/bash

echo "TODO, YOU MUST UPLOAD A NEW LAMBDA LAYER MANUALLY"
echo "Step 1: In the AWS console, find the layer under layers"
echo "Step 2: Click to create a new version and upload the 'nodejs.zip' created by running '1BuildZips.sh'"
echo "Step 3: Return to 'tweeter-server' and update 'LAMBDALAYER_ARN' in the '.server' file with the new arn. Select Node.js 20.x as the runtime."
echo "Step 4: Proceed to run '3UploadLambdasAndLayers.sh'"