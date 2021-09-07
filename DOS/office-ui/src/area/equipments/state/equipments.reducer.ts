import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Equipment {
  id: number;
  code: string;
  regular: boolean;
  title: string;
  unitCost: number;
}

export interface EquipmentSlice {
  equipment: Equipment | null;
  equipments: Array<Equipment> | null;
  loading: boolean;
  equipmentCatalog: Array<Equipment> | null;
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

const initialState: EquipmentSlice = {
  equipment: null,
  equipments: null,
  equipmentCatalog: null,
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

export const sliceName = 'equipmentsSlice';
export const equipmentsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
