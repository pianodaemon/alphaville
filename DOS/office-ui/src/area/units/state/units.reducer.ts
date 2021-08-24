import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Unit {
  id: number;
  code: string;
  title: string;
}

export interface UnitSlice {
  unit: Unit | null;
  units: Array<Unit> | null;
  loading: boolean;
  // catalog: Catalog | null;
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

const initialState: UnitSlice = {
  unit: null,
  units: null,
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

export const sliceName = 'unitsSlice';
export const unitsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
