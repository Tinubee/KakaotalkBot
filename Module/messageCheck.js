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
    msg.startsWith("/접속률")
  ) {
    ClashroyalClanfuntion(sender, msg, replier);
    return;
  } else if (msg.startsWith("/상자")) {
    ClashroyalChestfuntion(Kakao, sender, room, replier);
    return;
  } else if (msg.startsWith("/상세정보")) {
    ClashroyaluserInfofuntion(sender, replier);
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
  } else if (msg.startsWith("/대화시작") && sender == "김형민") {
    PingpongRunMode = true;
    adminID = msg.substr(5).split(" ")[1].trim();
    if (adminID == "") {
      replier.reply("사용자를 입력해주세요");
      return;
    }
    replier.reply(adminID + "하이 ^_^");
    return;
  } else if (msg == "/대화종료" && sender == "김형민") {
    PingpongRunMode = false;
    replier.reply(adminID + "빠이 ㅅㄱ");
    adminID = "";
    return;
  }

  if (PingpongRunMode && sender == adminID) {
    Pingpongfuction(msg, replier, Pingpong_key);
  }
}

module.exports = messageCheck;
