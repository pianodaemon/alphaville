# Building stage
FROM golang:1.15-buster as builder

LABEL MAINTAINER="Edwin Plauchu <j4nusx@yahoo.com>"

RUN apt-get update
RUN apt-get install -y unzip

RUN wget -O protoc.zip https://github.com/protocolbuffers/protobuf/releases/download/v3.17.3/protoc-3.17.3-linux-x86_64.zip
RUN mkdir protoc
RUN unzip protoc.zip -d /protoc
RUN rm protoc.zip
ENV PATH=$PATH:/protoc/bin

RUN go get google.golang.org/protobuf/cmd/protoc-gen-go
RUN go get google.golang.org/grpc/cmd/protoc-gen-go-grpc

WORKDIR /go/src/immortalcrab.com/sso
COPY protos protos

RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative protos/users.proto

COPY Makefile go.mod ./

RUN go mod download

COPY pkg pkg

COPY internal internal

COPY cmd cmd

RUN make clean build

# Final image
FROM ubuntu:bionic
LABEL MAINTAINER="Edwin Plauchu <j4nusx@yahoo.com>"

# getting last software catalog
RUN apt-get update --fix-missing

# Remove downloaded .debs from cache
RUN apt-get clean

# no longer needed list of packages
RUN rm -rf /var/lib/apt/lists/*


ENV APP_DIR=/
COPY --from=builder /sso $APP_DIR
COPY scripts/run_service.sh $APP_DIR
WORKDIR $APP_DIR

EXPOSE 10100

CMD ["/run_service.sh"]
