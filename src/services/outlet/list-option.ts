import { axiosApi, axiosSecondApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { BaseResponse, IOutlet } from "@/types/model";
import axios from "axios";
import { useQuery } from "react-query";

// ==== TYPES ====

export interface OutletOption {
  id: number;
  name: string;
}

export interface GetOutletsResponse {
  message: string;
  status: number;
  data: OutletOption[];
}

// ==== RAW SERVICE ====

export const fetchOutletsByProvince = async (provinceId?: number): Promise<OutletOption[]> => {
  const res = await axiosApi.get<GetOutletsResponse>(
    "/outlets/option-by-province",
    {
      params: provinceId ? { provinceId } : {},
    }
  );
  return res.data.data;
};

// ==== HOOK ====

export const useOutletsByProvince = (provinceId?: number) => {
  return useQuery<OutletOption[], Error>({
    queryKey: ["outlet-options", provinceId],
    queryFn: () => fetchOutletsByProvince(provinceId),
    enabled: provinceId !== undefined,
    staleTime: 1000 * 60 * 5,
  });
};