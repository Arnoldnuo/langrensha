import * as knex from 'knex';
import conf from '../../conf';

let knexC = knex({
    client: 'mysql',
    connection: {
        host: conf.mysql.host,
        user: conf.mysql.user,
        port: conf.mysql.port,
        password: conf.mysql.password,
        database: conf.mysql.database
    },
    pool: {
        min: 0,
        max: conf.mysql.connectionLimit
    },
    acquireConnectionTimeout: 10000
});

knexC.on('query', (queryObj) => {
    yog.log.notice(`knex database query: sql: ${queryObj.sql}, binding: ${JSON.stringify(queryObj.bindings)}`);
});
let getKnex = () => {
    return knexC;
}

export default getKnex
