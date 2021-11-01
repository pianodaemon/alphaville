import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface PatioVoucher {
  deliveredBy: string;
  generationTime: number;
  id: number;
  itemList: Item[];
  lastTouchTime: number;
  observations: string;
  patioCode: string;
  receivedBy: string;
  status: string;
  voucherId: number;
}

export interface PatioVoucherSlice {
  patioVoucher: PatioVoucher | null;
  patioVouchers: Array<PatioVoucher> | null;
  loading: boolean;
  paging: {
    count: number,
    pages: number,
    page: number,
    per_page: number,
    order: string,
    order_by: string,
  };
  filters: {[key: string]: string} | null,
  search: {
    patioVoucher: PatioVoucher | null,
    loading: boolean,
    error: any,
  } | null,
}

export type Item = {
  equipmentCode: string,
  quantity: number,
};

const initialState: PatioVoucherSlice = {
  patioVoucher: null,
  patioVouchers: null,
  loading: false,
  paging: {
    count: 0,
    pages: 0,
    page: 1,
    per_page: 5,
    order: 'desc',
    order_by: 'id',
  },
  filters: null,
  search: null,
};

export const sliceName = 'patioVouchersSlice';
export const patioVouchersReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
