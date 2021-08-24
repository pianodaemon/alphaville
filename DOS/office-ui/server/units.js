const util = require("util");
const { promisify } = util;
//var parseArgs = require("minimist");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
//var parseArgs = require("minimist");
var messages = require("./grpc/units_pb");
var services = require("./grpc/units_grpc_pb");
const TARGET =
  process.env.NODE_ENV === "production"
    ? "neon_nights:10080"
    : "localhost:10080";
const PROTO_PATH = __dirname + "/grpc/protos/units.proto";
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const UnitService = grpc.loadPackageDefinition(packageDefinition).dylk.Units;

function setupUnitClient(method) {
  const client = new UnitService(TARGET, grpc.credentials.createInsecure());
  return (promisifiedClient = promisify(client[method]).bind(client));
}

async function listUnits(query) {
  try {
    const promisifiedClient = setupUnitClient("listUnits");
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
        name: "code",
        value: query.code,
      });
    }
    if (query.disabled) {
      paramList.push({
        name: "title",
        value: query.title,
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
        // @todo Return HTTP 500 code or something appropied
        console.log("error", error);
      }
    };
    const response = await call_service(params, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function createUnit(fields) {
  const promisifiedClient = setupUnitClient("alterUnit");
  const unit = {
    id: 0,
    code: fields.code,
    title: fields.title,
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
    const response = await call_service(unit, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function readUnit(id) {
  const promisifiedClient = setupUnitClient("getUnit");
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

async function updateUnit(id, fields) {
  const promisifiedClient = setupUnitClient("alterUnit");
  const unit = {
    id,
    code: fields.code,
    title: fields.title,
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
    const response = await call_service(unit, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function deleteUnit(id) {
  const promisifiedClient = setupUnitClient("deleteUnit");
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
  listUnits,
  createUnit,
  readUnit,
  updateUnit,
  deleteUnit,
};
