import React, { useEffect } from 'react';
import { Card, Header, Layout, Section } from '../../UI';
import { makeStyles } from '../../dependencies';

const useStyles = makeStyles({
  cardContainer: {
    display: 'flex',
    '& > *': {
      flex: '1 0 auto',
      margin: '0 2rem',
    },
  },
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
  const classes = useStyles();

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
    }
    return () => {
      if (script != null) {
        document.body.removeChild(script);
      }
    };
  }, []);
  return (
    <Layout className="page-checkout">
      <Section>
        <Header>Courses</Header>
        <Section.Part>
          <div>
            <div className={classes.cardContainer}>
              <Card>
                <div>Course #1</div>
                <img
                  alt="Visa Checkout"
                  className="v-button"
                  role="button"
                  src="https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png"
                />
              </Card>
              <Card>
                <div>Course #2</div>
              </Card>
              <Card>
                <div>Course #3</div>
              </Card>
            </div>
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};
