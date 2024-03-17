import "./css/rpm.css";
import "../../util/css/util.css";
import { investmentProps, investmentTarget, rpmProps } from "./model";


function setInput(value: string, set: (value: number) => void): void {
    let n = Number(value);
    if (isNaN(n)) {
        return;
    }
    if (n < 0) {
        n = 0;
    }
    set(n);
}

export function InvestmentForm(props: { props: investmentProps }): JSX.Element {
    const { target, rate, investment, setInvestment } = props.props;

    return <div>
        <label>{target === "money" ? "投資額(円)" : "投資玉"}</label>
        <input className="box" type="text" pattern="[0-9]*" value={investment} onChange={(e) => setInput(e.target.value, setInvestment)} />
        <div className="investmentButtonBox">
            <InvestmentButton props={props.props} />
        </div>
    </div>
}

function InvestmentButton(props: { props: investmentProps }): JSX.Element {
    const { target, rate, investment, setInvestment } = props.props;

    const values: { [key: number]: { [key in investmentTarget]: number } } = {
        1: { money: 200, ball: 200 },
        4: { money: 500, ball: 125 }
    }

    const value = values[rate][target];

    return <>
        <button className="button" onClick={() => setInvestment(investment - value < 0 ? 0 : investment - value)}>-{value}</button>
        <button className="button" onClick={() => setInvestment(investment + value)}>+{value}</button>
    </>
}

export function RPMForm(props: { props: rpmProps }): JSX.Element {
    const { target, rpm, setRPM } = props.props;

    return <div>
        <label>{target === "start" ? "開始回転数" : "終了回転数"}</label>
        <input className="box" type="text" pattern="[0-9]*" value={rpm} onChange={(e) => setInput(e.target.value, setRPM)} />
        <input className="bar" type="range" value={rpm} step={1} min={0} max={2000} onChange={(e) => setRPM(Number(e.target.value))} />
    </div>
}
