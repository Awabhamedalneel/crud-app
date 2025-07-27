import { useState } from 'react'
import Users from './users' 
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import CreateUser from './createuser'
import UpdateUser from './updateuser'


function App() {
  const [count, setCount] = useState(0)

  return (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users/>} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/update/:id" element={<UpdateUser />} />
       </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App
