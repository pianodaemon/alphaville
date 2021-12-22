from datetime import datetime
from decimal import Decimal
import os
import sys
import argparse
import pymongo
import psycopg2

if __name__ == '__main__':

    # Argumentos de linea de comando
    parser = argparse.ArgumentParser(description='Vales de equipo de amarre por fecha de creacion.')
    parser.add_argument('-l', '--layout', type=str, default='totalizado', help='Layout de salida (totalizado | detalle)')
    parser.add_argument('fecha_ini', help='Limite inferior de Fecha de creacion (mm/dd/yyyy) de vale (inclusivo)')
    parser.add_argument('fecha_fin', help='Limite superior de Fecha de creacion (mm/dd/yyyy) de vale (inclusivo)')

    args = parser.parse_args()
    if args.layout not in {'totalizado', 'detalle'}:
        print('LAYOUT debe tener uno de los siguientes valores: (totalizado | detalle)')
        sys.exit(1)

    # Procesamiento de argumentos
    fecha_ini_frags = args.fecha_ini.split('/')
    fecha_ini_epoch = datetime(int(fecha_ini_frags[2]), int(fecha_ini_frags[0]), int(fecha_ini_frags[1]), 0, 0, 0).timestamp()
    fecha_fin_frags = args.fecha_fin.split('/')
    fecha_fin_epoch = datetime(int(fecha_fin_frags[2]), int(fecha_fin_frags[0]), int(fecha_fin_frags[1]), 0, 0, 0).timestamp()

    # Recuperacion de datos mongodb
    try:
        mongohost = os.environ['MONGO_HOST']
        mongoport = os.environ['MONGO_PORT']
        mongodb   = os.environ['MONGO_DB']
    except Exception as ex:
        print('Error al obtener mongodb connection params. ' + repr(ex))
        sys.exit(1)

    mongo_client  = pymongo.MongoClient("mongodb://{}:{}".format(mongohost, mongoport), serverSelectionTimeoutMS=5000)
    vouchers_coll = mongo_client[mongodb].vouchers

    # Datos de vales de equipo de amarre
    vales = vouchers_coll.find({'$and': [
        {'generationTime': {'$gte': fecha_ini_epoch}},
        {'generationTime': {'$lte': fecha_fin_epoch}},
        {'blocked': False}
    ]})

    # Recuperacion de datos postgresql
    try:
        postgreshost = os.environ['POSTGRES_HOST']
        postgresport = os.environ['POSTGRES_PORT']
        postgresuser = os.environ['POSTGRES_USER']
        postgrespass = os.environ['POSTGRES_PASSWORD']
        postgresdb   = os.environ['POSTGRES_DB']
    except Exception as ex:
        print('Error al obtener postgresql connection params. ' + repr(ex))
        sys.exit(1)

    conn_str = 'host={} port={} user={} password={} dbname={}'.format(
        postgreshost,
        postgresport,
        postgresuser,
        postgrespass,
        postgresdb
    )
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()

    # Datos de equipos
    sql = '''
        select code, title, unit_cost
          from equipments
         where not blocked;
    '''
    cur.execute(sql)
    rows = cur.fetchall()
    equipos = {}
    for r in rows:
        equipos[r[0]] = {
            'title': r[1],
            'unit_cost': r[2]
        }

    # Datos de usuarios
    sql = '''
        select username, first_name, last_name
          from users
         where not blocked;
    '''
    cur.execute(sql)
    rows = cur.fetchall()
    users = {}
    for r in rows:
        users[r[0]] = {
            'name': r[1] + ' ' + r[2]
        }
    cur.close()
    conn.close()

    # Manipulacion de data para su salida
    print(','.join(['Num vale', 'Fecha creacion', 'Carrier', 'Plataforma', 'Unidad', 'Patio', 'Recibio', 'Estatus', 'Monto']))

    for i in vales:
        fecha =  datetime.fromtimestamp(i['generationTime']).strftime('%m/%d/%Y')

        monto = Decimal('0.0')
        for e in i['itemList']:
            monto += equipos[e['equipmentCode']]['unit_cost'] * e['quantity']

        print(','.join([
            str(i['_id']),
            '"' + fecha + '"',
            '"' + i['carrierCode'] + '"',
            '"' + i['platform'] + '"',
            '"' + i['unitCode'] + '"',
            '"' + i['patioCode'] + '"',
            '"' + users[i['receivedBy']]['name'] + '"',
            '"' + i['status'] + '"',
            str(monto)
        ]))

    mongo_client.close()
