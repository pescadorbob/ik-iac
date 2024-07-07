from abc import ABC, abstractmethod
from datetime import datetime, timedelta
import time

class Clock(ABC):
    @abstractmethod
    def get_time(self) -> datetime:
        pass

    @abstractmethod
    def wait(self, duration: timedelta):
        pass

class ProductionClock(Clock):
    def get_time(self) -> datetime:
        return datetime.now()

    def wait(self, duration: timedelta):
        time.sleep(duration.total_seconds())        