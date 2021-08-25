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
            carrier_bk = get_carrier(carrier_id)['clave']
            patio_bk = get_patio(patio_id)['clave']
        except KeyError as e:
            raise VouchersPersistenceError(e)

        if doc_id:
            cls._update(col, doc_id, carrier_bk, patio_bk, plat, obs)
        else:
            cls._create(col, carrier_bk, patio_bk, plat, obs)

    @staticmethod
    def _create(col, carrier_bk, patio_bk, plat, obs):
        """
        It creates a newer voucher
        within the collection
        """
        # Insertion resorts to a document with counters
        # to get the current value of a sequence
        col.insert_one(
            'doc_id': fetchValFromSeq("doc_id"),
            'platform': plat,
            'observations': obs,
            'carrier': carrier_bk,
            'patio': patio_bk,
            'disabled': False,
            'last_touch_time': None
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
            'disabled': False
        }

        col.update_one({'doc_id': doc_id}, {"$set": atu })

    @staticmethod
    def delete(doc_id):
        pass

    @staticmethod
    def find_by(**kwargs):
        pass
