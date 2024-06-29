#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const cdk = require("aws-cdk-lib");
const elasticbeanstalk = require("aws-cdk-lib/aws-elasticbeanstalk");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
class CdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const appName = 'hello-world';
        const ebRole = new aws_iam_1.Role(this, `${appName}ElasticBeanstalkRole`, {
            assumedBy: new aws_iam_1.ServicePrincipal('ec2.amazonaws.com'),
        });
        ebRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));
        ebRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkMulticontainerDocker'));
        ebRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'));
        const instanceProfile = new aws_iam_1.CfnInstanceProfile(this, `${appName}InstanceProfile`, {
            instanceProfileName: `${appName}InstanceProfile`,
            roles: [ebRole.roleName],
        });
        //objects for access parameters
        const node = this.node;
        const platform = node.tryGetContext("platform");
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
        new s3.Bucket(this, `${appName}Bucket`, {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            publicReadAccess: true,
            blockPublicAccess: {
                blockPublicPolicy: false,
                blockPublicAcls: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            },
        });
        // to ensure the instance profile is created before the environment.
        env.addDependency(instanceProfile);
        // to ensure the application is created before the environment
        env.addDependency(app);
    }
}
exports.CdkStack = CdkStack;
const app = new cdk.App();
new CdkStack(app, 'ElasticBeanstalk');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBQ25DLHFFQUFxRTtBQUVyRSxpREFBZ0c7QUFDaEcseUNBQXlDO0FBR3pDLE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUM7UUFFOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsT0FBTyxzQkFBc0IsRUFBRTtZQUM5RCxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztTQUNyRCxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7UUFDOUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDO1FBQzNHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQztRQUVqRyxNQUFNLGVBQWUsR0FBRyxJQUFJLDRCQUFrQixDQUFDLElBQUksRUFBRSxHQUFHLE9BQU8saUJBQWlCLEVBQUU7WUFDaEYsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLGlCQUFpQjtZQUNoRCxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQzNCLENBQUMsQ0FBQztRQUVELCtCQUErQjtRQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXZCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNuRSxlQUFlLEVBQUUsT0FBTztTQUN6QixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ25FLGVBQWUsRUFBRSxHQUFHLE9BQU8sYUFBYTtZQUN4QyxlQUFlLEVBQUUsR0FBRyxDQUFDLGVBQWUsSUFBSSxPQUFPO1lBQy9DLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLGNBQWMsRUFBRTtnQkFDTjtvQkFDSSxTQUFTLEVBQUUscUNBQXFDO29CQUNoRCxVQUFVLEVBQUUsb0JBQW9CO29CQUNoQyxLQUFLLEVBQUUsZUFBZSxDQUFDLG1CQUFtQjtpQkFDN0M7YUFDSjtTQUNSLENBQUMsQ0FBQztRQUVILElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxPQUFPLFFBQVEsRUFBQztZQUNyQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsaUJBQWlCLEVBQUU7Z0JBQ2pCLGlCQUFpQixFQUFFLEtBQUs7Z0JBQ3hCLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixxQkFBcUIsRUFBRSxLQUFLO2FBQzdCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsb0VBQW9FO1FBQ3BFLEdBQUcsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbkMsOERBQThEO1FBQzlELEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztDQUNGO0FBekRELDRCQXlEQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBRXRDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgZWxhc3RpY2JlYW5zdGFsayBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWxhc3RpY2JlYW5zdGFsayc7XHJcblxyXG5pbXBvcnQgeyBDZm5JbnN0YW5jZVByb2ZpbGUsIE1hbmFnZWRQb2xpY3ksIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICBjb25zdCBhcHBOYW1lID0gJ2hlbGxvLXdvcmxkJztcclxuICAgIFxyXG4gICAgY29uc3QgZWJSb2xlID0gbmV3IFJvbGUodGhpcywgYCR7YXBwTmFtZX1FbGFzdGljQmVhbnN0YWxrUm9sZWAsIHtcclxuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcclxuICAgIH0pO1xyXG5cclxuICAgIGViUm9sZS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBV1NFbGFzdGljQmVhbnN0YWxrV2ViVGllcicpKTtcclxuICAgIGViUm9sZS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBV1NFbGFzdGljQmVhbnN0YWxrTXVsdGljb250YWluZXJEb2NrZXInKSk7XHJcbiAgICBlYlJvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQVdTRWxhc3RpY0JlYW5zdGFsa1dvcmtlclRpZXInKSk7XHJcblxyXG4gICAgY29uc3QgaW5zdGFuY2VQcm9maWxlID0gbmV3IENmbkluc3RhbmNlUHJvZmlsZSh0aGlzLCBgJHthcHBOYW1lfUluc3RhbmNlUHJvZmlsZWAsIHtcclxuICAgICAgaW5zdGFuY2VQcm9maWxlTmFtZTogYCR7YXBwTmFtZX1JbnN0YW5jZVByb2ZpbGVgLFxyXG4gICAgICByb2xlczogW2ViUm9sZS5yb2xlTmFtZV0sXHJcbiAgfSk7XHJcblxyXG4gICAgLy9vYmplY3RzIGZvciBhY2Nlc3MgcGFyYW1ldGVyc1xyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZTtcclxuXHJcbiAgICBjb25zdCBwbGF0Zm9ybSA9IG5vZGUudHJ5R2V0Q29udGV4dChcInBsYXRmb3JtXCIpO1xyXG5cclxuICAgIGNvbnN0IGFwcCA9IG5ldyBlbGFzdGljYmVhbnN0YWxrLkNmbkFwcGxpY2F0aW9uKHRoaXMsICdBcHBsaWNhdGlvbicsIHtcclxuICAgICAgYXBwbGljYXRpb25OYW1lOiBhcHBOYW1lXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlbnYgPSBuZXcgZWxhc3RpY2JlYW5zdGFsay5DZm5FbnZpcm9ubWVudCh0aGlzLCAnRW52aXJvbm1lbnQnLCB7XHJcbiAgICAgIGVudmlyb25tZW50TmFtZTogYCR7YXBwTmFtZX1FbnZpcm9ubWVudGAsXHJcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogYXBwLmFwcGxpY2F0aW9uTmFtZSB8fCBhcHBOYW1lLFxyXG4gICAgICBwbGF0Zm9ybUFybjogcGxhdGZvcm0sICAgICAgXHJcbiAgICAgIG9wdGlvblNldHRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiAnYXdzOmF1dG9zY2FsaW5nOmxhdW5jaGNvbmZpZ3VyYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbk5hbWU6ICdJYW1JbnN0YW5jZVByb2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpbnN0YW5jZVByb2ZpbGUuaW5zdGFuY2VQcm9maWxlTmFtZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgczMuQnVja2V0KHRoaXMsIGAke2FwcE5hbWV9QnVja2V0YCx7XHJcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWUsXHJcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiB7XHJcbiAgICAgICAgYmxvY2tQdWJsaWNQb2xpY3k6IGZhbHNlLFxyXG4gICAgICAgIGJsb2NrUHVibGljQWNsczogZmFsc2UsXHJcbiAgICAgICAgaWdub3JlUHVibGljQWNsczogZmFsc2UsXHJcbiAgICAgICAgcmVzdHJpY3RQdWJsaWNCdWNrZXRzOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHRvIGVuc3VyZSB0aGUgaW5zdGFuY2UgcHJvZmlsZSBpcyBjcmVhdGVkIGJlZm9yZSB0aGUgZW52aXJvbm1lbnQuXHJcbiAgICBlbnYuYWRkRGVwZW5kZW5jeShpbnN0YW5jZVByb2ZpbGUpO1xyXG4gICAgLy8gdG8gZW5zdXJlIHRoZSBhcHBsaWNhdGlvbiBpcyBjcmVhdGVkIGJlZm9yZSB0aGUgZW52aXJvbm1lbnRcclxuICAgIGVudi5hZGREZXBlbmRlbmN5KGFwcCk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xyXG5cclxubmV3IENka1N0YWNrKGFwcCwgJ0VsYXN0aWNCZWFuc3RhbGsnKTtcclxuXHJcbmFwcC5zeW50aCgpO1xyXG4iXX0=