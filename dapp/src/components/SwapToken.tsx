import { Box, Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { FormEvent, useEffect, useState } from "react";
import { JsonRpcSigner, Contract, ethers } from "ethers";

interface SwapTokenProps {
    signer: JsonRpcSigner | null;
    tokenAContract: Contract | null;
    tokenBContract: Contract | null;
    liquidityPoolContract: Contract | null;
}

export function SwapToken({signer, tokenAContract, tokenBContract, liquidityPoolContract} : SwapTokenProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isReverse, setIsReverse] = useState(false);
    const [tokenA, setTokenA] = useState<string>("0");
    const [tokenB, setTokenB] = useState<string>("0");
    const [allowanceA, setAllowanceA] = useState<string>("0");
    const [allowanceB, setAllowanceB] = useState<string>("0");
    
    const handleChangeButton = () => {
        setIsReverse(!isReverse);
        setTokenA("0");
        setTokenB("0");
    }

    const handleTokenA = (v: string) => {
        setTokenA(v);
    }

    const handleTokenB = (v: string) => {
        setTokenB(v);
    }

    const swapToken = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (
          !signer ||
          !liquidityPoolContract ||
          isNaN(Number(tokenA)) ||
          Number(tokenA) === 0 ||
          isNaN(Number(tokenB)) ||
          Number(tokenB) === 0
        ) {
          return;
        }
    
        try {
            setIsLoading(true);
          if (!isReverse) {
            const tx = await liquidityPoolContract.swapAForB(
              ethers.parseUnits(tokenA, 18),
              ethers.parseUnits(tokenB, 18)
            );
    
            const res = await tx.wait();
    
            console.log(res);
            } else {
            const tx = await liquidityPoolContract.swapBForA(
              ethers.parseUnits(tokenB, 18),
              ethers.parseUnits(tokenA, 18)
            );
    
            const res = await tx.wait();
    
            console.log(res);
          }
        } catch (error) {
          console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(isNaN(Number(tokenA)) || Number(tokenA) === 0 || isReverse) return;
        getInputPrice();
    }, [tokenA])

    useEffect(() => {
        if(isNaN(Number(tokenB)) || Number(tokenB) === 0 || !isReverse) return;
        getInputPrice();
    }, [tokenB])

    useEffect(() => {
        if(!signer || !tokenAContract || !tokenBContract) return;
        getAllowance();
    }, [tokenAContract, tokenBContract])
    
    const getAllowance = async () => {
        if(!signer || !tokenAContract || !tokenBContract) return;
        
        try{
            const res1 = await tokenAContract?.allowance(
                signer.address,
                import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS
            );
            const res2 = await tokenBContract?.allowance(
                signer.address,
                import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS
            );

            setAllowanceA(ethers.formatUnits(res1))
            setAllowanceB(ethers.formatUnits(res2))
            
        } catch (err) {
            console.log(err);
        }
    }

    const getInputPrice = async () => {
        if(!signer || !liquidityPoolContract) return;

        try{
            const reserveA = await liquidityPoolContract?.reserveA();
            const reserveB = await liquidityPoolContract?.reserveB();

            if(!isReverse) {
                const res = await liquidityPoolContract?.getInputPrice(
                    ethers.parseUnits(tokenA, 18),
                    reserveA,
                    reserveB
                )
                setTokenB(ethers.formatEther(res));
            } else {
                const res = await liquidityPoolContract?.getInputPrice(
                    ethers.parseUnits(tokenB, 18),
                    reserveB,
                    reserveA
                )
                setTokenA(ethers.formatEther(res));
            }
        } catch (err) {
            console.log(err);
        }
    }

    return <Flex direction={"column"} justify={"center"} justifyItems={"center"} gap={6} p={4}>
        <form onSubmit={(e) => swapToken(e)}>
            <Flex flexDirection="column" gap={4} alignItems={'center'}>
                <Flex
                    flexDirection={isReverse ? "row-reverse" : "row"}
                    gap={4}
                    alignItems={"center"}
                    maxW={512}
                >
                    <Field label="Ethereum Token" bgColor={"gray.100"} p={4} rounded={"2xl"}>
                        <Text>Allowance: {allowanceA}</Text>
                        <Flex alignItems={"center"}>
                            <Input
                                type="number"
                                colorPalette="green"
                                disabled={isReverse}
                                value={tokenA}
                                onChange={(e) => handleTokenA(e.target.value)}
                                flex="1"
                            />
                            <Box rounded={"xl"} bgColor={"purple.300"} px={2} py={1}>
                                <Flex direction={"row"}>
                                    <Image src="/ether.png" w={6} />
                                    <Text>ETH</Text>
                                </Flex>
                            </Box>
                        </Flex>
                    </Field>
                <Button
                    bgColor={"purple.300"}
                    _hover={{
                        backgroundColor: "purple.400"
                    }}
                    size={"2xs"}
                    onClick={() => handleChangeButton()}
                >
                    <Image src="/change.png" w={4}/>
                </Button>
                <Field label="Rifty Token" bgColor={"gray.100"} p={4} rounded={"2xl"}>
                        <Text>Allowance: {allowanceB}</Text>
                        <Flex alignItems={"center"}>
                            <Input
                                type="number"
                                colorPalette="green"
                                disabled={!isReverse}
                                value={tokenB}
                                onChange={(e) => handleTokenB(e.target.value)}
                                flex="1"
                            />
                            <Box rounded={"xl"} bgColor={"purple.300"} px={2} py={1}>
                                <Flex direction={"row"}>
                                    <Image src="/rifty.png" w={6} />
                                    <Text>RFT</Text>
                                </Flex>
                            </Box>
                        </Flex>
                    </Field>
                </Flex>
                <Button 
                    type="submit"
                    disabled={!signer}
                    colorPalette="purple"
                    loading={isLoading}
                >
                    토큰 스왑
                </Button>
            </Flex>
        </form>
    </Flex>
  ;
}