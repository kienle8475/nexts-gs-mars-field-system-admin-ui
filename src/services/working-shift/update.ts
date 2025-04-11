import { axiosApi } from "@/libs/axios";
import dayjs from "dayjs";
export interface UpdateWorkingShiftPayload {
  name: string;
  startTime: string;
  endTime: string;
}

export const updateWorkingShift = async (id: number, payload: UpdateWorkingShiftPayload) => {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("startTime", dayjs(payload.startTime).format("YYYY-MM-DDTHH:mm:ss.SSS"));
    formData.append("endTime", dayjs(payload.endTime).format("YYYY-MM-DDTHH:mm:ss.SSS"));
    const response = await axiosApi.put(`/working-shifts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật Working Shift:", error?.response?.data || error);
    throw error;
  }
};