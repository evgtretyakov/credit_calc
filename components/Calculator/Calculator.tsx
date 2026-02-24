'use client'

import { useState, useEffect } from 'react'
import InputSection from './InputSection'
import ResultsTable from './ResultsTable'
import ComparisonBlock from './ComparisonBlock'
import ChartComponent from './ChartComponent'
import Assistant from './Assistant'
import StatementModal from '../Statement/StatementModal'
import styles from './Calculator.module.scss'
import {
  calculateSchedule,
  calculateAveragePaymentAfterDeferral,
  calculateAdvancedSchedule,
  type ScheduleItem,
  type CalculationScenario,
  type AdvancedCalculatorParams,
} from '@/utils/calculator'

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

  // Новые поля
  const [issueDate, setIssueDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState<string>('')
  const [principalDefermentMonths, setPrincipalDefermentMonths] = useState<number>(1)
  const [interestDefermentMonths, setInterestDefermentMonths] = useState<number>(1)
  const [termExtensionMonths, setTermExtensionMonths] = useState<number>(1)
  const [customTermActive, setCustomTermActive] = useState<boolean>(false)
  const [customTermMonths, setCustomTermMonths] = useState<number>(0)
  // Чекбоксы управления
  const [interestDefermentEnabled, setInterestDefermentEnabled] = useState<boolean>(true)
  const [termExtensionEnabled, setTermExtensionEnabled] = useState<boolean>(true)

  // Результаты расчета
  const [paymentSchedule, setPaymentSchedule] = useState<ScheduleItem[]>([])
  const [scenarios, setScenarios] = useState<CalculationScenario[]>([])
  const [isStatementModalOpen, setIsStatementModalOpen] = useState<boolean>(false)
  const [showChart, setShowChart] = useState<boolean>(false)

  // Расчет платежей (базовый график)
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

  // Расчет двух сценариев (базовый и с урегулированием)
  useEffect(() => {
    const advancedParams: AdvancedCalculatorParams = {
      principal,
      interestRate,
      penalty,
      remainingTerm,
      defermentMonths,
      minRepaymentPercent,
      salaryTransfer,
      issueDate,
      endDate,
      principalDefermentMonths,
      interestDefermentMonths,
      termExtensionMonths,
      customTermMonths,
      customTermActive,
    }
    const calculatedScenarios = calculateAdvancedSchedule(advancedParams)
    setScenarios(calculatedScenarios)
  }, [
    principal,
    interestRate,
    penalty,
    remainingTerm,
    defermentMonths,
    minRepaymentPercent,
    salaryTransfer,
    issueDate,
    endDate,
    principalDefermentMonths,
    interestDefermentMonths,
    termExtensionMonths,
    customTermMonths,
    customTermActive,
  ])

  const handleInterestDefermentToggle = (enabled: boolean) => {
    setInterestDefermentEnabled(enabled)
    if (!enabled) {
      setInterestDefermentMonths(0)
    } else {
      // Если включаем, устанавливаем 1 месяц, если текущее значение 0
      setInterestDefermentMonths((prev) => (prev === 0 ? 1 : prev))
    }
  }

  const handleTermExtensionToggle = (enabled: boolean) => {
    setTermExtensionEnabled(enabled)
    if (!enabled) {
      setTermExtensionMonths(0)
    } else {
      setTermExtensionMonths((prev) => (prev === 0 ? 1 : prev))
    }
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
    // Сброс новых полей
    setIssueDate(new Date().toISOString().split('T')[0])
    setEndDate('')
    setPrincipalDefermentMonths(1)
    setInterestDefermentMonths(1)
    setTermExtensionMonths(1)
    setCustomTermActive(false)
    setCustomTermMonths(0)
    // Сброс чекбоксов
    setInterestDefermentEnabled(true)
    setTermExtensionEnabled(true)
  }

  const openStatementModal = () => {
    setIsStatementModalOpen(true)
  }

  const closeStatementModal = () => {
    setIsStatementModalOpen(false)
  }

  // Вычисляем средний платеж после отсрочки
  const averagePaymentAfterDeferral = calculateAveragePaymentAfterDeferral(paymentSchedule, defermentMonths)

  const handleChartToggle = (visible: boolean) => {
    setShowChart(visible)
  }

  const baseScenario = scenarios.find(s => s.name === 'Базовый сценарий') || scenarios[0]
  const settlementScenario = scenarios.find(s => s.name === 'Сценарий с урегулированием') || scenarios[1]

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
            // Новые поля
            issueDate={issueDate}
            setIssueDate={setIssueDate}
            endDate={endDate}
            setEndDate={setEndDate}
            principalDefermentMonths={principalDefermentMonths}
            setPrincipalDefermentMonths={setPrincipalDefermentMonths}
            interestDefermentMonths={interestDefermentMonths}
            setInterestDefermentMonths={setInterestDefermentMonths}
            termExtensionMonths={termExtensionMonths}
            setTermExtensionMonths={setTermExtensionMonths}
            interestDefermentEnabled={interestDefermentEnabled}
            setInterestDefermentEnabled={handleInterestDefermentToggle}
            termExtensionEnabled={termExtensionEnabled}
            setTermExtensionEnabled={handleTermExtensionToggle}
            customTermActive={customTermActive}
            setCustomTermActive={setCustomTermActive}
            customTermMonths={customTermMonths}
            setCustomTermMonths={setCustomTermMonths}
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
          {scenarios.length >= 2 && (
            <ComparisonBlock
              scenario1={baseScenario}
              scenario2={settlementScenario}
            />
          )}
          <ResultsTable
            schedule={paymentSchedule}
            scenarios={scenarios}
            showChartButton={true}
            onShowChartToggle={handleChartToggle}
          />
          <ChartComponent
            scenario1Schedule={baseScenario?.schedule || []}
            scenario2Schedule={settlementScenario?.schedule || []}
            visible={showChart}
          />
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
