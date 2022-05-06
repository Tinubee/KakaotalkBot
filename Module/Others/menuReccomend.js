function menuReccomend(room, replier) {
  try {
    var tag = Math.floor(Math.random() * 99 + 1);
    var data = Utils.parse("https://cuncho.dev/food/" + tag + "/");
    var b = data.select("div.b").text();
    var a = data.select("div.answer").text();
    Kakao.sendLink(
      room,
      {
        template_id: 72790,
        template_args: {
          img: a,
          text: "오늘의 메뉴는 " + b + " 어떠세요?",
        },
      },
      "custom"
    );
  } catch (e) {
    replier.reply("⚠️오류가 발생했습니다.\n오류내용 : " + e);
  }
}

module.exports = menuReccomend;
