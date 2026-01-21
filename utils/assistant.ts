export interface AssistantParams {
  salary: number;
  hasEnforcement: boolean;
  livingMinimum: number;
  otherPayments: number;
}

export interface AssistantResult {
  adjustedSalary: number;
  available: number;
  recommendedPayment: number;
}

/**
 * Рассчитывает доступный доход и рекомендованный платеж.
 */
export function calculateRecommendedPayment(params: AssistantParams): AssistantResult {
  const { salary, hasEnforcement, livingMinimum, otherPayments } = params;
  const adjustedSalary = hasEnforcement ? salary / 2 : salary;
  const available = adjustedSalary - livingMinimum - otherPayments;
  const recommendedPayment = Math.max(0, available);
  return {
    adjustedSalary,
    available,
    recommendedPayment,
  };
}
