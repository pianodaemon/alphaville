import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { PatioVoucher } from '../state/patio-vouchers.reducer';

export function getPatioVouchers(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/patio-vouchers/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createPatioVoucher(fields: PatioVoucher): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patio-vouchers/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readPatioVoucher(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patio-vouchers/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updatePatioVoucher(id: number | string, fields: PatioVoucher): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patio-vouchers/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deletePatioVoucher(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/patio-vouchers/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

