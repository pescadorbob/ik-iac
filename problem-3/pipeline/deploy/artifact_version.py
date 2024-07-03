
import re

def get_version(file_name):
    # Use regular expression to extract version from file name
    match = re.search(r'-(\d+\.\d+\.\d+-\w+)', file_name)
    if match:
        return match.group(1)
    else:
        return None
