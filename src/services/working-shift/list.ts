import { axiosApi } from "@/libs/axios";
import { useQuery } from "react-query";
import { Outlet } from "../outlet/list";

// ==== TYPES ====

export interface WorkingShiftFilterParams {
  outletId?: string;
  provinceId?: string;
  date: string;
}

export interface WorkingShiftItem {
  id: number;
  outlet: Outlet;
  name: string;
  startTime: string;
  endTime: string;
  totalCheckedIn: number;
  checkedIn: boolean;
}

export interface WorkingShiftResponse {
  data: WorkingShiftItem[];
}

// ==== RAW SERVICE ====

export const getWorkingShifts = async (
  params: WorkingShiftFilterParams
): Promise<WorkingShiftItem[]> => {
  const response = await axiosApi.get<{ data: WorkingShiftItem[] }>(
    "/working-shifts",
    { params }
  );
  return response.data.data;
};

// ==== HOOK ====

export const useWorkingShifts = (params: WorkingShiftFilterParams) => {
  return useQuery<WorkingShiftItem[], Error>({
    queryKey: ["workingShifts", params],
    queryFn: () => getWorkingShifts(params),
    keepPreviousData: true,
    onError: (err) => {
      console.error("useWorkingShifts error:", err.message);
    },
  });
};
