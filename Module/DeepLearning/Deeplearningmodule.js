function DeepLearning(room, msg, sender, replier) {
  if (jsondb[room] == undefined) jsondb[room] = {};
  if (jsonBenWord[room] == undefined) jsonBenWord[room] = {};
  if (jsonadmin[room] == undefined) jsonadmin[room] = {};
  if (jsonblacklist[room] == undefined) jsonblacklist[room] = {};

  if (msg.startsWith("/블랙리스트")) {
    let list = [];
    for (let i in jsonblacklist[room])
      list.push("· " + i + " == " + jsonblacklist[room][i]);
    replier.reply(
      "► 블랙리스트: " +
        Object.keys(jsonblacklist[room]).length +
        "명" +
        Lw +
        line +
        list.join("\n\n")
    );
    return;
  }
  if (msg.startsWith("/관리자리스트")) {
    let list = [];
    for (let i in jsonadmin[room])
      list.push("· " + i + " == " + jsonadmin[room][i]);
    replier.reply(
      "► 관리자: " +
        Object.keys(jsonadmin[room]).length +
        "명" +
        Lw +
        line +
        list.join("\n\n")
    );
    return;
  }
  if (msg.startsWith("/금지어리스트")) {
    let list = [];
    for (let i in jsonBenWord[room])
      list.push("· " + i + " == " + jsonBenWord[room][i]);
    replier.reply(
      "► 금지어: " +
        Object.keys(jsonBenWord[room]).length +
        "개" +
        Lw +
        line +
        list.join("\n\n")
    );
    return;
  }
  if (msg.startsWith("/금지어등록")) {
    if (Object.keys(jsonblacklist[room]).includes(sender).valueOf() == false) {
      let regex = / /gi;
      let a = msg.substr(6).replace(regex, "").trim();
      if (a == "") {
        replier.reply("금지할 단어를 써주세요 \n► ex) /금지어등록 오이");
        return;
      }
      if (jsonBenWord[room][a] != undefined) {
        replier.reply(a + "는 금지단어로 등록되어있습니다.");
        return;
      }
      let benwordcount = Object.keys(jsonBenWord[room]).length;
      jsonBenWord[room][a] = benwordcount + 1;
      fs.write(pathBenWord, JSON.stringify(jsonBenWord, null, 4));
      benwordcount = Object.keys(jsonBenWord[room]).length;
      replier.reply(sender + "님이 " + a + "를 금지단어로 등록 시켰습니다.");
      return;
    } else {
      replier.reply(sender + "님은 추가할 수 없습니다.");
      return;
    }
  }
  if (msg.startsWith("/블랙추가")) {
    if (
      Object.keys(jsonadmin[room]).includes(sender).valueOf() ||
      sender == "김형민"
    ) {
      let a = msg.substr(5).trim();
      if (
        Object.keys(jsonadmin[room]).includes(a).valueOf() ||
        a.includes("김형민")
      ) {
        replier.reply(a + "님은 블랙리스트 추가불가능 합니다.");
        return;
      }
      let blackcount = Object.keys(jsonblacklist[room]).length;
      jsonblacklist[room][a] = blackcount + 1;
      fs.write(pathblacklist, JSON.stringify(jsonblacklist, null, 4));
      blackcount = Object.keys(jsonblacklist[room]).length;
      replier.reply(
        sender +
          "님이 " +
          a +
          "님을 블랙리스트로 등록 시켰습니다. 현재블랙리스트 : " +
          blackcount +
          "명"
      );
      return;
    } else {
      replier.reply(sender + "님은 관리자가 아닙니다.");
      return;
    }
  }
  if (msg.startsWith("/관리자등록")) {
    if (
      Object.keys(jsonadmin[room]).includes(sender).valueOf() ||
      sender == "김형민"
    ) {
      let a = msg.substr(6).trim();

      if (Object.keys(jsonblacklist[room]).includes(a).valueOf()) {
        replier.reply(sender + "님은 블랙리스트로 관리자등록이 불가능합니다.");
        return;
      }

      let admincount = Object.keys(jsonadmin[room]).length;
      jsonadmin[room][a] = admincount + 1;
      fs.write(pathadmin, JSON.stringify(jsonadmin, null, 4));
      admincount = Object.keys(jsonadmin[room]).length;
      replier.reply(
        sender +
          "님이 " +
          a +
          "님을 관리자로 등록 시켰습니다. 현재관리자 : " +
          admincount +
          "명"
      );
      return;
    } else {
      replier.reply(sender + "님은 관리자가 아닙니다.");
      return;
    }
  }

  if (msg.startsWith("/블랙삭제")) {
    if (
      Object.keys(jsonadmin[room]).includes(sender).valueOf() ||
      sender == "김형민"
    ) {
      delete jsonblacklist[room][msg.substr(5).trim()];
      fs.write(pathblacklist, JSON.stringify(jsonblacklist, null, 4));
      let blackount = Object.keys(jsonblacklist[room]).length;
      replier.reply(
        msg.substr(5).trim() +
          "님을 성공적으로 삭제하였습니다. 현재블랙리스트 : " +
          blackount +
          "명"
      );
      return;
    } else {
      replier.reply(sender + "님은 관리자가 아닙니다.");
      return;
    }
  }

  if (msg.startsWith("/금지어삭제")) {
    if (Object.keys(jsonblacklist[room]).includes(sender).valueOf() == false) {
      delete jsonBenWord[room][msg.substr(6).trim()];
      fs.write(pathBenWord, JSON.stringify(jsonBenWord, null, 4));
      replier.reply(msg.substr(6).trim() + "를 금지어에서 삭제하였습니다.");
      return;
    } else {
      replier.reply(sender + "님은 삭제할 수 없습니다.");
      return;
    }
  }

  if (msg.startsWith("/관리자삭제")) {
    if (sender == "김형민") {
      let a = msg.substr(6).split("==")[0].trim();
      if (a.includes("김형민")) {
        replier.reply(a + "님은 삭제할 수 없습니다.");
        return;
      }
      delete jsonadmin[room][msg.substr(6).trim()];
      fs.write(pathadmin, JSON.stringify(jsonadmin, null, 4));
      let admincount = Object.keys(jsonadmin[room]).length;
      replier.reply(
        "성공적으로 삭제하였습니다. 현재관리자 : " + admincount + "명"
      );
      return;
    } else {
      replier.reply(sender + "님은 관리자 삭제권한이 없습니다.");
      return;
    }
  }

  if (msg.startsWith("/제시어추가")) {
    if (Object.keys(jsonblacklist[room]).includes(sender).valueOf()) {
      replier.reply(sender + "님은 블랙리스트 입니다. 관리자에게 문의하세요.");
      return;
    }
    if (msg.split("==").length < 2) {
      replier.reply(
        "[/제시어추가 등록된 제시어(대표1개) == 추가할 제시어] 형식으로 작성해 주세요\n► ex) /제시어추가 안녕 == 하이"
      );
      return;
    }
    let a = msg.substr(6).split("==")[0].trim();
    let b = msg.substr(msg.split("==")[0].length + 2).trim();
    if (b == "") {
      replier.reply(
        "추가할 제시어를 써주세요! \n► ex) /제시어추가 " + a + " == 테스트"
      );
      return;
    }

    let benwordlist = [];
    for (let i in jsonBenWord[room]) {
      benwordlist.push("· " + i + " == " + jsonBenWord[room][i]);
      if (msg.includes(i)) {
        replier.reply("금지된 단어가 포함되어 있습니다!\n► 금지된 단어 :" + i);
        return;
      }
    }

    let sl_fk = [];
    let split_b = [];

    let Findkey = Object.keys(jsondb[room]).filter(function (find) {
      return find.indexOf(a) > -1;
    });
    if (Findkey[0] != undefined) {
      sl_fk = Findkey[0].split(",");
      split_b = b.split(",");
      for (h = 0; h < sl_fk.length; h++) {
        for (m = 0; m < split_b.length; m++) {
          if (split_b[m] == sl_fk[h]) {
            replier.reply(
              "이미 등록된 제시어가 있습니다!\n► 중복등록 제시어 :" + split_b[m]
            );
            return;
          }
        }
      }

      let newfindkey = Findkey[0] + "," + b;
      jsondb[room][newfindkey] = jsondb[room][Findkey[0]];
      delete jsondb[room][Findkey[0]];
      fs.write(pathdb, JSON.stringify(jsondb, null, 4));
      replier.reply(
        "[" + b + "] 라는 제시어가 [" + Findkey[0] + "] 에 추가됐습니다."
      );
      return;
    }
  }
  if (msg.startsWith("/가르치기")) {
    if (Object.keys(jsonblacklist[room]).includes(sender).valueOf()) {
      replier.reply(sender + "님은 블랙리스트 입니다. 관리자에게 문의하세요.");
      return;
    }
    if (msg.split("==").length < 2) {
      replier.reply(
        "[/가르치기 반응할 말 == 대답] 형식으로 작성해 주세요\n► ex) /가르치기 안녕 == 만나서 반가워:)"
      );
      return;
    }
    let a = msg.substr(5).split("==")[0].trim();
    let b = msg.substr(msg.split("==")[0].length + 2).trim();
    if (b == "") {
      replier.reply(
        "해당 말에 대한 대답을 써주세요! \n► ex) /가르치기 " + a + " == 테스트"
      );
      return;
    }
    let benwordlist = [];
    for (let i in jsonBenWord[room]) {
      benwordlist.push("· " + i + " == " + jsonBenWord[room][i]);
      if (msg.includes(i)) {
        replier.reply("금지된 단어가 포함되어 있습니다!\n► 금지된 단어 :" + i);
        return;
      }
    }

    if (Object.keys(jsondb[room]).length != 0) {
      let Findkey = Object.keys(jsondb[room]).filter(function (find) {
        return find.indexOf(a) > -1;
      });
      if (Findkey[0] != undefined) {
        let checkword = jsondb[room][Findkey[0]];
        jsondb[room][Findkey[0]] = checkword + "," + b;
      } else {
        jsondb[room][a] = b;
      }
    } else {
      jsondb[room][a] = b;
    }

    fs.write(pathdb, JSON.stringify(jsondb, null, 4));
    replier.reply("[" + a + "] 라는 메세지에 대한 답장이 추가됐습니다.");
  }

  if (msg == "/db") {
    if (Object.keys(jsondb[room]).length < 1) {
      replier.reply(
        "아직 방 [" +
          room +
          "] 에서 배운 말이 없습니다. \n[/가르치기 말 == 대답] 형식으로 봇에게 가르쳐 보세요!\n► ex)/ 가르치기 안녕 == 만나서 반가워:)"
      );
      return;
    }
    let list = [];
    for (let i in jsondb[room]) list.push("· " + i + " == " + jsondb[room][i]);
    replier.reply(
      "► 배운 단어 수: " +
        Object.keys(jsondb[room]).length +
        "개" +
        Lw +
        line +
        list.join("\n\n")
    );
    return;
  }

  if (msg == "/초기화") {
    if (sender == "김형민") {
      jsondb[room] = {};
      fs.write(pathdb, JSON.stringify(jsondb, null, 4));
      replier.reply("방 [" + room + "] 에서 배운 말들을 초기화하였습니다");
      return;
    } else {
      replier.reply(sender + "님은 초기화 권한이 없습니다.");
      return;
    }
  }
  if (msg.startsWith("/답장삭제")) {
    if (Object.keys(jsonblacklist[room]).includes(sender).valueOf() == false) {
      if (msg.split("==").length < 2) {
        replier.reply(
          "[/답장삭제 반응할 말 == 대답] 형식으로 작성해 주세요\n► ex) /답장삭제 안녕 == 만나서 반가워:)"
        );
        return;
      }
      let a = msg.substr(5).split("==")[0].trim();
      let b = msg.substr(msg.split("==")[0].length + 2).trim();
      if (b == "") {
        replier.reply(
          "해당 말에 대한 삭제할 대답을 써주세요! \n► ex) /답장삭제 " +
            a +
            " == 테스트"
        );
        return;
      }

      if (jsondb[room][a] == undefined) {
        replier.reply("아직 배우지 않은 단어입니다");
        return;
      }

      let wordlist = [];
      wordlist = jsondb[room][a].split(",");

      for (let i = 0; i < wordlist.length; i++) {
        if (wordlist[i] === b) {
          wordlist.splice(i, 1);
          i--;
        }
      }

      delete jsondb[room][a];

      for (let y = 0; y < wordlist.length; y++) {
        if (jsondb[room][a] != undefined) {
          jsondb[room][a] += "," + wordlist[y];
        } else {
          jsondb[room][a] = wordlist[y];
        }
      }

      fs.write(pathdb, JSON.stringify(jsondb, null, 4));
      replier.reply(a + "에 대한 대답 " + b + "(을)를 삭제하였습니다");
      return;
    } else {
      replier.reply(sender + "님은 삭제 권한이 없습니다.");
      return;
    }
  }

  if (msg.startsWith("/삭제")) {
    if (Object.keys(jsonblacklist[room]).includes(sender).valueOf() == false) {
      if (msg.substr(3).trim() == "") {
        replier.reply(
          "[/삭제 배운 말] 형식으로 작성해 주세요. \n► ex) /삭제 배운말"
        );
        return;
      }

      let deleteStr = msg.substr(3).trim();

      if (jsondb[room][msg.substr(3).trim()] == undefined) {
        replier.reply("아직 배우지 않은 단어입니다");
        return;
      }

      let str = msg.substr(3).trim();

      delete jsondb[room][msg.substr(3).trim()];

      fs.write(pathdb, JSON.stringify(jsondb, null, 4));
      replier.reply(str + "를 성공적으로 삭제하였습니다");
      return;
    } else {
      replier.reply(sender + "님은 삭제 권한이 없습니다.");
      return;
    }
  }

  //jsondb[room][학습한단어] = 그에대한 답장.
  var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
  var regex = / /gi;
  msg = msg.trim().replace(reg, "").replace(regex, "");
  if (msg == "") {
    return;
  }

  let spl_i = [];
  let Rev_Word_List = [];
  let spl_findkey = [];
  let Findkey = Object.keys(jsondb[room]);
  if (Findkey[0] != undefined) {
    for (km = 0; km < Findkey.length; km++) {
      if (Findkey[km].includes(",")) {
        spl_findkey = Findkey[km].split(",");
        for (hm = 0; hm < spl_findkey.length; hm++) {
          if (spl_findkey[hm] == msg) {
            if (jsondb[room][Findkey[km]].includes(",")) {
              Rev_Word_List = jsondb[room][Findkey[km]].split(",");
              let number = parseInt(Math.random() * Rev_Word_List.length);
              replier.reply(Rev_Word_List[number]);
              return;
            } else {
              replier.reply(jsondb[room][Findkey[km]]);
              return;
            }
          }
        }
      } else {
        if (Findkey[km] == msg) {
          if (jsondb[room][Findkey[km]].includes(",")) {
            Rev_Word_List = jsondb[room][Findkey[km]].split(",");
            let number = parseInt(Math.random() * Rev_Word_List.length);
            replier.reply(Rev_Word_List[number]);
            return;
          } else {
            replier.reply(jsondb[room][Findkey[km]]);
            return;
          }
        }
      }
    }
  }
}

module.exports = DeepLearning;
