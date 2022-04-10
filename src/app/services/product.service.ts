import { httpClient } from '../http';
import { Product } from '../models/products';
import { AxiosResponse } from 'axios';

const resourceURL: string = "api/products";

export const useProductService = () => {

  const saveProductService = async (product: Product) : Promise<Product> => {
    const response: AxiosResponse<Product> = await httpClient.post<Product>(resourceURL, product);
    return response.data;
  }

  const updateProductService = async (product: Product) : Promise<void> => {
    const url: string = `${resourceURL}/${product.id}`;
    await httpClient.put<Product>(url, product);
  }

  const showProductService = async(id: string): Promise<Product> => {
    const url: string = `${resourceURL}/${id}`;
    const response: AxiosResponse<Product> = await httpClient.get(url);
    return response.data;
  }

  const deleteProductService = async(id: string): Promise<void> => {
    const url: string = `${resourceURL}/${id}`;
    await httpClient.delete(url);
  }

  const indexProductService = async() : Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await httpClient.get(resourceURL)
    return response.data
  }

  return {
    saveProductService,
    updateProductService,
    showProductService,
    deleteProductService,
    indexProductService
  }
}
