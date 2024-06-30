from abc import ABC, abstractmethod
from datetime import datetime, timedelta

class Clock(ABC):
    @abstractmethod
    def get_time(self) -> datetime:
        pass

    @abstractmethod
    def wait(self, duration: timedelta):
        pass