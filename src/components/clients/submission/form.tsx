import { useFormik } from "formik";
import Router from "next/router";

import { Client } from "../../../models/clients";
import { Input, InputCPF, InputPhone, InputDate } from "../../common/input";
import { validationSchema } from "./validationSchema";

interface ClientFormProps {
  client: Client;
  onSubmit: (client: Client) => void;
}

const formSchema: Client = {
  id: "",
  name: "",
  cpf: "",
  birthdate: "",
  address: "",
  email: "",
  phone: "",
  createdAt: "",
};

export const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit }) => {
  const formik = useFormik<Client>({
    initialValues: { ...formSchema, ...client },
    onSubmit,
    enableReinitialize: true,
    validationSchema: validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.values.id && (
        <div className="columns">
          <Input
            id="id"
            name="id"
            label="ID: "
            disabled
            columnClasses="is-half"
            value={formik.values.id}
          />
          <Input
            id="createdAt"
            name="createdAt"
            label="Created At: "
            disabled
            columnClasses="is-half"
            value={formik.values.createdAt}
          />
        </div>
      )}

      <div className="columns">
        <Input
          id="name"
          name="name"
          label="Name: "
          columnClasses="is-full"
          onChange={formik.handleChange}
          value={formik.values.name}
          error={formik.errors.name}
        />
      </div>

      <div className="columns">
        <InputCPF
          id="cpf"
          name="cpf"
          label="CPF: "
          columnClasses="is-half"
          onChange={formik.handleChange}
          value={formik.values.cpf}
          error={formik.errors.cpf}
        />
        <InputDate
          id="birthdate"
          name="birthdate"
          label="BirthDate: "
          columnClasses="is-half"
          onChange={formik.handleChange}
          value={formik.values.birthdate}
          error={formik.errors.birthdate}
        />
      </div>

      <div className="columns">
        <Input
          id="address"
          name="address"
          label="Address: "
          columnClasses="is-full"
          onChange={formik.handleChange}
          value={formik.values.address}
          error={formik.errors.address}
        />
      </div>

      <div className="columns">
        <Input
          id="email"
          name="email"
          label="E-mail: "
          columnClasses="is-half"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email}
        />
        <InputPhone
          id="phone"
          name="phone"
          label="Phone: "
          columnClasses="is-half"
          onChange={formik.handleChange}
          value={formik.values.phone}
          error={formik.errors.phone}
        />
      </div>

      <div className="field is-grouped">
        <div className="control is-link">
          <button type="submit" className="button is-success">
            {formik.values.id ? "Update" : "Save"}
          </button>
        </div>

        <div className="control">
          <button
            type="button"
            className="button"
            onClick={(e) => Router.push("/list/clients")}
          >
            Return
          </button>
        </div>
      </div>
    </form>
  );
};
