import { makeStyles, Card } from '../../dependencies';
import { TitleLine } from '../../UI';

const useStyles = makeStyles(({ palette, spacing }) => ({
  cardRoot: {
    color: palette.accent.contrastText,
    padding: spacing(4),
    backgroundColor: palette.accent.main,
    border: `6px solid ${palette.accent.contrastText}`,
    position: 'relative',
    zIndex: 3,
  },
  courseRoot: {
    position: 'relative',
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
      '& span': {
        fontWeight: '700',
      },
      '& button': {
        display: 'block',
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
      '& a': {
        display: 'block',
        textAlign: 'center',
        color: palette.accent.contrastText,
      },
    },
  },
  syllabus: {
    top: '-2em',
    left: 0,
    width: '10em',
    height: '10em',
    display: 'block',
    position: 'absolute',
    zIndex: 1,
    padding: '0.4em 0.8em',
    transition: '300ms ease-in-out',
    backgroundColor: '#fff',
    borderRadius: '1em 1em 0 0',
    boxShadow: '0px 0px 0.5em rgba(0,0,0,0.2)',
    '&,& a': {
      color: '#000',
      textDecoration: 'none',
    },
    '& span': {
      display: 'block',
      textAlign: 'center',
      position: 'relative',
      zIndex: 2,
    },
    '& img': {
      top: '2em',
      left: 0,
      display: 'block',
      maxWidth: '100%',
      position: 'absolute',
      zIndex: 1,
    },

    '&:hover': {
      top: '-8.4em',
    },
  },
}));

export const Course = ({ title, price, payment, syllabus, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.courseRoot}>
      <div className={classes.syllabus}>
        <a href={syllabus} rel="noopener noreferrer" target="_blank">
          <span>Syllabus</span>
          <img
            alt="Course Syllabus"
            src={syllabus.replace('.pdf', '-pdf') + '.jpg'}
          />
        </a>
      </div>

      <Card
        classes={{ root: classes.cardRoot }}
        variant="elevation"
        elevation={4}
      >
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
    </div>
  );
};
