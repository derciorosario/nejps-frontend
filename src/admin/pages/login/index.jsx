import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import ButtonLoader from '../../components/Loaders/button';
import { useData } from '../../../contexts/DataContext';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const data=useData()

   const handleLogin = async () => {
   if(loading) return

   toast.remove()

    if(!email || !password){
       toast.remove()
       toast.error('Preencha todos os campos!')
       return
    }

    if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))){
     toast.error('Email inválido')
     setLoading(false)
     return
   }

    setLoading(true)

     try {
       const response = await axios.post(`${data.APP_BASE_URL}/login`, {
         email,
         password
       });

       localStorage.setItem('token',response.data.token);
       setLoading(false)
       toast.remove()
       toast.success('Autenticado com sucesso!')
       window.location.href="/dashboard";

   } catch (e) {

     let msg="Acorreu um erro, tente novamente"
     console.log(e)
     setLoading(false)

     if(e.response){
       if(e.response.status==404){
           msg="Usuário não encotrado"
       }
       if(e.response.status==401){
         msg="Senha incorreta"
       }
       if(e.response.status==423){
         msg="Usuário não associado a microcrédito activa"
     }
       if(e.response.status==400){
           msg="Dados inválidos"
       }
       if(e.response.status==500){
           msg="Erro, inesperado. Contacte seu administrador"
       }

     }else if(e.code=='ERR_NETWORK'){
           msg="Verfique sua internet e tente novamente"
     }

     toast.error(msg)
     setLoading(false)
   }
};



  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Login
            </h1>
            <div className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Seu email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                  Senha
                </label>
                <input
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>
              
              <div className="flex justify-center relative">
                <button
                    onClick={handleLogin}
                    type="submit"
                    className="w-full cursor-pointer text-white bg-rose-700  focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    <label className={`${loading ? 'opacity-0':''} cursor-pointer`}>Entrar</label>
                </button>
                {loading && <div className="absolute cursor-pointer w-full h-full left-0 top-0 flex justify-center items-center">
                        <ButtonLoader/>
                </div>}
                
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
