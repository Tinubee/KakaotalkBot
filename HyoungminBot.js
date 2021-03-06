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

const ImageDB = com.xfl.msgbot.script.api.legacy.ImageDB;
const Replier = com.xfl.msgbot.script.api.legacy.SessionCacheReplier;

const scriptName = "HyoungminBot"; // ?????? ??? ???????????????
const fs = FileStream;

const pathdb = "sdcard/msgbot/Database/????????????.txt";
const pathBenWord = "sdcard/msgbot/Database/?????????.txt";
const pathblacklist = "sdcard/msgbot/Database/???????????????.txt";
const pathadmin = "sdcard/msgbot/Database/?????????.txt";
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

//??????????????? ???????????? ?????? (????????? ?????? ??????????????????)
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
    room = sender; //???????????? room??? null??????????????? ??????.
  }
  if (jsonRegisterRoom[room] == undefined) {
    return;
  } else {
    Chatlogfuction(msg, room, sender, replier);
  }

  if (msg.startsWith("/?????????") && sender == "?????????") {
    registerRoomfuntion(Kakao, sender, msg, room, replier);
    return;
  }
  if (msg.startsWith("/")) {
    if (jsonRegisterRoom[room] == undefined) {
      replier.reply("????????????????????? ????????????.\n???????????? ?????? ????????????.");
      return;
    } else {
      messageCheckfuntion(Kakao, room, msg, sender, replier, packageName);
    }
  }
  if (msg.startsWith("@????????????") && sender == "?????????") {
    PingpongRunMode = true;
    adminID = msg.substr(5).split(" ")[1].trim();
    if (adminID == "") {
      replier.reply("???????????? ??????????????????");
      return;
    }
    replier.reply(adminID + "?????? ^_^");
    return;
  } else if (msg == "@????????????" && sender == "?????????") {
    PingpongRunMode = false;
    replier.reply(adminID + "?????? ??????");
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
  autoReadmsg(room, replier); //???????????? ??????.
}

function bugipicture(room, replier) {
  try {
    let number = parseInt(Math.random() * 15) + 1;
    let img_url =
      "https://res.cloudinary.com/dmvu7wol7/image/upload/v1647151572/??????/??????" +
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
//????????? ????????? ??????.
function checkRegisterRoom(replier) {
  let roomList = [];
  for (let key in jsonRegisterRoom) {
    roomList.push(key);
  }
  replier.reply(roomList.join("\n"));
}

//??????????????????
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

//???????????? 9.7.5 ?????? ???????????? ???????????? ????????? ??????
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
