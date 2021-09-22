// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var statuses_pb = require('./statuses_pb.js');

function serialize_dylk_StatusListResponse(arg) {
  if (!(arg instanceof statuses_pb.StatusListResponse)) {
    throw new Error('Expected argument of type dylk.StatusListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_StatusListResponse(buffer_arg) {
  return statuses_pb.StatusListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_StatusParams(arg) {
  if (!(arg instanceof statuses_pb.StatusParams)) {
    throw new Error('Expected argument of type dylk.StatusParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_StatusParams(buffer_arg) {
  return statuses_pb.StatusParams.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Statuses service definition.
var StatusesService = exports.StatusesService = {
  listStatuses: {
    path: '/dylk.Statuses/ListStatuses',
    requestStream: false,
    responseStream: false,
    requestType: statuses_pb.StatusParams,
    responseType: statuses_pb.StatusListResponse,
    requestSerialize: serialize_dylk_StatusParams,
    requestDeserialize: deserialize_dylk_StatusParams,
    responseSerialize: serialize_dylk_StatusListResponse,
    responseDeserialize: deserialize_dylk_StatusListResponse,
  },
};

exports.StatusesClient = grpc.makeGenericClientConstructor(StatusesService);
