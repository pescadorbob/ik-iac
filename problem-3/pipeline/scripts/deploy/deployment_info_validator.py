import json


def getTime(info: str):
    parsed_data = json.loads(info)
    return parsed_data["build"]["time"]