import { axiosApi, axiosSecondApi } from "@/libs/axios";
import { useQuery } from "react-query";

export interface Province {
  id: number;
  name: string;
}
export interface Account {
  id: number;
  username: string;
  role: "SALE" | "SS" | "KAM"; // hoặc Enum nếu muốn chuẩn hóa
  createdAt: string;
}

export interface SaleProfile {
  id: number;
  account: Account;
  fullName: string;
  role: string;
}

export interface Outlet {
  id: number;
  code: string;
  name: string;
  province: Province;
  address: string;
  saleRep: SaleProfile | null;
  saleSupervisor: SaleProfile | null;
  keyAccountManager: SaleProfile | null;
  latitude: number;
  longitude: number;
  checkinRadiusMeters: number;
  createdAt: string;
  updatedAt: string;
}

export interface OutletResponse {
  content: Outlet[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface OutletQueryParams {
  page: number;
  size: number;
}

export const getOutlets = async (
  params: OutletQueryParams
): Promise<OutletResponse> => {
  const response = await axiosApi.get<{ data: OutletResponse }>(
    "/outlets",
    { params }
  );
  return response.data.data;
};

export const useOutlets = (params: OutletQueryParams) => {
  return useQuery<OutletResponse, Error>({
    queryKey: ["outlets", params],
    queryFn: () => getOutlets(params),
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching outlets:", error.message);
    },
  });
};

