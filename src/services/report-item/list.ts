import { axiosApi } from "@/libs/axios";
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


export const getReportItems = async (): Promise<ReportItem[]> => {
  const response = await axiosApi.get(`/report-items`);
  return response.data.data;
};

export const useReportItems = () =>
  useQuery<ReportItem[]>({
    queryKey: ["reportItems"],
    queryFn: () => getReportItems(),
    staleTime: 1 * 60 * 1000,
  });
