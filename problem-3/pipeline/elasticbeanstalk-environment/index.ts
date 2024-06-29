#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import { CfnInstanceProfile, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';


export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ebRole = new Role(this, 'MyElasticBeanstalkRole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));
    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkMulticontainerDocker'));
    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'));

    const instanceProfile = new CfnInstanceProfile(this, 'MyInstanceProfile', {
      instanceProfileName: 'MyInstanceProfile',
      roles: [ebRole.roleName],
  });

    //objects for access parameters
    const node = this.node;

    const appName = 'MyApp';
    

    const platform = node.tryGetContext("platform");

    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName
    });

    const env = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: 'MySampleEnvironment',
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

    // to ensure the instance profile is created before the environment.
    env.addDependency(instanceProfile);
    // to ensure the application is created before the environment
    env.addDependency(app);
  }
}

const app = new cdk.App();

new CdkStack(app, 'ElasticBeanstalk');

app.synth();
