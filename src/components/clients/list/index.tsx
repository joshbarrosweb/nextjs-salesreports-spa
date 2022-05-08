import { useState } from "react";
import Router from "next/router";
import { useFormik } from "formik";
import { useClientService } from "../../../services/client.service";

import { DataTable, DataTablePageParams } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import { Layout } from "../../layout";
import { Input, InputCPF } from "../../common/input";
import { Client } from "../../../models/clients";
import { Page } from "../../../models/common/page";

interface ClientListForm {
  name?: string;
  cpf?: string;
}

export const ClientList: React.FC = () => {
  const service = useClientService();

  const [loading, setLoading] = useState<boolean>(false);

  const [clients, setClients] = useState<Page<Client>>({
    content: [],
    first: 0,
    number: 0,
    size: 10,
    totalElements: 0,
  });

  const handleSubmit = (filter: ClientListForm) => {
    handlePage(null);
  };

  const {
    handleSubmit: formikSubmit,
    values: filter,
    handleChange,
  } = useFormik<ClientListForm>({
    onSubmit: handleSubmit,
    initialValues: {
      name: "",
      cpf: "",
    },
  });

  const handlePage = (event: DataTablePageParams) => {
    setLoading(true);
    service
      .searchClientService(filter.name, filter.cpf, event?.page, event?.rows)
      .then((result) => {
        setClients({ ...result, first: event?.first });
      })
      .finally(() => setLoading(false));
  };

  const deleteRecord = (client: Client) => {
    service.deleteClientService(client.id).then((result) => {
      handlePage(null);
    });
  };

  const actionTemplate = (record: Client) => {
    const editUrl = `/submissions/clients?id=${record.id}`;

    return (
      <div>
        <Button
          label="Edit"
          className="p-button-rounded p-button-info"
          onClick={(e) => Router.push(editUrl)}
        />

        <Button
          label="Delete"
          className="p-button-rounded p-button-danger"
          onClick={(e) => {
            confirmDialog({
              header: "Delete Confirmation",
              message: "Are you sure that you want to delete this record?",
              acceptLabel: "Yes",
              rejectLabel: "No",
              accept: () => deleteRecord(record),
            });
          }}
        />
      </div>
    );
  };

  return (
    <Layout title="Clients">
      <form onSubmit={formikSubmit}>
        <div className="columns">
          <Input
            autoComplete="off"
            columnClasses="is-half"
            label="Name"
            id="name"
            name="name"
            value={filter.name}
            onChange={handleChange}
          />

          <InputCPF
            autoComplete="off"
            columnClasses="is-half"
            label="CPF"
            id="cpf"
            name="cpf"
            value={filter.cpf}
            onChange={handleChange}
          />
        </div>
        <div className="field is-grouped">
          <div className="control is-link">
            <button type="submit" className="button is-success">
              Search
            </button>
          </div>
          <div className="control is-link">
            <button
              type="submit"
              onClick={(e) => Router.push("/submissions/clients")}
              className="button is-warning"
            >
              New
            </button>
          </div>
        </div>
      </form>

      <br />

      <div className="columns">
        <div className="is-full">
          <DataTable
            value={clients.content}
            totalRecords={clients.totalElements}
            lazy
            paginator
            loading={loading}
            first={clients.first}
            rows={clients.size}
            onPage={handlePage}
          >
            <Column field="id" header="ID" />
            <Column field="name" header="Name" />
            <Column field="cpf" header="CPF" />
            <Column field="birthdate" header="Birth Date" />
            <Column field="phone" header="Phone" />
            <Column body={actionTemplate} />
          </DataTable>
        </div>
      </div>
    </Layout>
  );
};
