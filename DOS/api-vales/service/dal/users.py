from misc.helperpg import run_stored_procedure, exec_steady, EmptySetError

def alter_user(user_id, username, passwd, role_id, disabled, first_name, last_name):

    """Calls database function in order to create/update a user"""
    sql = """
            SELECT * FROM alter_user(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying,
                {}::integer,
                {}::boolean,
                '{}'::character varying,
                '{}'::character varying
            ) AS (rc integer, msg text);
            """.format(
                user_id,
                username.replace("'", "''"),
                passwd.replace("'", "''"),
                role_id,
                disabled,
                first_name.replace("'", "''"),
                last_name.replace("'", "''")
            )

    return run_stored_procedure(sql)


def auth_user(username, passwd):

    """Check user credentials"""
    sql = """
        SELECT id
          FROM users
         WHERE username = '{}'
           AND passwd = '{}';
    """.format(
        username.replace("'", "''"),
        passwd.replace("'", "''")
    )

    try:
        rows = exec_steady(sql)
        rc = rows[0][0]
        msg = ''
    except EmptySetError as err:
        rc = -1
        msg = err.args[0]
    except Exception as err:
        rc = -1
        msg = repr(err)

    return rc, msg
