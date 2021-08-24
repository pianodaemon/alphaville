import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Carrier {
  id: number;
  code: string;
  title: string;
  disabled: boolean;
}

export interface CarrierSlice {
  carrier: Carrier | null;
  carriers: Array<Carrier> | null;
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

const initialState: CarrierSlice = {
  carrier: null,
  carriers: null,
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

export const sliceName = 'carriersSlice';
export const carriersReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
