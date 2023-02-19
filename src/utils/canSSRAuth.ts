import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies , destroyCookie} from 'nookies'
import {AuthTokenError} from '../services/errors/AuthTokenError'


//função para paginas só user logados pode ter acesso;

export function canSSRauth<P>(fn:GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> =>{
        //Pegando o cookies
        const cookies = parseCookies(ctx);
        //Pegando o token de dentro do cookies
        const token = cookies['@nextauth.token'];

        //Verificando se ele não tem token e se não tiver redirecionar para o login
        if(!token){
            return{
                redirect:{
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try{
        return await fn(ctx);
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@nextauth.token');
                return{
                    redirect:{
                        destination:'/',
                        permanent: false
                    }
                }
            }
        }
    }
}