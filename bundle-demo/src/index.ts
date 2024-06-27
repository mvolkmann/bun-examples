import {formatDistance} from 'date-fns';

const now = new Date();
const birthday = new Date(now.getFullYear(), 3, 16);
if (birthday < now) birthday.setFullYear(now.getFullYear() + 1);
const distance = formatDistance(now, birthday);
console.log(distance, 'until your birthday');
