import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserDirectory from './UserDirectory'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <UserDirectory></UserDirectory>
    </>
  )
}

export default App
