// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var incidences_pb = require('./incidences_pb.js');

function serialize_dylk_incidence_Incidence(arg) {
  if (!(arg instanceof incidences_pb.Incidence)) {
    throw new Error('Expected argument of type dylk.incidence.Incidence');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_incidence_Incidence(buffer_arg) {
  return incidences_pb.Incidence.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_incidence_IncidenceGeneralResponse(arg) {
  if (!(arg instanceof incidences_pb.IncidenceGeneralResponse)) {
    throw new Error('Expected argument of type dylk.incidence.IncidenceGeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_incidence_IncidenceGeneralResponse(buffer_arg) {
  return incidences_pb.IncidenceGeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_incidence_IncidenceId(arg) {
  if (!(arg instanceof incidences_pb.IncidenceId)) {
    throw new Error('Expected argument of type dylk.incidence.IncidenceId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_incidence_IncidenceId(buffer_arg) {
  return incidences_pb.IncidenceId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_incidence_IncidenceListResponse(arg) {
  if (!(arg instanceof incidences_pb.IncidenceListResponse)) {
    throw new Error('Expected argument of type dylk.incidence.IncidenceListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_incidence_IncidenceListResponse(buffer_arg) {
  return incidences_pb.IncidenceListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_incidence_IncidenceParams(arg) {
  if (!(arg instanceof incidences_pb.IncidenceParams)) {
    throw new Error('Expected argument of type dylk.incidence.IncidenceParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_incidence_IncidenceParams(buffer_arg) {
  return incidences_pb.IncidenceParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_incidence_IncidenceResponse(arg) {
  if (!(arg instanceof incidences_pb.IncidenceResponse)) {
    throw new Error('Expected argument of type dylk.incidence.IncidenceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_incidence_IncidenceResponse(buffer_arg) {
  return incidences_pb.IncidenceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Incidences service definition.
var IncidencesService = exports.IncidencesService = {
  alterIncidence: {
    path: '/dylk.incidence.Incidences/AlterIncidence',
    requestStream: false,
    responseStream: false,
    requestType: incidences_pb.Incidence,
    responseType: incidences_pb.IncidenceGeneralResponse,
    requestSerialize: serialize_dylk_incidence_Incidence,
    requestDeserialize: deserialize_dylk_incidence_Incidence,
    responseSerialize: serialize_dylk_incidence_IncidenceGeneralResponse,
    responseDeserialize: deserialize_dylk_incidence_IncidenceGeneralResponse,
  },
  listIncidences: {
    path: '/dylk.incidence.Incidences/ListIncidences',
    requestStream: false,
    responseStream: false,
    requestType: incidences_pb.IncidenceParams,
    responseType: incidences_pb.IncidenceListResponse,
    requestSerialize: serialize_dylk_incidence_IncidenceParams,
    requestDeserialize: deserialize_dylk_incidence_IncidenceParams,
    responseSerialize: serialize_dylk_incidence_IncidenceListResponse,
    responseDeserialize: deserialize_dylk_incidence_IncidenceListResponse,
  },
  getIncidence: {
    path: '/dylk.incidence.Incidences/GetIncidence',
    requestStream: false,
    responseStream: false,
    requestType: incidences_pb.IncidenceId,
    responseType: incidences_pb.IncidenceResponse,
    requestSerialize: serialize_dylk_incidence_IncidenceId,
    requestDeserialize: deserialize_dylk_incidence_IncidenceId,
    responseSerialize: serialize_dylk_incidence_IncidenceResponse,
    responseDeserialize: deserialize_dylk_incidence_IncidenceResponse,
  },
};

exports.IncidencesClient = grpc.makeGenericClientConstructor(IncidencesService);
