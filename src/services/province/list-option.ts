import { axiosApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { BaseResponse, IOutlet } from "@/types/model";
import axios from "axios";
import { useQuery } from "react-query";

// ==== TYPES ====

export interface ProvinceOption {
  id: number;
  name: string;
}

export interface GetProvincesResponse {
  message: string;
  status: number;
  data: ProvinceOption[];
}

// ==== RAW SERVICE ====

export const getAllProvincesOptions = async (): Promise<ProvinceOption[]> => {
  try {
    const response = await axiosApi.get<GetProvincesResponse>("/provinces");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all provinces:", error);
    throw error;
  }
};

// ==== HOOK ====

export const useAllProvincesOptions = () => {
  return useQuery<ProvinceOption[], Error>({
    queryKey: ["provinces", "all"],
    queryFn: getAllProvincesOptions,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (err) => {
      console.error("useAllProvinces error:", err.message);
    },
  });
};
