import {formatDistance} from 'date-fns';

const now = new Date();
const birthday = new Date(now.getFullYear(), 3, 16);
const distance = formatDistance(now, birthday);
console.log(distance, 'until your birthday');
