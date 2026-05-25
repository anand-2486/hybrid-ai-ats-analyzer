FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 10000

CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "Backend.main:app", "--bind", "0.0.0.0:10000"]