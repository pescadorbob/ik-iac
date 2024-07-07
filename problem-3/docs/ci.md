# Continuous Integration Pipeline

This document describes how the continuous integration pipeline works for this application. It describes how to prepare an environment for deployment (E.g. DEV, QA or PROD). 

With the environments in place, this describe and how to build and deploy to that environment, and how the scripts themselves verify the deployment was completed successfully.

# Prepare a deployment environment

In order to deploy the application, An elastic beanstalk environment must be prepared.

The environment scripts use python to call node scripts, located in the `pipeline/prepare-environment` directory.

## Pre-requisites
- python: 3.12.4
- npm: 10.2.4
- node: 18.19.1



