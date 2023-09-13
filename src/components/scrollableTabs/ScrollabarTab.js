import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addTab, setActiveTab, setTabs } from '../../Reducer/TabsReduces'
import Iconify from '../iconify/Iconify';
import Socket from '../socket'



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}



function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function TabsWrappedLabel() {
  const [value, setValue] = React.useState('');
  const state = useSelector(state => state.tabs)
  const tabs = useSelector(state => state.tabs.tabs)
  const activeTabId = useSelector(state => state.tabs.ActiveTab)

  const handleChange = (event, newValue) => {
    dispatch(setActiveTab({ id: newValue }))

  };
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const dispatch = useDispatch()

  const handleClose = (e) => {
    e.preventDefault();
    const newTab = { name: value, active: "false" }
    dispatch(addTab(newTab))
    // get tabs from from tab reducer and send to server
    // Socket.emit('update_tabs', state)
    setOpen(false);

  };
  
  return (
    <Box sx={{ width: '100%' }} flexDirection={'row'}>
      <Tabs
        value={activeTabId}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        {
          Object.keys(tabs).map((tab, index) => (
            <Tab
              value={index + 1}
              label={tabs[tab].name}
              key={index + 1}
              wrapped
            />
          ))
        }
        <Button variant="text" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
          Add
        </Button>
      </Tabs>
      <Dialog open={open} onClose={handleClose}  >
        <DialogTitle>Add a new tab</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            label="tab name"
            type='text'
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
