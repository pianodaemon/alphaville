



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
