import sys
import grpc
from concurrent import futures

import users_pb2
import users_pb2_grpc
import patios_pb2
import patios_pb2_grpc
import equipments_pb2
import equipments_pb2_grpc
import units_pb2
import units_pb2_grpc
import carriers_pb2
import carriers_pb2_grpc
import vouchers_pb2
import vouchers_pb2_grpc
import statuses_pb2
import statuses_pb2_grpc

from dal import users
from dal import patios
from dal import equipments
from dal import units
from dal import carriers
from dal.vouchers import VouchersPersistence
from dal import statuses

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
            request.authorities
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
            request.title,
            request.unitCost,
            request.regular,
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


class Units(units_pb2_grpc.UnitsServicer):

    def AlterUnit(self, request, context):
        print(request)

        ret_code, ret_message = units.alter_unit(
            request.id,
            request.code,
            request.title
        )

        return units_pb2.UnitGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def ListUnits(self, request, context):
        print(request)

        ret_code, ret_message, unit_list, total_items, total_pages = units.list_units(
            request.paramList,
            request.pageParamList
        )

        return units_pb2.UnitListResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            unitList=unit_list,
            totalItems=total_items,
            totalPages=total_pages
        )


    def GetUnit(self, request, context):
        print(request)

        ret_code, ret_message, unit_data = units.get_unit(
            request.id
        )

        return units_pb2.UnitResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            unit=unit_data
        )


    def DeleteUnit(self, request, context):
        print(request)

        ret_code, ret_message = units.delete_unit(
            request.id
        )

        return units_pb2.UnitGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


class Carriers(carriers_pb2_grpc.CarriersServicer):

    def AlterCarrier(self, request, context):
        print(request)

        ret_code, ret_message = carriers.alter_carrier(
            request.id,
            request.code,
            request.title,
            request.disabled
        )

        return carriers_pb2.CarrierGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def ListCarriers(self, request, context):
        print(request)

        ret_code, ret_message, carrier_list, total_items, total_pages = carriers.list_carriers(
            request.paramList,
            request.pageParamList
        )

        return carriers_pb2.CarrierListResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            carrierList=carrier_list,
            totalItems=total_items,
            totalPages=total_pages
        )


    def GetCarrier(self, request, context):
        print(request)

        ret_code, ret_message, carrier_data = carriers.get_carrier(
            request.id
        )

        return carriers_pb2.CarrierResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            carrier=carrier_data
        )


    def DeleteCarrier(self, request, context):
        print(request)

        ret_code, ret_message = carriers.delete_carrier(
            request.id
        )

        return carriers_pb2.CarrierGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


class Vouchers(vouchers_pb2_grpc.VouchersServicer):

    def AlterVoucher(self, request, context):
        print(request)

        item_list = []
        for i in request.itemList:
            item_list.append({"equipmentCode": i.equipmentCode, "quantity": i.quantity})

        ret_code, ret_message = VouchersPersistence.alter(
            request.id,
            request.platform,
            request.carrierCode,
            request.patioCode,
            request.observations,
            request.unitCode,
            request.deliveredBy,
            request.receivedBy,
            request.status,
            item_list,
        )

        return vouchers_pb2.VoucherGeneralResponse(
            returnCode=ret_code,
            returnMessage=ret_message
        )


    def ListVouchers(self, request, context):
        print(request)

        ret_code, ret_message, voucher_list, total_items, total_pages = VouchersPersistence.list_vouchers(
            request.paramList,
            request.pageParamList
        )

        return vouchers_pb2.VoucherListResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            voucherList=voucher_list,
            totalItems=total_items,
            totalPages=total_pages
        )


    def GetVoucher(self, request, context):
        print(request)

        ret_code, ret_message, voucher_data = VouchersPersistence.get_voucher(
            request.id
        )

        return vouchers_pb2.VoucherResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            voucher=voucher_data
        )


class Statuses(statuses_pb2_grpc.StatusesServicer):

    def ListStatuses(self, request, context):
        print(request)

        ret_code, ret_message, status_list, total_items, total_pages = statuses.list_statuses(
            request.paramList,
            request.pageParamList
        )

        return statuses_pb2.StatusListResponse(
            returnCode=ret_code,
            returnMessage=ret_message,
            statusList=status_list,
            totalItems=total_items,
            totalPages=total_pages
        )


def _engage():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    users_pb2_grpc.add_UsersServicer_to_server(Users(), server)
    patios_pb2_grpc.add_PatiosServicer_to_server(Patios(), server)
    equipments_pb2_grpc.add_EquipmentsServicer_to_server(Equipments(), server)
    units_pb2_grpc.add_UnitsServicer_to_server(Units(), server)
    carriers_pb2_grpc.add_CarriersServicer_to_server(Carriers(), server)
    vouchers_pb2_grpc.add_VouchersServicer_to_server(Vouchers(), server)
    statuses_pb2_grpc.add_StatusesServicer_to_server(Statuses(), server)

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
