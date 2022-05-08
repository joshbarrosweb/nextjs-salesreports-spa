import { httpClient } from "util/http/api";
import { AxiosResponse } from "axios";
import { Sales } from "../models/sales";

const resourceURL = "/api/sales";

export const useSaleService = () => {
  const createSale = async (sale: Sales): Promise<void> => {
    await httpClient.post<Sales>(resourceURL, sale);
  };

  const generateSalesReport = async (
    clientId: string = "",
    startDate: string = "",
    endDate: string = ""
  ): Promise<Blob> => {
    const url = `${resourceURL}/sales-report?id=${clientId}&startDate=${startDate}&endDate=${endDate}`;
    const response: AxiosResponse = await httpClient.get(url, {
      responseType: "blob",
    });
    const bytes = response.data;
    return new Blob([bytes], { type: "application/pdf" });
  };

  return {
    createSale,
    generateSalesReport,
  };
};
