#!/bin/sh

CONTAINER="rdbms_vales"
DATABASE=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$CONTAINER:$POSTGRES_PORT/$POSTGRES_DB

psql $DATABASE
