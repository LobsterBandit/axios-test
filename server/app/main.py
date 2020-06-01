from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class ErrorMessage(BaseModel):
    message: str


class HTTPErrorMessage(BaseModel):
    detail: ErrorMessage


class Item(BaseModel):
    id: int
    name: str


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

items = [
    {"id": 1, "name": "one"},
    {"id": 2, "name": "two"},
    {"id": 3, "name": "three"},
    {"id": 4, "name": "four"},
    {"id": 5, "name": "five"},
]


@app.get("/ping")
async def ping():
    return "pong"


@app.get("/items", response_model=List[Item])
async def get_items():
    return items


@app.get(
    "/items/{id}", response_model=Item, responses={404: {"model": HTTPErrorMessage}}
)
async def get_item(id: int):
    filtered = [item for item in items if item["id"] == id]
    if filtered:
        return filtered[0]
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"message": "Item not found"}
        )
