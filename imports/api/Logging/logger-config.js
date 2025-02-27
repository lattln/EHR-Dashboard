import pino from "pino";

const loggerTransports = pino.transport(
    {
        targets: [
            {
                target: "pino-mongodb",
                options: {
                    uri: "mongodb://localhost:3001/meteor",
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
                options: {colorize: true,},
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
