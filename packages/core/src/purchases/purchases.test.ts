import { billingCopy, createPurchases, evaluate, FREE, mockEntitlement, type ProductDef } from './purchases';

const yearly: ProductDef = { id: 'yearly', period: 'year', usd: 24.99, label: 'Yearly' };
const lifetime: ProductDef = { id: 'forever', period: 'lifetime', usd: 49.99, label: 'Lifetime' };

describe('purchases', () => {
  it('states yearly billing as one charge', () => {
    expect(billingCopy(yearly)).toBe('$24.99 billed once a year');
  });
  it('expires a mock subscription after its period', () => {
    const e = mockEntitlement(yearly, '2027-01-01T00:00:00Z');
    expect(evaluate(e, '2027-06-01T00:00:00Z').active).toBe(true);
    expect(evaluate(e, '2028-01-02T00:00:00Z')).toEqual(FREE);
  });
  it('never expires a lifetime unlock', () => {
    expect(evaluate(mockEntitlement(lifetime, '2027-01-01T00:00:00Z'), '2040-01-01T00:00:00Z').active).toBe(true);
  });
  it('runs in mock mode without keys and labels it simulated', async () => {
    const p = createPurchases({ entitlement: 'premium', products: [yearly] });
    expect(p.enabled).toBe(false);
    const r = await p.purchase('yearly');
    expect(r.ok && r.simulated).toBe(true);
    expect(await p.restore()).toBeNull();
  });
});
