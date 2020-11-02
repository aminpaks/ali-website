const baseUrlV1 = 'https://api.edufina.ca/wp-json/custom/v1';

export const apiRequest = ({ url }, options) => {
  const _url = new URL(url, baseUrlV1);
  const fullUrl = baseUrlV1 + _url.pathname;

  return fetch(fullUrl, options).then((res) => res.json());
};
