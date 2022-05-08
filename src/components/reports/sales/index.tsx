import { useState } from "react";
import { useFormik } from "formik";

import {
  AutoComplete,
  AutoCompleteChangeParams,
  AutoCompleteCompleteMethodParams,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { InputDate } from "components/common/input";

import { Layout } from "../../layout";
import { Page } from "../../../models/common/page";
import { Client } from "../../../models/clients";
import { useClientService } from "../../../services/client.service";
import { useSaleService } from "../../../services/sale.service";

interface SalesReportForm {
  client: Client;
  startDate: string;
  endDate: string;
}

export const SalesReport: React.FC = () => {
  const saleService = useSaleService();
  const clientService = useClientService();

  const [clientList, setClientList] = useState<Page<Client>>({
    content: [],
    first: 0,
    number: 0,
    size: 20,
    totalElements: 0,
  });

  const handleSubmit = (formData: SalesReportForm) => {
    saleService
      .generateSalesReport(
        formData.client?.id,
        formData.startDate,
        formData.endDate
      )
      .then((blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      });
  };

  const formik = useFormik<SalesReportForm>({
    onSubmit: handleSubmit,
    initialValues: { client: "", startDate: "", endDate: "" },
  });

  const handleClientAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
    const name = e.query;

    clientService
      .searchClientService(name, "", 0, 20)
      .then((clients) => setClientList(clients));
  };

  return (
    <Layout title="Sales Report">
      <form onSubmit={formik.handleSubmit}>
        <div className="p-fluid">
          <div className="p-grid">
            <div className="p-col-12">
              <AutoComplete
                suggestions={clientList.content}
                completeMethod={handleClientAutoComplete}
                value={formik.values.client}
                field="name"
                id="client"
                name="client"
                onChange={(e: AutoCompleteChangeParams) => {
                  formik.setFieldValue("client", e.value);
                }}
              />
            </div>

            <div className="p-col-6">
              <InputDate
                label="Start Date"
                id="startDate"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
              />
            </div>

            <div className="p-col-6">
              <InputDate
                label="End Date"
                id="endDate"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
              />
            </div>

            <div className="p-col">
              <Button label="Generate Report" type="submit" />
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};
