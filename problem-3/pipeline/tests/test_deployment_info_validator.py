from datetime import datetime, timedelta

from ..scripts.deploy.deployment_validator import DeploymentValidator
from ..scripts.deploy.info_gateway import DeploymentInfoResponse, InfoGateway
from ..scripts.deploy.clock import Clock
from ..scripts.deploy.deployment_validator_configuration import DeploymentValidatorConfiguration

import pytest

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
  info_1 = DeploymentInfoResponse("2024-06-30T04:04:31.441Z")
  info_2 = DeploymentInfoResponse("2024-06-31T04:04:31.441Z")

  current_time = datetime(2024,6,30,0,0,0) # 2024-6-30 00:00:00
  test_clock = aTestClock(current_time)


    
        
  @pytest.mark.parametrize("test_input,expected", [("3+5", 8), ("2+4", 6), ("6*9", 54)])
  def test_eval(self, test_input, expected):
    assert eval(test_input) == expected
        
 

  @pytest.mark.parametrize('''deployment_time_in_seconds , 
                           deployment_time_limit_in_seconds, 
                           polling_interval_in_seconds,
                           expected''', 
                           [(30,60,5, True), 
                            (45,60,5, True), 
                            (55,60,5, True), 
                            (58,60,1, True), 
                            (59,60,1, True), 
                            (60,60,1, False), 
                            (61,60,1, False), 
                            (65,60,5, False), 
                            (105,60,5, False), 
                            ])
  def test_should_validate_a_deployment_given_a_simulated_deployment_time_and_deployment_timeout(self,
          deployment_time_in_seconds,
          deployment_time_limit_in_seconds,
          polling_interval_in_seconds,                                     
          expected):
    # Arrange

    simulated_deployment_time = timedelta(seconds=deployment_time_in_seconds) 
    info_gateway = self.create_eventually_successful_gateway(self.test_clock,simulated_deployment_time)
    deployment_info_validator_configuration = DeploymentValidatorConfiguration(info_gateway,self.test_clock)
    deployment_info_validator = DeploymentValidator(deployment_info_validator_configuration)
    expected_build_info_timestamp = '2024-06-31T04:04:31.441Z'
    deployment_time_limit = timedelta(seconds=deployment_time_limit_in_seconds)

    # Act
    isDeployed = deployment_info_validator.validate(expected_build_info_timestamp,
                                                    deployment_time_limit,
                                                    timedelta(seconds=polling_interval_in_seconds))

    # Assert
    assert isDeployed == expected

  
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
