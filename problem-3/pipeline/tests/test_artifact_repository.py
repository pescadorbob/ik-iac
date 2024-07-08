import pytest
from ..scripts.deploy.artifact_repository import ArtifactRepository
from ..scripts.dev_config import DevConfig

class TestArtifactRepository:
    
    def image_file_loc(self):
        return './problem-3/pipeline/tests/image.png'

    def key(self):
        return 'image.png'
    
    def published(self):
        return 'published.png'

    @pytest.fixture
    def repository(self):
        """
        Fixture to set up any necessary dependencies or configurations before running the tests.
        """
        config = DevConfig()
        repository = config.get_artifact_repository()
        key = self.key()
        image_file_loc = self.image_file_loc()
        repository.publish( key, image_file_loc)

        repository.delete( self.published())
        yield repository
        repository.delete( key)
        
    def test_exists_succeeds_given_an_artifact_already_exists(self,repository):
        assert repository.exists(self.key())
        

    def test_exists_fails_given_an_artifact_that_doesnt_exist(self, repository):
        # Arrange
        assert False == repository.exists("non-existent-key")
        
    def test_publish_succeeds_given_an_unpublished_artifact(self, repository):
        repository.publish('published.png','./problem-3/pipeline/tests/published.png')

        assert True == repository.exists('published.png')
    
    def test_delete_succeeds_given_an_existing_artifact(self, repository):
        # Act
        repository.delete(self.key())

        # Assert
        assert False == repository.exists(self.key()) 

