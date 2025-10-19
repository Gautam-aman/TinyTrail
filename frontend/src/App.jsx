import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './assets/components/landingPage'
import About from './assets/components/About'
import Register from './assets/components/Register'



function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage />}/>
       <Route path='/about' element={<About />}/>
       <Route path='/register' element={<Register />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
