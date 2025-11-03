// register-tsnode.mjs
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Регистрируем ts-node загрузчик
register('ts-node/esm', pathToFileURL('./'));

// Опционально: зарегистрируйте обработку TypeScrypt для CommonJS
import { register as registerCJS } from 'node:module';
registerCJS('ts-node/register', pathToFileURL('./'));