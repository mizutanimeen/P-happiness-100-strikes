import { ListItemText, ListItemButton, Divider } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MachinesGetRequest, MachineGet } from '../../axios/machine';
import './css/machine.css';
import { MachineDeleteRequest } from '../../axios/machine';
import { MachineProps } from './model';

export function MachineItem(props: { props: MachineProps }): JSX.Element {
    const { isDialogOpen, setIsDialogOpen, setMachine } = props.props;

    const call = useRef(false);
    useEffect(() => {
        if (!isDialogOpen) {
            call.current = false;
            return;
        }

        if (!call.current) {
            call.current = true;
            machinesGet();
        }
    }, [isDialogOpen]);

    // machine一覧取得
    const [isLoading, setIsLoading] = useState(false);
    const [machines, setMachines] = useState<MachineGet[]>([]);
    const machinesGet = async () => {
        setIsLoading(true);
        await axios(MachinesGetRequest).then((result) => {
            result.data ? setMachines(result.data) : setMachines([]);
        }).catch((error) => {
            if (error.response.status !== 401) {
                console.log(error);
            }
        });
        setIsLoading(false);
    };

    const selectMachine = (id: number, name: string, rate: number) => {
        setMachine(
            {
                id: id,
                name: name,
                rate: rate
            }
        );
        setIsDialogOpen(false);
    }

    const deleteMachine = (id: number) => {
        axios(MachineDeleteRequest(id)).then((result) => {
            machinesGet();
        }).catch((error) => {
            if (error.response.status !== 401) {
                console.log(error);
            }
        });
    }

    return (
        <>
            {
                (isLoading) ?
                    <>
                        Loading....
                    </>
                    :
                    machines.map((machine: MachineGet, i: number) => {
                        return (
                            <div key={i}>
                                <div className='machineListItem'>
                                    <ListItemButton>
                                        <ListItemText primary={machine.machine_name} secondary={machine.rate} onClick={() => selectMachine(machine.id, machine.machine_name, machine.rate)} />
                                    </ListItemButton>
                                    <button onClick={(e) => deleteMachine(machine.id)}>削除</button>
                                </div>
                                <Divider />
                            </div>
                        )
                    })
            }

        </>
    );
}
