import os
from .build_info import LocalMavenBuildInfo
from .deployment_validator_configuration import DeploymentValidatorConfiguration
from .deployment_validator import DeploymentValidator
from .environment import Environment
from datetime import timedelta
from .command import Command
from .deployment import Deployment
from ..local_config import LocalConfig

class LocalDeployment(Deployment):

    def __init__(self,root:str):
        super().__init__(root)        

    def deploy(self):
        local_tomcat_home = LocalConfig().tomcat_home
        web_apps_dir = f"{local_tomcat_home}/webapps"
        root_war_file = f"{web_apps_dir}/ROOT.war"
        cmd = Command()

        result, last_line = cmd.execute_with_dir(self.target_directory,
                                                 f"rm -f {root_war_file}") # -f means ignore if the file doesn't exist
        
        print(f"remove war result: {result} with line '{last_line}'")            
        assert result == 0

        war_file_path = self.get_war_file_path(f"{self.target_directory}/target")

        print(f"Deploying war file: {war_file_path}")
        result, last_line = cmd.execute_with_dir(self.target_directory,
                                                 f"cp {self.target_directory}/target/{war_file_path} {root_war_file}")

    
    def get_environment(self):        
        validation_url = "http://localhost:8080/actuator/info"
        env = Environment("personal", service_url=validation_url)
        return env
    