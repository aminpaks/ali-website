import { DoneIcon, makeStyles, Paper } from '../../dependencies';
import { Layout, Section } from '../../UI';

const useStyles = makeStyles(({ spacing }) => ({
  successRoot: {
    flex: '1 0 100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  paper: {
    textAlign: 'center',
    padding: spacing(4),

    '& svg': {
      width: spacing(4),
      height: spacing(4),
      color: '#63B995',
      verticalAlign: 'text-bottom',
    },
  },
}));

export const PageCheckoutSuccess = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Section>
        <Section.Part type="column">
          <div className={classes.successRoot}>
            <Paper className={classes.paper}>
              <h3>
                Checkout successful <DoneIcon />
              </h3>

              <p>A representative will contact you shortly.</p>
            </Paper>
          </div>
        </Section.Part>
      </Section>
    </Layout>
  );
};
