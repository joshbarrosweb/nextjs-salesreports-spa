import { useState } from 'react'
import { useFormik } from 'formik'

import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'

import { Client } from '../../app/models/clients'
import { Product } from '../../app/models/products'
import { SaleItem, Sales } from '../../app/models/sales'
import { Page } from '../../app/models/common/page'

import { useClientService } from '../../app/services/client.service'
import { useProductService } from '../../app/services/product.service'

import { validationSchema } from './validationSchema';

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

interface SalesFormProps {
  onSubmit: (sales: Sales) => void;
}

const formSchema: Sales = {
  client: null,
  items: [],
  total: 0,
  paymentForm: ''
}

export const SalesForm: React.FC<SalesFormProps> = ({
  onSubmit
}) => {

  // todo: quantity field breaking if the "0" is deleted, showing a NaN

  const paymentForms: String[] = ["CASH", "DEBIT", "CREDIT"]
  const clientService = useClientService()
  const productService = useProductService()

  const[productList, setProductList] = useState<Product[]>([])
  const[filteredProductList, setFilteredProductList] = useState<Product[]>([])
  const[message, setMessage] = useState<string>()
  const[productCode, setProductCode] = useState<string>('')
  const[productQuantity, setProductQuantity] = useState<number>(0);
  const[product, setProduct] = useState<Product>(null);
  const[clientList, setClientList] = useState<Page<Client>>({
    content: [],
    first: 0,
    number: 0,
    size: 0,
    totalElements: 0
  })

  const formik = useFormik<Sales>({
    onSubmit,
    initialValues: formSchema,
    validationSchema
  })

  const handleClientAutocomplete = (e: AutoCompleteCompleteMethodParams) => {
      const name = e.query
      clientService.searchClientService(name, '', 0, 20)
      .then(clients => setClientList(clients));
  }

  const handleClientChange = (e: AutoCompleteChangeParams) => {
      const selectedClient = e.value
      formik.setFieldValue("client", selectedClient)
  }

  const handleProductCodeChange = (event) => {
    if(productCode) {
      productService.showProductService(productCode)
        .then(productFound => setProduct(productFound))
        .catch(error => {
          setMessage('Product not found!')
      })
    }
  }

  const handleAddProduct = () => {
    const itemsAdded = formik.values.items

    const itemAlreadyAdded =  itemsAdded?.some((si: SaleItem) => {
      return si.product.id === product.id
    })

    if(itemAlreadyAdded) {
      itemsAdded?.forEach((si: SaleItem) => {
        if(si.product.id === product.id) {
          si.quantity = si.quantity + productQuantity
        }
      })
    } else {
      itemsAdded?.push({
        product: product,
        quantity: productQuantity
      })
    }

    setProduct(null)
    setProductCode('')
    setProductQuantity(0)

    const total = saleTotals()
    formik.setFieldValue("total", total)
  }

  const handleCloseMessage = () => {
    setMessage('')
    setProductCode('')
    setProduct(null)
  }

  const dialogMessageFooter = () => {
    return (
      <div>
        <Button label="OK" onClick={handleCloseMessage} />
      </div>
    )
  }

  const handleProductAutocomplete = async (e: AutoCompleteCompleteMethodParams) => {
    if(!productList.length) {
      const productsFound = await productService.indexProductService()
        setProductList(productsFound)
    }

    const productsFound = productList.filter((product: Product) => {
      return product.name?.toUpperCase().includes(e.query.toUpperCase())
    })

    setFilteredProductList(productsFound)
  }

  const disableAddProductButton = () => {
    return !product || !productQuantity
  }

  const saleTotals = () => {
    const totals: number[] = formik.values.items?.map(si => si.quantity * si.product.price)

    if(totals.length) {
      return totals.reduce(
        (totalPrice = 0, thisItemPrice) => totalPrice + thisItemPrice
      )
    } else {
      return 0;
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="client">Client: *</label>
          <AutoComplete
            suggestions={clientList.content}
            completeMethod={handleClientAutocomplete}
            value={formik.values.client}
            field="name"
            id="client"
            name="client"
            onChange={handleClientChange}
          />
          <small className="p-error p-d-block">{formik.errors.client}</small>
        </div>

        <div className="p-grid">
            <div className="p-col-2">
              <span className="p-float-label">
                <InputText
                  onBlur={handleProductCodeChange}
                  id="productCode"
                  value={productCode}
                  onChange={e => setProductCode(e.target.value)}
                />
                <label htmlFor="productCode">Code: </label>
            </span>
          </div>

          <div className="p-col-6">
            <AutoComplete
              id="product"
              name="product"
              field="name"
              suggestions={filteredProductList}
              completeMethod={handleProductAutocomplete}
              value={product}
              onChange={e => setProduct(e.value)}
            />
          </div>

          <div className="p-col-2">
            <span className="p-float-label">
              <InputText
                  id="productQuantity"
                  value={productQuantity}
                  onChange={e => setProductQuantity(parseInt(e.target.value))}
                />
                <label htmlFor="productQuantity">Quantity: </label>
            </span>
          </div>

          <div className="p-col-2">
            <div className="p-field">
              <Button
                disabled={disableAddProductButton()}
                type="button"
                label="Add"
                onClick={handleAddProduct}
              />
            </div>
          </div>

          <div className="p-col-12">
              <DataTable value={formik.values.items} emptyMessage="No product added">
                <Column body={(item: SaleItem) => {
                  const handleRemoveItem = () => {
                    const newList = formik.values.items?.filter(
                      si => si.product.id !== item.product.id
                    )
                    formik.setFieldValue("items", newList)
                  }

                  return (
                    <Button type="button" label="Delete" onClick={handleRemoveItem} />
                  )
                }} />
                <Column field="product.id" header="Code" />
                <Column field="product.sku" header="SKU" />
                <Column field="product.name" header="Product" />
                <Column field="product.price" header="Unit" />
                <Column field="quantity" header="Quantity" />
                <Column header="Total" body={(si: SaleItem) => {
                    const total = si.product.price * si.quantity
                    const formattedTotals = moneyFormatter.format(total)
                    return (
                      <div>
                        { formattedTotals }
                      </div>
                    )
                  }}
                />
              </DataTable>
              <small className="p-error p-d-block">{formik.touched && formik.errors.items}</small>
            </div>

            <div className="p-col-3">
              <div className="p-field">
                <label htmlFor="paymentForm">Payment Form: *</label>
                <Dropdown
                  id="paymentForm"
                  options={paymentForms}
                  value={formik.values.paymentForm}
                  onChange={e => formik.setFieldValue("paymentForm", e.value)}
                  placeholder="Select..."
                />
                <small className="p-error p-d-block">{formik.touched && formik.errors.paymentForm}</small>
              </div>
            </div>

            <div className="p-col-2">
              <div className="p-field">
                <label htmlFor="items">Items: </label>
                <InputText disabled value={formik.values.items?.length} />
              </div>
            </div>

            <div className="p-col-2">
              <div className="p-field">
                <label htmlFor="total">Total: </label>
                <InputText disabled value={moneyFormatter.format(formik.values.total)} />
              </div>
            </div>
        </div>

        <Button type="submit" label="Save" />

      </div>
      <Dialog
        header="Warning!!!"
        position="top"
        visible={!!message}
        onHide={handleCloseMessage}
        footer={dialogMessageFooter}
      >
        {message}
      </Dialog>
    </form>
  )
}
