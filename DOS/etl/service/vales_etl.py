import os
import sys
import argparse
from datetime import datetime
import pytz
from decimal import Decimal

import pymongo
import psycopg2
import boto3

def manipular_totalizado(vales, equipos, usuarios):
    s = ''
    s += ','.join(['Num vale', 'Fecha creacion', 'Carrier', 'Plataforma', 'Unidad', 'Patio', 'Recibio', 'Estatus', 'Monto']) + '\n'

    for v in vales:
        fecha =  datetime.fromtimestamp(v['generationTime']).strftime('%m/%d/%Y')

        monto = Decimal('0.0')
        for e in v['itemList']:
            monto += equipos[e['equipmentCode']]['unit_cost'] * e['quantity']

        s += ','.join([
            str(v['_id']),
            '"' + fecha + '"',
            '"' + v['carrierCode'] + '"',
            '"' + v['platform'] + '"',
            '"' + v['unitCode'] + '"',
            '"' + v['patioCode'] + '"',
            '"' + usuarios[v['receivedBy']]['name'] + '"',
            '"' + v['status'] + '"',
            str(monto)
        ]) + '\n'

    return s


def manipular_detallado(vales, equipos, usuarios):
    s = ''
    s += ','.join(['Num vale', 'Fecha creacion', 'Carrier', 'Plataforma', 'Unidad', 'Patio', 'Recibio', 'Estatus', 'Equipo', 'Unidades', 'Costo', 'Monto']) + '\n'

    for v in vales:
        fecha =  datetime.fromtimestamp(v['generationTime']).strftime('%m/%d/%Y')

        for e in v['itemList']:
            eq_code = e['equipmentCode']
            unit_cost = equipos[eq_code]['unit_cost']
            quantity = e['quantity']
            monto = unit_cost * quantity

            s += ','.join([
                str(v['_id']),
                '"' + fecha + '"',
                '"' + v['carrierCode'] + '"',
                '"' + v['platform'] + '"',
                '"' + v['unitCode'] + '"',
                '"' + v['patioCode'] + '"',
                '"' + usuarios[v['receivedBy']]['name'] + '"',
                '"' + v['status'] + '"',
                '"' + equipos[eq_code]['title'].replace('"', '""') + '"',
                str(quantity),
                str(unit_cost),
                str(monto)
            ]) + '\n'

    return s


if __name__ == '__main__':

    TOTALIZADO = 'totalizado'
    DETALLADO  = 'detallado'
    mex_city_tz = pytz.timezone('America/Mexico_City')

    # Argumentos de linea de comando
    parser = argparse.ArgumentParser(description='Vales de equipo de amarre por fecha de creacion.')
    parser.add_argument('-l', '--layout', type=str, default=TOTALIZADO, help='Layout de salida ({} | {})'.format(TOTALIZADO, DETALLADO))
    parser.add_argument('-p', '--output-prefix', type=str, default='', help='Prefijo para el nombre de archivo')
    parser.add_argument('fecha_ini', help='Limite inferior de Fecha de creacion (mm/dd/yyyy) de vale (inclusivo)')
    parser.add_argument('fecha_fin', help='Limite superior de Fecha de creacion (mm/dd/yyyy) de vale (inclusivo)')

    args = parser.parse_args()
    if args.layout not in {TOTALIZADO, DETALLADO}:
        print('LAYOUT debe tener uno de los siguientes valores: ({} | {})'.format(TOTALIZADO, DETALLADO))
        sys.exit(1)

    # Procesamiento de argumentos
    fecha_ini_frags = args.fecha_ini.split('/')
    fecha_ini_epoch = datetime(int(fecha_ini_frags[2]), int(fecha_ini_frags[0]), int(fecha_ini_frags[1]), 0, 0, 0, tzinfo=mex_city_tz).timestamp()
    fecha_fin_frags = args.fecha_fin.split('/')
    fecha_fin_epoch = datetime(int(fecha_fin_frags[2]), int(fecha_fin_frags[0]), int(fecha_fin_frags[1]), 23, 59, 59, tzinfo=mex_city_tz).timestamp()

    name_parts = []
    if args.output_prefix:
        name_parts.append(args.output_prefix)
    name_parts.append('vales')
    name_parts.append(args.layout)
    # name_parts.append(datetime.now(mex_city_tz).strftime('%m-%d-%Y_%H-%M-%S'))

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
    usuarios = {}
    for r in rows:
        usuarios[r[0]] = {
            'name': r[1] + ' ' + r[2]
        }
    cur.close()
    conn.close()

    # Manipulacion de data para su salida
    if args.layout == TOTALIZADO:
        s = manipular_totalizado(vales, equipos, usuarios)
    elif args.layout == DETALLADO:
        s = manipular_detallado(vales, equipos, usuarios)

    # Closing mongo client
    mongo_client.close()

    # AWS S3 service - data upload
    try:
        bucket = os.getenv('S3_BUCKET')
        if not bucket:
            bucket = 'vales-dashboards'

        s3 = boto3.resource('s3')
        s3_obj_name = '_'.join(name_parts) + '.csv'
        s3.Bucket(bucket).put_object(Key=s3_obj_name, Body=s.encode('utf-8'))

    except Exception as ex:
        print(ex, '({})'.format(bucket))
