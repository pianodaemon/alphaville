import sys
import grpc
from concurrent import futures

import users_pb2
import users_pb2_grpc

from dal import users

class Users(users_pb2_grpc.UsersServicer):

    def AlterUser(self, request, context):
        print(request)

        ret_code, ret_message = users.alter_user(
            request.userId,
            request.username,
            request.passwd,
            request.roleId,
            request.disabled,
            request.firstName,
            request.lastName,
            list(request.authorities)
        )

        return users_pb2.GeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def ListUsers(self, request, context):
        print(request)

        ret_code, ret_message, user_list, total_items, total_pages = users.list_users(
            request.paramList,
            request.pageParamList
        )

        return users_pb2.UserListResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            userList=user_list,
            totalItems=total_items,
            totalPages=total_pages
        )


    def AuthUser(self, request, context):
        print(request)

        ret_code, ret_message = users.auth_user(
            request.username,
            request.passwd
        )

        return users_pb2.GeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def GetUser(self, request, context):
        print(request)

        ret_code, ret_message, user_data = users.get_user(
            request.id
        )

        return users_pb2.UserResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            user=user_data
        )


    def DeleteUser(self, request, context):
        print(request)

        ret_code, ret_message = users.delete_user(
            request.id
        )

        return users_pb2.GeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def GetCatalogs(self, request, context):
        print(request)

        ret_code, ret_message, role_list, app_list, authority_list = users.get_catalogs()

        return users_pb2.CatalogsResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            roleList=role_list,
            appList=app_list,
            authorityList=authority_list
        )


def _engage():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    users_pb2_grpc.add_UsersServicer_to_server(Users(), server)
    server.add_insecure_port('[::]:10080')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':

    try:
        _engage()
    except KeyboardInterrupt:
        print('Exiting')
    except:
        if True:
            print('Whoops! Problem in server:', file=sys.stderr)
            # traceback.print_exc(file=sys.stderr)
        sys.exit(1)

    # assuming everything went right, exit gracefully
    sys.exit(0)
