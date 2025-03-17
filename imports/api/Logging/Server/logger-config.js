
import pino from "pino";

const loggerTransports = pino.transport(
    {
        targets: [
            {
                target: "pino-mongodb",
                options: {
                    uri: process.env.MONGO_URL || "mongodb://127.0.0.1:3001/meteor",
                    collection: "logs",
                    mongoOptions: {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    },

                },
                level: "info",
            },
            {
                target: "pino-pretty",
                options: { colorize: true, },
                level: "info",
            },
        ]
    }
);

export const logger = pino(
    {
        timestamp: pino.stdTimeFunctions.isoTime,
        nestedKey: "payload",
    },
    loggerTransports
);


