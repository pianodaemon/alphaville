// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var patios_pb = require('./patios_pb.js');

function serialize_dylk_Patio(arg) {
  if (!(arg instanceof patios_pb.Patio)) {
    throw new Error('Expected argument of type dylk.Patio');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_Patio(buffer_arg) {
  return patios_pb.Patio.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_PatioGeneralResponse(arg) {
  if (!(arg instanceof patios_pb.PatioGeneralResponse)) {
    throw new Error('Expected argument of type dylk.PatioGeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_PatioGeneralResponse(buffer_arg) {
  return patios_pb.PatioGeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_PatioId(arg) {
  if (!(arg instanceof patios_pb.PatioId)) {
    throw new Error('Expected argument of type dylk.PatioId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_PatioId(buffer_arg) {
  return patios_pb.PatioId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_PatioListResponse(arg) {
  if (!(arg instanceof patios_pb.PatioListResponse)) {
    throw new Error('Expected argument of type dylk.PatioListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_PatioListResponse(buffer_arg) {
  return patios_pb.PatioListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_PatioParams(arg) {
  if (!(arg instanceof patios_pb.PatioParams)) {
    throw new Error('Expected argument of type dylk.PatioParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_PatioParams(buffer_arg) {
  return patios_pb.PatioParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_PatioResponse(arg) {
  if (!(arg instanceof patios_pb.PatioResponse)) {
    throw new Error('Expected argument of type dylk.PatioResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_PatioResponse(buffer_arg) {
  return patios_pb.PatioResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Patios service definition.
var PatiosService = exports.PatiosService = {
  alterPatio: {
    path: '/dylk.Patios/AlterPatio',
    requestStream: false,
    responseStream: false,
    requestType: patios_pb.Patio,
    responseType: patios_pb.PatioGeneralResponse,
    requestSerialize: serialize_dylk_Patio,
    requestDeserialize: deserialize_dylk_Patio,
    responseSerialize: serialize_dylk_PatioGeneralResponse,
    responseDeserialize: deserialize_dylk_PatioGeneralResponse,
  },
  listPatios: {
    path: '/dylk.Patios/ListPatios',
    requestStream: false,
    responseStream: false,
    requestType: patios_pb.PatioParams,
    responseType: patios_pb.PatioListResponse,
    requestSerialize: serialize_dylk_PatioParams,
    requestDeserialize: deserialize_dylk_PatioParams,
    responseSerialize: serialize_dylk_PatioListResponse,
    responseDeserialize: deserialize_dylk_PatioListResponse,
  },
  getPatio: {
    path: '/dylk.Patios/GetPatio',
    requestStream: false,
    responseStream: false,
    requestType: patios_pb.PatioId,
    responseType: patios_pb.PatioResponse,
    requestSerialize: serialize_dylk_PatioId,
    requestDeserialize: deserialize_dylk_PatioId,
    responseSerialize: serialize_dylk_PatioResponse,
    responseDeserialize: deserialize_dylk_PatioResponse,
  },
  deletePatio: {
    path: '/dylk.Patios/DeletePatio',
    requestStream: false,
    responseStream: false,
    requestType: patios_pb.PatioId,
    responseType: patios_pb.PatioGeneralResponse,
    requestSerialize: serialize_dylk_PatioId,
    requestDeserialize: deserialize_dylk_PatioId,
    responseSerialize: serialize_dylk_PatioGeneralResponse,
    responseDeserialize: deserialize_dylk_PatioGeneralResponse,
  },
};

exports.PatiosClient = grpc.makeGenericClientConstructor(PatiosService);
