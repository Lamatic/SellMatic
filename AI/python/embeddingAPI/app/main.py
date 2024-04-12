from fastapi import FastAPI, File, UploadFile
from typing import List
import llm

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    #"http://localhost.tiangolo.com",
    #"https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = llm.get_embedding_model("clip")

#app = FastAPI()

# Define your text embedding model (Example)
class EmbeddingModel:
    def __init__(self):
        # Example: Load your text embedding model here
        pass

    def embed_text(self, text):
        # Example: Perform text embedding and return embeddings
        embeddings = model.embed(text)
        return embeddings
    
    def embed_image(self, image_bytes):
        embeddings = model.embed(image_bytes)
        return embeddings

embedding_model = EmbeddingModel()

# Endpoint to handle text embedding
@app.post("/embed_text")
def embed_text(text: str) -> List[float]:
    return embedding_model.embed_text(text)
    
# Endpoint to handle image embedding
@app.post("/embed_image")
async def embed_image(file: UploadFile = File(...)) -> List[float]:
    contents = await file.read()
    return embedding_model.embed_image(contents)