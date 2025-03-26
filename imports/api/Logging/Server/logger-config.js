
import pino from "pino";

const targets = [];

const enableMongoLogging = process.env.ENABLE_MONGO_LOG !== undefined ? process.env.ENABLE_MONGO_LOG : "false"
if (enableMongoLogging === "true"){
    targets.push({
        target: "pino-mongodb",
        options: {
            uri: process.env.MONGO_URL || Meteor.settings.private.MONGO_URL,
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


