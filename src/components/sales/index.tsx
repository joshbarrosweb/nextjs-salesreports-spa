import { useState } from "react";

import { Layout } from "../layout";
import { Sales } from "../../models/sales";
import { SalesForm } from "./form";
import { useSaleService } from "../../services/sale.service";

import { Alert } from "../common/message";

export const Sales: React.FC = () => {
  const service = useSaleService();
  const [messages, setMessages] = useState<Alert[]>([]);
  const [saleCreated, setSaleCreated] = useState<boolean>(false);

  const handleSubmit = (sale: Sales) => {
    service
      .createSale(sale)
      .then((response) => {
        setMessages([
          {
            text: "Sale created successfully!",
            type: "success",
          },
        ]);
        setSaleCreated(true);
      })
      .catch((error) => {
        console.error(error);
        setMessages([
          {
            text: "There was an error when trying to create Sale!",
            type: "danger",
          },
        ]);
      });
  };

  const handleNewSale = () => {
    setSaleCreated(false);
    setMessages([]);
  };

  return (
    <Layout title="Sales" msgs={messages}>
      <SalesForm
        onSubmit={handleSubmit}
        onNewSale={handleNewSale}
        saleCreated={saleCreated}
      />
    </Layout>
  );
};
