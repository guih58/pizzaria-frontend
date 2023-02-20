import { canSSRauth } from "../../utils/canSSRAuth"
import {useState} from 'react'
import Head from "next/head"
import { Header } from "../../components/ui/Header"
import styles from './styles.module.scss'

import {FiRefreshCcw} from 'react-icons/fi'

import {setupAPIClient} from '../../services/api'

import Modal from 'react-modal'
import { ModalOrder } from "../../components/ui/ModalOrder"

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
}

interface HomeProps{
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string
  }
  order:{
    id: string;
    table: string | number;
    status: boolean;
    name: string | null
  }
}


export default function Dashboard({orders}: HomeProps){
  
  const [orderList, setOrderList] = useState(orders || [])

  //função para fechar o modal
  function handleCloseModal(){
    setModalVisible(false)
  }

  //função ao clicar no botão do modal
 async function handleOpenModalView(id:string){
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/order/detail',{
      params:{
        orders_id:id
      }
    })

    setModalItem(response.data)
    setModalVisible(true)
  }

  async function handleFinishItem(id: string){
    const apiClient = setupAPIClient();
     await apiClient.put('/order/finish',{
      order_id: id
    })

    const response = await apiClient.get('/orders');
    setOrderList(response.data)

   setModalVisible(false)
  }

  async function handleRefreshOrders(){
    const apiClient = setupAPIClient();

    const response = await apiClient.get('/orders')
    setOrderList(response.data)
  }

  //Configuração do modal
  Modal.setAppElement('#__next')
  const [modalItem, setModalItem] = useState<OrderItemProps[]>()
  const [modalVisible, setModalVisible] =useState(false)
  
  return(
    <>
    <Head>
      <title>Painel - pizzaria</title>
    </Head>
        <div>
          <Header />
          
          <main className={styles.container}>

              <div className={styles.containerHeader}>
                  <h1>últimos pedidos</h1>
                  <button onClick={handleRefreshOrders}>
                    <FiRefreshCcw size={25} color="#3fffa3" />
                  </button>
              </div>

              <article className={styles.listOrders}>

                {
                  orderList.length === 0 &&(
                    <span className={styles.emptyList}>
                      Nenhum pedido aberto foi encontrado
                    </span>
                  )
                }

                {
                  orderList?.map(item =>(

                <section key={item.id} className={styles.orderItem}>
                  <button onClick={()=> handleOpenModalView(item.id)}>
                    <div className={styles.tag}></div>
                    <span>Mesa {item.table}</span>
                  </button>
                </section>
                  
                  ))}


              </article>

          </main>
          {// se o ModalVisible estiver true ele vai renderizar o componente
          modalVisible && (
            <ModalOrder
              isOpen={modalVisible}
              onRequestClose={handleCloseModal}
              order={modalItem}
              handleFinishOrder={handleFinishItem}

            />
          )

          }
        </div>

    </>
  )
}


export const getServerSideProps = canSSRauth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get('/orders');
  //console.log(response.data);


  return {
    props: {
      orders: response.data
    }
  }
})