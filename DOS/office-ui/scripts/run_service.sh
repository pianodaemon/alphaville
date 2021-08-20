#!/bin/sh

serve -p 8080 -s /app/build &
yarn run prod-server