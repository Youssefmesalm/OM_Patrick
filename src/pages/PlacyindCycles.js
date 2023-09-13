import { Helmet } from 'react-helmet-async';
import { filter, sample } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,

  Button,

  TableRow,
  TableBody,
  TableCell,

  Typography,
  IconButton,
  TableContainer,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
// components
import { faker } from '@faker-js/faker';
import { setSymbols, deleteSymbol } from '../Reducer/SymbolsReducer';
import { addSymboltoTab, deleteTabSymbol, updateTabSymbol, setAccount, setOrders, deleteTab } from '../Reducer/TabsReduces';

import TabsWrappedLabel from '../components/scrollableTabs/ScrollabarTab';
import AddSymbolsDialog from '../components/Dialogs/AddSymbolDialog';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import Socket from '../components/socket';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'symbol', label: 'Symbol', alignRight: false },
  { id: 'lot array', label: 'Lot Array', alignRight: false },
  { id: 'lot end', label: 'Lot End', alignRight: false },
  { id: 'BE cycles', label: 'BE Cycles', alignRight: false },
  { id: 'BE $', label: 'BE $', alignRight: false },
  { id: 'sl1', label: 'SL1', alignRight: false },
  { id: 'sl2', label: 'SL2', alignRight: false },
  { id: 'tp1', label: 'TP1', alignRight: false },
  { id: 'tp2', label: 'TP2', alignRight: false },
  { id: 'pnl', label: 'PNL', alignRight: false },
  { id: 'live Cycles', label: 'Live Cycles', alignRight: false },
  { id: 'Cycle Numbers', label: 'Cycle Numbers', alignRight: false },
  { id: 'comments', label: 'Comments', alignRight: false },
  { id: 'Timeframe', label: 'Timeframe', alignRight: false },
  { id: 'Max Cycles', label: 'Max Cycles', alignRight: false },
  { id: 'Buy', label: 'Buy', alignRight: false },
  { id: 'Sell', label: 'Sell', alignRight: false },
  { id: 'Close All', label: 'Close All', alignRight: false },
  { id: 'Auto', label: 'Auto', alignRight: false },

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

export default function PlacyingCycles() {
  const [balance, setBalance] = useState(0);
  const [equity, setEquity] = useState(0);
  const [USERLIST, setUSERLIST] = useState([]); //  symbol state
  const state = useSelector((state) => state.tabs);
  const tabs = useSelector((state) => state.tabs.tabs);
  const activeTabId = useSelector((state) => state.tabs.ActiveTab);
  const activeTabSymbol = useSelector((state) => state.tabs.activeTabSymbol);
  const dispatch = useDispatch();
  const symbols = useSelector((state) => state.symbols.Symbols);



  // useEffect(() => {
  //   Socket.emit('update_tabs', state);
  // }, [state]);
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

  const handleCloseAllOrdersBySymbols = (symb) => {
    Socket.emit('close_all_orders_by_symbol', { symbol: symb })
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

  const [openDialog, setOpenDiaog] = useState(false);

  const handleDelete = (DeletedSymbol) => {
    // delete symbol from symbol state
    dispatch(deleteSymbol(DeletedSymbol));
  }
  const AddSymbolToTab = (selected) => {
    // update state of selected symbol then emit the selected symbol to server
    const payload = [selected, { "lotArray": [0.1, 0.1, 0.2, 0.3], "lotEnd": 10, "BECycles": 1, "BE$": 1, "SL1": 10, "SL2": 10, "TP1": 1, "TP2": 10, "PNL": 0, "LiveCycles": 0, "CyclesNumbers": [], "Comment": selected, "TF": "H1", "MaxCycles": 10 ,"Auto":"true"}, activeTabId];
    dispatch(addSymboltoTab(payload));
    Socket.emit('update_tabs', state)
  }

  const UpdateTabSymbols = async (symbolName, ChangedValue, idx) => {
    try {
      const payload = [symbolName, ChangedValue, idx, activeTabId];
      dispatch(updateTabSymbol(payload));
      Socket.emit('update_tabs', state);
    } catch (err) {
      console.log(err);
    }
  }
  const DeleteSymbol = async (symbol) => {
    try {
      const payload = { symbol, activeTabId };
      dispatch(deleteTabSymbol(payload));
      Socket.emit('update_tabs', state);
    } catch (err) {
      console.log(err);
    }
  }




  return (
    <>

      <Helmet>
        <title> EA1 | Placying Cycles </title>
      </Helmet>
      <Stack sx={{ mt: 3, ml: 10 }} >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Placying Cycles(EA1)
          </Typography>
          <AddSymbolsDialog />
        </Stack>

        <Scrollbar>
          <Stack direction="row" spacing={1} maxWidth="100%" >
            {symbols.map((symbol, idx) => (
              <Chip key={idx} label={symbol} onDelete={() => handleDelete(symbol)} onClick={() => AddSymbolToTab(symbol)} clickable icon={<Iconify icon="eva:plus-fill" />} />
            ))
            }
          </Stack>
        </Scrollbar>
        <Divider sx={{ mb: 5 }} />
        <Scrollbar >
          <Stack direction="row" spacing={1} maxWidth="100%" >
            <TabsWrappedLabel />

          </Stack>
        </Scrollbar>

        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead

                  headLabel={TABLE_HEAD}

                />
                <TableBody>

                  {



                    Object.keys(activeTabSymbol).map((name, id) => {
                      const { lotArray, lotEnd, BECycles, BE$, SL1, SL2, TP1, TP2, PNL, LiveCycles, CyclesNumbers, Comment, TF, MaxCycles ,Auto} = activeTabSymbol[name];
                      const selectedUser = selected.indexOf(name) !== -1;

                      return (
                        <TableRow hover key={id} >
                          <TableCell padding="checkbox">
                            {/* draw X button to delete symbol from tab */}
                            <IconButton onClick={() => DeleteSymbol(name)} >
                              <Iconify icon="mdi:close" />
                            </IconButton>

                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, e.target.value.split(",").map(num => parseFloat(num)), 'lotArray')} defaultValue={lotArray} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'lotEnd')} defaultValue={lotEnd} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'BECycles')} defaultValue={BECycles} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'BE4')} defaultValue={BE$} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'SL1')} defaultValue={SL1} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'SL2')} defaultValue={SL2} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'TP1')} defaultValue={TP1} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'TP2')} defaultValue={TP2} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" value={PNL.toFixed(2)} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'LiveCycles')} value={LiveCycles} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'CyclesNumbers')} value={CyclesNumbers} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, e.target.value, 'Comment')} defaultValue={Comment} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, e.target.value, 'TF')} defaultValue={TF} /></TableCell>
                          <TableCell align="left"><TextField InputProps={{ disableUnderline: true }} variant="standard" onChange={(e) => UpdateTabSymbols(name, parseFloat(e.target.value), 'MaxCycles')} defaultValue={MaxCycles} /></TableCell>
                          <TableCell align="left">
                            <Button onClick={() => openOrder("buy", "sellstop", name, lotArray, SL1, 0, TP1, TP2, Comment, TF, id)} variant="contained" color="primary">  Buy </Button>
                          </TableCell>
                          <TableCell align="left">
                            <Button onClick={() => openOrder("sell", "buystop", name, lotArray, SL1, 0, TP1, TP2, Comment, TF, id)} variant="contained" color="error">  Sell </Button>
                          </TableCell>
                          <TableCell align="left">
                            <Button onClick={() => handleCloseAllOrdersBySymbols(name)} variant="contained" color="inherit">  CloseAll </Button>
                          </TableCell>
                          <TableCell align="left">
                          <Button onClick={(e) => UpdateTabSymbols(name, Auto==="true"?"false":"true", 'Auto')} variant="contained" color={Auto==="true"?"success":"error"}>  Auto </Button>
                          </TableCell>



                        </TableRow>

                      );
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
      </Stack>


    </>
  );

}
