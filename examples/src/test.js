import { get } from 'node:http';
import slog from '../../lib/index'

// let slog = require("../../lib/index");
slog('hello world!');

slog('error', 'error test');


// console.log(slog);

let starlog = new Proxy(console, ()=> {
    get: (obj, prop) => {
        console.warn(obj. prop)
    };
})
starlog.log('starlog---');
