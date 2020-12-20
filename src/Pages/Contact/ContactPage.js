import { makeStyles, useMutation } from '../../dependencies';
import { apiRequest } from '../../fetch';
import { Button, Header, Layout, Section } from '../../UI';
import { getPublicBackgroundUrl } from '../../Utils';

const useStyle = makeStyles({
  map: {
    height: 400,
    backgroundImage: getPublicBackgroundUrl('edufina-location-map.jpg'),
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
});

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

  const { mutateAsync: doContact, ...state } = useMutation(postContact);
  console.log('data', state);

  return (
    <Layout>
      <Section>
        <Header>Contact us</Header>

        <Section.Part>
          <Button
            onClick={() =>
              doContact({
                fullname: 'Amin Paks',
                email: 'amin.pakseresht@hotmail.com',
                phone: '514 898-2010',
                notes: 'nothing is wrong',
              })
            }
          >
            Contact
          </Button>
        </Section.Part>

        <Section.Part className={classes.map}>
          <span />
        </Section.Part>
      </Section>
    </Layout>
  );
};
