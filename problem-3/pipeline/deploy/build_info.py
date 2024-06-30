from abc import ABC, abstractmethod
import configparser
import os

class BuildInfo(ABC):
    @abstractmethod
    def get_build_info(self):
        pass

class LocalMavenBuildInfo(BuildInfo):
    def __init__(self, target_file):
        self.target_file = target_file
    def get_build_info(self):
        # Logic to retrieve build info from local Maven repository
        properties_dict = {}
        cwd = os.getcwd()
        print("Current working dir " + cwd)

        with open(self.target_file, 'r') as f:
            for line in f:
                line = line.strip()  # Remove leading/trailing whitespace
                if not line or line.startswith('#'):
                    continue  # Skip blank lines and comments
                key, value = line.split('=', 1)
                value = value.replace("\:", ":")
                properties_dict[key.strip()] = value.strip()

        # Now 'properties_dict' contains the key-value pairs from the properties file
        print(properties_dict)
        return properties_dict["build.time"]


