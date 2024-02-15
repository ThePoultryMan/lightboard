export interface EventData {
    meta: EventMeta;
    scoring: {
        divisions: Division[];
    }
}

interface EventMeta {
    name: string;
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
