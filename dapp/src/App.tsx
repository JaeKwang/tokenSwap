import { BrowserRouter, Route, Routes } from "react-router-dom"

import Layout from "./components/Layout"

import SwapPage from "./pages/SwapPage"
import LiquidityPage from "./pages/LiquidityPage"
import MintPage from "./pages/MintPage"

function App() {
  return <BrowserRouter>
    <Routes>
      <Route>
        <Route element={<Layout />}>
          <Route path="/" element={<SwapPage />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
          <Route path="/mint" element={<MintPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
