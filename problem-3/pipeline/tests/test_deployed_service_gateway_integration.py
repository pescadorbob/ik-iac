import pytest
from flask import Flask, json
from multiprocessing import Process
from ..scripts.deploy.info_gateway import *

class TestDeployedServiceGatewayIntegration():

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

    def test_should_get_deployment_info_metadata_given_a_listening_service(self,deployed_service):
        """
        Test case to verify the functionality of a deployed service gateway integration.
        This tests only the integration layer and uses a wire mock to respond how we'd like.        
        """
        expectedResponse = DeploymentInfoResponse('2024-06-30T04:04:31.441Z')

        gateway = DeployedServiceGateway('http://localhost:5000/actuator/info')
        info: DeploymentInfoResponse = gateway.get_info()
        assert info == expectedResponse

        