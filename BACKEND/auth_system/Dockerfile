# ✅ CUDA 12.1 base image with Ubuntu 22.04
FROM nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04

# ✅ Avoid interactive tzdata prompts
ENV DEBIAN_FRONTEND=noninteractive

# ✅ Set working directory
WORKDIR /app

# ✅ Install system dependencies + Python 3.11
RUN apt-get update && apt-get install -y \
    software-properties-common \
    git \
    wget \
    gcc \
    cmake \
    ffmpeg \
    libsm6 \
    libxext6 \
    tzdata \
    curl \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    && ln -sf python3.11 /usr/bin/python3 \
    && ln -sf pip3 /usr/bin/pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ✅ Upgrade pip
RUN python3 -m pip install --upgrade pip

# ✅ Copy project files
COPY . .

# ✅ Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir --use-pep517 -r requirements.txt

# ✅ Install Detectron2 (stable commit)
RUN pip install git+https://github.com/facebookresearch/detectron2.git@9eb4831

# ✅ Default Django command (adjust if Flask etc.)
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
