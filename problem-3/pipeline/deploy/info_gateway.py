from abc import ABC, abstractmethod

class InfoGateway(ABC):
    
    @abstractmethod
    def get_info(self):
        pass