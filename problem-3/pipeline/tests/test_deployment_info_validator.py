import json
import unittest

from ..deploy import info_parser as parser
from ..deploy.deployment_validator import DeploymentValidator
from ..deploy.info_gateway import InfoGateway

class TestDeploymentInfoValidator(unittest.TestCase):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.info_1 = '''
{
  "build": {
    "artifact": "corvallis-happenings",
    "name": "corvallis-happenings",
    "time": "2024-06-30T04:04:31.441Z",
    "version": "0.0.1-SNAPSHOT",
    "group": "edu.brent.ik.iac"
  }
}
        '''
    self.info_2 = '''
{
  "build": {
    "artifact": "corvallis-happenings",
    "name": "corvallis-happenings",
    "time": "2024-06-31T04:04:31.441Z",
    "version": "0.0.2-SNAPSHOT",
    "group": "edu.brent.ik.iac"
  }
}
        '''

  def test_should_find_version_given_actuator_info(self):
               
    expected_time = '2024-06-30T04:04:31.441Z';
    
    time = parser.get_time(self.info_1);
    self.assertEqual(time,expected_time);
    self.assertEqual('foo'.upper(), 'FOO')
        
  def test_should_eventually_validate_a_successful_deployment_after_5_polls_and_30_seconds(self):
    info_gateway = self.create_eventually_successful_gateway()
    deployment_info_validator = DeploymentValidator(info_gateway)
    expected_time = '2024-06-31T04:04:31.441Z'
    isDeployed = deployment_info_validator.validate(expected_time)
    self.assertTrue(isDeployed)

  def create_eventually_successful_gateway(self):
    class FakeInfoGateway(InfoGateway):
      def __init__(self,test):
        self.count = 0
        self.test = test

      def get_info(self):
        if self.count < 5:
          self.count += 1
          return self.test.info_1
        else:
          return self.test.info_2

    return FakeInfoGateway(self)


if __name__ == '__main__':
    unittest.main()
