import { axiosApi } from "@/libs/axios";
import { useQuery } from "react-query";

// ==== TYPES ====

export interface StaffLeaveFilterParams {
  date: string;
  outletId?: string;
  staffId?: string;
  currentlyLeaving?: boolean;
  page: number;
  size: number;
}

export interface StaffLeaveItem {
  id: number;
  staffName: string;
  outletName: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  leaveType: "RESTROOM" | "BREAK_TIME" | "EATING" | string;
  note: string;
}

export interface StaffLeaveResponse {
  content: StaffLeaveItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ==== RAW SERVICE ====

export const getStaffLeaveReport = async (
  params: StaffLeaveFilterParams
): Promise<StaffLeaveResponse> => {
  const response = await axiosApi.get<{ data: StaffLeaveResponse }>(
    "/reports/staff-leave",
    { params }
  );
  return response.data.data;
};

// ==== HOOK ====

export const useStaffLeaveReport = (params: StaffLeaveFilterParams) => {
  return useQuery<StaffLeaveResponse, Error>({
    queryKey: ["staff-leave", params],
    queryFn: () => getStaffLeaveReport(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 1,
    onError: (err) => {
      console.error("useStaffLeaveReport error:", err.message);
    },
  });
};
