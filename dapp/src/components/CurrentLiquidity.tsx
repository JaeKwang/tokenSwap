import { Table } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { useEffect, useState } from "react";

interface CurrentLiquidityProps {
  liquidityPoolContract: Contract | null;
}

function CurrentLiquidity({ liquidityPoolContract }: CurrentLiquidityProps) {
  const [totalLiquidity, setTotalLiquidity] = useState("0");
  const [reserveA, setReserveA] = useState("0");
  const [reserveB, setReserveB] = useState("0");

  const getTotalLiquidity = async () => {
    if (!liquidityPoolContract) return;

    try {
      const res = await liquidityPoolContract.totalSupply();

      setTotalLiquidity(ethers.formatEther(res));
    } catch (error) {
      console.error(error);
    }
  };

  const getReserves = async () => {
    if (!liquidityPoolContract) return;

    try {
      const res1 = await liquidityPoolContract.reserveA();
      const res2 = await liquidityPoolContract.reserveB();
      setReserveA(ethers.formatEther(res1));
      setReserveB(ethers.formatEther(res2));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalLiquidity();
    getReserves();
  }, [liquidityPoolContract]);

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