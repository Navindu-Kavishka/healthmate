import { buildRecordFilter } from './recordFilter';

describe('buildRecordFilter', () => {
  it('matches every date when nothing is set', () => {
    expect(buildRecordFilter()).toEqual({ where: 'date LIKE ?', params: ['%'] });
  });

  it('turns the search text into a prefix and keeps it in a parameter', () => {
    expect(buildRecordFilter({ text: '2026-11' })).toEqual({
      where: 'date LIKE ?',
      params: ['2026-11%'],
    });
  });

  it('includes both ends of the range', () => {
    expect(buildRecordFilter({ from: '2026-11-01', to: '2026-11-18' })).toEqual({
      where: 'date LIKE ? AND date >= ? AND date <= ?',
      params: ['%', '2026-11-01', '2026-11-18'],
    });
  });

  it('takes one open end at a time', () => {
    expect(buildRecordFilter({ from: '2026-11-01' })).toEqual({
      where: 'date LIKE ? AND date >= ?',
      params: ['%', '2026-11-01'],
    });
    expect(buildRecordFilter({ to: '2026-11-30' })).toEqual({
      where: 'date LIKE ? AND date <= ?',
      params: ['%', '2026-11-30'],
    });
  });

  it('drops both bounds when the range is cleared', () => {
    expect(buildRecordFilter({ from: null, to: null })).toEqual(buildRecordFilter());
  });
});