//express 모듈 불러오기
const express = require("express");
const XLSX = require('xlsx');
var router = express.Router();

const musicInfo = [];
getExcelData('music_info.xlsx', musicInfo)

router.get("/total", (req, res) => {
    try {
        res.status(200).json({result: true, message: null, data: musicInfo[0]})
    } catch (err) {
        res.status(500).json({result: false, message: "서버 에러" + err.message, data: null})
    }
})

router.get("/top", (req, res) => {
    try {
        const dataArray = musicInfo[0].filter(data => 
            data['rank'] != null 
        ).sort(function(a, b) { 
            return a['rank'] - b['rank'] 
        });
     
        res.status(200).json({result: true, message: null, data: dataArray})
    } catch (err) {
        res.status(500).json({result: false, message: "서버 에러" + err.message, data: null})
    }
})

function getExcelData(fileName, output) {
    var workbook = XLSX.readFile(fileName);
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
        output.push(data)
        console.log(data)
    });
}
module.exports = router;