# from ..deploy.deploy_war_to_s3 import WarDeployer
from ..deploy.artifact_repository import ArtifactRepository
import pytest

class TestArtifactRepository:
    @pytest.fixture
    def image_file_loc(self):
        return './problem-3/pipeline/tests/image.png'

    @pytest.fixture
    def key(self):
        return 'image.png'
    
    @pytest.fixture
    def bucket(self):
        return 'elasticbeanstalk-helloworldbucket04224f88-akmbpvnn1hxb'

    @pytest.fixture
    def repository(self):
        """
        Fixture to set up any necessary dependencies or configurations before running the tests.
        """
        repository = ArtifactRepository()
        bucket = 'elasticbeanstalk-helloworldbucket04224f88-akmbpvnn1hxb'
        key = 'image.png'
        image_file_loc = './problem-3/pipeline/tests/image.png'
        repository.publish(bucket, key, image_file_loc)

        published = 'published.png'
        repository.delete(bucket, published)
        yield repository
        repository.delete(bucket, key)
        
    def test_exists_succeeds_given_an_artifact_already_exists(self,repository,bucket,key):
        assert repository.exists(bucket,key)
        

    def test_exists_fails_given_an_artifact_that_doesnt_exist(self, repository,bucket):
        # Arrange
        assert False == repository.exists(bucket,"non-existent-key")
        
    def test_publish_succeeds_given_an_unpublished_artifact(self, repository, bucket):
        repository.publish(bucket,'published.png','./problem-3/pipeline/tests/published.png')

        assert True == repository.exists(bucket,'published.png')
    
    def test_delete_succeeds_given_an_existing_artifact(self, repository,key,bucket):
        # Act
        repository.delete(bucket,key)

        # Assert
        assert False == repository.exists(bucket, key) 

    # def test_deploy(self):
    #     deployer = WarDeployer()
    #     deployer.deploy()
    #     build_info = self.getBuildInfoMetadata()

    #     self.verifyDeployment(build_info)

    
    # def getBuildInfoMetadata(self):
    #     cwd = os.getcwd()
    #     print(f"current working directory: {cwd}")
    #     localBuildInfo = LocalMavenBuildInfo(f"{cwd}/target/classes/META-INF/build-info.properties")
    #     new_build_info = localBuildInfo.get_build_info()
    #     return new_build_info

