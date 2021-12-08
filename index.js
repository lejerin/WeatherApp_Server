//express 모듈 불러오기
const express = require("express");
const XLSX = require('xlsx')

var app = express();

app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
  res.send('Hello World');
})

app.listen(app.get('port'), function () {
  console.log('App is running, server is listening on port ', app.get('port'));
});

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//임시 데이터
const gridValue = [];
getExcelData()

function getExcelData() {
    var workbook = XLSX.readFile('weather.xlsx');
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var col = z.substring(0,1);
            var row = parseInt(z.substring(1));
            var value = worksheet[z].v;
    
            //store header names
            if(row == 1) {
                headers[col] = value;
                continue;
            }
    
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        gridValue.push(data)
        console.log(typeof data[0]['격자 X'])
    });
}

app.get("/api/grid", (req, res) => {

    try {
        let latitude = req.query.latitude
        let longitude = req.query.longitude
        let xy = dfs_xy_conv(latitude, longitude)
        let pow = latitude * latitude + longitude * longitude
        const value = gridValue[0].filter(data => 
            data['격자 X'] == xy['x'].toString() && data['격자 Y'] == xy['y'].toString()
        ).sort(function(a, b) {
            let alo = parseFloat(a['경도(초/100)'])
            let ala = parseFloat(a['위도(초/100)'])
            let blo = parseFloat(b['경도(초/100)'])
            let bla = parseFloat(b['위도(초/100)'])
    
            let a_pow = Math.abs(alo*alo + ala*ala - pow)
            let b_pow = Math.abs(blo*blo + bla*bla - pow)
    
            return a_pow - b_pow
        });      
        if (value.length != 0) {

            var address = value[0]['2단계']
            if (value[0]['3단계'] != "") {
                address += " " + value[0]['3단계']
            }

            res.json({result: true, data: {
                "province": value[0]['1단계'],
                "address": address,
                "x": value[0]['격자 X'],
                "y": value[0]['격자 Y']
            }})
        } else {
            res.json({result: false, errorMessage: "일치하는 좌표가 없습니다."})
        }
    } catch (err) {
        res.json({result: false, errorMessage: "에러 발생" + err.message})
    }
})

var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)

function dfs_xy_conv(latitude, longitude) { //위치좌표를 구역좌표(nx, ny)로 변환하는 함수
    var DEGRAD = Math.PI / 180.0;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    rs['lat'] = latitude;
    rs['lng'] = longitude;
    var ra = Math.tan(Math.PI * 0.25 + (latitude) * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);
    var theta = longitude * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5)
    rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
    return rs;
}