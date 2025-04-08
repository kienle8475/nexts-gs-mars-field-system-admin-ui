import { axiosApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { BaseResponse, IOutlet } from "@/types/model";
import axios from "axios";
import { useQuery } from "react-query";

// ==== TYPES ====

export interface ProfileOption {
  id: number;
  name: string;
}

export interface GetProfileOptionResponse {
  message: string;
  status: number;
  data: ProfileOption[];
}

// ==== RAW SERVICE ====

export const getSaleProfileOptions = async (): Promise<ProfileOption[]> => {
  try {
    const response = await axiosApi.get<GetProfileOptionResponse>("/profiles/sale/options");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all outlets:", error);
    throw error;
  }
};

// ==== HOOK ====

export const useSaleProfileOptions = () => {
  return useQuery<ProfileOption[], Error>({
    queryKey: ["profiles", "sales", "options"],
    queryFn: getSaleProfileOptions,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (err) => {
      console.error("useSaleProfileOptions error:", err.message);
    },
  });
};