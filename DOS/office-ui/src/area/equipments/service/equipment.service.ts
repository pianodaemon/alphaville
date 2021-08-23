import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Equipment } from '../state/equipments.reducer';

export function getEquipments(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/equipments/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createEquipment(fields: Equipment): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/equipments/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readEquipment(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/equipments/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateEquipment(id: number | string, fields: Equipment): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/equipments/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteEquipment(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/equipments/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

