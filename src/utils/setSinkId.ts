/**
 * Helper function to detect whether or not the global `HTMLAudioElement`
 * constructor supports `setSinkId`.
 */
export function isSetSinkIdSupported() {
  return typeof window.Audio.prototype.setSinkId === 'function';
}
