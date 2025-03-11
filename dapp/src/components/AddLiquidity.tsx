import { Button, Flex, Input } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { FormEvent, useState } from "react";

interface AddLiquidityProps {
  signer: JsonRpcSigner | null;
  liquidityPoolContract: Contract | null;
}

function AddLiquidity({ signer, liquidityPoolContract }: AddLiquidityProps) {
  const [tokenAAmount, setTokenAAmount] = useState("0");
  const [tokenBAmount, setTokenBAmount] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const addLiquidity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !signer ||
      !liquidityPoolContract ||
      isNaN(Number(tokenAAmount)) ||
      isNaN(Number(tokenBAmount))
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const tx = await liquidityPoolContract.approve(
        ethers.parseUnits(tokenAAmount, 18),
        ethers.parseUnits(tokenBAmount, 18)
      );

      const res = await tx.wait();

      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex gap={4} justify={"center"} mt={4}>
      <Button
        type="submit"
        loading={isLoading}
        loadingText="로딩중"
        colorPalette="purple"
        disabled={!signer}
      >
        LP 승인
      </Button>
      <Button
        type="submit"
        loading={isLoading}
        loadingText="로딩중"
        colorPalette="purple"
        disabled={!signer}
      >
        LP 제공
      </Button>
    </Flex>
  );
}

export default AddLiquidity;