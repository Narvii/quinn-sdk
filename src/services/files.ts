import { AxiosInstance } from 'axios';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  type TranscribeAudioInput,
  type TranscribeAudioResult,
} from '../types';

type TranscribeAudioResponse = {
  item: {
    byteSize: number;
    contentType?: string;
    fileName: string;
    model: string;
    provider: string;
    text: string;
  };
};

function previewText(text: string): string {
  const normalized = text.trim();
  if (normalized.length <= 2000) return normalized;
  return `${normalized.slice(0, 2000)}...`;
}

function inferAudioContentType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case '.flac':
      return 'audio/flac';
    case '.m4a':
      return 'audio/mp4';
    case '.mp3':
    case '.mpeg':
    case '.mpga':
      return 'audio/mpeg';
    case '.ogg':
      return 'audio/ogg';
    case '.wav':
      return 'audio/wav';
    case '.webm':
      return 'audio/webm';
    default:
      return 'application/octet-stream';
  }
}

export class FilesService {
  constructor(private readonly http: AxiosInstance) {}

  async transcribeAudio(
    input: TranscribeAudioInput
  ): Promise<TranscribeAudioResult> {
    const bytes = await fs.readFile(input.path);
    const form = new FormData();
    const contentType = input.contentType ?? inferAudioContentType(input.path);

    form.append(
      'audio',
      new Blob([new Uint8Array(bytes)], { type: contentType }),
      path.basename(input.path)
    );
    if (input.language?.trim()) {
      form.append('language', input.language.trim());
    }

    const resp = await this.http.post<TranscribeAudioResponse>(
      '/files/audio:transcribe',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    const item = resp.data.item;
    if (input.outputPath) {
      await fs.mkdir(path.dirname(input.outputPath), { recursive: true });
      await fs.writeFile(input.outputPath, item.text, 'utf8');
    }

    return {
      byteSize: item.byteSize,
      contentPath: input.outputPath,
      contentType: item.contentType,
      fileName: item.fileName,
      model: item.model,
      preview: previewText(item.text),
      provider: item.provider,
      text: item.text,
    };
  }
}
