
import pytest
from ..scripts.deploy.local_deployment import LocalDeployment
from ..scripts.deploy.aws_deployment import AwsDeployment
from abc import ABC, abstractmethod
class TestDeployment(ABC):

    @abstractmethod
    def deployment(self):
        pass

    def test_deployment(self):
        assert self.deployment().run_pipeline()
        
        
class TestLocalDeployment(TestDeployment):
    def deployment(self):
        return LocalDeployment(".")
    
class TestAwsDeployment(TestDeployment):
    def deployment(self):
        return AwsDeployment(".")