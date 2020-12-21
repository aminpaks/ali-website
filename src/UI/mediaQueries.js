import { useMediaQuery } from '../dependencies';

const desktopQuery = ({ breakpoints }) => breakpoints.up('md');
const phoneLandscapeQuery = ({ breakpoints }) =>
  breakpoints.between('sm', 'md');
const phoneQuery = ({ breakpoints }) => breakpoints.down('sm');

export const useDesktopQuery = () => {
  return useMediaQuery(desktopQuery);
};

export const usePhoneLandscapeQuery = () => {
  return useMediaQuery(phoneLandscapeQuery);
};
export const usePhoneQuery = () => {
  return useMediaQuery(phoneQuery);
};

export const iPhoneLandscapeMediaQuery =
  '@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape)';
export const iPhonePortraitMediaQuery =
  '@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait)';
