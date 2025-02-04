import os
from .build_info import LocalMavenBuildInfo
from .deployment_validator_configuration import DeploymentValidatorConfiguration
from .deployment_validator import DeploymentValidator
from .environment import Environment
from datetime import timedelta
from .command import Command
from abc import ABC, abstractmethod


class Deployment(ABC):
    def get_war_file_path(self,directory):
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith(".war"):
                    return file
        return None

    def __init__(self,root:str):
        os.chdir(root)
        self.root = os.getcwd()
        self.target_directory = f"{self.root}/corvallis-happenings"

    def run_pipeline(self):
        try: 

            self.build()
            
            self.deploy()

        except Exception as e:
            print(f"Exception occurred: {e}")
            raise Exception(f"Deployment failed {e}")
        
        env = self.get_environment()
        return self.validate(env)

    @abstractmethod
    def get_environment(self):
        pass
        

    def build(self):
        """
        mvn org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.version
        """
        print(f"running build locally from {self.target_directory}.")
        cmd = Command()
        build_command = 'mvnw.cmd clean package'
        result, last_line = cmd.execute_with_dir(self.target_directory,build_command)
        print(f"build result: {result} with line '{last_line}'")

    @abstractmethod
    def deploy(self):
        pass
                
    def validate(self,env):
        new_build_info = self.getBuildInfoMetadata()

        print("validating deployment")
        config = DeploymentValidatorConfiguration.from_environment(env)
        validator = DeploymentValidator(configuration=config)
        isSuccessful = validator.validate(target_build_time_of_deployment=new_build_info, 
                           time_limit=timedelta(minutes=1), 
                           retry_interval=timedelta(seconds=5))
                           
        print(f"Deployment validation {'successfull' if isSuccessful else 'failed'}")
        return isSuccessful

    def getBuildInfoMetadata(self):
        start_cwd = os.getcwd()
        os.chdir(self.target_directory)
        cwd = os.getcwd()
        print(f"current working directory: {cwd}")
        localBuildInfo = LocalMavenBuildInfo(f"{cwd}/target/classes/META-INF/build-info.properties")
        new_build_info = localBuildInfo.get_build_info()
        os.chdir(start_cwd) # revert back
        return new_build_info

