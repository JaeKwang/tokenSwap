import { Avatar, Box, Button, Flex, MenuItem} from "@chakra-ui/react";
import {MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { Icon } from "@chakra-ui/react";
import { FiAlignJustify } from "react-icons/fi";
import MenuButton from "./MenuButton";
import MetamaskButton from "./MetamaskButton";
import { Dispatch, SetStateAction } from "react";
import { JsonRpcSigner } from "ethers";
import { Toaster, toaster } from "@/components/ui/toaster"
import { MdContentCopy } from "react-icons/md";

interface HeaderProps {
    signer: JsonRpcSigner | null;
    setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

function Header({signer, setSigner}: HeaderProps) {

    const handleCopyClipBoard = async (text: string) => {
        try {
          await navigator.clipboard.writeText(text);
          toaster.create({
            description: "클립보드에 복사가 되었습니다",
            type: "info",
          })
  
        } catch (error) {
            toaster.create({
                description: "클립보드 복사에 실패하였습니다",
                type: "error",
            })
        }
      };

    return <Box as="header" bgColor="purple.100" p={4}>
        <Toaster />
        <Flex
            justifyContent="space-between"
            alignItems="center"
            maxW={1024}
            mx="auto"
        >
            <MenuRoot>
                <MenuTrigger asChild>
                    <Button size="sm" variant="surface" colorPalette="purple">
                        <Icon>
                            <FiAlignJustify />
                        </Icon>
                    </Button>
                </MenuTrigger>
                <MenuContent>
                    <MenuButton name="💰 Swap Token" href="/"/>
                    <MenuButton name="🏛️ Liquidity Pool" href="/liquidity"/>
                </MenuContent>
            </MenuRoot>
            <Box fontSize="2xl" fontWeight="semibold" color="gray.600">
              My Token Swap
            </Box>
            <Flex>
                {signer ? 
                <MenuRoot>
                    <MenuTrigger asChild>
                        <Button size="sm" variant="ghost" colorPalette="purple">
                            <Avatar.Root colorPalette="gray">
                                <Avatar.Fallback />
                            </Avatar.Root>
                        </Button>
                    </MenuTrigger>
                    <MenuContent>
                        <MenuItem
                            value={'ava'}
                            _hover={{
                                bgColor: "purple.100"
                            }}
                            onClick={() => handleCopyClipBoard(signer.address)}
                        >
                            <Flex alignItems={"center"}>
                                <Box>
                                    🦊 {signer.address.substring(0, 7)}
                                    ...
                                    {signer.address.substring(signer.address.length - 5)}
                                </Box>
                                <MdContentCopy />
                            </Flex>
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
                : <></>
                }
                <MetamaskButton signer={signer} setSigner={setSigner}/>
            </Flex>
        </Flex>
    </Box>;
  }
  
  export default Header;