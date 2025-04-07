import { axiosApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { IGift } from "@/types/model";
import { useQuery } from "react-query";

type HttpRequestGiftsListParams = {
  token: any;
};

type GiftsListResponseData = {
  data: IGift[];
};

const httpRequestGiftsList = async (
  params: HttpRequestGiftsListParams,
): Promise<GiftsListResponseData> => {
  try {
    const res = await axiosApi.get(`/gift/list`, {
      headers: {
        Authorization: "Bearer " + params.token,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

type QueryFnType = typeof httpRequestGiftsList;

type QueryOptions = {
  params: HttpRequestGiftsListParams;
  config?: QueryConfig<QueryFnType>;
};

const useQueryGiftsList = ({ params, config }: QueryOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ["query/gift/list", params],
    queryFn: () => httpRequestGiftsList(params),
    retry: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...config,
  });
};

export { httpRequestGiftsList, useQueryGiftsList };
export type { GiftsListResponseData };
