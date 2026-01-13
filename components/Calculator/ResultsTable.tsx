import React from 'react'
import styles from './Calculator.module.scss'

interface ScheduleItem {
  month: number
  interest: number
  principal: number
  total: number
  balance: number
  totalWithPenalty: number
}

interface ResultsTableProps {
  schedule: ScheduleItem[]
}

const ResultsTable: React.FC<ResultsTableProps> = ({ schedule }) => {
  if (schedule.length === 0) {
    return <div className={styles.noData}>Нет данных для отображения</div>
  }

  return (
    <div className={styles.resultsTable}>
      <h2>График платежей</h2>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Период</th>
              <th>%% по кредиту</th>
              <th>Основной долг</th>
              <th>ИТОГО платеж по кредиту</th>
              <th>Остаток основного долга</th>
              <th>ВСЕГО платеж с учетом неустоек</th>
            </tr>
          </thead>
          <tbody>
            {schedule.slice(0, 12).map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>{row.interest.toLocaleString('ru-RU')} ₽</td>
                <td>{row.principal.toLocaleString('ru-RU')} ₽</td>
                <td>{row.total.toLocaleString('ru-RU')} ₽</td>
                <td>{row.balance.toLocaleString('ru-RU')} ₽</td>
                <td>{row.totalWithPenalty.toLocaleString('ru-RU')} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.tableNote}>
        Показаны первые 12 месяцев. Всего месяцев: {schedule.length}
      </p>
    </div>
  )
}

export default ResultsTable