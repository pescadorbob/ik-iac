import os
from .build_info import LocalMavenBuildInfo
from .deployment_validator_configuration import DeploymentValidatorConfiguration
from .deployment_validator import DeploymentValidator
from .environment import Environment
from datetime import timedelta
from .command import Command
from .deployment import Deployment

class LocalDeployment(Deployment):

    def __init__(self,root:str):
        super().__init__(root)        

    def deploy(self):
        cmd = Command()
        result, last_line = cmd.execute_with_dir(self.target_directory,'mvnw.cmd tomcat7:deploy')
        print(f"build result: {result} with line '{last_line}'")            