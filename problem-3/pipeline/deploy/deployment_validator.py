import json
from . import info_parser as parser
from datetime import timedelta
from .clock import Clock
from .info_gateway import InfoGateway

class DeploymentValidator:
    def __init__(self,deployment_info_gateway:InfoGateway,clock:Clock) -> None:
        self.deployment_info_gateway = deployment_info_gateway
        self.clock:Clock = clock
        pass
    
    def validate(self, target_build_time_of_deployment: str, time_limit: timedelta, retry_interval: timedelta):
        """validate will continue to poll the deployment info gateway with retry_interval until the buildTime is successfully resolved, or the time limit runs out.

        Args:
            buildTime (str): a string with the expected time stamp of when the build was made. E.g. '2024-06-30T04:04:31.441Z'
            time_limit (int): How long to continue polling for a successful deployment in seconds.
            retry_interval (int): how long to wait between polls.

        Returns:
            Boolean: True if the buildTime was successfully resolved within the time limit, False otherwise.
        """
        isValidated = False
        elapsed_time = timedelta(minutes=0);
        start_time = self.clock.get_time()
        while not isValidated and elapsed_time < time_limit:
            currentlyDeployedInfo = self.deployment_info_gateway.get_info()
            build_time_of_deployment = parser.get_time(currentlyDeployedInfo)
            print(f"build time of deployment: {build_time_of_deployment} target time of deployment: {target_build_time_of_deployment}")
            isValidated = (build_time_of_deployment == target_build_time_of_deployment)
            if isValidated:
                return isValidated
            self.clock.wait(retry_interval)
            elapsed_time = self.clock.get_time() - start_time
            print(f"elapsed time: {elapsed_time}")
        return isValidated
        