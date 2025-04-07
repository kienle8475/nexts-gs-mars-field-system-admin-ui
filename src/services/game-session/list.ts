import { axiosApi, axiosSecondApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { IGameSession, IGift, IPaginatedResponse } from "@/types/model";
import { useQuery, UseQueryOptions } from "react-query";

type HttpRequestGameSessionsParams = {
  filters: Record<string, any>;
  page: number;
  size: number;
};

type GameSessionsResponseData = IPaginatedResponse<IGameSession>;

type GameSessionsExportResponseData = {
  data: IGameSession[];
};

const httpRequestGameSessions = async (
  params: HttpRequestGameSessionsParams,
): Promise<GameSessionsResponseData> => {
  try {
    const { filters, page, size } = params;
    const query = new URLSearchParams({
      page: String(page - 1),
      size: String(size),
      ...filters,
    });
    const response = await axiosSecondApi.get<GameSessionsResponseData>(
      `/report/game/list?${query.toString()}`,
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch game sessions");
  }
};

const httpRequestExportGameSessions = async (): Promise<GameSessionsExportResponseData> => {
  try {
    const response = await axiosSecondApi.get<IGameSession[]>(
      `/report/game/export`,
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch game sessions");
  }
};

type QueryFnType = typeof httpRequestGameSessions;

type QueryOptions = {
  params: HttpRequestGameSessionsParams;
  config?: UseQueryOptions<GameSessionsResponseData, Error>;
};

const useQueryGameSessions = ({ params, config }: QueryOptions) => {
  return useQuery<GameSessionsResponseData, Error>({
    queryKey: ["gameSessions", params],
    queryFn: () => httpRequestGameSessions(params),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...config,
  });
};

export { httpRequestGameSessions, httpRequestExportGameSessions, useQueryGameSessions };
export type { GameSessionsResponseData };
