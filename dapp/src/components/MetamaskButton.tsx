import { Box, Button, DialogActionTrigger, Image } from "@chakra-ui/react";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";

interface MetamaskProps {
    signer: JsonRpcSigner | null;
    setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

function MetamaskButton({signer, setSigner}: MetamaskProps) {
    const [isOpen, setIsOpen] = useState(false);

    const loginMetaMask = async () => {
        if(!window.ethereum){
            setIsOpen(true);
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setSigner(await provider.getSigner());
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {signer 
            ? <Box w={40}>
                <Image
                    src="/logout.png"
                    objectFit="contain"
                    onClick={() => setSigner(null)}
                    _hover={{
                        transform: "scale(1.1)",  // 이미지 확대 효과
                        transition: "transform 0.2s ease-in-out",
                        opacity: 0.8,  // 약간 투명하게 변경
                    }}
                />
            </Box>
            : <Box w={40}>
                <Image
                    src="/metamask.png"
                    objectFit="contain"
                    onClick={() => loginMetaMask()}
                    _hover={{
                        transform: "scale(1.1)",  // 이미지 확대 효과
                        transition: "transform 0.2s ease-in-out",
                        opacity: 0.8,  // 약간 투명하게 변경
                    }}
                />
            </Box>
            }
            <DialogRoot open={isOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>MetaMask가 설치되어 있지 않습니다</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    </DialogBody>
                    <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button onClick={() => setIsOpen(false)}>
                            닫기
                        </Button>
                    </DialogActionTrigger>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        </>
        
    );
}

export default MetamaskButton;