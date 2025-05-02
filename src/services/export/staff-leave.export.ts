import { axiosApi } from "@/libs/axios";
import { useQuery } from "react-query";


export const exportStaffLeaveExcel = async (params: {
  date?: string;
}) => {
  const query = new URLSearchParams();
  if (params.date) query.append('date', params.date);

  const response = await axiosApi.get(`/exports/staff-leave?${query.toString()}`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

  if (response.status === 200) {
    const blob = response.data;

    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'staff-leave.xlsx';

    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="?([^"]+)"?/);
      if (matches?.[1]) {
        fileName = decodeURIComponent(matches[1]);
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = decodeURIComponent(fileName);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }


};