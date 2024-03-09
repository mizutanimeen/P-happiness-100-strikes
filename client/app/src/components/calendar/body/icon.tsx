import { icons } from './../modal/happiness';

export function Icon(props: { happiness: number }): JSX.Element {
    const happiness = props.happiness;

    return <div className={iconColor(happiness)}>
        {icons[happiness - 1]}
    </div>
}

function iconColor(happiness: number): string {
    if (happiness <= 2) {
        return 'red';
    } else if (happiness === 3) {
        return 'black';
    }

    return 'blue';
}
