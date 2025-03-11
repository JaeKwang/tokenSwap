import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { useEffect, useState } from "react";

interface RemoveLiquidityProps {
    signer: JsonRpcSigner | null;
    liquidityPoolContract: Contract | null;
  }

function RemoveLiquidity({signer, liquidityPoolContract} : RemoveLiquidityProps) {

    const [LPTokenBalance, setLPTokenBalance] = useState<string>('0');
    const [removeAmount, setRemoveAmount] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
        const getLPToken = async () => {
            if (!liquidityPoolContract) return;
    
            try {
                const res = await liquidityPoolContract.balanceOf(
                    signer?.address
                );
                setLPTokenBalance(ethers.formatEther(res));
            } catch (error) {
                console.error(error);
            }
        };
        
        if(!signer){
            setIsValid(false);
            setRemoveAmount('')
            return;
        }
        getLPToken();
    }, [signer, liquidityPoolContract]);
    
    useEffect(() => {
        if(!isNaN(Number(removeAmount)) 
            && !isNaN(Number(LPTokenBalance))
            && Number(removeAmount) > 0
            && Number(removeAmount) <= Number(LPTokenBalance)
            && !!signer
        ) {
            setIsValid(true)
        } else setIsValid(false);
        
    }, [removeAmount])
    const removeLiquidity = async () => {

    }

    return (
        <form onSubmit={removeLiquidity}>
            <Flex>
                <Input 
                    placeholder={`보유 LP 토큰: ${LPTokenBalance}`}
                    value={removeAmount}
                    onChange={(e) => setRemoveAmount(e.target.value)}
                />
                <Button disabled={!isValid} colorPalette='purple'>
                    LP 환수
                </Button>
            </Flex>
        </form>
    )
}

export default RemoveLiquidity;