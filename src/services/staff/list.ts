import { axiosApi, axiosSecondApi } from "@/libs/axios";
import { useQuery } from "react-query";


export interface StaffProfile {
  id: number;
  staffCode: string;
  fullName: string;
  profileImage: string;
  trainingDate: string;
  startDate: string;
  passProbationDate: string;
  updatedAt: string;
  account: {
    id: number;
    username: string;
    role: string;
    createdAt: string;
  };
}

export interface StaffProfileResponse {
  content: StaffProfile[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface StaffProfileQueryParams {
  page: number;
  size: number;
}

export const getStaffProfiles = async (
  params: StaffProfileQueryParams
): Promise<StaffProfileResponse> => {
  const response = await axiosApi.get<{ data: StaffProfileResponse }>(
    "/profiles/staff",
    { params }
  );
  return response.data.data;
};

export const useStaffProfiles = (params: StaffProfileQueryParams) => {
  return useQuery<StaffProfileResponse, Error>({
    queryKey: ["staffProfiles", params],
    queryFn: () => getStaffProfiles(params),
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching staff profiles:", error.message);
    },
  });
};

