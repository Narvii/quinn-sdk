export interface TranscribeAudioInput {
  path: string;
  outputPath?: string;
  language?: string;
  contentType?: string;
}

export interface TranscribeAudioResult {
  text: string;
  preview: string;
  byteSize: number;
  contentPath?: string;
  contentType?: string;
  fileName: string;
  model: string;
  provider: string;
}
