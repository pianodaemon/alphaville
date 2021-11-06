import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Incidence {
  carrierCode: string;
  generationTime: number;
  id: number;
  inspectedBy: string;
  voucherId: number;
  itemList: Item[];
  lastTouchTime: number;
  observations: string;
  operator: string;
  patioCode: string;
  platform: string;
  status: string;
  unitCode: string;
}

export interface IncidenceSlice {
  incidence: Incidence | null;
  incidences: Array<Incidence> | null;
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
    incidence: Incidence | null,
    loading: boolean,
    error: any,
  } | null,
}

export type Item = {
  equipmentCode: string,
  quantity: number,
};

const initialState: IncidenceSlice = {
  incidence: null,
  incidences: null,
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

export const sliceName = 'incidencesSlice';
export const incidencesReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
