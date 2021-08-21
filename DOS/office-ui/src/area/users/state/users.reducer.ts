import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface User {
  userId: number;
  username: string;
  passwd: string;
  roleId: number;
  disabled: boolean;
  firstName: string;
  lastName: string;
  authorities: Array<any>;
}

interface UserSlice {
  user: User | null;
  users: Array<User> | null;
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
  divisions: Array<Division>,
  orgchart_roles: Array<OrgchartRoles>,
  authorities: Array<{ id: number, description: string }>,
};

type CatalogItem = {
  id: number,
  title: string,
};

type Division = CatalogItem;
type OrgchartRoles = CatalogItem;
*/
const initialState: UserSlice = {
  user: null,
  users: null,
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

export const sliceName = 'usersSlice';
export const usersReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
