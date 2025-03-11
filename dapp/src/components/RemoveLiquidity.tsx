import { Button, Flex, Input } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { FormEvent, useEffect, useState } from "react";

interface RemoveLiquidityProps {
    signer: JsonRpcSigner | null;
    liquidityPoolContract: Contract | null;
}

function RemoveLiquidity({signer, liquidityPoolContract} : RemoveLiquidityProps) {

    const [LPTokenBalance, setLPTokenBalance] = useState<string>('0');
    const [removeAmount, setRemoveAmount] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
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

    const removeLiquidity = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!signer || !liquidityPoolContract || isNaN(Number(removeAmount))) {
          return;
        }
    
        try {
          setIsLoading(true);    
          const tx = await liquidityPoolContract.removeLiquidity(
            ethers.parseUnits(removeAmount, 18)
          );
          await tx.wait();
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
          setRemoveAmount('');
        }
    };
    
    return (
        <form onSubmit={removeLiquidity}>
            <Flex>
                <Input 
                    placeholder={`보유 LP 토큰: ${LPTokenBalance}`}
                    value={removeAmount}
                    onChange={(e) => setRemoveAmount(e.target.value)}
                />
                <Button
                    type="submit"
                    disabled={!isValid}
                    colorPalette='purple'
                    loading={isLoading}
                >
                    LP 환수
                </Button>
            </Flex>
        </form>
    )
}

export default RemoveLiquidity;