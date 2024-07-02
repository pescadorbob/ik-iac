
import pytest
from ..deploy.aws_deployment import AwsDeployment

class TestAwsDeployment:

    @pytest.mark.skip(reason="not implemented yet")    
    def test_aws_deployment(self):
        project_root = ""
        
        deployment = AwsDeployment(project_root)

        isSuccessful = deployment.dev_pipeline()
        assert isSuccessful == True
        assert True
        
    