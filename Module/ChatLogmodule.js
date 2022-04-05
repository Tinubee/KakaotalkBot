function ChattingLog(msg, room, sender, replier) {
    try {
        let ChatTime = new Date();
        room = room.trim();
        let ChatData = DataBase.getDataBase(room + "ChatData");
        if (ChatData == null) {
            DataBase.setDataBase(room + "ChatData");
        }

        let count = (DataBase.getDataBase(room + "ChatData")).split("\n");
        if (count.length > 300) {
            DataBase.removeDataBase(room + "ChatData");
        }
        // /채팅기록 = 10, /채팅기록 김형민 10
        if (msg.startsWith("/채팅기록")) {
            if (msg.split('=').length < 2) {
                replier.reply('{ /채팅기록 [전체 or 지정사람] = [줄수]] 형식으로 작성해 주세요\n► ex) /채팅기록 전체 = 10 or /채팅기록 노승준 = 10');
                return;
            }
            let Get_Chattype = msg.substr(5).split('=')[0].trim();
            let LineCount = msg.substr(5).split('=')[1].trim();
           
            AllChatrecord = DataBase.getDataBase(room + "ChatData");
            spl_AllChatrecord = AllChatrecord.split("\n").reverse();
            if(LineCount < 1 || isNaN(LineCount)){
                replier.reply('채팅기록보실 줄 수를 제대로 입력해주세요\n► ex) /채팅기록 전체 = 10 or /채팅기록 노승준 = 10');
                return;
            }
            let res = [];
            let spl_c = spl_AllChatrecord.length;
            if(Get_Chattype == "전체"){
                let count = Math.min(spl_c, LineCount);
                for(cht = count; cht > 0;cht--)
                {
                    res.push(spl_AllChatrecord[cht]);
                }
                let result = "◈ " + room + " ◈(방)의 채팅기록\n";
                replier.reply(result + res.join("\n"));
                return;
            }
            else //지정된 사람
            {
                for (cht = 0; cht < spl_c; cht++) {
                    let checkname = spl_AllChatrecord[cht].split(":");
                    if (checkname[0].includes(Get_Chattype)) {
                        res.push(spl_AllChatrecord[cht]);
                        if (res.length == LineCount) {
                            break;
                        }
                    }
                }
                if(res.length == 0){
                  replier.reply(Get_Chattype + "님의 채팅기록이 없습니다.");
                  return;
                }
                res.reverse();
                let result = "◈ " + room + " ◈(방)의 " + Get_Chattype + " 채팅기록\n";
                replier.reply(result + res.join("\n"));
                return;
            }
        }
        let info = "[" + ChatTime.getHours() + "시 " + ChatTime.getMinutes() + "분]" + " [" + sender + "] : " + msg;
        DataBase.appendDataBase(room + "ChatData", info + "\n");
    }
    catch (error) {
        replier.reply(error);
    }
}

module.exports = ChattingLog;