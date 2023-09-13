import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, IconButton, Divider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@emotion/react';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import HedgeConfig from './Hedgeconfig';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const MDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const account = useSelector((state) => state.tabs.Account);
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      
    

      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />  
        {openNav&& <Typography variant="h6" sx={{ ml: 2, my: 1, color: 'HighlightText' }}>
      Order Manager
    </Typography>
}
        
      </Box>

      <Box sx={{ mb: 5 }}>
        {/* <Link underline="none">
          <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL"  />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {account['name']}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account["number"]}
              </Typography>
            </Box>
          </StyledAccount>
        </Link> */}
      </Box>

      {(pathname !== "/HedgedOrders" && pathname !== "/UnHedgedOrders") && <NavSection data={navConfig} />}
      {pathname === "/UnHedgedOrders" && <NavSection data={HedgeConfig} />}
      {pathname === "/HedgedOrders" && <NavSection data={HedgeConfig} />}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <MDrawer variant="permanent" open={openNav}>
      <DrawerHeader>
     
        <IconButton onClick={onCloseNav}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {renderContent}
    </MDrawer>

  );
}
