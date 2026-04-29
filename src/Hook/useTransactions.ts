import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Transaction, TransactionService, TransactionSummary } from '@/database/TransactionService';

export function useTransactions(userId: number | undefined) {
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState<TransactionSummary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); 
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [totalBalance, dataForChart, allTransactions] = await Promise.all([
        TransactionService.getTotalBalance(userId),
        TransactionService.getDataForChart(userId),
        TransactionService.getTransactions(userId),
      ]);
      setBalance(totalBalance);
      setChartData(dataForChart);
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  return { balance, chartData, transactions, loading, refresh: fetchData };
  
}
