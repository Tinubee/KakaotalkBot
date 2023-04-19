function Lotto(Kakao, roomName, sender, replier) {
  try {
    let lotto = [];
    while (lotto.length < 6) {
      let number = parseInt(Math.random() * 45) + 1;
      if (lotto.indexOf(number) < 0) {
        lotto.push(number);
      }
    }
    lotto.sort(function (a, b) {
      return a - b;
    });
    Kakao.sendLink(
      roomName,
      {
        template_id: 72728,
        template_args: {
          person: sender,
          lottonumber: lotto.toString(),
        },
      },
      "custom"
    );
  } catch (error) {
    replier.reply(error);
  }
}

module.exports = Lotto;
