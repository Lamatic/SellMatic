FROM python:3.9.19-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libjpeg-dev \
        zlib1g-dev \
        && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN python3 -m llm install llm-clip

# Copy the rest of the application code into the container
COPY ./app /app/

# Expose the port that FASTAPI will run on
EXPOSE 8000

# Command to run the application
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]