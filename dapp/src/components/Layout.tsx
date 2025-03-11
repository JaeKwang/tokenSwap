import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@chakra-ui/react";
import { ethers, JsonRpcSigner, Contract} from "ethers";
import { useEffect, useState } from "react";
import TokenMakerABI from "../abis/TokenMaker.json";
import LiquidityPoolABI from "../abis/LiquidityPool.json";
import CurrentLiquidity from "./CurrentLiquidity";

export interface OutletContext {
  tokenAContract: Contract | null;
  tokenABontract: Contract | null;
  liquidityPoolContract: Contract | null;
  signer: JsonRpcSigner | null;
}

function Layout() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [tokenAContract, setTokenAContract] = useState<Contract | null>(null);
  const [tokenBContract, setTokenBContract] = useState<Contract | null>(null);
  const [liquidityPoolContract, setLiquidityPoolContract] = useState<Contract | null>(null);
  
  useEffect(() => {
    if(!signer) return;

    setTokenAContract(new ethers.Contract(
      import.meta.env.VITE_TOKEN_A_ADDRESS,
      TokenMakerABI,
      signer
    ));

    setTokenBContract(new ethers.Contract(
      import.meta.env.VITE_TOKEN_B_ADDRESS,
      TokenMakerABI,
      signer
    ));

    setLiquidityPoolContract(new ethers.Contract(
      import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS,
      LiquidityPoolABI,
      signer
    ));

  }, [signer])


  return (
    <>
      <Header signer={signer} setSigner={setSigner}/>
      <Box as="main" maxW={1024} mx="auto">
        <CurrentLiquidity liquidityPoolContract={liquidityPoolContract}/>
        <Outlet context={{ tokenAContract, tokenBContract, liquidityPoolContract, signer }} />
      </Box>
    </>
  );
}

export default Layout;