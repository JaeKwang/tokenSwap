import { Box, Button, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "@/components/Layout";
import { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import CurrentLiquidity from "@/components/CurrentLiquidity";
import RemoveLiquidity from "@/components/RemoveLiquidity";

function MintPage() {
    const { signer, tokenAContract, tokenBContract, liquidityPoolContract } = useOutletContext<OutletContext>();

    const [balanceA, setBalanceA] = useState<string>("0");
    const [balanceB, setBalanceB] = useState<string>("0");
    const [mintAmountA, setMintAmountA] = useState<string>("0");
    const [mintAmountB, setMintAmountB] = useState<string>("0");
    
    useEffect(() => {
        if(!signer || !tokenAContract || !tokenBContract) return;
        getBalance();
    }, [tokenAContract, tokenBContract])
    
    const getBalance = async () => {
        if(!signer || !tokenAContract || !tokenBContract) return;
        
        try{
            const res1 = await tokenAContract?.balanceOf(
                signer.address
            );
            const res2 = await tokenBContract?.balanceOf(
                signer.address
            );

            setBalanceA(ethers.formatUnits(res1))
            setBalanceB(ethers.formatUnits(res2))
            
        } catch (err) {
            console.log(err);
        }
    }

    const mintA = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!signer || !tokenAContract) return;
        try{
            const res = await tokenAContract?.mint(
                signer.address
            );
            setBalanceB(ethers.formatUnits(res))
            
        } catch (err) {
            console.log(err);
        } finally {
            setMintAmountA('0')
        }
    }
    
    const mintB = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!signer || !tokenBContract) return;

    }

    return (
        <Flex m={8} justify={"space-evenly"}>
            <Box bgColor={"purple.100"} rounded={"xl"} p={4}>
                <form onSubmit={mintA}>
                    <Flex direction="column" alignItems={"center"} justify={"center"} gap={4}>
                        <Flex alignItems={"center"} justify={"center"}>
                            <Text>보유</Text>
                            <Image src="/ether.png" w="8" />
                            <Text>{Number(balanceA).toFixed()}</Text>
                        </Flex>
                        <Input 
                            type="number"
                            textAlign={"center"}
                            value={mintAmountA}
                            onChange={(e) => setMintAmountA(e.target.value)}
                        />
                        <Button type="submit" colorPalette={"purple"} disabled={!signer}>
                            Mint
                        </Button>
                    </Flex>
                </form>
            </Box>
            <Box bgColor={"purple.100"} rounded={"xl"} p={4}>
                <form onSubmit={mintB}>
                    <Flex direction="column" alignItems={"center"} justify={"center"} gap={4}>
                        <Flex alignItems={"center"} justify={"center"}>
                            <Text>보유</Text>
                            <Image src="/rifty.png" w="8" />
                            <Text>{Number(balanceB).toFixed()}</Text>
                        </Flex>
                        <Input 
                            type="number"
                            textAlign={"center"}
                            value={mintAmountB}
                            onChange={(e) => setMintAmountB(e.target.value)}
                        />
                        <Button type="submit" colorPalette={"purple"} disabled={!signer}>
                            Mint
                        </Button>
                    </Flex>   
                </form>
            </Box>
        </Flex>
    );
}

export default MintPage
