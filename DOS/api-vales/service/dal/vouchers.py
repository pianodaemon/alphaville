from carriers import get_carrier
from patios import get_patio


class VouchersPersistence(object):

    @classmethod
    def alter(cls, doc_id, carrier_id, patio_id, plat, obs):
        if doc_id:
            cls._update(col, doc_id, carrier_id, patio_id, plat, obs)
        else:
            cls._create(col, carrier_id, patio_id, plat, obs)

    @staticmethod
    def _create(col, carrier_id, patio_id, plat, obs):
        """
        It creates a newer voucher
        within the collection
        """
        col.insert_one(
            'platform': plat,
            'observations': obs,
            'carrier': get_carrier(carrier_id).get('clave', None),
            'patio': get_patio(patio_id).get('clave', None),
            'disabled': False
        )

    @staticmethod
    def _update(col, doc_id, carrier_id, patio_id, plat, obs):
        """
        It updates any voucher as per
        its document identifier
        """
        # The attributes to update
        atu = {
            'platform': plat,
            'observations': obs,
            'carrier': get_carrier(carrier_id).get('clave', None),
            'patio': get_patio(patio_id).get('clave', None),
            'disabled': False
        }

        col.update_one({'doc_id': doc_id}, {"$set": atu })

    @staticmethod
    def delete(doc_id):
        pass

    @staticmethod
    def find_by(**kwargs):
        pass
