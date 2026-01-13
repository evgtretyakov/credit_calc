import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.scss'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Калькулятор реструктуризации кредита',
  description: 'Примерный расчет платежа для клиента',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}