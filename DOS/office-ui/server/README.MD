/**

    dealersocket@CeronPro office-ui % npm install -g grpc-tools

    /usr/local/bin/grpc_tools_node_protoc_plugin -> /usr/local/lib/node_modules/grpc-tools/bin/protoc_plugin.js
    /usr/local/bin/grpc_tools_node_protoc -> /usr/local/lib/node_modules/grpc-tools/bin/protoc.js

    > grpc-tools@1.11.2 install /usr/local/lib/node_modules/grpc-tools
    > node-pre-gyp install

    [grpc-tools] Success: "/usr/local/lib/node_modules/grpc-tools/bin/grpc_tools.node" is installed via remote
    + grpc-tools@1.11.2

*/

/**
    docker exec rdbms_obs psql -U postgres -f db_dump_sfp.sql

    1) remuevo la db soa: ./bin/mgmt_rdbms
    soa=# \c postgres         # cambiar a BD postgres para poder eliminar soa
    postgres=# drop database soa;

    2) ./bin/init_schema

    3) copio el file .sql dump a docker y lo ejecuto
*/

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

    #grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./DOS/office-ui/server/grpc --grpc_out=generate_package_definition:./DOS/office-ui/server/grpc -I="./DOS/api-vales/protos/" users.proto