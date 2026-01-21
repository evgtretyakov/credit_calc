import React from 'react'
import styles from './Calculator.module.scss'
import { calculateRecommendedPayment } from '@/utils/assistant'

interface AssistantProps {
  salary: number
  hasEnforcement: boolean
  livingMinimum: number
  otherPayments: number
}

const Assistant: React.FC<AssistantProps> = ({
  salary,
  hasEnforcement,
  livingMinimum,
  otherPayments,
}) => {
  const { adjustedSalary, recommendedPayment } = calculateRecommendedPayment({
    salary,
    hasEnforcement,
    livingMinimum,
    otherPayments,
  })

  return (
    <div className={styles.assistant}>
      <h3>Помощник по доходу</h3>
      <div className={styles.assistantContent}>
        <p>
          <strong>Исходный доход:</strong> {salary.toLocaleString('ru-RU')} ₽
        </p>
        {hasEnforcement && (
          <p className={styles.warning}>
            ⚠️ У вас есть возбужденные производства у пристава, доход делится пополам.
          </p>
        )}
        <p>
          <strong>Доступный доход после учета исполнительного производства:</strong>{' '}
          {adjustedSalary.toLocaleString('ru-RU')} ₽
        </p>
        <p>
          <strong>Прожиточный минимум:</strong> {livingMinimum.toLocaleString('ru-RU')} ₽
        </p>
        <p>
          <strong>Иные платежи:</strong> {otherPayments.toLocaleString('ru-RU')} ₽
        </p>
        <div className={styles.recommendation}>
          <h4>Рекомендуемый платеж по текущему кредиту:</h4>
          <div className={styles.recommendedAmount}>
            {recommendedPayment.toLocaleString('ru-RU')} ₽
          </div>
          <p className={styles.note}>
            Это сумма, которую вы можете комфортно выделять на погашение кредита с учетом ваших обязательств.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Assistant
