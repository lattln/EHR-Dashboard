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
        formatters: {
            level: (label) => {return {level: label.toUpperCase()}},
        },
        timestamp: () => {return `,"time":"${new Date(Date.now()).toISOString()}"`;},
        nestedKey: "payload",

    },
    loggerTransports
);
