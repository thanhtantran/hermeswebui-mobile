/**
 * Utility for performing lightweight client-side connectivity & latency checks on server URLs.
 */

export interface PingOutcome {
  isOnline: boolean;
  latencyMs: number;
  error?: string;
}

export async function pingServerUrl(url: string, timeoutMs = 4500): Promise<PingOutcome> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // We append a harmless query param to prevent browser caching
    const urlObj = new URL(url);
    urlObj.searchParams.set('_h_ping', String(Date.now()));

    // In browsers, cross-origin requests to arbitrary ports/hosts without CORS headers
    // must use mode: 'no-cors'. An opaque response confirms the server is reachable and active.
    await fetch(urlObj.toString(), {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      isOnline: true,
      latencyMs: Math.max(1, latencyMs),
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    // If HEAD failed, give GET a brief shot (some servers reject HEAD with 405 or close socket)
    if (err?.name !== 'AbortError') {
      try {
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), 2500);
        const retryStart = performance.now();

        await fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: retryController.signal,
        });

        clearTimeout(retryTimeout);
        return {
          isOnline: true,
          latencyMs: Math.round(performance.now() - retryStart),
        };
      } catch (retryErr: any) {
        // Fall through to offline
      }
    }

    const elapsed = Math.round(performance.now() - startTime);
    const isTimeout = err?.name === 'AbortError' || elapsed >= timeoutMs;

    return {
      isOnline: false,
      latencyMs: elapsed,
      error: isTimeout ? 'Timeout (>4.5s)' : (err?.message || 'Connection refused or host unreachable'),
    };
  }
}
