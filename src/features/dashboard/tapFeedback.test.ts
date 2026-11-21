import * as Haptics from 'expo-haptics';

import { tapFeedback } from './tapFeedback';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(async () => {}),
  ImpactFeedbackStyle: { Light: 'light' },
}));

const impactAsync = Haptics.impactAsync as jest.Mock;

describe('tapFeedback', () => {
  beforeEach(() => jest.clearAllMocks());

  it('asks for one light impact', () => {
    tapFeedback();

    expect(impactAsync).toHaveBeenCalledWith('light');
  });

  it('stays quiet where haptics are not supported', async () => {
    impactAsync.mockRejectedValueOnce(new Error('no vibrator'));

    expect(() => tapFeedback()).not.toThrow();
    await Promise.resolve(); // let the catch run

    expect(impactAsync).toHaveBeenCalledTimes(1);
  });
});