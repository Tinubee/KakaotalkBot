function Clashroyal(Kakao, sender, msg, room, replier) {
  const 본기 = "YJQRVLGY";
  const 플기 = "PQGQPCC9";
  const _2기 = "YJY8VJJQ";
  const _3기 = "YVQ0L9RC";
  const Z기 = "LPLLYQQU";
  const 기타 = "QPVYVQ9V";

  try {
    if (msg.startsWith("/내정보삭제")) {
      let profileHash = sender;
      if (jsonPlayer[profileHash] == undefined) {
        replier.reply("⚠️삭제할 정보가 없습니다.");
        return;
      } else {
        delete jsonPlayer[profileHash];
        fs.write(pathPlayerInfo, JSON.stringify(jsonPlayer, null, 4));
      }
      replier.reply("⚠️삭제가 완료되었습니다.\n삭제된 프로필 : " + profileHash);
    } else if (msg.startsWith("/태그등록")) {
      var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\(\'\"]/gi;
      var regex = / /gi;
      msg = msg.trim().replace(reg, "").replace(regex, "");

      let profileHash = sender;
      if (jsonPlayer[profileHash] == undefined) jsonPlayer[profileHash] = {};

      let player_tag = msg.substr(4);
      player_tag = player_tag.toUpperCase();

      let user_info_url = "https://royaleapi.com/player/" + player_tag;
      let user_info_html = org.jsoup.Jsoup.connect(user_info_url).get();

      let user_info_clan = user_info_html
        .select(
          "#page_content > div:nth-child(4) > div.ui.top.attached.padded.segment.player_profile__header_segment > div.player__profile_header_container > div.player_aux_info > div.ui.horizontal.divided.list > div.ui.header.item > a"
        )
        .text();

      let user_info_name = user_info_html
        .select(
          "#page_content > div:nth-child(4) > div.ui.top.attached.padded.segment.player_profile__header_segment > div.p_header_container > div:nth-child(1) > h1"
        )
        .text();

      let 클랜태그 = "";

      if (user_info_clan == "ALONE") 클랜태그 = 본기;
      else if (user_info_clan == "Faded플러스") 클랜태그 = 플기;
      else if (user_info_clan == "ALONE Z기") 클랜태그 = Z기;
      else if (user_info_clan == "ALONE 2기") 클랜태그 = _2기;
      else if (user_info_clan == "ALONE 3기") 클랜태그 = _3기;
      else if (user_info_clan == "REST OF ALONE") 클랜태그 = 기타;
      // let player_url_json =
      //   "https://link-api.clashroyale.com/players/%23" + player_tag;
      // let res = org.jsoup.Jsoup.connect(player_url_json)
      //   .ignoreContentType(true)
      //   .ignoreHttpErrors(true)
      //   .get()
      //   .text();

      // let data = JSON.parse(res);

      // if (data.reason == "notFound") {
      //   replier.reply(
      //     "⚠️해당 태그의 유저를 조회 할 수 없습니다. 태그를 다시 확인해주세요."
      //   );
      //   return;
      // } else {
      if (jsonPlayer[profileHash]["player_tag"] != undefined) {
        replier.reply(
          "⚠️이미 등록된 계정이 있습니다.\n변경을 원하시면 삭제 후 재등록 해주시기 바랍니다.\nℹ️삭제방법 : /내정보삭제"
        );
        return;
      }
      //let player_nickname = data.name;
      let player_clanName = user_info_clan;
      jsonPlayer[profileHash]["player_clanName"] = player_clanName;
      jsonPlayer[profileHash]["player_tag"] = player_tag;
      jsonPlayer[profileHash]["player_nickname"] = user_info_name;
      let player_clanTag = (jsonPlayer[profileHash]["player_clanNameHash"] =
        클랜태그);

      fs.write(pathPlayerInfo, JSON.stringify(jsonPlayer, null, 4));
      replier.reply(
        "닉네임 : " +
          user_info_name +
          "\n태그 : " +
          player_tag +
          "\n클랜명 : " +
          user_info_clan +
          " (" +
          player_clanTag +
          ")" +
          "\n등록되었습니다."
      );
      return;
      //}
    } else if (msg.startsWith("/내정보")) {
      let profileHash = sender;
      if (jsonPlayer[profileHash] == undefined) {
        replier.reply(
          "⚠️등록된 정보가 없습니다. 정보를 등록해주세요.\nℹ️방법: /태그등록 나의태그"
        );
        return;
      }

      let player_nickname = jsonPlayer[profileHash]["player_nickname"];
      let player_tag = jsonPlayer[profileHash]["player_tag"];
      let player_url = "https://royaleapi.com/player/" + player_tag;
      let html = org.jsoup.Jsoup.connect(player_url).get();
      let player_url_json =
        "https://link-api.clashroyale.com/players/%23" + player_tag;
      let res = org.jsoup.Jsoup.connect(player_url_json)
        .ignoreContentType(true)
        .ignoreHttpErrors(true)
        .get()
        .text();

      let data = JSON.parse(res);
      let userScore = data.trophies;
      //#page_content > div:nth-child(5) > div.ui.top.attached.padded.segment > div:nth-child(1) > img
      let userScoreImage = html
        .select(
          "#page_content > div:nth-child(5) > div.ui.top.attached.padded.segment > div:nth-child(1) > img"
        )
        .attr("src");

      let clanName =
        (typeof data.clan === "undefined") === true ? "-" : data.clan.name;

      if (clanName != jsonPlayer[profileHash]["player_clanName"]) {
        jsonPlayer[profileHash]["player_clanName"] = clanName;
        fs.write(pathPlayerInfo, JSON.stringify(jsonPlayer, null, 4));
      }

      let userLastscore = data.leagueStatistics.previousSeason.trophies;

      userScore = userScore + "🏆";
      let highScore = data.bestTrophies;
      Kakao.sendLink(
        room,
        {
          template_id: 76012,
          template_args: {
            USER_ID: player_nickname,
            USER_SCORE: userScore,
            USER_SCORE_IMG: userScoreImage,
            CLAN_NAME: clanName,
            ARENA: data.arena.name,
            HIGH_SCORE: highScore,
            USER_SCORE_LAST: userLastscore,
            USER_HASHCODE: player_tag,
          },
        },
        "custom"
      );
    }
  } catch (e) {
    replier.reply("⚠️오류가 발생했습니다.\n오류내용 : " + e);
  }
}

module.exports = Clashroyal;

//https://royaleapi.com/player/QYQYRQ8Y
//https://royaleapi.com/player/{플레이어 아이디}
