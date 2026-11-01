from fastapi import FastAPI

app = FastAPI(
    title="个人博客 API",
    version="1.0.0",
)


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}