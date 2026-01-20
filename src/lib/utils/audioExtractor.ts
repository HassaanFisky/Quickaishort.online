/**
 * Utility to extract audio data from a video file safely in the browser.
 */
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export async function extractAudioData(
  file: File,
): Promise<{ audioData: Float32Array; sampleRate: number; duration: number }> {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: 16000,
  });
  const arrayBuffer = await file.arrayBuffer();

  // Note: decodeAudioData accepts an ArrayBuffer
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // For Whisper, we generally want mono 16kHz
  const audioData = audioBuffer.getChannelData(0); // Get first channel
  const duration = audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;

  return { audioData, sampleRate, duration };
}
