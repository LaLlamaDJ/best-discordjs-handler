const fs = require("fs");
const { log_level, log_to_file, log_file } = require("../../public/botconfig.json")

const levels = {
  debug: 0,
  info: 1,
  success: 2,
  warn: 3,
  error: 4,
  fatal: 5
};

const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

function getTime() {
  return new Date().toLocaleTimeString();
}
function shouldLog(level) {
  return levels[level] >= levels[log_level];
}
function parseStack(stack) {
  if (!stack) return null;
  const lines = stack.split("\n");
  for (let line of lines) {
    line = line.trim();
    const match = line.match(/\((.*):(\d+):(\d+)\)/) ||
                  line.match(/at (.*):(\d+):(\d+)/);
    if (match) return { file: match[1], line: match[2], column: match[3] };
  }
  return null;
}
function isInternalError(stackInfo) {
  if (!stackInfo) return false;
  return !stackInfo.file.includes("node_modules");
}
function isFatalError(err) {
  if (!err) return false;
  return (
    err instanceof TypeError ||
    err instanceof ReferenceError ||
    err instanceof SyntaxError ||
    err instanceof RangeError
  );
}
function getRelativeLocation(stackInfo) {
  if (!stackInfo) return null;
  const projectRoot = process.cwd();
  let relativeFile = stackInfo.file;

  if (relativeFile.startsWith(projectRoot)) {
    relativeFile = relativeFile.slice(projectRoot.length);
    if (relativeFile.startsWith("\\") || relativeFile.startsWith("/")) {
      relativeFile = relativeFile.slice(1);
    }
  }
  return `${relativeFile}:${stackInfo.line}`;
}

function formatLog(level, msg, location, internal) {
  const time = getTime();
  const colorMap = {
    debug: colors.gray,
    info: colors.blue,
    success: colors.green,
    warn: colors.yellow,
    error: colors.red,
    fatal: colors.magenta
  };
  const color = internal ? colorMap[level] : colors.cyan;
  const consoleMsg = `${colors.gray}[${time}]${colors.reset} ${color}[${level.toUpperCase()}]${colors.reset} ${msg}` + (location ? ` [${location}]` : "");
  const fileMsg = `[${time}] [${level.toUpperCase()}] ${msg}` + (location ? ` [${location}]` : "") + "\n";
  return { consoleMsg, fileMsg };
}

function writeToFile(message) {
  if (!log_to_file) return;
  try {
    fs.appendFileSync(log_file, message);
  } catch (err) {
    console.error("Error writing log file:", err);
  }
}

const logger = {};
Object.keys(levels).forEach(level => {
  logger[level] = (msg, location, internal = true) => {
    if (!shouldLog(level)) return;
    const { consoleMsg, fileMsg } = formatLog(level, msg, location, internal);
    console.log(consoleMsg);
    writeToFile(fileMsg);
  };
});

logger.initGlobalHandlers = () => {
  const handleError = (err, defaultLevel = "error") => {
    if (!err) return;

    const stackInfo = parseStack(err.stack);
    const internal = isInternalError(stackInfo);
    const fatal = isFatalError(err);

    let level;
    if (fatal) level = "fatal";
    else if (!internal) level = "debug";
    else level = defaultLevel;

    const location = getRelativeLocation(stackInfo);
    const msg = `${err.name}: ${err.message} | Internal: ${internal} | Fatal: ${fatal}`;

    logger[level](msg, location, internal);
  };

  process.on("unhandledRejection", (reason) => {
    if (reason instanceof Error) handleError(reason);
    else logger.error(String(reason));
  });
  process.on("uncaughtException", (err) => {
    handleError(err);
  });
  process.on("uncaughtExceptionMonitor", (err) => {
    handleError(err, "warn");
  });
};

module.exports = logger;