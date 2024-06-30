from multiprocessing import Process
import pytest
from flask import Flask, json

from ..deploy.environment import Environment
from ..deploy.deployment_validator import DeploymentValidator
from datetime import timedelta
from ..deploy.deployment_validator_configuration import DeploymentValidatorConfiguration

class TestComponent:

    def aDeployedService(self):
        
        class FakeDeployedService:
            def __init__(self):
                self.app = Flask(__name__)                

            def run(self):
                self.info = {
                    "build": {
                        "artifact": "corvallis-happenings",
                        "name": "corvallis-happenings",
                        "time": "2024-06-30T04:04:31.441Z",
                        "version": "0.0.1-SNAPSHOT",
                        "group": "edu.brent.ik.iac"
                    }
                }

                self.app.add_url_rule('/actuator/info', 'get_info', self.get_info)
                self.companies = [
                    {"id": 1, "name": "Company One"},
                    {"id": 2, "name": "Company Two"}
                ]
                self.app.add_url_rule('/companies', 'get_companies', self.get_companies)
                self.app.run()
                return self                            
            
            def get_companies(self):
                return json.dumps(self.companies)
            
            def get_info(self):
                return json.dumps(self.info)
                
        return FakeDeployedService().run()

    @pytest.fixture
    def deployed_service(self):
        """
        Fixture to set up any necessary dependencies or configurations before running the tests.
        """
        server = Process(target=self.aDeployedService)
        server.start()
        yield server
        server.terminate()
        server.join()

    def test_components(self, deployed_service):
        environment = Environment("local","http://localhost:5000/actuator/info")
        configuration = DeploymentValidatorConfiguration.from_environment(environment)
        useCase = DeploymentValidator(configuration)
        target_build_time_of_deployment = "2024-06-30T04:04:31.441Z"
        time_limit = timedelta(minutes=1)
        retry_interval = timedelta(seconds=5)
        useCase.validate(target_build_time_of_deployment,time_limit,retry_interval)