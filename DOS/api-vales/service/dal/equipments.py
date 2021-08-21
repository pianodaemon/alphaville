import math

from misc.helperpg import run_stored_procedure, exec_steady, update_steady, EmptySetError
from .entity import count_entities

def alter_equipment(equipment_id, code, name):
    """Calls database function in order to create/update a equipment"""

    sql = """
            SELECT * FROM alter_equipment(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying
            ) AS (rc integer, msg text);
            """.format(
                equipment_id,
                code.replace("'", "''"),
                name.replace("'", "''")
            )

    return run_stored_procedure(sql)


def delete_equipment(id):
    """Delete equipment data"""

    sql = """
        UPDATE equipments
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
        msg = 'Equipment with id {} does not exist.'.format(id)
    except Exception as err:
        rc = -1
        msg = repr(err)

    return rc, msg
