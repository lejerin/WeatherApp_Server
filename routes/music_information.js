//express 모듈 불러오기
const express = require("express");
const XLSX = require('xlsx');
var router = express.Router();

const musicInfo = [];
getExcelData('music_info.xlsx', musicInfo)

router.get("/total", (req, res) => {
    try {
        const dataArray = musicInfo[0].sort(function(a, b) { 
            return a['mck'] - b['mck'] 
        });
        res.status(200).json({result: true, message: null, data: dataArray})
    } catch (err) {
        res.status(500).json({result: false, message: "서버 에러" + err.message, data: null})
    }
})

router.get("/new", (req, res) => {
    try {
        const dataArray = musicInfo[0].sort(function(a, b) { 
            const aDateArr = a['releaseDate'].split(".");
            const bDateArr = b['releaseDate'].split(".");
            return parseInt(bDateArr[0] + bDateArr[1] + bDateArr[2]) - parseInt(aDateArr[0] + aDateArr[1] + aDateArr[2])
        })
        res.status(200).json({result: true, message: null, data: dataArray.slice(0,10)})
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

router.get("/mck", (req, res) => {
    try {
        const mckList = req.query.mcklist.split(",");
        const dataArray = musicInfo[0].filter(data => 
            mckList.includes(String(data['mck']))
        ).sort(function(a, b) { 
            return mckList.indexOf(a['mck']) - mckList.indexOf(b['mck'])
        });
        if (dataArray.length > 0) {
            res.status(200).json({result: true, message: null, data: dataArray})
        } else {
            res.status(501).json({result: false, message: "일치하는 노래 정보를 찾지 못하였습니다.", data: null})
        }
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