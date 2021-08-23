import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Patio } from '../state/patios.reducer';

export function getPatios(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/patios/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createPatio(fields: Patio): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patios/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readPatio(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patios/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updatePatio(id: number | string, fields: Patio): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patios/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deletePatio(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patios/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

