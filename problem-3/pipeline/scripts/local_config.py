from ..scripts.deploy.artifact_repository import ArtifactRepository

class LocalConfig:
    def __init__(self):
        self.name = "local"
        self.tomcat_home = "C:\\Users\\bcfis\\work\\software\\apache-tomcat-10.1.25"
        
        self.validation_url = "http://localhost:8080/actuator/info"

    
    