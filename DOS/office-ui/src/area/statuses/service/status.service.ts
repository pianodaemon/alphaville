import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Status } from '../state/statuses.reducer';

export function getStatuses(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/statuses/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createStatus(fields: Status): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/statuses/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readStatus(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/statuses/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateStatus(id: number | string, fields: Status): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/statuses/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteStatus(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/statuses/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

