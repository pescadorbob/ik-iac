import os
import configparser

class LocalDeployment:

    def __init__(self) -> None:
        pass

    def run_build(self):
        print("running build locally")

        target_directory = '../../corvallis-happenings'
        os.chdir(target_directory)
        os.system('mvn clean package')

    
    
