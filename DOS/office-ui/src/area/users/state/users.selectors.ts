import { createSelector } from "reselect";
import { catalogSelector as patioCatalogSelector } from "src/area/patios/state/patios.selectors";
import { usersReducer, User, UserSlice } from "./users.reducer";

const sliceSelector = (state: UserSlice) => state[usersReducer.sliceName];

export const usersSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.users
);

export const userSelector = createSelector(
  sliceSelector,
  (slice: UserSlice): User | null => slice.user
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
  patioCatalogSelector,
  (slice: UserSlice, catalog: any, patios: any) =>
    slice.users &&
    catalog &&
    catalog.roleList &&
    catalog.authorityList &&
    Array.isArray(slice.users) &&
    slice.users.map((user: User) => {
      const role = catalog.roleList.find(
        (role: any) => role.id === user.roleId
      )?.title;
      const patio = patios?.find((patio) => patio.id === user?.patioId);
      return {
        ...user,
        id: user.userId,
        roleId_str: role,
        patio: patio
          ? `${patio.title} (${patio?.code})`
          : "(Sin patio asignado)",
      };
    })
);

export const userCatalogSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) =>
    slice.usersCatalog &&
    Array.isArray(slice.usersCatalog) &&
    slice.usersCatalog.map((user: User) => {
      return {
        ...user,
        displayName: `${user.firstName} ${user.lastName}`,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: UserSlice) => slice.filters
);
