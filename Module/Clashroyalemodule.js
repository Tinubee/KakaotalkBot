function Clashroyal(Kakao, msg, imageDB, room, replier) {
  if (msg.startsWith("/태그등록")) {
    var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\(\'\"]/gi;
    var regex = / /gi;
    msg = msg.trim().replace(reg, "").replace(regex, "");
    let profileHash = imageDB.getProfileHash();
    if (jsonPlayer[profileHash] == undefined) jsonPlayer[profileHash] = {};
    let player_nickname = msg.substr(5).split("==")[0].trim();
    let player_tag = msg.substr(msg.split("==")[0].length + 2).trim();

    jsonPlayer[profileHash][player_nickname] = player_tag;
    fs.write(pathPlayertag, JSON.stringify(jsonPlayer, null, 4));
    replier.reply(
      "닉네임 : " +
        player_nickname +
        "\n태그 : " +
        player_tag +
        "\n등록되었습니다. (등록된 TAG가 정확한지 꼭 확인 해주세요.)"
    );
    return;
  } else if (msg.startsWith("/클로검색")) {
    let profileHash = imageDB.getProfileHash();
    let player_nickname = Object.keys(jsonPlayer[profileHash]);
    let player_tag = jsonPlayer[profileHash][player_nickname];
    let player_url = "https://royaleapi.com/player/" + player_tag;
    let html = org.jsoup.Jsoup.connect(player_url).get();

    let userID = html
      .select(
        "div.ui.top.attached.padded.segment > div.p_header_container > div:nth-child(1) > h1"
      )
      .text();
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
          USER_ID: userID,
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
