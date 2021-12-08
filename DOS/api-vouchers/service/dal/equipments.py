import math

from misc.helperpg import run_stored_procedure, exec_steady, update_steady, EmptySetError
from .entity import count_entities

def alter_equipment(id, code, title, unit_cost, regular):
    """Calls database function in order to create/update an equipment"""

    sql = """
            SELECT * FROM alter_equipment(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying,
                {}::numeric,
                {}::boolean
            ) AS (rc integer, msg text);
            """.format(
                id,
                code.replace("'", "''"),
                title.replace("'", "''"),
                unit_cost,
                regular,
            )

    return run_stored_procedure(sql)


def list_equipments(param_list, page_param_list):
    """Retrieve a list of equipments"""

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
    total_items = count_entities('equipments', condition_str, True)

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
               unit_cost as "unitCost",
               regular
          FROM equipments
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


def get_equipment(id):
    """Retrieve equipment data"""

    sql = """
        SELECT id,
               code,
               title,
               unit_cost as "unitCost",
               regular
          FROM equipments
         WHERE id = {}
           AND NOT blocked;
    """.format(id)

    try:
        rows = exec_steady(sql)

        for row in rows:
            equipment = dict(row)

        rc = equipment['id']
        msg = ''

    except EmptySetError as err:
        equipment = {}
        rc = -1
        msg = err.args[0]

    except Exception as err:
        equipment = {}
        rc = -1
        msg = repr(err)

    return rc, msg, equipment


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
