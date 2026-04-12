import Navbar from '../Common/Navbar.jsx'
import Footer from '../Common/Footer.jsx'
import { Outlet } from 'react-router-dom'
import Watsapp from '../Common/Watsapp.jsx'

const UserLayout = () => {
  return (
    <>
    <Navbar/>
  <main className='mt-12 md:mt-20'>
    <Outlet/>
  </main>
    <Watsapp/>

    <Footer/>
    </>
  )
}

export default UserLayout