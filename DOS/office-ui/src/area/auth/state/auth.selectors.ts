import { createSelector } from "reselect";
// import { resolvePermission } from 'src/shared/utils/permissions.util';
import { authReducer, JWT } from "./auth.reducer";

const sliceSelector = (state: any) => state[authReducer.sliceName];

export const authTokenSelector = createSelector(
  sliceSelector,
  (slice: any): JWT => slice.token
);

export const checkedSelector = createSelector(
  sliceSelector,
  (slice: any): boolean => slice.checked
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any): boolean => slice.loading
);

export const isLoggedInSelector = createSelector(
  sliceSelector,
  (slice: any): boolean => slice.signedIn
);

/*
export const permissionSelector = createSelector(
  sliceSelector,
  permissions =>
    (
      app: string,
      permission: string
    ) => resolvePermission(
      permissions.claims?.authorities,
      app,
      permission
    )
);
*/

export const refreshingSelector = createSelector(
  sliceSelector,
  (slice: any): boolean => slice.refreshing
);

export const usernameLoginSelector = createSelector(sliceSelector, (slice: any) =>
  slice.profile && slice.profile.user
    ? `${slice.profile?.user?.firstName} ${slice.profile?.user?.lastName} (${slice.profile?.user?.username})`
    : ""
);

export const usernameSelector = createSelector(sliceSelector, (slice: any) =>
  slice.profile && slice.profile.user
    ? slice.profile.user.username
    : ""
);