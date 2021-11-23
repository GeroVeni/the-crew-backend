#! /bin/bash

KEY_LOCATION="~/.ssh/aws-test-ubuntu.pem"
REMOTE="ubuntu@ec2-18-130-45-168.eu-west-2.compute.amazonaws.com"
REMOTE_DIR="~/crew/the-crew-backend"

echo "Building ..."
npm run build

echo "Copying files ..."
scp -i $KEY_LOCATION -r package.json package-lock.json docker-compose.yaml \
  Dockerfile dist/ $REMOTE:$REMOTE_DIR

echo "Restarting service ..."
ssh -i $KEY_LOCATION $REMOTE "cd $REMOTE_DIR && task deploy"
