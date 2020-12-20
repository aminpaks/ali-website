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
