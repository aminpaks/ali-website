import React from 'react';
import { makeStyles, Container, useTheme } from '@material-ui/core';
import { Layout } from '../UI';

const useStyles = makeStyles({
  block: {
    display: 'block',
    padding: '4rem 0',
    margin: '4rem -100%',
    // marginLeft: '-100%',
    // marginRight: '-100%',
    color: '#fff',
    backgroundColor: ({ theme }) => theme.palette.accent.main,
  },
  container: {
    fontSize: '1.2rem',
  },
});

export const PageAboutUs = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <Layout className="page-checkout">
      <section className={classes.container}>
        <header>
          <h2>Welcome to EduFina</h2>
        </header>

        <article>
          <p>
            EduFina is a financial literacy school based in Montreal that
            fosters student success with one-on-one or group mentoring and
            top-of-the-line technology, and educators. Our mission is to provide
            an excellent education for our students within a stimulating
            learning environment that will enhance their development and
            potential for success in managing their finances and growing wealth.
          </p>
          <p>
            Students acquire real-world experience as they train side-by-side
            with a successful professional educator who will guide them through
            the complex financial system to allow for a better understanding of
            banks, funds, stocks, bonds, and more.
          </p>
          <div className={classes.block}>
            <Container>
              <section>
                <header>
                  <h3>Toolbox</h3>
                </header>
                <article>Tools</article>
              </section>
            </Container>
          </div>
          <p>
            EduFina offers training programs for <b>individuals</b> and{' '}
            <b>groups</b> that are tailored to each student’s level of
            experience and learning style. With class sizes limited to eight
            people, students receive the personal attention they need to learn
            how to invest and grow their wealth better than an institution.
          </p>
        </article>
      </section>
    </Layout>
  );
};
