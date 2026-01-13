'use client'

import { useState } from 'react'
import styles from './StatementModal.module.scss'

interface StatementModalProps {
  isOpen: boolean
  onClose: () => void
  data: {
    principal: number
    interestRate: number
    remainingTerm: number
    defermentMonths: number
    minRepaymentPercent: number
    salaryTransfer: boolean
    totalPayment: number
  }
}

const StatementModal: React.FC<StatementModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    alert('Функция скачивания PDF в разработке. В реальном приложении здесь будет генерация PDF.')
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Заявление на реструктуризацию кредита</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Данные заявителя</h3>
            <p><strong>ФИО:</strong> [Введите ФИО]</p>
            <p><strong>Паспорт:</strong> [Серия и номер]</p>
            <p><strong>Адрес регистрации:</strong> [Адрес]</p>
            <p><strong>Контактный телефон:</strong> [Телефон]</p>
          </div>

          <div className={styles.section}>
            <h3>Условия реструктуризации</h3>
            <ul>
              <li>Сумма основного долга: <strong>{data.principal.toLocaleString('ru-RU')} ₽</strong></li>
              <li>Процентная ставка: <strong>{data.interestRate}% годовых</strong></li>
              <li>Оставшийся срок кредита: <strong>{data.remainingTerm} месяцев</strong></li>
              <li>Отсрочка платежей: <strong>{data.defermentMonths} месяцев</strong></li>
              <li>Минимальный размер погашения: <strong>{data.minRepaymentPercent}%</strong></li>
              <li>Перевод ЗП в Сбер: <strong>{data.salaryTransfer ? 'Да' : 'Нет'}</strong></li>
              <li>Примерный ежемесячный платеж после реструктуризации: <strong>{data.totalPayment.toLocaleString('ru-RU')} ₽</strong></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Текст заявления</h3>
            <div className={styles.statementText}>
              <p>
                Я, [ФИО], прошу рассмотреть возможность реструктуризации моего кредита на указанных выше условиях.
                Обязуюсь предоставить все необходимые документы и соблюдать новые графики платежей.
                Согласен на обработку моих персональных данных в соответствии с законодательством РФ.
              </p>
              <p>
                Дата: ______________
              </p>
              <p>
                Подпись: ______________
              </p>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.buttonSecondary} onClick={onClose}>Закрыть</button>
          <button className={styles.buttonPrimary} onClick={handlePrint}>Распечатать</button>
          <button className={styles.buttonSuccess} onClick={handleDownload}>Скачать PDF</button>
        </div>
      </div>
    </div>
  )
}

export default StatementModal