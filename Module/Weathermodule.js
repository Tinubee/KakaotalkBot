function Weather(Kakao, msg, room, replier) {
    try {
        let str_msg = [];
        let spl_temp = [];
        str_msg = msg.split(" ");
        if (str_msg.length < 2) {
            replier.reply("지역을 입력해주세요 ex) 날씨 대전");
            return;
        }

        let url = "https://m.search.naver.com/search.naver?&query=" + str_msg[1] + "%20날씨";
        let img_url = "https://www.google.com/search?q=" + str_msg[1] + "날씨";
        let html = org.jsoup.Jsoup.connect(url).get();
        let html_img = org.jsoup.Jsoup.connect(img_url).get();

        let str_temp = html.select("div.weather_graphic > div.temperature_text > strong").text();
        let str_beforeUp = html.select("div.temperature_info > p > span.temperature.up").text();
        let str_beforeDown = html.select("div.temperature_info > p > span.temperature.down").text();
        let str_state = html.select("div.temperature_info > p > span.weather.before_slash").text();
        let str_img = html_img.select("img[class=wob_tci]").attr("abs:src");

        spl_temp = str_temp.split(" ");
        if (spl_temp[0] + spl_temp[1] == "undefined") {
            replier.reply("해당지역의 날씨는 불러올 수 없습니다.");
            return;
        }
        Kakao.sendLink(room, {
            "template_id": 72792,
            "template_args": {
                "temp": spl_temp[0] + spl_temp[1],
                "before": str_beforeUp + str_beforeDown,
                "area": str_msg[1],
                "state": str_state,
                "img": str_img,
                "mw_path": str_msg[1],
                "web_path": str_msg[1]
            }
        }, "custom");
    }
    catch (error) {
        replier.reply(error);
    }
}

module.exports = Weather;