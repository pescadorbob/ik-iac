import json
from . import info_parser as parser

class DeploymentValidator:
    def __init__(self,deployment_info_gateway) -> None:
        self.deployment_info_gateway = deployment_info_gateway
        pass
    
    def validate(self, buildTime: str):
        isValidated = False
        while not isValidated:
            currentlyDeployedInfo = self.deployment_info_gateway.get_info()
            time = parser.get_time(currentlyDeployedInfo)
            isValidated = (time == buildTime)
        return isValidated
        