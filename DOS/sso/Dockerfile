# Building stage
FROM golang:1.15-alpine as builder

LABEL MAINTAINER="Edwin Plauchu <j4nusx@yahoo.com>"

WORKDIR /go/src/immortalcrab.com/sso

COPY Makefile go.mod ./

RUN go mod download

COPY pkg pkg

COPY internal internal

COPY cmd cmd

RUN apk add make
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
