import moment from 'moment';
import md5 from 'md5';

// 联调/测试环境 打包部署 hash -> dist/[hash]/umi.xxx.js
export const hash = md5(moment().format('YYYY-MM-DD')).slice(0, 8);
