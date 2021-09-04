import time
import math

import pymongo
from bson.objectid import ObjectId


class VouchersPersistenceError(Exception):
    """
    VouchersPersistence exception
    """
    def __init__(self, message=None):
        self.message = message

        
class VouchersPersistence(object):

    mongo_uri = "mongodb://nosql_mongo:27017"

    @classmethod
    def alter(cls, id, platform, carrier_code, patio_code, observations, unit_code, delivered_by, received_by, item_list):
        """
        It creates and edits a voucher
        """
        client = pymongo.MongoClient(VouchersPersistence.mongo_uri, serverSelectionTimeoutMS=5000)
        collection = client.vales_dylk_mongo.vouchers

        try:
            if id:
                cls._update(collection, id, carrier_code, patio_code, platform, observations, unit_code, delivered_by, received_by, item_list)
            else:
                id = cls._create(collection, carrier_code, patio_code, platform, observations, unit_code, delivered_by, received_by, item_list)
            rc  = 0
            msg = id
        except Exception as err:
            rc  = -1
            msg = repr(err)

        client.close()
        return rc, msg


    @staticmethod
    def _create(collection, carrier_code, patio_code, platform, obs, unit_code, delivered_by, received_by, items):
        """
        It creates a newer voucher
        within the collection
        """
        # After insertion we shall get
        # a reference to the newer doc
        doc = collection.insert_one({
            'platform': platform,
            'carrierCode': carrier_code,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'deliveredBy': delivered_by,
            'receivedBy': received_by,
            'itemList': items,
            'blocked': False,
        })

        return str(doc.inserted_id)


    @staticmethod
    def _update(collection, doc_id, carrier_code, patio_code, platform, obs, unit_code, delivered_by, received_by, items):
        """
        It updates any voucher as per
        its document identifier
        """
        # The attributes to update
        atu = {
            'platform': platform,
            'carrierCode': carrier_code,
            'patioCode': patio_code,
            'observations': obs,
            'unitCode': unit_code,
            'deliveredBy': delivered_by,
            'receivedBy': received_by,
            'itemList': items,
            'lastTouchTime': time.time(),
        }

        collection.update_one({'_id': ObjectId(doc_id) }, {"$set": atu })


    @staticmethod
    def get_mongo_client():
        return pymongo.MongoClient(VouchersPersistence.mongo_uri, serverSelectionTimeoutMS=5000)


    @staticmethod
    def list_vouchers(param_list, page_param_list):
        """Retrieve a list of vouchers"""

        bool_fields = {}
        float_fields = {}
        # Processing of Search params
        filter = {}
        for i in param_list:
            if i.name in bool_fields:
                filter[i.name] = bool(i.value)
            elif i.name in float_fields:
                filter[i.name] = float(i.value)
            else:
                filter[i.name] = i.value

        client = VouchersPersistence.get_mongo_client()
        vouchers_coll = client.vales_dylk_mongo.vouchers

        # Count items
        docs = vouchers_coll.find(filter, {'_id': 1})
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
            docs = vouchers_coll.find(filter, {
                "platform"    : 1,
                "carrierCode" : 1,
                "patioCode"   : 1,
                "observations": 1,
                "unitCode"    : 1,
                "deliveredBy" : 1,
                "receivedBy"  : 1,
            }).skip(whole_pages_offset).limit(target_items).sort(order_by, 1 if order == 'asc' else -1)

            rc = 0
            msg = ''
            results = []
            for i in docs:
                i['id'] = str(i['_id'])
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
    def get_voucher(id):
        """Retrieve voucher data"""

        client = VouchersPersistence.get_mongo_client()
        vouchers_coll = client.vales_dylk_mongo.vouchers

        try:
            doc = vouchers_coll.find_one(ObjectId(id), {
                "platform"    : 1,
                "carrierCode" : 1,
                "patioCode"   : 1,
                "observations": 1,
                "unitCode"    : 1,
                "deliveredBy" : 1,
                "receivedBy"  : 1,
                "itemList"    : 1,
            })

            rc = 0
            msg = doc['id'] = str(doc['_id'])
            del doc['_id']

        except Exception as err:
            rc = -1
            msg = repr(err)
            doc = {}

        client.close()
        return rc, msg, doc


    @staticmethod
    def delete(collection, doc_id):
        """
        It blocks a voucher as
        a kind of logical deletion.
        """
        collection.update_one(
            {'_id' : ObjectId(doc_id)},
            {'$set': {'blocked': True}}
        )
