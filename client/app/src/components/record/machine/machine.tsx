import React from 'react';
import { Dialog, List, AppBar, Toolbar, IconButton, Typography, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { MachineItem } from './item';
import { MachineProps } from './model';
import { MachineCreateForm } from './form';
import './css/machine.css';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function MachineDialog(props: MachineProps) {
    const { isDialogOpen, setIsDialogOpen } = props;

    //TODO: form を下固定、listをスクロール
    return (
        <>
            <Dialog
                fullScreen
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setIsDialogOpen(false)}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            機種設定
                        </Typography>
                    </Toolbar>
                </AppBar >
                <List>
                    <MachineItem props={props} />
                </List>
                <MachineCreateForm props={props} />
            </Dialog >
        </>
    );
}
