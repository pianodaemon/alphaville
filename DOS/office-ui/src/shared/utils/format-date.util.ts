export const getFormattedDate: (date: number, withTime?: boolean) => string = (
  date: number,
  withTime: boolean = false
) => {
  return (
    new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(withTime ? { hour12: true, hour: "numeric", minute: "numeric" } : {}),
    }) || ""
  );
};

export const getFormattedHour: (date: number) => string = (date: number) => {
  return (
    new Date(date).toLocaleTimeString("es-ES", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
    }) || ""
  );
};
