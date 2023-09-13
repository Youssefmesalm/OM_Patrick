// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [

  {
    title: 'Placying Cycles(EA1)',
    path: '/EA1',
    icon: icon('ic_user'),
  },
  {
    title: 'Live Cycles(EA1)',
    path: '/LiveCycles',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Login',
    path: '/Login',
    icon: icon('ic_lock'),
  },



];

export default navConfig;
