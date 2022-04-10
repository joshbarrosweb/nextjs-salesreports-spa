import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Layout } from "../../layout"
import { ClientForm } from './form'
import { Client } from "../../../app/models/clients"
import { useClientService } from "../../../app/services/client.service"
import { Alert } from '../../common/message'

export const ClientSubmission: React.FC = () => {

  const [client, setClient] = useState<Client>({});
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const service = useClientService();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // todo: screen breaks when given id doesnt exist on url params
    // todo: breaks when given and invalid date (ex: 21/32/2022)

    if(id) {
      service.showClientService(id).then(clientFound => setClient(clientFound))
    }
  }, [id])

  const handleSubmit = (client: Client) => {
    console.log(client);

    if(client.id) {
      service.updateClientService(client).then(response => {
        setMessages([{
          type: "success", text: "Client updated successfully!"
        }])
      })
    } else {
      service.saveClientService(client).then(savedClient => {
        setClient(savedClient)
        setMessages([{
          type: "success", text: "Client saved successfully!"
        }])
      })
    }
  }

  return (
    <Layout title="Clients" msgs={messages}>
      <ClientForm client={client} onSubmit={handleSubmit} />
    </Layout>
  )
}
