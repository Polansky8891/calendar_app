import { Navigate, Route, Routes } from "react-router"
import { CalendarPage } from "../calendar/pages/CalendarPage";
import { LoginPage } from "../auth/pages/LoginPage";
import { getEnvVariables } from "../helpers/getEnvVariables";
import { useAuthStore } from "../hooks/useAuthStore";
import { useEffect } from "react";



const AppRouter = () => {

  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  
  }, [])
  

  if ( status === 'checking' ) {
    return (
      <h3>Cargando...</h3>
    )
  }

  //const authStatus = 'not-authenticated';

  return (
    <Routes>
        {
            (status === 'not-authenticated')
            ? (
                <>
                  <Route path='/auth/*' element={ <LoginPage /> } />
                  <Route path='/*' element={ <Navigate to='/auth/login' />} />
                </>
            ) 
            : (
                <>
                  <Route path='/' element={ <CalendarPage /> } />
                  <Route path='/*' element={ <Navigate to='/' />} />

                
                </>


            )
        } 

        

    </Routes>
  )
}

export default AppRouter