// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const HedgeConfig = [

  {
    title: 'Trade4 Hedged Orders',
    path: '/HedgedOrders',
    icon: icon('ic_user'),
  },
  {
    title: 'Trade4 Unhedged Orders',
    path: '/UnHedgedOrders',
    icon: icon('ic_lock'),
  },

];

export default HedgeConfig;
