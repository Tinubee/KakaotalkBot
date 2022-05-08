function ClashRoyalCard(Kakao, replier, room) {
  try {
    let card = [];
    let deckUrl = "https://statsroyale.com/ko/decks/popular";
    let deckUrl_html = org.jsoup.Jsoup.connect(deckUrl).get();

    let allCount =
      deckUrl_html.select(
        "body > div.layout__page > div.layout__container > div > div > div"
      ).length - 3;

    let ranNumber = parseInt(Math.random() * allCount) + 1;
    ranNumber = ranNumber + 3;

    let gameNumbers = deckUrl_html
      .select(
        "body > div.layout__page > div.layout__container > div > div > div:nth-child(" +
          ranNumber +
          ") > div > div.popularDecks__footer > div > div:nth-child(2)"
      )
      .text();

    let winRates = deckUrl_html
      .select(
        "body > div.layout__page > div.layout__container > div > div > div:nth-child(" +
          ranNumber +
          ") > div > div.popularDecks__footer > div > div.ui__headerBig"
      )
      .text();

    let appLink = deckUrl_html
      .select(
        "body > div.layout__page > div.layout__container > div > div > div:nth-child(" +
          ranNumber +
          ") > div > div.popularDecks__footer > a"
      )
      .attr("href");

    appLink = appLink.split("=");
    for (var i = 1; i <= 8; i++) {
      card.push(
        deckUrl_html
          .select(
            "body > div.layout__page > div.layout__container > div > div > div:nth-child(" +
              ranNumber +
              ") > div > div.popularDecks__decklist > a:nth-child(" +
              i +
              ") > img"
          )
          .attr("src")
      );
    }

    for (var i = 0; i < card.length; i++) {
      card[i] = card[i].replace(
        "https://cdn.statsroyale.com/images/cards/full/",
        ""
      );
    }

    let imageURL =
      "https://res.cloudinary.com/dmvu7wol7/image/upload/c_thumb,h_120,w_100/c_thumb,h_120,l_" +
      card[0] +
      ",w_100/fl_layer_apply,g_north_west,x_100/c_thumb,h_120,l_" +
      card[1] +
      ",w_100/fl_layer_apply,g_north_west,x_200/c_thumb,h_120,l_" +
      card[2] +
      ",w_100/fl_layer_apply,g_north_west,x_300/c_thumb,h_120,l_" +
      card[3] +
      ",w_100/fl_layer_apply,g_north_west,y_120/c_thumb,h_120,l_" +
      card[4] +
      ",w_100/fl_layer_apply,g_north_west,x_100,y_120/c_thumb,h_120,l_" +
      card[5] +
      ",w_100/fl_layer_apply,g_north_west,x_200,y_120/c_thumb,h_120,l_" +
      card[6] +
      ",w_100/fl_layer_apply,g_north_west,x_300,y_120/" +
      card[7];

    Kakao.sendLink(
      room,
      {
        template_id: 76196,
        template_args: {
          image: imageURL,
          gameNumber: gameNumbers,
          winRate: winRates,
          appConnect: appLink[1],
        },
      },
      "custom"
    );
  } catch (e) {
    replier.reply("⚠️오류가 발생했습니다.\n오류내용 : " + e);
  }
}

module.exports = ClashRoyalCard;
