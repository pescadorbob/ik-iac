
import pytest
from ..deploy.local_deployment import LocalDeployment

class TestLocalDeployment:

    def test_local_deployment(self):
        project_root = "."
        # Create an instance of LocalDeployment
        local_deployment = LocalDeployment(project_root)

        # Assert that the instance is of type LocalDeployment
        isSuccessful = local_deployment.run_pipeline()
        assert isSuccessful == True
        
    