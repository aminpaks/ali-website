import 'isomorphic-fetch';
import clsx from 'clsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useQuery, useMutation } from 'react-query';
import LoopIcon from '@material-ui/icons/Loop';
import ReCAPTCHA from 'react-google-recaptcha';

export {
  clsx,
  useMediaQuery,
  useTheme,
  makeStyles,
  /* Router */
  useLocation,
  Link,
  Route,
  Router,
  Switch,
  /* Query */
  useMutation,
  useQuery,
  /* Material UI */
  Container,
  TextField,
  Typography,
  LoopIcon,
  /* Google ReCAPTHA */
  ReCAPTCHA,
};
