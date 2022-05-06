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

const messageCheckfuntion = require("messageCheck");
const registerRoomfuntion = require("registerRoom");
const Chatlogfuction = require("ChatLogmodule");
const Deeplearningfuction = require("Deeplearningmodule");
const Wikifuction = require("Wikimodule");
const Weatherfuction = require("Weathermodule");
const Covid19fuction = require("Covid19module");
const ClashRoyalefuction = require("Clashroyalemodule");
const ClashroyalClanfuntion = require("ClashroyalClan");
const ClashroyalChestfuntion = require("ClashroyalChest");
const ClashroyaluserInfofuntion = require("ClashroyaluserInfo");
const Pingpongfuction = require("Pingpongmodule");
const coinTrackerfuntion = require("coinTracker");
const Lottofuction = require("Lottomodule");
const botstatsCheckfuntion = require("botstatsCheck");
const menuReccomendfuntion = require("menuReccomend");

const ImageDB = com.xfl.msgbot.script.api.legacy.ImageDB;
const Replier = com.xfl.msgbot.script.api.legacy.SessionCacheReplier;

const scriptName = "HyoungminBot"; // 아마 꼭 넣어주세요
const fs = FileStream;

const pathdb = "sdcard/msgbot/Database/학습목록.txt";
const pathBenWord = "sdcard/msgbot/Database/금지어.txt";
const pathblacklist = "sdcard/msgbot/Database/블랙리스트.txt";
const pathadmin = "sdcard/msgbot/Database/관리자.txt";
const pathPlayerInfo = "sdcard/msgbot/Database/player.txt";
const pathRegisterRoomInfo = "sdcard/msgbot/Database/RegisterRoom.txt";

const line = "\n" + "\u2501".repeat(9) + "\n";
const Lw = "\u200b".repeat(500);

const msgCount = {};

if (!fs.read(pathdb)) fs.write(pathdb, "{}");
if (!fs.read(pathBenWord)) fs.write(pathBenWord, "{}");
if (!fs.read(pathblacklist)) fs.write(pathblacklist, "{}");
if (!fs.read(pathadmin)) fs.write(pathadmin, "{}");
if (!fs.read(pathPlayerInfo)) fs.write(pathPlayerInfo, "{}");
if (!fs.read(pathRegisterRoomInfo)) fs.write(pathRegisterRoomInfo, "{}");

let jsondb = JSON.parse(fs.read(pathdb));
let jsonBenWord = JSON.parse(fs.read(pathBenWord));
let jsonblacklist = JSON.parse(fs.read(pathblacklist));
let jsonadmin = JSON.parse(fs.read(pathadmin));
let jsonPlayer = JSON.parse(fs.read(pathPlayerInfo));
let jsonRegisterRoom = JSON.parse(fs.read(pathRegisterRoomInfo));

let PingpongRunMode = false;
let adminID = "";
let msgreadCount = 50;
Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "");

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

  Chatlogfuction(msg, room, sender, replier); //채팅로그 저장.
  autoReadmsg(room, replier); //자동읽음 처리.
  if (msg.startsWith("/방등록") && sender == "김형민") {
    registerRoomfuntion(Kakao, sender, msg, room, replier);
    return;
  }
  if (msg.startsWith("/")) {
    if (jsonRegisterRoom[room] == undefined) {
      replier.reply("⚠️등록된방이 아닙니다.\n방등록을 먼저 해주세요.");
      return;
    } else {
      //메세지 체크 후 처리.
      messageCheckfuntion(Kakao, room, msg, sender, replier, packageName);
    }
  }
  Deeplearningfuction(room, msg, sender, replier);
}

//등록된 방정보 출력.
function checkRegisterRoom(room, replier) {
  let roomList = [];
  for (let key in jsonRegisterRoom) {
    roomList.push(key);
  }
  replier.reply(roomList.join("\n"));
}

//자동읽음추가
function autoReadmsg(room, replier) {
  if (msgCount[room] === undefined) {
    msgCount[room] = 0;
  }
  msgCount[room]++;
  if (msgCount[room] > msgreadCount) {
    Api.markAsRead(room);
    replier.reply("ℹ️ 원활한 봇 가동을 위해 밀린 채팅을 자동읽음 처리합니다.");
    msgCount[room] = 0;
  }
}
//부기사진
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
//카카오톡 9.7.5 이상 버전에서 사용되는 메세지 처리
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
