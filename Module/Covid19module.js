function COVID19(Kakao,msg, room, replier) {
    try {
        let str_split_Arr = [];
        let AllList = [];
        let data_daycount_con = "";
        let data_alldaycount_con = "";
        let data_dead = "";
        let rate = "";
        let area = "";
        str_split_Arr = msg.split(" ");
        if (str_split_Arr.length < 2) {
            replier.reply("지역을 입력해주세요 ex) 코로나 대전");
            return;
        }

        let url = "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=13&ncvContSeq=&contSeq=&board_id=&gubun=";
        let url2 = "http://ncov.mohw.go.kr";
        let html = org.jsoup.Jsoup.connect(url).get();
        let html2 = org.jsoup.Jsoup.connect(url2).get();
        let time = html2.select("div.liveToggleOuter > div > div.live_left > div.occurrenceStatus > h2 > span").text();
        time = time.split(',');
        let list = html.select("div.data_table.midd.mgt24 > table > tbody").text();
        AllList = list.split(" ");
        if (str_split_Arr[1] == "전국" || str_split_Arr[1] == "한국") {
            area = "합계";
        }
        else {
            area = str_split_Arr[1];
        }
        let i = AllList.indexOf(area);
        if (i == -1) {
            replier.reply("조회되는 지역이 아닙니다. 지역을 다시확인해주세요.");
            return;
        }
        data_daycount_con = AllList[i + 1];
        data_alldaycount_con = AllList[i + 4];
        data_dead = AllList[i + 5];
        rate = AllList[i + 6];

        Kakao.sendLink(room, {
            "template_id": 72743,
            "template_args": {
                "area": str_split_Arr[1],
                "time": time[0] + ")",
                "DayCount_con": data_daycount_con,
                "AllCount_con": data_alldaycount_con,
                "dead": data_dead,
                "rate": rate
            }
        }, "custom");
    }
    catch (error) {
        replier.reply(error);
    }
}

module.exports = COVID19;