import math

from misc.helperpg import run_stored_procedure, exec_steady, update_steady, EmptySetError
from .entity import count_entities

def alter_patio(patio_id, code, name):
    """Calls database function in order to create/update a patio"""

    sql = """
            SELECT * FROM alter_patio(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying
            ) AS (rc integer, msg text);
            """.format(
                patio_id,
                code.replace("'", "''"),
                name.replace("'", "''")
            )

    return run_stored_procedure(sql)
