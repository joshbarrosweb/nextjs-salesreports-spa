import { Layout, Loader } from "components"
import Link from 'next/link';
import Router from "next/router";
import { ProductTable } from "./table";
import { Product } from 'app/models/products';
import useSWR from 'swr';
import { httpClient } from "app/http";
import { AxiosResponse } from "axios";
import { useProductService } from "app/services";
import { useState, useEffect } from "react";
import { Alert } from "components/common/message";

export const ProductList: React.FC = () => {

  const service = useProductService();

  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [list, setList] = useState<Product[]>();

  const { data: result, error } = useSWR<AxiosResponse<Product[]>>('/api/products', url => httpClient.get(url))

  useEffect(() => {
    setList(result?.data || [])
  }, [result])

  const editAction = (product: Product) => {
    const url = `/submissions/products?id=${product.id}`;
    Router.push(url);
  }

  const deleteAction = (product: Product) => {
    service.deleteProductService(product.id).then(response => {
      setMessages([
        { type: "success", text: "Product deleted successfully"}
      ])
      const modifiedList: Product[] = list?.filter( p => p.id !== product.id)
      setList(modifiedList);
    })
  }

  if(!result) {
    return (
      <div>Loading data...</div>
    )
  }

  return (
    <Layout title="Products" msgs={messages}>
      <Link href="/submissions/products">
        <button className="button is-warning">New</button>
      </Link>
      <br />
      <br />
      <Loader show={!result} />
      <ProductTable onEdit={editAction} onDelete={deleteAction} products={list} />
    </Layout>
  )
}
