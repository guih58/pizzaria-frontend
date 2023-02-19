import Head from "next/head";
import { Header } from "../../components/ui/Header";
import styles from './styles.module.scss'
import {canSSRauth} from '../../utils/canSSRAuth'
import {useState,ChangeEvent} from 'react'
import {FiUpload} from 'react-icons/fi'


export default function Product(){

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);

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

    return(
        <>
        <Head>
            <title>Novo produto - pizzaria</title>
        </Head>
        <div>
        <Header />
        <main className={styles.container}>
            <h1>Novo produto</h1>

            <form className={styles.form}>
        

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

            
            <select>
                <option>
                    Bebidas
                </option>
            </select>

            <input type="text"
            placeholder="Digite o nome do produto"
            className={styles.input}
            />

            <input type="text"
            placeholder="Preço do produto"
            className={styles.input}
            />

            <textarea  
            placeholder="Descreva seu produto"
            className={styles.input}
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
    return{
        props:{}
    }
} )