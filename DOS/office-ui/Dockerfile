FROM mhart/alpine-node:12 AS builder
LABEL author="@telematica"

ARG NODE_ENV
ARG REACT_APP_HOST_API
ARG REACT_APP_HOST_AUTH

WORKDIR /app
COPY . .
# ENV GENERATE_SOURCEMAP=false
RUN rm -r ./node_modules
#RUN npm install react-scripts -g --silent
RUN yarn global add react-scripts
RUN yarn install
RUN yarn run build
RUN yarn run prod-server

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "8080", "-s", "."]
