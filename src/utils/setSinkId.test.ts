import { isSetSinkIdSupported } from './setSinkId';

describe('isSetSinkIdSupported', () => {
  it('returns true if available', () => {
    window.Audio.prototype.setSinkId = function () {} as any;
    expect(isSetSinkIdSupported()).toStrictEqual(true);
  });

  it('returns false if unavailable', () => {
    delete window.Audio.prototype.setSinkId;
    expect(isSetSinkIdSupported()).toStrictEqual(false);
  });
});
