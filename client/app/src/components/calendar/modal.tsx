import React from 'react';
import { Box, SwipeableDrawer, List, Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useSelector } from "../redux/store";
import { TimeRecordsGet, TimeRecordGet } from '../axios/time';
import { formatStringTime } from '../util/util';
import { useNavigate } from 'react-router-dom';

export function Modal(props: { timeRecords: TimeRecordsGet | undefined, onModal: boolean, setOnModal: (value: boolean) => void }): JSX.Element {
    const anchor = 'bottom';
    const { onModal, setOnModal } = props;
    const selectedDate = useSelector((state) => state.selectDate.value);
    const timeRecords = props.timeRecords?.[selectedDate];
    const navigate = useNavigate();

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
                        {timeRecords?.map((record: TimeRecordGet, i: number) => {
                            const money = record.recovery_money - record.investment_money
                            return (
                                <ListItem key={i} disablePadding>
                                    <ListItemButton>
                                        <ListItemText primary={formatStringTime(record.date_time) + "　" + money + "円"} onClick={() => navigate(`/records/${record.id}`)} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                    <Divider />
                </Box >
            </SwipeableDrawer>
        </>
    );
}
