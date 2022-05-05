function ClashroyalClan(Kakao, sender, msg, imageDB, room, replier) {
  try {
    let profileHash = sender;
    if (jsonPlayer[profileHash] == undefined) {
      replier.reply(
        "⚠️유저등록을 먼저 해주시기 바랍니다.\nℹ️방법: /태그등록 나의태그"
      );
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
              userInfo.push(userName + "님 - " + (4 - useDecksCount) + "회\n");
            }
          }

          if (userInfo.length > 0) {
            replier.reply(
              "◈ " +
                player_clanName +
                "◈\n전투일 " +
                DayNumber +
                "일차 클랜전 경고 명단\n\n" +
                userInfo.join("")
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
    } else if (msg.startsWith("/지원률")) {
      let clan_UserCount = data.members;
      let userInfo = [];
      for (var i = 0; i < parseInt(clan_UserCount); i++) {
        let checkSupport = data.memberList[i].donations;
        if (parseInt(checkSupport) < 100) {
          let AllUserInfo = data.memberList[i].name;
          userInfo.push(AllUserInfo + "님 : " + checkSupport + "\n");
        }
      }
      if (userInfo.length > 0) {
        replier.reply(
          "◈ " +
            player_clanName +
            " ◈\n지원률100이하 명단\n\n" +
            userInfo.join("")
        );
        return;
      } else {
        replier.reply(player_clanName + " 지원률 100이하인 유저가 없습니다.😊");
        return;
      }
    } else if (msg.startsWith("/클랜접속률")) {
      //클랜원들의 접속률 상태 확인.
    }
  } catch (error) {
    replier.reply("오류가 발생했습니다.\n오류내용 : " + e);
  }
}

module.exports = ClashroyalClan;
