import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
// import SimpleLayout from './layouts/simple';
//

import PlacyingCycles from './pages/PlacyindCycles';
// import Page404 from './pages/Page404';
import HedgedOrders from './pages/Hedged Orders';
import UnHedgedOrders from './pages/UnHedged Orders';
import LiveCycles from './pages/LiveCycles';
import LoginPage from './pages/LoginPage';
import RequireToken from './sections/auth/login/Auth';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <RequireToken><DashboardLayout /></RequireToken>,
      children: [
        { element: <Navigate to="/EA1" />, index: true },
        { path: '/', element:<RequireToken><PlacyingCycles /></RequireToken>  },
        { path: 'EA1', element:<RequireToken><PlacyingCycles /></RequireToken>  },
        { path: 'LiveCycles', element:<RequireToken><LiveCycles /></RequireToken>  },
        // open in new window
        { path: 'HedgedOrders', element: <HedgedOrders /> },
        { path: 'UnHedgedOrders', element: <UnHedgedOrders /> }
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    
  ]);

  return routes;
}
