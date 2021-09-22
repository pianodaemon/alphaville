import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Status {
  id: string;
  code: string;
  title: string;
}

export interface StatusSlice {
  status: Status | null;
  statuses: Array<Status> | null;
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

const initialState: StatusSlice = {
  status: null,
  statuses: null,
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

export const sliceName = 'statusesSlice';
export const statusesReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
