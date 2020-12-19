import { makeStyles, useTheme } from '@material-ui/core';
import { Layout, Section, Header } from '../UI';

const useStyles = makeStyles({
  fullBlock: {
    color: '#fff',
    margin: '3rem 0',
    paddingTop: '4rem',
    paddingBottom: '4rem',
    backgroundColor: ({ theme }) => theme.palette.accent.main,
  },
  container: {
    fontSize: '1.2rem',
    '& header': {
      textAlign: 'center',
    },
    '& h1,h2,h3': {
      marginTop: 0,
    },
  },
});

export const PageAboutUs = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <Layout className="page-checkout">
      <section className={classes.container}>
        <Section>
          <Header variant="h2">Welcome to EduFina</Header>
        </Section>

        <article>
          <Section>
            <p>
              EduFina is a financial literacy school based in Montreal that
              fosters student success with one-on-one or group mentoring and
              top-of-the-line technology, and educators. Our mission is to
              provide an excellent education for our students within a
              stimulating learning environment that will enhance their
              development and potential for success in managing their finances
              and growing wealth.
            </p>
            <p>
              Students acquire real-world experience as they train side-by-side
              with a successful professional educator who will guide them
              through the complex financial system to allow for a better
              understanding of banks, funds, stocks, bonds, and more.
            </p>
          </Section>
          <Section
            bgColor="accent"
            component="section"
            className={classes.fullBlock}
          >
            <header>
              <h3>Toolbox</h3>
            </header>
            <article>Tools</article>
          </Section>
          <Section>
            <p>
              EduFina offers training programs for <b>individuals</b> and{' '}
              <b>groups</b> that are tailored to each student’s level of
              experience and learning style. With class sizes limited to eight
              people, students receive the personal attention they need to learn
              how to invest and grow their wealth better than an institution.
            </p>
          </Section>
        </article>
      </section>
    </Layout>
  );
};
