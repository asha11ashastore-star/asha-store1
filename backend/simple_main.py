from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI(title="ShopAll API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
MOCK_PRODUCTS = [
    {
        "id": 1,
        "name": "Bridal Lehenga Collection",
        "price": 45999,
        "original_price": 59999,
        "image": "https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "category": "Clothing",
        "seller": "Royal Fashion House",
        "rating": 4.9,
        "review_count": 127,
        "in_stock": True,
        "discount": 23
    },
    {
        "id": 2,
        "name": "Silk Saree with Blouse",
        "price": 12999,
        "original_price": 18999,
        "image": "https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8aGFuZGxvb20lMjBzYXJlZSUyMGZhYnJpY3xlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "category": "Clothing",
        "seller": "Traditional Weavers",
        "rating": 4.7,
        "review_count": 89,
        "in_stock": True,
        "discount": 32
    }
]

MOCK_USER = {
    "id": 1,
    "email": "demo@shopall.com",
    "first_name": "Demo",
    "last_name": "User",
    "role": "buyer"
}

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Routes
@app.get("/")
async def root():
    return {"message": "ShopAll API is running!", "status": "success"}

@app.post("/auth/login", response_model=TokenResponse)
async def login(form_data: LoginRequest):
    # Mock authentication - accept any credentials for demo
    if form_data.username and form_data.password:
        return TokenResponse(access_token="mock_token_123")
    raise HTTPException(status_code=400, detail="Invalid credentials")

@app.get("/auth/me")
async def get_current_user():
    return MOCK_USER

@app.get("/products")
async def get_products():
    return {"products": MOCK_PRODUCTS, "total": len(MOCK_PRODUCTS)}

@app.get("/products/{product_id}")
async def get_product(product_id: int):
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/categories")
async def get_categories():
    return ["Clothing", "Electronics", "Food", "Beauty", "Jewelry", "Home & Garden"]

@app.post("/cart/add")
async def add_to_cart(product_id: int, quantity: int = 1):
    return {"message": "Added to cart successfully", "product_id": product_id, "quantity": quantity}

@app.get("/cart")
async def get_cart():
    return {"items": [], "total": 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
