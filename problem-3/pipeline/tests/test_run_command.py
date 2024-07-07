
import pytest
from ..scripts.common.command import Command

class TestRunCommand:

        
    def test_should_run_a_command_with_dir_successfully_with_output(self):
        assert True
        command = Command()
        self.target_directory = f"./problem-3/corvallis-happenings"

        result, last_line = command.execute_with_dir(self.target_directory,'mvn.cmd --version')
        assert "OS name:" in last_line.strip()
        assert result == 0

    def test_should_run_install_command_given_javascript_dir(self):
        assert True
        command = Command()
        self.target_directory = f"./problem-3/pipeline/tests/resources/test_command"

        result, last_line = command.execute_with_dir(self.target_directory,'npm.cmd install')
        assert "found 0 vulnerabilities" in last_line.strip()
        assert result == 0
       
        
        
