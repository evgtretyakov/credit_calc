export interface ScheduleItem {
  month: number;
  interest: number;
  principal: number;
  total: number;
  balance: number;
  totalWithPenalty: number;
}

export interface CalculatorParams {
  principal: number;
  interestRate: number; // годовая процентная ставка
  penalty: number; // сумма неустоек
  remainingTerm: number; // оставшийся срок (мес.)
  defermentMonths: number; // отсрочка (мес.)
  minRepaymentPercent: number; // минимальный размер погашения (%)
  salaryTransfer: boolean; // перевод ЗП в Сбер
}

export interface AdvancedCalculatorParams extends CalculatorParams {
  issueDate: string; // дата выдачи кредита
  endDate: string; // дата окончания кредита
  principalDefermentMonths: number; // отсрочка по основному долгу (мес.)
  interestDefermentMonths: number; // отсрочка по процентам (мес.)
  termExtensionMonths: number; // увеличение срока (мес.)
  customTermMonths: number; // пользовательский срок (мес.)
  customTermActive: boolean; // флаг использования пользовательского срока
}

export interface CalculationScenario {
  name: string; // название сценария
  schedule: ScheduleItem[]; // график платежей
  totalCost: number; // полная стоимость кредита
  monthlyPayment?: number; // средний ежемесячный платеж
  defermentPayment?: number; // платеж в период отсрочки
  postDefermentPayment?: number; // платеж после отсрочки
}

/**
 * Адаптер для преобразования CalculatorParams в AdvancedCalculatorParams с значениями по умолчанию.
 */
export function toAdvancedParams(params: CalculatorParams): AdvancedCalculatorParams {
  return {
    ...params,
    issueDate: '',
    endDate: '',
    principalDefermentMonths: params.defermentMonths,
    interestDefermentMonths: params.defermentMonths,
    termExtensionMonths: 0,
    customTermMonths: 0,
    customTermActive: false,
  };
}

/**
 * Рассчитывает график платежей по кредиту с учетом реструктуризации.
 */
export function calculateSchedule(params: CalculatorParams): ScheduleItem[] {
  const {
    principal,
    interestRate,
    penalty,
    remainingTerm,
    defermentMonths,
    minRepaymentPercent,
    salaryTransfer,
  } = params;

  const schedule: ScheduleItem[] = [];
  let balance = principal;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = remainingTerm + defermentMonths;
  const adjustedRate = salaryTransfer ? monthlyRate - 0.005 / 12 : monthlyRate; // снижение ставки на 0.5% годовых

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * adjustedRate;
    let principalPayment = 0;
    let totalPayment = 0;

    if (month <= defermentMonths) {
      // период отсрочки
      principalPayment = 0;
      totalPayment = interest;
    } else {
      // после отсрочки
      const remainingAfterDefer = totalMonths - defermentMonths;
      principalPayment = balance / remainingAfterDefer;
      totalPayment = interest + principalPayment;
      // применяем минимальный размер погашения
      if (minRepaymentPercent > 0) {
        const minPrincipal = balance * (minRepaymentPercent / 100);
        if (principalPayment < minPrincipal) {
          principalPayment = minPrincipal;
          totalPayment = interest + principalPayment;
        }
      }
    }

    balance -= principalPayment;
    if (balance < 0) balance = 0;

    const totalWithPenalty = totalPayment + (penalty / totalMonths);

    schedule.push({
      month,
      interest: Math.round(interest),
      principal: Math.round(principalPayment),
      total: Math.round(totalPayment),
      balance: Math.round(balance),
      totalWithPenalty: Math.round(totalWithPenalty),
    });
  }

  return schedule;
}

/**
 * Вычисляет средний платеж после отсрочки.
 */
export function calculateAveragePaymentAfterDeferral(
  schedule: ScheduleItem[],
  defermentMonths: number
): number {
  if (schedule.length === 0) return 0;
  const paymentsAfterDeferral = schedule.filter(item => item.month > defermentMonths);
  if (paymentsAfterDeferral.length === 0) return 0;
  const sum = paymentsAfterDeferral.reduce((acc, item) => acc + item.total, 0);
  return Math.round(sum / paymentsAfterDeferral.length);
}

/**
 * Рассчитывает два сценария: базовый и с урегулированием.
 */
export function calculateAdvancedSchedule(params: AdvancedCalculatorParams): CalculationScenario[] {
  const {
    principal,
    interestRate,
    penalty,
    remainingTerm,
    defermentMonths,
    minRepaymentPercent,
    salaryTransfer,
    principalDefermentMonths,
    interestDefermentMonths,
    termExtensionMonths,
    customTermMonths,
    customTermActive,
  } = params;

  // Базовый сценарий (без урегулирования)
  const baseScenario: CalculationScenario = {
    name: 'Базовый сценарий',
    schedule: calculateSchedule({
      principal,
      interestRate,
      penalty,
      remainingTerm,
      defermentMonths,
      minRepaymentPercent,
      salaryTransfer,
    }),
    totalCost: 0, // будет вычислено ниже
  };
  baseScenario.totalCost = baseScenario.schedule.reduce((sum, item) => sum + item.totalWithPenalty, 0);
  baseScenario.monthlyPayment = calculateAveragePaymentAfterDeferral(baseScenario.schedule, defermentMonths);
  baseScenario.defermentPayment = baseScenario.schedule
    .filter(item => item.month <= defermentMonths)
    .reduce((sum, item) => sum + item.total, 0) / Math.max(1, defermentMonths);
  baseScenario.postDefermentPayment = baseScenario.monthlyPayment;

  // Сценарий с урегулированием
  // Корректировка ставки
  let monthlyRate = interestRate / 100 / 12;
  if (salaryTransfer) {
    monthlyRate -= 0.005 / 12; // снижение на 0.5% годовых
  }
  if (customTermActive) {
    monthlyRate += (customTermMonths * 0.001) / 12; // +0.1% годовых за каждый месяц
  }
  // Защита от отрицательной ставки
  if (monthlyRate < 0) monthlyRate = 0;

  // Определение периодов
  const totalTerm = remainingTerm + termExtensionMonths;
  const maxDeferment = Math.max(principalDefermentMonths, interestDefermentMonths);

  const schedule: ScheduleItem[] = [];
  let balance = principal;
  const penaltyPerMonth = totalTerm > 0 ? penalty / totalTerm : 0;

  for (let month = 1; month <= totalTerm; month++) {
    // Процентный платеж
    let interestPayment = 0;
    if (month > interestDefermentMonths) {
      interestPayment = balance * monthlyRate;
    }

    // Платеж по основному долгу
    let principalPayment = 0;
    if (month > principalDefermentMonths) {
      const monthsLeft = totalTerm - month + 1;
      principalPayment = balance / monthsLeft;
    }

    // Применение минимального размера погашения
    if (minRepaymentPercent > 0 && principalPayment > 0) {
      const minPrincipal = balance * (minRepaymentPercent / 100);
      if (principalPayment < minPrincipal) {
        principalPayment = minPrincipal;
      }
    }

    const totalPayment = interestPayment + principalPayment;
    balance -= principalPayment;
    if (balance < 0) balance = 0;

    const totalWithPenalty = totalPayment + penaltyPerMonth;

    schedule.push({
      month,
      interest: Math.round(interestPayment),
      principal: Math.round(principalPayment),
      total: Math.round(totalPayment),
      balance: Math.round(balance),
      totalWithPenalty: Math.round(totalWithPenalty),
    });
  }

  const totalCost = schedule.reduce((sum, item) => sum + item.totalWithPenalty, 0);
  const defermentPayment = schedule
    .filter(item => item.month <= maxDeferment)
    .reduce((sum, item) => sum + item.total, 0) / Math.max(1, maxDeferment);
  const postDefermentPayment = schedule
    .filter(item => item.month > maxDeferment)
    .reduce((sum, item) => sum + item.total, 0) / Math.max(1, totalTerm - maxDeferment);

  const settlementScenario: CalculationScenario = {
    name: 'Сценарий с урегулированием',
    schedule,
    totalCost,
    monthlyPayment: postDefermentPayment,
    defermentPayment,
    postDefermentPayment,
  };

  return [baseScenario, settlementScenario];
}
