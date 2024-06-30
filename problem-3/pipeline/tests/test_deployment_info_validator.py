from datetime import datetime, timedelta

from ..deploy import info_parser as parser
from ..deploy.deployment_validator import DeploymentValidator
from ..deploy.info_gateway import InfoGateway
from ..deploy.clock import Clock

def aTestClock(startTime:datetime):
  class FakeClock(Clock):
    def __init__(self, start_time:datetime):
      self.start_time = start_time
      self.current_time = start_time

    def get_time(self):
      return self.current_time        

    def wait(self, time:timedelta):
      self.current_time = self.current_time + time
      pass

  return FakeClock(startTime)

class TestDeploymentInfoValidator():
  info_1 = '''
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
  info_2 = '''
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
  current_time = datetime(2024,6,30,0,0,0) # 2024-6-30 00:00:00
  test_clock = aTestClock(current_time)

  def test_should_find_version_given_actuator_info(self):
               
    expected_time = '2024-06-30T04:04:31.441Z';
    
    time = parser.get_time(self.info_1);
    assert time == expected_time
    
        
  def test_should_eventually_fail_deployment_given_a_deployment_info_gateway_that_never_succeeds(self):
    # Arrange

    info_gateway = self.create_an_always_failing_gateway()
    deployment_info_validator = DeploymentValidator(info_gateway,self.test_clock)
    expected_time = '2024-06-31T04:04:31.441Z'
    time_limit = timedelta(minutes=1)

    # Act
    isDeployed = deployment_info_validator.validate(expected_time,time_limit,timedelta(minutes=1))

    # Assert
    assert not isDeployed    

  def test_should_eventually_validate_a_successful_deployment_after_30_seconds(self):
    # Arrange

    simulated_deployment_time = timedelta(seconds=30) 
    info_gateway = self.create_eventually_successful_gateway(self.test_clock,simulated_deployment_time)
    deployment_info_validator = DeploymentValidator(info_gateway,self.test_clock)
    expected_build_info_timestamp = '2024-06-31T04:04:31.441Z'
    deployment_time_limit = timedelta(minutes=1)

    # Act
    isDeployed = deployment_info_validator.validate(expected_build_info_timestamp,
                                                    deployment_time_limit,
                                                    timedelta(seconds=5))

    # Assert
    assert isDeployed

  
  def create_eventually_successful_gateway(self,clock,deployment_time):
    class FakeInfoGateway(InfoGateway):
      def __init__(self,initial_info,successful_info,clock:Clock,deployment_time:timedelta):
        """creates an info gateway that returns info_1 (the starting deployment info)
           until deployment_time has elapsed, then returns info_2 (the final deployment info)

        Args:
            initial_info (str): the starting deployment info
            successful_info (str): the final deployment info
            clock (Clock): the fake clock for time travelling.
            deployment_time (int): time to elapse before this gateway returns info_2
        """
        
        self.initial_info = initial_info
        self.successful_info = successful_info
        self.clock:Clock = clock
        self.start_time:datetime = clock.get_time()
        self.deployment_time:timedelta = deployment_time
        

      def get_info(self):
        elapsed_time:timedelta = self.clock.get_time() - self.start_time # time in seconds
        if elapsed_time < self.deployment_time:          
          return self.initial_info
        else:
          return self.successful_info

    return FakeInfoGateway(self.info_1,self.info_2, clock, deployment_time)
  
  def create_an_always_failing_gateway(self):
    class FakeInfoGateway(InfoGateway):
      def __init__(self,initial_info):
        """creates an info gateway that returns initial_info forever
           meaning the new version is never deployed...           

        Args:
            initial_info (str): the starting deployment info
        """        
        self.initial_info = initial_info
        

      def get_info(self):
        return self.initial_info

    return FakeInfoGateway( self.info_1)


if __name__ == '__main__':
    unittest.main()
