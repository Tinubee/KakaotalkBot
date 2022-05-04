function ClashroyalClan(Kakao, sender, msg, imageDB, room, replier) {
  let profileHash = sender;
  if (jsonPlayer[profileHash] == undefined) {
    replier.reply("유저등록 먼저 해주세요.");
    return;
  }

  let player_clanName = jsonPlayer[profileHash]["player_clanName"];
  let player_clanNameHash = jsonPlayer[profileHash]["player_clanNameHash"];

  let clan_war_url =
    "https://royaleapi.com/clan/" + player_clanNameHash + "/war/race";
  let clan_war_html = org.jsoup.Jsoup.connect(clan_war_url).get();

  let clan_url_json =
    "https://link-api.clashroyale.com/clans/%23" + player_clanNameHash;
  let res = org.jsoup.Jsoup.connect(clan_url_json)
    .ignoreContentType(true)
    .ignoreHttpErrors(true)
    .get()
    .text();

  let data = JSON.parse(res);

  if (msg.startsWith("/클랜전")) {
    let clanWarStateInfo = [];
    for (var k = 4; k <= 7; k++) {
      let clanWarState = clan_war_html
        .select("div.timeline > ul > li:nth-child(" + k + ")")
        .text();
      if (!clanWarState) {
        clanWarState = "NAN";
      }
      clanWarStateInfo.push(clanWarState);
    }

    for (var i = 0; i < clanWarStateInfo.length; i++) {
      if (clanWarStateInfo[i].includes("Day")) {
        let DayNumber = clanWarStateInfo[i].split(" ")[1];
        let clan_UserCount = data.members;
        let userInfo = [];
        for (var i = 1; i <= parseInt(clan_UserCount); i++) {
          let useDecksCount = clan_war_html
            .select(
              "#page_content > div.ui.attached.container.sidemargin0.content_container > div:nth-child(3) > table > tbody > tr:nth-child(" +
                i +
                ") > td.player_name > div.player_data > div.value_bg.decks_used_today"
            )
            .text();
          if (useDecksCount != "4") {
            let userName = clan_war_html
              .select(
                "#page_content > div.ui.attached.container.sidemargin0.content_container > div:nth-child(3) > table > tbody > tr:nth-child(" +
                  i +
                  ") > td.player_name > div.player_info > a"
              )
              .text();
            userInfo.push(userName + "님 - " + (4 - useDecksCount) + "개\n");
          }
        }

        if (userInfo.length > 0) {
          replier.reply(
            "◈ " +
              player_clanName +
              " ◈전투일 " +
              DayNumber +
              "일차 클랜전 경고 명단\n" +
              userInfo.join("") +
              "\n클랜전 참여 부탁드립니다🙏. 개인사정때문에 참여불가능하시면 편하게 말씀해주세요😀"
          );
        } else {
          replier.reply(
            player_clanName +
              " ◈전투일 " +
              Day +
              "일차 전원 클랜전 참여 완료하였습니다. 수고하셨습니다🥳"
          );
        }
        return;
      }
    }
    replier.reply("훈련일 입니다. 클랜전 시작시 알려드릴게요.😀");
    return;
  } else if (msg.startsWith("/클랜지원률")) {
    let clan_UserCount = data.members;
    let userInfo = [];
    for (var i = 0; i < parseInt(clan_UserCount); i++) {
      let checkSupport = data.memberList[i].donations;
      if (parseInt(checkSupport) < 100) {
        let AllUserInfo = data.memberList[i].name;
        userInfo.push(AllUserInfo + " : " + checkSupport + "\n");
      }
    }
    if (userInfo.length > 0) {
      replier.reply(
        "◈ " +
          player_clanName +
          " ◈의 지원률 100이하 유저\n" +
          userInfo.join("") +
          "\n최소한 지원률100이상은 오늘까지 유지해주시면 감사하겠습니다.🙏"
      );
      return;
    } else {
      replier.reply(player_clanName + " 지원률 100이하인 유저가 없습니다.😊");
      return;
    }
  }
}

module.exports = ClashroyalClan;
