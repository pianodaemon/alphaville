import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Voucher {
  carrierCode: string;
  deliveredBy: string;
  id: string;
  itemList: Item[];
  observations: string;
  patioCode: string;
  platform: string;
  receivedBy: string;
  unitCode: string;
}

export interface VoucherSlice {
  voucher: Voucher | null;
  vouchers: Array<Voucher> | null;
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
}

type Item = {
  equipmentCode: string,
  quantity: number,
};

const initialState: VoucherSlice = {
  voucher: null,
  vouchers: null,
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
};

export const sliceName = 'vouchersSlice';
export const vouchersReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
