import React, { useEffect } from 'react';
import { Button, Header, Layout, Section } from '../../UI';
import { Link, makeStyles } from '../../dependencies';
import { COURSE_PRICE, VISA_API_KEY, VISA_SDK_URL } from '../../constants';

const useStyles = makeStyles({
  cardContainer: {
    display: 'flex',
    maxWidth: '100%',
    fontSize: '1rem',
    '& > *': {
      flex: '1 0 auto',
      margin: '0 2rem',
      maxWidth: 'calc(max(100%, 200px) - 4rem)',
    },
  },
  content: {
    '& > div,p': {
      marginBottom: '1rem',
    },
  },
});

const loadVisaSdk = () => {
  if (VISA_SDK_URL) {
    const newScript = document.createElement('script');
    newScript.src = VISA_SDK_URL;
    newScript.async = true;

    document.body.appendChild(newScript);

    return newScript;
  }
  return null;
};

const isVisaSdkAvailable = () => window.VisaCheckoutSDK != null;

export const PageCourses = () => {
  const classes = useStyles();

  useEffect(() => {
    let script = null;
    if (isVisaSdkAvailable() === false) {
      window.onVisaCheckoutReady = () => {
        console.log('check VISA');
        window.V.init({
          apikey: VISA_API_KEY,
          paymentRequest: {
            currencyCode: 'CAD',
            subtotal: '10.00',
          },
        });
        window.V.on('payment.success', (payment) => {
          console.log(payment);
        });
        window.V.on('payment.cancel', (payment) => {
          console.log(payment);
        });
        window.V.on('payment.error', (payment, error) => {
          console.log(error, payment);
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
    <Layout>
      <Section>
        <Header>Courses</Header>
        <Section.Part>
          <div className={classes.content}>
            <h3>Financial Literacy Course</h3>
            <div>
              <p>
                The EduFina Course is your key to a financially independent
                lifestyle. It is a comprehensive 10 module course in Montreal
                that will help you achieve a vast understanding of financial
                markets and how to profit from them.
              </p>
              <p>
                In our unique in person training sessions, you will learn
                everything you need to know to successfully invest your wealth
                in stocks, bonds, funds, futures, currencies, and more. If you
                are not satisfied with the course, we offer a full money-back
                guarantee.
              </p>
              <p>
                If you would like a more detailed guide on the topics of the
                course, please download our course Syllabus.
              </p>
            </div>
            <div>
              <div>
                <p>
                  The course costs <strong>{COURSE_PRICE} CAD</strong> and you
                  can buy it online via Visa Checkout which is secured and safe,
                  just click on the Visa icon below and process your payment
                </p>
                <p>
                  <img
                    alt="Visa Checkout"
                    className="v-button"
                    role="button"
                    src="https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png"
                  />
                </p>
              </div>
              <div>
                <p>
                  or reach out to us, we are open to receive the payment by all
                  means.
                </p>
                <p>
                  <Button
                    to="/contact?from=courses"
                    component={Link}
                    size="small"
                  >
                    Contact us
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};
