import React from 'react';
import { useQuery } from 'react-query';
import { makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { apiRequest } from '../fetch';
import { Header, Layout, Section } from '../UI';

const border = ({ palette }) => `1px solid ${palette.divider}`;

const usePaperStyles = makeStyles({
  container: {
    flex: '0 0 1.667%',
    minHeight: '200px',
    border,
    textAlign: 'center',
    padding: '1em',

    '& span, a': {
      display: 'block',
    },
  },
  thumbnail: {
    width: 200,
    background: 'top center no-repeat',
    backgroundSize: 'contain',
    marginBottom: '1em',

    '& img': {
      maxHeight: 200,
      visibility: 'hidden',
    },
  },
});

const Paper = ({ title, link, featured_img }) => {
  const theme = useTheme();
  const classes = usePaperStyles(theme);
  const image = featured_img || link.replace(/\.(\w+)$/, '-$1.jpg');

  return (
    <div className={classes.container}>
      <a href={link} rel="noopener noreferrer" target="_blank">
        <span
          className={classes.thumbnail}
          style={{ backgroundImage: `url("${image}")` }}
        >
          <img src={image} alt={title} />
        </span>
        <span>{title}</span>
      </a>
    </div>
  );
};

const usePapersStyles = makeStyles({
  papersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    // padding: '1em',
  },
});

export const PageArticles = () => {
  const theme = useTheme();
  const { papersContainer } = usePapersStyles(theme);
  const { isLoading, data } = useQuery(
    'papers',
    () => apiRequest({ url: '/papers' }),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  return (
    <Layout>
      <Section>
        <Header>Articles</Header>

        <Section.Part>
          {isLoading === true && <div>Loading...</div>}
          {isLoading === false && data?.data.length > 0 && (
            <div className={papersContainer}>
              {data.data.map((item) => (
                <Paper key={item.id} {...item} />
              ))}
            </div>
          )}
        </Section.Part>
      </Section>
    </Layout>
  );
};
