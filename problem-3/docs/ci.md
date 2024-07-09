# Continuous Integration Pipeline

This document describes how the continuous integration pipeline works for this application. It describes how to prepare an environment for deployment (E.g. DEV, QA or PROD) and then deploy to it. With the environments in place, this describe how to build and deploy to that environment, and how the scripts themselves verify the deployment was completed successfully. Note, at this time, this only deploys to a 'dev' environment, but instructions are here to deploy to any new environment as well including prod.

# Prepare a deployment environment

In order to deploy the application, an Elastic Beanstalk (EB) application and environment must be prepared.

## Background on Elastic Beanstalk applications and environments

### Application

- An Elastic Beanstalk application is a logical collection of Elastic Beanstalk components, including environments, versions, and environment configurations.
- Conceptually, an application is similar to a folder that organizes related resources.
- It directly takes in your project code (such as a web application).
- You name an Elastic Beanstalk application the same as your project home directory.
- Applications can have multiple versions, each pointing to a specific, labeled iteration of deployable code (e.g., a Java WAR file).
- You can upload and deploy different application versions to test differences between them.

### Environment

- An environment is a collection of AWS resources running a specific application version.
- Each environment runs only one application version at a time.
- When you create an environment, Elastic Beanstalk provisions the necessary resources to run the specified application version.
- Environments are where your application actually runs, and they include computing resources, load balancing, scaling, and health monitoring.

Preparation includes an EB Application and Environment. Additionally, an S3 bucket to store the war file is required. Scripts for all this are found in the `pipeline/scripts` directory. Before running those scripts, install the following pre-requisites:

## Pre-requisites

- python: 3.12.4
- npm: 10.2.4
- node: 18.19.1
- AWS Account logged in from the CLI.
- aws cli: aws-cli/2.7.18

**Note:** installation of the above are left to the reader

After installing those pre-requisites, you can run the `prepare_dev_environment.py` script which will create the environment and application. It uses the CDK.

The environment python script `pipeline/scripts/prepare_dev_environment.py` calls node scripts written in TypeScript, located in the `pipeline/scripts/prepare-environment` directory. As long as node is installed, the scripts will run everything needed.

The scripts will install the following depen

- typescript: 5.1.6
- cdk: 2.2.202

From the command line:

```shell
cd pipeline/scripts
python prepare_dev_environment.py
...
dev-hello-world | 6/6 | 8:19:43 PM | CREATE_COMPLETE      | AWS::CloudFormation::Stack         | dev-hello-world

 ✅  dev-hello-world

✨  Deployment time: 291.61s

Outputs:
dev-hello-world.environmentUrl = awseb-e-u-AWSEBLoa-1SMMYAF23I97P-1447641468.us-west-2.elb.amazonaws.com
Stack ARN:
arn:aws:cloudformation:us-west-2:905418093247:stack/dev-hello-world/3fdc2810-3cd8-11ef-b035-064977033b77

✨  Total time: 293.59s
...
 ✅  dev-hello-world-war-bucket

✨  Deployment time: 13.3s

Outputs:
dev-hello-world-war-bucket.artifactBucketArn = dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux
Stack ARN:
arn:aws:cloudformation:us-west-2:905418093247:stack/dev-hello-world-war-bucket/944e6550-3be5-11ef-8ecf-02d967948677

✨  Total time: 15.29s
```

Verify the applications and environments exist in aws:
![Application created successfully](image.png)
![Environment created successfully](image-1.png)

These environments only need be created once, and then can be deployed to over and over again with the pipeline deploy script.

# Configure the deployment script

Take the 2 outputs from the command, the **EB domain url** and **the bucket**, and the name of the created environment 'appname-environment'and add them to the `DevConfig.py` python script. E.g.

- dev-hello-world.environmentUrl = awseb-e-u-AWSEBLoa-1SMMYAF23I97P-1447641468.us-west-2.elb.amazonaws.com
- dev-hello-world-war-bucket.artifactBucketArn = dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux
- environmentName = dev-hello-world-environment

E.g. it would look like this:

```python
class DevConfig:
    def __init__(self):
        self.name = "dev"
        # - dev-hello-world.environmentUrl = awseb-e-u-AWSEBLoa-1SMMYAF23I97P-1447641468.us-west-2.elb.amazonaws.com
        # - dev-hello-world-war-bucket.artifactBucketArn = dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux

        self.artifactory_bucket = "dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux"
        self.validation_url = "awseb-e-u-AWSEBLoa-1SMMYAF23I97P-1447641468.us-west-2.elb.amazonaws.com/actuator/info"
        self.app_name = "dev-hello-world"
        self.environment_name = "dev-hello-world-environment"

    def get_artifact_repository(self) -> ArtifactRepository:
        return ArtifactRepository(self.artifactory_bucket)
```

# Deploy the pipeline

A pipeline script named `aws_deploy.py` is available to run from `problem-3` that does the following:

- Build and test the war artifact with a new version and updated bulid metadata (checked in the validation step).
- Deploy the artifact to the bucket
- Add a new EB application version
- Update the EB Environment to use the new application version
- Validate the updated application build metadata to ensure the new application is available.

```shell
python aws_deploy.py
...
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
...
[INFO] Building war: C:\Users\bcfis\work\ik\cloud-iac\ik-iac\problem-3\corvallis-happenings\target\corvallis-happenings-0.0.1+b45.war
...
uploading corvallis-happenings.war to S3 bucket: dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux from C:\Users\bcfis\work\ik\cloud-iac\ik-iac\problem-3/corvallis-happenings/target/corvallis-happenings-0.0.1+b45.war
file uploaded to S3 bucket: dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux
...
build time of deployment: 2024-07-09T03:35:05.314Z target time of deployment: 2024-07-09T21:44:25.683Z
...
Deployment completed True
```

# Verifying the deployment is running the version expected

This application has the build metadata exposed from a public API `/actuator/info`. This endpoint is hit to verify that the version running is the same as the version built. This step has been automated as part of the deployment.

To confirm manually, however, unzip the built war. Open the file `META-INF/build-info.properties`

```properties
build.artifact=corvallis-happenings
build.group=edu.brent.ik.iac
build.name=corvallis-happenings
build.time=2024-06-30T22\:34\:58.984Z
build.version=0.0.1-SNAPSHOT
```

The build time `build.time=2024-06-30T22\:34\:58.984Z` gets updated for every build and can therefore be relied on from the build.

Find the domain url and hit the endpoint:

`curl -X GET http://awseb-e-u-awsebloa-1smmyaf23i97p-1447641468.us-west-2.elb.amazonaws.com/actuator/info`

```shell
curl -X GET http://awseb-e-u-awsebloa-1smmyaf23i97p-1447641468.us-west-2.elb.amazonaws.com/actuator/info | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   627    0   627    0     0   5826      0 --:--:-- --:--:-- --:--:--  6207
{
  "application": {
    "name": "Corvallis Happenings",
    "description": "An app that tells you the top events in Corvallis!",
    "version": ""
  },
  "build": {
    "artifact": "corvallis-happenings",
    "name": "corvallis-happenings",
    "time": "2024-07-09T21:44:25.683Z",
    "version": "0.0.1",
    "group": "edu.brent.ik.iac"
  },
  "java": {
    "version": "17.0.11",
    "vendor": {
      "name": "Amazon.com Inc.",
      "version": "Corretto-17.0.11.9.1"
    },
    "runtime": {
      "name": "OpenJDK Runtime Environment",
      "version": "17.0.11+9-LTS"
    },
    "jvm": {
      "name": "OpenJDK 64-Bit Server VM",
      "vendor": "Amazon.com Inc.",
      "version": "17.0.11+9-LTS"
    }
  },
  "os": {
    "name": "Linux",
    "version": "6.1.94-99.176.amzn2023.x86_64",
    "arch": "amd64"
  }
}
```

there you can see the same `"time": "2024-07-09T21:44:25.683Z",` and compare the 2.
