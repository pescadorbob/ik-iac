from ..scripts.deploy.artifact_repository import ArtifactRepository

class DevConfig:
    def __init__(self):
        self.name = "dev"
        self.artifactory_bucket = "dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux"
        self.validation_url = "http://dev-hello-world-environment.eba-ce824fjy.us-west-2.elasticbeanstalk.com/actuator/info"
    
