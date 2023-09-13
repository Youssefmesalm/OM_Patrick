import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from '../iconify/Iconify';
import { useDispatch } from 'react-redux';
import { addSymbol } from '../../Reducer/SymbolsReducer';

export default function AddSymbolDialog() {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    const [symbol, setSymbol] = React.useState('');
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (e) => {
        // add the symbol to the array of symbols
        dispatch(addSymbol(symbol));
        setOpen(false);
    };
    // get the dialog entries then add it to an array of symbols

    return (
        <div>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
                Add Symbol
            </Button>
            <Dialog open={open} onClose={handleClose}  >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to New Instrument, please enter your Instrument name Correctly here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        onChange={(e) => setSymbol(e.target.value)}
                        value={symbol}
                        label="Symbol Name"
                        type='text'
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}