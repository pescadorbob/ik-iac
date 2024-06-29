#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const cdk = require("aws-cdk-lib");
const elasticbeanstalk = require("aws-cdk-lib/aws-elasticbeanstalk");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
class CdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const ebRole = new aws_iam_1.Role(this, 'MyElasticBeanstalkRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('ec2.amazonaws.com'),
        });
        ebRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));
        ebRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkMulticontainerDocker'));
        ebRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'));
        const instanceProfile = new aws_iam_1.CfnInstanceProfile(this, 'MyInstanceProfile', {
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
exports.CdkStack = CdkStack;
const app = new cdk.App();
new CdkStack(app, 'ElasticBeanstalk');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsbUNBQW1DO0FBQ25DLHFFQUFxRTtBQUNyRSxpREFBZ0c7QUFHaEcsTUFBYSxRQUFTLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDckMsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sTUFBTSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUN0RCxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztTQUNyRCxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7UUFDOUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDO1FBQzNHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQztRQUVqRyxNQUFNLGVBQWUsR0FBRyxJQUFJLDRCQUFrQixDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN4RSxtQkFBbUIsRUFBRSxtQkFBbUI7WUFDeEMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUMzQixDQUFDLENBQUM7UUFFRCwrQkFBK0I7UUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV2QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFHeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ25FLGVBQWUsRUFBRSxPQUFPO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQWdCLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDbkUsZUFBZSxFQUFFLHFCQUFxQjtZQUN0QyxlQUFlLEVBQUUsR0FBRyxDQUFDLGVBQWUsSUFBSSxPQUFPO1lBQy9DLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLGNBQWMsRUFBRTtnQkFDTjtvQkFDSSxTQUFTLEVBQUUscUNBQXFDO29CQUNoRCxVQUFVLEVBQUUsb0JBQW9CO29CQUNoQyxLQUFLLEVBQUUsZUFBZSxDQUFDLG1CQUFtQjtpQkFDN0M7YUFDSjtTQUNSLENBQUMsQ0FBQztRQUVILG9FQUFvRTtRQUNwRSxHQUFHLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ25DLDhEQUE4RDtRQUM5RCxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7Q0FDRjtBQS9DRCw0QkErQ0M7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUV0QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGVsYXN0aWNiZWFuc3RhbGsgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNiZWFuc3RhbGsnO1xyXG5pbXBvcnQgeyBDZm5JbnN0YW5jZVByb2ZpbGUsIE1hbmFnZWRQb2xpY3ksIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICBjb25zdCBlYlJvbGUgPSBuZXcgUm9sZSh0aGlzLCAnTXlFbGFzdGljQmVhbnN0YWxrUm9sZScsIHtcclxuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcclxuICAgIH0pO1xyXG5cclxuICAgIGViUm9sZS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBV1NFbGFzdGljQmVhbnN0YWxrV2ViVGllcicpKTtcclxuICAgIGViUm9sZS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBV1NFbGFzdGljQmVhbnN0YWxrTXVsdGljb250YWluZXJEb2NrZXInKSk7XHJcbiAgICBlYlJvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQVdTRWxhc3RpY0JlYW5zdGFsa1dvcmtlclRpZXInKSk7XHJcblxyXG4gICAgY29uc3QgaW5zdGFuY2VQcm9maWxlID0gbmV3IENmbkluc3RhbmNlUHJvZmlsZSh0aGlzLCAnTXlJbnN0YW5jZVByb2ZpbGUnLCB7XHJcbiAgICAgIGluc3RhbmNlUHJvZmlsZU5hbWU6ICdNeUluc3RhbmNlUHJvZmlsZScsXHJcbiAgICAgIHJvbGVzOiBbZWJSb2xlLnJvbGVOYW1lXSxcclxuICB9KTtcclxuXHJcbiAgICAvL29iamVjdHMgZm9yIGFjY2VzcyBwYXJhbWV0ZXJzXHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlO1xyXG5cclxuICAgIGNvbnN0IGFwcE5hbWUgPSAnTXlBcHAnO1xyXG4gICAgXHJcblxyXG4gICAgY29uc3QgcGxhdGZvcm0gPSBub2RlLnRyeUdldENvbnRleHQoXCJwbGF0Zm9ybVwiKTtcclxuXHJcbiAgICBjb25zdCBhcHAgPSBuZXcgZWxhc3RpY2JlYW5zdGFsay5DZm5BcHBsaWNhdGlvbih0aGlzLCAnQXBwbGljYXRpb24nLCB7XHJcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogYXBwTmFtZVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZW52ID0gbmV3IGVsYXN0aWNiZWFuc3RhbGsuQ2ZuRW52aXJvbm1lbnQodGhpcywgJ0Vudmlyb25tZW50Jywge1xyXG4gICAgICBlbnZpcm9ubWVudE5hbWU6ICdNeVNhbXBsZUVudmlyb25tZW50JyxcclxuICAgICAgYXBwbGljYXRpb25OYW1lOiBhcHAuYXBwbGljYXRpb25OYW1lIHx8IGFwcE5hbWUsXHJcbiAgICAgIHBsYXRmb3JtQXJuOiBwbGF0Zm9ybSxcclxuICAgICAgb3B0aW9uU2V0dGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2U6ICdhd3M6YXV0b3NjYWxpbmc6bGF1bmNoY29uZmlndXJhdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uTmFtZTogJ0lhbUluc3RhbmNlUHJvZmlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGluc3RhbmNlUHJvZmlsZS5pbnN0YW5jZVByb2ZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHRvIGVuc3VyZSB0aGUgaW5zdGFuY2UgcHJvZmlsZSBpcyBjcmVhdGVkIGJlZm9yZSB0aGUgZW52aXJvbm1lbnQuXHJcbiAgICBlbnYuYWRkRGVwZW5kZW5jeShpbnN0YW5jZVByb2ZpbGUpO1xyXG4gICAgLy8gdG8gZW5zdXJlIHRoZSBhcHBsaWNhdGlvbiBpcyBjcmVhdGVkIGJlZm9yZSB0aGUgZW52aXJvbm1lbnRcclxuICAgIGVudi5hZGREZXBlbmRlbmN5KGFwcCk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xyXG5cclxubmV3IENka1N0YWNrKGFwcCwgJ0VsYXN0aWNCZWFuc3RhbGsnKTtcclxuXHJcbmFwcC5zeW50aCgpO1xyXG4iXX0=