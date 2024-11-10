import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Transaction, ProcessedData } from "@/types/transactions"

interface TransactionResultsProps {
  data: ProcessedData
}

export function TransactionResults({ data }: TransactionResultsProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <TotalCard title="Total Credit (Received)" amount={data.totalCredit} type="credit" />
        <TotalCard title="Total Debit (Paid)" amount={data.totalDebit} type="debit" />
      </div>

      <TransactionTable
        title="Top 10 Credit Transactions"
        transactions={data.top10Credits}
        type="credit"
      />
      <TransactionTable
        title="Top 10 Debit Transactions"
        transactions={data.top10Debits}
        type="debit"
      />
    </section>
  )
}

function TotalCard({ title, amount, type }: { title: string; amount: number; type: 'credit' | 'debit' }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
          {amount.toFixed(2)} BHD
        </p>
      </CardContent>
    </Card>
  )
}

function TransactionTable({ 
  title, 
  transactions, 
  type 
}: { 
  title: string; 
  transactions: Transaction[]; 
  type: 'credit' | 'debit' 
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className={type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                {transaction.amount.toFixed(2)} BHD
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 