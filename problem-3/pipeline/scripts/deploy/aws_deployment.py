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
import os
from .artifact_version import get_version
from ..dev_config import DevConfig


class AwsDeployment(Deployment):

    def __init__(self,root:str):
        super().__init__(root)
        self.config = DevConfig()
        self.artifactRepository = self.config.get_artifact_repository()

    def deploy(self):
        
        war_file_path = self.get_war_file_path(f"{self.target_directory}/target")
        version_number = get_version(war_file_path)
        self.artifactRepository.publish('corvallis-happenings.war',
                                   f"{self.target_directory}/target/{war_file_path}")

        deploy_to_eb(self.config,'corvallis-happenings.war',self.config.environment_name,self.config.app_name,version_number)

    def get_environment(self):        
        env = Environment("aws", service_url=self.config.validation_url)
        return env
    
    def dev_pipeline(self):
        target_directory = f"{self.root}/problem-3/corvallis-happenings"
        buildInfo = self.build(target_directory)
        
        self.artifactRepository.publish('corvallis-happenings.war',f"{target_directory}/target/corvallis-happenings-0.0.1-SNAPSHOT.war")

        deploy_to_eb(self.config,'corvallis-happenings.war','hello-worldEnvironment','hello-world')
        
        aws_env = self.get_environment()
        print("validating deployment")
        config = DeploymentValidatorConfiguration.from_environment(aws_env)
        validator = DeploymentValidator(configuration=config)
        isSuccessful = validator.validate(target_build_time_of_deployment=buildInfo, 
                           time_limit=timedelta(minutes=3), 
                           retry_interval=timedelta(seconds=5))
        
        print(f"Deployment validation {'successfull' if isSuccessful else 'failed'}")

        return isSuccessful

if __name__ == "__main__":
    cwd = os.getcwd()
    print(cwd)
    deployment = AwsDeployment("/Users/yourname/Code/Problem-3")
    deployment.run_pipeline()