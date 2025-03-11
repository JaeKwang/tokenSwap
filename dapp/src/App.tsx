import { BrowserRouter, Route, Routes } from "react-router-dom"
import SwapPage from "./pages/SwapPage"
import LiquidityPage from "./pages/LiquidityPage"
import Layout from "./components/Layout"

function App() {
  return <BrowserRouter>
    <Routes>
      <Route>
        <Route element={<Layout />}>
          <Route path="/" element={<SwapPage />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
