function pingpong(msg, replier, Pingpong_key) {
  try {
    let Key = Pingpong_key;
    var json = {
      request: {
        query: msg,
      },
    };
    var message = JSON.parse(
      org.jsoup.Jsoup.connect(
        "https://builder.pingpong.us/api/builder/623422bde4b019e73845debb/integration/v0.2/custom/" +
          Key
      )
        .header("Authorization", "Basic " + Key)
        .header("Content-Type", "application/json; charset=utf-8")
        .requestBody(JSON.stringify(json))
        .ignoreContentType(true)
        .ignoreHttpErrors(true)
        .post()
        .text()
    );

    try {
      for (var k = 0; k < message.response.replies.length; k++) {
        if (message.response.replies[k].text) {
          replier.reply(message.response.replies[k].text);
        }
      }
    } catch (e) {
      replier.reply(message.response.replies.text);
    }
  } catch (e) {
    replier.reply(e + e.lineNumber);
  }
}

module.exports = pingpong;
