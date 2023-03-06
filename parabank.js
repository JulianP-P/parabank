import { sleep, group } from 'k6'
import http from 'k6/http'

// Пример сценария
// export const options = {
//   thresholds: {},
//   scenarios: {
//     Scenario_test: {
//       executor: 'ramping-arrival-rate',
//       timeUnit: '1h',  //единица времени для подачи дальнейшей нагрузки
//       preAllocatedVUs: 5,
//       stages: [
//         { target: 10, duration: '10s' }, //первый этап - увеличение числа итераций в час с 0 до 10 в течение 10 секунд
//         { target: 10, duration: '30m' }, //второй этап - подача 10 итераций в час в течение 30 минут
//         { target: 0, duration: '5s' },   //третий этап - уменьшение итераций в час до 0 в течение 5 секунд
//       ],
//     },
//   },
// }

const username = "soatest"
const pass = "soatest"
const URL = "https://parabank.parasoft.com/"

export default function main() {
  let response

  group('open', ()=> {
    response = http.get(`${URL}`, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ru,en;q=0.9'
      },
    })

    response = http.get(`${URL}parabank/index.htm`, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ru,en;q=0.9'
      },
    })
  })

  group('login', ()=> {
    response = http.post(`${URL}parabank/login.htm`,
      {
        username: username,
        password: pass,
      },
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'ru,en;q=0.9',
          'cache-control': 'max-age=0',
          'content-type': 'application/x-www-form-urlencoded',
          origin: 'https://parabank.parasoft.com',
          referer: `${URL}parabank/index.htm`,
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Yandex";v="23"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 YaBrowser/23.1.2.987 Yowser/2.5 Safari/537.36',
        },
      } )

    response = http.get(`${URL}parabank/overview.htm`, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ru,en;q=0.9',
        'cache-control': 'max-age=0',
        referer: `${URL}parabank/index.htm`,
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Yandex";v="23"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 YaBrowser/23.1.2.987 Yowser/2.5 Safari/537.36',
      },
    })

    let str = response.html().find('script').text()
    //Извлечение числа из строки $http.get("services_proxy/bank/customers/" + 19760 + "/accounts", 
    let num = str.substring(
      str.indexOf('services_proxy/bank/customers/" + ') + 'services_proxy/bank/customers/" + '.length, 
      str.lastIndexOf(' + "/accounts"')
    );
    console.log(num)

    response = http.get(`${URL}parabank/services_proxy/bank/customers/${num}/accounts`,
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'ru,en;q=0.9',
          referer: `${URL}parabank/overview.htm`,
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Yandex";v="23"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 YaBrowser/23.1.2.987 Yowser/2.5 Safari/537.36',
          'x-kl-ajax-request': 'Ajax_Request',
        },
      })
  })
            
  // Automatically added sleep
  sleep(1)
}
