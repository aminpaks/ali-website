import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Layout } from '../UI';

const SafeScript = ({ children }) => {
  console.log('check', children);
  return <div />;
};

const loadVisaSdk = (init) => {
  const newScript = document.createElement('script');
  newScript.src =
    'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';
  newScript.async = true;

  document.body.appendChild(newScript);

  return newScript;
};

const isVisaSdkAvailable = () => window.VisaCheckoutSDK != null;

export const PageCheckout = () => {
  useEffect(() => {
    let script = null;
    if (isVisaSdkAvailable() === false) {
      script = loadVisaSdk();

      console.log('mount', script);
    }
    return () => {
      if (script != null) {
        console.log('unmount');
        document.body.removeChild(script);
      }
    };
  }, []);
  return (
    <Layout className="page-checkout">
      Checkout page
      <div>
        <SafeScript>{(console.log('check'), ``)}</SafeScript>
        <img
          alt="Visa Checkout"
          className="v-button"
          role="button"
          src="https://sandbox.secure.checkout.visa.com/wallet-services-web/
    xo/button.png"
        />
      </div>
    </Layout>
  );
};
