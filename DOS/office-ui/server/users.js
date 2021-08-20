const util = require("util");
const { promisify } = util;
//var parseArgs = require("minimist");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
//var parseArgs = require("minimist");
var messages = require("./grpc/users_pb");
var services = require("./grpc/users_grpc_pb");
const TARGET = "localhost:10080";
const PROTO_PATH = __dirname + "/grpc/protos/users.proto";
console.log('PROTO_PATH', PROTO_PATH);
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const UsersService = grpc.loadPackageDefinition(packageDefinition).dylk.Users;

function setupUsersClient() {
  return new UsersService(TARGET, grpc.credentials.createInsecure());
}

async function listUsers() {
  var client = setupUsersClient();
  const promisifiedClient = promisify(client.listUsers).bind(client);
  const call_service = async (req, service_name) => {
    try {
      // @todo add SearchParam (filters)
      // var param = new messages.Param().setName('disabled').setValue(false);
      const response = await service_name(req);
      return response;
    } catch (error) {
      /* @todo Return HTTP 500 code or something appropied */
      console.log("error", error);
    }
  };
  var request = new messages.SearchParams();
  /*
  var param = new messages.Param();
  param.setValue('disabled');
  param.setName('true');
  request.addParamlist(param);
  */
  const response = await call_service(request, promisifiedClient);

  return response;
}

async function createUser(fields) {

  var client = setupUsersClient();
  var request = new messages.User();
  request.setUserid(0);
  request.setUsername("qwertxx");
  request.setPasswd(""); //
  request.setRoleid(2);
  request.setDisabled(false);
  request.setFirstname("test");
  request.setLastname("test");
  request.setAuthoritiesList([1, 2, 3]);
  // console.log(request);
  client.alterUser(request, function (err, response) {
    console.log("Response:", util.inspect(response, true, 255), err);
  });
  /*
  var client = setupUsersClient();
  const promisifiedClient = promisify(client.alterUser).bind(client);
  const call_service = async (req, service_name) => {
    try {
      console.log('req:', req);
      const response = await service_name(req);
      return response;
    } catch (error) {
      // @todo Return HTTP 500 code or something appropied
      console.log("error", error);
    }
  };
  console.log(fields);
  var request = new messages.User();
  request.setUserid(0);
  request.setUsername(fields.username);
  request.setPasswd(fields.passwd);
  request.setRoleid(fields.roleId);
  request.setDisabled(fields.disabled);
  request.setFirstname(fields.firstName);
  request.setLastname(fields.lastName);
  request.setAuthoritiesList(fields.authorities);
  
  const response = await call_service(request, promisifiedClient);
  return response;
  */
}

async function readUser(id) {
  var client = setupUsersClient();
  const promisifiedClient = promisify(client.getUser).bind(client);
  const call_service = async (req, service_name) => {
    try {
      // @todo add SearchParam (filters)
      // var param = new messages.Param().setName('disabled').setValue(false);
      const response = await service_name(req);
      return response;
    } catch (error) {
      /* @todo Return HTTP 500 code or something appropied */
      console.log("error", error);
    }
  };
  var request = { id };
  const response = await call_service(request, promisifiedClient);

  return response;
}

module.exports = {
  listUsers,
  createUser,
  readUser,
};
