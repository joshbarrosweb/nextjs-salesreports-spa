import axios, { AxiosInstance } from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { "nextjs-token": token } = parseCookies(ctx);

  const httpClient: AxiosInstance = axios.create({
    baseURL: "http://localhost:8082/",
  });

  httpClient.interceptors.request.use((config) => {
    console.log(config);

    return config;
  });

  if (token) {
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return httpClient;
}
