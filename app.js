const rp = require('request-promise');
const cheerio = require("cheerio");
const fs = require('fs');

const url = 'https://ithelp.ithome.com.tw/2020ironman/signup/list';

// https://ithelp.ithome.com.tw/2020ironman/signup/list&order=signup
// https://ithelp.ithome.com.tw/2020ironman/signup/list&page=1
// https://ithelp.ithome.com.tw/2020ironman/signup/list?page=2


// https://ithelp.ithome.com.tw/2020ironman/signup/list?page=568&order=signup
// https://ithelp.ithome.com.tw/2020ironman/signup/list?page=34&order=signup

async function getData(url, time) {
  // console.log(`正在撈取：${url}, 啟動秒數：${time}`);
  const itArray = []; // 放置資料處
  const option = {
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    }
  }
  await rp(option).then(($) => {
    const itDOM = $('.contestants-wrapper .contestants-list'); // 擷取區塊
    for (let i = 0; i < itDOM.length; i += 1) {
      const cache = {
        title: itDOM.eq(i).find('.contestants-list__title').text().trim(), // 主題
        desc: itDOM.eq(i).find('.contestants-list__desc').text().trim(), // 主題描述
        status: itDOM.eq(i).find('.team-dashboard__day').text().trim(), // 挑戰進度
        data: itDOM.eq(i).find('.contestants-list__date').text().trim(), // 報名日期
        userName: itDOM.eq(i).find('.contestants-list__name').text().trim(), // 使用者名稱
        userPic: itDOM.find('.contestants-list__avatar > img').attr('src'), // 圖片路徑
        page: url, // 所在頁面 Url
        getData: getDate(), // 取得日期
      }
      itArray.push(cache);
    }
  });
  // console.log(itArray);

  return itArray;
}

function getITList() {
  const jsonFile = require('./data/ITlist.json');

  jsonFile.forEach(async (item) => {
    const data = [];
    const random = Math.floor(Math.random() * 5 + 1) * 1000;
    const page = Math.ceil(item.number / 10);
    for (let i = 0; i < page; i += 1) {
      if (item.title === '全部參賽鐵人') {
        let cache = await getData(`${item.url}?page=${i + 1}&order=signup`, random);
        data.push(cache);
      } else {
        let cache = await getData(`${item.url}&page=${i + 1}&order=signup`, random);
          data.push(cache);
        // setTimeout(async () => {
        //   let cache = await getData(`${item.url}&page=${i + 1}&order=signup`, random);
        //   data.push(cache);
        // }, random);
      }
    }
    fs.writeFileSync(`./data/result/${item.title}.json`, JSON.stringify(data));
  })

}

function getDate() {
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDay() + 1;
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const sec = time.getSeconds();

  const fullTime = `${year}/${month}/${day} ${hours}:${minutes}:${sec}`;
  return fullTime;
}

// getList();
getITList();