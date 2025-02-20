import pino from "pino";

const mongodbTransports = pino.transport(
    {
        target: "pino.mongodb",
        options: {
            uri: "mongodb://localhost:3001/logs"
        },
    }
);
const loggerInstance = pino();