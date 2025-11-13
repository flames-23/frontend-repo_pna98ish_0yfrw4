import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import KnowFlow from './components/KnowFlow'
import DiscoverFlow from './components/DiscoverFlow'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/know" element={<KnowFlow />} />
      <Route path="/discover" element={<DiscoverFlow />} />
    </Routes>
  )
}

export default App
