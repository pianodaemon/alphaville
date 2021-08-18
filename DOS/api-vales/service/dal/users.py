from misc.helperpg import run_stored_procedure, exec_steady, EmptySetError

def alter_user(user_id, username, passwd, role_id, disabled, first_name, last_name, authorities):
    """Calls database function in order to create/update a user"""

    sql = """
            SELECT * FROM alter_user(
                {}::integer,
                '{}'::character varying,
                '{}'::character varying,
                {}::integer,
                {}::boolean,
                '{}'::character varying,
                '{}'::character varying,
                '{}'::integer[]
            ) AS (rc integer, msg text);
            """.format(
                user_id,
                username.replace("'", "''"),
                passwd.replace("'", "''"),
                role_id,
                disabled,
                first_name.replace("'", "''"),
                last_name.replace("'", "''"),
                set(authorities) if authorities else '{}'
            )

    return run_stored_procedure(sql)


def list_users(param_list):
    """Retrieve a list of users"""

    l = []
    for i in param_list:
        l.append(i.name + '=' + i.value)

    condition_str = ' AND '.join(l)
    if condition_str:
        condition_str = ' AND ' + condition_str

    sql = """
        SELECT id         AS "userId",
               username,
               ''         AS "passwd",
               role_id    AS "roleId",
               disabled,
               first_name AS "firstName",
               last_name  AS "lastName"
          FROM users
         WHERE NOT blocked
           {}
         ORDER BY id;
    """.format(condition_str)

    results = []
    try:
        rows = exec_steady(sql)
        for row in rows:
            d = dict(row)
            d['authorities'] = []
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

    return rc, msg, results


def auth_user(username, passwd):
    """Check user credentials"""

    sql = """
        SELECT id
          FROM users
         WHERE username = '{}'
           AND passwd = '{}'
           AND NOT blocked;
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


def get_user(id):
    """Retrieve user data"""

    sql = """
        SELECT id         AS "userId",
               username,
               ''         AS "passwd",
               role_id    AS "roleId",
               disabled,
               first_name AS "firstName",
               last_name  AS "lastName"
          FROM users
         WHERE id = {}
           AND NOT blocked;
    """.format(id)

    try:
        rows = exec_steady(sql)

        for row in rows:
            user = dict(row)

            sql = """
                SELECT authority_id
                  FROM users_authorities
                 WHERE user_id = {}
                 ORDER BY authority_id;
            """.format(id)

            auths_list = []
            try:
                auths = exec_steady(sql)

                for auth in auths:
                    auths_list.append(auth[0])

                user['authorities'] = auths_list

            except EmptySetError as err:
                user['authorities'] = []

        rc = user['userId']
        msg = ''

    except EmptySetError as err:
        user = {}
        rc = -1
        msg = err.args[0]

    except Exception as err:
        user = {}
        rc = -1
        msg = repr(err)

    return rc, msg, user


def get_catalogs():
    # return -1, "Hardcode", [{"id": 1, "title": "Director"}, {"id": 2, "title": "Intercambista"}], [{"id": 1, "title": "USERS"}], [{"id": 1, "appId": 1, "code": "USR-R", "title": "Read User data"}]
    """Retrieve catalogs for User-related stuff"""

    roles       = []
    apps        = []
    authorities = []

    sql = """
        SELECT id, title
          FROM roles
         ORDER by id;
    """

    try:
        rows = exec_steady(sql)
        for row in rows:
            roles.append(dict(row))

    except EmptySetError as err:
        pass

    except Exception as err:
        rc = -1
        msg = repr(err)
        return rc, msg, roles, apps, authorities

    sql = """
        SELECT id, title
          FROM apps
         ORDER by id;
    """

    try:
        rows = exec_steady(sql)
        for row in rows:
            apps.append(dict(row))

    except EmptySetError as err:
        pass

    except Exception as err:
        rc = -1
        msg = repr(err)
        return rc, msg, roles, apps, authorities

    sql = """
        SELECT id, app_id AS "appId", code, title
          FROM authorities
         ORDER by app_id, id;
    """

    try:
        rows = exec_steady(sql)
        for row in rows:
            authorities.append(dict(row))

    except EmptySetError as err:
        pass

    except Exception as err:
        rc = -1
        msg = repr(err)
        return rc, msg, roles, apps, authorities

    count = 0
    if roles:
        count += 1
    if apps:
        count += 1
    if authorities:
        count += 1

    return count, '', roles, apps, authorities
