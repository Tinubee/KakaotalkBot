function registerRoom(sender, msg, room, replier) {
  try {
    let roomInfo = msg.length == 4 ? room : msg.substr(4).trim();
    if (jsonRegisterRoom[roomInfo] == undefined)
      jsonRegisterRoom[roomInfo] = {};

    fs.write(pathRegisterRoomInfo, JSON.stringify(jsonRegisterRoom, null, 4));
    replier.reply("✅[ " + roomInfo + " ]방을 등록했습니다.");
  } catch (e) {
    replier.reply("⚠️오류가 발생했습니다.\n오류내용 : " + e);
  }
}

module.exports = registerRoom;
