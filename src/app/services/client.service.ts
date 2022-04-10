import { httpClient } from '../http';
import { Client } from '../models/clients';
import { AxiosResponse } from 'axios';
import { Page } from '../models/common/page'

const resourceURL: string = '/api/clients';

export const useClientService = () => {

  const saveClientService = async (client: Client) : Promise<Client> => {
    const response: AxiosResponse<Client> = await httpClient.post<Client>(resourceURL, client);
    return response.data;
  }

  const updateClientService = async (client: Client) : Promise<void> => {
    const url: string = `${resourceURL}/${client.id}`
    await httpClient.put<Client>(url, client);
  }

  const showClientService = async(id: string): Promise<Client> => {
    const url: string = `${resourceURL}/${id}`;
    const response: AxiosResponse<Client> = await httpClient.get(url);
    return response.data;
  }

  const deleteClientService = async(id: string): Promise<void> => {
    const url: string = `${resourceURL}/${id}`;
    await httpClient.delete(url);
  }

  const searchClientService = async (
    name: string = '',
    cpf: string = '',
    page: number = 0,
    size: number = 10) : Promise<Page<Client>> => {
      const url = `${resourceURL}?name=${name}&cpf=${cpf}&page=${page}&size=${size}`
      const response: AxiosResponse<Page<Client>> = await httpClient.get(url);
      return response.data;
  }

  return {
    saveClientService,
    updateClientService,
    showClientService,
    deleteClientService,
    searchClientService
  }
}
