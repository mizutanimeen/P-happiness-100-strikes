import { useEffect, useRef } from "react";
import { DateRecordsGet } from '../axios/date';
import { TimeRecordsGet, TimeRecordGet } from '../axios/time';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// TODO: デザイン、気分天井5固定、軸ラベル作成、高さ調整
export function BarChart(props: { dateRecords: DateRecordsGet, timeRecords: TimeRecordsGet }): JSX.Element {
    const data = useRef<number[]>([]);
    const options = {};
    let chartData = {
        labels: ["~3千円", "~5千円", "~1万円", "~1.5万円", "~2万円", "~2.5万円", "~3万円", "~4万円", "~5万円", "~6万円", "~7万円", "~8万円", "~9万円", "~10万円", "10万円~"],
        datasets: [
            {
                label: '投資額ー気分',
                backgroundColor: 'rgba(0,191,255,1)',
                borderColor: 'rgba(25,25,112,1)',
                borderWidth: 2,
                data: data.current,
            }
        ]
    };
    const { dateRecords, timeRecords } = props;

    type chartDataSum = {
        [index: number]: {
            len: number,
            sum: number
        }
    }

    // labels: ["~3千円", "~5千円", "~1万円", "~1.5万円", "~2万円", "~2.5万円", "~3万円", "~4万円", "~5万円", "~6万円", "~7万円", "~8万円", "~9万円", "~10万円", "10万円~"],
    const investmentMoneyIndex = (investment_money: number): number => {
        if (investment_money <= 3000) return 0;
        if (investment_money <= 5000) return 1;
        if (investment_money <= 10000) return 2;
        if (investment_money <= 15000) return 3;
        if (investment_money <= 20000) return 4;
        if (investment_money <= 25000) return 5;
        if (investment_money <= 30000) return 6;
        if (investment_money <= 40000) return 7;
        if (investment_money <= 50000) return 8;
        if (investment_money <= 60000) return 9;
        if (investment_money <= 70000) return 10;
        if (investment_money <= 80000) return 11;
        if (investment_money <= 90000) return 12;
        if (investment_money <= 100000) return 13;
        return 14;
    }
    const setChartData = (dateRecords: DateRecordsGet, timeRecords: TimeRecordsGet) => {
        const chartDataSum: chartDataSum = {};
        for (let i = 0; i < 15; i++) {
            chartDataSum[i] = { len: 0, sum: 0 };
        }
        Object.keys(dateRecords).map((key: string) => {
            if (timeRecords[key] === undefined) return;
            let total = 0;
            timeRecords[key].map((data: TimeRecordGet) => {
                total += data.investment_money;
            });
            const index = investmentMoneyIndex(total);

            chartDataSum[index] = { len: chartDataSum[index].len + 1, sum: chartDataSum[index].sum + dateRecords[key].happiness };
        });

        const chartData: number[] = [];
        for (let i = 0; i < 15; i++) {
            if (chartDataSum[i].len === 0) {
                chartData.push(0);
            } else {
                chartData.push(chartDataSum[i].sum / chartDataSum[i].len);
            }
        }
        data.current = chartData;
    };

    useEffect(() => {
        setChartData(dateRecords, timeRecords);
    }, [dateRecords, timeRecords, []]);

    useEffect(() => {
        chartData.datasets[0].data = data.current;
    }, [data.current]);

    return (
        <Bar options={options} data={chartData} redraw={true} />
    )
}
