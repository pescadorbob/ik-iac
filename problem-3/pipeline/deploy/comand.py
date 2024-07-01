import os
import subprocess

class Command:

    def execute(self, command):
        print(f"running command: {command}")
        # Example command (replace with your desired command)

        # Set the desired working directory
        working_dir = os.getcwd()

        print(f"working directory: {working_dir}")

        # result = subprocess.run(command, capture_output=True, text=True)
        # output = result.stdout;
        # print(output)
        # return output
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

        return process.returncode, last_line

