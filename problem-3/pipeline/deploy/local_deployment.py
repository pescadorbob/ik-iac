import os
from .build_info import LocalMavenBuildInfo
from .deployment_validator_configuration import DeploymentValidatorConfiguration
from .deployment_validator import DeploymentValidator
from .environment import Environment
from datetime import timedelta
from .command import Command

class LocalDeployment:


    def run_build(self):
        print("running build locally")
        isSuccessful = False
        target_directory = 'problem-3/corvallis-happenings'
        os.chdir(target_directory)
        cmd = Command()
        result, last_line = cmd.execute('mvnw.cmd clean package')
        print(f"build result: {result} with line '{last_line}'")
        
        result, last_line = cmd.execute('mvnw.cmd tomcat7:deploy')
        print(f"build result: {result} with line '{last_line}'")

        

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

