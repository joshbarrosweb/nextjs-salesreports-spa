import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import * as Yup from "yup";

import { Layout } from "../../layout";
import { Input, InputMoney } from "../../common/input";
import { useProductService } from "../../../services/product.service";
import { Product } from "../../../models/products";
import { convertToBigDecimal, formatBRL } from "../../../util/money";
import { Alert } from "../../common/message";

const validationSchema = Yup.object().shape({
  sku: Yup.string().trim().required("Field cannot be blank!"),
  name: Yup.string().trim().required("Field cannot be blank!"),
  description: Yup.string().trim().required("Field cannot be blank!"),
  price: Yup.number()
    .required("Field cannot be blank!")
    .moreThan(0, "Value should be bigger than 0,00"),
});

interface FormErrors {
  sku?: string;
  name?: string;
  price?: string;
  description?: string;
}

export const ProductSubmission: React.FC = () => {
  const service = useProductService();

  const [id, setId] = useState<string | undefined>("");
  const [sku, setSku] = useState<string | undefined>("");
  const [price, setPrice] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [submission, setSubmission] = useState<string | undefined>("");
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [errors, setErrors] = useState<FormErrors>();

  const router = useRouter();

  const { id: queryId } = router.query;

  useEffect(() => {
    if (queryId) {
      service.showProductService(queryId).then((productFound) => {
        setId(productFound.id);
        setSku(productFound.sku);
        setName(productFound.name);
        setPrice(formatBRL(`${productFound.price}`));
        setDescription(productFound.description);
        setSubmission(productFound.submission || "");
      });
    }
  }, [queryId]);

  const handleSubmit = () => {
    const product: Product = {
      id,
      sku,
      price: convertToBigDecimal(price),
      name,
      description,
    };

    validationSchema
      .validate(product)
      .then((obj) => {
        setErrors({});

        if (id) {
          service.updateProductService(product).then((response) => {
            setMessages([
              { type: "success", text: "Product updated successfully!" },
            ]);
          });
        } else {
          service.saveProductService(product).then((productResponse) => {
            setId(productResponse.id);
            setSubmission(productResponse.submission);
            setMessages([
              { type: "success", text: "Product created successfully!" },
            ]);
          });
        }
      })
      .catch((err) => {
        const field = err.path;
        const message = err.message;

        setErrors({
          [field]: message,
        });
      });

    // todo: fix date disappearing on update
    // todo: fix error 400 when submitting price over 8 digits
  };

  return (
    <Layout title="Product Submission" msgs={messages}>
      {id && (
        <div className="columns">
          <Input
            id="inputId"
            label="ID: *"
            columnClasses="is-half"
            value={id}
            disabled
          />

          <Input
            id="inputSubmission"
            label="Created At: *"
            columnClasses="is-half"
            value={submission}
            disabled
          />
        </div>
      )}

      <div className="columns">
        <Input
          id="inputSku"
          label="SKU: *"
          columnClasses="is-half"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="SKU"
          error={errors?.sku}
        />

        <InputMoney
          id="inputPrice"
          label="Price: *"
          columnClasses="is-half"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          maxLength={10}
          error={errors?.price}
        />
      </div>

      <div className="columns">
        <Input
          id="inputName"
          label="Name: *"
          columnClasses="is-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          error={errors?.name}
        />
      </div>

      <div className="columns">
        <div className="field is-full column">
          <label className="label" htmlFor="inputDescription">
            Description: *
          </label>
          <div className="control">
            <textarea
              className="textarea"
              id="inputDescription"
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {errors?.description && (
              <p className="help is-danger">{errors?.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-link">
          <button className="button" onClick={handleSubmit}>
            {id ? "Update" : "Save"}
          </button>
        </div>
        <div className="control">
          <Link href="/list/products">
            <button className="button">Return</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
