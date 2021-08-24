// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var carriers_pb = require('./carriers_pb.js');

function serialize_dylk_Carrier(arg) {
  if (!(arg instanceof carriers_pb.Carrier)) {
    throw new Error('Expected argument of type dylk.Carrier');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_Carrier(buffer_arg) {
  return carriers_pb.Carrier.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_CarrierGeneralResponse(arg) {
  if (!(arg instanceof carriers_pb.CarrierGeneralResponse)) {
    throw new Error('Expected argument of type dylk.CarrierGeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_CarrierGeneralResponse(buffer_arg) {
  return carriers_pb.CarrierGeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_CarrierId(arg) {
  if (!(arg instanceof carriers_pb.CarrierId)) {
    throw new Error('Expected argument of type dylk.CarrierId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_CarrierId(buffer_arg) {
  return carriers_pb.CarrierId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_CarrierListResponse(arg) {
  if (!(arg instanceof carriers_pb.CarrierListResponse)) {
    throw new Error('Expected argument of type dylk.CarrierListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_CarrierListResponse(buffer_arg) {
  return carriers_pb.CarrierListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_CarrierParams(arg) {
  if (!(arg instanceof carriers_pb.CarrierParams)) {
    throw new Error('Expected argument of type dylk.CarrierParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_CarrierParams(buffer_arg) {
  return carriers_pb.CarrierParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_CarrierResponse(arg) {
  if (!(arg instanceof carriers_pb.CarrierResponse)) {
    throw new Error('Expected argument of type dylk.CarrierResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_CarrierResponse(buffer_arg) {
  return carriers_pb.CarrierResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Carriers service definition.
var CarriersService = exports.CarriersService = {
  alterCarrier: {
    path: '/dylk.Carriers/AlterCarrier',
    requestStream: false,
    responseStream: false,
    requestType: carriers_pb.Carrier,
    responseType: carriers_pb.CarrierGeneralResponse,
    requestSerialize: serialize_dylk_Carrier,
    requestDeserialize: deserialize_dylk_Carrier,
    responseSerialize: serialize_dylk_CarrierGeneralResponse,
    responseDeserialize: deserialize_dylk_CarrierGeneralResponse,
  },
  listCarriers: {
    path: '/dylk.Carriers/ListCarriers',
    requestStream: false,
    responseStream: false,
    requestType: carriers_pb.CarrierParams,
    responseType: carriers_pb.CarrierListResponse,
    requestSerialize: serialize_dylk_CarrierParams,
    requestDeserialize: deserialize_dylk_CarrierParams,
    responseSerialize: serialize_dylk_CarrierListResponse,
    responseDeserialize: deserialize_dylk_CarrierListResponse,
  },
  getCarrier: {
    path: '/dylk.Carriers/GetCarrier',
    requestStream: false,
    responseStream: false,
    requestType: carriers_pb.CarrierId,
    responseType: carriers_pb.CarrierResponse,
    requestSerialize: serialize_dylk_CarrierId,
    requestDeserialize: deserialize_dylk_CarrierId,
    responseSerialize: serialize_dylk_CarrierResponse,
    responseDeserialize: deserialize_dylk_CarrierResponse,
  },
  deleteCarrier: {
    path: '/dylk.Carriers/DeleteCarrier',
    requestStream: false,
    responseStream: false,
    requestType: carriers_pb.CarrierId,
    responseType: carriers_pb.CarrierGeneralResponse,
    requestSerialize: serialize_dylk_CarrierId,
    requestDeserialize: deserialize_dylk_CarrierId,
    responseSerialize: serialize_dylk_CarrierGeneralResponse,
    responseDeserialize: deserialize_dylk_CarrierGeneralResponse,
  },
};

exports.CarriersClient = grpc.makeGenericClientConstructor(CarriersService);
