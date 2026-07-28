import http from 'node:http';
import { AddressInfo } from 'node:net';

export interface RecordedRequest {
  method: string;
  pathname: string;
  query: URLSearchParams;
  rawUrl: string;
}

export interface RecordingApi {
  url: string;
  requests: RecordedRequest[];
  lastRequest(): RecordedRequest;
  respondWith(status: number, body: unknown): void;
  reset(): void;
  close(): Promise<void>;
}

/**
 * A real HTTP server, so assertions are made on the request that actually went
 * out on the wire rather than on the SDK's own view of it.
 */
export async function startRecordingApi(): Promise<RecordingApi> {
  const requests: RecordedRequest[] = [];
  let status = 200;
  let body: unknown = { items: [], nextToken: '' };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    requests.push({
      method: req.method ?? 'GET',
      pathname: url.pathname,
      query: url.searchParams,
      rawUrl: req.url ?? '',
    });
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}`,
    requests,
    lastRequest() {
      const request = requests.at(-1);
      if (!request) {
        throw new Error('no request was sent');
      }
      return request;
    },
    respondWith(nextStatus: number, nextBody: unknown) {
      status = nextStatus;
      body = nextBody;
    },
    reset() {
      requests.length = 0;
      status = 200;
      body = { items: [], nextToken: '' };
    },
    close() {
      return new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}
