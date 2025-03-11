import { Box, Button, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "@/components/Layout";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CurrentLiquidity from "@/components/CurrentLiquidity";
import RemoveLiquidity from "@/components/RemoveLiquidity";

function MintPage() {
    const { signer, tokenAContract, tokenBContract, liquidityPoolContract } = useOutletContext<OutletContext>();

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

    return (
        <>asd</>
    );
}

export default MintPage
