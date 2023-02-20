import Head from "next/head";
import { Header } from "../../components/ui/Header";
import styles from './styles.module.scss'
import {canSSRauth} from '../../utils/canSSRAuth'
import {useState,ChangeEvent, FormEvent} from 'react'
import {FiUpload} from 'react-icons/fi'


import {setupAPIClient} from '../../services/api'
import { toast } from "react-toastify";

type ItemProps ={
    id:string;
    name: string
}

interface CategoryProps{
    categoryList: ItemProps[];
}


export default function Product({categoryList}:CategoryProps){

    const [name,setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    //Listar as categorias no select
    const [categories, setCategories] = useState(categoryList || [])
    const[categorySelect, setCategorySelect] = useState(0)

    function handleFile(e:ChangeEvent<HTMLInputElement>){
    //Verificando se tem um files dentro do input
    if(!e.target.files){
        return;
    }
    //Pegando a primeira imagem 
    const image = e.target.files[0];

    //Verficando se tem image
    if(!image){
        return;
    }

    if(image.type === 'image/jpeg' || image.type === 'image/png'){
        //Passando para o useState
        setImageAvatar(image);
        //Uma sacada para renderizar a imagem no previw
        setAvatarUrl(URL.createObjectURL(e.target.files[0]))
    }

    }
    //Quando você seleciona uma nova categoria na lista
    function handleChangeCategory(event){
        setCategorySelect(event.target.value)
    }

    async function handleRegister(event: FormEvent){
        event.preventDefault()

        try{
            const data = new FormData();

            if(name ===''|| price === '' || description === '' || imageAvatar === null){
                toast.error("Preencha todos os campos")
                return;
            }
            data.append('name', name);
            data.append('price', price);
            data.append('description', description)
            data.append('category_id', categories[categorySelect].id);
            data.append('file',imageAvatar)

            const apiClient = setupAPIClient();
            await apiClient.post('/product', data)

            toast.success('Produto cadastrado com sucesso!!')

        }catch(err){
            toast.error('ops erro ao cadastrar!')
        }

        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');
    }

    return(
        <>
        <Head>
            <title>Novo produto - pizzaria</title>
        </Head>
        <div>
        <Header />
        <main className={styles.container}>
            <h1>Novo produto</h1>

            <form className={styles.form} onSubmit={handleRegister}>
        

            <label className={styles.labelAvatar}>
                 <span>
                    <FiUpload size={25} color='#fff' />
                 </span>
                 <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                    {//Verificando se tem uma imagem para renderizar o componente de imagem
                    avatarUrl && (
                        <img
                        className={styles.preview}
                        src={avatarUrl}
                        alt="foto do produto" 
                        width={250}
                        height={250}
                        />
                    )

                    }

            </label>

            
            <select value={categorySelect} onChange={handleChangeCategory}>
                {
                    categories.map((item, index)=>{
                        return(
                            <option key={item.id} value={index}>
                                {item.name}
                            </option>
                        )
                    })
                }
            </select>

            <input type="text"
            placeholder="Digite o nome do produto"
            className={styles.input}
            value={name}
            onChange={(e)=> setName(e.target.value)}
            />

            <input type="text"
            placeholder="Preço do produto"
            className={styles.input}
            value={price}
            onChange={(e)=> setPrice(e.target.value)}
            />

            <textarea  
            placeholder="Descreva seu produto"
            className={styles.input}
            value={description}
            onChange={(e)=> setDescription(e.target.value)}
            />

           <button className={styles.buttonAdd} type='submit'>
            Cadastar
           </button>


            </form>
        </main>
        </div>
        </>
    )
}


export const getServerSideProps = canSSRauth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category')

    
    return{
        props:{
            categoryList: response.data
        }
    }
} )