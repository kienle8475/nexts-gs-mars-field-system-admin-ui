import { axiosApi } from "@/libs/axios";
import { useQuery } from "react-query";


export const exportAttendanceExcel = async (params: {
  staffId?: number;
  outletId?: number;
  provinceId?: number;
  hasReport?: boolean;
  date?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const query = new URLSearchParams();
  if (params.staffId) query.append('staffId', String(params.staffId));
  if (params.outletId) query.append('outletId', String(params.outletId));
  if (params.provinceId) query.append('provinceId', String(params.provinceId));
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);

  const response = await axiosApi.get(`/exports/attendances?${query.toString()}`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

  if (response.status === 200) {
    const blob = response.data;

    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'attendance.xlsx';

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