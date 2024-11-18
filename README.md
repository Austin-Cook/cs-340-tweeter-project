# Modules

## 1. Tweeter-Web

The React website, written in TypeScript and React TSX.

## 2. Tweeter-Server

The server code. This project uses AWS lambda functions for a serverless system, rather than a traditional server.

Lambda functions are uploaded to AWS, which takes care of running and managing them.

A lambda layer is also created with dependencies needed by the lambda functions. These lambda functions include the `node_modules` folder of tweeter-server as well as the entire `tweeter-shared` module, which is placed in a copy of `node-modules`. The folder is zipped (and titled Nodejs.zip though the name is arbitrary), and uploaded manually to AWS under the lambda layers section of lambda in the online console.

The lambda functions are uploaded automatically by running a script, after which another script attaches the previously uploaded lambda layer to each one.

Details about building and deploying are found below.

## 3. Tweeter-Shared

Code common to both Tweeter-Web and Tweeter-Server, such as model objects, data transfer objects (DTOs), and requests and responses.

# Setup, Rebuild and Run

## Setup the Project

1. cd into the project root folder
1. Run `npm install`
1. cd into the tweeter-shared folder
1. Run `npm install`
1. Run `npm run build`
1. cd into the tweeter-web folder
1. Run `npm install`
1. Run `npm run build`

**Note:** VS Code seems to have a bug. After doing this, you should be able to run the project but code editors report that they can't see the 'tweeter-shared' module. Restarting VS Code fixes the problem. You will likely need to restart VS Code every time you compile or build the 'tweeter-shared' module.

**Note:** If you are using Windows, make sure to use a Git Bash terminal instead of Windows Powershell. Otherwise, the scripts won't run properly in tweeter-shared and it will cause errors when building tweeter-web.

## Rebuild the Project

Rebuild either module after making any code or configuration changes. 

NOTE - The 'tweeter-web' module is dependent on 'tweeter-shared', so if you change 'tweeter-shared' you will also need to rebuild 'tweeter-web'. After rebuilding 'tweeter-shared' you will likely need to restart VS Code (see note above under 'Setting Up the Project').

1. cd into the tweeter-shared folder
1. Run `npm run build`
1. cd into the tweeter-web folder
1. Run `npm run build`

## Run the Project (Web Client)

Run the project by running `npm start` from within the `tweeter-web` folder.

# Deploying Lambda Functions

This needs to be done each time a change is made to a Lambda function or it's dependencies (`tweeter-server` utilities or `tweeter-web`)..

This process has several steps, but I have created several scripts (with `updateLayers.sh` and `updateLambdas.sh` being provided by the teacher) to automate most of the process.

## Full Steps (TLDR Instructions At Bottom RECOMMENDED)
### 1) Build modules and create zips

NOTE - This entire step (1) is automated by running `1BuildZips.sh`

- Rebuild `tweeter-shared`
  - In `tweeter-shared` run `npm run build`
- Rebuild tweeter-server
  - In `tweeter-server` run `npm run build`
- Create `Nodejs.zip` with dependencies for the Lambda layer
  - Create a copy of `tweeter_sever/node_modules`
  - Copy and paste the entire `tweeter_shared` directory inside the copied `node_modules`
  - Zip the copied `node_modules` as `Nodejs.zip`
- Create `dist.zip` containing the lambda functions
  - Zip `tweeter-server/dist` as `dist.zip`
  - Make sure that `dist.zip` in directly under the `tweeter-server` so the shell script can find it

### 2) Re-upload the Lambda functions to AWS

- Run `uploadLambdas.sh` which automates this

### 3) Update Lambda layer If Needed

A new version of the lambda layer version is needed if changes are made to tweeter-shared or helper files in tweeter-server

3a. Manually upload `Nodejs.zip` to the AWS Console

- Open the AWS Console (in the web browers) to `Lambda`
- Click on lambda layers
- Click on the layer used for this project (probably called `tweeter-server-dependencies` or similar)
- Click to upload a new version
- Select `Nodejs 20.x` as the compatible runtime
- Upload `Nodejs.zip`
- Click to create the new version of the layer

3b. Update the ARN in the `.server` file

- Open `tweeter-server/.server`
- Set `LAMBDALAYER_ARN` to the new ARN for the new version of the lambda layer (typically just the last number changes, so you can just swap the number out)

2c. Attach the new lambda layer to each of the lambda functions

- Run `updateLayers.sh`

## TLDR Instructions

NOTE - YES, this is all you need to do:

1) Run `1BuildZips.sh` to build modules and create zips
2) Follow `3a` and `3b` above to upload the lambda layer and set the new version in the `.server` file
3) Run `3UploadLambdasAndLayers.sh` to upload the lambdas and attach the layer to each one

# Notes

## Timestamps

### In AuthTokens
- In Seconds
  - Because DynamoDB TTL requires timestamps in seconds to work
- Represents time when it will `expire`
  - Because DynamoDB TTL requires the timestamp is expiration time rather than creation time

### In Statuses
- In Milliseconds
  - So the status time can be displayed precicely
- Represents time when it was `created`
  - So we can display creation time of status
