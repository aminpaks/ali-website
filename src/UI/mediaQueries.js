import { useMediaQuery } from '../dependencies';

const desktopQuery = ({ breakpoints }) => breakpoints.up('md');

export const useDesktopQuery = () => {
  return useMediaQuery(desktopQuery);
};

export const usePhoneLandscapeQuery = () => {
  return useMediaQuery(iPhoneLandscapeMediaQuery);
};
export const usePhonePortraitQuery = () => {
  return useMediaQuery(iPhonePortraitMediaQuery);
};
export const usePhoneMediaQuery = () => {
  const landscape = usePhoneLandscapeQuery();
  const portrait = usePhonePortraitQuery();
  return landscape || portrait;
};

export const iPhoneLandscapeMediaQuery =
  'only screen and (min-device-width: 375px) and (max-device-width: 896px) and (orientation: landscape)';
export const iPhonePortraitMediaQuery =
  'only screen and (min-device-width: 375px) and (max-device-width: 896px) and (orientation: portrait)';
