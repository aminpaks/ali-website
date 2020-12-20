export const getPublicBackgroundUrl = (imageUrl) =>
  `url(${process.env.PUBLIC_URL + imageUrl})`;
export const getPublicImage = (imageUrl) => process.env.PUBLIC_URL + imageUrl;
