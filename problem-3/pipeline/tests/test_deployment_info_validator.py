import json
import unittest

from ..deploy import deployment_info_validator

class TestDeploymentInfoValidator(unittest.TestCase):
    def test_keys(self):
        multiline_json = '''{
            "key1": {
                "user":"george",
                "address":"123 Main St"
            },
            "key2": "value2",
            "key3": "value3"
        }'''
        

        # Parse the JSON string
        parsed_data = json.loads(multiline_json)

        # Access specific keys
        self.assertEqual(parsed_data["key1"]["user"],"george");
        print("Hello World")
        print(parsed_data["key1"])
        print(parsed_data["key2"])
        print(parsed_data["key3"])

    def test_should_find_version_give_actuator_info(self):
        # info = '{"build":{"artifact":"corvallis-happenings","name":"corvallis-happenings","time":"2024-06-30T04:04:31.441Z","version":"0.0.1-SNAPSHOT","group":"edu.brent.ik.iac"}}'
        info = '''
{
  "application": {
    "name": "Corvallis Happenings",
    "description": "An app that tells you the top events in Corvallis!",
    "version": ""
  },
  "build": {
    "artifact": "corvallis-happenings",
    "name": "corvallis-happenings",
    "time": "2024-06-30T04:04:31.441Z",
    "version": "0.0.1-SNAPSHOT",
    "group": "edu.brent.ik.iac"
  },
  "java": {
    "version": "17.0.11",
    "vendor": {
      "name": "Amazon.com Inc.",
      "version": "Corretto-17.0.11.9.1"
    },
    "runtime": {
      "name": "OpenJDK Runtime Environment",
      "version": "17.0.11+9-LTS"
    },
    "jvm": {
      "name": "OpenJDK 64-Bit Server VM",
      "vendor": "Amazon.com Inc.",
      "version": "17.0.11+9-LTS"
    }
  },
  "os": {
    "name": "Windows 11",
    "version": "10.0",
    "arch": "amd64"
  }
}
        '''
        parsed_data = json.loads(info);
        print(info)
        expected_time = '2024-06-30T04:04:31.441Z';
        
        time = parsed_data["build"]["time"]
        self.assertEqual(time,expected_time);
        self.assertEqual('foo'.upper(), 'FOO')


if __name__ == '__main__':
    unittest.main()
