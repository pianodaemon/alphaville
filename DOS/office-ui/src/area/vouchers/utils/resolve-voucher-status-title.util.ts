import { Statuses } from "src/shared/constants/voucher-statuses.constants";
import { Voucher } from "../state/vouchers.reducer";

type VoucherStatusTitleMutators = {
  action?: string | null | undefined;
  forwardVoucher?: boolean | null | undefined;
  isPDF?: boolean | null | undefined;
  id?: string | null | undefined;
  viewOnlyModeOn?: boolean | null | undefined;
  voucher: Voucher;
  watchStatus?: string | null | undefined;
};

export const resolveVoucherStatusTitle: (props: VoucherStatusTitleMutators) => string = ({
  action,
  forwardVoucher,
  id,
  isPDF,
  viewOnlyModeOn,
  voucher,
  watchStatus,
}: VoucherStatusTitleMutators) => {
  if (isPDF) {
    switch (true) {
      case voucher.status === Statuses.ENTRADA:
        return "Entrada de Equipo";
      case voucher.status === Statuses.CARRETERA:
        return "En carretera";
      case voucher.status === Statuses.PATIO:
          return "En patio";
      case voucher.status === Statuses.SALIDA:
            return "Salida de Equipo";
      default:
        return voucher.status;
    }
  }
  switch (true) {
    case action === "create":
      return "Entrada de Equipo";
    case viewOnlyModeOn === true:
      return "Vale de equipo de amarre";
    case Boolean(
      id &&
        [Statuses.ENTRADA, Statuses.PATIO].indexOf(voucher.status) > -1 &&
        forwardVoucher
    ):
      return "Salida de patio a carretera";
    case Boolean(id && watchStatus === Statuses.ENTRADA && !forwardVoucher):
    case Boolean(id && watchStatus === Statuses.CARRETERA && !forwardVoucher):
      return "Entrada de Equipo (edición)";
    case Boolean(id && watchStatus === Statuses.CARRETERA && forwardVoucher):
      return "Entrada de carretera a patio";
    default:
      return "Entrada a patio";
  }
};
