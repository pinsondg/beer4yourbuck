import React from "react";
import {Badge} from "reactstrap";

interface Props {
    score: number;
    className?: string;
}

export default function ValueScoreBadge(props: Props) {

    const getColor = (): string  => {
        const {score} = props;
        if (score > 0 && score <= 0.6) {
            return 'danger';
        } else if (score > 0.6 && score <= 1.2) {
            return 'warning';
        } else if (score > 1.2 && score <= 2.0) {
            return 'info'
        } else if (score > 2.0){
            return 'success'
        }
        return 'dark'
    };

    return (
        <div className={props.className}>
            <Badge color={getColor()}>
                {props.score.toFixed(2)}
            </Badge>
        </div>
    )
}