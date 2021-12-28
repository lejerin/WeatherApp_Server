//express 모듈 불러오기
const express = require("express");
var router = express.Router();

router.get('/',function(req, res){
    try {
        const body = `
        <html>
        <style>
        h1 {
        font-family: Impact, sans-serif;
        color: #CE5937;
        }
        table, td, th {
          border : 1px solid black;
          border-collapse : collapse;
          padding : 7px
        }
        </style>
        <head>
        <title>API DOCUMENT</title>
        <meta charset="UTF-8">
        </head>
        <body>
        <h1>Music App API 문서</h1>
        <br>
        <h4>Domain : https://happyweatherapp.herokuapp.com</h4>
        <br>  
        <h2>1. 음악 재생</h2>
        <h4>URL</h4>
        <p>GET&nbsp;&nbsp;&nbsp;/music/play?mck={mck}</p>  
        <h4>Parameter</h4>
        <table border="1">
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
            <tr>
                <td>mck</td>
                <td>Integer</td>
                <td>음악 고유키</td>
                <td>O</td>
            </tr>
        </table>
        <br>
        <br>  
        <h2>2. 모든 음악 리스트 가져오기</h2>
        <h4>URL</h4>
        <p>GET&nbsp;&nbsp;&nbsp;/music/info/total</p>  
        <h4>Response</h4>
        <table border="1">
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Ex</th>
            <tr>
                <td>result</td>
                <td>Boolean</td>
                <td>API 성공 여부</td>
                <td>true</td>
            </tr>
            <tr>
                <td>message</td>
                <td>String?</td>
                <td>에러 발생 시, 메세지 전달 (성공 시, null)</td>
                <td>서버 에러</td>
            </tr>
            <tr>
                <td>data</td>
                <td>JsonArray?</td>
                <td>음악 정보 리스트</td>
                <td>[
            {
              "mck": 0,
              "rank": 1,
              "title": "월급은 통장을 스칠 뿐",
              "singer": "스텔라장 (Stella Jang)",
              "genre": "인디음악",
              "subGenre": "포크/블루스",
              "album": "월급은 통장을 스칠 뿐",
              "releaseDate": "2017.04.30",
              "lyricist": "스텔라장 (Stella Jang)",
              "composer": "스텔라장 (Stella Jang)",
              "albumCover": "https://cdnimg.melon.co.kr/cm/album/images/100/58/886/10058886_500.jpg",
              "profile": "https://cdnimg.melon.co.kr/cm2/artistcrop/images/007/22/722/722722_20200407151453_500.jpg"
            }]</td>
            </tr>
        </table>  
        <p>mck : Integer</p>
        <p>rank : Integer?</p>
        <p>subGenre : String?</p>
        그 외, 모든 타입 String  
        <br>
        <br>  
        <h2>3. 랭킹 음악 리스트 가져오기</h2>
        <h4>URL</h4>
        <p>GET&nbsp;&nbsp;&nbsp;/music/info/top</p>
        <h4>Response</h4>  
        <table border="1">
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Ex</th>
            <tr>
                <td>result</td>
                <td>Boolean</td>
                <td>API 성공 여부</td>
                <td>true</td>
            </tr>
            <tr>
                <td>message</td>
                <td>String?</td>
                <td>에러 발생 시, 메세지 전달 (성공 시, null)</td>
                <td>서버 에러</td>
            </tr>
            <tr>
                <td>data</td>
                <td>JsonArray?</td>
                <td>음악 정보 리스트</td>
                <td>[
            {
              "mck": 0,
              "rank": 1,
              "title": "월급은 통장을 스칠 뿐",
              "singer": "스텔라장 (Stella Jang)",
              "genre": "인디음악",
              "subGenre": "포크/블루스",
              "album": "월급은 통장을 스칠 뿐",
              "releaseDate": "2017.04.30",
              "lyricist": "스텔라장 (Stella Jang)",
              "composer": "스텔라장 (Stella Jang)",
              "albumCover": "https://cdnimg.melon.co.kr/cm/album/images/100/58/886/10058886_500.jpg",
              "profile": "https://cdnimg.melon.co.kr/cm2/artistcrop/images/007/22/722/722722_20200407151453_500.jpg"
            }]</td>
            </tr>
        </table>
        <p>mck : Integer</p>
        <p>rank : Integer</p>
        <p>subGenre : String?</p>
        그 외, 모든 타입 String    
        <br>
        <br>
        <h2>4. 최신 음악 리스트 가져오기</h2>
        <h4>URL</h4>
        <p>GET&nbsp;&nbsp;&nbsp;/music/info/new</p>
        <h4>Response</h4>  
        <p>2번 전체 목록 응답과 동일</p>
        <p>최신 발매순으로 정렬하여 10곡 리스트 반환</p>
        </body>
        </html>
`
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(body);
	res.end();
    } catch (err) {
        res.status(500).json({result: false, message: "서버 에러" + err.message, data: null})
    }
})

module.exports = router;