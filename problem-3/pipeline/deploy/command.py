import os
import subprocess

class Command:


    def execute_with_dir(self, dir, command):

        cwd = self.save_start_dir()
        os.chdir(dir)

        print(f"running command: {command}")
        # Example command (replace with your desired command)

        # Set the desired working directory
        working_dir = os.getcwd()

        print(f"working directory: {working_dir}")

        # Start the process with the specified working directory
        process = subprocess.Popen(command, stdout=subprocess.PIPE, 
                                   stderr=subprocess.STDOUT, 
                                   cwd=working_dir)

        # Read and print each line of output in real time
        last_line = None
        for line in iter(process.stdout.readline, b''):
            last_line = line.rstrip().decode("utf-8")
            print(last_line)

        # Wait for the process to finish
        process.wait()
        self.restore_start_dir()

        return process.returncode, last_line

    def restore_start_dir(self):
        os.chdir(self.cwd)

    def save_start_dir(self):
        self.cwd = os.getcwd()


