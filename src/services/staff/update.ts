import { axiosApi, axiosSecondApi } from "@/libs/axios";

export interface UpdateStaffPayload {
  username: string;
  password: string;
  staffCode: string;
  fullName: string;
  trainingDate: string;
  startDate: string;
  passProbationDate?: string;
  files?: File[];
}

export const updateStaff = async (id: number, payload: UpdateStaffPayload) => {
  const formData = new FormData();

  // append từng trường
  formData.append("password", payload.password);
  formData.append("staffCode", payload.staffCode);
  formData.append("fullName", payload.fullName);
  formData.append("trainingDate", payload.trainingDate);
  formData.append("startDate", payload.startDate);
  if (payload.passProbationDate) {
    formData.append("passProbationDate", payload.passProbationDate);
  }
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await axiosApi.put(`/staff-profiles/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};