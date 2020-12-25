import { makeStyles, Card } from '../../dependencies';
import { TitleLine } from '../../UI';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    color: palette.accent.contrastText,
    padding: spacing(4),
    backgroundColor: palette.accent.main,
    border: `6px solid ${palette.accent.contrastText}`,
  },
  course: {
    '& header': {
      fontSize: '2em',
      textAlign: 'center',
      marginTop: spacing(2),
      marginBottom: spacing(7),
      '& h3': {
        margin: '0 auto',
      },
      '& div': {
        fontSize: '0.5em',
        '& span': {
          display: 'block',
          '&:nth-child(1)': {
            '& b': {
              fontWeight: 400,
              display: 'inline-block',
              marginLeft: '1em',
            },
          },
          '&:nth-child(2)': {
            fontSize: '0.8em',
          },
        },
      },
    },

    '& .content': {
      display: 'table',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontWeight: '700',
      '& a': {
        display: 'table',
        fontSize: '1.4em',
        margin: '2em auto 1em',
        padding: '0.4em 1.3em',
        textAlign: 'center',
        borderRadius: '1.4em',
        color: palette.accent.main,
        textDecoration: 'none',
        backgroundColor: palette.accent.contrastText,
        transition: '200ms ease',
        textTransform: 'capitalize',
        '&:hover': {
          color: '#000',
          backgroundColor: palette.accent2.main,
        },
      },
    },
  },
}));

export const Course = ({ title, price, payment, children }) => {
  const classes = useStyles();
  return (
    <Card classes={{ root: classes.root }} variant="elevation" elevation={4}>
      <div className={classes.course}>
        <header>
          <TitleLine>{title}</TitleLine>
          <div>
            {price && (
              <span>
                {price}
                {payment && <b>-or-</b>}
              </span>
            )}
            {payment && <span>{payment}</span>}
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </Card>
  );
};
