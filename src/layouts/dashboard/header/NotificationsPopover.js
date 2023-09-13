import PropTypes from 'prop-types';
import { noCase } from 'change-case';

import { useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemButton,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
// utils
import { useDispatch, useSelector } from 'react-redux';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { MarkAllRead } from '../../../Reducer/TabsReduces';
import Socket from '../../../components/socket';

// ----------------------------------------------------------------------


export default function NotificationsPopover() {
  const Notifications = useSelector((state) => state.tabs.Notifications);
const dispatch = useDispatch();
  const totalUnRead = Object.keys(Notifications).filter((id) => Notifications[id].isUnRead==="true").length;

  const [open, setOpen] = useState(null);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
    handleMarkAllAsRead();
  };


  const handleMarkAllAsRead = () => {

    dispatch(MarkAllRead());
    Socket.emit("mark_all_read", {});
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {Object.keys(Notifications).reverse().slice(0, 2).map((id) => (
              <NotificationItem key={id} notification={Notifications[id]} />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {Object.keys(Notifications).reverse().slice(2, 5).map((id) => (
              <NotificationItem key={id} notification={Notifications[id]} />
            ))}
          </List>
        </Scrollbar>

      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------


function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
    sx={{
      py: 1.5,
      px: 2.5,
      mt: '1px',
      ...(notification.isUnRead && {
        bgcolor: 'action.selected',
      }),
    }}
    >
      <ListItemAvatar>

        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
      secondary={
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: 'center',
            color: 'text.disabled',
          }}
        >
          <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
           
          {notification['time']}
        
           
        </Typography>
      }
      
      
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.type}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.message}
      </Typography>
    </Typography>
  );

  if (notification.type === 'ERROR') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'INFO') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
