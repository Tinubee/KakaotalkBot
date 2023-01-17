function CatchMind(Kakao, msg, room, sender, replier) {
  try {
    let GameStart = false,
      GameSet,
      GameRoom;
    let json = ApiRse("https://catchmind.netmarble.com/api/quiz/random");
    if (!GameStart) {
      let shuffledData = json.resultData.sort(() => Math.random() - 0.5);
      let currentProblem =
        shuffledData[Math.floor(Math.random() * shuffledData.length)];
      GameSet = currentProblem;

      Kakao.sendLink(
        room,
        {
          template_id: 88767,
          template_args: {
            getImage: GameSet.imgUrl,
            getWordLength: GameSet.word
              .split("")
              .map((char) => "●")
              .join(""),
          },
        },
        "custom"
      );

      GameStart = true;
      GameRoom = room;
    } else {
      if (GameRoom == room) {
        if (GameSet && msg == "/캐치 종료") {
          replier.reply(
            "게임 종료 되었습니다!\n해당 문제의 정답은 " +
              GameSet.word +
              "였습니다!"
          );
          GameStart = false;
          return;
        }
        if (GameSet && msg.substr(3).trim() == GameSet.word) {
          replier.reply(sender + "님 정답!\n게임 종료!");
          GameStart = false;
        } else {
          replier.reply(GameRoom, "틀렸습니다!");
        }
      }
    }
  } catch (error) {
    replier.reply(error);
  }
}

const ApiRse = (r) => {
  try {
    return null == r
      ? "값을 입력하지 않았습니다."
      : JSON.parse(
          Jsoup.connect(r)
            .ignoreContentType(true)
            .ignoreHttpErrors(true)
            .execute()
            .body()
        );
  } catch (r) {
    return r;
  }
};

module.exports = CatchMind;
