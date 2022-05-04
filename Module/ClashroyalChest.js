function ClashroyalChest(Kakao, sender, msg, imageDB, room, replier) {
  let profileHash = sender;
  if (jsonPlayer[profileHash] == undefined) {
    replier.reply("유저등록 먼저 해주세요.");
    return;
  }

  let player_tag = jsonPlayer[profileHash]["player_tag"];
  let player_nickname = jsonPlayer[profileHash]["player_nickname"];
  let player_url = "https://royaleapi.com/player/" + player_tag;
  let player_url_html = org.jsoup.Jsoup.connect(player_url).get();

  let allCount = player_url_html.select(
    "#stats > div.ui.attached.segment.player__chest_segment > div > div"
  ).length;

  let chestArray = [];
  let chestCountArray = [];
  let chestImageArray = [];
  for (var i = 1; i <= allCount; i++) {
    let chest_url = player_url_html.select(
      "#stats > div.ui.attached.segment.player__chest_segment > div > div:nth-child(" +
        i +
        ")"
    );

    let chest_classname = chest_url.attr("class");
    if (chest_classname.includes("chest")) {
      let chest_name = chest_classname;
      let chest_count = player_url_html
        .select(
          "#stats > div.ui.attached.segment.player__chest_segment > div > div:nth-child(" +
            i +
            ") > div:nth-child(1)"
        )
        .text();

      let imageurl =
        "https://res.cloudinary.com/dmvu7wol7/image/upload/v1651679474/클래시로얄/" +
        chest_name +
        ".png";

      chest_name = chest_name == "chest silver" ? "실버 상자" : chest_name;
      chest_name = chest_name == "chest golden" ? "골드 상자" : chest_name;
      chest_name = chest_name == "chest giant" ? "자이언트 상자" : chest_name;
      chest_name = chest_name == "chest goldcrate" ? "골드 보관함" : chest_name;
      chest_name =
        chest_name == "chest plentifulgoldcrate"
          ? "풍부한 골드 보관함"
          : chest_name;
      chest_name =
        chest_name == "chest overflowinggoldcrate"
          ? "가득한 골드 보관함"
          : chest_name;
      chest_name = chest_name == "chest magical" ? "마법 상자" : chest_name;
      chest_name =
        chest_name == "chest megalightning" ? "메가 번개 상자" : chest_name;
      chest_name =
        chest_name == "chest royalwild" ? "로얄 와일드 상자" : chest_name;
      chest_name = chest_name == "chest legendary" ? "전설 상자" : chest_name;
      chest_name = chest_name == "chest epic" ? "영웅 상자" : chest_name;

      if (!chestArray.includes(chest_name)) {
        chestArray.push(chest_name);
        chestCountArray.push(chest_count.replace("+", ""));
        chestImageArray.push(imageurl);
      }
    }
  }

  Kakao.sendLink(
    room,
    {
      template_id: 76103,
      template_args: {
        img_1: chestImageArray[0],
        img_2: chestImageArray[1],
        img_3: chestImageArray[6],
        img_4: chestImageArray[9],
        img_5: chestImageArray[8],
        USER_HASHCODE: player_tag,
        chestName_1: chestArray[0],
        chestCount_1: chestCountArray[0],
        chestName_2: chestArray[1],
        chestCount_2: chestCountArray[1],
        chestName_3: chestArray[6],
        chestCount_3: chestCountArray[6],
        chestName_4: chestArray[9],
        chestCount_4: chestCountArray[9],
        chestName_5: chestArray[8],
        chestCount_5: chestCountArray[8],
        USER_ID: player_nickname,
      },
    },
    "custom"
  );
  //카카오링크전송
}

module.exports = ClashroyalChest;
