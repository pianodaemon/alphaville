// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var users_pb = require('./users_pb.js');

function serialize_dylk_CatalogsResponse(arg) {
  if (!(arg instanceof users_pb.CatalogsResponse)) {
    throw new Error('Expected argument of type dylk.CatalogsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_CatalogsResponse(buffer_arg) {
  return users_pb.CatalogsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_GeneralResponse(arg) {
  if (!(arg instanceof users_pb.GeneralResponse)) {
    throw new Error('Expected argument of type dylk.GeneralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_GeneralResponse(buffer_arg) {
  return users_pb.GeneralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_Id(arg) {
  if (!(arg instanceof users_pb.Id)) {
    throw new Error('Expected argument of type dylk.Id');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_Id(buffer_arg) {
  return users_pb.Id.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_SearchParams(arg) {
  if (!(arg instanceof users_pb.SearchParams)) {
    throw new Error('Expected argument of type dylk.SearchParams');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_SearchParams(buffer_arg) {
  return users_pb.SearchParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_User(arg) {
  if (!(arg instanceof users_pb.User)) {
    throw new Error('Expected argument of type dylk.User');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_User(buffer_arg) {
  return users_pb.User.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UserCredentials(arg) {
  if (!(arg instanceof users_pb.UserCredentials)) {
    throw new Error('Expected argument of type dylk.UserCredentials');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UserCredentials(buffer_arg) {
  return users_pb.UserCredentials.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UserListResponse(arg) {
  if (!(arg instanceof users_pb.UserListResponse)) {
    throw new Error('Expected argument of type dylk.UserListResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UserListResponse(buffer_arg) {
  return users_pb.UserListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_UserResponse(arg) {
  if (!(arg instanceof users_pb.UserResponse)) {
    throw new Error('Expected argument of type dylk.UserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_UserResponse(buffer_arg) {
  return users_pb.UserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dylk_Void(arg) {
  if (!(arg instanceof users_pb.Void)) {
    throw new Error('Expected argument of type dylk.Void');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dylk_Void(buffer_arg) {
  return users_pb.Void.deserializeBinary(new Uint8Array(buffer_arg));
}


// -------------------------------------------------------------------------
// The Users service definition.
var UsersService = exports.UsersService = {
  alterUser: {
    path: '/dylk.Users/AlterUser',
    requestStream: false,
    responseStream: false,
    requestType: users_pb.User,
    responseType: users_pb.GeneralResponse,
    requestSerialize: serialize_dylk_User,
    requestDeserialize: deserialize_dylk_User,
    responseSerialize: serialize_dylk_GeneralResponse,
    responseDeserialize: deserialize_dylk_GeneralResponse,
  },
  listUsers: {
    path: '/dylk.Users/ListUsers',
    requestStream: false,
    responseStream: false,
    requestType: users_pb.SearchParams,
    responseType: users_pb.UserListResponse,
    requestSerialize: serialize_dylk_SearchParams,
    requestDeserialize: deserialize_dylk_SearchParams,
    responseSerialize: serialize_dylk_UserListResponse,
    responseDeserialize: deserialize_dylk_UserListResponse,
  },
  authUser: {
    path: '/dylk.Users/AuthUser',
    requestStream: false,
    responseStream: false,
    requestType: users_pb.UserCredentials,
    responseType: users_pb.GeneralResponse,
    requestSerialize: serialize_dylk_UserCredentials,
    requestDeserialize: deserialize_dylk_UserCredentials,
    responseSerialize: serialize_dylk_GeneralResponse,
    responseDeserialize: deserialize_dylk_GeneralResponse,
  },
  getUser: {
    path: '/dylk.Users/GetUser',
    requestStream: false,
    responseStream: false,
    requestType: users_pb.Id,
    responseType: users_pb.UserResponse,
    requestSerialize: serialize_dylk_Id,
    requestDeserialize: deserialize_dylk_Id,
    responseSerialize: serialize_dylk_UserResponse,
    responseDeserialize: deserialize_dylk_UserResponse,
  },
  deleteUser: {
    path: '/dylk.Users/DeleteUser',
    requestStream: false,
    responseStream: false,
    requestType: users_pb.Id,
    responseType: users_pb.GeneralResponse,
    requestSerialize: serialize_dylk_Id,
    requestDeserialize: deserialize_dylk_Id,
    responseSerialize: serialize_dylk_GeneralResponse,
    responseDeserialize: deserialize_dylk_GeneralResponse,
  },
  getCatalogs: {
    path: '/dylk.Users/GetCatalogs',
    requestStream: false,
    responseStream: false,
    requestType: users_pb.Void,
    responseType: users_pb.CatalogsResponse,
    requestSerialize: serialize_dylk_Void,
    requestDeserialize: deserialize_dylk_Void,
    responseSerialize: serialize_dylk_CatalogsResponse,
    responseDeserialize: deserialize_dylk_CatalogsResponse,
  },
};

exports.UsersClient = grpc.makeGenericClientConstructor(UsersService);
