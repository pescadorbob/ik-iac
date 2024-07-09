from pipeline.scripts.deploy.aws_deployment import AwsDeployment
import os

print(f"Current Directory {os.getcwd()}")

deployment = AwsDeployment(".")
isSuccessful = deployment.run_pipeline()
print(f"Deployment completed {isSuccessful}")