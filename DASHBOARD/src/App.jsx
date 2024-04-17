import React, { useContext, useEffect } from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Dashboard from './components/Dashboard'
import Messages from './components/Messages'
import AddNewDoctor from './components/AddNewDoctor'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Doctor from './components/Doctor'
import AddNewAdmin from './components/AddNewAdmin'
import './App.css'

 
//setting react toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { Context } from './main'
 
const App = () => { 
  const {isAuthenticated,setIsAuthenticated,setUser} =   useContext(Context)
  
  useEffect(()=>{
    // first get the admin details 
    const fetchUser = async()=>{
      try{
        // ye request only ek loginned patient hi kr payega
        console.log("Trying to fetch admin details ")
        const response = await axios.get("http://localhost:4000/api/v1/user/admin/me",{withCredentials:true});
        setIsAuthenticated(true)
        setUser(response.data.user);
      }
      catch(err)
      {
        setIsAuthenticated(false);
        setUser({});
        console.log(err)
      }
 
    };
    fetchUser();
   
  },[isAuthenticated])


  return (
    <>
    <Router>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/doctor/addnew' element={<AddNewDoctor/>} />
        <Route path='/admin/addnew' element={<AddNewAdmin/>} />
        <Route path='/messages' element={<Messages/>} />
        <Route path='/doctors' element={<Doctor/>} />
      </Routes>
      <ToastContainer position='top-center'/>
    </Router>

    </>
  )
}

export default App