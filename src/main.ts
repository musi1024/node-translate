import md5 from 'md5';
import https from 'https';
import querystring from 'querystring';
import { appid, appSecret } from './private';

type BaiduResult = {
  from: string;
  to: string;
  trans_result: [{ src: string; dst: string }];
  error_code?: string;
  error_msg?: string;
};

export const translate = (word: string) => {
  console.log('target word:', word);

  const fromTo = ['en', 'zh'];
  const isEnglish = /[a-zA-Z]/.test(word[0]);
  const from = fromTo[Number(!isEnglish)];
  const to = fromTo[Number(isEnglish)];

  const salt = Math.random();
  const sign = md5(appid + word + salt + appSecret);

  const query = querystring.stringify({
    q: word,
    from,
    to,
    appid,
    salt,
    sign
  });

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };
  const request = https.request(options, res => {
    let chunks: Buffer[] = [];
    res.on('data', chunk => {
      chunks.push(chunk);
    });
    res.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const resObj: BaiduResult = JSON.parse(string);
      if (resObj.error_code) {
        console.error(resObj.error_msg);
        process.exit(2);
      } else {
        const res = resObj.trans_result[0].dst;
        console.log(res);
        process.exit(0);
      }
    });
  });

  request.on('error', error => {
    console.error(error);
  });

  request.end();
};
