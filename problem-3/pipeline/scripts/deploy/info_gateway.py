from abc import ABC, abstractmethod
import requests
from . import info_parser as parser

class DeploymentInfoResponse:
    def __init__(self,time,error=None):
        self.time =  time
        self.error = error

    def __eq__(self, value: object) -> bool:
        return self.time.__eq__(value.time) and self.error.__eq__(value.error)
    
class InfoGateway(ABC):
    
    @abstractmethod
    def get_info(self)->DeploymentInfoResponse:
        pass

class DeployedServiceGateway(InfoGateway):
    def __init__(self,url,http_requests=None) -> None:
        self.url = url
        if http_requests == None:
            self.requester = requests
        else:
            self.requester = http_requests
        
        pass

    def get_info(self) -> DeploymentInfoResponse:
        try:
            currentlyDeployedInfo = self.requester.get(self.url).json();
            print("Currently deployed info: ", currentlyDeployedInfo)
            build_time_metadata = currentlyDeployedInfo["build"]["time"]
            return DeploymentInfoResponse(build_time_metadata)
        except Exception as e:
            print(e)
            return DeploymentInfoResponse("Unknown", error=e)