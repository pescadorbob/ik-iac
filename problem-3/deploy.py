from pipeline.deploy.local_deployment import LocalDeployment
import os

print(f"Current Directory {os.getcwd()}")

deployment = LocalDeployment("../")
isSuccessful = deployment.run_pipeline()
print(f"Deployment completed {isSuccessful}")