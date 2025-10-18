import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './assets/components/landingPage'
import About from './assets/components/About'



function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage />}/>
       <Route path='/about' element={<About />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
