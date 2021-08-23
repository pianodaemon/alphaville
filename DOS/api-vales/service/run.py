import sys
import grpc
from concurrent import futures

import users_pb2
import users_pb2_grpc
import patios_pb2
import patios_pb2_grpc
import equipments_pb2
import equipments_pb2_grpc

from dal import users
from dal import patios
from dal import equipments

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


class Patios(patios_pb2_grpc.PatiosServicer):

    def AlterPatio(self, request, context):
        print(request)

        ret_code, ret_message = patios.alter_patio(
            request.id,
            request.code,
            request.title
        )

        return patios_pb2.PatioGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def ListPatios(self, request, context):
        print(request)

        ret_code, ret_message, patio_list, total_items, total_pages = patios.list_patios(
            request.paramList,
            request.pageParamList
        )

        return patios_pb2.PatioListResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            patioList=patio_list,
            totalItems=total_items,
            totalPages=total_pages
        )


    def GetPatio(self, request, context):
        print(request)

        ret_code, ret_message, patio_data = patios.get_patio(
            request.id
        )

        return patios_pb2.PatioResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            patio=patio_data
        )


    def DeletePatio(self, request, context):
        print(request)

        ret_code, ret_message = patios.delete_patio(
            request.id
        )

        return patios_pb2.PatioGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


class Equipments(equipments_pb2_grpc.EquipmentsServicer):

    def AlterEquipment(self, request, context):
        print(request)

        ret_code, ret_message = equipments.alter_equipment(
            request.id,
            request.code,
            request.title
        )

        return equipments_pb2.EquipmentGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def ListEquipments(self, request, context):
        print(request)

        ret_code, ret_message, equipment_list, total_items, total_pages = equipments.list_equipments(
            request.paramList,
            request.pageParamList
        )

        return equipments_pb2.EquipmentListResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            equipmentList=equipment_list,
            totalItems=total_items,
            totalPages=total_pages
        )


    def GetEquipment(self, request, context):
        print(request)

        ret_code, ret_message, equipment_data = equipments.get_equipment(
            request.id
        )

        return equipments_pb2.EquipmentResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            equipment=equipment_data
        )


    def DeleteEquipment(self, request, context):
        print(request)

        ret_code, ret_message = equipments.delete_equipment(
            request.id
        )

        return equipments_pb2.EquipmentGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


def _engage():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    users_pb2_grpc.add_UsersServicer_to_server(Users(), server)
    patios_pb2_grpc.add_PatiosServicer_to_server(Patios(), server)
    equipments_pb2_grpc.add_EquipmentsServicer_to_server(Equipments(), server)
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
