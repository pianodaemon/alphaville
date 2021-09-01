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
    def alter(cls, doc_id, carrier_code, patio_code, platform, obs, items):
        """
        It creates and edits a voucher
        """
        client = pymongo.MongoClient("mongodb://nosql_mongo:27100", serverSelectionTimeoutMS=5000)
        db = client.vales_dylk_mongo
        collection = db.vouchers

        if doc_id:
            cls._update(collection, doc_id, carrier_code, patio_code, platform, obs, items)
        else:
            doc_id = cls._create(collection, carrier_code, patio_code, platform, obs, items)

        client.close()

        return doc_id

    @staticmethod
    def _create(collection, carrier_code, patio_code, platform, obs, items):
        """
        It creates a newer voucher
        within the collection
        """
        # After insertion we shall get
        # a reference to the newer doc
        doc = collection.insert_one({
            'platform': platform,
            'observations': obs,
            'carrier': carrier_code,
            'patio': patio_code,
            'blocked': False,
            'items': items,
        })

        return str(doc.inserted_id)

    @staticmethod
    def _update(collection, doc_id, carrier_code, patio_code, platform, obs, items):
        """
        It updates any voucher as per
        its document identifier
        """
        # The attributes to update
        atu = {
            'platform': platform,
            'observations': obs,
            'carrier': carrier_code,
            'patio': patio_code,
            'last_touch_time': None,  # this attribute shall contain a unix epoch time stamp
            'items': items,
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
