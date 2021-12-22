FROM python:3.10-slim-buster
LABEL maintainer="omontes.dev@gmail.com"

RUN apt-get update
RUN apt-get install -y build-essential libpq-dev

COPY service/requirements.txt  /service/requirements.txt
COPY service/vales_etl.py      /service/vales_etl.py

WORKDIR /service

RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

CMD [ "python", "./vales_etl.py" ]
