import { createSelector } from 'reselect';
import { usersReducer, User, UserSlice } from './users.reducer';

const sliceSelector = (state: UserSlice) => state[usersReducer.sliceName];

export const usersSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.users
);

export const userSelector = createSelector(
  sliceSelector,
  (slice: UserSlice): User | null => slice.user,
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.loading
);

export const catalogSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.catalog
);

export const usersCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: UserSlice, catalog: any) =>
    slice.users &&
    catalog &&
    catalog.roleList &&
    catalog.authorityList &&
    Array.isArray(slice.users) &&
    slice.users.map((user: User) => {
      const role = catalog.roleList.find((role: any) => role.id === user.roleId)?.title;
      return {
        ...user,
        id: user.userId,
        roleId_str: role,
      };
    })
);

export const userCatalogSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.usersCatalog
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.filters
);
