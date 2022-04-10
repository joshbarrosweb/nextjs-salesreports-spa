import { Layout } from '../layout'
import { Sales } from '../../app/models/sales'
import { SalesForm } from './form'

export const Sales: React.FC = () => {

  const handleSubmit = (sales: Sales) => {
    console.log(sales);
  }

  return (
    <Layout title="Sales">
      <SalesForm onSubmit={handleSubmit} />
    </Layout>
  )
}
