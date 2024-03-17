export type investmentTarget = "money" | "ball"
export type investmentProps = {
    target: investmentTarget,
    rate: number,
    investment: number,
    setInvestment: (value: number) => void
}

export type rpmTarget = "start" | "end"
export type rpmProps = {
    target: rpmTarget,
    rpm: number,
    setRPM: (value: number) => void
}
