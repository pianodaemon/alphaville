export const getFormattedDate: (date: number) => string = (date: number) => {
  return (
    new Date(date * 1000).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) || ""
  );
};
