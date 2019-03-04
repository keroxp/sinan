import * as net from "net"
import * as cp from "child_process"
import * as path from "path"
import {logger} from "./logger";

const logEngine = logger("usi-server:engine");
const logServer = logger("usi-server");
const bin = process.env["SINAN_USI_ENGINE_BIN"];
const engineDir = path.dirname(bin);
const port = process.env["SINAN_PORT"] || "10010";
logServer.debug(`USI Engine: ${bin}`);
logServer.debug(`port: ${port}`);
const server = new net.Server();
const engine = cp.spawn(bin, {
    cwd: engineDir
});
engine.on("error", logEngine.error);
engine.on("exit", (code, sig) => {
    logEngine.error(`engine exited: code=${code}, signal=${sig}`);
    process.exit(code);
});
server.on("connection", sock => {
    logServer.debug(`sock connected: addr=${sock.address()}`);
    sock.setEncoding("utf8");
    sock.pipe(engine.stdin);
    sock.pipe(process.stdout);
    engine.stdout.pipe(process.stdout);
    engine.stdout.pipe(sock);
    engine.stderr.pipe(process.stderr);
    engine.stderr.pipe(sock);
});
server.on("close", () => {
    logServer.debug("server closed");
    process.exit(1);
});
server.on("listening", () => {
    logServer.debug(`listing on port ${port}...`)
});
server.on("error", logServer.error);
server.listen(parseInt(port));