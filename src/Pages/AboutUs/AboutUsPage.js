import { Layout, Section, Header, Image } from '../../UI';
import { getPublicImage } from '../../Utils';
import { Toolbox } from './Toolbox';

export const PageAboutUs = () => {
  return (
    <Layout className="page-checkout">
      <Section>
        <Header variant="h1">
          About{' '}
          <b>
            Edu<span className="color--accent-main">Fina</span>
          </b>
        </Header>

        <article>
          <Section.Part type="column">
            <Section.Column>
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
                Students acquire real-world experience as they train
                side-by-side with a successful professional educator who will
                guide them through the complex financial system to allow for a
                better understanding of banks, funds, stocks, bonds, and more.
              </p>
            </Section.Column>

            <Section.Column>
              <Image
                float="right"
                name="About EduFina"
                source={getPublicImage('/about-image-02.jpg')}
              />
            </Section.Column>
          </Section.Part>

          <Toolbox />

          <Section.Part type="column">
            <Section.Column>
              <Image
                float="right"
                name="EduFina Offers"
                source={getPublicImage('/about-image-01.jpg')}
              />
            </Section.Column>

            <Section.Column>
              <p>
                EduFina offers training programs for <b>individuals</b> and{' '}
                <b>groups</b> that are tailored to each student’s level of
                experience and learning style. With class sizes limited to eight
                people, students receive the personal attention they need to
                learn how to invest and grow their wealth better than an
                institution.
              </p>
            </Section.Column>
          </Section.Part>
        </article>
      </Section>
    </Layout>
  );
};
