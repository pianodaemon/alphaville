import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Voucher } from '../state/vouchers.reducer';

export function getVouchers(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    // limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/vouchers/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createVoucher(fields: Voucher): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/vouchers/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readVoucher(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/vouchers/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateVoucher(id: number | string, fields: Voucher): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/vouchers/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteVoucher(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/vouchers/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

