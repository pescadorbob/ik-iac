import os
from .build_info import LocalMavenBuildInfo
from .deployment_validator_configuration import DeploymentValidatorConfiguration
from .deployment_validator import DeploymentValidator
from .environment import Environment
from datetime import timedelta
from .command import Command
from .deploy_war_to_s3 import DeployWarToS3

class LocalDeployment:

    def __init__(self,root:str):
        self.root = root

    def getBuildInfoMetadata(self):
        cwd = os.getcwd()
        print(f"current working directory: {cwd}")
        localBuildInfo = LocalMavenBuildInfo(f"{cwd}/target/classes/META-INF/build-info.properties")
        new_build_info = localBuildInfo.get_build_info()
        return new_build_info


    def run_build(self):
        isSuccessful = False
        target_directory = f"{self.root}/problem-3/corvallis-happenings"
        print(f"running build locally from {target_directory}.")
        os.chdir(target_directory)
        cmd = Command()
        result, last_line = cmd.execute('mvnw.cmd clean package')
        print(f"build result: {result} with line '{last_line}'")
        

        buildInfo = self.getBuildInfoMetadata()
        
        s3Deployer = DeployWarToS3()
        s3Deployer.deploy()

        

        cwd = os.getcwd()
        print(f"current working directory: {cwd}")
        localBuildInfo = LocalMavenBuildInfo(f"{cwd}/target/classes/META-INF/build-info.properties")
        new_build_info = localBuildInfo.get_build_info()

        local_env = Environment("local",service_url="http://localhost:8080/actuator/info")
        print("validating deployment")
        config = DeploymentValidatorConfiguration.from_environment(local_env)
        validator = DeploymentValidator(configuration=config)
        isSuccessful = validator.validate(target_build_time_of_deployment=new_build_info, 
                           time_limit=timedelta(minutes=1), 
                           retry_interval=timedelta(seconds=5))
        
        print(f"Deployment validation {'successfull' if isSuccessful else 'failed'}")

        return isSuccessful

