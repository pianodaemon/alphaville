import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Carrier } from '../state/carriers.reducer';

export function getCarriers(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/carriers/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createCarrier(fields: Carrier): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/carriers/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readCarrier(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/carriers/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateCarrier(id: number | string, fields: Carrier): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/carriers/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteCarrier(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/carriers/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

