from datetime import datetime, timedelta
import json
import unittest

from ..deploy import info_parser as parser
from ..deploy.deployment_validator import DeploymentValidator
from ..deploy.info_gateway import InfoGateway
from ..deploy.clock import Clock

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
    # Arrange
    poll_interval = 5000 # 5 seconds
    start_time = datetime(2024,6,30,7,43,0) # 2024-6-30 07:43:00
    max_deployment_time = timedelta(minutes=1) 

    test_clock = self.aTestClock(start_time,poll_interval) 
    info_gateway = self.create_eventually_successful_gateway(test_clock,max_deployment_time)
    deployment_info_validator = DeploymentValidator(info_gateway,test_clock)
    expected_time = '2024-06-31T04:04:31.441Z'
    time_limit = 60000 # 60 seconds

    # Act
    isDeployed = deployment_info_validator.validate(expected_time,time_limit,5000)

    # Assert
    self.assertTrue(isDeployed)

  def aTestClock(self, startTime:datetime,poll_intervals:timedelta):
    class FakeClock(Clock):
      def __init__(self, start_time:datetime, poll_intervals:timedelta):
        self.count = 0
        self.start_time = start_time
        self.poll_intervals = poll_intervals        

      def get_time(self):
        self.count += 1
        end_time = self.start_time + timedelta(seconds=(self.count *self.poll_intervals))

        return end_time

    return FakeClock(startTime, poll_intervals)
  
  def create_eventually_successful_gateway(self,clock,deployment_time):
    class FakeInfoGateway(InfoGateway):
      def __init__(self,test:TestDeploymentInfoValidator,clock:Clock,deployment_time:timedelta):
        """creates an info gateway that returns info_1 (the starting deployment info)
           untile deployment_time has elapsed, then returns info_2 (the final deployment info)

        Args:
            test (TestDeploymentInfoValidator): just the enclosing test with the info
            clock (Clock): the fake clock for time travelling.
            deployment_time (int): time to elapse before this gateway returns info_2
        """
        
        self.test = test
        self.clock:Clock = clock
        self.start_time:datetime = clock.get_time()
        self.deployment_time:timedelta = deployment_time
        

      def get_info(self):
        elapsed_time:timedelta = self.clock.get_time() - self.start_time # time in seconds
        if elapsed_time < self.deployment_time:          
          return self.test.info_1
        else:
          return self.test.info_2

    return FakeInfoGateway(self,clock, deployment_time)


if __name__ == '__main__':
    unittest.main()
