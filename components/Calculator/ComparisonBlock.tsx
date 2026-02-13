import React from 'react';
import styles from './Calculator.module.scss';
import { CalculationScenario } from '@/utils/calculator';

interface ComparisonBlockProps {
  scenario1: CalculationScenario;
  scenario2: CalculationScenario;
}

const ComparisonBlock: React.FC<ComparisonBlockProps> = ({ scenario1, scenario2 }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={styles.comparisonBlock}>
      <h3>Сравнение сценариев</h3>
      <div className={styles.comparisonGrid}>
        <div className={styles.scenarioCard}>
          <h4 className={styles.scenarioTitle}>{scenario1.name}</h4>
          <div className={styles.scenarioDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ежемесячный платеж:</span>
              <span className={styles.detailValue}>
                {scenario1.monthlyPayment ? formatCurrency(scenario1.monthlyPayment) : '—'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Платеж в период отсрочки:</span>
              <span className={styles.detailValue}>
                {scenario1.defermentPayment ? formatCurrency(scenario1.defermentPayment) : '—'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Платеж после отсрочки:</span>
              <span className={styles.detailValue}>
                {scenario1.postDefermentPayment ? formatCurrency(scenario1.postDefermentPayment) : '—'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Полная стоимость кредита:</span>
              <span className={styles.detailValue}>{formatCurrency(scenario1.totalCost)}</span>
            </div>
          </div>
        </div>
        <div className={styles.scenarioCard}>
          <h4 className={styles.scenarioTitle}>{scenario2.name}</h4>
          <div className={styles.scenarioDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ежемесячный платеж:</span>
              <span className={styles.detailValue}>
                {scenario2.monthlyPayment ? formatCurrency(scenario2.monthlyPayment) : '—'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Платеж в период отсрочки:</span>
              <span className={styles.detailValue}>
                {scenario2.defermentPayment ? formatCurrency(scenario2.defermentPayment) : '—'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Платеж после отсрочки:</span>
              <span className={styles.detailValue}>
                {scenario2.postDefermentPayment ? formatCurrency(scenario2.postDefermentPayment) : '—'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Полная стоимость кредита:</span>
              <span className={styles.detailValue}>{formatCurrency(scenario2.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBlock;
