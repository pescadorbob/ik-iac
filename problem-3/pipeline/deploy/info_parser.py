import json

    
def get_time(info: str):
    parsed_data = json.loads(info)
    return parsed_data["build"]["time"]