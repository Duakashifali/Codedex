import { EXTRA_WEB, FULL_WEB } from './web';
import { FULL_MOBILE } from './mobile';
import { EXTRA_DS, FULL_DS } from './datasci';
import { FULL_AI, } from './ai';
import { FULL_CS } from './cs';
// EXTRA: lessons appended after the original lessons. FULL: replaces / defines the whole lesson list.
export const EXTRA = { ...EXTRA_WEB, ...EXTRA_DS };
export const FULL = { ...FULL_WEB, ...FULL_MOBILE, ...FULL_DS, ...FULL_AI, ...FULL_CS };
