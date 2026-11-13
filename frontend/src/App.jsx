import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './paginas/Login'
import Feed from './paginas/Feed'
import Perfil from './paginas/Perfil'
import Configuracoes from './paginas/Configuracoes'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Feed />} />
      <Route path='/perfil' element={<Perfil />} />
      <Route path='/configuracoes' element={<Configuracoes />} />

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App