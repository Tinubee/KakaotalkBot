function ClashroyaluserInfo(sender, replier) {
  try {
    let profileHash = sender;
    if (jsonPlayer[profileHash] == undefined) {
      replier.reply(
        "⚠️유저등록을 먼저 해주시기 바랍니다.\nℹ️방법: /태그등록 나의태그"
      );
      return;
    }

    player_tag = jsonPlayer[profileHash]["player_tag"];

    let player_url_json =
      "https://link-api.clashroyale.com/players/%23" + player_tag;
    let res = org.jsoup.Jsoup.connect(player_url_json)
      .ignoreContentType(true)
      .ignoreHttpErrors(true)
      .get()
      .text();

    let data = JSON.parse(res);

    replier.reply(
      "✅" +
        data.clan.name +
        " - " +
        data.name +
        "님의 정보입니다✅\n\n" +
        "태그 : " +
        data.tag +
        "\n" +
        "현재 트로피 : " +
        data.trophies +
        "🏆 - " +
        data.arena.name +
        "\n" +
        "이번 시즌 최고 트로피 : " +
        data.leagueStatistics.currentSeason.bestTrophies +
        "🏆\n" +
        "전 시즌(" +
        data.leagueStatistics.previousSeason.id +
        ") 최종 트로피 : " +
        data.leagueStatistics.previousSeason.trophies +
        "🏆\n" +
        "전 시즌(" +
        data.leagueStatistics.previousSeason.id +
        ") 최고 트로피 : " +
        data.leagueStatistics.previousSeason.bestTrophies +
        "🏆\n" +
        "베스트 시즌(" +
        data.leagueStatistics.bestSeason.id +
        ")트로피 : " +
        data.leagueStatistics.bestSeason.trophies +
        "🏆\n" +
        "전적 : " +
        data.wins +
        "승 " +
        data.losses +
        "패\n현재 자주 사용하는 카드 : " +
        data.currentFavouriteCard.name
    );
  } catch (e) {
    replier.reply("⚠️오류가 발생했습니다.\n오류내용 : " + e);
  }
}

module.exports = ClashroyaluserInfo;
