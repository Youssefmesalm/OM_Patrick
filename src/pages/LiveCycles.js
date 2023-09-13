import { Helmet } from 'react-helmet-async';
import { filter, sample } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Chip,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  Divider,
  Tooltip,
  Collapse,
  Box,
  TableHead,
} from '@mui/material';
// components
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { addSymboltoTab, deleteTabSymbol, updateTabSymbol, setAccount, setOrders, updateCycleTab } from '../Reducer/TabsReduces';
import TabsWrappedLabel from '../components/scrollableTabs/ScrollabarTab';
import AddSymbolsDialog from '../components/Dialogs/AddSymbolDialog';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import Socket from '../components/socket';



// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// 
// 
// SL Dist this is how far before SL PO is hit 
// INFO BE PnL this shows how much that cycle is down or up the total of the cycle
// INFO TP PnL this is only the T1 that wins not the T1 End
// INFO Cycle Number This is the cycle number 0452
// INFO Comment this is the same as the MT4 comments
// INFO Cycle State this were the cycle is at like T4
// INFO Arrow 

const TABLE_HEAD = [
  { id: 'Close Cycle', label: 'Close Cycle', alignRight: false },
  { id: 'Hedge', label: 'Hedge', alignRight: false },
  { id: 'Symbol', label: 'Symbol', alignRight: false },
  { id: 'Type', label: 'Type', alignRight: false },
  { id: 'Lot Array', label: 'Lot Array', alignRight: false },
  { id: 'Lot End', label: 'Lot End', alignRight: false },
  { id: 'BE Cycle Display', label: 'BE Cycle Display', alignRight: false },
  { id: 'BE $', label: 'BE $', alignRight: false },
  { id: 'sl1', label: 'SL1', alignRight: false },
  { id: 'sl2', label: 'SL2', alignRight: false },
  { id: 'tp1', label: 'TP1', alignRight: false },
  { id: 'tp2', label: 'TP2', alignRight: false },
  { id: 'SL Dist', label: 'SL Dist', alignRight: false },
  { id: 'BE PnL', label: 'BE PnL', alignRight: false },
  { id: 'TP PnL', label: 'TP PnL', alignRight: false },
  { id: 'Cycle Number', label: 'Cycle Number', alignRight: false },
  { id: 'Comment', label: 'Comment', alignRight: false },
  { id: 'Cycle State', label: 'Cycle State', alignRight: false },
  { id: 'Arrow', label: 'Arrow', alignRight: false },

];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {



  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// function applySortFilter(array, comparator, query) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   if (query) {
//     return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//   }
//   return stabilizedThis.map((el) => el[0]);
// }

export default function LiveCycles() {
  const [USERLIST, setUSERLIST] = useState([]); //  symbol state
  const state = useSelector((state) => state.tabs);
  const [selectedSymbol, setSelectedSymbol] = useState('All');
  const Orders = useSelector((state) => state.tabs.orders);
  const Cycles = useSelector((state) => state.tabs.Cycles);
  const activeTabId = useSelector((state) => state.tabs.ActiveTab);
  const activeTabSymbol = useSelector((state) => state.tabs.activeTabSymbol);
  const dispatch = useDispatch();




  useEffect(() => {
    Socket.emit('update_tabs', state);
  }, [state]);
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const openOrder = (Type, hedge, symb, lot, HedgePrice, stoploss, takeprofit1, takeprofit2, tf, Comment, index) => {

    Socket.emit('open_order', { account_id: 1, symbol: symb, volume: lot[0], type: Type, price: 0, sl: stoploss, tp: takeprofit1, comment: `${Comment} (1) ${tf} T1`, index });
    Socket.emit('open_order', { account_id: 1, symbol: symb, volume: lot[1], type: Type, price: 0, sl: stoploss, tp: takeprofit2, comment: `${Comment} (END) ${tf} T1`, index });
    Socket.emit('open_order', { account_id: 1, symbol: symb, volume: lot[2], type: hedge, price: HedgePrice, sl: stoploss, tp: 0, comment: `${Comment} (PO) ${tf} T2`, index });
  }
  const closeOrder = (event) => {
    Socket.emit('close_order')
  }
  const handleCloseAllOrdersBySymbols = (symb) => {
    Socket.emit('close_all_orders_by_symbol', { symbol: symb })
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;


  const CloseCycle = async (magicNumber) => {
    try {
      Socket.emit('close_order_by_magic', { 'magic': magicNumber });
    } catch (err) {
      console.log(err);
    }
  }

  const HandleHedge = (magicNumber, symb, blots, slots) => {
    const lot = blots > slots ? blots - slots : slots - blots;
    let type1;
    let stoploss;

    let Comment;

    Object.keys(Orders[symb][magicNumber]).map((order) => {

      if (Orders[symb][magicNumber][order].comment.includes('PO') && Orders[symb][magicNumber][order].type !== "buy" && Orders[symb][magicNumber][order].type !== "sell") {
        Socket.emit('close_order', { ticket: order });
        // lot = Orders[symb][magicNumber][order].lots;
        type1 = Orders[symb][magicNumber][order].type === "buystop" ? "buy" : "sell";
        stoploss = Orders[symb][magicNumber][order].SL;
        Comment = Orders[symb][magicNumber][order].comment;

      }
      return null;
    })
    Socket.emit('open_order', { account_id: 1, symbol: symb, volume: lot, type: type1, price: 0, sl: 0, tp: 0, comment: Comment, index: magicNumber });
  }
  const UpdateTabSymbols = async (symbolName, magic, ChangedValue, idx) => {
    try {
      const payload = [symbolName, magic, ChangedValue, idx, activeTabId];
      dispatch(updateCycleTab(payload));
      Socket.emit('update_tabs', state);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>

      <Helmet>
        <title> EA1 | Live Cycles </title>
      </Helmet>
      <Stack sx={{ mt: 3, ml: 10 }} >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Live Cycles(EA1)
          </Typography>

        </Stack>

        <Scrollbar>
          <Stack direction="row" spacing={1} maxWidth="100%" >
            <Chip label='All' clickable onClick={() => setSelectedSymbol('All')} />
            {Object.keys(state.Cycles).map((symbol, idx) => (
              <Chip key={idx} label={symbol} onClick={() => setSelectedSymbol(symbol)} clickable />
            ))
            }
          </Stack>
        </Scrollbar>
        <Divider sx={{ mb: 5 }} />


        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>

                  {
                    Object.keys(Orders).map((symbol, idx) => {
                      // Your code here
                      if (symbol === selectedSymbol || selectedSymbol === 'All') {
                        return Object.keys(Orders[symbol]).map((magic, id) => {
                          const selectedUser = selected.indexOf(magic) !== -1;
                          let type = '';
                          // console.log(magic, symbol);
                          let Render = false;
                          let BuysLot = 0;
                          let SellsLot = 0;
                          let CycleProfit = 0;
                          const tabNumber = magic.toString().slice(0, -4);
                          const LotArray = state.Cycles[symbol][magic]?.lotArray||[];
                          const LotEnd = state.Cycles[symbol][magic].lotEnd;
                          const sl1 = state.Cycles[symbol][magic].SL1;
                          const sl2 = state.Cycles[symbol][magic].SL2;
                          const tp1 = state.Cycles[symbol][magic].TP1;
                          const tp2 = state.Cycles[symbol][magic].TP2;
                          const BECycles = state.Cycles[symbol][magic].BECycles;
                          const { Comment } = state.Cycles[symbol][magic];
                          let CycleState = 0;
                          let tpPnl = 0;
                          Object.keys(Orders[symbol][magic]).map((order, idx) => {
                            if (!Orders[symbol][magic][order].comment.includes('END') && !Orders[symbol][magic][order].comment.includes('PO')) {
                              tpPnl += Orders[symbol][magic][order].pnl;
                              const str = Orders[symbol][magic][order].comment;
                              const match = str.match(/\((\d+)\)/);
                              CycleState = match ? match[1] : null;
                            }
                            if (Orders[symbol][magic][order].comment.includes('PO') && (Orders[symbol][magic][order].type === 'buystop' || Orders[symbol][magic][order].type === 'sellstop')) { Render = true }
                            CycleProfit += Orders[symbol][magic][order].pnl;
                            if (Orders[symbol][magic][order].type === 'buy') {
                              BuysLot += Orders[symbol][magic][order].lots;
                            } else if (Orders[symbol][magic][order].type === 'sell') {
                              SellsLot += Orders[symbol][magic][order].lots;
                            }
                            return null;
                          });
                          type = BuysLot > SellsLot ? 'buy' : BuysLot < SellsLot ? 'sell' : '';
                          // get the tab number from magic number

                          return (
                            <>
                              {Render && <>
                                <TableRow key={idx}>
                                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={20}>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                      <Box sx={{ margin: 1 }}>

                                        <Table >
                                          <TableHead>


                                            <TableRow>
                                              <TableCell>Order ID</TableCell>
                                              <TableCell>Cycle Number</TableCell>
                                              <TableCell align="right">Lots</TableCell>
                                              <TableCell align="right">Type</TableCell>
                                              <TableCell align="right">Open Price</TableCell>
                                              <TableCell align="right">Open Time</TableCell>
                                              <TableCell align="right">SL</TableCell>
                                              <TableCell align="right">TP</TableCell>
                                              <TableCell align="right">PnL</TableCell>
                                              <TableCell align="right">Commission</TableCell>
                                              <TableCell align="right">Swap</TableCell>
                                              <TableCell align="right">Comment</TableCell>

                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {Object.keys(Orders[symbol][magic]).map((order, idx) => (
                                              <TableRow key={order}>


                                                <TableCell component="th" scope="row">
                                                  {order}
                                                </TableCell>
                                                <TableCell>{Orders[symbol][magic][order].magic}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].lots}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].type}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].open_price}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].open_time}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].SL}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].TP}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].pnl}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].commission}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].swap}</TableCell>
                                                <TableCell align="right">{Orders[symbol][magic][order].comment}</TableCell>


                                              </TableRow>

                                            ))}
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                                <TableRow hover key={id} >
                                  <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setOpen(!open)}
                                  >
                                    {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                                  </IconButton>
                                  <TableCell align="left">
                                    <Button onClick={() => CloseCycle(magic)} variant="contained" color="inherit">  Close </Button>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Button onClick={() => HandleHedge(magic, symbol, BuysLot, SellsLot)} variant="contained" color="success">  Hedge </Button>
                                  </TableCell>
                                  <TableCell component="th" scope="row" padding="none">
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                      <Typography variant="subtitle2" noWrap>
                                        {symbol}
                                      </Typography>
                                    </Stack>
                                  </TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>{type}</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(symbol, magic, e.target.value.split(",").map(num => parseFloat(num)), 'LotArray')} defaultValue={LotArray} /></Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(symbol, magic, parseFloat(e.target.value), 'lotEnd')} defaultValue={LotEnd} /></Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>({BECycles - CycleState})</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>{magic}</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(symbol, magic, parseFloat(e.target.value), 'SL1')} defaultValue={sl1} /></Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(symbol, magic, parseFloat(e.target.value), 'SL2')} defaultValue={sl2} /></Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(symbol, magic, parseFloat(e.target.value), 'TP1')} defaultValue={tp1} /></Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(symbol, magic, parseFloat(e.target.value), 'TP2')} defaultValue={tp2} /></Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>{symbol}</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>{CycleProfit.toFixed(2)}</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>{tpPnl.toFixed(2)}</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>{magic}</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>{Comment}</Typography></TableCell>
                                  <TableCell align="left"><Typography variant="subtitle2" noWrap>T{CycleState}</Typography></TableCell>
                                  {
                                    CycleProfit > 0 && <TableCell align="left" ><Typography variant="subtitle2" noWrap><svg width="24" height="24" viewBox="0 0 24 24">
                                      <path d="M12 2L22 12H16V22H8V12H2L12 2Z" fill="green" />
                                    </svg></Typography>
                                    </TableCell>
                                  }
                                  {
                                    CycleProfit < 0 && <TableCell align="left"><Typography variant="subtitle2" noWrap><svg width="24" height="24" viewBox="0 0 24 24">
                                      <path d="M12 22L2 12H8V2H16V12H22L12 22Z" fill="red" />
                                    </svg></Typography>
                                    </TableCell>
                                  }



                                </TableRow>
                              </>}



                            </>
                          );
                        });
                      }
                      return null;
                    })

                  }

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )
                  }

                </TableBody>

                {/* {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                          >
                          <Typography variant="h6" paragraph>
                          Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )} */}
              </Table>
            </TableContainer>
          </Scrollbar>

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Card>
      </Stack >


    </>
  );

}
