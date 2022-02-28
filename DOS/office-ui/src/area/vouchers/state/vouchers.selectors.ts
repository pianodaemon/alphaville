import { createSelector } from "reselect";
import {
  Event,
  vouchersReducer,
  Voucher,
  VoucherSlice,
} from "./vouchers.reducer";
import { userCatalogSelector } from "src/area/users/state/users.selectors";
import { catalogSelector } from "src/area/equipments/state/equipments.selectors";
import { statusesSelector } from "src/area/statuses/state/statuses.selectors";
import {
  Status,
  Statuses,
} from "src/shared/constants/voucher-statuses.constants";
import { catalogSelector as carriersCatalogSelector } from "src/area/carriers/state/carriers.selectors";
import { catalogSelector as patioCatalogSelector } from "src/area/patios/state/patios.selectors";
import { catalogSelector as unitCatalogSelector } from "src/area/units/state/units.selectors";
import { userIsComunSelector } from "src/area/auth/state/auth.selectors";

const sliceSelector = (state: VoucherSlice) => state[vouchersReducer.sliceName];

export const vouchersSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.vouchers
);

export const voucherSelector = createSelector(
  sliceSelector,
  catalogSelector,
  userCatalogSelector,
  patioCatalogSelector,
  carriersCatalogSelector,
  (slice: VoucherSlice, equipments, users, patios, carriers): any => {
    const { voucher, editMode } = slice;
    const carrier =
      voucher &&
      carriers &&
      carriers.find((carr) => carr.code === voucher.carrierCode);
    return {
      ...voucher,
      carrier: carrier ? `${carrier.title} (${carrier.code})` : "",
      itemList: equipments?.map((equipment) => {
        const quantity =
          voucher?.itemList?.find((equip) => {
            return equip.equipmentCode === equipment.code;
          })?.quantity || 0;
        const { code, regular, unitCost, title } = equipment;
        const canEditUnit = () => {
          switch (true) {
            case voucher &&
              voucher.status === Statuses.ENTRADA &&
              editMode !== "forward" &&
              parseInt(quantity.toString(), 10) > 0:
              return false;
            case voucher &&
              voucher.status === Statuses.ENTRADA &&
              parseInt(quantity.toString(), 10) === 0:
              return true;
            case voucher &&
              [Statuses.ENTRADA, Statuses.CARRETERA].indexOf(voucher.status) >
                -1 &&
              parseInt(quantity.toString(), 10) === 0:
              return false;
            default:
              return true;
          }
        };
        return {
          quantity,
          equipmentCode: code,
          regular,
          unitCost,
          title,
          canEdit: canEditUnit(),
          maxQuantity: quantity,
        };
      }),
      eventList:
        voucher &&
        voucher.eventList &&
        Array.isArray(voucher.eventList) &&
        voucher.eventList.map((event: Event) => {
          const originUser =
            voucher &&
            users &&
            users.find((user) => user.username === event.originUser);
          const targetUser =
            voucher &&
            users &&
            users.find((user) => user.username === event.targetUser);
          const patio =
            voucher &&
            patios &&
            patios.find((pat) => pat.code === event.patioCode);
          return {
            ...event,
            originUser: originUser
              ? `${originUser.firstName} ${originUser.lastName} (${event.originUser})`
              : event.originUser,
            patioCode: patio
              ? `${patio.title} (${patio.code})`
              : event.patioCode,
            targetUser: targetUser
              ? `${targetUser.firstName} ${targetUser.lastName} (${event.targetUser})`
              : event.originUser,
          };
        }),
    };
  }
);

export const voucherPdfSelector = createSelector(
  sliceSelector,
  catalogSelector,
  userCatalogSelector,
  carriersCatalogSelector,
  patioCatalogSelector,
  (slice: VoucherSlice, equipments, users, carriers, patios): any => {
    const { voucher } = slice;
    const deliveredBy =
      voucher &&
      users &&
      users.find((user) => user.username === voucher.deliveredBy);
    const receivedBy =
      voucher &&
      users &&
      users.find((user) => user.username === voucher.receivedBy);
    const carrier =
      voucher &&
      carriers &&
      carriers.find((carr) => carr.code === voucher.carrierCode);
    const patio =
      voucher && patios && patios.find((pat) => pat.code === voucher.patioCode);
    return {
      ...voucher,
      itemList: equipments?.map((equipment) => {
        const quantity =
          voucher?.itemList?.find((equip) => {
            return equip.equipmentCode === equipment.code;
          })?.quantity || 0;
        const { code, regular, unitCost, title } = equipment;
        return {
          quantity,
          equipmentCode: code,
          regular,
          unitCost,
          title,
          maxQuantity: quantity,
        };
      }),
      deliveredBy: deliveredBy
        ? `${deliveredBy.firstName} ${deliveredBy.lastName} (${
            voucher && voucher.deliveredBy
          })`
        : voucher && voucher.deliveredBy,
      receivedBy: receivedBy
        ? `${receivedBy.firstName} ${receivedBy.lastName} (${
            voucher && voucher.receivedBy
          })`
        : voucher && voucher.receivedBy,
      carrierCode: carrier,
      patioCode: patio,
    };
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.loading
);
/*
export const catalogSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.catalog
);
*/
export const vouchersCatalogSelector = createSelector(
  sliceSelector,
  userCatalogSelector,
  statusesSelector,
  (slice: VoucherSlice, users, statuses) =>
    slice.vouchers &&
    users &&
    Array.isArray(users) &&
    Array.isArray(slice.vouchers) &&
    slice.vouchers.map((voucher: Voucher) => {
      const deliveredBy = users.find(
        (user) => user.username === voucher.deliveredBy
      );
      const receivedBy = users.find(
        (user) => user.username === voucher.receivedBy
      );
      return {
        ...voucher,
        deliveredBy: deliveredBy
          ? `${deliveredBy.firstName} ${deliveredBy.lastName} (${voucher.deliveredBy})`
          : voucher.deliveredBy,
        receivedBy: receivedBy
          ? `${receivedBy.firstName} ${receivedBy.lastName} (${voucher.receivedBy})`
          : voucher.receivedBy,
        status:
          (statuses &&
            statuses.find((status) => status.code === voucher.status)?.title) ||
          "",
        stat: voucher.status,
      };
    })
);

export const vouchersCatalogIdsSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) =>
    slice.vouchersCatalog &&
    Array.isArray(slice.vouchersCatalog) &&
    slice.vouchersCatalog.map((voucher: Voucher) => {
      return voucher.id;
    })
);

export const vouchersOutIdsSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) =>
    slice.vouchersOut ? Object.keys(slice.vouchersOut) : []
);

export const vouchersOutSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => Object.values(slice.vouchersOut || {})
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.paging
);

export const appliedFiltersSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.filters
);

export const filtersSelector = createSelector(
  sliceSelector,
  carriersCatalogSelector,
  patioCatalogSelector,
  unitCatalogSelector,
  userCatalogSelector,
  userIsComunSelector,
  (slice: any, carriers: any, patios: any, units: any, users: any, isComun) => {
    const filters = [
      {
        abbr: "ID",
        type: "text",
        param: "id",
        name: "(ID) Vale #",
      },
      {
        abbr: "PLA",
        type: "text",
        param: "platform",
        name: "(PLA) Plataforma",
      },
      {
        abbr: "UNI",
        type: "text",
        param: "unitCode",
        name: "(UNI) Unidad",
      },
      {
        abbr: "CAR",
        type: "dropdown",
        param: "carrierCode",
        name: "(CAR) Compañía",
        options: carriers
          ? [
              ...carriers.map((carrier: any) => {
                return {
                  id: carrier.code,
                  value: `${carrier.title} (${carrier.code})`,
                };
              }),
            ]
          : [],
      },
      {
        abbr: "REC",
        type: "text",
        param: "receivedBy",
        name: "(REC) Recibió equipo",
      },
    ];
    if (!isComun.status) {
      filters.push({
        abbr: "PAT",
        type: "dropdown",
        param: "patioCode",
        name: "(PAT) Patio",
        options: patios
          ? [
              ...patios.map((item: any) => {
                return { id: item.code, value: item.title };
              }),
            ]
          : [],
      });
      filters.push({
        abbr: "EST",
        type: "dropdown",
        param: "status",
        name: "(EST) Estatus",
        options: Statuses
          ? [
              ...Object.keys(Statuses).map((status: any) => {
                return { id: status, value: Status[status] };
              }),
            ]
          : [],
      });
    }
    return filters;
  }
);

export const searchSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): Voucher | null =>
    slice.search ? slice.search.voucher : null
);

export const searchLoadingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): boolean | undefined => slice.search?.loading
);

export const downloadingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): boolean => slice.downloading
);

export const downloadedVouchersSelector = createSelector(
  sliceSelector,
  carriersCatalogSelector,
  patioCatalogSelector,
  unitCatalogSelector,
  userCatalogSelector,
  (
    slice: VoucherSlice,
    carriers: any,
    patios: any,
    units: any,
    users: any
  ): Array<any> | null =>
    Array.isArray(slice.downloadedVouchers)
      ? slice.downloadedVouchers.map((voucher: Voucher) => {
          const carrier =
            carriers &&
            carriers.find((carr) => carr.code === voucher.carrierCode);
          const unit =
            units && units.find((unit) => unit.code === voucher.unitCode);
          const patio =
            patios && patios.find((patio) => patio.code === voucher.patioCode);
          const deliveredBy =
            users &&
            users.find((user) => user.username === voucher.deliveredBy);
          const receivedBy =
            users && users.find((user) => user.username === voucher.receivedBy);
          return {
            ID: voucher.id,
            Compañía: carrier ? `${carrier.title} (${carrier.code})` : "",
            Plataforma: voucher.platform,
            Unidad: unit ? `${unit.title} (${unit.code})` : "",
            Patio: patio ? `${patio.title} (${patio.code})` : "",
            "Entregó equipo": deliveredBy
              ? `${deliveredBy.firstName} ${deliveredBy.lastName} (${deliveredBy.username})`
              : "",
            "Recibió equipo": receivedBy
              ? `${receivedBy.firstName} ${receivedBy.lastName} (${receivedBy.username})`
              : "",
          };
        })
      : []
);
