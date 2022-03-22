import { useState } from 'react';
import { Product } from 'app/models/products';

interface ProductTableProps {
  products: Array<Product>;
  onEdit: (product) => void;
  onDelete: (product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <table className="table is-striped is-hoverable">
      <thead>
        <tr>
          <th>ID</th>
          <th>SKU</th>
          <th>Name</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          products?.map( product => <ProductRow onDelete={onDelete} onEdit={onEdit} key={product.id} product={product} /> )
        }
      </tbody>
    </table>
  )
}

interface ProductRowProps {
  product: Product;
  onEdit: (product) => void;
  onDelete: (product) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState<boolean>(false);

  const onDeleteClick = (product: Product) => {
    if(deleting) {
      onDelete(product);
      setDeleting(false)
    } else {
      setDeleting(true);
    }
  }

  const cancelDelete = () => setDeleting(false);

  return (
    <tr>
    <td>{product.id}</td>
    <td>{product.sku}</td>
    <td>{product.name}</td>
    <td>{product.price}</td>
    <td>
      {!deleting &&
        <button onClick={e => onEdit(product)} className="button is-success is-rounded is-small">Edit</button>
      }

      <button onClick={e => onDeleteClick(product)} className="button is-danger is-rounded is-small">{ deleting ? "Are you Sure?" : "Delete"}</button>

      {deleting &&
        <button onClick={cancelDelete} className="button is-rounded is-small">Cancel</button>
      }
    </td>
  </tr>
  )
}
