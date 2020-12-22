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
import LoopIcon from '@material-ui/icons/Loop';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
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
  Select,
  MenuItem,
  LoopIcon,
  AttachMoneyIcon,
  /* Google ReCAPTHA */
  ReCAPTCHA,
};
