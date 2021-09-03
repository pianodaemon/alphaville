import time

import pymongo
from bson.objectid import ObjectId


class VouchersPersistenceError(Exception):
    """
    VouchersPersistence exception
    """
    def __init__(self, message=None):
        self.message = message

        
class VouchersPersistence(object):

    @classmethod
    def alter(cls, id, platform, carrier_code, patio_code, observations, unit_code, delivered_by, received_by, item_list):
        """
        It creates and edits a voucher
        """
        client = pymongo.MongoClient("mongodb://nosql_mongo:27017", serverSelectionTimeoutMS=5000)
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
    def delete(collection, doc_id):
        """
        It blocks a voucher as
        a kind of logical deletion.
        """
        collection.update_one(
            {'_id' : ObjectId(doc_id)},
            {'$set': {'blocked': True}}
        )

    @staticmethod
    def find_by(**kwargs):
        pass
