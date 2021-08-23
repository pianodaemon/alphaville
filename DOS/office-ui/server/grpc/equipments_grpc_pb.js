// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var equipments_pb = require('./equipments_pb.js');

function serialize_dylk_Equipment(arg) {
  if (!(arg instanceof equipments_pb.Equipment)) {
    throw new Error('Expected argument of type dylk.Equipment');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_Equipment(buffer_arg) {
  return equipments_pb.Equipment.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_EquipmentGeneralResponse(arg) {
  if (!(arg instanceof equipments_pb.EquipmentGeneralResponse)) {
    throw new Error('Expected argument of type dylk.EquipmentGeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_EquipmentGeneralResponse(buffer_arg) {
  return equipments_pb.EquipmentGeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_EquipmentId(arg) {
  if (!(arg instanceof equipments_pb.EquipmentId)) {
    throw new Error('Expected argument of type dylk.EquipmentId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_EquipmentId(buffer_arg) {
  return equipments_pb.EquipmentId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_EquipmentListResponse(arg) {
  if (!(arg instanceof equipments_pb.EquipmentListResponse)) {
    throw new Error('Expected argument of type dylk.EquipmentListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_EquipmentListResponse(buffer_arg) {
  return equipments_pb.EquipmentListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_EquipmentParams(arg) {
  if (!(arg instanceof equipments_pb.EquipmentParams)) {
    throw new Error('Expected argument of type dylk.EquipmentParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_EquipmentParams(buffer_arg) {
  return equipments_pb.EquipmentParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_EquipmentResponse(arg) {
  if (!(arg instanceof equipments_pb.EquipmentResponse)) {
    throw new Error('Expected argument of type dylk.EquipmentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_EquipmentResponse(buffer_arg) {
  return equipments_pb.EquipmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Equipments service definition.
var EquipmentsService = exports.EquipmentsService = {
  alterEquipment: {
    path: '/dylk.Equipments/AlterEquipment',
    requestStream: false,
    responseStream: false,
    requestType: equipments_pb.Equipment,
    responseType: equipments_pb.EquipmentGeneralResponse,
    requestSerialize: serialize_dylk_Equipment,
    requestDeserialize: deserialize_dylk_Equipment,
    responseSerialize: serialize_dylk_EquipmentGeneralResponse,
    responseDeserialize: deserialize_dylk_EquipmentGeneralResponse,
  },
  listEquipments: {
    path: '/dylk.Equipments/ListEquipments',
    requestStream: false,
    responseStream: false,
    requestType: equipments_pb.EquipmentParams,
    responseType: equipments_pb.EquipmentListResponse,
    requestSerialize: serialize_dylk_EquipmentParams,
    requestDeserialize: deserialize_dylk_EquipmentParams,
    responseSerialize: serialize_dylk_EquipmentListResponse,
    responseDeserialize: deserialize_dylk_EquipmentListResponse,
  },
  getEquipment: {
    path: '/dylk.Equipments/GetEquipment',
    requestStream: false,
    responseStream: false,
    requestType: equipments_pb.EquipmentId,
    responseType: equipments_pb.EquipmentResponse,
    requestSerialize: serialize_dylk_EquipmentId,
    requestDeserialize: deserialize_dylk_EquipmentId,
    responseSerialize: serialize_dylk_EquipmentResponse,
    responseDeserialize: deserialize_dylk_EquipmentResponse,
  },
  deleteEquipment: {
    path: '/dylk.Equipments/DeleteEquipment',
    requestStream: false,
    responseStream: false,
    requestType: equipments_pb.EquipmentId,
    responseType: equipments_pb.EquipmentGeneralResponse,
    requestSerialize: serialize_dylk_EquipmentId,
    requestDeserialize: deserialize_dylk_EquipmentId,
    responseSerialize: serialize_dylk_EquipmentGeneralResponse,
    responseDeserialize: deserialize_dylk_EquipmentGeneralResponse,
  },
};

exports.EquipmentsClient = grpc.makeGenericClientConstructor(EquipmentsService);
