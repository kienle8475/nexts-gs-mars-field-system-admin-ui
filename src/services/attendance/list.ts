import { axiosApi } from "@/libs/axios";
import { useQuery } from "react-query";

// ==== TYPES ====

export interface AttendanceFilterParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  outletId?: string;
  staffId?: string;
  provinceId?: string;
  page: number;
  size: number;
}

export interface AttendanceItem {
  shiftId: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  outlet: {
    id: number;
    name: string;
    province: string;
  };
  attendances: any[];
}

export interface AttendanceResponse {
  content: AttendanceItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ==== RAW SERVICE ====

export const getAttendanceReport = async (
  params: AttendanceFilterParams
): Promise<AttendanceResponse> => {
  const response = await axiosApi.get<{ data: AttendanceResponse }>(
    "/reports/attendance",
    { params }
  );
  return response.data.data;
};

// ==== HOOK ====

export const useAttendanceReport = (params: AttendanceFilterParams) => {
  return useQuery<AttendanceResponse, Error>({
    queryKey: ["attendanceReport", params],
    queryFn: () => getAttendanceReport(params),
    keepPreviousData: true,
    onError: (err) => {
      console.error("useAttendanceReport error:", err.message);
    },
  });
};
