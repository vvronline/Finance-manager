from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import SessionLocal, engine
import pandas as pd
from fastapi.responses import StreamingResponse
import io

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.create_transaction(db=db, transaction=transaction)

@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = crud.get_transactions(db, skip=skip, limit=limit)
    return transactions

@app.get("/reports/monthly/{year}/{month}")
def get_monthly_report(year: int, month: int, db: Session = Depends(get_db)):
    return crud.get_monthly_report(db, year, month)

@app.get("/reports/download/{year}/{month}")
def download_monthly_report(year: int, month: int, db: Session = Depends(get_db)):
    report = crud.get_monthly_report(db, year, month)
    transactions = report["transactions"]
    
    # Convert to DataFrame
    data = [{
        "Date": t.date,
        "Type": t.type,
        "Category": t.category,
        "Description": t.description,
        "Amount": t.amount
    } for t in transactions]
    
    df = pd.DataFrame(data)
    
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    response = StreamingResponse(iter([stream.getvalue()]),
                                 media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=report_{year}_{month}.csv"
    return response
