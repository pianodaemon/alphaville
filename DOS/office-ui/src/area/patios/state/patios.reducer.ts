import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Patio {
  id: number;
  code: string;
  title: string;
}

export interface PatioSlice {
  patio: Patio | null;
  patios: Array<Patio> | null;
  loading: boolean;
  patiosCatalog: Patio[] | null;
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
/*
export type Catalog = {
  roleList: Array<Roles>,
  appList: Array<Apps>,
  authorityList: Array<Authorities & { appId: number, code: string }>,
};

type CatalogItem = {
  id: number,
  title: string,
};
*/

const initialState: PatioSlice = {
  patio: null,
  patios: null,
  patiosCatalog: null,
  loading: false,
  // catalog: null,
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

export const sliceName = 'patiosSlice';
export const patiosReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
