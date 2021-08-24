import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Unit } from '../state/units.reducer';

export function getUnits(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/units/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createUnit(fields: Unit): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/units/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readUnit(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/units/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateUnit(id: number | string, fields: Unit): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/units/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteUnit(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/units/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

