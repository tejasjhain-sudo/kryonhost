export interface CalculatedVpsResources {
  planId: string;
  planName: string;
  vcpu: number;
  baseRamGB: number;
  foundingBonusRamGB: number;
  finalRamGB: number; // baseRam + foundingBonus
  storageGB: number;
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
}

export class ResourceService {
  private planSpecs: Record<string, { name: string; vcpu: number; ramGB: number; storageGB: number; priceUSD: number; priceINR: number }> = {
    nano: { name: 'Nano', vcpu: 1, ramGB: 2, storageGB: 25, priceUSD: 2.49, priceINR: 199 },
    starter: { name: 'Starter', vcpu: 2, ramGB: 4, storageGB: 50, priceUSD: 4.29, priceINR: 349 },
    performance: { name: 'Performance', vcpu: 4, ramGB: 8, storageGB: 100, priceUSD: 7.49, priceINR: 599 },
    pro: { name: 'Pro', vcpu: 6, ramGB: 16, storageGB: 200, priceUSD: 12.49, priceINR: 999 },
    ultra: { name: 'Ultra / Enterprise', vcpu: 8, ramGB: 24, storageGB: 300, priceUSD: 18.49, priceINR: 1499 },
    enterprise: { name: 'Ultra / Enterprise', vcpu: 8, ramGB: 24, storageGB: 300, priceUSD: 18.49, priceINR: 1499 },
  };

  /**
   * Calculate final server-side resources.
   * NEVER trust client-supplied resource values.
   */
  public calculateResources(planId: string, isFoundingCustomer: boolean): CalculatedVpsResources {
    const normalizedPlanId = planId.toLowerCase();
    const spec = this.planSpecs[normalizedPlanId] || this.planSpecs.performance;

    // Nano and Starter plans do not qualify for +4GB RAM bonus
    const qualifiesForBonus = isFoundingCustomer && !['nano', 'starter'].includes(normalizedPlanId);
    const foundingBonusRamGB = qualifiesForBonus ? 4 : 0;
    const finalRamGB = spec.ramGB + foundingBonusRamGB;

    return {
      planId: normalizedPlanId,
      planName: spec.name,
      vcpu: spec.vcpu,
      baseRamGB: spec.ramGB,
      foundingBonusRamGB,
      finalRamGB,
      storageGB: spec.storageGB,
      monthlyPriceUSD: spec.priceUSD,
      monthlyPriceINR: spec.priceINR,
    };
  }
}

export const resourceService = new ResourceService();
