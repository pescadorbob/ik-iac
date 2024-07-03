
import re


def get_version(file_name):
    # Define a regular expression pattern to match the version string
    pattern = r'-(\d+\.\d+\.\d+(?:-\w+)?(?:\+\w+)?)(?=\.war|\.jar|\.zip)'

    # Search for the pattern in the file name
    match = re.search(pattern, file_name)

    # If a match is found, return the captured version string
    if match:
        return match.group(1)
    # If no match is found, return None
    else:
        return None

