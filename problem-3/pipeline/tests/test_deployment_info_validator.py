import json
import unittest

from ..deploy import deployment_info_validator

class TestDeploymentInfoValidator(unittest.TestCase):

    def test_should_find_version_give_actuator_info(self):
        info = '''
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
        
        expected_time = '2024-06-30T04:04:31.441Z';
        
        time = deployment_info_validator.getTime(info);
        self.assertEqual(time,expected_time);
        self.assertEqual('foo'.upper(), 'FOO')


if __name__ == '__main__':
    unittest.main()
