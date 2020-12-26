import { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  useMutation,
  TextField,
  LoopIcon,
  ReCAPTCHA,
  Typography,
  useLocation,
  Grid,
  PhoneIcon,
  TextsmsIcon,
  BusinessIcon,
  DraftsIcon,
} from '../../dependencies';
import { apiRequest } from '../../fetch';
import { Button, Header, Layout, Section } from '../../UI';
import { DisplayError } from '../../UI/DisplayError';
import { getPublicBackgroundUrl } from '../../Utils';

const useStyle = makeStyles(({ palette, spacing, breakpoints }) => ({
  map: {
    height: 400,
    backgroundImage: getPublicBackgroundUrl('edufina-location-map.jpg'),
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
  formControl: {
    minWidth: 320,
    display: 'flex',
    margin: spacing(1),
    marginBottom: spacing(2),
    [breakpoints.up('md')]: {
      maxWidth: 600,
    },
  },
  successMessage: {
    marginBottom: spacing(4),
    '& .heading': {
      marginBottom: spacing(2),
    },
  },
  reachOut: {
    display: 'block',
    borderLeft: '1px solid ' + palette.accent.main,
    paddingLeft: spacing(4),
    '& > div': {
      marginTop: spacing(1),
      marginBottom: spacing(1),
      '& > div': {
        marginLeft: spacing(1),
        display: 'inline-block',
      },
      '&:nth-child(4)': {
        '& > div': {
          marginLeft: spacing(1.6),
        },
        '& svg': {
          verticalAlign: 'top',
        },
      },
    },
    '& span': {
      display: 'block',
    },
    '& svg': {
      color: palette.accent.main,
      display: 'inline-block',
      verticalAlign: 'text-bottom',
    },
  },
}));

const postContact = ({ fullname, email, phone, notes }) =>
  apiRequest(
    { url: `/contact` },
    {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname,
        email,
        phone,
        notes,
      }),
    }
  );

export const PageContact = () => {
  const classes = useStyle();

  const location = useLocation();

  const [formFields, setFormFields] = useState({});
  const handleFormFieldUpdate = useCallback(
    ({ target }) =>
      setFormFields((s) => ({ ...s, [target.name]: target.value })),
    []
  );

  const { mutate: doContact, isLoading, error, isError, data } = useMutation(
    postContact,
    {
      retry: false,
      onSuccess: () => {
        setFormFields({});
      },
    }
  );
  const errors = isError ? error.message : '';
  const fullnameError =
    errors.indexOf('fullname') > 0
      ? 'Provide a valid fullname, it must be longer than 3 characters'
      : undefined;
  const emailError =
    errors.indexOf('email') > 0 ? 'Provide a valid email address' : undefined;
  const phoneError =
    errors.indexOf('phone') > 0
      ? 'Provide a valid phone number ex: (999) 999-9999'
      : undefined;
  const notesError =
    errors.indexOf('notes') > 0
      ? `Provide at least 20 characters what you would like to know`
      : undefined;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.has('from') ? params.get('from').toLowerCase() : '';
    if (from === 'courses' && !formFields.notes) {
      handleFormFieldUpdate({
        target: {
          name: 'notes',
          value: `I would like to buy your course.\nHere is how I would like to pay...`,
        },
      });
    }
  }, [location.search, handleFormFieldUpdate, formFields.notes]);

  return (
    <Layout>
      <Section>
        <Header>Contact us</Header>

        <Section.Part>
          <Grid container spacing={10}>
            <Grid item sm={12} md={6}>
              {data?.success && (
                <div className={classes.successMessage}>
                  <Typography variant="h3" className="heading">
                    Success!
                  </Typography>
                  <Typography variant="body1">
                    You're message has been sent out. We will reach out to as
                    soon as possible.
                  </Typography>
                </div>
              )}
              {isError && <DisplayError failure={error} />}
              <TextField
                label="Fullname"
                name="fullname"
                value={formFields['fullname'] ?? ''}
                error={Boolean(fullnameError)}
                helperText={fullnameError}
                className={classes.formControl}
                onChange={handleFormFieldUpdate}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formFields['email'] ?? ''}
                error={Boolean(emailError)}
                helperText={emailError}
                className={classes.formControl}
                onChange={handleFormFieldUpdate}
              />

              <TextField
                label="Phone"
                name="phone"
                type="phone"
                value={formFields['phone'] ?? ''}
                error={Boolean(phoneError)}
                helperText={phoneError}
                className={classes.formControl}
                onChange={handleFormFieldUpdate}
              />

              <TextField
                multiline
                label="Notes"
                name="notes"
                type="notes"
                value={formFields['notes'] ?? ''}
                error={Boolean(notesError)}
                helperText={notesError}
                className={classes.formControl}
                onChange={handleFormFieldUpdate}
              />

              <div className={classes.formControl}>
                <ReCAPTCHA
                  sitekey="6LeFcg4aAAAAAFvvptMQur7OvVcc6MI6jnZJ6xaW"
                  onChange={(value) => {
                    handleFormFieldUpdate({
                      target: { name: 'captcha', value },
                    });
                  }}
                />
              </div>

              <Button
                style={{ marginTop: '1rem' }}
                disabled={isFormStateValid(formFields)}
                onClick={() => {
                  doContact(formFields);
                }}
                startIcon={isLoading && <LoopIcon />}
              >
                Contact
              </Button>
            </Grid>
            <Grid item sm={12} md={6}>
              <div className={classes.reachOut}>
                <div>
                  <DraftsIcon />{' '}
                  <div>
                    <span>info@edufina.ca</span>
                  </div>
                </div>
                <div>
                  <PhoneIcon /> <div>(514) 999-1010</div>
                </div>
                <div>
                  <TextsmsIcon /> <div>(514) 999-1010</div>
                </div>
                <div>
                  <BusinessIcon />
                  <div>
                    <span>7575 Trans Canada Route</span>
                    <span>Saint-Laurent, QC</span>
                    <span>H4T 1V6</span>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Section.Part>

        <Section.Part className={classes.map}>
          <span />
        </Section.Part>
      </Section>
    </Layout>
  );
};

function isFormStateValid(state) {
  return (
    Object.entries(state).reduce(
      (acc, [, i]) => (i?.length > 0 ? acc.concat(i) : acc),
      []
    ).length < 5
  );
}
