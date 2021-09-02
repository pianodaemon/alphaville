type ServerErrorMessage = {
  en: string;
  es: string;
};

/**
 * Error message for when the server returns an error.
 *
 */
const errorList: Array<ServerErrorMessage> = [
  {
    en: 'duplicate key value violates unique constraint "carriers_unique_code"',
    es: "El valor del campo Clave ingresado existe actualmente. Asegúrese de ingresar una Clave única.",
  },
  {
    en: 'duplicate key value violates unique constraint "equipments_unique_code"',
    es: "El valor del campo Clave ingresado existe actualmente. Asegúrese de ingresar una Clave única.",
  },
];


const GENERIC_ERROR_MESSAGE_ES =
  "¡Error de inesperado! Por favor contacte al Administrador.";

/**
 * Generic error codes (taken from server)
 */
export const errorCodes = {
  GENERIC_ERROR: -1,
};

export function resolveError(error: any): string {
  const errorExist = errorList.find((e) => e.en === error);
  return errorExist
    ? errorExist.es
    : GENERIC_ERROR_MESSAGE_ES;
}
