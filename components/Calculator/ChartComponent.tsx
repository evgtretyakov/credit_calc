import React from 'react';
import styles from './Calculator.module.scss';
import { ScheduleItem } from '@/utils/calculator';

interface ChartComponentProps {
  scenario1Schedule: ScheduleItem[];
  scenario2Schedule: ScheduleItem[];
  visible: boolean;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  scenario1Schedule,
  scenario2Schedule,
  visible,
}) => {
  if (!visible) {
    return null;
  }

  // Используем все данные для графика
  const data1 = scenario1Schedule;
  const data2 = scenario2Schedule;

  if (data1.length === 0 && data2.length === 0) {
    return <div className={styles.chartPlaceholder}>Нет данных для графика</div>;
  }

  const allMonths = Array.from(new Set([...data1.map(d => d.month), ...data2.map(d => d.month)]));
  const maxMonth = Math.max(...allMonths, 1);
  const maxPayment = Math.max(
    ...data1.map(d => d.total),
    ...data2.map(d => d.total),
    1
  );

  // Размеры SVG
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 80 };

  const scaleX = (month: number) => padding.left + (month - 1) * (width - padding.left - padding.right) / (maxMonth - 1 || 1);
  const scaleY = (payment: number) => height - padding.bottom - (payment / maxPayment) * (height - padding.top - padding.bottom);

  // Генерация точек для линий
  const points1 = data1.map(d => `${scaleX(d.month)},${scaleY(d.total)}`).join(' ');
  const points2 = data2.map(d => `${scaleX(d.month)},${scaleY(d.total)}`).join(' ');

  // Ось X: метки месяцев
  const xAxisTicks = [];
  const step = Math.ceil(maxMonth / 10);
  for (let month = 1; month <= maxMonth; month += step) {
    xAxisTicks.push(month);
  }
  if (xAxisTicks[xAxisTicks.length - 1] !== maxMonth) {
    xAxisTicks.push(maxMonth);
  }

  // Ось Y: метки платежей
  const yAxisTicks = [];
  const yStep = Math.ceil(maxPayment / 5 / 1000) * 1000;
  for (let payment = 0; payment <= maxPayment; payment += yStep) {
    yAxisTicks.push(payment);
  }
  if (yAxisTicks[yAxisTicks.length - 1] !== maxPayment) {
    yAxisTicks.push(maxPayment);
  }

  return (
    <div className={styles.chartContainer}>
      <h3>График платежей по месяцам</h3>
      <div className={styles.chartWrapper}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Сетка */}
          <g className={styles.grid}>
            {xAxisTicks.map(month => {
              const x = scaleX(month);
              return (
                <line
                  key={`v-${month}`}
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#e9ecef"
                  strokeWidth="1"
                />
              );
            })}
            {yAxisTicks.map(payment => {
              const y = scaleY(payment);
              return (
                <line
                  key={`h-${payment}`}
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e9ecef"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* Ось X */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#495057"
            strokeWidth="2"
          />
          {xAxisTicks.map(month => {
            const x = scaleX(month);
            return (
              <g key={`tick-x-${month}`}>
                <line
                  x1={x}
                  y1={height - padding.bottom}
                  x2={x}
                  y2={height - padding.bottom + 6}
                  stroke="#495057"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6c757d"
                >
                  {month}
                </text>
              </g>
            );
          })}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize="14"
            fontWeight="500"
            fill="#495057"
          >
            Месяц
          </text>

          {/* Ось Y */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#495057"
            strokeWidth="2"
          />
          {yAxisTicks.map(payment => {
            const y = scaleY(payment);
            return (
              <g key={`tick-y-${payment}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left - 6}
                  y2={y}
                  stroke="#495057"
                  strokeWidth="2"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6c757d"
                >
                  {payment.toLocaleString('ru-RU')}
                </text>
              </g>
            );
          })}
          <text
            x={-height / 2}
            y={20}
            textAnchor="middle"
            fontSize="14"
            fontWeight="500"
            fill="#495057"
            transform={`rotate(-90) translate(${-height / 2}, ${padding.left - 40})`}
          >
            Платеж, ₽
          </text>

          {/* Линия сценария 1 */}
          <polyline
            points={points1}
            fill="none"
            stroke="#21A038"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Линия сценария 2 */}
          <polyline
            points={points2}
            fill="none"
            stroke="#20c997"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Легенда */}
          <g transform={`translate(${width - padding.right - 200}, ${padding.top})`}>
            <rect width="200" height="70" rx="8" fill="white" stroke="#dee2e6" strokeWidth="1" />
            <g transform="translate(10, 20)">
              <line x1="0" y1="10" x2="30" y2="10" stroke="#21A038" strokeWidth="3" />
              <text x="40" y="15" fontSize="14" fill="#495057">Без урегулирования</text>
            </g>
            <g transform="translate(10, 45)">
              <line x1="0" y1="10" x2="30" y2="10" stroke="#20c997" strokeWidth="3" />
              <text x="40" y="15" fontSize="14" fill="#495057">С учетом отсрочек</text>
            </g>
          </g>
        </svg>
      </div>
      <p className={styles.chartNote}>
        График показывает общий платеж по кредиту (без учета неустоек) для двух сценариев.
      </p>
    </div>
  );
};

export default ChartComponent;
