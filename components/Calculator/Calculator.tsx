'use client'

import { useState, useEffect } from 'react'
import InputSection from './InputSection'
import ResultsTable from './ResultsTable'
import Assistant from './Assistant'
import StatementModal from '../Statement/StatementModal'
import styles from './Calculator.module.scss'
import { calculateSchedule, calculateAveragePaymentAfterDeferral, type ScheduleItem } from '@/utils/calculator'

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
  const [paymentSchedule, setPaymentSchedule] = useState<ScheduleItem[]>([])
  const [isStatementModalOpen, setIsStatementModalOpen] = useState<boolean>(false)

  // Расчет платежей
  useEffect(() => {
    const schedule = calculateSchedule({
      principal,
      interestRate,
      penalty,
      remainingTerm,
      defermentMonths,
      minRepaymentPercent,
      salaryTransfer,
    })
    setPaymentSchedule(schedule)
  }, [principal, interestRate, penalty, remainingTerm, defermentMonths, minRepaymentPercent, salaryTransfer])

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
  const averagePaymentAfterDeferral = calculateAveragePaymentAfterDeferral(paymentSchedule, defermentMonths)

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
