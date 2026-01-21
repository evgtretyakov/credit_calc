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
