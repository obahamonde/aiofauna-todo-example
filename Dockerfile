FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt .

RUN  pip install --upgrade pip && \
        pip install -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "main.py"]

ENV FAUNA_SECRET="fnAE-PwW1MACVXRZx2O7E2Bw13xhAs616T0g9AGl"