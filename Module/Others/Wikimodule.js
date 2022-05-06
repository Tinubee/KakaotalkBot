function wikiSearch(msg, WiKiaccess_key, replier) {
  try {
    let searchword = msg.substr(3).trim();
    let openApiURL = "http://aiopen.etri.re.kr:8000/WikiQA";
    let question = searchword;
    let type = "hybridqa";

    let requestJson = {
      access_key: WiKiaccess_key,
      argument: {
        question: question,
        type: type,
      },
    };

    result = org.jsoup.Jsoup.connect(openApiURL)
      .userAgent("Mozilla")
      .ignoreContentType(true)
      .header("Content-Type", "application/json;charset=UTF-8")
      .requestBody(JSON.stringify(requestJson))
      .post();

    r = JSON.parse(result.body().text());

    replier.reply(r.return_object.WiKiInfo.AnswerInfo[0].answer);
  } catch (error) {
    replier.reply("정의를 찾지 못했습니다.");
  }
}

module.exports = wikiSearch;
