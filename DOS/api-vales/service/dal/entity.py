from misc.helperpg import exec_steady

class NoResultFound(Exception):
    pass


class MultipleResultsFound(Exception):
    pass


def count_entities(table, search_params_str, not_blocked_clause, count_by_field='id'):
    ''' Counts non-blocked entities '''
    
    clause = ' AND NOT blocked' if not_blocked_clause else ''

    query = '''
        SELECT count({})::int as total
        FROM {}
        WHERE TRUE
        {}
    '''.format(count_by_field, table, clause)

    if search_params_str:
        query += search_params_str
    
    rows = exec_steady(query)

    # For this case we are just expecting one row
    if len(rows) == 0:
        raise NoResultFound('Just expecting one total as a result')
    elif len(rows) > 1:
        raise MultipleResultsFound('Multiple results found, but only one expected')

    return rows.pop()['total']
