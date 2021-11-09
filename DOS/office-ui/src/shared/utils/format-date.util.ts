export const getFormattedDate: (date: number) => string = (date: number) => {
  return (
    new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) || ""
  );
};
