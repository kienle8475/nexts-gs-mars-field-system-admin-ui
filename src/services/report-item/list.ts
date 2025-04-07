import { axiosApi, axiosSecondApi } from "@/libs/axios";
import { useQuery } from "react-query";

export interface ReportItem {
  id: number;
  name: string;
  skuCode: string;
  unit: string;
  description: string;
  category: string;
  brand: string;
  reportTypes: string[];
}

export interface GetReportItemsResponse {
  message: string;
  status: number;
  data: ReportItem[];
}


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
