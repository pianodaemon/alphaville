import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Incidence } from '../state/incidences.reducer';

export function getIncidences(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/incidences/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createIncidence(fields: Incidence): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/incidences/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readIncidence(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/incidences/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateIncidence(id: number | string, fields: Incidence): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/incidences/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteIncidence(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/incidences/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

