import React, { useEffect } from 'react';
// import { createPortal } from 'react-dom';
import { Layout, Section } from '../UI';
import { useUpdateState, useGlobalState } from '../App';

const SafeScript = React.memo(({ children, update }) => {
  const state = useGlobalState();
  console.log('update state', state);

  React.useEffect(() => {
    console.log('called use effect');
    setTimeout(() => {
      update({ value: 'updated' });
    }, 5000);
  }, [update]);

  return <div>{children}</div>;
});

const SomeOther = React.memo(() => {
  const update = useUpdateState();
  console.log('SomeOther render', update);
  return <div>okay</div>;
});

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
  const updateState = useUpdateState();
  console.log('PageCheckout render', updateState);

  useEffect(() => {
    let script = null;
    if (isVisaSdkAvailable() === false) {
      window.onVisaCheckoutReady = () => {
        console.log('check VISA');
        window.V.init({
          apikey: 'NXTQY34SGQOJ3BH196A221-QT8Gx8LrTjEwNc1yM_q7UqoFrk',
          paymentRequest: {
            currencyCode: 'CAD',
            subtotal: '10.00',
          },
        });
      };

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
      <Section>
        Checkout page
        <div>
          <SafeScript update={updateState}>
            <span>check</span>
          </SafeScript>
          <SomeOther />
          <img
            alt="Visa Checkout"
            className="v-button"
            role="button"
            src="https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png"
          />
        </div>
      </Section>
    </Layout>
  );
};
