import * as path from 'path';

import {
    RALPromise
} from 'node-ral';

let initYog = () => {
    let ralP = RALPromise;
    global.yog = {
        ralP: ralP,
        log: {
            notice: (t) => {
                // console.log(t);
            }
        }
    };
}

export default initYog;
