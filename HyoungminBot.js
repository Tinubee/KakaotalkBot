const { KakaoLinkClient } = require("kakaolink");
const InfoPath = "sdcard/msgbot/Bots/HyoungminBot/Info.json";
const infojson = JSON.parse(FileStream.read(InfoPath));

const kakaoapikey = infojson["AccountInfo"]["KaKao_APIKey"];
const KaKao_Email = infojson["AccountInfo"]["Kakao_Email"];
const KaKao_Email_PassWord = infojson["AccountInfo"]["KaKao_Email_PassWord"];
const Kakao = new KakaoLinkClient(kakaoapikey, "http://naver.com");
const Pingpongapikey = infojson["AccountInfo"]["Pingpong_APIKey"];
const Pingpong_key = Pingpongapikey;

const WiKiaccesskey = infojson["AccountInfo"]["WiKiaccesskey"];
const WiKiaccess_key = WiKiaccesskey;
Kakao.login(KaKao_Email, KaKao_Email_PassWord);

const Lottofuction = require("Lottomodule");
const Chatlogfuction = require("ChatLogmodule");
const Deeplearningfuction = require("Deeplearningmodule");
const Wikifuction = require("Wikimodule");
const Weatherfuction = require("Weathermodule");
const Covid19fuction = require("Covid19module");
const ClashRoyalefuction = require("Clashroyalemodule");
const Pingpongfuction = require("Pingpongmodule");

const ImageDB = com.xfl.msgbot.script.api.legacy.ImageDB;
const Replier = com.xfl.msgbot.script.api.legacy.SessionCacheReplier;

const scriptName = "HyoungminBot"; // 아마 꼭 넣어주세요
const fs = FileStream;

const pathdb = "sdcard/msgbot/Database/학습목록.txt";
const pathBenWord = "sdcard/msgbot/Database/금지어.txt";
const pathblacklist = "sdcard/msgbot/Database/블랙리스트.txt";
const pathadmin = "sdcard/msgbot/Database/관리자.txt";
const pathPlayertag = "sdcard/msgbot/Database/player.txt";

const line = "\n" + "\u2501".repeat(9) + "\n";
const Lw = "\u200b".repeat(500);

if (!fs.read(pathdb)) fs.write(pathdb, "{}");
if (!fs.read(pathBenWord)) fs.write(pathBenWord, "{}");
if (!fs.read(pathblacklist)) fs.write(pathblacklist, "{}");
if (!fs.read(pathadmin)) fs.write(pathadmin, "{}");
if (!fs.read(pathPlayertag)) fs.write(pathPlayertag, "{}");

let jsondb = JSON.parse(fs.read(pathdb));
let jsonBenWord = JSON.parse(fs.read(pathBenWord));
let jsonblacklist = JSON.parse(fs.read(pathblacklist));
let jsonadmin = JSON.parse(fs.read(pathadmin));
let jsonPlayer = JSON.parse(fs.read(pathPlayertag));

let PingpongRunMode = false;
let adminID = "";
let RegisterRooms = [];
RegisterRooms = infojson["RegisterRoom"];
//실질적으로 작동하는 부분 (메세지 오면 답장하는부분)
function responseFix(
  room,
  msg,
  sender,
  isGroupChat,
  replier,
  imageDB,
  packageName
) {
  if (isGroupChat == false) {
    room = sender; //개인톡은 room이 null로들어와서 변경.
  }
  if (msg.startsWith("/대화시작") && sender == "김형민") {
    PingpongRunMode = true;
    adminID = msg.substr(5).split(" ")[1].trim();
    if (adminID == "") {
      replier.reply("사용자를 입력해주세요");
      return;
    }
    replier.reply(adminID + "하이 ^_^");
    return;
  }
  if (msg == "/대화종료" && sender == "김형민") {
    PingpongRunMode = false;
    replier.reply(adminID + "빠이 ㅅㄱ");
    adminID = "";
    return;
  }
  if (PingpongRunMode && sender == adminID) {
    Pingpongfuction(room, msg, sender, replier, Pingpong_key);
  }

  if (room == "가족") {
    if (msg == "로또추천") {
      Lottofuction(Kakao, roomName, sender);
      return;
    }
    if (msg.startsWith("코로나")) {
      Covid19fuction(Kakao, msg, room, replier);
      return;
    }
    if (msg == "메뉴추천") {
      menuReccomend(room, replier);
      return;
    }
    if (msg.startsWith("날씨")) {
      Weatherfuction(Kakao, msg, room, replier);
      return;
    }
    if (msg.startsWith("부기사진")) {
      bugipicture(room, replier);
      return;
    }
    Deeplearningfuction(room, msg, sender, replier);
  } else if (
    room == "김형민" ||
    room == "임세현" ||
    room == "짜잔" ||
    room == "형용셉" ||
    room == "멤브레인" ||
    room == "친구들" ||
    room == "형민테스트방"
  )
    Chatlogfuction(msg, room, sender, replier);
  if (msg.startsWith("/클로검색") || msg.startsWith("/태그등록")) {
    ClashRoyalefuction(Kakao, msg, imageDB, room, replier);
  }
  if (msg.startsWith("/문장분석")) {
    MsgParaphrasing(msg, replier);
  }
  if (msg.startsWith("/검색")) {
    Wikifuction(msg, WiKiaccess_key, replier);
  }
  if (msg == "로또추천") {
    Lottofuction(Kakao, room, sender);
    return;
  }
  if (msg.startsWith("코로나")) {
    Covid19fuction(Kakao, msg, room, replier);
    return;
  }
  if (msg.startsWith("/업비트")) {
    UpbitCoinInfo(msg, replier);
    return;
  }
  if (msg == "메뉴추천") {
    menuReccomend(room, replier);
    return;
  }
  if (msg.startsWith("날씨")) {
    Weatherfuction(Kakao, msg, room, replier);
    return;
  }
  if (msg.startsWith("부기사진")) {
    bugipicture(room, replier);
    return;
  }
  Deeplearningfuction(room, msg, sender, replier);
}

function bugipicture(room, replier) {
  try {
    let number = parseInt(Math.random() * 15) + 1;
    let img_url =
      "https://res.cloudinary.com/dmvu7wol7/image/upload/v1647151572/부기/부기" +
      number +
      ".jpg";

    Kakao.sendLink(
      room,
      {
        template_id: 72908,
        template_args: {
          img: img_url,
        },
      },
      "custom"
    );
  } catch (error) {
    replier.reply(error);
  }
}

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
  } catch (error) {
    replier.reply(error);
  }
}

////////////////////////업비트 관련 데이터 가공함수들/////////////////////////////////////////////
function upbit_func(coin_symbol) {
  let upbit_url = "https://api.upbit.com/v1/ticker?markets=KRW-";
  upbit_url += coin_symbol;
  return JSON.parse(
    org.jsoup.Jsoup.connect(upbit_url).ignoreContentType(true).get().text()
  );
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
////////////////////////////////////////////////////////////////////////////////////////////////

//업비트에서 코인 시세 불러오기.
function UpbitCoinInfo(msg, replier) {
  var str_split_Arr = [];
  str_split_Arr = msg.split(" ");
  try {
    let upbit_coin_symbol = "BTC";
    if (str_split_Arr.length != 1) {
      upbit_coin_symbol = str_split_Arr[1];

      let coin_symbol_krw = JSON.parse(
        org.jsoup.Jsoup.connect("https://api.upbit.com/v1/market/all")
          .ignoreContentType(true)
          .get()
          .text()
      );

      for (let i in coin_symbol_krw) {
        let keywordData = coin_symbol_krw[i];
        let keywordData_replaced = keywordData["korean_name"].replace(
          /(<([^>]+)>)/gi,
          " "
        );

        if (keywordData_replaced == upbit_coin_symbol) {
          upbit_coin_symbol = keywordData["market"]
            .replace(/(<([^>]+)>)/gi, " ")
            .split("-")[1];
          break;
        }
      }
    }

    upbit_coin_symbol = upbit_coin_symbol.toUpperCase();
    let upbit_json = upbit_func(upbit_coin_symbol);
    let output_text = "";
    output_text += "[UPBIT API]\n";
    output_text += "<" + upbit_coin_symbol + "/KRW>\n";
    output_text +=
      numberWithCommas(upbit_json[0].trade_price) +
      " (" +
      (upbit_json[0].signed_change_rate * 100).toFixed(2) +
      "%)\n\n";
    output_text +=
      "24H 고가 : " + numberWithCommas(upbit_json[0].high_price) + " KRW\n";
    output_text +=
      "24H 저가 : " + numberWithCommas(upbit_json[0].low_price) + " KRW\n";
    output_text +=
      "24H 종가 : " +
      numberWithCommas(upbit_json[0].prev_closing_price) +
      " KRW";
    replier.reply(output_text);
  } catch (error) {
    replier.reply("해당 코인이 존재하지 않습니다\n" + error);
  }
}

//문장간 유사도 검출
function MsgParaphrasing(Amsg, Bmsg, replier) {
  try {
    var openApiURL = "http://aiopen.etri.re.kr:8000/ParaphraseQA";
    var access_key = WiKiaccess_key;

    var requestJson = {
      access_key: access_key,
      argument: {
        sentence1: Amsg,
        sentence2: Bmsg,
      },
    };

    result = org.jsoup.Jsoup.connect(openApiURL)
      .userAgent("Mozilla")
      .ignoreContentType(true)
      .header("Content-Type", "application/json;charset=UTF-8")
      .requestBody(JSON.stringify(requestJson))
      .post();

    r = JSON.parse(result.body().text());
    if (r.return_object.result == "paraphrase") {
      return true; //paraphrase (두 문장의 의미가 동등함)
    } else {
      return false; //non-paraphrase (두 문장의 의미가 다름)
    }
  } catch (error) {
    replier.reply(error);
  }
}

//카카오톡 9.7.5 이상 버전에서 사용하는 기능
function onNotificationPosted(sbn, sm) {
  var packageName = sbn.getPackageName();
  if (!packageName.startsWith("com.kakao.tal")) return;
  var actions = sbn.getNotification().actions;
  if (actions == null) return;
  var act = actions[actions.length - 1];
  var bundle = sbn.getNotification().extras;

  var msg = bundle.get("android.text").toString();
  var sender = bundle.getString("android.title");
  var room = bundle.getString("android.subText");
  if (room == null) room = bundle.getString("android.summaryText");
  var isGroupChat = room != null;
  var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(
    packageName,
    act,
    room,
    false,
    ""
  );
  var icon = bundle
    .getParcelable("android.messagingUser")
    .getIcon()
    .getBitmap();
  var image = bundle.getBundle("android.wearable.EXTENSIONS");
  if (image != null) image = image.getParcelable("background");
  var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
  com.xfl.msgbot.application.service.NotificationListener.e.put(room, act);
  responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName);
}
