
import pytest
from ..deploy.command import Command

class TestRunCommand:

        
    def test_should_run_a_command_with_dir_successfully_with_output(self):
        assert True
        command = Command()
        self.target_directory = f"./problem-3/corvallis-happenings"

        result, last_line = command.execute_with_dir(self.target_directory,'mvn.cmd --version')
        assert "OS name:" in last_line.strip()
        assert result == 0
        
        
        
