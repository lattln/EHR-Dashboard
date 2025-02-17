import fs from "node:fs";
import util from "node:util";
import path from "node:path";

const TYPE = {
    INFO: 0,
    ERROR: 1,
    WARN: 2,
};

const TYPE_STRING_MAPPING = 
{
    [TYPE.INFO]: "INFO",
    [TYPE.ERROR]: "ERROR",
    [TYPE.WARN]: "WARN"
};

const LOG_COLORS = {
    [TYPE.INFO]: "\x1b[32m", // Green
    [TYPE.WARN]: "\x1b[33m", // Yellow
    [TYPE.ERROR]: "\x1b[31m", // Red
    RESET: "\x1b[0m" // Reset
};
Object.freeze(TYPE)

export class SimpleLogger {
    TYPE = TYPE;

    constructor (config = {}){
        let {
            rootFileName = undefined, //name of the file all logs will go into.
            rootFilePath = undefined, //path all log files should be saved under.
            debugModeEnabled = true, //boolean to enable or disable debug mode.
            fileWriteEnabled = false, //boolean to enable or disable file writing

        } = config;

        this.config = {rootFileName, rootFilePath, debugModeEnabled, fileWriteEnabled};
        this.writeStreams = {};

        if(this.config.fileWriteEnabled){

            this.writeStreams[TYPE.INFO] = this.#setUpWriteStream(TYPE.INFO);
            this.writeStreams[TYPE.WARN] = this.#setUpWriteStream(TYPE.WARN);
            this.writeStreams[TYPE.ERROR] = this.#setUpWriteStream(TYPE.ERROR);
        }  

    }

    //helper function to get the line number and filename from where the logging function was called.
    #getFilePathAndLineNumber () {

    }

    //helper function to write the formatted output into a logs file.
    async #writeLogToFile (logType, formattedLine) {
        if(this.config.fileWriteEnabled){
            this.writeStreams[logType].write(formattedLine + "\n");
        }
    }

    //helper function to print out the message into a formatted log in the terminal
    #printLine (logType, ...message) {

    }

    //helper method that sets up the writestreams and all important listeners here.
    #setUpWriteStream (logType) {
        let writeStream = fs.createWriteStream(path.join(this.config.rootFilePath, `${TYPE_STRING_MAPPING[logType].toLowerCase()}.${this.rootFileName}.txt`), {flags: "a"});
        writeStream.on("close", () => {

        });
        
        return writeStream;
    }

    //calls printline and writes to specified files.
    #log (logType, ...message) {
        const formattedLine = printLine(logType, ...message);
        console.log(formattedLine);
        this.#writeLogToFile(logType, formattedLine);

        
    }

    info (...message) {
        this.#log(this.TYPE.INFO, ...message)
    }

    warn (...message) {
        this.#log(this.TYPE.WARN, ...message)
    }

    error (...message) {
        this.#log(this.TYPE.ERROR, ...message)
    }

}

/*
use case:
let userLogger = new SimpleLogger(
    {
        fileName: "user.txt",
        filePath: "./Logs/",
        debugModeEnabled: true,
    }
);

userLogger.info("User Accessing Personal Observation Records.");
userLogger.warn("Current Implementation is not Secure.");
userLogger.error("fetch request from fhir server took too long.")

//all logs are written in /Logs/user.txt
//info logs are automatically logged into /Logs/info.user.txt
//warn logs are logged into /Logs/warn.user.txt
//error logs are logged into /Logs/error.user.txt

//error logs are colored red
//info logs are colored green
//warn logs are colored yellow

//formated input
[ISO DATE]\t[LOG_TYPE]\t[Message] ...other attached messages. 
*/