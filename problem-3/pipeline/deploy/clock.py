from abc import ABC, abstractmethod
from datetime import datetime

class Clock(ABC):
    @abstractmethod
    def get_time(self) -> datetime:
        pass