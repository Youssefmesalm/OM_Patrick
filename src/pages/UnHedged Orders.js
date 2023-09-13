import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Chip,
  Button,

  TableRow,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
  TextField,
  Divider,
  Collapse,
  Box,
  TableHead,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// components
import {  deleteSymbol } from '../Reducer/SymbolsReducer';
import { addSymboltoTab, updateCycleTab } from '../Reducer/TabsReduces';

import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import Socket from '../components/socket';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// utton BUY if i click on Buy it will place a Buy Button SELL If i click on Sell it will place a Sell Button Close Cycle This is to close the cycle
// INFO Symbol Display the symbol
// INFO Type this is what has more lot size like buy has 0.00 sell has 0.10 then it will show Sell
// INFO Lot Array Display the lot array 0.10,0.10,0.20,0.30
// INFO Lot End Display the lot end lot size 
// INFO BE Cycle Display This will show how many BE have been hit it will look like this (4) 4 then 3 then 2 then 1 then it goes to -5 then -6 
// INFO BE $ BE after the cycle is hit 
// INFO SL 1 This is were it places a PO for T1 only 
// INFO SL 2 This is were it places a PO for T2 and on
// INFO TP 1 This is the TP for each T1 it closes at this price and places a new T1 order
// INFO TP 2 This is were it wins it will add all orders together until it = the TP2 then it closes all orders
// INFO SL Dist this is how far before SL PO is hit 
// INFO BE PnL this shows how much that cycle is down or up the total of the cycle
// INFO TP PnL this is only the T1 that wins not the T1 End
// INFO Cycle Number This is the cycle number 0452
// INFO Comment this is the same as the MT4 commments
// INFO Cycle State this were the cycle is at like T4
// Button (green actvied red no) Last Order Profit When the last order is + for the price it will hedge that order again If the cycle is more then Last order Price it closes cycle
// INFO Last Order Profit Price This the price that the order will hedge
// Button (green actvied red no) Last Order BE When the last order is + for the BE price and then backksoff to the BE Backoff Price then it hedges the cycle
// INFO Last Order BE Price This is the price that the order will hedge
// INFO Last Order BE Backoff Price This is the price that the order will hedge when it backs off
const TABLE_HEAD = [
  { id: 'BUY', label: 'BUY', alignRight: false },
  { id: 'SELL', label: 'SELL', alignRight: false },
  { id: 'Close Cycle', label: 'Close Cycle', alignRight: false },
  { id: 'Symbol', label: 'Symbol', alignRight: false },
  { id: 'Type', label: 'Type', alignRight: false },
  { id: 'Lot Array', label: 'Lot Array', alignRight: false },
  { id: 'Lot End', label: 'Lot End', alignRight: false },
  { id: 'BE Cycle', label: 'BE Cycle', alignRight: false },
  { id: 'BE $', label: 'BE $', alignRight: false },
  { id: 'SL 1', label: 'SL 1', alignRight: false },
  { id: 'SL 2', label: 'SL 2', alignRight: false },
  { id: 'TP 1', label: 'TP 1', alignRight: false },
  { id: 'TP 2', label: 'TP 2', alignRight: false },
  { id: 'SL Dist', label: 'SL Dist', alignRight: false },
  { id: 'BE PnL', label: 'BE PnL', alignRight: false },
  { id: 'TP PnL', label: 'TP PnL', alignRight: false },
  { id: 'Cycle Number', label: 'Cycle Number', alignRight: false },
  { id: 'Comment', label: 'Comment', alignRight: false },
  { id: 'Cycle State', label: 'Cycle State', alignRight: false },
  { id: 'Last Order Profit', label: 'Last Order Profit', alignRight: false },
  { id: 'Last Order Profit Price', label: 'Last Order Profit Price', alignRight: false },
  { id: 'Last Order BE', label: 'Last Order BE', alignRight: false },
  { id: 'Last Order BE Price', label: 'Last Order BE Price', alignRight: false },
  { id: 'Last Order BE Backoff Price', label: 'Last Order BE Backoff Price', alignRight: false },

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

export default function UnHedgedOrders() {

  const [USERLIST, setUSERLIST] = useState([]); //  symbol state
  const state = useSelector((state) => state.tabs);
  const [selectedSymbol, setSelectedSymbol] = useState('All');
  const Orders = useSelector((state) => state.tabs.orders);
  const activeTabId = useSelector((state) => state.tabs.ActiveTab);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);




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


  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const openOrder = (Type, hedge, symb, lot, stoploss1,stoploss2, takeprofit1, takeprofit2, tf, Comment, magicNumber,cycleState) => {

    Socket.emit('open_order', { account_id: 1, symbol: symb, volume: lot, type: Type, price: 0, sl: 0, tp: 0, comment: `${tf} ${Type} ${Comment} T${cycleState}`, index: magicNumber });
    const t = Type === 'buy' ? 'sellstop' : 'buystop';
    Socket.emit('open_order',{ account_id: 1, symbol: symb,volume: lot, type: t, price: stoploss1, sl: 0, tp: 0, comment: `${tf} ${t} ${Comment} T${cycleState}`, index: magicNumber });
  }
  const closeOrder = (event) => {
    Socket.emit('close_order')
  }
  const handleCloseAllOrdersByMagic = (magic) => {
    Socket.emit('close_order_by_magic', { magic })
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  // const filteredUsers = applySortFilter(activeTabSymbol.map((symbol, index) => ({
  //   id: index,
  //   name: symbol[0],
  //   lotArray: symbol[1],
  //   lotEnd: symbol[2],
  //   BECycles: symbol[3],
  //   BE$: symbol[4],
  //   SL1: symbol[5],
  //   SL2: symbol[6],
  //   TP1: symbol[7],
  //   TP2: symbol[8],
  //   PNL: symbol[9],
  //   LiveCycles: symbol[10],
  //   CyclesNumbers: symbol[11],
  //   Comment: symbol[12],
  //   TF: symbol[13],
  //   MaxCycles: symbol[14],
  // })), getComparator(order, orderBy), filterName);

  // const isNotFound = !filteredUsers.length && !!filterName;

  // const [openDialog, setOpenDiaog] = useState(false);

  // const handleDelete = (DeletedSymbol) => {
  //   // delete symbol from symbol state
  //   dispatch(deleteSymbol(DeletedSymbol));
  // }
  const HandleHedge = (magicNumber, symb, blots, slots) => {

    let stoploss;
    let BuysLot = 0;
    let SellsLot = 0;
    let Comment;

    Object.keys(Orders[symb][magicNumber]).map((order) => {

      if (Orders[symb][magicNumber][order].comment.includes('PO') && Orders[symb][magicNumber][order].type !== "buy" && Orders[symb][magicNumber][order].type !== "sell") {
        Socket.emit('close_order', { ticket: order });
      }
      if (Orders[symb][magicNumber][order].type === "buy") {
        BuysLot += Orders[symb][magicNumber][order].lots;
        stoploss = Orders[symb][magicNumber][order].SL;
        Comment = Orders[symb][magicNumber][order].comment;
      }
      if (Orders[symb][magicNumber][order].type === "sell") {
        SellsLot += Orders[symb][magicNumber][order].lots;
        stoploss = Orders[symb][magicNumber][order].SL;
        Comment = Orders[symb][magicNumber][order].comment;
      }
      return null;
    })
    // lot = Orders[symb][magicNumber][order].lots;
    const type1 = SellsLot > BuysLot ? "buy" : "sell";
    const lot = SellsLot > BuysLot ? SellsLot - BuysLot : BuysLot - SellsLot;
    Socket.emit('open_order', { account_id: 1, symbol: symb, volume: lot, type: type1, price: 0, sl: 0, tp: 0, comment: Comment, index: magicNumber });
  }
  const AddSymbolToTab = (selected) => {
    // update state of selected symbol then emit the selected symbol to server
    const payload = [selected, { "lotArray": [0.1, 0.1, 0.2, 0.3], "lotEnd": 10, "BECycles": 1, "BE$": 1, "SL1": 10, "SL2": 10, "TP1": 1, "TP2": 10, "PNL": 0, "LiveCycles": 0, "CyclesNumbers": [], "Comment": selected, "TF": "H1", "MaxCycles": 10 }, activeTabId];
    dispatch(addSymboltoTab(payload));
    Socket.emit('update_tabs', state)
  }


  const CloseCycle = async (magicNumber) => {
    try {
      Socket.emit('close_order_by_magic', { 'magic': magicNumber });
    } catch (err) {
      console.log(err);
    }
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
        <title> EA1 | Unhdged Orders </title>
      </Helmet>
      <Stack sx={{ mt: 3, ml: 10 }} >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            UNHedged Orders (EA1)
          </Typography>

        </Stack>

        <Scrollbar>
          <Stack direction="row" spacing={1} maxWidth="100%" >
            <Chip label='All' clickable onClick={() => setSelectedSymbol('All')} />
            {Object.keys(Orders).map((symbol, idx) => (
              <Chip key={idx} label={symbol} onClick={() => setSelectedSymbol(symbol)} clickable />
            ))
            }
          </Stack>
        </Scrollbar>
        <Divider sx={{ m: 3 }} />


        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead

                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {
                    Object.keys(state.Cycles).map((symbol, idx) => {
                      // Your code here
                      if (symbol === selectedSymbol || selectedSymbol === 'All') {
                        return Object.keys(state.Cycles[symbol]).map((magic, id) => {
                          const selectedUser = selected.indexOf(magic) !== -1;
                          let type = '';
                          // console.log(magic, symbol);
                          let Render = false;
                          let Render1 = false;
                          let BuysLot = 0;
                          let SellsLot = 0;
                          let CycleProfit = 0;
                          const tabNumber = magic.toString().slice(0, -4);
                          const LotArray = state.Cycles[symbol][magic].lotArray;
                          const LotEnd = state.Cycles[symbol][magic].lotEnd;
                          const sl1 = state.Cycles[symbol][magic].SL1;
                          const sl2 = state.Cycles[symbol][magic].SL2;
                          const tp1 = state.Cycles[symbol][magic].TP1;
                          const tp2 = state.Cycles[symbol][magic].TP2;
                          const BECycles = state.Cycles[symbol][magic].BECycles;
                          const { Comment } = state.tabs[tabNumber].Symbols[symbol];
                          let CycleState = 0;
                          let tpPnl = 0;
                          Object.keys(Orders[symbol][magic]).map((order, idx) => {

                            if (!Orders[symbol][magic][order].comment.includes('END') && !Orders[symbol][magic][order].comment.includes('PO')) {
                              tpPnl += Orders[symbol][magic][order].pnl;
                              const str = Orders[symbol][magic][order].comment;
                              const match = str.match(/\((\d+)\)/);
                              CycleState = match ? match[1] : null;
                            }
                            if (Orders[symbol][magic][order].comment.includes('PO') && (Orders[symbol][magic][order].type === 'buy' || Orders[symbol][magic][order].type === 'sell')) { Render1 = true }
                            CycleProfit += Orders[symbol][magic][order].pnl;
                            if (Orders[symbol][magic][order].type === 'buy' ) {
                              BuysLot += Orders[symbol][magic][order].lots;
                            } else if (Orders[symbol][magic][order].type === 'sell' ) {
                              SellsLot += Orders[symbol][magic][order].lots;
                            }
                            return null;
                          });
                          if (BuysLot !== SellsLot
                            && Render1) { Render = true }
                          else { Render = false }
                          type = BuysLot > SellsLot ? 'buy' : BuysLot < SellsLot ? 'sell' : '';

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
                                    <Button onClick={() =>openOrder('buy', true, symbol, 0.1, sl1, sl1, tp1, tp2, 'M1', Comment, magic, CycleState)} variant="contained" color="inherit">  Buy </Button>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Button onClick={() =>  openOrder('sell', true, symbol, 0.1, sl1, sl1, tp1, tp2, 'M1', Comment, magic, CycleState)} variant="contained" color="success">  Sell </Button>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Button onClick={() => HandleHedge(magic, symbol, BuysLot, SellsLot)} variant="contained" color="inherit">  Close </Button>
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
                                  {/* <TableCell align="left"><Typography variant="subtitle2" noWrap>T{CycleState}</Typography></TableCell> */}
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
