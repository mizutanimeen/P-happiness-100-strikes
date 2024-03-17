export type Machine = {
    id: number,
    name: string,
    rate: number
}

export type MachineProps = {
    isDialogOpen: boolean,
    setIsDialogOpen: (value: boolean) => void,
    setMachine: (value: Machine) => void,
}
