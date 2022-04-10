import { Product } from '../../../../app/models/products'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

interface ProductTableProps {
  products: Array<Product>;
  onEdit: (product) => void;
  onDelete: (product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  const actionTemplate = (record: Product) => {
    const editUrl = `/submissions/products?id=${record.id}`

    return (
      <div>
        <Button
          label="Edit"
          className="p-button-rounded p-button-info"
          onClick={e=> onEdit(record)}
        />

        <Button
          label="Delete"
          className="p-button-rounded p-button-danger"
          onClick={e => {
            confirmDialog({
              header: "Delete Confirmation",
              message: "Are you sure that you want to delete this record?",
              acceptLabel: "Yes",
              rejectLabel: "No",
              accept: () => onDelete(record),
            })
          }}
        />
      </div>
    )
  }

  return (
    <DataTable value={products} paginator rows={5}>
      <Column field="id" header="ID" />
      <Column field="sku" header="SKU" />
      <Column field="name" header="Name" />
      <Column field="price" header="Price" />
      <Column body={actionTemplate} header="" />
    </DataTable>
  )
}
