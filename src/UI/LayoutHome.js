import React from 'react';
import { Nav } from './Nav';

export const LayoutHome = ({ children }) => {
  return (
    <>
      <Nav />
      {children}
    </>
  );
};
