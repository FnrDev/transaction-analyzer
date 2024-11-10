export type Transaction = {
  date: string
  amount: number
  description: string
  type: string
}

export type ProcessedData = {
  top10Credits: Transaction[]
  top10Debits: Transaction[]
  totalCredit: number
  totalDebit: number
  transactions: Transaction[]
}

export type ExcelRow = [number, number, number, number, string, number] 