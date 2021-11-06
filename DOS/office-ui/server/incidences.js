const util = require("util");
const { promisify } = util;
//var parseArgs = require("minimist");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
//var parseArgs = require("minimist");
var messages = require("./grpc/incidences_pb");
var services = require("./grpc/incidences_grpc_pb");
const TARGET =
  process.env.NODE_ENV === "production"
    ? "neon_nights:10080"
    : "localhost:10080";
const PROTO_PATH = __dirname + "/grpc/protos/incidences.proto";
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const IncidenceService =
  grpc.loadPackageDefinition(packageDefinition).dylk.incidence.Incidences;

function setupIncidenceClient(method) {
  const client = new IncidenceService(
    TARGET,
    grpc.credentials.createInsecure()
  );
  return (promisifiedClient = promisify(client[method]).bind(client));
}

async function listIncidences(query) {
  try {
    const promisifiedClient = setupIncidenceClient("listIncidences");
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

async function createIncidence(fields) {
  const promisifiedClient = setupIncidenceClient("alterIncidence");
  const incidence = {
    ...fields,
    id: "",
    voucherId: fields.id,
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
    const response = await call_service(incidence, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function readIncidence(id) {
  const promisifiedClient = setupIncidenceClient("getIncidence");
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

async function updateIncidence(id, fields) {
  const promisifiedClient = setupIncidenceClient("alterIncidence");
  const incidence = {
    ...fields,
    id,
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
    const response = await call_service(incidence, promisifiedClient);
    return response;
  } catch (e) {
    console.log("error", e);
  }
}

async function deleteIncidence(id) {
  const promisifiedClient = setupIncidenceClient("deleteIncidence");
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
  listIncidences,
  createIncidence,
  readIncidence,
  updateIncidence,
  deleteIncidence,
};
