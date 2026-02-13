import React from 'react'
import styles from './Calculator.module.scss'

interface InputSectionProps {
  principal: number
  setPrincipal: (value: number) => void
  interestRate: number
  setInterestRate: (value: number) => void
  penalty: number
  setPenalty: (value: number) => void
  remainingTerm: number
  setRemainingTerm: (value: number) => void
  defermentMonths: number
  setDefermentMonths: (value: number) => void
  minRepaymentPercent: number
  setMinRepaymentPercent: (value: number) => void
  salaryTransfer: boolean
  setSalaryTransfer: (value: boolean) => void
  hasEnforcement: boolean
  setHasEnforcement: (value: boolean) => void
  // Новые поля
  issueDate: string
  setIssueDate: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
  principalDefermentMonths: number
  setPrincipalDefermentMonths: (value: number) => void
  interestDefermentMonths: number
  setInterestDefermentMonths: (value: number) => void
  termExtensionMonths: number
  setTermExtensionMonths: (value: number) => void
  customTermActive: boolean
  setCustomTermActive: (value: boolean) => void
  customTermMonths: number
  setCustomTermMonths: (value: number) => void
  onReset: () => void
}

const InputSection: React.FC<InputSectionProps> = ({
  principal,
  setPrincipal,
  interestRate,
  setInterestRate,
  penalty,
  setPenalty,
  remainingTerm,
  setRemainingTerm,
  defermentMonths,
  setDefermentMonths,
  minRepaymentPercent,
  setMinRepaymentPercent,
  salaryTransfer,
  setSalaryTransfer,
  hasEnforcement,
  setHasEnforcement,
  // Новые поля
  issueDate,
  setIssueDate,
  endDate,
  setEndDate,
  principalDefermentMonths,
  setPrincipalDefermentMonths,
  interestDefermentMonths,
  setInterestDefermentMonths,
  termExtensionMonths,
  setTermExtensionMonths,
  customTermActive,
  setCustomTermActive,
  customTermMonths,
  setCustomTermMonths,
  onReset,
}) => {
  return (
    <div className={styles.inputSection}>
      <h2>Данные по кредиту</h2>
      <div className={styles.inputGroup}>
        <label>
          Сумма основного долга (руб.)
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            min="0"
            step="1000"
          />
        </label>
        <label>
          % ставка по кредиту
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min="0"
            step="0.1"
          />
        </label>
        <label>
          Сумма неустоек (руб.)
          <input
            type="number"
            value={penalty}
            onChange={(e) => setPenalty(Number(e.target.value))}
            min="0"
            step="0.1"
          />
        </label>
        <label>
          Оставшийся срок (мес.)
          <input
            type="number"
            value={remainingTerm}
            onChange={(e) => setRemainingTerm(Number(e.target.value))}
            min="1"
            step="1"
          />
        </label>
        <label>
          Дата выдачи кредита
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </label>
        <label>
          Дата окончания кредитного договора
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <h2>Данные реструктуризации</h2>
      <div className={styles.inputGroup}>
        <label>
          Отсрочка (мес.)
          <input
            type="number"
            value={defermentMonths}
            onChange={(e) => setDefermentMonths(Number(e.target.value))}
            min="0"
            step="1"
          />
        </label>
        <label>
          Минимальный размер погашения (%)
          <input
            type="number"
            value={minRepaymentPercent}
            onChange={(e) => setMinRepaymentPercent(Number(e.target.value))}
            min="0"
            max="100"
            step="1"
          />
        </label>
        <label>
          Отсрочка по основному долгу: {principalDefermentMonths} мес.
          <input
            type="range"
            min="1"
            max="12"
            value={principalDefermentMonths}
            onChange={(e) => setPrincipalDefermentMonths(Number(e.target.value))}
          />
        </label>
        <label>
          Отсрочка по процентам: {interestDefermentMonths} мес.
          <input
            type="range"
            min="1"
            max="12"
            value={interestDefermentMonths}
            onChange={(e) => setInterestDefermentMonths(Number(e.target.value))}
          />
        </label>
        <label>
          Увеличение срока кредитования: {termExtensionMonths} мес.
          <input
            type="range"
            min="1"
            max="24"
            value={termExtensionMonths}
            onChange={(e) => setTermExtensionMonths(Number(e.target.value))}
          />
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={salaryTransfer}
            onChange={(e) => setSalaryTransfer(e.target.checked)}
          />
          <span>Перевести ЗП в Сбер (снижение ставки на 0.5% на льготный период)</span>
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={hasEnforcement}
            onChange={(e) => setHasEnforcement(e.target.checked)}
          />
          <span>Есть возбужденные производства у пристава (доход делится пополам)</span>
        </label>
      </div>

      <h2>Влияет на ставку</h2>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={customTermActive}
            onChange={(e) => setCustomTermActive(e.target.checked)}
          />
          <span>Свой срок</span>
        </label>
        {customTermActive && (
          <label>
            Количество месяцев
            <input
              type="number"
              value={customTermMonths}
              onChange={(e) => setCustomTermMonths(Number(e.target.value))}
              min="0"
              step="1"
            />
          </label>
        )}
      </div>

      <button className={styles.buttonReset} onClick={onReset}>
        Сбросить к значениям по умолчанию
      </button>
    </div>
  )
}

export default InputSection
