import os
from .build_info import LocalMavenBuildInfo
from .deployment_validator_configuration import DeploymentValidatorConfiguration
from .deployment_validator import DeploymentValidator
from .environment import Environment
from datetime import timedelta
from .command import Command
from .artifact_repository import ArtifactRepository
from .deploy_to_eb import deploy_to_eb 
from abc import ABC, abstractmethod
from .deployment import Deployment
class AwsDeployment(Deployment):

    def __init__(self,root:str):
        super().__init__(root)

    def deploy(self):
        artifactRepository = ArtifactRepository()
        folder = 'elasticbeanstalk-helloworldbucket04224f88-akmbpvnn1hxb'
        
        artifactRepository.publish(folder,'corvallis-happenings.war',f"{self.target_directory}/target/corvallis-happenings-0.0.1-SNAPSHOT.war")

        deploy_to_eb(folder,'corvallis-happenings.war','hello-worldEnvironment','hello-world')

        
    def dev_pipeline(self):
        target_directory = f"{self.root}/problem-3/corvallis-happenings"
        buildInfo = self.build(target_directory)
        artifactRepository = ArtifactRepository()
        folder = 'elasticbeanstalk-helloworldbucket04224f88-akmbpvnn1hxb'
        
        artifactRepository.publish(folder,'corvallis-happenings.war',f"{target_directory}/target/corvallis-happenings-0.0.1-SNAPSHOT.war")

        deploy_to_eb(folder,'corvallis-happenings.war','hello-worldEnvironment','hello-world')

        aws_env = Environment("aws",service_url="http://hello-worldenvironment.eba-muraeydq.us-west-2.elasticbeanstalk.com/actuator/info")
        print("validating deployment")
        config = DeploymentValidatorConfiguration.from_environment(aws_env)
        validator = DeploymentValidator(configuration=config)
        isSuccessful = validator.validate(target_build_time_of_deployment=new_build_info, 
                           time_limit=timedelta(minutes=1), 
                           retry_interval=timedelta(seconds=5))
        
        print(f"Deployment validation {'successfull' if isSuccessful else 'failed'}")

        return isSuccessful

