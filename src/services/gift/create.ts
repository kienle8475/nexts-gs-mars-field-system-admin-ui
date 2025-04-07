import { axiosApi } from "@/libs/axios";
import { MutationConfig } from "@/libs/react-query";
import { objectToFormData } from "@/utils/common";
import { useMutation } from "react-query";

type HttpRequestGiftCreateParams = {
  token: any;
  code: string;
  label: string;
  image: File;
};

type GiftCreateRequestBody = {
  code: string;
  label: string;
  image: File;
};

type GiftCreateResponseData = {
  data: {
    success: boolean;
  };
};

const httpRequestGiftCreate = async (
  params: HttpRequestGiftCreateParams,
): Promise<GiftCreateResponseData> => {
  const body: GiftCreateRequestBody = {
    code: params.code,
    label: params.label,
    image: params.image,
  };

  const form = objectToFormData<GiftCreateRequestBody>(body);

  try {
    const res = await axiosApi.post(`/gift/new`, form, {
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

type MutationFnType = typeof httpRequestGiftCreate;

type MutationOptions = {
  config?: MutationConfig<MutationFnType>;
};

const useMutationGiftCreate = ({ config }: MutationOptions = {}) => {
  return useMutation({
    mutationFn: httpRequestGiftCreate,
    ...config,
  });
};

export { httpRequestGiftCreate, useMutationGiftCreate };
export type { GiftCreateResponseData };
