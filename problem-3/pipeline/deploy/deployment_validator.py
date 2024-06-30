import json
from . import info_parser as parser

class DeploymentValidator:
    def __init__(self,deployment_info_gateway,clock) -> None:
        self.deployment_info_gateway = deployment_info_gateway
        self.clock = clock
        pass
    
    def validate(self, buildTime: str, time_limit: int, retry_interval: int):
        """validate will continue to poll the deployment info gateway with retry_interval until the buildTime is successfully resolved, or the time limit runs out.

        Args:
            buildTime (str): a string with the expected time stamp of when the build was made. E.g. '2024-06-30T04:04:31.441Z'
            time_limit (int): How long to continue polling for a successful deployment in seconds.
            retry_interval (int): how long to wait between polls.

        Returns:
            Boolean: True if the buildTime was successfully resolved within the time limit, False otherwise.
        """
        isValidated = False
        while not isValidated:
            currentlyDeployedInfo = self.deployment_info_gateway.get_info()
            time = parser.get_time(currentlyDeployedInfo)
            isValidated = (time == buildTime)
        return isValidated
        