import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import moment from "moment";

const createAxiosInstance = (baseURL: string) => {
  const instance = Axios.create();

  const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const timestamp = moment.utc().format("X");
    config.baseURL = baseURL;
    config.headers["Accept"] = "application/json";
    config.headers["x-request-timestamp"] = timestamp;

    return config;
  };

  const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    // console.error(`[📛 request error]`, error);
    return Promise.reject(error);
  };

  const onResponse = (response: AxiosResponse): AxiosResponse => {
    // console.info(`[🔥 response] `, response);
    return response;
  };

  const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    // console.error(`[📛 response error]`, error);
    return Promise.reject(error);
  };

  instance.interceptors.request.use(onRequest, onRequestError);
  instance.interceptors.response.use(onResponse, onResponseError);

  return instance;
};


export const primaryAxios = createAxiosInstance(`${process.env.NEXT_PUBLIC_API_URL}/v1`);
