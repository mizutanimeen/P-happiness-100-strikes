import React from 'react';
import { Box, SwipeableDrawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export function Modal(props: { onModal: boolean, setOnModal: (value: boolean) => void }): JSX.Element {
    const anchor = 'bottom';
    const { onModal, setOnModal } = props;

    // TODO: カレンダーの月移動に使えるかも
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab'
            || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setOnModal(open);
    };

    return (
        <>
            <SwipeableDrawer
                anchor={anchor}
                open={onModal}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <Box
                    sx={{ width: 'auto' }}
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box >
            </SwipeableDrawer>
        </>
    );
}
