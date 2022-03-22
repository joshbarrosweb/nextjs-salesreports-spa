import { httpClient } from 'app/http';
import { Product } from 'app/models/products';
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

  const showProductService = async(id): Promise<Product> => {
    const url: string = `${resourceURL}/${id}`;
    const response: AxiosResponse<Product> = await httpClient.get(url);
    return response.data;
  }

  const deleteProductService = async(id): Promise<void> => {
    const url: string = `${resourceURL}/${id}`;
    await httpClient.delete(url);
  }

  return {
    saveProductService,
    updateProductService,
    showProductService,
    deleteProductService
  }
}
