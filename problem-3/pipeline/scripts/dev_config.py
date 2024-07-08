from ..scripts.deploy.artifact_repository import ArtifactRepository

class DevConfig:
    def __init__(self):
        self.name = "dev"
        # - dev-hello-world.environmentUrl = awseb-e-u-AWSEBLoa-1SMMYAF23I97P-1447641468.us-west-2.elb.amazonaws.com
        # - dev-hello-world-war-bucket.artifactBucketArn = dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux

        self.artifactory_bucket = "dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux"
        self.validation_url = "http://awseb-e-u-AWSEBLoa-1SMMYAF23I97P-1447641468.us-west-2.elb.amazonaws.com/actuator/info"
        self.app_name = "dev-hello-world"
        self.environment_name = "dev-hello-world-environment"    

    def get_artifact_repository(self) -> ArtifactRepository:
        return ArtifactRepository(self.artifactory_bucket)
    
    