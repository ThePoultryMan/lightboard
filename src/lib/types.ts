export interface EventData {
    name: string;
    divisions: Division[];
}

export interface Division {
    name: string;
    start: number;
    decrease: number;
}

export interface Team {
    name: string;
    members: string[];
}

export interface ScoreCollection {
    [key: string]: Score;
}

export interface Score {
    score: number;
    breaker: number;
}
