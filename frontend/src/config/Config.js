import backend from './backend.json';

let env = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? "dev" : "prod";

export const Api = backend[env];

export const Scope = { "DAY": "day", "WEEK": "week", "MONTH": "month" }