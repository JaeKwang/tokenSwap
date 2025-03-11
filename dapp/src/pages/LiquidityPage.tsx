import { Box, Button, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "@/components/Layout";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CurrentLiquidity from "@/components/CurrentLiquidity";
import RemoveLiquidity from "@/components/RemoveLiquidity";

function LiquidityPage() {
  const { signer, tokenAContract, tokenBContract, liquidityPoolContract } = useOutletContext<OutletContext>();
  const [approveAmountA, setApproveAmountA] = useState<string>("0");
  const [approveAmountB, setApproveAmountB] = useState<string>("0");
  const [allowanceA, setAllowanceA] = useState<string>("0");
  const [allowanceB, setAllowanceB] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [balanceA, setBalanceA] = useState<string>("0");
  const [balanceB, setBalanceB] = useState<string>("0");
  
  useEffect(() => {
    if(!signer) {
      setAllowanceA("0");
      setAllowanceB("0");
      setBalanceA("0");
      setBalanceB("0");
    }
    allowance_A();
    allowance_B();
    getBalance();
  }, [signer, tokenAContract, tokenBContract])
  
  const getBalance = async () => {
    if (!signer || !tokenAContract || !tokenBContract) return;
    try {
      const res1 = await tokenAContract.balanceOf(
        signer.address
      );
      setBalanceA(ethers.formatEther(res1));

      const res2 = await tokenBContract.balanceOf(
        signer.address
      );
      setBalanceB(ethers.formatEther(res2));
    } catch (error) {
      console.error(error);
    }
  };

  const allowance_A = async () => {
    if (!signer || !tokenAContract ) return;
    try {
      const res = await tokenAContract.allowance(
        signer.address,
        import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS
      );
      setAllowanceA(ethers.formatEther(res));
    } catch (error) {
      console.error(error);
    }
  };

  const allowance_B = async () => {
    if (!signer || !tokenBContract ) return;
    try {
      const res = await tokenBContract.allowance(
        signer.address,
        import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS
      );
      setAllowanceB(ethers.formatEther(res));
    } catch (error) {
      console.error(error);
    }
  };


  const approveA = async () => {
    if(isNaN(Number(approveAmountA)) || Number(approveAmountA) === 0) return;
    
    try {
      setIsLoading(true)
      const tx = await tokenAContract?.approve(
        import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS,
        ethers.parseUnits(approveAmountA, 18)
      );
      await tx.wait();
      allowance_A();
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false);
      setApproveAmountA('0');
    }
  }

  const approveB = async () => {
    if(isNaN(Number(approveAmountB)) || Number(approveAmountB) === 0) return;
    
    try {
      setIsLoading(true)
      const tx = await tokenBContract?.approve(
        import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS,
        ethers.parseUnits(approveAmountB, 18)
      );
      await tx.wait();
      allowance_B();
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false);
      setApproveAmountB('0');
    }
  }

  const addLiquidity = async () => {  
      if (
        !signer ||
        !liquidityPoolContract ||
        isNaN(Number(allowanceA)) ||
        isNaN(Number(allowanceB))
      ) {
        return;
      }
  
      try {
        setIsLoading(true);
        setIsLoading2(true);
  
        const tx = await liquidityPoolContract.addLiquidity(
          ethers.parseUnits(allowanceA, 18),
          ethers.parseUnits(allowanceB, 18)
        );
  
        await tx.wait();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsLoading2(false);

        allowance_A();
        allowance_B();
        getBalance();
      }
    };

  return (
    <Flex direction={"column"} justify={"center"} justifyItems={"center"} gap={4} p={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap="4" justifyItems={"center"}>
        <Flex alignItems={"center"} justify={"center"}>
          <Text>보유</Text>
          <Image src="/ether.png" w="8" />
          <Text>{balanceA}</Text>
        </Flex>
        <Flex alignItems={"center"} justify={"center"}>
          <Text>보유</Text>
          <Image src="/rifty.png" w="8" />
          <Text>{balanceB}</Text>
        </Flex>
          <Input
            type="number"
            colorPalette="purple"
            value={approveAmountA}
            onChange={(e) => setApproveAmountA(e.target.value)}
            disabled={isLoading}
          />
          <Input
            type="number"
            colorPalette="purple"
            value={approveAmountB}
            onChange={(e) => setApproveAmountB(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            loading={isLoading}
            colorPalette="purple"
            disabled={!signer}
            onClick={() => approveA()}
          >
            LP 승인
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            colorPalette="purple"
            disabled={!signer}
            onClick={() => approveB()}
          >
            LP 승인
          </Button>
          <Flex alignItems={"center"} justify={"center"}>
            <Text>승인된</Text>
            <Image src="/ether.png" w="8" />
            <Text>{allowanceA}</Text>
          </Flex>
          <Flex alignItems={"center"} justify={"center"}>
            <Text>승인된</Text>
            <Image src="/rifty.png" w="8" />
            <Text>{allowanceB}</Text>
          </Flex>
      </Grid>
      <Box>
        <Flex gap={4} justify={"center"} mb={4}>          
          <Button
            type="submit"
            loading={isLoading && isLoading2}
            colorPalette="purple"
            disabled={!signer || (Number(allowanceA) === 0 || Number(allowanceB) === 0)}
            onClick={() => addLiquidity()}
          >
            LP 제공
          </Button>
        </Flex>
        <RemoveLiquidity signer={signer} liquidityPoolContract={liquidityPoolContract} />
      </Box>
    </Flex>
  )
}

export default LiquidityPage
