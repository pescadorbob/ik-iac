#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/**
 * Stack that defines the bucket
 */
export class WarBucket extends cdk.Stack {
  public readonly warBucket: s3.Bucket;

  constructor(scope: Construct, id: string, appName: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucket = new s3.Bucket(this, `${appName}Bucket`,{
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicPolicy: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });
    this.warBucket = bucket;
    new cdk.CfnOutput(this, 'artifactBucketArn', {
      value: bucket.bucketName,
    });

  }
}


