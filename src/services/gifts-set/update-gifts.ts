import { axiosApi } from "@/libs/axios";
import { MutationConfig } from "@/libs/react-query";
import { useMutation } from "react-query";

type HttpRequestOutletGiftsSetUpdateGiftsParams = {
  token: any;
  outlets: { outlet: string; gifts: { gift: string; quantity: number; order: number }[] }[];
};

type OutletGiftsSetUpdateGiftsRequestBody = {
  outlets: { outlet: string; gifts: { gift: string; quantity: number; order: number }[] }[];
};

type OutletGiftsSetUpdateGiftsResponseData = {
  data: {
    success: boolean;
  };
};

const htttpRequestOutletGiftsSetUpdateGifts = async (
  params: HttpRequestOutletGiftsSetUpdateGiftsParams,
): Promise<OutletGiftsSetUpdateGiftsResponseData> => {
  const body: OutletGiftsSetUpdateGiftsRequestBody = {
    outlets: params.outlets,
  };

  try {
    const res = await axiosApi.post(`/gifts-set/update-gifts`, body, {
      headers: {
        Authorization: "Bearer " + params.token,
      },
      withCredentials: true,
      timeout: 30000,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

type MutationFnType = typeof htttpRequestOutletGiftsSetUpdateGifts;

type MutationOptions = {
  config?: MutationConfig<MutationFnType>;
};

const useMutationOutletGiftsSetUpdateGifts = ({ config }: MutationOptions = {}) => {
  return useMutation({
    mutationFn: htttpRequestOutletGiftsSetUpdateGifts,
    ...config,
  });
};

export { htttpRequestOutletGiftsSetUpdateGifts, useMutationOutletGiftsSetUpdateGifts };
export type { OutletGiftsSetUpdateGiftsResponseData };
