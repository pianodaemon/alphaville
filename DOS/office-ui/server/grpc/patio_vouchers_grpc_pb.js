// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var patio_vouchers_pb = require('./patio_vouchers_pb.js');

function serialize_dylk_patio_PatioVoucher(arg) {
  if (!(arg instanceof patio_vouchers_pb.PatioVoucher)) {
    throw new Error('Expected argument of type dylk.patio.PatioVoucher');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_patio_PatioVoucher(buffer_arg) {
  return patio_vouchers_pb.PatioVoucher.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_patio_PatioVoucherGeneralResponse(arg) {
  if (!(arg instanceof patio_vouchers_pb.PatioVoucherGeneralResponse)) {
    throw new Error('Expected argument of type dylk.patio.PatioVoucherGeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_patio_PatioVoucherGeneralResponse(buffer_arg) {
  return patio_vouchers_pb.PatioVoucherGeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_patio_PatioVoucherId(arg) {
  if (!(arg instanceof patio_vouchers_pb.PatioVoucherId)) {
    throw new Error('Expected argument of type dylk.patio.PatioVoucherId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_patio_PatioVoucherId(buffer_arg) {
  return patio_vouchers_pb.PatioVoucherId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_patio_PatioVoucherListResponse(arg) {
  if (!(arg instanceof patio_vouchers_pb.PatioVoucherListResponse)) {
    throw new Error('Expected argument of type dylk.patio.PatioVoucherListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_patio_PatioVoucherListResponse(buffer_arg) {
  return patio_vouchers_pb.PatioVoucherListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_patio_PatioVoucherParams(arg) {
  if (!(arg instanceof patio_vouchers_pb.PatioVoucherParams)) {
    throw new Error('Expected argument of type dylk.patio.PatioVoucherParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_patio_PatioVoucherParams(buffer_arg) {
  return patio_vouchers_pb.PatioVoucherParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_patio_PatioVoucherResponse(arg) {
  if (!(arg instanceof patio_vouchers_pb.PatioVoucherResponse)) {
    throw new Error('Expected argument of type dylk.patio.PatioVoucherResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_patio_PatioVoucherResponse(buffer_arg) {
  return patio_vouchers_pb.PatioVoucherResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The PatioVouchers service definition.
var PatioVouchersService = exports.PatioVouchersService = {
  alterPatioVoucher: {
    path: '/dylk.patio.PatioVouchers/AlterPatioVoucher',
    requestStream: false,
    responseStream: false,
    requestType: patio_vouchers_pb.PatioVoucher,
    responseType: patio_vouchers_pb.PatioVoucherGeneralResponse,
    requestSerialize: serialize_dylk_patio_PatioVoucher,
    requestDeserialize: deserialize_dylk_patio_PatioVoucher,
    responseSerialize: serialize_dylk_patio_PatioVoucherGeneralResponse,
    responseDeserialize: deserialize_dylk_patio_PatioVoucherGeneralResponse,
  },
  listPatioVouchers: {
    path: '/dylk.patio.PatioVouchers/ListPatioVouchers',
    requestStream: false,
    responseStream: false,
    requestType: patio_vouchers_pb.PatioVoucherParams,
    responseType: patio_vouchers_pb.PatioVoucherListResponse,
    requestSerialize: serialize_dylk_patio_PatioVoucherParams,
    requestDeserialize: deserialize_dylk_patio_PatioVoucherParams,
    responseSerialize: serialize_dylk_patio_PatioVoucherListResponse,
    responseDeserialize: deserialize_dylk_patio_PatioVoucherListResponse,
  },
  getPatioVoucher: {
    path: '/dylk.patio.PatioVouchers/GetPatioVoucher',
    requestStream: false,
    responseStream: false,
    requestType: patio_vouchers_pb.PatioVoucherId,
    responseType: patio_vouchers_pb.PatioVoucherResponse,
    requestSerialize: serialize_dylk_patio_PatioVoucherId,
    requestDeserialize: deserialize_dylk_patio_PatioVoucherId,
    responseSerialize: serialize_dylk_patio_PatioVoucherResponse,
    responseDeserialize: deserialize_dylk_patio_PatioVoucherResponse,
  },
};

exports.PatioVouchersClient = grpc.makeGenericClientConstructor(PatioVouchersService);
