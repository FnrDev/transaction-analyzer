'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/transaction-analyzer/FileUploader'
import { DateRangeSelector } from '@/components/transaction-analyzer/DateRangeSelector'
import { TransactionResults } from '@/components/transaction-analyzer/TransactionResults'
import { ProcessedData } from '@/types/transactions'
import { processExcelFile } from '@/app/lib/excel-processor'
import { withInRange } from '@/lib/utils'
import moment from 'moment'

export default function TransactionAnalyzerPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setFileUploaded(true)
    try {
      const data = await processExcelFile(file)
      setProcessedData(data)
    } catch (error) {
      console.error('Error processing file:', error)
      // Add error handling here
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredData = () => {
    if (!processedData || !startDate || !endDate) return processedData;

    const top10Credits = processedData.top10Credits.filter(transaction => 
      withInRange(moment(transaction.date), moment(startDate), moment(endDate))
    );

    const top10Debits = processedData.top10Debits.filter(transaction => 
      withInRange(moment(transaction.date), moment(startDate), moment(endDate))
    );

    // Calculate filtered totals
    const totalCredit = processedData.transactions
      .filter(t => t.type === 'credit' && withInRange(moment(t.date), moment(startDate), moment(endDate)))
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = Math.abs(
      processedData.transactions
      .filter(t => t.type === 'debit' && withInRange(moment(t.date), moment(startDate), moment(endDate)))
      .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      ...processedData,
      transactions: [...top10Credits, ...top10Debits],
      totalCredit,
      totalDebit
    };
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Transaction Analyzer</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {!fileUploaded && <FileUploader onFileUpload={handleFileUpload} />}
        
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-lg">Processing your file...</p>
          </div>
        )}

        {processedData && (
          <TransactionResults 
            data={getFilteredData() || processedData} 
          />
        )}
      </main>
    </div>
  )
}