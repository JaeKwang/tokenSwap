import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { Contract } from "ethers";

interface ApproveTokenProps {
    name: string;
    imageSrc: string;
    tokenContract: Contract | null;
    signer: JsonRpcSigner | null;
}

function ApproveToken({name, imageSrc, tokenContract, signer}: ApproveTokenProps) {
  const [approveAmount, setApproveAmount] = useState<string>("0");
  const [IsLoading, setIsLoading] = useState(false);

  const approve = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(isNaN(Number(approveAmount)) || Number(approveAmount) == 0) return;

    try {
      setIsLoading(true)
      const tx = await tokenContract?.approve(
        import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS,
        ethers.parseUnits(approveAmount, 18)
      );
      await tx.wait();
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex direction="column" spaceY={4} mt={8}>
      <form onSubmit={approve}>
        <Flex gap={4}>
          <Input
            colorPalette="purple"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
            disabled={IsLoading}
          />
          <Button type="submit" disabled={!signer} loading={IsLoading} colorPalette="purple">{name}</Button>
        </Flex>
      </form>
    </Flex>
  )
}

export default ApproveToken
