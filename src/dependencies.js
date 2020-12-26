import 'isomorphic-fetch';
import * as d3 from 'd3';
import clsx from 'clsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery, useMutation } from 'react-query';
import ReCAPTCHA from 'react-google-recaptcha';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LoopIcon from '@material-ui/icons/Loop';
import SvgIcon from '@material-ui/core/SvgIcon';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DoneIcon from '@material-ui/icons/Done';
import { LinearGradient } from '@visx/gradient';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { useSpring, animated } from 'react-spring';

export {
  clsx,
  /* d3 */
  d3,
  /* Spring */
  animated,
  useSpring,
  /* VISX */
  LinearGradient,
  AreaClosed,
  Line,
  Bar,
  curveMonotoneX,
  scaleTime,
  scaleLinear,
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
  useMediaQuery,
  useTheme,
  makeStyles,
  Container,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Select,
  MenuItem,
  Card,
  Grid,
  Hidden,
  SvgIcon,
  LoopIcon,
  DoneIcon,
  AttachMoneyIcon,
  /* Google ReCAPTHA */
  ReCAPTCHA,
  /* STRIPE */
  loadStripe,
};
