FROM python:3.9-slim-buster
LABEL maintainer="omontes.dev@gmail.com"

RUN apt-get update
RUN apt-get install -y build-essential libpq-dev

COPY service/dal               /service/dal
COPY service/misc              /service/misc
COPY service/requirements.txt  /service/requirements.txt
COPY service/run.py            /service/run.py
COPY protos                    /protos

WORKDIR /service

RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

RUN for i in carriers equipments patios units users vouchers patio_vouchers statuses incidences; do \
        python -m grpc_tools.protoc -I../protos --python_out=. --grpc_python_out=. ../protos/$i.proto; \
done

EXPOSE 10080

CMD [ "python", "./run.py" ]
