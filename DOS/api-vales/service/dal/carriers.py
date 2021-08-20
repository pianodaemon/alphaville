import math

from misc.helperpg import run_stored_procedure, exec_steady, update_steady, EmptySetError
from .entity import count_entities

def alter_carrier(carrier_id, code, name):
    """Calls database function in order to create/update a carrier"""

    sql = """
            SELECT * FROM alter_carrier(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying
            ) AS (rc integer, msg text);
            """.format(
                carrier_id,
                code.replace("'", "''"),
                name.replace("'", "''")
            )

    return run_stored_procedure(sql)


def delete_carrier(id):
    """Delete carrier data"""

    sql = """
        UPDATE carriers
           SET blocked         = true,
               last_touch_time = now()
         WHERE NOT blocked
           AND id = {};
    """.format(id)

    try:
        rc = update_steady(sql)
        msg = ''
    except EmptySetError as err:
        rc = -1
        msg = 'Patio with id {} does not exist.'.format(id)
    except Exception as err:
        rc = -1
        msg = repr(err)

    return rc, msg
