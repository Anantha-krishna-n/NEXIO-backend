import morgan, { StreamOptions } from "morgan";

const stream: StreamOptions = {
  write: (message) => console.log(message.trim()),
};

const logger = morgan(":method :url :status :res[content-length] - :response-time ms", { stream });

export default logger;
