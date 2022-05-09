function messageCheck(Kakao, room, msg, sender, replier, packageName) {
  //명령어 처리.
  if (msg.startsWith("/업비트")) {
    coinTrackerfuntion(msg, replier);
    return;
  } else if (
    msg.startsWith("/내정보") ||
    msg.startsWith("/태그등록") ||
    msg.startsWith("/내정보삭제")
  ) {
    ClashRoyalefuction(Kakao, sender, msg, room, replier);
    return;
  } else if (
    msg.startsWith("/클랜전") ||
    msg.startsWith("/지원률") ||
    msg.startsWith("/접속률") ||
    msg.startsWith("/점수")
  ) {
    ClashroyalClanfuntion(sender, msg, replier);
    return;
  } else if (msg.startsWith("/상자")) {
    replier.reply(
      "ℹ️" + sender + "님의 상자사이클 정보를 불러오는 중입니다..."
    );
    ClashroyalChestfuntion(Kakao, sender, room, replier);
    return;
  } else if (msg.startsWith("/상세정보")) {
    ClashroyaluserInfofuntion(sender, replier);
    return;
  } else if (msg.startsWith("/덱추천")) {
    replier.reply("ℹ️인기덱 50개중 1개를 불러오는 중입니다...");
    ClashroyalCardfuntion(Kakao, replier, room);
    return;
  } else if (msg.startsWith("/로또추천")) {
    Lottofuction(Kakao, room, sender);
    return;
  } else if (msg.startsWith("/코로나")) {
    Covid19fuction(Kakao, msg, room, replier);
    return;
  } else if (msg.startsWith("/메뉴추천")) {
    menuReccomendfuntion(room, replier);
    return;
  } else if (msg.startsWith("/날씨")) {
    Weatherfuction(Kakao, msg, room, replier);
    return;
  } else if (msg.startsWith("/부기사진")) {
    bugipicture(room, replier);
    return;
  } else if (msg.startsWith("/검색")) {
    Wikifuction(msg, WiKiaccess_key, replier);
    return;
  } else if (msg.startsWith("/봇정보")) {
    botstatsCheckfuntion(replier, scriptName);
    return;
  } else if (msg.startsWith("/등록방정보")) {
    checkRegisterRoom(room, replier);
    return;
  }
}

module.exports = messageCheck;
