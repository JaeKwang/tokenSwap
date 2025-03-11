import { Table } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import LiquidityPoolABI from "../abis/LiquidityPool.json";

function CurrentLiquidity() {
  const [totalLiquidity, setTotalLiquidity] = useState("0");
  const [reserveA, setReserveA] = useState("0");
  const [reserveB, setReserveB] = useState("0");

  const fetchData = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
      const contract = new ethers.Contract(
        import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS, 
        LiquidityPoolABI, 
        provider
      );
      const res1 = await contract.reserveA();
      const res2 = await contract.reserveB();
      const res3 = await contract.totalSupply();
      setReserveA(ethers.formatEther(res1));
      setReserveB(ethers.formatEther(res2));
      setTotalLiquidity(ethers.formatEther(res3));
    } catch (error) {
      console.error("Error reading contract:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>총 공급량</Table.ColumnHeader>
          <Table.ColumnHeader>Ethereum</Table.ColumnHeader>
          <Table.ColumnHeader>Game Token</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>{totalLiquidity}</Table.Cell>
          <Table.Cell>{reserveA}</Table.Cell>
          <Table.Cell>{reserveB}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

export default CurrentLiquidity;