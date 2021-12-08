import math

from misc.helperpg import run_stored_procedure, exec_steady, update_steady, EmptySetError
from .entity import count_entities

def alter_unit(id, code, title):
    """Calls database function in order to create/update a unit"""

    sql = """
            SELECT * FROM alter_unit(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying
            ) AS (rc integer, msg text);
            """.format(
                id,
                code.replace("'", "''"),
                title.replace("'", "''")
            )

    return run_stored_procedure(sql)


def list_units(param_list, page_param_list):
    """Retrieve a list of units"""

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
    total_items = count_entities('units', condition_str, True)

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
               title
          FROM units
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


def get_unit(id):
    """Retrieve unit data"""

    sql = """
        SELECT id,
               code,
               title
          FROM units
         WHERE id = {}
           AND NOT blocked;
    """.format(id)

    try:
        rows = exec_steady(sql)

        for row in rows:
            unit = dict(row)

        rc = unit['id']
        msg = ''

    except EmptySetError as err:
        unit = {}
        rc = -1
        msg = err.args[0]

    except Exception as err:
        unit = {}
        rc = -1
        msg = repr(err)

    return rc, msg, unit


def delete_unit(id):
    """Delete unit data"""

    sql = """
        UPDATE units
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
        msg = 'Unit with id {} does not exist.'.format(id)
    except Exception as err:
        rc = -1
        msg = repr(err)

    return rc, msg
