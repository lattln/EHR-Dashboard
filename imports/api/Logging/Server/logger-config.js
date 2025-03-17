
import pino from "pino";

const targets = [
    {
        target: "pino-pretty",
        options: { colorize: true, },
        level: "info",
    }
];

if (process.env.ENABLE_MONGO_LOG === "true"){
    targets.push({
        target: "pino-mongodb",
        options: {
            uri: process.env.MONGO_URL || "mongodb://localhost:3001/meteor",
            collection: "logs",
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },

        },
        level: "info",
    })
}
const loggerTransports = pino.transport({targets});

export const logger = pino(
    {
        timestamp: pino.stdTimeFunctions.isoTime,
        nestedKey: "payload",
    },
    loggerTransports
);


