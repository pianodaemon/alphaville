import math

from misc.helperpg import run_stored_procedure, exec_steady, update_steady, EmptySetError
from .entity import count_entities

def alter_carrier(id, code, title, disabled):
    """Calls database function in order to create/update a carrier"""

    sql = """
            SELECT * FROM alter_carrier(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying,
                {}::boolean
            ) AS (rc integer, msg text);
            """.format(
                id,
                code.replace("'", "''"),
                title.replace("'", "''"),
                disabled
            )

    return run_stored_procedure(sql)


def list_carriers(param_list, page_param_list):
    """Retrieve a list of carriers"""

    str_fields = {'code', 'title'}
    # Processing of Search params
    l = []
    for i in param_list:
        if i.name in str_fields:
            i.value = "'" + i.value + "'"
        l.append(i.name + '=' + i.value)

    condition_str = ' AND '.join(l)
    if condition_str:
        condition_str = 'AND ' + condition_str

    # Count items
    total_items = count_entities('carriers', condition_str, True)

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
    except Exception:
        order_by = 'id'

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

    sql = """
        SELECT id,
               code,
               title,
               disabled
          FROM carriers
         WHERE NOT blocked
           {}
         ORDER BY {} {} LIMIT {} OFFSET {};
    """.format(
        condition_str,
        order_by,
        order,
        target_items,
        whole_pages_offset
    )

    results = []
    try:
        rows = exec_steady(sql)
        for row in rows:
            d = dict(row)
            results.append(d)
        rc = len(results)
        msg = ''

    except EmptySetError as err:
        results = []
        rc = -1
        msg = err.args[0]

    except Exception as err:
        results = []
        rc = -1
        msg = repr(err)

    return rc, msg, results, total_items, total_pages


def get_carrier(id):
    """Retrieve carrier data"""

    sql = """
        SELECT id,
               code,
               title,
               disabled
          FROM carriers
         WHERE id = {}
           AND NOT blocked;
    """.format(id)

    try:
        rows = exec_steady(sql)

        for row in rows:
            carrier = dict(row)

        rc = carrier['id']
        msg = ''

    except EmptySetError as err:
        carrier = {}
        rc = -1
        msg = err.args[0]

    except Exception as err:
        carrier = {}
        rc = -1
        msg = repr(err)

    return rc, msg, carrier


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
        msg = 'Carrier with id {} does not exist.'.format(id)
    except Exception as err:
        rc = -1
        msg = repr(err)

    return rc, msg
