import { env } from 'node:process';

import { MessageEnum } from './utils/enums';
import app from './modules/server';

app.listen(env['API_PORT'], () => {
    console.log(`${MessageEnum.PORT} ${env['API_PORT']}`);
});