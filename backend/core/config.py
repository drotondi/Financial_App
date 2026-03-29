import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "change-this-to-a-very-long-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    # In production set DATABASE_URL=sqlite:////data/wealth.db (Railway volume)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./wealth.db")

    class Config:
        env_file = ".env"


settings = Settings()
