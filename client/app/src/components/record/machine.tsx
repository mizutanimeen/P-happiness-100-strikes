import * as React from 'react';
import { Dialog, ListItemText, ListItemButton, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MachinesGetRequest, MachinesGet } from '../axios/machine';
import './css/machine.css';
import { MachineCreateRequest, MachineCreate, MachineDeleteRequest } from '../axios/machine';

export type Machine = {
    id: number,
    name: string,
    rate: number
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function FullScreenDialog(props: {
    isMachineDialogOpen: boolean,
    setIsMachineDialogOpen: (value: boolean) => void,
    setMachine: (value: Machine) => void,
}) {
    const { isMachineDialogOpen, setIsMachineDialogOpen } = props;
    const { setMachine } = props;
    const firstCallDone = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [machines, setMachines] = useState<MachinesGet[]>([]);
    const [createMachine, setCreateMachine] = useState<MachineCreate>({
        machine_name: "",
        rate: 0
    });

    // machine一覧取得
    const machinesGet = async () => {
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
            machinesGet();
        }
    }, [isMachineDialogOpen]);

    // machine 作成
    const machineCreate = () => {
        if (!createMachine.machine_name || !createMachine.rate) {
            return;
        }

        axios(MachineCreateRequest(createMachine)).then((result) => {
            if (result.status === 201) {
                setMachine(
                    {
                        id: result.data.machine_id,
                        name: createMachine.machine_name,
                        rate: createMachine.rate
                    }
                )
                setCreateMachine({
                    machine_name: "",
                    rate: 0
                });
                setIsMachineDialogOpen(false);
            }
        }).catch((error) => {
            if (error.response.status === 401) {
            }
            console.log(error);
        });
    }

    const handleClose = () => {
        setIsMachineDialogOpen(false);
    };

    const selectMachine = (id: string, name: string, rate: number) => {
        setMachine(
            {
                id: Number(id),
                name: name,
                rate: rate
            }
        );
        setIsMachineDialogOpen(false);
    }

    const deleteMachine = (id: string) => {
        axios(MachineDeleteRequest(Number(id))).then((result) => {
            if (result.status === 204) {
                machinesGet();
            }
        }).catch((error) => {
            if (error.response.status === 401) {
            }
            console.log(error);
        });
    }

    //TODO: key warning どこだ
    //TODO: form を下固定、listをスクロール
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
                        (isLoading) ?
                            <>
                                Loading....
                            </>
                            :
                            machines.map((machine: MachinesGet, i: number) => {
                                return (
                                    <>
                                        <div className='machineListItem'>
                                            <ListItemButton key={i}>
                                                <ListItemText primary={machine.machine_name} secondary={machine.rate} onClick={() => selectMachine(machine.id, machine.machine_name, machine.rate)} />
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
                        <input type="text" value={createMachine.machine_name} onChange={(e) => setCreateMachine({
                            machine_name: e.target.value,
                            rate: createMachine.rate
                        })} />
                    </div>
                    <div className='machineFormRate'>
                        <label>レート</label>
                        <div>
                            <div>
                                <input type="radio" id="four" name="rate" value={4} onChange={(e) => setCreateMachine({
                                    machine_name: createMachine.machine_name,
                                    rate: Number(e.target.value)
                                })} />
                                <label htmlFor="four">4円(500円 = 125玉)</label>
                            </div>
                            <div>
                                <input type="radio" id="one" name="rate" value={1} onChange={(e) => setCreateMachine({
                                    machine_name: createMachine.machine_name,
                                    rate: Number(e.target.value)
                                })} />
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
