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

export const getStaffProfileOptions = async (): Promise<ProfileOption[]> => {
  try {
    const response = await axiosApi.get<GetProfileOptionResponse>("/profiles/staff/options");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all outlets:", error);
    throw error;
  }
};

// ==== HOOK ====

export const useStaffProfileOptions = () => {
  return useQuery<ProfileOption[], Error>({
    queryKey: ["profiles", "staff", "options"],
    queryFn: getStaffProfileOptions,
    retry: 1,
    onError: (err) => {
      console.error("useStaffProfileOptions error:", err.message);
    },
  });
};