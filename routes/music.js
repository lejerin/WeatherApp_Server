//express 모듈 불러오기
const express = require("express");
var fs = require('fs');
var router = express.Router();

router.get("/", (req, res) => {
    try {
        let name = req.query.name
        const readStream = fs.createReadStream(`./resource/${name}.mp3`)
        readStream.on('open', function () {
            readStream.pipe(res);
        })
        readStream.on('error', function(err) {
            res.status(404).json({result: false, message: "일치하는 노래를 찾지 못하였습니다."})
        })
    } catch (err) {
        res.status(500).json({result: false, message: "서버 에러" + err.message, data: null})
    }
})

module.exports = router;