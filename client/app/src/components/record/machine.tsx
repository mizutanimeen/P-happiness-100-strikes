import * as React from 'react';
import { Button, Dialog, ListItemText, ListItemButton, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MachinesGetRequest, MachinesGet } from '../axios/machine';
import './css/machine.css';
import { MachineCreateRequest, MachineCreate, MachineDeleteRequest } from '../axios/machine';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function FullScreenDialog(props: {
    isMachineDialogOpen: boolean, machineID: number, machineName: string, rate: number,
    setIsMachineDialogOpen: (value: boolean) => void,
    setMachineID: (value: number) => void,
    setMachineName: (value: string) => void,
    setRate: (value: number) => void
}) {
    const { isMachineDialogOpen, setIsMachineDialogOpen } = props;
    const { machineID, setMachineID } = props;
    const { machineName, setMachineName } = props;
    const { rate, setRate } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [machines, setMachines] = useState<MachinesGet[]>([]);
    const firstCallDone = useRef(false);
    const [createMachineName, setCreateMachineName] = useState<string>("");
    const [createRate, setCreateRate] = useState<number>(0);

    // machine一覧取得
    const machineGet = async () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        await axios(MachinesGetRequest).then((result) => {
            if (result.status === 200) {
                if (result.data !== null) {
                    setMachines(result.data);
                }
            } else {
                console.log(result);
            }
            setIsLoading(false);
        }).catch((error) => {
            if (error.response.status === 401) {
            }
            console.log(error);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        if (!isMachineDialogOpen) {
            firstCallDone.current = false;
            return;
        }

        // strict modeのための対策
        if (!firstCallDone.current) {
            firstCallDone.current = true;
            machineGet();
        }
    }, [isMachineDialogOpen]);

    // machine 作成
    const machineCreate = () => {
        if (createMachineName === "" || createRate === 0) {
            return;
        }
        const data: MachineCreate = {
            machine_name: createMachineName,
            rate: createRate
        }

        axios(MachineCreateRequest(data)).then((result) => {
            if (result.status === 201) {
                setMachineID(result.data.machine_id);
                setMachineName(createMachineName);
                setRate(createRate);
                setCreateMachineName("");
                setCreateRate(0);
                setIsMachineDialogOpen(false);
            } else {
                console.log(result);
            }
        }).catch((error) => {
            if (error.response.status === 401) {
            }
            console.log(error);
        });
    }
    //TODO:
    // machine 選択
    // machine 削除

    const handleClose = () => {
        setIsMachineDialogOpen(false);
    };

    const setMachine = (id: string, name: string, rate: number) => {
        setMachineID(Number(id));
        setMachineName(name);
        setRate(rate);
        setIsMachineDialogOpen(false);
    }

    const deleteMachine = (id: string) => {
        axios(MachineDeleteRequest(Number(id))).then((result) => {
            if (result.status === 204) {
                machineGet();
            } else {
                console.log(result);
            }
        }).catch((error) => {
            if (error.response.status === 401) {
            }
            console.log(error);
        });
    }

    //TODO: key warning どこだ
    return (
        <>
            <Dialog
                fullScreen
                open={isMachineDialogOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            機種設定
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    {
                        machines.map((machine: MachinesGet, i: number) => {
                            return (
                                <>
                                    <div className='machineListItem'>
                                        <ListItemButton key={i}>
                                            <ListItemText primary={machine.machine_name} secondary={machine.rate} onClick={(e) => setMachine(machine.id, machine.machine_name, machine.rate)} />
                                        </ListItemButton>
                                        <button onClick={(e) => deleteMachine(machine.id)}>削除</button>
                                    </div>
                                    <Divider />
                                </>
                            );
                        })
                    }
                </List>
                <div className='machineForm'>
                    <h2>新規作成</h2>
                    <div className='machineFormName'>
                        <label>機種名</label>
                        <input type="text" value={createMachineName} onChange={(e) => setCreateMachineName(e.target.value)} />
                    </div>
                    <div className='machineFormRate'>
                        <label>レート</label>
                        <div>
                            <div>
                                <input type="radio" id="four" name="rate" value={4} onChange={(e) => setCreateRate(Number(e.target.value))} />
                                <label htmlFor="four">4円(500円 = 125玉)</label>
                            </div>
                            <div>
                                <input type="radio" id="one" name="rate" value={1} onChange={(e) => setCreateRate(Number(e.target.value))} />
                                <label htmlFor="one">1円(200円 = 200玉)</label>
                            </div>
                        </div>
                    </div>
                    <div className='machineFormButton'>
                        <button className='button' onClick={machineCreate}>作成</button>
                    </div>
                </div>
            </Dialog >
        </>
    );
}
