function ClashroyalChest(Kakao, sender, room, replier) {
  try {
    let profileHash = sender;
    if (jsonPlayer[profileHash] == undefined) {
      replier.reply(
        "⚠️유저등록을 먼저 해주시기 바랍니다.\nℹ️방법: /태그등록 나의태그"
      );
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
      if (
        chest_classname.includes("silver") ||
        chest_classname.includes("golden") ||
        chest_classname.includes("magical") ||
        chest_classname.includes("royalwild") ||
        chest_classname.includes("legendary")
      ) {
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
        chest_name = chest_name == "chest magical" ? "마법 상자" : chest_name;
        chest_name =
          chest_name == "chest royalwild" ? "로얄 와일드 상자" : chest_name;
        chest_name = chest_name == "chest legendary" ? "전설 상자" : chest_name;

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
          img_3: chestImageArray[2],
          img_4: chestImageArray[3],
          img_5: chestImageArray[4],
          chestName_1: chestArray[0],
          chestCount_1: chestCountArray[0],
          chestName_2: chestArray[1],
          chestCount_2: chestCountArray[1],
          chestName_3: chestArray[2],
          chestCount_3: chestCountArray[2],
          chestName_4: chestArray[3],
          chestCount_4: chestCountArray[3],
          chestName_5: chestArray[4],
          chestCount_5: chestCountArray[4],
          USER_ID: player_nickname,
          USER_HASHCODE: player_tag,
        },
      },
      "custom"
    );
    //카카오링크전송
  } catch (e) {
    replier.reply("⚠️오류가 발생했습니다.\n오류내용 : " + e);
  }
}

module.exports = ClashroyalChest;
