import time
import math
import os

import pymongo

from misc.helperpg import exec_steady


class VouchersPersistenceError(Exception):
    """
    VouchersPersistence exception
    """
    def __init__(self, message=None):
        self.message = message

        
class VouchersPersistence(object):

    host = os.getenv('MONGO_HOST')
    port = os.getenv('MONGO_PORT')
    db   = os.getenv('MONGO_DB')
    mongo_uri = "mongodb://{}:{}".format(host, port)

    @classmethod
    def alter(cls, doc_id, platform, carrier_code, patio_code, observations, unit_code, delivered_by, received_by, status, item_list):
        """
        It creates and edits a voucher
        """
        client = VouchersPersistence.get_mongo_client()
        vouchers_coll = client[VouchersPersistence.db].vouchers
        eventlog_coll = client[VouchersPersistence.db].eventLog

        try:
            if doc_id:
                cls._update(vouchers_coll, eventlog_coll, doc_id, carrier_code, patio_code, platform, observations, unit_code, delivered_by, received_by, status, item_list)
            else:
                doc_id = cls._create(vouchers_coll, eventlog_coll, carrier_code, patio_code, platform, observations, unit_code, delivered_by, received_by, status, item_list)
            rc  = doc_id
            msg = ''
        except Exception as err:
            rc  = -1
            msg = repr(err)

        client.close()
        return rc, msg


    @staticmethod
    def _create(collection, eventlog_coll, carrier_code, patio_code, platform, obs, unit_code, delivered_by, received_by, status, items):
        """
        It creates a newer voucher
        within the collection
        """
        # Getting next number from Postgres
        sql = '''
            select * from nextval('voucher_number_seq'::regclass);
        '''
        try:
            rows = exec_steady(sql)
            doc_id = rows[0][0]
        except:
            raise

        # After insertion we shall get
        # a reference to the newer doc
        t = time.time()
        doc = collection.insert_one({
            '_id': doc_id,
            'platform': platform,
            'carrierCode': carrier_code,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'deliveredBy': delivered_by,
            'receivedBy': received_by,
            'status': status,
            'itemList': items,
            'generationTime': t,
            'lastTouchTime': t,
            'blocked': False,
        })

        eventlog_coll.insert_one({
            'voucherId': doc_id,
            'timestamp': t,
            'document': 'vale',
            'documentId': doc_id,
            'operation': 'create',
            'platform': platform,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'originUser': delivered_by,
            'targetUser': received_by,
            'status': status,
            'itemList': items,
        })

        return doc.inserted_id


    @staticmethod
    def _update(collection, eventlog_coll, doc_id, carrier_code, patio_code, platform, obs, unit_code, delivered_by, received_by, status, items):
        """
        It updates any voucher as per
        its document identifier
        """
        # The attributes to update
        t = time.time()
        atu = {
            'platform': platform,
            'carrierCode': carrier_code,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'deliveredBy': delivered_by,
            'receivedBy': received_by,
            'status': status,
            'itemList': items,
            'lastTouchTime': t,
        }

        eventlog_coll.insert_one({
            'voucherId': doc_id,
            'timestamp': t,
            'document': 'vale',
            'documentId': doc_id,
            'operation': 'update',
            'platform': platform,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'originUser': delivered_by,
            'targetUser': received_by,
            'status': status,
            'itemList': items,
        })

        collection.update_one({'_id': doc_id}, {"$set": atu })


    @staticmethod
    def get_mongo_client():
        return pymongo.MongoClient(VouchersPersistence.mongo_uri, serverSelectionTimeoutMS=5000)


    @staticmethod
    def list_vouchers(param_list, page_param_list):
        """Retrieve a list of vouchers"""

        bool_fields = {'salidaFinal', 'blocked'}
        float_fields = set()
        # Processing of Search params
        filter = {'blocked': False}
        for i in param_list:
            if i.name in bool_fields:
                filter[i.name] = False if i.value in ('false', 'False') else True
            elif i.name in float_fields:
                filter[i.name] = float(i.value)
            else:
                filter[i.name] = i.value

        client = VouchersPersistence.get_mongo_client()
        vouchers_coll = client[VouchersPersistence.db].vouchers

        # Count items
        total_items = vouchers_coll.count_documents(filter)

        # Processing of Pagination params
        d = {}
        for i in page_param_list:
            d[i.name] = i.value

        try:
            per_page = int(d['per_page'])
        except Exception:
            per_page = 10

        try:
            page = int(d['page'])
        except Exception:
            page = 1

        try:
            order_by = d['order_by']
            if order_by == 'id':
                order_by = '_id'

        except Exception:
            order_by = '_id'

        try:
            order = d['order']
        except Exception:
            order = 'asc'

        # Some calculations
        total_pages = math.ceil(total_items / per_page)

        whole_pages_offset = per_page * (page - 1)
        if whole_pages_offset >= total_items:
            return -1, "Page {} does not exist".format(page), [], total_items, total_pages

        target_items = total_items - whole_pages_offset
        if target_items > per_page:
            target_items = per_page

        try:
            docs = vouchers_coll.find(filter, {
                "platform"    : 1,
                "carrierCode" : 1,
                "patioCode"   : 1,
                "observations": 1,
                "unitCode"    : 1,
                "deliveredBy" : 1,
                "receivedBy"  : 1,
                "status"      : 1,
            }).skip(whole_pages_offset).limit(target_items).sort(order_by, pymongo.ASCENDING if order == 'asc' else pymongo.DESCENDING)

            rc = 0
            msg = ''
            results = []
            for i in docs:
                i['id'] = i['_id']
                del i['_id']
                results.append(i)
                rc += 1

        except Exception as err:
            rc = -1
            msg = repr(err)
            results = []

        client.close()
        return rc, msg, results, total_items, total_pages


    @staticmethod
    def get_voucher(doc_id):
        """Retrieve voucher data"""

        client = VouchersPersistence.get_mongo_client()
        vouchers_coll = client[VouchersPersistence.db].vouchers
        patioVouchers_coll = client[VouchersPersistence.db].patioVouchers
        incidences_coll = client[VouchersPersistence.db].incidences
        eventlog_coll = client[VouchersPersistence.db].eventLog

        try:
            doc = vouchers_coll.find_one({'_id': doc_id, 'blocked': False}, {
                "platform"      : 1,
                "carrierCode"   : 1,
                "patioCode"     : 1,
                "observations"  : 1,
                "unitCode"      : 1,
                "deliveredBy"   : 1,
                "receivedBy"    : 1,
                "status"        : 1,
                "itemList"      : 1,
                "generationTime": 1,
                "lastTouchTime" : 1,
            })

            if doc:
                rc = doc_id
                msg = ''
                doc['id'] = doc_id
                del doc['_id']

                # Retrieve all patioVouchers for the current voucher
                patio_docs = patioVouchers_coll.find({'voucherId': doc_id}, {
                    '_id': 1,
                    'voucherId': 1,
                    'patioCode': 1,
                    'observations': 1,
                    'deliveredBy': 1,
                    'receivedBy': 1,
                    'status': 1,
                    'itemList': 1,
                })

                patio_docs_list = []

                for i in patio_docs:
                    i['id'] = i['_id']
                    del i['_id']
                    patio_docs_list.append(i)

                doc['patioVoucherList'] = patio_docs_list

                # Retrieve all incidences for the current voucher
                incidence_docs = incidences_coll.find({'voucherId': doc_id}, {
                    '_id': 1,
                    'voucherId': 1,
                    'platform': 1,
                    'carrierCode': 1,
                    'patioCode': 1,
                    'observations': 1,
                    'unitCode': 1,
                    'inspectedBy': 1,
                    'operator': 1,
                    'status': 1,
                    'itemList': 1,
                })

                incidence_docs_list = []

                for i in incidence_docs:
                    i['id'] = i['_id']
                    del i['_id']
                    incidence_docs_list.append(i)

                doc['incidenceList'] = incidence_docs_list

                # Retrieve all events recorded for the current voucher
                eventlog_docs = eventlog_coll.find({'voucherId': doc_id}, {
                    'timestamp': 1,
                    'document': 1,
                    'documentId': 1,
                    'operation': 1,
                    'platform': 1,
                    'patioCode': 1,
                    'observations': 1,
                    'unitCode': 1,
                    'originUser': 1,
                    'targetUser': 1,
                    'status': 1,
                    'itemList': 1,
                }).sort('timestamp', pymongo.ASCENDING)

                eventlog_docs_list = []

                for i in eventlog_docs:
                    del i['_id']
                    eventlog_docs_list.append(i)

                doc['eventList'] = eventlog_docs_list

            else:
                rc = -1
                msg = 'Vale {} no existe'.format(doc_id)
                doc = {}

        except Exception as err:
            rc = -1
            msg = repr(err)
            doc = {}

        client.close()
        return rc, msg, doc


    @staticmethod
    def do_salida_equipo(carrier_code, patio_code, platform, obs, unit_code, delivered_by, received_by, items_to_return_list):
        """Create voucher with status SALIDA (in order to return equipment to its owner, the carrier)"""

        # Getting next number from Postgres:
        sql = '''
            select * from nextval('voucher_number_seq'::regclass);
        '''
        try:
            rows = exec_steady(sql)
            doc_id = rows[0][0]
        except:
            return -1, "No fue posible obtener el consecutivo para el vale de Salida de equipo."

        client = VouchersPersistence.get_mongo_client()
        vouchers_coll = client[VouchersPersistence.db].vouchers
        eventlog_coll = client[VouchersPersistence.db].eventLog

        # Crear el vale de Salida de Equipo
        # ---------------------------------

        # Totalizar piezas de equipo de todos los vales:
        total_eq_dict = {}
        for d in items_to_return_list:

            for eq in d['itemList']:
                eq_code = eq['equipmentCode']
                eq_qty = eq['quantity']
                if eq_code in total_eq_dict:
                    total_eq_dict[eq_code] += eq_qty
                else:
                    total_eq_dict[eq_code] = eq_qty

        items = []
        for k, v in total_eq_dict.items():
            items.append({'equipmentCode': k, 'quantity': v})

        t = time.time()
        try:
            doc = vouchers_coll.insert_one({
                '_id': doc_id,
                'platform': platform,
                'carrierCode': carrier_code,
                'patioCode': patio_code,
                'observations': obs,
                'unitCode': unit_code,
                'deliveredBy': delivered_by,
                'receivedBy': received_by,
                'status': 'SALIDA',
                'itemList': items,
                'generationTime': t,
                'lastTouchTime': t,
                'blocked': False,
                'salidaFinal': True,
            })

            # Registrar el evento en el eventLog
            eventlog_coll.insert_one({
                'voucherId': doc_id,
                'timestamp': t,
                'document': 'vale',
                'documentId': doc_id,
                'operation': 'create',
                'platform': platform,
                'patioCode': patio_code,
                'observations': obs,
                'unitCode': unit_code,
                'originUser': delivered_by,
                'targetUser': received_by,
                'status': 'SALIDA',
                'itemList': items,
            })
        except:
            return -1, "Error al registrar el vale de Salida de equipo o su evento en el log."

        # Actualizar estatus y cantidades en los vales de los cuales se toman los equipos para su salida
        # ----------------------------------------------------------------------------------------------
        for d in items_to_return_list:
            eq_to_delete = []
            doc_to_update = vouchers_coll.find_one({'_id': d['voucherId']})

            for eq in d['itemList']:

                for eq_to_update in doc_to_update['itemList']:

                    if eq_to_update['equipmentCode'] == eq['equipmentCode']:

                        if eq_to_update['quantity'] > eq['quantity']:
                            eq_to_update['quantity'] -= eq['quantity']
                        elif eq_to_update['quantity'] == eq['quantity']:
                            eq_to_delete.append(eq_to_update)

                        break

            for e in eq_to_delete:
                doc_to_update['itemList'].remove(e)

            if len(doc_to_update['itemList']) == 0:
                status = 'SALIDA'
            else:
                status = doc_to_update['status']

            t = time.time()
            atu = {
                'status': status,
                'itemList': doc_to_update['itemList'],
                'lastTouchTime': t,
                'salidaFinal': False,
                'salidaVoucherId': doc_id
            }
            try:
                vouchers_coll.update_one({'_id': doc_to_update['_id']}, {"$set": atu })

                eventlog_coll.insert_one({
                    'voucherId': doc_to_update['_id'],
                    'timestamp': t,
                    'document': 'vale',
                    'documentId': doc_to_update['_id'],
                    'operation': 'update_por_salida',
                    'platform': doc_to_update['platform'],
                    'patioCode': doc_to_update['patioCode'],
                    'observations': doc_to_update['observations'],
                    'unitCode': doc_to_update['unitCode'],
                    'originUser': doc_to_update['deliveredBy'],
                    'targetUser': doc_to_update['receivedBy'],
                    'status': status,
                    'itemList': doc_to_update['itemList'],
                })
            except:
                return -1, "Error al actualizar los vales de equipo implicados en la Salida o sus logs respectivos."

        return doc.inserted_id, "Exitosa la creación del vale de Salida de equipo."


    @staticmethod
    def delete(collection, doc_id):
        """
        It blocks a voucher as
        a kind of logical deletion.
        """
        collection.update_one(
            {'_id' : doc_id},
            {'$set': {'blocked': True}}
        )


    def do_salidas_equipo_vale_completo(id_list):

        client = VouchersPersistence.get_mongo_client()
        vouchers_coll = client[VouchersPersistence.db].vouchers
        eventlog_coll = client[VouchersPersistence.db].eventLog

        status      = 'SALIDA'
        error_msg   = ''
        success_list = []

        for doc_id in id_list:
            t = time.time()
            atu = {
                'status': status,
                'lastTouchTime': t,
            }
            try:
                vouchers_coll.update_one({'_id': doc_id}, {"$set": atu })
                success_list.append(str(doc_id))

                eventlog_coll.insert_one({
                    'voucherId': doc_id,
                    'timestamp': t,
                    'document': 'vale',
                    'documentId': doc_id,
                    'operation': 'update',
                    'status': status,
                })

            except Exception as err:
                error_msg += '(Id: {}, Error: {}) '.format(doc_id, repr(err))

        if success_list:
            ret_code = 0
            ret_msg = 'IDs de vales actualizados => {}'.format(', '.join(success_list))
            if error_msg:
                ret_msg += ' ; Errores => {}'.format(error_msg)
        else:
            ret_code = -1
            ret_msg = 'Ningún vale actualizado ; Errores => {}'.format(error_msg)

        return ret_code, ret_msg
