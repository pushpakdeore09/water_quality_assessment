import { useState } from 'react'
import Dashboard from './Dashboard';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Dashboard/>
    </>
  )
}

export default App
