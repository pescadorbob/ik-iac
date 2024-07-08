#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import { CfnInstanceProfile, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { WarBucket } from './war-bucket';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //objects for access parameters
    const node = this.node;
    let environmentName = node.tryGetContext("environment") 
    const appName = node.tryGetContext(environmentName)["appName"];
    
    const ebRole = new Role(this, `${appName}-ElasticBeanstalkRole`, {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));
    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkMulticontainerDocker'));
    ebRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'));

    const instanceProfile = new CfnInstanceProfile(this, `${appName}-instanceProfile`, {
      instanceProfileName: `${appName}-instanceProfile`,
      roles: [ebRole.roleName],
    });

    const platform = node.tryGetContext("platform");

    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName
    });

    environmentName = `${appName}-environment`;
    const env = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: environmentName,
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

    new cdk.CfnOutput(this, 'environmentUrl', {
      value: env.attrEndpointUrl.toString(),
    });
    new cdk.CfnOutput(this, 'environmentName', {
      value: environmentName,
    });

    // to ensure the instance profile is created before the environment.
    env.addDependency(instanceProfile);
    // to ensure the application is created before the environment
    env.addDependency(app);
  }
}

const app = new cdk.App();
const envName = app.node.tryGetContext("environment");
console.log(`Env Name:${envName}`);
const env = app.node.tryGetContext(envName);
console.log(env);
const appName = app.node.tryGetContext(envName)['appName']
new CdkStack(app, appName);
new WarBucket(app, `${appName}-war-bucket`, appName);

app.synth();
