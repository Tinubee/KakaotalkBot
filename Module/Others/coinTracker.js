function coinTracker(msg, replier) {
  var str_split_Arr = [];
  str_split_Arr = msg.split(" ");
  try {
    let upbit_coin_symbol = "BTC";
    if (str_split_Arr.length != 1) {
      upbit_coin_symbol = str_split_Arr[1];

      let coin_symbol_krw = JSON.parse(
        org.jsoup.Jsoup.connect("https://api.upbit.com/v1/market/all")
          .ignoreContentType(true)
          .get()
          .text()
      );

      for (let i in coin_symbol_krw) {
        let keywordData = coin_symbol_krw[i];
        let keywordData_replaced = keywordData["korean_name"].replace(
          /(<([^>]+)>)/gi,
          " "
        );

        if (keywordData_replaced == upbit_coin_symbol) {
          upbit_coin_symbol = keywordData["market"]
            .replace(/(<([^>]+)>)/gi, " ")
            .split("-")[1];
          break;
        }
      }
    }

    upbit_coin_symbol = upbit_coin_symbol.toUpperCase();
    let upbit_json = upbit_func(upbit_coin_symbol);
    let output_text = "";
    output_text += "[UPBIT API]\n";
    output_text += "<" + upbit_coin_symbol + "/KRW>\n";
    output_text +=
      numberWithCommas(upbit_json[0].trade_price) +
      " (" +
      (upbit_json[0].signed_change_rate * 100).toFixed(2) +
      "%)\n\n";
    output_text +=
      "24H 고가 : " + numberWithCommas(upbit_json[0].high_price) + " KRW\n";
    output_text +=
      "24H 저가 : " + numberWithCommas(upbit_json[0].low_price) + " KRW\n";
    output_text +=
      "24H 종가 : " +
      numberWithCommas(upbit_json[0].prev_closing_price) +
      " KRW";
    replier.reply(output_text);
  } catch (error) {
    replier.reply("⚠️해당 코인이 존재하지 않습니다.\n오류내용 : " + error);
  }
}

function upbit_func(coin_symbol) {
  let upbit_url = "https://api.upbit.com/v1/ticker?markets=KRW-";
  upbit_url += coin_symbol;
  return JSON.parse(
    org.jsoup.Jsoup.connect(upbit_url).ignoreContentType(true).get().text()
  );
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = coinTracker;
