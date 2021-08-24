// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var units_pb = require('./units_pb.js');

function serialize_dylk_Unit(arg) {
  if (!(arg instanceof units_pb.Unit)) {
    throw new Error('Expected argument of type dylk.Unit');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_Unit(buffer_arg) {
  return units_pb.Unit.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UnitGeneralResponse(arg) {
  if (!(arg instanceof units_pb.UnitGeneralResponse)) {
    throw new Error('Expected argument of type dylk.UnitGeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UnitGeneralResponse(buffer_arg) {
  return units_pb.UnitGeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UnitId(arg) {
  if (!(arg instanceof units_pb.UnitId)) {
    throw new Error('Expected argument of type dylk.UnitId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UnitId(buffer_arg) {
  return units_pb.UnitId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UnitListResponse(arg) {
  if (!(arg instanceof units_pb.UnitListResponse)) {
    throw new Error('Expected argument of type dylk.UnitListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UnitListResponse(buffer_arg) {
  return units_pb.UnitListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UnitParams(arg) {
  if (!(arg instanceof units_pb.UnitParams)) {
    throw new Error('Expected argument of type dylk.UnitParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UnitParams(buffer_arg) {
  return units_pb.UnitParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UnitResponse(arg) {
  if (!(arg instanceof units_pb.UnitResponse)) {
    throw new Error('Expected argument of type dylk.UnitResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UnitResponse(buffer_arg) {
  return units_pb.UnitResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Units service definition.
var UnitsService = exports.UnitsService = {
  alterUnit: {
    path: '/dylk.Units/AlterUnit',
    requestStream: false,
    responseStream: false,
    requestType: units_pb.Unit,
    responseType: units_pb.UnitGeneralResponse,
    requestSerialize: serialize_dylk_Unit,
    requestDeserialize: deserialize_dylk_Unit,
    responseSerialize: serialize_dylk_UnitGeneralResponse,
    responseDeserialize: deserialize_dylk_UnitGeneralResponse,
  },
  listUnits: {
    path: '/dylk.Units/ListUnits',
    requestStream: false,
    responseStream: false,
    requestType: units_pb.UnitParams,
    responseType: units_pb.UnitListResponse,
    requestSerialize: serialize_dylk_UnitParams,
    requestDeserialize: deserialize_dylk_UnitParams,
    responseSerialize: serialize_dylk_UnitListResponse,
    responseDeserialize: deserialize_dylk_UnitListResponse,
  },
  getUnit: {
    path: '/dylk.Units/GetUnit',
    requestStream: false,
    responseStream: false,
    requestType: units_pb.UnitId,
    responseType: units_pb.UnitResponse,
    requestSerialize: serialize_dylk_UnitId,
    requestDeserialize: deserialize_dylk_UnitId,
    responseSerialize: serialize_dylk_UnitResponse,
    responseDeserialize: deserialize_dylk_UnitResponse,
  },
  deleteUnit: {
    path: '/dylk.Units/DeleteUnit',
    requestStream: false,
    responseStream: false,
    requestType: units_pb.UnitId,
    responseType: units_pb.UnitGeneralResponse,
    requestSerialize: serialize_dylk_UnitId,
    requestDeserialize: deserialize_dylk_UnitId,
    responseSerialize: serialize_dylk_UnitGeneralResponse,
    responseDeserialize: deserialize_dylk_UnitGeneralResponse,
  },
};

exports.UnitsClient = grpc.makeGenericClientConstructor(UnitsService);
