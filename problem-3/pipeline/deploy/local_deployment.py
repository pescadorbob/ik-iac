import os
from .build_info import LocalMavenBuildInfo
from .deployment_validator_configuration import DeploymentValidatorConfiguration
from .deployment_validator import DeploymentValidator
from .environment import Environment
from datetime import timedelta
from .command import Command

class LocalDeployment:

    def __init__(self,root:str):
        self.root = root
        self.target_directory = f"{self.root}/problem-3/corvallis-happenings"

    def run_pipeline(self):
        self.build()
        
        self.deploy()

        return self.validate()
        
    def validate(self):
        new_build_info = self.getBuildInfoMetadata()

        local_env = Environment("local",service_url="http://localhost:8080/actuator/info")
        print("validating deployment")
        config = DeploymentValidatorConfiguration.from_environment(local_env)
        validator = DeploymentValidator(configuration=config)
        isSuccessful = validator.validate(target_build_time_of_deployment=new_build_info, 
                           time_limit=timedelta(minutes=1), 
                           retry_interval=timedelta(seconds=5))
                           
        print(f"Deployment validation {'successfull' if isSuccessful else 'failed'}")
        return isSuccessful

    def build(self):
        print(f"running build locally from {self.target_directory}.")
        cmd = Command()
        build_command = 'mvnw.cmd clean package'
        result, last_line = cmd.execute_with_dir(self.target_directory,build_command)
        print(f"build result: {result} with line '{last_line}'")

    def deploy(self):
        cmd = Command()
        result, last_line = cmd.execute_with_dir(self.target_directory,'mvnw.cmd tomcat7:deploy')
        print(f"build result: {result} with line '{last_line}'")
        
        

    def getBuildInfoMetadata(self):
        start_cwd = os.getcwd()
        os.chdir(self.target_directory)
        cwd = os.getcwd()
        print(f"current working directory: {cwd}")
        localBuildInfo = LocalMavenBuildInfo(f"{cwd}/target/classes/META-INF/build-info.properties")
        new_build_info = localBuildInfo.get_build_info()
        os.chdir(start_cwd) # revert back
        return new_build_info

