import { axiosApi } from "@/libs/axios";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const generatePptxExport = async (params: {
  staffId?: number;
  outletId?: number;
  provinceId?: number;
  hasReport?: boolean;
  date?: string;
}): Promise<number> => {
  const query = new URLSearchParams();
  if (params.staffId) query.append('staffId', String(params.staffId));
  if (params.outletId) query.append('outletId', String(params.outletId));
  if (params.provinceId) query.append('provinceId', String(params.provinceId));
  if (params.date) query.append('date', params.date);

  const response = await axiosApi.get(`/exports/generate-pptx?${query.toString()}`);
  return response.data.jobId;
};

export const downloadExportFile = async (jobId: number) => {
  const response = await axiosApi.get(`/exports/download-pptx/${jobId}`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    },
  });

  if (response.status === 200) {
    const blob = response.data;

    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'attendance.pptx';

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
  };
}
/**
 * Tự động theo dõi tiến trình xuất báo cáo và tải file khi hoàn tất
 */
export const watchExportJob = (
  jobId: number,
  onDone?: () => void,
  onFailed?: () => void
) => {
  const socket = new SockJS(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws");
  const client = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      client.subscribe(`/topic/export-status/${jobId}`, (message) => {
        const payload = message.body;
        console.log(`[ExportJob] ${jobId} =>`, payload);

        if (payload === 'DONE') {
          onDone?.();
          downloadExportFile(jobId);
        } else if (payload === 'FAILED') {
          onFailed?.();
        }
      });
    },
  });

  client.activate();

  return () => {
    client.deactivate();
  };
};