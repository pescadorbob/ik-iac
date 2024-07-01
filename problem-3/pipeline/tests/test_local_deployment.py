
import pytest
from ..deploy.local_deployment import LocalDeployment

class TestLocalDeployment:

    def test_local_deployment(self):
        assert True
        # Create an instance of LocalDeployment
        local_deployment = LocalDeployment()

        # Assert that the instance is of type LocalDeployment
        isSuccessful = local_deployment.run_build()
        assert isSuccessful == True
        
    def test_