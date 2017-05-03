import conf from '../conf';
import getKnex from '../utils/db/knex.js';

let knex = getKnex();
export default async(req, res) => {
    let a = await knex('dim_userinfo').select();
    res.send(a);
};
