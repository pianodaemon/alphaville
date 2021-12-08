import time
import math
import os

import pymongo

from misc.helperpg import exec_steady


class IncidencesPersistenceError(Exception):
    """
    IncidencesPersistence exception
    """
    def __init__(self, message=None):
        self.message = message

        
class IncidencesPersistence(object):

    host = os.getenv('MONGO_HOST')
    port = os.getenv('MONGO_PORT')
    db   = os.getenv('MONGO_DB')
    mongo_uri = "mongodb://{}:{}".format(host, port)

    @classmethod
    def alter(cls, doc_id, voucher_id, platform, carrier_code, patio_code, observations, unit_code, inspected_by, operator, status, item_list):
        """
        It creates and edits an incidence
        """
        client = IncidencesPersistence.get_mongo_client()
        incidences_coll = client[IncidencesPersistence.db].incidences
        eventlog_coll = client[IncidencesPersistence.db].eventLog

        try:
            if doc_id:
                cls._update(incidences_coll, eventlog_coll, doc_id, voucher_id, carrier_code, patio_code, platform, observations, unit_code, inspected_by, operator, status, item_list)
            else:
                doc_id = cls._create(incidences_coll, eventlog_coll, voucher_id, carrier_code, patio_code, platform, observations, unit_code, inspected_by, operator, status, item_list)
            rc  = doc_id
            msg = ''
        except Exception as err:
            rc  = -1
            msg = repr(err)

        client.close()
        return rc, msg


    @staticmethod
    def _create(collection, eventlog_coll, voucher_id, carrier_code, patio_code, platform, obs, unit_code, inspected_by, operator, status, items):
        """
        It creates a newer incidence
        within the collection
        """
        # Getting next number from Postgres
        sql = '''
            select * from nextval('incidence_number_seq'::regclass);
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
            'voucherId': voucher_id,
            'platform': platform,
            'carrierCode': carrier_code,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'inspectedBy': inspected_by,
            'operator': operator,
            'status': status,
            'itemList': items,
            'generationTime': t,
            'lastTouchTime': t,
            'blocked': False,
        })

        eventlog_coll.insert_one({
            'voucherId': voucher_id,
            'timestamp': t,
            'document': 'incidencia',
            'documentId': doc_id,
            'operation': 'create',
            'platform': platform,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'originUser': inspected_by,
            'targetUser': operator,
            'status': status,
            'itemList': items,
        })

        return doc.inserted_id


    @staticmethod
    def _update(collection, eventlog_coll, doc_id, voucher_id, carrier_code, patio_code, platform, obs, unit_code, inspected_by, operator, status, items):
        """
        It updates any incidence as per
        its document identifier
        """
        # The attributes to update
        t = time.time()
        atu = {
            'voucherId': voucher_id,
            'platform': platform,
            'carrierCode': carrier_code,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'inspectedBy': inspected_by,
            'operator': operator,
            'status': status,
            'itemList': items,
            'lastTouchTime': t,
        }

        eventlog_coll.insert_one({
            'voucherId': voucher_id,
            'timestamp': t,
            'document': 'incidencia',
            'documentId': doc_id,
            'operation': 'update',
            'platform': platform,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'originUser': inspected_by,
            'targetUser': operator,
            'status': status,
            'itemList': items,
        })

        collection.update_one({'_id': doc_id}, {"$set": atu })


    @staticmethod
    def get_mongo_client():
        return pymongo.MongoClient(IncidencesPersistence.mongo_uri, serverSelectionTimeoutMS=5000)


    @staticmethod
    def list_incidences(param_list, page_param_list):
        """Retrieve a list of incidences"""

        bool_fields = set()
        float_fields = set()
        int_fields = {'voucherId'}
        # Processing of Search params
        filter = {}
        for i in param_list:
            if i.name in bool_fields:
                filter[i.name] = bool(i.value)
            elif i.name in float_fields:
                filter[i.name] = float(i.value)
            elif i.name in int_fields:
                filter[i.name] = int(i.value)
            else:
                filter[i.name] = i.value

        client = IncidencesPersistence.get_mongo_client()
        incidences_coll = client[IncidencesPersistence.db].incidences

        # Count items
        docs = incidences_coll.find(filter, {'_id': 1})
        total_items = docs.count()

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
            docs = incidences_coll.find(filter, {
                "voucherId"   : 1,
                "platform"    : 1,
                "carrierCode" : 1,
                "patioCode"   : 1,
                "observations": 1,
                "unitCode"    : 1,
                "inspectedBy" : 1,
                "operator"    : 1,
                "status"      : 1,
            }).skip(whole_pages_offset).limit(target_items).sort(order_by, 1 if order == 'asc' else -1)

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
    def get_incidence(doc_id):
        """Retrieve incidence data"""

        client = IncidencesPersistence.get_mongo_client()
        incidences_coll = client[IncidencesPersistence.db].incidences

        try:
            doc = incidences_coll.find_one({'_id': doc_id}, {
                "voucherId"     : 1,
                "platform"      : 1,
                "carrierCode"   : 1,
                "patioCode"     : 1,
                "observations"  : 1,
                "unitCode"      : 1,
                "inspectedBy"   : 1,
                "operator"      : 1,
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
    def delete(collection, doc_id):
        """
        It blocks a incidence as
        a kind of logical deletion.
        """
        collection.update_one(
            {'_id' : doc_id},
            {'$set': {'blocked': True}}
        )
