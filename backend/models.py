from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, index=True)
    description = Column(String, nullable=True)
    type = Column(String) # "income" or "expense"
    date = Column(DateTime, default=datetime.datetime.utcnow)
