from .clock import Clock, ProductionClock
from .info_gateway import InfoGateway
from .info_gateway import DeployedServiceGateway

class DeploymentValidatorConfiguration:

    def __init__(self,deployment_info_gateway:InfoGateway,clock:Clock) -> None:
        self.deployment_info_gateway = deployment_info_gateway
        self.clock:Clock = clock
        pass

    @classmethod    
    def from_environment(cls, environment):
        deployment_info_gateway = DeployedServiceGateway(environment.service_url)
        clock = ProductionClock()

        return cls(deployment_info_gateway,clock)
