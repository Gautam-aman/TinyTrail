import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './assets/components/landingPage'
import About from './assets/components/About'
import Register from './assets/components/Register'
import Dashboard from './assets/components/Dashboard'



function App() {

 

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage />}/>
       <Route path='/about' element={<About />}/>
       <Route path='/register' element={<Register />}/>
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
