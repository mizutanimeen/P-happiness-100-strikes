import { useState } from 'react';
import axios from 'axios';
import './css/machine.css';
import { MachineCreateRequest, MachineCreate } from '../../axios/machine';
import { MachineProps } from './model';

export function MachineCreateForm(props: { props: MachineProps }): JSX.Element {
    const { isDialogOpen, setIsDialogOpen, setMachine } = props.props;

    const [createMachine, setCreateMachine] = useState<MachineCreate>({
        machine_name: "",
        rate: 0
    });

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
                setIsDialogOpen(false);
            }
        }).catch((error) => {
            if (error.response.status === 401) {
            }
            console.log(error);
        });
    }

    return <>
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
    </>
}
