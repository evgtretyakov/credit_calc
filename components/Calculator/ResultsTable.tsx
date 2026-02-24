import React, { useState } from 'react';
import styles from './Calculator.module.scss';
import { CalculationScenario, ScheduleItem } from '@/utils/calculator';

interface ResultsTableProps {
  // Для обратной совместимости
  schedule: ScheduleItem[];
  // Новые опциональные пропсы
  scenario?: CalculationScenario;
  scenarios?: CalculationScenario[];
  showChartButton?: boolean;
  onShowChartToggle?: (visible: boolean) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  schedule,
  scenario,
  scenarios = [],
  showChartButton = false,
  onShowChartToggle,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [chartVisible, setChartVisible] = useState<boolean>(false);

  const hasMultipleScenarios = scenarios.length > 1;
  const displaySchedule = hasMultipleScenarios
    ? scenarios[selectedScenarioIndex]?.schedule
    : scenario
    ? scenario.schedule
    : schedule;

  const handleShowChart = () => {
    const newVisible = !chartVisible;
    setChartVisible(newVisible);
    if (onShowChartToggle) {
      onShowChartToggle(newVisible);
    }
  };

  const handleScenarioChange = (index: number) => {
    setSelectedScenarioIndex(index);
    // Можно также уведомить родительский компонент о смене сценария, если нужно
  };

  if (displaySchedule.length === 0) {
    return <div className={styles.noData}>Нет данных для отображения</div>;
  }

  const currentScenario = hasMultipleScenarios ? scenarios[selectedScenarioIndex] : scenario;

  return (
    <div className={styles.resultsTable}>
      <div className={styles.resultsHeader}>
        <h2>График платежей</h2>
        <div className={styles.headerControls}>
          {hasMultipleScenarios && (
            <div className={styles.scenarioTabs}>
              {scenarios.map((sc, idx) => (
                <button
                  key={sc.name}
                  className={`${styles.tabButton} ${selectedScenarioIndex === idx ? styles.tabActive : ''}`}
                  onClick={() => handleScenarioChange(idx)}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          )}
          {showChartButton && (
            <button className={styles.chartButton} onClick={handleShowChart}>
              {chartVisible ? 'Скрыть график' : 'Показать график'}
            </button>
          )}
        </div>
      </div>
        {currentScenario && (
            <div className={styles.scenarioSummary}>
                <p>
                    <strong>Полная стоимость:</strong>{' '}
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(currentScenario.totalCost)}
                </p>
                {currentScenario.monthlyPayment && (
                    <p>
                        <strong>Средний ежемесячный платеж:</strong>{' '}
                        {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(currentScenario.monthlyPayment)}
                    </p>
                )}
            </div>
        )}
        {chartVisible && (
            <div>
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
            {displaySchedule.map((row) => (
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
        Всего месяцев: {displaySchedule.length}
      </p>
            </div>)}
    </div>
  );
};

export default ResultsTable;
