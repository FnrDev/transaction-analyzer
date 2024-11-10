import * as XLSX from 'xlsx'
import { ExcelRow, ProcessedData, Transaction } from '@/types/transactions'
import { excelDateToJSDate, withInRange } from '@/lib/utils'
import moment from 'moment'

export async function processExcelFile(file: File): Promise<ProcessedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as ExcelRow[]
        resolve(processTransactionData(jsonData))
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function processTransactionData(
  data: ExcelRow[], 
  startDate?: string, 
  endDate?: string
): ProcessedData {
  const startDateTime = startDate ? new Date(startDate) : null;
  const endDateTime = endDate ? new Date(endDate) : null;

  let totalCredit = 0
  let totalDebit = 0
  const creditTransactions: Transaction[] = []
  const debitTransactions: Transaction[] = []
  const allTransactions: Transaction[] = []

  data.slice(1).forEach((row) => {
    const date = excelDateToJSDate(row[3])
    const amount = row[5]
    const description = row[4]

    const isWithinRange = !startDateTime || !endDateTime || 
      withInRange(date, moment(startDateTime), moment(endDateTime))

    if (isWithinRange) {
      const transaction = {
        date: date.format('YYYY-MM-DD'),
        amount: Math.abs(amount),
        description,
        type: amount < 0 ? 'debit' : 'credit'
      }

      allTransactions.push({ ...transaction, amount: amount })

      if (amount < 0) {
        debitTransactions.push(transaction)
        totalDebit += Math.abs(amount)
      } else {
        creditTransactions.push(transaction)
        totalCredit += amount
      }
    }
  })

  return {
    top10Credits: creditTransactions.sort((a, b) => b.amount - a.amount).slice(0, 10),
    top10Debits: debitTransactions.sort((a, b) => b.amount - a.amount).slice(0, 10),
    transactions: allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    totalCredit,
    totalDebit,
  }
} 