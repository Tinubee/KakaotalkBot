function Nword(msg, replier) {
  try {
    let input = msg.slice(5).trim();
    if (input.match(/^[가-힣a-z]+$/gi) === null)
      return replier.reply("한글 또는 영문만 입력 가능합니다.");
    try {
      let { outputs: output } = JSON.parse(
        org.jsoup.Jsoup.connect("https://demo.tunib.ai/api/text/nverse")
          .header("Content-Type", "application/json")
          .requestBody(JSON.stringify({ user_input: input }))
          .ignoreContentType(true)
          .post()
          .text()
      );
      replier.reply(
        input
          .split("")
          .map((e, i) => e + ": " + output[i])
          .join("\n")
      );
    } catch (e) {
      replier.reply(e.toString());
    }
  } catch (error) {
    replier.reply(error);
  }
}

module.exports = Nword;
