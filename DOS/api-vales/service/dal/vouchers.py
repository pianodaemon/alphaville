from carriers import get_carrier
from patios import get_patio


class VouchersPersistenceError(Exception):
    """
    VouchersPersistence exception
    """
    def __init__(self, message=None):
        self.message = message

        
class VouchersPersistence(object):

    @classmethod
    def alter(cls, doc_id, carrier_id, patio_id, plat, obs):
        """
        It creates and edits a voucher
        """
        try:
            # We search for the business keys for the below entities
            carrier_bk = get_carrier(carrier_id)['clave']
            patio_bk = get_patio(patio_id)['clave']
        except KeyError as e:
            raise VouchersPersistenceError(e)

        if _id:
            cls._update(col, doc_id, carrier_bk, patio_bk, plat, obs)
        else:
            cls._create(col, carrier_bk, patio_bk, plat, obs)

    @staticmethod
    def _create(col, carrier_bk, patio_bk, plat, obs):
        """
        It creates a newer voucher
        within the collection
        """
        # After insertion we shall get
        # a reference to the newer doc
        doc = col.insert_one(            
            'platform': plat,
            'observations': obs,
            'carrier': carrier_bk,
            'patio': patio_bk,
            'blocked': False
        )

    @staticmethod
    def _update(col, doc_id, carrier_bk, patio_bk, plat, obs):
        """
        It updates any voucher as per
        its document identifier
        """
        # The attributes to update
        atu = {
            'platform': plat,
            'observations': obs,
            'carrier': carrier_bk,
            'patio': patio_bk,
            'last_touch_time': None,  # this attribute shall contain a unix epoch time stamp
            'blocked': False
        }

        col.update_one({'_id': doc_id }, {"$set": atu })

    @staticmethod
    def delete(doc_id):
        """
        It blocks a voucher as
        a kind of logical deletion.
        """
        col.update_one(
            {'_id': doc_id },
            {'$set':{'blocked': True}}
        )

    @staticmethod
    def find_by(**kwargs):
        pass
