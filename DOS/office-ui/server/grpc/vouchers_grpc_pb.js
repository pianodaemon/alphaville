// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var vouchers_pb = require('./vouchers_pb.js');

function serialize_dylk_SalidaEquipoData(arg) {
  if (!(arg instanceof vouchers_pb.SalidaEquipoData)) {
    throw new Error('Expected argument of type dylk.SalidaEquipoData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_SalidaEquipoData(buffer_arg) {
  return vouchers_pb.SalidaEquipoData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_Voucher(arg) {
  if (!(arg instanceof vouchers_pb.Voucher)) {
    throw new Error('Expected argument of type dylk.Voucher');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_Voucher(buffer_arg) {
  return vouchers_pb.Voucher.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_VoucherGeneralResponse(arg) {
  if (!(arg instanceof vouchers_pb.VoucherGeneralResponse)) {
    throw new Error('Expected argument of type dylk.VoucherGeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_VoucherGeneralResponse(buffer_arg) {
  return vouchers_pb.VoucherGeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_VoucherId(arg) {
  if (!(arg instanceof vouchers_pb.VoucherId)) {
    throw new Error('Expected argument of type dylk.VoucherId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_VoucherId(buffer_arg) {
  return vouchers_pb.VoucherId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_VoucherIdList(arg) {
  if (!(arg instanceof vouchers_pb.VoucherIdList)) {
    throw new Error('Expected argument of type dylk.VoucherIdList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_VoucherIdList(buffer_arg) {
  return vouchers_pb.VoucherIdList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_VoucherListResponse(arg) {
  if (!(arg instanceof vouchers_pb.VoucherListResponse)) {
    throw new Error('Expected argument of type dylk.VoucherListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_VoucherListResponse(buffer_arg) {
  return vouchers_pb.VoucherListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_VoucherParams(arg) {
  if (!(arg instanceof vouchers_pb.VoucherParams)) {
    throw new Error('Expected argument of type dylk.VoucherParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_VoucherParams(buffer_arg) {
  return vouchers_pb.VoucherParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_VoucherResponse(arg) {
  if (!(arg instanceof vouchers_pb.VoucherResponse)) {
    throw new Error('Expected argument of type dylk.VoucherResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_VoucherResponse(buffer_arg) {
  return vouchers_pb.VoucherResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Vouchers service definition.
var VouchersService = exports.VouchersService = {
  alterVoucher: {
    path: '/dylk.Vouchers/AlterVoucher',
    requestStream: false,
    responseStream: false,
    requestType: vouchers_pb.Voucher,
    responseType: vouchers_pb.VoucherGeneralResponse,
    requestSerialize: serialize_dylk_Voucher,
    requestDeserialize: deserialize_dylk_Voucher,
    responseSerialize: serialize_dylk_VoucherGeneralResponse,
    responseDeserialize: deserialize_dylk_VoucherGeneralResponse,
  },
  listVouchers: {
    path: '/dylk.Vouchers/ListVouchers',
    requestStream: false,
    responseStream: false,
    requestType: vouchers_pb.VoucherParams,
    responseType: vouchers_pb.VoucherListResponse,
    requestSerialize: serialize_dylk_VoucherParams,
    requestDeserialize: deserialize_dylk_VoucherParams,
    responseSerialize: serialize_dylk_VoucherListResponse,
    responseDeserialize: deserialize_dylk_VoucherListResponse,
  },
  getVoucher: {
    path: '/dylk.Vouchers/GetVoucher',
    requestStream: false,
    responseStream: false,
    requestType: vouchers_pb.VoucherId,
    responseType: vouchers_pb.VoucherResponse,
    requestSerialize: serialize_dylk_VoucherId,
    requestDeserialize: deserialize_dylk_VoucherId,
    responseSerialize: serialize_dylk_VoucherResponse,
    responseDeserialize: deserialize_dylk_VoucherResponse,
  },
  doSalidaEquipo: {
    path: '/dylk.Vouchers/DoSalidaEquipo',
    requestStream: false,
    responseStream: false,
    requestType: vouchers_pb.SalidaEquipoData,
    responseType: vouchers_pb.VoucherGeneralResponse,
    requestSerialize: serialize_dylk_SalidaEquipoData,
    requestDeserialize: deserialize_dylk_SalidaEquipoData,
    responseSerialize: serialize_dylk_VoucherGeneralResponse,
    responseDeserialize: deserialize_dylk_VoucherGeneralResponse,
  },
  doSalidasEquipoValeCompleto: {
    path: '/dylk.Vouchers/DoSalidasEquipoValeCompleto',
    requestStream: false,
    responseStream: false,
    requestType: vouchers_pb.VoucherIdList,
    responseType: vouchers_pb.VoucherGeneralResponse,
    requestSerialize: serialize_dylk_VoucherIdList,
    requestDeserialize: deserialize_dylk_VoucherIdList,
    responseSerialize: serialize_dylk_VoucherGeneralResponse,
    responseDeserialize: deserialize_dylk_VoucherGeneralResponse,
  },
};

exports.VouchersClient = grpc.makeGenericClientConstructor(VouchersService);
