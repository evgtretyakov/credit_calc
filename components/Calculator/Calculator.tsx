'use client'

import { useState, useEffect } from 'react'
import InputSection from './InputSection'
import ResultsTable from './ResultsTable'
import Assistant from './Assistant'
import StatementModal from '../Statement/StatementModal'
import styles from './Calculator.module.scss'

export default function Calculator() {
  // Данные по кредиту
  const [principal, setPrincipal] = useState<number>(678000) // Сумма основного долга
  const [interestRate, setInterestRate] = useState<number>(27.9) // % ставка по кредиту
  const [penalty, setPenalty] = useState<number>(1.0) // Сумма неустоек
  const [remainingTerm, setRemainingTerm] = useState<number>(60) // Срок кредитного договора (оставшийся)

  // Данные реструктуризации
  const [defermentMonths, setDefermentMonths] = useState<number>(5) // Отсрочка (мес.)
  const [minRepaymentPercent, setMinRepaymentPercent] = useState<number>(10) // Минимальный размер погашения (%)
  const [salaryTransfer, setSalaryTransfer] = useState<boolean>(false) // Галочка "перевести ЗП в Сбер"
  const [hasEnforcement, setHasEnforcement] = useState<boolean>(false) // Наличие возбужденных производств у пристава

  // Результаты расчета
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([])
  const [isStatementModalOpen, setIsStatementModalOpen] = useState<boolean>(false)

  // Расчет платежей
  useEffect(() => {
    calculateSchedule()
  }, [principal, interestRate, penalty, remainingTerm, defermentMonths, minRepaymentPercent, salaryTransfer])

  const calculateSchedule = () => {
    const schedule = []
    let balance = principal
    const monthlyRate = interestRate / 100 / 12
    const totalMonths = remainingTerm + defermentMonths
    const adjustedRate = salaryTransfer ? monthlyRate - 0.005 / 12 : monthlyRate // снижение ставки на 0.5% годовых

    for (let month = 1; month <= totalMonths; month++) {
      const interest = balance * adjustedRate
      let principalPayment = 0
      let totalPayment = 0

      if (month <= defermentMonths) {
        // период отсрочки
        principalPayment = 0
        totalPayment = interest
      } else {
        // после отсрочки
        const remainingAfterDefer = totalMonths - defermentMonths
        principalPayment = balance / remainingAfterDefer
        totalPayment = interest + principalPayment
        // применяем минимальный размер погашения
        if (minRepaymentPercent > 0) {
          const minPrincipal = balance * (minRepaymentPercent / 100)
          if (principalPayment < minPrincipal) {
            principalPayment = minPrincipal
            totalPayment = interest + principalPayment
          }
        }
      }

      balance -= principalPayment
      if (balance < 0) balance = 0

      const totalWithPenalty = totalPayment + (penalty / totalMonths)

      schedule.push({
        month,
        interest: Math.round(interest),
        principal: Math.round(principalPayment),
        total: Math.round(totalPayment),
        balance: Math.round(balance),
        totalWithPenalty: Math.round(totalWithPenalty),
      })
    }

    setPaymentSchedule(schedule)
  }

  const handleReset = () => {
    setPrincipal(678000)
    setInterestRate(27.9)
    setPenalty(1.0)
    setRemainingTerm(60)
    setDefermentMonths(5)
    setMinRepaymentPercent(10)
    setSalaryTransfer(false)
    setHasEnforcement(false)
  }

  const openStatementModal = () => {
    setIsStatementModalOpen(true)
  }

  const closeStatementModal = () => {
    setIsStatementModalOpen(false)
  }

  // Вычисляем средний платеж после отсрочки
  const averagePaymentAfterDeferral = paymentSchedule.length > 0
    ? Math.round(
        paymentSchedule
          .filter(item => item.month > defermentMonths)
          .reduce((sum, item) => sum + item.total, 0) /
        Math.max(1, paymentSchedule.length - defermentMonths)
      )
    : 0

  return (
    <div className={styles.calculator}>
      <div className={styles.grid}>
        <div className={styles.leftPanel}>
          <InputSection
            principal={principal}
            setPrincipal={setPrincipal}
            interestRate={interestRate}
            setInterestRate={setInterestRate}
            penalty={penalty}
            setPenalty={setPenalty}
            remainingTerm={remainingTerm}
            setRemainingTerm={setRemainingTerm}
            defermentMonths={defermentMonths}
            setDefermentMonths={setDefermentMonths}
            minRepaymentPercent={minRepaymentPercent}
            setMinRepaymentPercent={setMinRepaymentPercent}
            salaryTransfer={salaryTransfer}
            setSalaryTransfer={setSalaryTransfer}
            hasEnforcement={hasEnforcement}
            setHasEnforcement={setHasEnforcement}
            onReset={handleReset}
          />
          <Assistant
            salary={70000}
            hasEnforcement={hasEnforcement}
            livingMinimum={15000}
            otherPayments={5000}
          />
        </div>
        <div className={styles.rightPanel}>
          <ResultsTable schedule={paymentSchedule} />
          <div className={styles.actions}>
            <button className={styles.buttonPrimary} onClick={openStatementModal}>
              Сформировать заявление на реструктуризацию
            </button>
            <button className={styles.buttonSecondary}>Сохранить расчет</button>
          </div>
        </div>
      </div>

      <StatementModal
        isOpen={isStatementModalOpen}
        onClose={closeStatementModal}
        data={{
          principal,
          interestRate,
          remainingTerm,
          defermentMonths,
          minRepaymentPercent,
          salaryTransfer,
          totalPayment: averagePaymentAfterDeferral,
        }}
      />
    </div>
  )
}