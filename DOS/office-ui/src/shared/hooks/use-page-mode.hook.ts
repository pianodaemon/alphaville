import { useParams } from "react-router-dom";

export const usePageMode = (mode: string): boolean => {
  const { action } = useParams<any>();
  return action === mode;
};
