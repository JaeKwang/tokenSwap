import { OutletContext } from "@/components/Layout";
import { SwapToken } from "@/components/SwapToken";
import { Box } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";

function SwapPage() {
  const { signer, tokenAContract, tokenBContract, liquidityPoolContract } = useOutletContext<OutletContext>();

  return <Box p={4}>
    <SwapToken
      signer={signer}
      tokenAContract={tokenAContract}
      tokenBContract={tokenBContract}
      liquidityPoolContract={liquidityPoolContract}
    />
  </Box>;
}

export default SwapPage;