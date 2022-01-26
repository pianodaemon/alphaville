## Load DB Dump 

    1) Remuevo la db soa: ./bin/mgmt_rdbms
        soa=# \c postgres         # cambiar a BD postgres para poder eliminar soa
        postgres=# drop database soa;

    2) ./bin/init_schema

    3) copio el file .sql dump a docker y lo ejecuto
        docker cp ~/Downloads/DYLKA/users_patio.sql rdbms_vales:/dump.sql
        docker cp ~/Downloads/DYLKA/dump-vales_dylk-20220118.sql rdbms_vales:/dump.sql
    
    4) ejecuto import db
        docker exec rdbms_vales psql -U postgres -f dump.sql

        docker run -it --rm --network operational_network --volume /Users/dealersocket/Downloads/DYLKA debezium/postgres:13-alpine bash
        psql -h rdbms_vales -U postgres vales_dylk < ./users_patio.sql
        psql -h rdbms_vales -U postgres vales_dylk < /dump/users_patio.sql
---
## Load Mongo Dump

    1) Lanzas un container con bash
    docker run -it --rm --network operational_network --volume /home/user/tu/ruta/mongodb_dumps:/dumps mongo:latest bash

    docker run -it --rm --network operational_network --volume /Users/dealersocket/Downloads/DYLKA/vales_dylk_mongo:/dumps mongo:latest bash

    2) Comando para el restore (si no te deja porque ya existe la db, ver NOTA abajo)
    mongorestore --host=nosql_mongo --port=27017 --nsInclude='vales_dylk_mongo.*' /dumps/

    NOTA
    Dentro del container del paso 1, ejecutar:
    2.1 mongosh mongodb://nosql_mongo:27017/vales_dylk_mongo

    y luego:
    2.2 db.dropDatabase()



---
---
---


    dealersocket@CeronPro office-ui % npm install -g grpc-tools

    /usr/local/bin/grpc_tools_node_protoc_plugin -> /usr/local/lib/node_modules/grpc-tools/bin/protoc_plugin.js
    /usr/local/bin/grpc_tools_node_protoc -> /usr/local/lib/node_modules/grpc-tools/bin/protoc.js

    > grpc-tools@1.11.2 install /usr/local/lib/node_modules/grpc-tools
    > node-pre-gyp install

    [grpc-tools] Success: "/usr/local/lib/node_modules/grpc-tools/bin/grpc_tools.node" is installed via remote
    + grpc-tools@1.11.2

----------------------------------------------

    docker rm -f rdbms_vales
    docker volume rm alphaville_serv_vales_pg_data

    # Log Docker container
    https://stackoverflow.com/questions/10815218/where-is-nodejs-log-file/41514710#41514710
    docker attach eastern_sea

#yarn add grpc-web
#yarn add ts-protoc-gen
#yarn add google-protobuf

#protoc -I=. DOS/api-vales/protos/vales.proto --js_out=import_style=commonjs,binary:./DOS/office-ui/grpc --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./DOS/office-ui/grpc

#PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

# Directory to write generated code to (.js and .d.ts files)
#OUT_DIR="DOS/office-ui/src/grpc"



#protoc \
#    -I="./DOS/api-vales/protos/" \
#    vales.proto \
#    --js_out="import_style=commonjs,binary:./DOS/office-ui/src/grpc" \
#    --grpc-web_out=import_style=typescript,mode=grpcweb:"./DOS/office-ui/src/grpc"


#protoc \
#    -I="./DOS/api-vales/protos/" \
#   vales.proto \
#    --js_out="import_style=commonjs,binary:./DOS/office-ui/server/grpc" \
#    --grpc-web_out=import_style=commonjs,mode=grpcweb:"./DOS/office-ui/server/grpc"



#yarn add @grpc/grpc-js

#este es el bueno:
    #grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" users.proto

    grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" patios.proto

    grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" units.proto

    grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" carriers.proto

    grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" vouchers.proto

    grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" statuses.proto

    grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" patio_vouchers.proto

    grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=grpc_js:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" incidences.proto

    #grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=generate_package_definition:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" users.proto

# https://stackoverflow.com/questions/24272058/word-wrap-in-generated-pdf-using-jspdf
# https://stackoverflow.com/questions/33515127/adding-footer-to-pdf-using-jspdf
# https://github.com/simonbengtsson/jsPDF-AutoTable/tree/master/examples
# https://docs.google.com/document/d/1uXYF6etyUkBu3eATy9NSII4csJyTgrHf/edit