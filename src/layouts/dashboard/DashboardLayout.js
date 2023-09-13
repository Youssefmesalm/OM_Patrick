import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//


import Header from './header';
import Nav from './nav';
import OM2Header from './header/OM2Header';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;
const NAV_WIDTH = 280;

const OuterMain = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `+${NAV_WIDTH}px`,
  }),
}));


// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  console.log(location.pathname);
  return (
    <OuterMain open={open}>
      {location.pathname === '/HedgedOrders' && <OM2Header onOpenNav={() => setOpen(!open)} />}
      {location.pathname !== '/HedgedOrders' && <Header onOpenNav={() => setOpen(!open)} />}
      <Nav openNav={open} onCloseNav={() => setOpen(!open)} />
      <Outlet />
    </OuterMain>
  );
}
