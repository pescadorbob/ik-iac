#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';

import { CfnInstanceProfile, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { WarBucket } from './war-bucket';



export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = 'MyApp';
    
    const ebRole = new Role(this, `${appName}ElasticBeanstalkRole`, {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));
    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkMulticontainerDocker'));
    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'));

    const instanceProfile = new CfnInstanceProfile(this, `${appName}InstanceProfile`, {
      instanceProfileName: `${appName}InstanceProfile`,
      roles: [ebRole.roleName],
  });

    //objects for access parameters
    const node = this.node;

    

    const platform = node.tryGetContext("platform");

    const bucket = new s3.Bucket(this, `${appName}Bucket`,{
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicPolicy: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });


    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName
    });

    const env = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: `${appName}Environment`,
      applicationName: app.applicationName || appName,
      platformArn: platform,
      optionSettings: [
                {
                    namespace: 'aws:autoscaling:launchconfiguration',
                    optionName: 'IamInstanceProfile',
                    value: instanceProfile.instanceProfileName,
                },
            ],
    });

    const warBucket = new WarBucket(app,'Bucket',appName,props)

    // to ensure the instance profile is created before the environment.
    env.addDependency(instanceProfile);
    // to ensure the application is created before the environment
    env.addDependency(app);
  }
}

const app = new cdk.App();

new CdkStack(app, 'ElasticBeanstalk');

app.synth();
