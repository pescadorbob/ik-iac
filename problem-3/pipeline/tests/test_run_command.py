
import pytest
from ..deploy.command import Command

class TestRunCommand:

    def test_should_run_a_command_successfully_with_output(self):
        assert True
        command = Command()

        result, last_line = command.execute('echo "Hello World"')
        assert last_line.strip() == 'Hello World'
        assert result == 0
        
    def test_should_run_a_command_in_the_background(self):
        assert True
        command = Command()

        result, last_line = command.execute('echo "Hello World"')
        assert last_line.strip() == 'Hello World'
        assert result == 0
        
        
