import { useSnackbarStore } from './snackbarStore';

describe('useSnackbarStore', () => {
  afterEach(() => useSnackbarStore.getState().hideMessage());

  it('shows a message with no action', () => {
    useSnackbarStore.getState().showMessage('Record added');

    expect(useSnackbarStore.getState().message).toBe('Record added');
    expect(useSnackbarStore.getState().action).toBeNull();
  });

  it('carries one action, and hiding clears both', () => {
    const run = jest.fn();
    useSnackbarStore.getState().showMessage('500 ml added', { label: 'Undo', run });
    expect(useSnackbarStore.getState().action).toEqual({ label: 'Undo', run });

    useSnackbarStore.getState().action?.run();
    useSnackbarStore.getState().hideMessage();

    expect(run).toHaveBeenCalledTimes(1);
    expect(useSnackbarStore.getState().message).toBeNull();
    expect(useSnackbarStore.getState().action).toBeNull();
  });

  it('drops the old action when a plain message replaces it', () => {
    useSnackbarStore.getState().showMessage('500 ml added', { label: 'Undo', run: jest.fn() });
    useSnackbarStore.getState().showMessage('Record added');

    expect(useSnackbarStore.getState().action).toBeNull();
  });
});