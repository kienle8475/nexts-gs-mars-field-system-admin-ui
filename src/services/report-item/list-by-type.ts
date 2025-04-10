import { axiosApi } from "@/libs/axios";
import { useQuery } from "react-query";
import { GetReportItemsResponse } from "./list";



export const getReportItemsByType = async (type: string): Promise<GetReportItemsResponse> => {
  const response = await axiosApi.get(`/report-items/by-report-type`, {
    params: { type },
  });
  return response.data.data;
};

export const useReportItems = (type: string) =>
  useQuery<GetReportItemsResponse>({
    queryKey: ["reportItems", type],
    queryFn: () => getReportItemsByType(type),
    staleTime: 1 * 60 * 1000,
  });
