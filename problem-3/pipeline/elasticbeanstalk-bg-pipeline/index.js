"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
const cp = require("aws-cdk-lib/aws-codepipeline");
const cc = require("aws-cdk-lib/aws-codecommit");
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");
class CdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        //objects for access parameters
        const node = this.node;
        const blue_env = node.tryGetContext("blue_env");
        const green_env = node.tryGetContext("green_env");
        const app_name = node.tryGetContext("app_name");
        const bucket = new s3.Bucket(this, 'BlueGreenBucket', {
            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
        });
        const handler = new lambda.Function(this, 'BlueGreenLambda', {
            runtime: lambda.Runtime.PYTHON_3_6,
            code: lambda.Code.fromAsset('resources'),
            handler: 'blue_green.lambda_handler',
            environment: {
                BUCKET: bucket.bucketName
            }
        });
        bucket.grantReadWrite(handler);
        const repo = new cc.Repository(this, 'Repository', {
            repositoryName: 'MyRepositoryName',
        });
        const pipeline = new cp.Pipeline(this, 'MyFirstPipeline');
        const sourceStage = pipeline.addStage({
            stageName: 'Source'
        });
        const sourceArtifact = new cp.Artifact('Source');
        const sourceAction = new cpactions.CodeCommitSourceAction({
            actionName: 'CodeCommit',
            repository: repo,
            output: sourceArtifact,
        });
        sourceStage.addAction(sourceAction);
        const deployStage = pipeline.addStage({
            stageName: 'Deploy'
        });
        const lambdaAction = new cpactions.LambdaInvokeAction({
            actionName: 'InvokeAction',
            lambda: handler,
            userParameters: {
                blueEnvironment: blue_env,
                greenEnvironment: green_env,
                application: app_name
            },
            inputs: [sourceArtifact]
        });
        deployStage.addAction(lambdaAction);
    }
}
exports.CdkStack = CdkStack;
const app = new cdk.App();
new CdkStack(app, 'ElasticBeanstalkBG');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBb0M7QUFDcEMsa0VBQW1FO0FBQ25FLG1EQUFvRDtBQUNwRCxpREFBa0Q7QUFDbEQsaURBQWtEO0FBQ2xELHlDQUEwQztBQUUxQyxNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNyQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsK0JBQStCO1FBQy9CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFdkIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNwRCxnR0FBZ0c7WUFDaEcsc0dBQXNHO1lBQ3RHLHFHQUFxRztZQUNyRyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsc0NBQXNDO1NBQ2pGLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDM0QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQ3hDLE9BQU8sRUFBRSwyQkFBMkI7WUFDcEMsV0FBVyxFQUFFO2dCQUNYLE1BQU0sRUFBRSxNQUFNLENBQUMsVUFBVTthQUMxQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsY0FBYyxFQUFFLGtCQUFrQjtTQUNuQyxDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFMUQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUNwQyxTQUFTLEVBQUUsUUFBUTtTQUNwQixDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFakQsTUFBTSxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7WUFDeEQsVUFBVSxFQUFFLFlBQVk7WUFDeEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsTUFBTSxFQUFFLGNBQWM7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsV0FBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUdwQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ3BDLFNBQVMsRUFBRSxRQUFRO1NBQ3BCLENBQUMsQ0FBQztRQUdILE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLGtCQUFrQixDQUFDO1lBQ3BELFVBQVUsRUFBRSxjQUFjO1lBQzFCLE1BQU0sRUFBRSxPQUFPO1lBQ2YsY0FBYyxFQUFFO2dCQUNkLGVBQWUsRUFBRSxRQUFRO2dCQUN6QixnQkFBZ0IsRUFBRSxTQUFTO2dCQUMzQixXQUFXLEVBQUUsUUFBUTthQUN0QjtZQUNELE1BQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQztTQUN6QixDQUFDLENBQUM7UUFFSCxXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBR3RDLENBQUM7Q0FDRjtBQXRFRCw0QkFzRUM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUV4QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2RrID0gcmVxdWlyZSgnYXdzLWNkay1saWInKTtcclxuaW1wb3J0IGNwYWN0aW9ucyA9IHJlcXVpcmUoJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucycpO1xyXG5pbXBvcnQgY3AgPSByZXF1aXJlKCdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJyk7XHJcbmltcG9ydCBjYyA9IHJlcXVpcmUoJ2F3cy1jZGstbGliL2F3cy1jb2RlY29tbWl0Jyk7XHJcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJyk7XHJcbmltcG9ydCBzMyA9IHJlcXVpcmUoJ2F3cy1jZGstbGliL2F3cy1zMycpO1xyXG5cclxuZXhwb3J0IGNsYXNzIENka1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgLy9vYmplY3RzIGZvciBhY2Nlc3MgcGFyYW1ldGVyc1xyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZTtcclxuXHJcbiAgICBjb25zdCBibHVlX2VudiA9IG5vZGUudHJ5R2V0Q29udGV4dChcImJsdWVfZW52XCIpO1xyXG4gICAgY29uc3QgZ3JlZW5fZW52ID0gbm9kZS50cnlHZXRDb250ZXh0KFwiZ3JlZW5fZW52XCIpO1xyXG4gICAgY29uc3QgYXBwX25hbWUgPSBub2RlLnRyeUdldENvbnRleHQoXCJhcHBfbmFtZVwiKTtcclxuXHJcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdCbHVlR3JlZW5CdWNrZXQnLCB7XHJcbiAgICAgIC8vIFRoZSBkZWZhdWx0IHJlbW92YWwgcG9saWN5IGlzIFJFVEFJTiwgd2hpY2ggbWVhbnMgdGhhdCBjZGsgZGVzdHJveSB3aWxsIG5vdCBhdHRlbXB0IHRvIGRlbGV0ZVxyXG4gICAgICAvLyB0aGUgbmV3IGJ1Y2tldCwgYW5kIGl0IHdpbGwgcmVtYWluIGluIHlvdXIgYWNjb3VudCB1bnRpbCBtYW51YWxseSBkZWxldGVkLiBCeSBzZXR0aW5nIHRoZSBwb2xpY3kgdG9cclxuICAgICAgLy8gREVTVFJPWSwgY2RrIGRlc3Ryb3kgd2lsbCBhdHRlbXB0IHRvIGRlbGV0ZSB0aGUgYnVja2V0LCBidXQgd2lsbCBlcnJvciBpZiB0aGUgYnVja2V0IGlzIG5vdCBlbXB0eS5cclxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gTk9UIHJlY29tbWVuZGVkIGZvciBwcm9kdWN0aW9uIGNvZGVcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdCbHVlR3JlZW5MYW1iZGEnLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzYsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgncmVzb3VyY2VzJyksXHJcbiAgICAgIGhhbmRsZXI6ICdibHVlX2dyZWVuLmxhbWJkYV9oYW5kbGVyJyxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBCVUNLRVQ6IGJ1Y2tldC5idWNrZXROYW1lXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGJ1Y2tldC5ncmFudFJlYWRXcml0ZShoYW5kbGVyKTtcclxuXHJcbiAgICBjb25zdCByZXBvID0gbmV3IGNjLlJlcG9zaXRvcnkodGhpcywgJ1JlcG9zaXRvcnknLCB7XHJcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiAnTXlSZXBvc2l0b3J5TmFtZScsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjcC5QaXBlbGluZSh0aGlzLCAnTXlGaXJzdFBpcGVsaW5lJyk7XHJcblxyXG4gICAgY29uc3Qgc291cmNlU3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZSdcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IGNwLkFydGlmYWN0KCdTb3VyY2UnKTtcclxuXHJcbiAgICBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xyXG4gICAgICBhY3Rpb25OYW1lOiAnQ29kZUNvbW1pdCcsXHJcbiAgICAgIHJlcG9zaXRvcnk6IHJlcG8sXHJcbiAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXHJcbiAgICB9KTtcclxuXHJcbiAgICBzb3VyY2VTdGFnZS5hZGRBY3Rpb24oc291cmNlQWN0aW9uKTtcclxuXHJcblxyXG4gICAgY29uc3QgZGVwbG95U3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgIHN0YWdlTmFtZTogJ0RlcGxveSdcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBjb25zdCBsYW1iZGFBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkxhbWJkYUludm9rZUFjdGlvbih7XHJcbiAgICAgIGFjdGlvbk5hbWU6ICdJbnZva2VBY3Rpb24nLFxyXG4gICAgICBsYW1iZGE6IGhhbmRsZXIsXHJcbiAgICAgIHVzZXJQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgYmx1ZUVudmlyb25tZW50OiBibHVlX2VudixcclxuICAgICAgICBncmVlbkVudmlyb25tZW50OiBncmVlbl9lbnYsXHJcbiAgICAgICAgYXBwbGljYXRpb246IGFwcF9uYW1lXHJcbiAgICAgIH0sXHJcbiAgICAgIGlucHV0czogW3NvdXJjZUFydGlmYWN0XVxyXG4gICAgfSk7XHJcblxyXG4gICAgZGVwbG95U3RhZ2UuYWRkQWN0aW9uKGxhbWJkYUFjdGlvbik7XHJcblxyXG5cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XHJcblxyXG5uZXcgQ2RrU3RhY2soYXBwLCAnRWxhc3RpY0JlYW5zdGFsa0JHJyk7XHJcblxyXG5hcHAuc3ludGgoKTtcclxuIl19