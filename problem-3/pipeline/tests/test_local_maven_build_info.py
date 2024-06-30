
from ..deploy.build_info import LocalMavenBuildInfo

class TestLocalBuildInfo:

    def test_should_respond_with_build_date_metadata(self):
        local_build_info = LocalMavenBuildInfo("problem-3/pipeline/tests/build-info.properties")
        expected_info = "2024-06-30T22:34:58.984Z"
        actual_info = local_build_info.get_build_info()
        assert expected_info == actual_info

    def test_nothing(self):
        assert True