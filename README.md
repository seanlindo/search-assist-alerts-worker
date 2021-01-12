<h1 align="center">
  <img src="https://github.com/EngageTalent/lambda_boilerplate_node/blob/master/logo.jpg" alt="Markdownify" width="500">
  <br />
  lambda boilerplate (node.js)
  <br />
</h1>

<h4 align="center">Build Good Lambda Functions</h4>

<p align="center">
  <img src="https://forthebadge.com/images/badges/made-with-javascript.svg">
  <img src="https://forthebadge.com/images/badges/oooo-kill-em.svg">  
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">Prerequisites</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#env-variables">ENV Variables</a>
</p>

## Key Features

* Boilerplate code for connecting to the database, publishing SQS messages, etc.
* Uses [AWS SAM](https://aws.amazon.com/serverless/sam/)
* Can run as a standalone function or spin up a local API Gateway
* Run tests using Jest
* Use pg-streaming for database streaming applications

## Prerequisites

* Node.js v12.19.0
* Docker
* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-reference.html#serverless-sam-cli)

## How To Use

Fork repo, clone, and renamed to something your desire

After installing the SAM CLI, run `npm install`

Create your `.env` file

`npm start` will launch your Lambda function in a Lambda container

## ENV Variables

```
PAPERTRAIL_HOST     =
PAPERTRAIL_PORT     =
PROGRAM_NAME        =
MDB_CONN_STRING     =
COMPOSE_CONN_STRING =
QUEUE_URL           =
```

