const baseUrlV1 = 'https://api.edufina.ca/wp-json/custom/v1';

export const apiRequest = async ({ url }, options) => {
  const _url = new URL(url, baseUrlV1);
  const fullUrl = baseUrlV1 + _url.pathname;

  const res = await fetch(fullUrl, options);

  if (res.status >= 400) {
    const error = new Error('Unknown Http Failure');
    let potentialJsonError;
    try {
      const text = await res.text();
      potentialJsonError = JSON.parse(text);
    } catch {}

    error.status = res.status;
    error.statusText = res.statusText;
    if (potentialJsonError) {
      error.original = potentialJsonError;
    }

    throw potentialJsonError;
  }

  return res.json();
};
