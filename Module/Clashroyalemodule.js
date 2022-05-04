function Clashroyal(Kakao, msg, imageDB, room, replier) {
  if (msg.startsWith("/내정보삭제")) {
    let profileHash = imageDB.getProfileHash();
    if (jsonPlayer[profileHash] == undefined) {
      replier.reply("⚠️삭제할 정보가 없습니다.");
      return;
    } else {
      jsonPlayer[profileHash] = {};
      fs.write(pathPlayerInfo, JSON.stringify(jsonPlayer, null, 4));
    }
    replier.reply(
      "⚠️삭제가 완료되었습니다.\n삭제된 프로필 HashTag : " + profileHash
    );
  } else if (msg.startsWith("/태그등록")) {
    var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\(\'\"]/gi;
    var regex = / /gi;
    msg = msg.trim().replace(reg, "").replace(regex, "");

    let profileHash = imageDB.getProfileHash();
    if (jsonPlayer[profileHash] == undefined) jsonPlayer[profileHash] = {};

    let player_tag = msg.substr(4);
    let player_url = "https://royaleapi.com/player/" + player_tag;
    let html = org.jsoup.Jsoup.connect(player_url).get();
    let tagCheck = html.select("#sticky_context > h4").text();

    if (tagCheck) {
      replier.reply(
        "해당 태그의 유저를 조회 할 수 없습니다. 태그를 다시 확인해주세요."
      );
      return;
    } else {
      if (jsonPlayer[profileHash]["player_tag"] != undefined) {
        replier.reply(
          "⚠️이미 등록된 계정이 있습니다.\n변경을 원하시면 삭제 후 재등록 해주시기 바랍니다.\nℹ️삭제방법 : /내정보삭제"
        );
        return;
      }
      let player_nickname = html
        .select(
          "#page_content > div:nth-child(5) > div.ui.top.attached.padded.segment > div.p_header_container > div:nth-child(1) > h1"
        )
        .text();
      let player_clanName = html
        .select(
          "div.player__profile_header_container > div.player_aux_info > div.ui.horizontal.divided.list > div.ui.header.item > a"
        )
        .text();
      jsonPlayer[profileHash]["player_clanName"] = player_clanName;
      //클랜명 확인후 저장은 클랜명 태그로 저장
      //["본기", "2기", "플기", "3기", "Z기", "쉼터"];
      //본기 : YJQRVLGY
      //2기 : YJY8VJJQ
      //3기 : YVQ0L9RC
      //플기 : PQGQPCC9
      //Z기 : LPLLYQQU
      //쉼터 : LC0UG8YV
      let player_clanNameHash = "";
      if (player_clanName == "ALONE") player_clanName = "YJQRVLGY";
      else if (player_clanName == "ALONE 2기") player_clanNameHash = "YJY8VJJQ";
      else if (player_clanName == "ALONE 3기") player_clanNameHash = "YVQ0L9RC";
      else if (player_clanName == "ALONE 플기")
        player_clanNameHash = "PQGQPCC9";
      else if (player_clanName == "ALONE Z기") player_clanNameHash = "LPLLYQQU";
      else if (player_clanName == "ALONE 클랜쉼터")
        player_clanNameHash = "LC0UG8YV";

      jsonPlayer[profileHash]["player_tag"] = player_tag;
      jsonPlayer[profileHash]["player_nickname"] = player_nickname;
      jsonPlayer[profileHash]["player_clanNameHash"] = player_clanNameHash;

      fs.write(pathPlayerInfo, JSON.stringify(jsonPlayer, null, 4));
      replier.reply(
        "닉네임 : " +
          player_nickname +
          "\n태그 : " +
          player_tag +
          "\n클랜명 : " +
          player_clanName +
          " (#" +
          player_clanNameHash +
          ")" +
          "\n등록되었습니다."
      );
      return;
    }
  } else if (msg.startsWith("/내정보")) {
    let profileHash = imageDB.getProfileHash();
    if (jsonPlayer[profileHash] == undefined) {
      replier.reply(
        "등록된 정보가 없습니다. 정보를 등록해주세요(/태그등록 태그)\n► ex) /태그등록 QYQYRQ8Y"
      );
      return;
    }

    let player_nickname = jsonPlayer[profileHash]["player_nickname"];
    let player_tag = jsonPlayer[profileHash]["player_tag"];
    let player_url = "https://royaleapi.com/player/" + player_tag;
    let html = org.jsoup.Jsoup.connect(player_url).get();

    let userScore = html
      .select(
        "div.ui.top.attached.padded.segment > div.player__profile_header_container > div.ui.horizontal.list > div:nth-child(1)"
      )
      .text();
    //#page_content > div:nth-child(5) > div.ui.top.attached.padded.segment > div:nth-child(1) > img
    let userScoreImage = html
      .select(
        "#page_content > div:nth-child(5) > div.ui.top.attached.padded.segment > div:nth-child(1) > img"
      )
      .attr("src");
    let clanName = html
      .select(
        "div.player__profile_header_container > div.player_aux_info > div.ui.horizontal.divided.list > div.ui.header.item > a"
      )
      .text();

    if (clanName != jsonPlayer[profileHash]["player_clanName"]) {
      jsonPlayer[profileHash]["player_clanName"] = clanName;
      fs.write(pathPlayerInfo, JSON.stringify(jsonPlayer, null, 4));
    }

    let userLastscore = html
      .select(
        "#stats > div:nth-child(7) > div > div:nth-child(1) > div > table > tbody > tr:nth-child(14) > td.right.aligned"
      )
      .text();
    let userScore_split = userScore.split("/");
    userScore = userScore_split[0] + "🏆";
    let highScore = userScore_split[1];
    Kakao.sendLink(
      room,
      {
        template_id: 76012,
        template_args: {
          USER_ID: player_nickname,
          USER_SCORE: userScore,
          USER_SCORE_IMG: userScoreImage,
          CLAN_NAME: clanName,
          HIGH_SCORE: highScore,
          USER_SCORE_LAST: userLastscore.replace(",", ""),
          USER_HASHCODE: "#" + player_tag,
        },
      },
      "custom"
    );
  }
}

module.exports = Clashroyal;

//https://royaleapi.com/player/QYQYRQ8Y
//https://royaleapi.com/player/{플레이어 아이디}
