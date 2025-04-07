import { axiosApi } from "@/libs/axios";
import { MutationConfig } from "@/libs/react-query";
import { objectToFormData } from "@/utils/common";
import { useMutation } from "react-query";

type HttpRequestGiftUpdateParams = {
  token: any;
  giftId: string;
  code?: string;
  label?: string;
  image?: File;
};

type GiftUpdateRequestBody = {
  code?: string;
  label?: string;
  image?: File;
};

type GiftUpdateResponseData = {
  data: {
    success: boolean;
  };
};

const httpRequestGiftUpdate = async (
  params: HttpRequestGiftUpdateParams,
): Promise<GiftUpdateResponseData> => {
  const body: GiftUpdateRequestBody = {
    code: params.code,
    label: params.label,
    image: params.image,
  };

  const form = objectToFormData<GiftUpdateRequestBody>(body);

  try {
    const res = await axiosApi.put(`/gift/${params.giftId}/update`, form, {
      headers: {
        Authorization: "Bearer " + params.token,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      timeout: 30000,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

type MutationFnType = typeof httpRequestGiftUpdate;

type MutationOptions = {
  config?: MutationConfig<MutationFnType>;
};

const useMutationGiftUpdate = ({ config }: MutationOptions = {}) => {
  return useMutation({
    mutationFn: httpRequestGiftUpdate,
    ...config,
  });
};

export { httpRequestGiftUpdate, useMutationGiftUpdate };
export type { GiftUpdateResponseData };
