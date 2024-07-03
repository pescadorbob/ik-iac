from ..deploy.artifact_version import get_version
import pytest

class TestArtifactVersion:

    @pytest.mark.parametrize("file_name, expected_version", [
        ('corvallis-happenings-0.0.1+b10.war', "0.0.1+b10"),
        ("corvallis-happenings-1.0.0-b10.war", "1.0.0-b10"),
        ("another-app-2.3.1-rc2.jar", "2.3.1-rc2"),
        ("my-service-0.9.0-alpha.zip", "0.9.0-alpha"),
        ("invalid-file-name.txt", None),
    ])
    def test_should_parse_version_from_artifact(self,file_name, expected_version):
        actual = get_version(file_name)
        assert expected_version == actual
