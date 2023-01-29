const { KakaoApiService, KakaoLinkClient } = require("kakaolink");
const Kakao = new KakaoLinkClient();
const InfoPath = "sdcard/msgbot/Bots/HyoungminBot/Info.json";
const infojson = JSON.parse(FileStream.read(InfoPath));

const kakaoapikey = infojson["AccountInfo"]["KaKao_APIKey"];
const KaKao_Email = infojson["AccountInfo"]["Kakao_Email"];
const KaKao_Email_PassWord = infojson["AccountInfo"]["KaKao_Email_PassWord"];

KakaoApiService.createService()
  .login({
    email: KaKao_Email,
    password: KaKao_Email_PassWord,
    keepLogin: true,
  })
  .then((e) => {
    Kakao.login(e, {
      apiKey: kakaoapikey,
      url: "http://naver.com",
    });
  })
  .catch((e) => {
    Log.e(e);
  });

const Pingpongapikey = infojson["AccountInfo"]["Pingpong_APIKey"];
const Pingpong_key = Pingpongapikey;

const WiKiaccesskey = infojson["AccountInfo"]["WiKiaccesskey"];
const WiKiaccess_key = WiKiaccesskey;

const OpenAI_APIKey = infojson["AccountInfo"]["OpenAI_APIKey"];

const messageCheckfuntion = require("HyoungminBotModule/messageCheck");
const registerRoomfuntion = require("HyoungminBotModule/registerRoom");
const Chatlogfuction = require("HyoungminBotModule/ChatLogmodule");
const Deeplearningfuction = require("HyoungminBotModule/Deeplearningmodule");
const Pingpongfuction = require("HyoungminBotModule/Pingpongmodule");
const Wikifuction = require("HyoungminBotModule/Wikimodule");
const Weatherfuction = require("HyoungminBotModule/Weathermodule");
const Covid19fuction = require("HyoungminBotModule/Covid19module");
const ClashRoyalefuction = require("HyoungminBotModule/Clashroyalemodule");
const ClashroyalClanfuntion = require("HyoungminBotModule/ClashroyalClan");
const ClashroyalChestfuntion = require("HyoungminBotModule/ClashroyalChest");
const ClashroyaluserInfofuntion = require("HyoungminBotModule/ClashroyaluserInfo");
const coinTrackerfuntion = require("HyoungminBotModule/coinTracker");
const Lottofuction = require("HyoungminBotModule/Lottomodule");
const botstatsCheckfuntion = require("HyoungminBotModule/botstatsCheck");
const menuReccomendfuntion = require("HyoungminBotModule/menuReccomend");
const ClashroyalCardfuntion = require("HyoungminBotModule/ClashRoyalCard");
const Nwordfuntion = require("HyoungminBotModule/Nword");

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
let msgreadCount = 100;
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
  if (jsonRegisterRoom[room] == undefined) {
    return;
  } else {
    Chatlogfuction(msg, room, sender, replier);
  }

  if (msg.startsWith("/방등록") && sender == "김형민") {
    registerRoomfuntion(Kakao, sender, msg, room, replier);
    return;
  }
  if (msg.startsWith("/")) {
    if (jsonRegisterRoom[room] == undefined) {
      replier.reply("⚠️등록된방이 아닙니다.\n방등록을 먼저 해주세요.");
      return;
    } else {
      messageCheckfuntion(Kakao, room, msg, sender, replier, packageName);
    }
  }
  if (msg.startsWith("@대화시작") && sender == "김형민") {
    PingpongRunMode = true;
    adminID = msg.substr(5).split(" ")[1].trim();
    if (adminID == "") {
      replier.reply("사용자를 입력해주세요");
      return;
    }
    replier.reply(adminID + "하이 ^_^");
    return;
  } else if (msg == "@대화종료" && sender == "김형민") {
    PingpongRunMode = false;
    replier.reply(adminID + "빠이 ㅅㄱ");
    adminID = "";
    return;
  }
  if (PingpongRunMode && sender == adminID) {
    Pingpongfuction(msg, replier, Pingpong_key);
    return;
  }
  if (Deeplearningfuction(room, msg, sender, replier)) {
    return;
  }
  autoReadmsg(room, replier); //자동읽음 처리.
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
//등록된 방정보 출력.
function checkRegisterRoom(replier) {
  let roomList = [];
  for (let key in jsonRegisterRoom) {
    roomList.push(key);
  }
  replier.reply(roomList.join("\n"));
}

//자동읽음추가
function autoReadmsg(room) {
  if (msgCount[room] === undefined) {
    msgCount[room] = 0;
  }
  msgCount[room]++;
  if (msgCount[room] > msgreadCount) {
    Api.markAsRead(room);
    msgCount[room] = 0;
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
