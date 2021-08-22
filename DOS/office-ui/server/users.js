const util = require("util");
const { promisify } = util;
//var parseArgs = require("minimist");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
//var parseArgs = require("minimist");
var messages = require("./grpc/users_pb");
var services = require("./grpc/users_grpc_pb");
const TARGET =
  process.env.NODE_ENV === "production"
    ? "neon_nights:10080"
    : "localhost:10080";
const PROTO_PATH = __dirname + "/grpc/protos/users.proto";
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const UsersService = grpc.loadPackageDefinition(packageDefinition).dylk.Users;

function setupUsersClient(method) {
  // console.log(TARGET, process.env.NODE_ENV);
  const client = new UsersService(TARGET, grpc.credentials.createInsecure());
  return (promisifiedClient = promisify(client[method]).bind(client));
}

async function getCatalogs() {
  const promisifiedClient = setupUsersClient("getCatalogs");
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
  const response = await call_service({}, promisifiedClient);
  return response;
}

async function listUsers(query) {
  try {
    const promisifiedClient = setupUsersClient("listUsers");
    // @todo add SearchParam (filters)
    // var param = new messages.Param().setName('disabled').setValue(false);
    // var request = new messages.SearchParams();
    // var param = new messages.Param();
    // param.setName("role_id");
    // param.setValue("1");
    // request.addParamlist();
    //request.addPageparamlist(null);
    const paramList = [];
    if (query.roleId) {
      paramList.push({
        name: "role_id",
        value: query.roleId,
      });
    }
    if (query.disabled) {
      paramList.push({
        name: "disabled",
        value: query.disabled,
      });
    }
    const params = {
      paramList,
      pageParamList: [
        {
          name: "order_by",
          value: query.order_by || "id",
        },
        {
          name: "order",
          value: query.order,
        },
        {
          name: "per_page",
          value: query.per_page,
        },
        {
          name: "page",
          value: query.page,
        },
      ],
    };
    const call_service = async (req, service_name) => {
      try {
        const response = await service_name(req);
        return response;
      } catch (error) {
        /* @todo Return HTTP 500 code or something appropied */
        console.log("error", error);
      }
    };
    const response = await call_service(params, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function createUser(fields) {
  const promisifiedClient = setupUsersClient("alterUser");
  const user = {
    userId: 0,
    username: fields.username,
    passwd: fields.username,
    roleId: 1, // @todo remove this hardcoded value
    disabled: fields.disabled,
    firstName: fields.firstName,
    lastName: fields.lastName,
    authorities: fields.authorities || [],
  };
  try {
    const call_service = async (req, service) => {
      try {
        // @todo add SearchParam (filters)
        // var param = new messages.Param().setName('disabled').setValue(false);
        const response = await service(req);
        return response;
      } catch (error) {
        /* @todo Return HTTP 500 code or something appropied */
        console.log("error", error);
      }
    };
    const response = await call_service(user, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function readUser(id) {
  const promisifiedClient = setupUsersClient("getUser");
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

async function updateUser(id, fields) {
  const promisifiedClient = setupUsersClient("alterUser");
  const user = {
    userId: id,
    username: fields.username,
    passwd: fields.username,
    roleId: fields.roleId,
    disabled: fields.disabled,
    firstName: fields.firstName,
    lastName: fields.lastName,
    authorities: fields.authorities || [],
  };
  try {
    const call_service = async (req, service) => {
      try {
        // @todo add SearchParam (filters)
        // var param = new messages.Param().setName('disabled').setValue(false);
        const response = await service(req);
        return response;
      } catch (error) {
        /* @todo Return HTTP 500 code or something appropied */
        console.log("error", error);
      }
    };
    const response = await call_service(user, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function deleteUser(id) {
  const promisifiedClient = setupUsersClient("deleteUser");
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
  updateUser,
  deleteUser,
  getCatalogs,
};
