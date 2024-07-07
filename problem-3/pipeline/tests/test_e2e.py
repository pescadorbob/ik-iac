import pytest
from ..scripts.deploy.deployment_validator import DeploymentValidator
from ..scripts.deploy.info_gateway import DeploymentInfoResponse, InfoGateway
from ..scripts.deploy.clock import Clock
from ..scripts.deploy.deployment_validator_configuration import DeploymentValidatorConfiguration
from ..scripts.deploy.environment import Environment
from datetime import datetime, timedelta

class TestEndToEnd():

    def live_deployment_info(self) -> str:
        return "2024-06-30T22:34:58.984Z"

    def getEnvironment(self) -> Environment:
        return Environment("local","http://localhost:8080/actuator/info")
        
    

    @pytest.fixture
    def create_validator(self):
        environment = self.getEnvironment()
        configuration = DeploymentValidatorConfiguration.from_environment(environment)
        self.use_case = DeploymentValidator(configuration)

    @pytest.mark.skip(reason="This test isn't finished.")
    def test_deployment_successful(self,create_validator):
        target_build_info_time_of_deployment = self.live_deployment_info()
        time_limit = timedelta(minutes=1)
        retry_interval = timedelta(seconds=5)
        isDeployed = self.use_case.validate(target_build_info_time_of_deployment,
                          time_limit,
                          retry_interval)
        assert isDeployed == True