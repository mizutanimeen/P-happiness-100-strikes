import "./css/record.css";
import "../util/css/util.css";

type moneyFormProps = {
    label: string;
    money: number;
    setMoney: (value: number) => void;
    step: number;
}

export function MoneyForm(props: moneyFormProps) {
    const { label, money, setMoney, step } = props;

    const setInputMoney = (value: string, set: (value: number) => void): void => {
        let n = Number(value);
        if (isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = 0;
        }
        set(n);
    }

    return <div className="incomeExpendBox">
        <label>{label}</label>
        <input className="box" type="text" pattern="[0-9]*" value={money} onChange={(e) => setInputMoney(e.target.value, setMoney)} />
        <input className="bar" type="range" value={money} step={step} min={0} max={200000} onChange={(e) => setMoney(Number(e.target.value))} />
    </div>
}
