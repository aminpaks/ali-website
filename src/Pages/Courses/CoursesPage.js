import { useState } from 'react';
import { Button, Header, Layout, Section, Image, useStripe } from '../../UI';
import {
  SvgIcon,
  makeStyles,
  useMutation,
  LoopIcon,
  Link,
  Grid,
  Hidden,
} from '../../dependencies';
import { Course } from './Course';
import { getPublicImage } from '../../Utils';
import { apiRequest } from '../../fetch';

const useStyles = makeStyles(({ breakpoints }) => ({
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
  boxContainer: {
    marginBottom: '2rem',
    padding: '4rem 0',
  },
  quote: {
    marginLeft: 'auto',
    marginRight: 'auto',
    [breakpoints.between('sm', 'md')]: {
      display: 'table',
      maxWidth: '60%',
    },
    [breakpoints.up('md')]: {
      display: 'flex',
      fontSize: '3rem',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& img': {
      display: 'block',
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      [breakpoints.down('sm')]: {
        maxWidth: '60%',
      },
    },
    '& > div': {
      '& > p': {
        display: 'table',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      boxSizing: 'border-box',
      '&:nth-child(1)': {
        flex: '0 0 220px',
      },
      '&:nth-child(2)': {
        flex: '0 0 auto',
        paddingLeft: '4rem',
      },
      [breakpoints.down('md')]: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      [breakpoints.up('md')]: {
        // '&:nth-child(1)': {
        // },
        '&:nth-child(2)': {
          paddingLeft: '6rem',
        },
      },
    },
    '& svg': {
      width: '6em',
      height: '6em',
      fontSize: '0.3rem',
      position: 'absolute',
      color: '#888',
      [breakpoints.up('md')]: {
        fontSize: '0.8rem',
      },
      '&.quote-start': {
        marginLeft: '-7em',
        [breakpoints.down('md')]: {
          marginLeft: '-8em',
        },
      },
      '&.quote-end': {
        marginLeft: '1.2em',
        [breakpoints.down('md')]: {
          marginLeft: '2.2em',
        },
      },
    },
  },
  courseSyllabus: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '24%',
    '& img': {
      maxWidth: '100%',
    },
  },
}));

const createCheckoutSession = ({ courseType }) =>
  apiRequest(
    { url: '/payments/sessions' },
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_type: courseType,
      }),
    }
  );

export const PageCourses = () => {
  const classes = useStyles();

  const [isButtonLoading, setButtonLoading] = useState('none');
  const { stripe, isLoading: isLoadingStripe } = useStripe();
  const { mutate: createSession, isLoading: isCreatingSession } = useMutation(
    createCheckoutSession,
    {
      onMutate: ({ courseType }) => {
        setButtonLoading(courseType);
      },
      onSettled: () => {
        setButtonLoading('none');
      },
      onSuccess: ({ data }) => {
        stripe.redirectToCheckout(data);
      },
    }
  );
  const isLoading = !Boolean(stripe) || isLoadingStripe || isCreatingSession;

  return (
    <Layout>
      <Section>
        <Header>Courses</Header>

        <Section.Part>
          <Grid container spacing={4}>
            <Grid item md={7}>
              <div className={classes.content}>
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
            </Grid>
            <Grid item md={5}>
              <Hidden smDown>
                <Image source={getPublicImage('courses-img-01.jpg')} />
              </Hidden>
            </Grid>
          </Grid>
        </Section.Part>

        <Section.Part variant="compact" className={classes.coursesSection}>
          <Grid container spacing={8}>
            <Grid item xs={12} lg={6}>
              <Course
                title="Standard"
                price={'$3,500'}
                payment="contact us for installments"
                syllabus="https://api.edufina.ca/wp-content/uploads/Course-Syllabus-Standard.pdf"
              >
                <p>Full Financial Literacy</p>
                <ul>
                  <li>Split with up to 8 friends</li>
                  <li>7 x 3-hour courses</li>
                  <li>Classroom setting</li>
                  <li>Group Q&amp;A</li>
                  <li>Money-back guarantee</li>
                </ul>
                <div>
                  <Button
                    disabled={isLoading}
                    endIcon={isButtonLoading === 'standard' && <LoopIcon />}
                    className={'register animate-rotate-svg'}
                    onClick={() => createSession({ courseType: 'standard' })}
                  >
                    Register Now
                  </Button>
                </div>
                <div>
                  <Link to="/contact">Contact us</Link>
                </div>
              </Course>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Course
                title="Intensive"
                price={'$5,000'}
                payment="contact us for installments"
                syllabus="https://api.edufina.ca/wp-content/uploads/Course-Syllabus-Intensive.pdf"
              >
                <p>Full Financial Literacy</p>
                <ul>
                  <li>One-on-one sessions</li>
                  <li>3 x 5-hour courses</li>
                  <li>Personalized feedback</li>
                  <li>Out-of-class support</li>
                  <li>Money-back guarantee</li>
                </ul>
                <div>
                  <Button
                    disabled={isLoading}
                    endIcon={isButtonLoading === 'intensive' && <LoopIcon />}
                    className={'animate-rotate-svg'}
                    onClick={() => createSession({ courseType: 'intensive' })}
                  >
                    Register Now
                  </Button>
                </div>
                <div>
                  <Link to="/contact">Contact us</Link>
                </div>
              </Course>
            </Grid>
          </Grid>
        </Section.Part>

        <Section.Part>
          <div className={classes.quote}>
            <div>
              <img
                src={getPublicImage('franklin-face.png')}
                alt="Benjamin Franklin"
              />
            </div>
            <div>
              <p>
                <SvgIcon className="quote-start" viewBox="0 0 1000 1000">
                  <g>
                    <path
                      d="M359.5,0C173.9,84,0,284,0,542.2c0,159.5,101.5,275.5,226.1,275.5c130.5,0,197.2-98.6,197.2-188.5
		c0-104.3-72.5-185.6-179.8-185.6c-31.9,0-63.8,8.7-81.2,23.2c0-127.6,101.4-278.4,258-356.6L359.5,0z M916.2,0
		C730.6,84,553.8,284.1,553.8,542.2c0,159.5,104.4,275.5,229,275.5c130.5,0,197.2-98.6,197.2-188.5c0-104.3-72.5-185.6-182.7-185.6
		c-31.9,0-60.9,8.7-78.3,23.2c0-127.6,101.5-278.4,258-356.6L916.2,0z"
                    />
                  </g>
                </SvgIcon>{' '}
                <span>
                  An investment in knowledge
                  <br /> pays the best interest
                </span>{' '}
                <SvgIcon className="quote-end" viewBox="0 0 1000 1000">
                  <g>
                    <path
                      d="M559.7,110.2c156.6,78.2,258,229,258,356.6c-17.4-14.5-49.3-23.2-81.2-23.2c-107.3,0-179.8,81.3-179.8,185.6
		c0,89.9,66.7,188.5,197.2,188.5c124.6,0,226.1-116,226.1-275.5C980,284,806.1,84,620.5,0L559.7,110.2z M3,110.2
		c156.5,78.2,258,229,258,356.6c-17.4-14.5-46.4-23.2-78.3-23.2C72.5,443.6,0,524.9,0,629.2c0,89.9,66.7,188.5,197.2,188.5
		c124.6,0,229-116,229-275.5C426.2,284.1,249.4,84,63.8,0L3,110.2z"
                    />
                  </g>
                </SvgIcon>
              </p>
            </div>
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};
