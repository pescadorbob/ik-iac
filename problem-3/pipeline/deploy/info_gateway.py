from abc import ABC, abstractmethod
import requests
from . import info_parser as parser

class DeploymentInfoResponse:
    def __init__(self,time):
        self.time =  time

    def __eq__(self, value: object) -> bool:
        return self.time.__eq__(value.time)
    
class InfoGateway(ABC):
    
    @abstractmethod
    def get_info(self)->DeploymentInfoResponse:
        pass

class DeployedServiceGateway(InfoGateway):
    def __init__(self,url) -> None:
        self.url = url
        pass

    def get_info(self) -> DeploymentInfoResponse:
        
        currentlyDeployedInfo = requests.get(self.url).json();
        build_time_metadata = currentlyDeployedInfo["build"]["time"]
        return DeploymentInfoResponse(build_time_metadata)