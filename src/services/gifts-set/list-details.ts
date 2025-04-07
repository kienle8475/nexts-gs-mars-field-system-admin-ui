import { axiosApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { GiftsSetDetails } from "@/types/extend";
import { useQuery } from "react-query";

type HttpRequestGiftsSetListDetailsParams = {
  token: any;
};

type GiftsSetListDetailsResponseData = {
  data: GiftsSetDetails[];
};

const httpRequestGiftsSetListDetails = async (
  params: HttpRequestGiftsSetListDetailsParams,
): Promise<GiftsSetListDetailsResponseData> => {
  try {
    const res = await axiosApi.get(`/gifts-set/list-details`, {
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

type QueryFnType = typeof httpRequestGiftsSetListDetails;

type QueryOptions = {
  params: HttpRequestGiftsSetListDetailsParams;
  config?: QueryConfig<QueryFnType>;
};

const useQueryGiftsSetListDetails = ({ params, config }: QueryOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ["query/gifts-set/list-details", params],
    queryFn: () => httpRequestGiftsSetListDetails(params),
    retry: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...config,
  });
};

export { httpRequestGiftsSetListDetails, useQueryGiftsSetListDetails };
export type { GiftsSetListDetailsResponseData };
