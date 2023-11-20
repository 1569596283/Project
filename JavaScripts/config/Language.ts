import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Value","Value_zh"],["","Key|ReadByName","MainLanguage","ChildLanguage"],[1001,"MetaWorld","MetaWorld","MetaWorld"],[1002,"999","999","999"],[1003,"P_max_speed","Speed (km/h)","速度（km/h）："],[1004,"P_acc_speed","Acceleration (m/s²)","加速度（m/s²）："],[1005,"P_lineage","Lineage:","血统："],[1006,"P_nature","Character:","性格："],[1007,"P_hobby","Habit:","喜好："],[1008,"P_bet","Back","助力"],[1009,"P_brith_number","Parity:","生育："],[1010,"P_energy","Energy:","精力："],[1011,"P_startrunspeed","Initial speed (km/h):","起跑速度（km/h）："],[1012,"P_defecation","Excretion amount:","排便量："],[1013,"P_choose","Select","选择"],[1014,"P_confirm","Confirm","确认"],[1015,"P_cancel","Cancel","取消"],[1016,"Guessui_odd","Odds","奖金倍率"],[1017,"Guessui_all","Backed Amount","已助力金额："],[1018,"Guessui_player","Back amount:","你的助力金额："],[1019,"Guessui_describe","Do you want to back {1} on {0}","你是否为{0}助力{1}"],[1020,"Tips_waitopen","Waiting to be backed","等待助力中"],[1021,"Tips_opening","Start backing","开始助力了"],[1022,"Tips_notenoughgold","Insufficient gold","金币不足"],[1023,"Tips_notenoughdiamond","Insufficient diamond","钻石不足"],[1024,"Tips_betgreaterzero","The back amount must be greater than 0","助力金额需要大于零"],[1025,"Horse_Leave","Leave","离开"],[1026,"Breedui_breed","Breed","繁育"],[1027,"Breedresultui_getpony","Get {0} Ponies","获得{0}匹小马"],[1028,"Growthvalue","Growth:","成长值："],[1029,"Breedresultitem_get","Stable it","放入家园"],[1030,"Horsefree","Release","放生"],[1031,"Raceui_rank","Ranking","名次"],[1032,"Raceui_horsename","Name:","姓名："],[1033,"Raceui_time","Track","赛道"],[1034,"Ai_name1","Aurora ","奥萝拉 "],[1035,"Ai_name2","Mabel ","梅布尔 "],[1036,"Ai_name3","Zoie ","佐薇 "],[1037,"Ai_name4","Imp","淘气包 "],[1038,"Ai_name5","Fzzf ","好名都让狗取了 "],[1039,"Ai_name6","Sofm ","欠费的萤火虫 "],[1040,"Ai_name7","Ppgod ","记忆黑名单 "],[1041,"Ai_name8","Alielie ","我的故事你不懂 "],[1042,"Ai_name9","SurPLus ","爱情不曾敲门 "],[1043,"Ai_name10","Yrainy ","大原娜娜子 "],[1044,"Ai_name11","unfair ","铅笔画的颜色 "],[1045,"Ai_name12","pamper ","西柚柚柚柚"],[1046,"Ai_name13","Estrus ","是只坏兔子 "],[1047,"Ai_name14","Unlash ","快乐鸡蛋黄 "],[1048,"Ai_name15","Trauma ","幕后煮屎人 "],[1049,"Ai_name16","Underneath ","老二刺螈 "],[1050,"Ai_name17","Coward ","请叫我集翔物 "],[1051,"Ai_name18","Acacia ","半个废物 "],[1052,"Ai_name19","Elegant ","勾魂公狒狒 "],[1053,"Ai_name20","Weanheart","夺命母猩猩 "],[1054,"Ai_name21","Sheila","我有点可爱"],[1055,"Ai_name22","Suzan ","讨打的小猫"],[1056,"Ai_name23","Macie ","狗蛋的快乐"],[1057,"Ai_name24","Leyah ","我爱拉屎"],[1058,"Ai_name25","Dodla ","我有一头小毛驴"],[1059,"Ai_name26","Ena ","好想摆烂"],[1060,"Ai_name27","Alva ","人生诸多风雨"],[1061,"Ai_name28","Amelia ","花花草草"],[1062,"Ai_name29","Aurora ","我是哈哈哈哈"],[1063,"Ai_name30","Beatrice ","悲伤逆流成海"],[1064,"Ai_name31","Jessica","下雨天我就哭"],[1065,"Ai_name32","Lisa","好想放屁"],[1066,"Ai_name33","Vivian","我比纸巾还能扯"],[1067,"Ai_name34","Vicky","成就梦想"],[1068,"Ai_name35","Monica","丽萨披萨"],[1069,"Ai_name36","Barbara","可乐派派"],[1070,"Ai_name37","Sarah","反骨的鸟"],[1071,"Ai_name38","Laura","糖当当当"],[1072,"Ai_name39","Irene","有一点搞笑"],[1073,"Ai_name40","Julie","拉屎没有纸"],[1074,"Ai_name41","Rachel","我啥也不知道"],[1075,"Ai_name42","Marian","加个好友"],[1076,"Ai_name43","Isabel","派大星在海里"],[1077,"Ai_name44","Gina","树下的花猫"],[1078,"Ai_name45","Lillian","倒霉熊倒霉"],[1079,"Ai_name46","Helen","新年快乐"],[1080,"Ai_name47","June","幸运海绵宝贝"],[1081,"Ai_name48","Carolyn","大力水手派派"],[1082,"Ai_name49","Donna","九天大乌龟"],[1083,"Ai_name50","Pamela","泡椒小凤爪"],[1084,"Ai_name51","Martha","爆辣辣条"],[1085,"Ai_name52","Eva","黑色奥利奥"],[1086,"Ai_name53","Linda ","遇见一条狗"],[1087,"Ai_name54","Marian","不要想我"],[1088,"Ai_name55","Erin","不和笨笨做朋友"],[1089,"Ai_name56","Vera","梦里有鬼"],[1090,"Ai_name57","Emily","向大海进发"],[1091,"Ai_name58","Christine","鱼摆摆"],[1092,"Ai_name59","Marie","大宅蟹"],[1093,"Ai_name60","Judy","阿巴阿巴"],[1094,"Ai_name61","Teresa","嘻嘻哈哈嘿嘿"],[1095,"Ai_name62","Olivia","被你吓到"],[1096,"Btn1","Enter","参赛"],[1097,"Btn2","No,Thanks","不了，谢谢"],[1098,"ShopUI_Look","Not this one ","我再看看"],[1099,"ShopUI_TakeIt","That's it.","就它了"],[1100,"Btn5","OK","好的"],[1101,"Player_newguid1","After a long journey, I finally arrived on the island!","啊！跋山涉水，终于快到小岛啦！"],[1102,"Player_newguid2","It's as beautiful as ever. I should go to the stables to see what grandma has left!","小岛还是一如既往地漂亮，先去家园里看看奶奶留给我的财富吧！"],[1103,"Player_newguid3","You can enter it for the next race!","等下一场比赛开始，就可以带它去报名了！ "],[1104,"Player_newguid4","That's great!","真是太棒啦！"],[1105,"Player_newguid5","With two horses, it's time to breed!","现在我有两匹马了，可以去繁殖小马了！"],[1106,"Player_newguid6","A foal is born. Take a closer look!","新的小马出生了，走近看看吧！"],[1107,"Player_newguid7","Grandma left me only one horse! No wonder she left without hesitation.","不会吧，奶奶就只给我留了一匹马，怪不得走得那么干脆。"],[1108,"Player_newguid8","Luckily, she has left some money, so I can buy another horse!","幸好给我留了一点钱，先去买匹新马吧！"],[1109,"letter1","Dear grandson,\n I'm going on a trip. The stable is yours now! You can surely operate it well!\n                  Your Happy Grandma","亲爱的孙子：\n     奶奶要去旅行了，马场交给你管理了！给你留了一点启动资金。\n     相信你一定可以做得很好！\n                                       你的快乐奶奶"],[1110,"letter2","Dear grandson,\n I knew you'd lose all the money. You can enter the horse race to win bonuses. \n             Your grandma in Provence","亲爱的孙子：\n     奶奶就知道你把钱败光了，你可以去参加比赛获得奖金。 售票员是你的远亲舅舅，他会给你打折的！\n           你在普罗旺斯玩得开心的奶奶"],[1111,"letter3","Dear grandson,\n I got a letter complaining that you never clean the stables! Do it now! BTY, horse droppings can be sold!\n                Your grandma in Paris","亲爱的孙子：\n    我收到小马的来信，投诉你不铲屎！ 快回家园清理马粪，小马们都要被臭死了！马粪可以拿去卖钱哦！\n                你在巴黎玩得开心的奶奶"],[1112,"Uncle_talk1","I knew you'd come back one day, dear nephew. I will let you participate for free once since you are so poor.","大侄子，你果然在城里生活不下去，回来啦？看你这么穷困撩倒，就免费让你参赛一次吧！"],[1113,"Uncle_talk2","The air here must be better than that of big cities, right? Today is a good day for horse racing. Do you want to enter it?","这里空气应该要比大城市好很多吧？今天适合赛马，要报名参加吗？ "],[1114,"Uncle_talk3","I heard that you have acquired new horses recently. Do you want to test their abilities?","听说你最近又得了几匹新马，来测测他们的能力？ "],[1115,"Uncle_talk4","It's said that the horse seeker got some good horses. You should have a look after the race!","听说寻马星探那儿又得了几匹好马，比赛完可以去瞧瞧！ "],[1116,"Uncle_talk5","A fast horse has come to the racecourse. Come and race against him! Only by knowing your enemies can you win!","最近赛场来了一个很强劲的马，快来跟他比比！知己知彼，才能百战百胜！"],[1117,"Uncle_talk6","I am not a capper. He has been my friend for years. Go race and let me see the horse he picked for you!","我可不是寻马星探的托，他是我多年好友了，快去参赛，让我看看他给你挑的马！ "],[1118,"Uncle_talk7","There are a lot of tourists coming for the race recently. It is a good time to enter the race!","最近来观看赛马的游客很多，正是带你的马来比赛的好时机！"],[1119,"Uncle_talk8","A horse will weaken if it does not race for too long. Come and enter the race!","长期不赛马，马的战斗力会减弱，快来参赛！"],[1120,"Uncle_talk9","The result last time was not bad. Keep racing and earn greater glory!","上次的名次还可以，快参加比赛，再创辉煌！"],[1121,"Uncle_talk10","That breeder used to follow your grandma everywhere. Watch out for him. But focus on the race now!","那个繁育员以前老粘着你奶奶，你可要小心他，先比赛吧，别分心！ "],[1122,"Uncle_talk11","Bring your horse to enter the race. I will back your horse this time! We're going to make a fortune!","快带马来比赛，我这次也去小镇首富那里助力你的马！一定大赚一笔！"],[1123,"Uncle_talk12","Enough talking. Let's enter the race!","话不多说，直接参赛！"],[1124,"Uncle_race1","Do your best and don't embarrass your grandma!","比赛加油呀！别给你奶奶丢脸！"],[1125,"Uncle_race2","You have entered. Please wait for the race to start!","你已经报名了，等待比赛开始吧！"],[1126,"Uncle_race3","The race hasn't started yet. You can warm up your horse first!","比赛还要等待一小段时间，先带你的马热热身吧！"],[1127,"Uncle_race4","You have entered. I'm looking forward to your performance today!","你已报名成功了，期待你今天的表现！"],[1128,"Uncle_none1","Don't be so impatient. The race has not started yet. Please come back later!","你太心急了，参赛时间还没到，稍后再来吧！"],[1129,"Uncle_none2","You can choose the horse you want to race before the entry time starts","还没到参赛时间，你可以先挑选你要出战的马！"],[1130,"Uncle_none3","Enough chatting today. Please come when the race starts!","今天不想闲聊，等参赛时间到了，你再来吧！"],[1131,"Uncle_small1","Foals are not allowed to race! No child labor!","未成年小马可不能比赛哦！禁止雇佣童工！"],[1132,"Uncle_small2","A horse can enter the race only after it reaches maturity!","小马需要养到成年马才可以参加比赛哦！"],[1133,"Uncle_small3","Foals are not allowed race! Please find an adult horse.","小马禁止参赛！快去牵只成年马来参赛吧！"],[1134,"Race_talk1","Click the list to view the corresponding track!","点击榜单可以查看对应赛道哦！"],[1135,"Race_talk2","Did you forget it? It's written in the guide that the weather can affect horses' moods. Racing in weather they don't like may piss them off!!","赛前指导也写了嘛，你记性不会这么差吧！再强调一下，天气会影响小马的心情，遇到不喜欢的天气比赛，它们可是会发脾气的！"],[1136,"Race_talk3","Here is the real-time broadcast, which reports interesting things on the field. Have a good time!","赛事资讯在这里实时播放，赛场上总有很多趣事发生，祝你玩得愉快！"],[1137,"Race_talk4","The quicker you click, the faster your horse runs!","按钮点击越快越多！小马就能跑得更快哦！"],[1138,"Find_ask1","Pick a lineage you like! I'll do everything to find you the best horses of it!","选择一个你喜欢的血统吧！我会尽全力给你找到这个血统中最棒的几匹马！"],[1139,"Find_ask2","Each lineage has its unique talent. Which one do you like?","每一个血统都有独特的天赋，快选一个你喜欢的天赋吧！"],[1140,"Find_gemsask1","This is a {0}. Spend diamonds to activate the lineage! It will not let you down!","这是一种{0}，想开启这个血统，需要钻石购买！相信它不会让你失望！"],[1141,"Find_gemnone1","Insufficient diamonds! There is no free lunch~ Enter the race to earn more diamonds!","钻石不足！想白嫖？可没门儿~快去参加比赛多赚点钻石吧！"],[1142,"Find_gemnew1","Congratulations! You just activated {0}. I will find you the greatest horse of it for free!","恭喜你！解锁了{0}，就让我免费为你找到这个血统中的厉害马吧！"],[1143,"Find_talk1","You get what you pay for! Wanna buy a horse? I am an experienced horse seeker. I'll find you the right horse!","廉价无好货！兄弟买马吗？我是一名寻马星探，慧眼识马多年，让我帮你找一匹合心意的马吧！"],[1144,"Find_talk2","No one here knows better how to find a good horse than I do. Come in and have a look!","在这里，没有人比我更懂寻到好的马，不相信的话，就进来看看吧？"],[1145,"Find_talk3","Horse of Holly, the former racing star, was found by me. Let me find you a good horse today!","曾经的赛马明星霍利那匹常胜马，就是我帮忙找的，今天也让我为你找一匹好马吧！"],[1146,"Find_talk4","There are a lot of tourists coming for the race recently. I believe you need a good horse to enhance your reputation!","最近来看赛马的游客好多，相信你也需要一匹好马来提高你马场的名声吧！"],[1147,"Find_talk5","The conductor is certainly not a capper. Everyone knows that I sell good horses. If you want one, come to me!","赛马场的售票员当然不是我的托，我卖好马人尽皆知，寻好马，就找我！"],[1148,"Find_talk6","Didn't find me a few days ago? That's because I met my first love! Now let's focus on the horses.","前几天没寻到我？嘻嘻，因为我遇到了我的初恋，不多说了！先看马吧， "],[1149,"Find_talk7","Speaking of my first love, she is as graceful as a unicorn. Ugh! Why are you badgering me again? Let’s check the new horses!","说起我的初恋，她像独角马一样优雅，唉！你怎么又来打听了，先看新马吧！"],[1150,"Find_talk8","Wanna know the story of me and my first love? Buy a horse and I will tell you next time!","\n想知道我和初恋的爱恨情仇？先买马，买了下次告诉你！"],[1151,"Find_talk9","The foals you breed will never be as good as mine. Wanna take a look at my new horse?","繁育的小马哪有我这的马好，路过不要错过，来看看新到的马匹吧！"],[1152,"Find_talk10","The horse I found last time performed well, right? I have a batch of better horses this time, wanna take a look?","上次为你找的马获得了不错的成绩吧？这次又来了一批更好的马，要来看看吗？"],[1153,"Find_talk11","I got rare horses again. They look nice and are invincible on the racecourse. Come and pick one!","又弄到了珍稀的马，长得好看、赛场上也所向披靡，快来挑选吧！"],[1154,"Find_talk12","Talk less, buy more.","话不多说，直接买马！"],[1155,"Find_none1","Your stable has no room for new horses！","你的家园已经满了，确定要来买新马吗？家园里可放不下了！"],[1156,"Rich_talk1","Hello, young man. I'm Rich Bob. You can back horses here and get huge bonuses if they win! Do you want to have a try?","你好，年轻的帅哥，我是鲍比富翁，这里是为赛场马助力的地方，助力成功就能获得巨大收益！要了解更多吗？"],[1157,"Rich_talk2","You look poor. Maybe backing horses can improve your life!","你看起来很贫穷，也许助力马能帮助你改变现在的生活，来看看吧！"],[1158,"Rich_talk3","I made my fortune by backing horses. Maybe you can be as successful as me. Do you want to try it?","曾经我也是靠着助力马才赚了如今的财富，也许你也有机会像我一样成功，试试吗？"],[1159,"Rich_talk4","How to recognize good horses? If you back enough horses, maybe I'll tell you.","识马的本领？我当然不会轻易教给别人，但你多来我这里参与助力，也许我会告诉你。"],[1160,"Rich_talk5","You look radiant today. How about making a bet? It must be your lucky day today.","看你今天面色红润，运气应该不会差，来助力一局吗？"],[1161,"Rich_talk6","You've been hovering in the doorway for so long. Don't hesitate, the horses won't let you down!","看你在门口徘徊好几次了，犹豫什么？你选中的马不会让你失望！"],[1162,"Rich_talk7","The ability to identify good horses requires a lot of practice! Want to back horses today?","慧眼识马的本领，需要多多实践！今天要助力参赛马吗？"],[1163,"Rich_talk8","You'll never make a fortune if stability is your goal. But by backing horses, you can be a millionaire!","如果追求平稳，那注定与财富无缘，来这里助力，成为富翁不是梦！"],[1164,"Rich_talk9","Running a stable? You'll never earn as much as by backing horses!","经营马场？哪有到这里成功助力赚得多，来试试吧！"],[1165,"Rich_talk10","The horses racing today are all very powerful. It is difficult to tell which one will be the champion. Why don't you come and check your opponent?","今天参赛的马都很厉害，可真难分出哪一只可以夺冠，你不来看看你的对手马吗？"],[1166,"Rich_talk11","Your ability to identify good horses must have improved! Which horse do you want back today?","相信你现在识马本领已有长进了！期待你今天的助力选择！"],[1167,"Rich_talk12","Want to escape poverty? Come here to back horses and you may be as rich as me!","想摆脱贫穷？来助力，就有机会像我一样富裕！"],[1168,"Rich_talk13","Enough chatting. Which one do you want to back?","话不多说，直接助力！"],[1169,"Rich_none1","You can only back horses when there are races. Please come back later.","现在还没有新比赛，无法助力马，稍后再来吧！"],[1170,"Breed_none1","Insufficient horses to breed. Come back when you have two adult horses!","马匹不够，可没办法繁育新小马哦，等准备好两匹都有生育力的成年马再来吧！"],[1171,"Breed_introduce1","Click here to select the horses for breeding.","点击这里可以选择你想参与繁育的马。"],[1172,"Breed_introduce2","Select a horse!","选择一匹马吧！"],[1173,"Breed_introduce3","Select another horse. It requires two horses to breed!","再选择一匹马吧，两只马才可以繁育出小马哦！"],[1174,"Breed_introduce4","Click here to start breeding! Breeding may result in a mutant foal or multiple foals at a time.","点击这里开始繁育！繁育过程中可能会出现变异马，可能生出几只小马，敬请期待吧！"],[1175,"Breed_talk1","I am a breeder and a good friend of your grandma. I'll help you breed a beautiful pony!","我是小岛的繁育员，也是你奶奶的好朋友，让我来帮你繁育一匹漂亮的小马吧！"],[1176,"Breed_talk2","Did your grandma mention me in her letter? Forget about it. Let's check the horse you want to breed first!","你奶奶的信里有提过我吗？算了，还是先看看你要繁育的马吧！"],[1177,"Breed_talk3","Foals will inherit the genes of their parents. You should choose the parent horses carefully!","繁育出的新马，会获得父母马的基因，所以要好好挑选父母马哦！"],[1178,"Breed_talk4","I heard that you received a letter from your grandma. Can you say hello to her for me when you reply? Thank you very much. I will keep helping you breed ponies!","听说你奶奶来了信，回信的时候可否替我问好？非常感谢你，这次我也会帮你好好繁育小马！"],[1179,"Breed_talk5","You can release some horses if the stable is full. Now let me see the breeding horses you brought today!","你的家园如果装满了，记得放生一些马，他们会感激你的，让我看看你今天带来的繁育马吧！"],[1180,"Breed_talk6","Your grandma used to be beautiful~ I‘m ’honored to be her friend. Let's focus on breeding now. We can talk more next time!","\n你奶奶年轻的时候很漂亮呢~能和她做朋友真是我的荣幸，先繁育你的小马吧，下次再和你细聊！"],[1181,"Breed_talk7","You should send photos of foals to your grandma. She will be pleased. Let's start breeding! I can't wait to take photos!","新小马可以拍张照片寄给你奶奶，她一定为你感到开心，快繁育吧！迫不及待想给新马拍照了！"],[1182,"Breed_talk8","I wonder where your grandma is now? I wish her all the best. Let me see the horses you selected today.","不知道你奶奶现在到了哪里？祝愿她一切顺利，让我看看你今天挑选的父母马吧？"],[1183,"Breed_talk9","Your grandma used to take good care of horses. I hope you can breed good foals as well!","以前你奶奶总是把马照顾得很健康，期待你也能繁育出同样好的小马！"],[1184,"Breed_talk10","Bought horses are no match for horses bred here. Let's breed an amazing horse and show it to the horse seeker!","买的马哪有繁育的马厉害，快繁育一只新的好马给那寻马星探瞧瞧！"],[1185,"Breed_talk11","Foals bred by your grandma were always beautiful. I hope your new horses will be the same!","你奶奶繁育的小马总是很漂亮，希望你繁殖的新马也能这样！"],[1186,"Breed_talk12","Enough talking. Let's start breeding!","话不多说，直接繁育！"],[1187,"Breed_get1","A new foal has been born. Have a closer look!","新的小马出生了，走近看看！"],[1188,"Breed_horse1","Please take me to the stables!","求求你了~带我回家吧！"],[1189,"Breed_horse2","I'm so cute. Please take me to the stables!","我这么可爱，你带我回家吧！"],[1190,"Breed_horse3","I'm curious about your stables. Please take me there!","想和你生活在一起，带我一起回家好吗？"],[1191,"Breed_horse4","Take me back to the stables, handsome master!","主人你长得真帅！带我回家吧！"],[1192,"Shit_talk1","Hello, I'm Holly. Do you have fresh horse droppings? You can sell them to me!","你好，初次见面，我叫霍利，你有捡到新鲜的马粪吗？卖给我可以获得收益哦！"],[1193,"Shit_talk2","I look familiar? Haha, you must have mistaken me for someone else. Do you want to sell horse droppings?","觉得我面熟？哈哈哈那你一定认错人啦，先卖马粪吧！"],[1194,"Shit_talk3","You found it? Yes, I used to be a racing star. I didn't expect young people to know me. Let's focus on business now!","被你发现了？我确实是曾经的赛马明星，没想到年轻人也认识我，先做正事吧！"],[1195,"Shit_talk4","You're the most diligent seller among stables nearby! It's right for me to stay here.","这附近的马场，就属你卖马粪最勤奋！不枉我开在你家门口。"],[1196,"Shit_talk5","I used to be a superstar on the racecourse. Maybe you will be like that one day! But let's focus on horse droppings now!","曾经我带着马纵横赛场，那时候的确很风光，也许你也会有那样的时刻！先卖马粪吧！"],[1197,"Shit_talk6","Treat the horse well and race more. That's the secret to winning! Do you want to sell horse droppings?","好好对待马，多去比赛，就是你获胜的秘诀！先卖马粪吧！"],[1198,"Shit_talk7","Selling droppings again? Your horses are good at shitting! Let's check how much you can sell today.","又来卖粪啦？你家马儿拉屎能力真强！来看看今天能卖多少钱吧？"],[1199,"Shit_talk8","There's nothing wrong with receiving horse droppings. I love everything about horses. Let's check the droppings you collected!","收马粪有什么不好呢？我爱马的一切，先看看你收集的马粪吧！"],[1200,"Shit_talk9","My horse used to be the champion. But it's no match for your horses when it comes to shitting! How many droppings do you want to sell today?","我的马儿确实是常胜冠军，但在拉屎这件事上，还是比不上你马场里的马！看看今天收集的马粪吧！"],[1201,"Shit_talk10","There will be no chance for you to be the champion if I enter the race again. But let's focus on droppings now.","如果我重入赛场，那可没有你得冠军的机会了，还是先看看你今天的卖粪收益吧！"],[1202,"Shit_talk11","Keep operating the stable and you will get unexpected rewards! For example, income from selling droppings!","这里赛马场总是很热闹，坚持经营马场，你一定能获得意想不到的收获！比如......卖粪收益！"],[1203,"Shit_talk12","Talk less, sell more!","话不多说，直接售卖！"],[1204,"Shit_none1","I don't chat. Come back after collecting fresh droppings!","不接受闲聊，你还没有捡到马粪，先去捡了新马粪再来售卖吧！"],[1205,"Shit_none2","Go and collect horse droppings! I don't talk to people without them!","你快去捡马粪吧！不想跟没马粪的人聊天！"],[1206,"Shit_none3","You don't have fresh horse droppings again. If this continues, I will move to another stable!","你又没有新鲜马粪，再这样下去，我要搬到别的马场去了！"],[1207,"Shit_none4","Cleaning up stables regularly is a good habit. Go and pick up horse droppings!","经常清理马粪才是好习惯，快去捡马粪吧！"],[1208,"Setting_ui_1","Music","音乐"],[1209,"Setting_ui_2","Sound ","音效"],[1210,"Basic_ui_1","Countdown ","参赛倒计时"],[1211,"Basic_ui_2","Sign up","参与"],[1212,"Basic_ui_3","Search","寻马"],[1213,"Basic_ui_4","Stable","家园"],[1214,"Basic_ui_5","Town","小镇"],[1215,"Basic_ui_6","Setting","设置"],[1216,"Basic_ui_7","Back","助力"],[1217,"Basic_ui_8","Breeding","繁育"],[1218,"Weather_1","Sunny","晴天"],[1219,"Weather_2","Rainy","雨天"],[1220,"Weather_3","Cloudy","阴天"],[1221,"Weather_4","Snowy","雪天"],[1222,"Weather_des_1","Sunny with XXX","晴天下XXXXXXXXXX"],[1223,"Weather_des_2","Rainy with XXX","雨天下XXXXXXXXXX"],[1224,"Weather_des_3","Clouding with XXX","阴天下XXXXXXXXXX"],[1225,"Weather_des_4","Snowy with XXX","雪天下XXXXXXXXXX"],[1226,"Nature_1","Persistent","执着"],[1227,"Nature_2","Irascible","暴躁"],[1228,"Nature_3","Steady","沉稳"],[1229,"Nature_4","Nimble","灵动"],[1230,"Nature_5","Introvert","内向"],[1231,"Nature_6","Autistic","自闭"],[1232,"Nature_7","Crazy","疯狂"],[1233,"Nature_8","Modest","谦虚"],[1234,"Nature_9","Sly","狡猾"],[1235,"Nature_10","Kind","善良"],[1236,"Hobby_des_1","Like sunny days","喜欢晴天"],[1237,"Hobby_des_2","Like cloudy days","喜欢阴天"],[1238,"Hobby_des_3","Like rainy days","喜欢雨天"],[1239,"Hobby_des_4","Like snowy days","喜欢雪天"],[1240,"Hobby_des_5","Like track 1","喜欢1号赛道"],[1241,"Hobby_des_6","Like track 2","喜欢2号赛道"],[1242,"Hobby_des_7","Like track 3","喜欢3号赛道"],[1243,"Hobby_des_8","Like track 4","喜欢4号赛道"],[1244,"Hobby_des_9","Like track 5","喜欢5号赛道"],[1245,"Hobby_des_10","Like track 6","喜欢6号赛道"],[1246,"Hobby_des_11","Like track 7","喜欢7号赛道"],[1247,"Hobby_des_12","Like track 8","喜欢8号赛道"],[1248,"Lineage_1","Native horse","本土马"],[1249,"Lineage_2","Genius horse","非主流马"],[1250,"Lineage_3","Unicorn","独角马"],[1251,"Lineage_4","Maverick horse","特立独行马"],[1252,"Lineage_5","Artistic horse","艺术马"],[1253,"Lineage_6","Gourmet horse","美食马"],[1254,"Lineage_des_1","A native, strong and energetic horse","产自本土，强壮又精力旺盛的马"],[1255,"Lineage_des_2","A horse with personality and amazing sprinting speed","个性且冲刺速度更快的马"],[1256,"Lineage_des_3","A beautiful horse with great capabilities","美丽且能力超群的特色马"],[1257,"Lineage_des_4","A high-speed horse with a special personality","性格特异的超高速马"],[1258,"Lineage_des_5","A horse that loves art and breeding","热爱艺术和繁育的文艺马"],[1259,"Lineage_des_6","A horse that eats a lot and shits a lot","饭量奇大且粪便量惊人的马"],[1260,"Follow","Follow","跟随"],[1261,"Feed","Feeding","投喂"],[1262,"Modify_edit","Change","改"],[1263,"Modify_complicate","Complete","完成"],[1264,"Guessresult_1","Horse {0} won the race","{0}号马赢得了比赛"],[1265,"Guessresult_2","All the horses you backed lost","您助力的马都输掉了比赛",null,null,null,null,null,"file:///D:/tools/baidu-translate-client/resources/app.asar/app.html#"],[1266,"Guessresult_3","The horse you backed is horse {0}","您助力的马是{0}号马 "],[1267,"Guessresult_4","Get","获得"],[1268,"Guessresult_5","Lose","损失"],[1269,"Guessresult_6","{0}{1} money","{0}了{1}钱"],[1270,"Btn_yes","Yes","是"],[1271,"Btn_no","No","否"],[1272,"Interactiveui_1","Dialogue","对话"],[1273,"Matchendui","Race ends","比赛结束"],[1274,"Matchreadyui_1","Preparation","赛前准备"],[1275,"Matchreadyui_2","The weather of this game is","本场比赛的天气是"],[1276,"Matchreadyui_3","Your horse is on","你的赛马在"],[1277,"Matchreadyui_4","Track","赛道"],[1278,"Uiqte_countdown","Countdown","倒计时"],[1279,"Uiqte_tips_1","Keep clicking to cheer your horse on!!","连续点击按钮为你的马儿加油吧！！"],[1280,"Uiqte_tips_2","The more you click, the faster the horse runs!!","点击次数越多，赛马跑的越快哦！！"],[1281,"Uiqte_cheer_tittle","Cheering Moments","欢呼时刻"],[1282,"Uiqte_cheer_describe_1","Your horse is not affected","你的马不受影响"],[1283,"Uiqte_cheer_describe_2","Your horse is encouraged","你的马受到了鼓励"],[1284,"Uiqte_cheer_describe_3","Your horse is greatly encouraged","你的马受到了极大鼓励"],[1285,"Uiqte_cheer_describe_4","Your horse is super encouraged","你的马受到了巨大鼓励"],[1286,"Raceui_first","Champion","头名"],[1287,"Raceui_second","Second place","次名"],[1288,"Raceui_third","Third place","第三名"],[1289,"Skill_broadcast_1","In the second half of the journey","在后半程竟然"],[1290,"Skill_broadcast_2","when I fell behind","在落后时竟然"],[1291,"Skill_broadcast_3","when being surpassed","在被超过时竟然"],[1292,"Skill_broadcast_4","when in the lead","在领先时竟然"],[1293,"Skill_broadcast_5","when surpassing the opponent","在超过对手时竟然"],[1294,"Skill_broadcast_6","during the race","在比赛中竟然"],[1295,"Behavior_brocasttwo_1","performs the Maori war dance!","跳起野性的毛利战舞！"],[1296,"Behavior_brocasttwo_2","becomes a pony hairdryer!","变身小马牌吹风机！"],[1297,"Behavior_brocasttwo_3","launches a crazy expansion!","发动野蛮又疯狂的伸缩！"],[1298,"Behavior_brocasttwo_4","performs graceful ballet!","跳起优雅的小步芭蕾！"],[1299,"Behavior_brocasttwo_5","becomes a rolling tire!","变身车轮滚滚的轮胎马！"],[1300,"Behavior_brocasttwo_6","performs charming minuet!","跳起魔性的交叉小步舞！"],[1301,"Behavior_brocasttwo_7","starts to imitate Superman's gesture and takes off!","开始模仿超人的飞行动作并真的起飞！"],[1302,"Behavior_brocasttwo_8","starts to swing its neck wildly!","脖子开始疯狂甩动！"],[1303,"Behavior_brocasttwo_9","starts to stretch its neck rapidly!","脖子开始急速伸缩！"],[1304,"Behavior_brocasttwo_10","becomes a spinning top!","直接变身马型陀螺转转转！"],[1305,"Behavior_brocasttwo_11","becomes a high-speed helicopter!","变身马型高速直升机！",null,null,null,null,null,"file:///D:/tools/baidu-translate-client/resources/app.asar/app.html#"],[1306,"Behavior_brocasttwo_12","knocks its head against the ground!","直接以头抢地！"],[1307,"Behavior_brocasttwo_13","hits the brake sharply!","开始急刹刹刹刹车！"],[1308,"Behavior_brocastthird","which makes it","因此让"],[1309,"Behavior_brocastfourth_1","run faster!","跑得更快了！"],[1310,"Behavior_brocastfourth_2","run slower!","跑得变慢了！"],[1311,"Behavior_brocastfourth_3","stop moving!","直接摆烂了！"],[1312,"Behavior_brocastfourth_4","run backward?!","开始倒着跑了？！"],[1313,"Behavior_brocastfourth_5","set out early!","提前出发了！"],[1314,"Behavior_brocastfourth_6","run faster and faster!","越跑越快了！"],[1315,"Behavior_brocastfourth_7","run more and more slowly!","越跑越慢了！"],[1316,"Behavior_brocastfourth_8","get high?!","原地自嗨了？！"],[1317,"Reward_1","Income from selling droppings","马粪收益"],[1318,"Reward_2","You have not collected horse droppings!!!","您没有收集的马粪！！！"],[1319,"Reward_3","You have collected","您一共拾取了"],[1320,"Reward_4","{0} horse droppings","大马粪{0}坨"],[1321,"Reward_5","{0} foal droppings","小马粪{0}坨"],[1322,"Reward_6","Total income: {0}","总收益：{0}"],[1323,"Reward_7","Close","关闭"],[1324,"Settlementui_title","Result","比赛结果"],[1325,"Settlementui_rank","Ranking","名次"],[1326,"Settlementui_name","Horse name","赛马名称"],[1327,"Settlementui_time","Time(s)","时间(秒)"],[1328,"Settlementui_money","Bonus","奖金"],[1329,"Settlementui_betmoney","Back amount","助力金额"],[1330,"Settlementui_betpeople","Speed reward","时长奖励"],[1331,"Settlementui_next","Next","下一步"],[1332,"Shopinnerui_look","Click the horse to view","点击马匹查看"],[1333,"Shopinnerui_take","Lead away","牵走"],[1334,"Shopinnerui_select","Buy","选择"],[1335,"Shopinnerui_last","Previous","上一匹"],[1336,"Shopinnerui_next","Next","下一匹"],[1337,"Shopinnerui_return","Back","返回",null,null,null,null,null,"file:///D:/tools/baidu-translate-client/resources/app.asar/app.html#file:///D:/tools/baidu-translate-client/resources/app.asar/app.html#"],[1338,"Shopui_look","I'm still considering it...","我再看看"],[1339,"Shopui_makeit","That's it","就它了！"],[1340,"Weatherui_tips","Night falls","夜幕降临"],[1341,"Weatherui_moring","Morning","清晨"],[1342,"Time_data","{0}{1}{2}","公元{0}年{1}月{2}日"],[1343,"Lastname_1","Luke","雪蝶 "],[1344,"Lastname_2","Smith","枫以"],[1345,"Lastname_3","Jones","浮临"],[1346,"Lastname_4","Taylor","浅浅"],[1347,"Lastname_5","Rocket","茶挽"],[1348,"Lastname_6","Brown","盼兮"],[1349,"Lastname_7","Davies","春日"],[1350,"Lastname_8","Evans","瑾沫"],[1351,"Lastname_9","Wilson","流年"],[1352,"Lastname_10","Thomas","风铃"],[1353,"Lastname_11","Bell","桃花"],[1354,"Lastname_12","Kelly","满栀"],[1355,"Lastname_13","Collins","风行"],[1356,"Lastname_14","Walker","月霜"],[1357,"Lastname_15","Luna","花辞"],[1358,"Lastname_16","Watson","一梦"],[1359,"Lastname_17","Green","念河"],[1360,"Lastname_18","Lloyd","若怜"],[1361,"Lastname_19","King","伊意"],[1362,"Lastname_20","Lloyd","幽离"],[1363,"Lastname_21","Lucas","冬瑾"],[1364,"Lastname_22","Morgan","弥枳"],[1365,"Lastname_23","Khan","南故"],[1366,"Lastname_24","Young","夏凉"],[1367,"Lastname_25","Hunter","浮生"],[1368,"Lastname_26","Sam","浅墨"],[1369,"Lastname_27","Russell","野稚"],[1370,"Lastname_28","Ellis","夏迟"],[1371,"Lastname_29","Tim","志恒"],[1372,"Lastname_30","Powell","旻宇"],[1373,"Lastname_31","Owen","昱辰"],[1374,"Lastname_32","Mason","轶凡"],[1375,"Lastname_33","Butler","雨诗"],[1376,"Firstname_1","Eric","西钥"],[1377,"Firstname_2","Jones","拓拔"],[1378,"Firstname_3","Phillip","汝嫣"],[1379,"Firstname_4","Todd","容成"],[1380,"Firstname_5","Janice","九方"],[1381,"Firstname_6","Earl","尔朱"],[1382,"Firstname_7","Gloria","安岭"],[1383,"Firstname_8","June","仲长"],[1384,"Firstname_9","Rose","东里"],[1385,"Firstname_10","Vox","呼延"],[1386,"Firstname_11","Sun","百里"],[1387,"Firstname_12","Jean","宇文"],[1388,"Firstname_13","Craig","司空"],[1389,"Firstname_14","Kris","钟离 "],[1390,"Firstname_15","Victor","上官"],[1391,"Firstname_16","Ernest","端木"],[1392,"Firstname_17","Bobby","欧阳"],[1393,"Firstname_18","Jack","司马"],[1394,"Firstname_19","Sara","独孤"],[1395,"Firstname_20","Lava","慕容"],[1396,"Firstname_21","Jimmy","公孙"],[1397,"Firstname_22","Alice","皇甫"],[1398,"Firstname_23","Sarah","尉迟"],[1399,"Firstname_24","Bonnie","夏侯"],[1400,"Firstname_25","Emily","公主"],[1401,"Firstname_26","Dog","南宫"],[1402,"Firstname_27","Joyce","东方"],[1403,"Firstname_28","Lois","罗"],[1404,"Firstname_29","Julia","刘"],[1405,"Firstname_30","Sara","江"],[1406,"Firstname_31","Ruth","崔"],[1407,"Firstname_32","Denise","孔"],[1408,"Horsetalk_1","Wow! Take off!","芜湖！起飞！"],[1409,"Horsetalk_2","I feel my legs are glued!","感觉马腿被黏住了！"],[1410,"Horsetalk_3","I want to go home! Let me go home!","我要回家！让我回家！"],[1411,"Horsetalk_4","So tired! I quit! I'm going to bed!","好累啊！不跑了！我要睡觉！"],[1412,"Horsetalk_5","Ha ha, I'm going AWOL!","嘿嘿嘿溜了溜了！"],[1413,"Horsetalk_6","Ha ha, what a nice day today!","哈哈哈哈嘎嘎嘎嘎嘿嘿嘿今天天气真好!"],[1414,"Horsetalk_7","It's a nice day today","今天天气不错"],[1415,"Horsetalk_8","I'm so tired. Can I go back to the stable?","好累啊，能不能放我回家园？"],[1416,"Horsetalk_9","Damn it! Today's carrots aren't fresh! The foal only grows a little!","可恶！今天的胡萝卜好像不太新鲜！小马只成长了一点！"],[1417,"Horsetalk_10","The foal looks worried today and doesn't want to eat carrots.","今天的小马看起来忧心忡忡，不是很想吃胡萝卜。"],[1418,"Horsetalk_11","The foal doesn't want to eat carrots and spits at you!","小马不想吃胡萝卜并且朝你吐了口水！"],[1419,"Horsetalk_12","The foal eats some carrots and grows!","小马啃了几口胡萝卜，成长值增加了！"],[1420,"Horsetalk_13","The foal thanks you for feeding it and licks your hand.","小马非常感谢你喂它吃胡萝卜，并且舔了舔你的手。"],[1421,"Horsetalk_14","The foal eats your carrots and grows!","小马吃掉你的投喂的胡萝卜，成长值增加了！"],[1422,"Horsetalk_15","Today's carrots are of high quality. The foal grows significantly!","今天的胡萝卜很优质，小马的成长值有了明显提升！"],[1423,"Horsetalk_16","The foal has a good appetite today and grows significantly!","小马今天胃口很好，成长值有了明显提升！"],[1424,"Horsetalk_17","The foal likes your carrots and grows significantly!","小马很喜欢你投喂的胡萝卜，成长值有了显著提升！"],[1425,"Horsetalk_18","Today's carrots are of high quality. The foal grows significantly!","今天的胡萝卜很优质，小马的成长值有了明显提升！"],[1426,"Horsetalk_19","The foal loves your carrots and jumps up and down happily! It grows greatly!","小马超级喜欢你投喂的胡萝卜，高兴的上蹿下跳！成长值有了巨大提升！"],[1427,"Horsetalk_20","You have bought a golden carrot! The pony grows crazily!","竟然买到了黄金胡萝卜！小马吃了获得了极大成长！"],[1428,"Horsetalk_21","This foal is really a big eater. It eats all the carrots and grows crazily!","这匹小马竟然是个大胃王，它把胡萝卜全部吃完了！成长值获得了极大提升！"],[1429,"GrowUI_Talk1","Do you want to spend {0} gold buying foal food?","是否花费{0}金币购买饲料投喂小马"],[1430,"GrowUI_Talk2","Do you want to release this horse?","是否放生这匹马？"],[1431,"GrowUI_Talk3","Congratulation! Your pony becomes an adult horse","恭喜你的小马变成大马了"],[1432,"UnFollow","Stop following","放弃跟随"],[1433,"GuessResult_Title","Backing result","助力结果"],[1434,"HorseTakeIn","Race","让它比赛"],[1435,"HorseBagFeed","Feed","喂养"],[1436,"HorseBagBack","Rest","放回家园"],[1437,"Interactive_Talk1","It's not entry time yet. Please come later.","现在还不是报名时间，报名时间再来吧"],[1438,"Interactive_Talk2","Do you want to put this foal in the stable?","要将这匹小马放入家园吗？"],[1439,"Interactive_Talk3","You have not put the foal in the stables. Do you want to start new breeding?","你还有小马没有放入家园，要开始新的繁育？"],[1440,"Interactive_Talk4","You will lose these horses after quitting. Do you want to quit?","退出后将放弃这些马，确认退出？"],[1441,"RankItem_1","Finish","完赛"],[1442,"RankItem_2","Stop moving","摆烂"],[1443,"Sellout","Sell","卖出"],[1444,"Shopinnerui_Title","I found three beautiful horses! ","我找到了！三匹靓马！"],[1445,"Shopinnerui_Price","Price","价钱"],[1446,"ShopUI_Price","Lineage price","血统价格"],[1447,"GiveUp","Quit","放弃比赛"],[1448,"ShopUI_Des","{0} may make you invisible on the racecourse! Do you want to spend {1} letting me find the horse of this lineage?","{0}，也许会让你成为常胜将军！是否需要花费{1}让我为你找这种血统的马？"],[1449,"BreedMgr_talk_1","The {0} pony was born","第{0}匹小马出生了"],[1450,"BreedMgr_talk_2","Its {0} part has mutated!!","它的{0}部位，产生了基因突变！！"],[1451,"ErrorCode_1","Not within entry time","不在报名时间"],[1452,"ErrorCode_2","You have entered","已经报名成功了"],[1453,"ErrorCode_3","Cannot quit now","当前不能放弃"],[1454,"ErrorCode_4","You have not entered yet, thus you cannot quit.","还没有报名,放弃报名失败"],[1455,"ErrorCode_5","Your stables are full. Please release some horses first","您的家园已经满了，请先放生一些马"],[1456,"ErrorCode_6","None of your horses are racing","你还没有出战的马"],[1457,"ErrorCode_7","The horse has run out of energy and cannot race","你的伙伴马没有精力了，无法报名！"],[1458,"ErrorCode_8","Wait! It doesn't seem right!","等等！它好像不太对劲！"],[1459,"ErrorCode_9","Please select two horses first","请先选择两匹马"],[1460,"ErrorCode_10","You do not have an adult horse yet. Please go to the shop to buy","还没有成年马匹,请前往商店购买"],[1461,"ErrorCode_11","Horse entered!!!!","马匹出战成功!!!!"],[1462,"ErrorCode_12","Entry starts","开始报名了"],[1463,"ErrorCode_13","You can back horses now!","开始助力小马啦！"],[1464,"ErrorCode_14","Entered","报名成功"],[1465,"ErrorCode_15","Quited","放弃成功"],[1466,"ErrorCode_16","You don't have an adult horse","你没有成年马"],[1467,"ErrorCode_17","Insufficient gold!!!","你的金币不够！！！"],[1468,"ErrorCode_18","The foal is full!","小马吃饱啦！"],[1469,"ErrorCode_19","Renamed!!!","改名成功！！！"],[1470,"ErrorCode_20","Your horse has reached maximum Growth","您的马已达到最大拥有值"],[1471,"ErrorCode_21","Bought!!!","购买成功!!!"],[1472,"ErrorCode_22","There is no more!","没有啦！"],[1473,"ErrorCode_23","Please select a lineage","请选择一个血统"],[1474,"ErrorCode_24","No corresponding horse is found","未找到相应的马匹"],[1475,"ErrorCode_25","To enter the race, please select a horse to follow","请选择一匹大马跟随，才能参赛"],[1476,"MatchCdui_Start","Start","开始"],[1477,"Win_Rate","Winning percentage","胜率"],[1478,"RewardUI_DontBuy","I don't want to sell it!","我不想卖！"],[1479,"ShopUI_SellNo","I won't buy it!","我不买了！"],[1480,"Var_MaxSpeed","Maximum speed","最大速度"],[1481,"Var_StartSpeed","Initial speed","起跑速度"],[1482,"Var_Defect","Excreta","排便量"],[1483,"Var_Acc","ACC","加速度"],[1484,"Var_Energy","Energy","精力值"],[1485,"Var_Bear","Parity","生育"],[1486,"Race_Wait","Off-season","休赛中"],[1487,"Raceui_speed","Speed","速度"],[1488,"BreedUI_MatureHorseShort","You don't have enough horses","你的成年马数量不足"],[1489,"BreedUI_CanBreed","You have two or more fertile horses","你的可生育的成年马大于等于两只"],[1490,"BreedUI_CannotBreed","You have fewer than two fertile horses","你的可生育的成年马小于两只"],[1491,"FectchFit","Collected {0} droppings","捡到{0}坨粪便"],[1492,"CanNotBreed","Can't breed now","不可繁育"],[1493,"BasicUI_SignTime","It's time to enter the race!","现在是比赛报名时间！"],[1494,"BasicUI_GoSign","Enter Now","去报名"],[1495,"BasicUI_BetTime","The race is about to start! Come and back horses!","赛马比赛就要正式开始！快来助力小马吧！"],[1496,"BasicUI_GoBet","Back","去助力"],[1497,"BasicUI_WatchTime","The race is going on. Go watch it!","比赛正在激烈进行中，快去观赛吧！"],[1498,"BasicUI_GoWatch","Spectate","观赛"],[1499,"GuessUI_BetSuccess","Backed","助力成功"],[1500,"RaceUI_LeaveRace","Leave the racecourse","离开赛场"],[1501,"RaceUI_LeaveRaceConfirm","Do you want to leave?","是否退出赛场？"],[1502,"BasicUI_InRace","Racing","比赛中"],[1503,"GrowUI_Feed_Info","The foal pony will eat in {0} min {1} s","距离下次小马进食还有：{0}min{1}s"],[1504,"Brocast_1","'s horse","的坐骑"],[1505,"Brocast_2","others","其他人"],[1506,"Brocast_3","all","所有人"],[1507,"Brocast_4","You","自己"],[1508,"TransformUI_Hall","Horse Island","小马岛"],[1509,"TransformUI_Bussiness","Town","小镇"],[1510,"TransformUI_Stable","Stable","家园"],[1511,"TransformUI_Breed","Pasture","牧场"],[1512,"TransformUI_Shop","Bazaar","买马集市"],[1513,"TransformUI_Bet","Backing house","赛场助力屋"],[1514,"TransformUI_Sign","Enter the race ","报名参赛"],[1515,"ShopUI_Unlock","Unlock","解锁"],[1516,"HasNoHorse","This is your last horse. Please do not release it","这是你的最后一匹马，请不要放生"],[1517,"Concern_1","The race you are interested in is about to start. Come back when it is over","你关注的比赛快要开始了，等比赛结束再来吧"],[1518,"UnlockDefeat","Unlock failed","解锁失败"],[1519,"FectchDiamond","Found {0} diamonds","捡到{0}颗钻石"],[1520,"DiamondReward","Diamond reward","钻石奖励"],[1521,"GoldReward","Gold reward","金币奖励"],[1522,"Barrage_Beyond","Your horse surpasses {0}!","你的马超越了{0}！ "],[1523,"Barrage_Backward","Your horse is surpassed by {0}!","你的马被{0} 超越了！ "],[1524,"Horsetalk_22","Mary is so beautiful. I want to be her friend!","马场的小芳真美，想和它做朋友！"],[1525,"Horsetalk_23","How boring! I want to race!","好无聊啊，好想去比赛！"],[1526,"Horsetalk_24","The droppings of the horse next door stink! I can't stand it!","隔壁的马拉屎好臭！投诉投诉！"],[1527,"Horsetalk_25","I don't like today's food. The master doesn't understand me at all!","不喜欢今天的食物！主人不懂我！"],[1528,"Horsetalk_26","Today's weather is good!","今天的天气真好啊！"],[1529,"Horsetalk_27","If it snows, I can eat cotton candy","下雪的话，就可以吃棉花糖了！"],[1530,"Horsetalk_28","Let me tell you a gossip...","我跟你讲一个八卦......"],[1531,"Horsetalk_29","The master collects droppings every day. Does he eat them?","主人总捡马粪，他不会偷偷吃掉吧！"],[1532,"Horsetalk_30","If only the new horse lived next to me!","新来的马要是住我旁边就好了！"],[1533,"Horsetalk_31","The horse beside me had been barking all day. So noisy!","旁边那只马一直在乱叫，好吵啊！"],[1534,"Horsetalk_32","I'm in a good mood today!","今天心情真好！"],[1535,"Horsetalk_33","The food today is delicious!","今天的食物很美味！"],[1536,"Horsetalk_34","I can finally come out!","终于可以出来玩咯！"],[1537,"Horsetalk_35","I wonder where the master will take me to!","不知道主人会带我去哪玩！好期待！"],[1538,"Horsetalk_36","The master always talks to others and ignores me!","主人老是跟别人说话，都不理我！"],[1539,"Horsetalk_37","The outside world is so novel!","外面的世界好新奇啊！"],[1540,"Horsetalk_38","The air is so good and fresh!","空气真好，新鲜多了！"],[1541,"Horsetalk_39","It's a nice day to go out and play!","今天天气不错，适合出门玩！"],[1542,"Horsetalk_40","I really want to watch horse racing!","好想去看看赛马现场！"],[1543,"Horsetalk_41","I heard that there is a powerful horse on the racecourse. I want to have a look!","听说赛场来了厉害的马，好想看！"],[1544,"Horsetalk_42","I'm so tired. I want to go home!","好累啊，好想回家！"],[1545,"Horsetalk_43","Why doesn't the master buy me something delicious!","主人怎么不给我买好吃的！"],[1546,"Horsetalk_44","It's said that there are all kinds of delicious food in the town!","听说小镇上有很多美食！好想吃！"],[1547,"Horsetalk_45","I can tell stories to my friends when I go back!","等会回去又可以给同伴讲故事了！"],[1548,"Npc_name1","Uncle George ","乔治叔叔"],[1549,"Npc_name2","Tom Smith","汤姆"],[1550,"Npc_name3","Bobby Rich","鲍比富翁"],[1551,"Npc_name4","Henry Cecil","亨利"],[1552,"Npc_name5","Holy Shit","霍利"],[1553,"Npc_name6","Fisherman","渔民"],[1554,"Npc_station1","Go to the stables","前往家园"],[1555,"Npc_station2","Go to Town","前往小镇"],[1556,"Npc_station3","Buy horses","购买马匹"],[1557,"Npc_station4","Back horses","助力赛马"],[1558,"Npc_station5","Enter the race","参赛报名"],[1559,"Npc_station6","Breeding pasture","繁育牧场"],[1560,"Npc_station7","Droppings selling point","马粪出售点"],[1561,"Npc_station8","Go to Breeding pasture","前往繁育场"],[1562,"No_Pay","Free","免费"],[1563,"Uncle_tip1","You can't enter the race without a horse!","你还没有带出战的伙伴马，不能参赛哦！"],[1564,"Uncle_tip2","Please equip a horse to enter the race!","快去带你的伙伴马，才可以参赛哦！"],[1565,"Uncle_tip3","You need a horse to enter the race!","你没带马儿，可不能参赛！"],[1566,"Competition","Race","比赛"],[1567,"Horsetalk_46","I'll just go for it!","我直接开冲！"],[1568,"Horsetalk_47","This is horrible! I want to go home!","好恐怖啊我要回家！"],[1569,"Horsetalk_48","I want to fly higher!","我要飞得更高！"],[1570,"Horsetalk_49","How did you pick me?!","怎么会选到我了！"],[1571,"Horsetalk_50","Time is suspended!","时间暂停了！"],[1572,"Horsetalk_51","Sob sob, I want to go home!","呜呜呜我要回家！"],[1573,"Horsetalk_52","Never want to race again!","再也不想比赛了！"],[1574,"Horsetalk_53","The horse's legs are sticky!","马腿好黏！"],[1575,"Horsetalk_54","My legs are glued!","原地打瞌睡！"],[1576,"Horsetalk_55","My legs can't be more powerful!","感觉腿一点都不软了！"],[1577,"Skill_1","Wheel rolling: greatly increases speed!","车轮滚滚：速度极大提升！"],[1578,"Skill_2","Wild Expansion: Other horses are scared to retreat!","狂野伸缩：其他马都吓到后退！"],[1579,"Skill_3","Flying Horse: greatly increases speed!","天马行空：速度极大提升！"],[1580,"Skill_4","Giant Horsehead Jellyfish: A random horse will run backwards!","巨型马头水母：随机选择一匹马倒着跑！"],[1581,"Skill_5","Giant Elastic Horsehead: Stop all horses!","巨型弹力马头：全体停下！"],[1582,"Skill_6","Pony Fighter: All other horses run towards their homes!","小马战机：其他马都往家里跑！"],[1583,"Skill_7","Brainstorm: A random horse will go home!","头脑飞旋：随机挑选一匹马回家！"],[1584,"Skill_8","Horse Ass Top: All horses slow down!","马屁股陀螺：全体马都减速！"],[1585,"Skill_9","Head Dancing: A random horse will stop moving!","颠头舞：随机挑选一匹马摆烂！"],[1586,"Skill_10","Pony Battle Dance: All horses speed up!","小马战舞：大家都加速！"],[1587,"Newguide_1","Use the joystick to move ","转动摇杆控制移动"],[1588,"Newguide_2","Slide the screen to adjust the angle ","滑动屏幕控制视角 "],[1589,"Energy_1","Energy recovery time","精力恢复时间"],[1590,"StudSelection","Parent horse","选择种马"],[1591,"Touch","Touch","抚摸"],[1592,"Remainingtime","Remaining Time：","剩余时间："],[1593,"Head ","head","头"],[1594,"Neck","neck","脖子"],[1595,"Body","body","身体"],[1596,"Tail","tail","尾巴"],[1597,"Leg","thigh","大腿"],[1598,"Shank","shank","小腿"],[1599,"FollowFeed ","Follow can't feed the ponies ","跟随不能喂养小马"],[1600,"Number"," ","号"]];
export interface ILanguageElement extends IElementBase{
 	/**id*/
	ID:number
	/**名字索引*/
	Name:string
	/**英文*/
	Value:string
 } 
export class LanguageConfig extends ConfigBase<ILanguageElement>{
	constructor(){
		super(EXCELDATA);
	}
	/**MetaWorld*/
	get MetaWorld():ILanguageElement{return this.getElement(1001)};
	/**999*/
	get 999():ILanguageElement{return this.getElement(1002)};
	/**速度（km/h）：*/
	get P_max_speed():ILanguageElement{return this.getElement(1003)};
	/**加速度（m/s²）：*/
	get P_acc_speed():ILanguageElement{return this.getElement(1004)};
	/**血统：*/
	get P_lineage():ILanguageElement{return this.getElement(1005)};
	/**性格：*/
	get P_nature():ILanguageElement{return this.getElement(1006)};
	/**喜好：*/
	get P_hobby():ILanguageElement{return this.getElement(1007)};
	/**助力*/
	get P_bet():ILanguageElement{return this.getElement(1008)};
	/**生育：*/
	get P_brith_number():ILanguageElement{return this.getElement(1009)};
	/**精力：*/
	get P_energy():ILanguageElement{return this.getElement(1010)};
	/**起跑速度（km/h）：*/
	get P_startrunspeed():ILanguageElement{return this.getElement(1011)};
	/**排便量：*/
	get P_defecation():ILanguageElement{return this.getElement(1012)};
	/**选择*/
	get P_choose():ILanguageElement{return this.getElement(1013)};
	/**确认*/
	get P_confirm():ILanguageElement{return this.getElement(1014)};
	/**取消*/
	get P_cancel():ILanguageElement{return this.getElement(1015)};
	/**奖金倍率*/
	get Guessui_odd():ILanguageElement{return this.getElement(1016)};
	/**已助力金额：*/
	get Guessui_all():ILanguageElement{return this.getElement(1017)};
	/**你的助力金额：*/
	get Guessui_player():ILanguageElement{return this.getElement(1018)};
	/**你是否为{0}助力{1}*/
	get Guessui_describe():ILanguageElement{return this.getElement(1019)};
	/**等待助力中*/
	get Tips_waitopen():ILanguageElement{return this.getElement(1020)};
	/**开始助力了*/
	get Tips_opening():ILanguageElement{return this.getElement(1021)};
	/**金币不足*/
	get Tips_notenoughgold():ILanguageElement{return this.getElement(1022)};
	/**钻石不足*/
	get Tips_notenoughdiamond():ILanguageElement{return this.getElement(1023)};
	/**助力金额需要大于零*/
	get Tips_betgreaterzero():ILanguageElement{return this.getElement(1024)};
	/**离开*/
	get Horse_Leave():ILanguageElement{return this.getElement(1025)};
	/**繁育*/
	get Breedui_breed():ILanguageElement{return this.getElement(1026)};
	/**获得{0}匹小马*/
	get Breedresultui_getpony():ILanguageElement{return this.getElement(1027)};
	/**成长值：*/
	get Growthvalue():ILanguageElement{return this.getElement(1028)};
	/**放入家园*/
	get Breedresultitem_get():ILanguageElement{return this.getElement(1029)};
	/**放生*/
	get Horsefree():ILanguageElement{return this.getElement(1030)};
	/**名次*/
	get Raceui_rank():ILanguageElement{return this.getElement(1031)};
	/**姓名：*/
	get Raceui_horsename():ILanguageElement{return this.getElement(1032)};
	/**赛道*/
	get Raceui_time():ILanguageElement{return this.getElement(1033)};
	/**奥萝拉 */
	get Ai_name1():ILanguageElement{return this.getElement(1034)};
	/**梅布尔 */
	get Ai_name2():ILanguageElement{return this.getElement(1035)};
	/**佐薇 */
	get Ai_name3():ILanguageElement{return this.getElement(1036)};
	/**淘气包 */
	get Ai_name4():ILanguageElement{return this.getElement(1037)};
	/**好名都让狗取了 */
	get Ai_name5():ILanguageElement{return this.getElement(1038)};
	/**欠费的萤火虫 */
	get Ai_name6():ILanguageElement{return this.getElement(1039)};
	/**记忆黑名单 */
	get Ai_name7():ILanguageElement{return this.getElement(1040)};
	/**我的故事你不懂 */
	get Ai_name8():ILanguageElement{return this.getElement(1041)};
	/**爱情不曾敲门 */
	get Ai_name9():ILanguageElement{return this.getElement(1042)};
	/**大原娜娜子 */
	get Ai_name10():ILanguageElement{return this.getElement(1043)};
	/**铅笔画的颜色 */
	get Ai_name11():ILanguageElement{return this.getElement(1044)};
	/**西柚柚柚柚*/
	get Ai_name12():ILanguageElement{return this.getElement(1045)};
	/**是只坏兔子 */
	get Ai_name13():ILanguageElement{return this.getElement(1046)};
	/**快乐鸡蛋黄 */
	get Ai_name14():ILanguageElement{return this.getElement(1047)};
	/**幕后煮屎人 */
	get Ai_name15():ILanguageElement{return this.getElement(1048)};
	/**老二刺螈 */
	get Ai_name16():ILanguageElement{return this.getElement(1049)};
	/**请叫我集翔物 */
	get Ai_name17():ILanguageElement{return this.getElement(1050)};
	/**半个废物 */
	get Ai_name18():ILanguageElement{return this.getElement(1051)};
	/**勾魂公狒狒 */
	get Ai_name19():ILanguageElement{return this.getElement(1052)};
	/**夺命母猩猩 */
	get Ai_name20():ILanguageElement{return this.getElement(1053)};
	/**我有点可爱*/
	get Ai_name21():ILanguageElement{return this.getElement(1054)};
	/**讨打的小猫*/
	get Ai_name22():ILanguageElement{return this.getElement(1055)};
	/**狗蛋的快乐*/
	get Ai_name23():ILanguageElement{return this.getElement(1056)};
	/**我爱拉屎*/
	get Ai_name24():ILanguageElement{return this.getElement(1057)};
	/**我有一头小毛驴*/
	get Ai_name25():ILanguageElement{return this.getElement(1058)};
	/**好想摆烂*/
	get Ai_name26():ILanguageElement{return this.getElement(1059)};
	/**人生诸多风雨*/
	get Ai_name27():ILanguageElement{return this.getElement(1060)};
	/**花花草草*/
	get Ai_name28():ILanguageElement{return this.getElement(1061)};
	/**我是哈哈哈哈*/
	get Ai_name29():ILanguageElement{return this.getElement(1062)};
	/**悲伤逆流成海*/
	get Ai_name30():ILanguageElement{return this.getElement(1063)};
	/**下雨天我就哭*/
	get Ai_name31():ILanguageElement{return this.getElement(1064)};
	/**好想放屁*/
	get Ai_name32():ILanguageElement{return this.getElement(1065)};
	/**我比纸巾还能扯*/
	get Ai_name33():ILanguageElement{return this.getElement(1066)};
	/**成就梦想*/
	get Ai_name34():ILanguageElement{return this.getElement(1067)};
	/**丽萨披萨*/
	get Ai_name35():ILanguageElement{return this.getElement(1068)};
	/**可乐派派*/
	get Ai_name36():ILanguageElement{return this.getElement(1069)};
	/**反骨的鸟*/
	get Ai_name37():ILanguageElement{return this.getElement(1070)};
	/**糖当当当*/
	get Ai_name38():ILanguageElement{return this.getElement(1071)};
	/**有一点搞笑*/
	get Ai_name39():ILanguageElement{return this.getElement(1072)};
	/**拉屎没有纸*/
	get Ai_name40():ILanguageElement{return this.getElement(1073)};
	/**我啥也不知道*/
	get Ai_name41():ILanguageElement{return this.getElement(1074)};
	/**加个好友*/
	get Ai_name42():ILanguageElement{return this.getElement(1075)};
	/**派大星在海里*/
	get Ai_name43():ILanguageElement{return this.getElement(1076)};
	/**树下的花猫*/
	get Ai_name44():ILanguageElement{return this.getElement(1077)};
	/**倒霉熊倒霉*/
	get Ai_name45():ILanguageElement{return this.getElement(1078)};
	/**新年快乐*/
	get Ai_name46():ILanguageElement{return this.getElement(1079)};
	/**幸运海绵宝贝*/
	get Ai_name47():ILanguageElement{return this.getElement(1080)};
	/**大力水手派派*/
	get Ai_name48():ILanguageElement{return this.getElement(1081)};
	/**九天大乌龟*/
	get Ai_name49():ILanguageElement{return this.getElement(1082)};
	/**泡椒小凤爪*/
	get Ai_name50():ILanguageElement{return this.getElement(1083)};
	/**爆辣辣条*/
	get Ai_name51():ILanguageElement{return this.getElement(1084)};
	/**黑色奥利奥*/
	get Ai_name52():ILanguageElement{return this.getElement(1085)};
	/**遇见一条狗*/
	get Ai_name53():ILanguageElement{return this.getElement(1086)};
	/**不要想我*/
	get Ai_name54():ILanguageElement{return this.getElement(1087)};
	/**不和笨笨做朋友*/
	get Ai_name55():ILanguageElement{return this.getElement(1088)};
	/**梦里有鬼*/
	get Ai_name56():ILanguageElement{return this.getElement(1089)};
	/**向大海进发*/
	get Ai_name57():ILanguageElement{return this.getElement(1090)};
	/**鱼摆摆*/
	get Ai_name58():ILanguageElement{return this.getElement(1091)};
	/**大宅蟹*/
	get Ai_name59():ILanguageElement{return this.getElement(1092)};
	/**阿巴阿巴*/
	get Ai_name60():ILanguageElement{return this.getElement(1093)};
	/**嘻嘻哈哈嘿嘿*/
	get Ai_name61():ILanguageElement{return this.getElement(1094)};
	/**被你吓到*/
	get Ai_name62():ILanguageElement{return this.getElement(1095)};
	/**参赛*/
	get Btn1():ILanguageElement{return this.getElement(1096)};
	/**不了，谢谢*/
	get Btn2():ILanguageElement{return this.getElement(1097)};
	/**我再看看*/
	get ShopUI_Look():ILanguageElement{return this.getElement(1098)};
	/**就它了*/
	get ShopUI_TakeIt():ILanguageElement{return this.getElement(1099)};
	/**好的*/
	get Btn5():ILanguageElement{return this.getElement(1100)};
	/**啊！跋山涉水，终于快到小岛啦！*/
	get Player_newguid1():ILanguageElement{return this.getElement(1101)};
	/**小岛还是一如既往地漂亮，先去家园里看看奶奶留给我的财富吧！*/
	get Player_newguid2():ILanguageElement{return this.getElement(1102)};
	/**等下一场比赛开始，就可以带它去报名了！ */
	get Player_newguid3():ILanguageElement{return this.getElement(1103)};
	/**真是太棒啦！*/
	get Player_newguid4():ILanguageElement{return this.getElement(1104)};
	/**现在我有两匹马了，可以去繁殖小马了！*/
	get Player_newguid5():ILanguageElement{return this.getElement(1105)};
	/**新的小马出生了，走近看看吧！*/
	get Player_newguid6():ILanguageElement{return this.getElement(1106)};
	/**不会吧，奶奶就只给我留了一匹马，怪不得走得那么干脆。*/
	get Player_newguid7():ILanguageElement{return this.getElement(1107)};
	/**幸好给我留了一点钱，先去买匹新马吧！*/
	get Player_newguid8():ILanguageElement{return this.getElement(1108)};
	/**亲爱的孙子：
     奶奶要去旅行了，马场交给你管理了！给你留了一点启动资金。
     相信你一定可以做得很好！
                                       你的快乐奶奶*/
	get letter1():ILanguageElement{return this.getElement(1109)};
	/**亲爱的孙子：
     奶奶就知道你把钱败光了，你可以去参加比赛获得奖金。 售票员是你的远亲舅舅，他会给你打折的！
           你在普罗旺斯玩得开心的奶奶*/
	get letter2():ILanguageElement{return this.getElement(1110)};
	/**亲爱的孙子：
    我收到小马的来信，投诉你不铲屎！ 快回家园清理马粪，小马们都要被臭死了！马粪可以拿去卖钱哦！
                你在巴黎玩得开心的奶奶*/
	get letter3():ILanguageElement{return this.getElement(1111)};
	/**大侄子，你果然在城里生活不下去，回来啦？看你这么穷困撩倒，就免费让你参赛一次吧！*/
	get Uncle_talk1():ILanguageElement{return this.getElement(1112)};
	/**这里空气应该要比大城市好很多吧？今天适合赛马，要报名参加吗？ */
	get Uncle_talk2():ILanguageElement{return this.getElement(1113)};
	/**听说你最近又得了几匹新马，来测测他们的能力？ */
	get Uncle_talk3():ILanguageElement{return this.getElement(1114)};
	/**听说寻马星探那儿又得了几匹好马，比赛完可以去瞧瞧！ */
	get Uncle_talk4():ILanguageElement{return this.getElement(1115)};
	/**最近赛场来了一个很强劲的马，快来跟他比比！知己知彼，才能百战百胜！*/
	get Uncle_talk5():ILanguageElement{return this.getElement(1116)};
	/**我可不是寻马星探的托，他是我多年好友了，快去参赛，让我看看他给你挑的马！ */
	get Uncle_talk6():ILanguageElement{return this.getElement(1117)};
	/**最近来观看赛马的游客很多，正是带你的马来比赛的好时机！*/
	get Uncle_talk7():ILanguageElement{return this.getElement(1118)};
	/**长期不赛马，马的战斗力会减弱，快来参赛！*/
	get Uncle_talk8():ILanguageElement{return this.getElement(1119)};
	/**上次的名次还可以，快参加比赛，再创辉煌！*/
	get Uncle_talk9():ILanguageElement{return this.getElement(1120)};
	/**那个繁育员以前老粘着你奶奶，你可要小心他，先比赛吧，别分心！ */
	get Uncle_talk10():ILanguageElement{return this.getElement(1121)};
	/**快带马来比赛，我这次也去小镇首富那里助力你的马！一定大赚一笔！*/
	get Uncle_talk11():ILanguageElement{return this.getElement(1122)};
	/**话不多说，直接参赛！*/
	get Uncle_talk12():ILanguageElement{return this.getElement(1123)};
	/**比赛加油呀！别给你奶奶丢脸！*/
	get Uncle_race1():ILanguageElement{return this.getElement(1124)};
	/**你已经报名了，等待比赛开始吧！*/
	get Uncle_race2():ILanguageElement{return this.getElement(1125)};
	/**比赛还要等待一小段时间，先带你的马热热身吧！*/
	get Uncle_race3():ILanguageElement{return this.getElement(1126)};
	/**你已报名成功了，期待你今天的表现！*/
	get Uncle_race4():ILanguageElement{return this.getElement(1127)};
	/**你太心急了，参赛时间还没到，稍后再来吧！*/
	get Uncle_none1():ILanguageElement{return this.getElement(1128)};
	/**还没到参赛时间，你可以先挑选你要出战的马！*/
	get Uncle_none2():ILanguageElement{return this.getElement(1129)};
	/**今天不想闲聊，等参赛时间到了，你再来吧！*/
	get Uncle_none3():ILanguageElement{return this.getElement(1130)};
	/**未成年小马可不能比赛哦！禁止雇佣童工！*/
	get Uncle_small1():ILanguageElement{return this.getElement(1131)};
	/**小马需要养到成年马才可以参加比赛哦！*/
	get Uncle_small2():ILanguageElement{return this.getElement(1132)};
	/**小马禁止参赛！快去牵只成年马来参赛吧！*/
	get Uncle_small3():ILanguageElement{return this.getElement(1133)};
	/**点击榜单可以查看对应赛道哦！*/
	get Race_talk1():ILanguageElement{return this.getElement(1134)};
	/**赛前指导也写了嘛，你记性不会这么差吧！再强调一下，天气会影响小马的心情，遇到不喜欢的天气比赛，它们可是会发脾气的！*/
	get Race_talk2():ILanguageElement{return this.getElement(1135)};
	/**赛事资讯在这里实时播放，赛场上总有很多趣事发生，祝你玩得愉快！*/
	get Race_talk3():ILanguageElement{return this.getElement(1136)};
	/**按钮点击越快越多！小马就能跑得更快哦！*/
	get Race_talk4():ILanguageElement{return this.getElement(1137)};
	/**选择一个你喜欢的血统吧！我会尽全力给你找到这个血统中最棒的几匹马！*/
	get Find_ask1():ILanguageElement{return this.getElement(1138)};
	/**每一个血统都有独特的天赋，快选一个你喜欢的天赋吧！*/
	get Find_ask2():ILanguageElement{return this.getElement(1139)};
	/**这是一种{0}，想开启这个血统，需要钻石购买！相信它不会让你失望！*/
	get Find_gemsask1():ILanguageElement{return this.getElement(1140)};
	/**钻石不足！想白嫖？可没门儿~快去参加比赛多赚点钻石吧！*/
	get Find_gemnone1():ILanguageElement{return this.getElement(1141)};
	/**恭喜你！解锁了{0}，就让我免费为你找到这个血统中的厉害马吧！*/
	get Find_gemnew1():ILanguageElement{return this.getElement(1142)};
	/**廉价无好货！兄弟买马吗？我是一名寻马星探，慧眼识马多年，让我帮你找一匹合心意的马吧！*/
	get Find_talk1():ILanguageElement{return this.getElement(1143)};
	/**在这里，没有人比我更懂寻到好的马，不相信的话，就进来看看吧？*/
	get Find_talk2():ILanguageElement{return this.getElement(1144)};
	/**曾经的赛马明星霍利那匹常胜马，就是我帮忙找的，今天也让我为你找一匹好马吧！*/
	get Find_talk3():ILanguageElement{return this.getElement(1145)};
	/**最近来看赛马的游客好多，相信你也需要一匹好马来提高你马场的名声吧！*/
	get Find_talk4():ILanguageElement{return this.getElement(1146)};
	/**赛马场的售票员当然不是我的托，我卖好马人尽皆知，寻好马，就找我！*/
	get Find_talk5():ILanguageElement{return this.getElement(1147)};
	/**前几天没寻到我？嘻嘻，因为我遇到了我的初恋，不多说了！先看马吧， */
	get Find_talk6():ILanguageElement{return this.getElement(1148)};
	/**说起我的初恋，她像独角马一样优雅，唉！你怎么又来打听了，先看新马吧！*/
	get Find_talk7():ILanguageElement{return this.getElement(1149)};
	/**
想知道我和初恋的爱恨情仇？先买马，买了下次告诉你！*/
	get Find_talk8():ILanguageElement{return this.getElement(1150)};
	/**繁育的小马哪有我这的马好，路过不要错过，来看看新到的马匹吧！*/
	get Find_talk9():ILanguageElement{return this.getElement(1151)};
	/**上次为你找的马获得了不错的成绩吧？这次又来了一批更好的马，要来看看吗？*/
	get Find_talk10():ILanguageElement{return this.getElement(1152)};
	/**又弄到了珍稀的马，长得好看、赛场上也所向披靡，快来挑选吧！*/
	get Find_talk11():ILanguageElement{return this.getElement(1153)};
	/**话不多说，直接买马！*/
	get Find_talk12():ILanguageElement{return this.getElement(1154)};
	/**你的家园已经满了，确定要来买新马吗？家园里可放不下了！*/
	get Find_none1():ILanguageElement{return this.getElement(1155)};
	/**你好，年轻的帅哥，我是鲍比富翁，这里是为赛场马助力的地方，助力成功就能获得巨大收益！要了解更多吗？*/
	get Rich_talk1():ILanguageElement{return this.getElement(1156)};
	/**你看起来很贫穷，也许助力马能帮助你改变现在的生活，来看看吧！*/
	get Rich_talk2():ILanguageElement{return this.getElement(1157)};
	/**曾经我也是靠着助力马才赚了如今的财富，也许你也有机会像我一样成功，试试吗？*/
	get Rich_talk3():ILanguageElement{return this.getElement(1158)};
	/**识马的本领？我当然不会轻易教给别人，但你多来我这里参与助力，也许我会告诉你。*/
	get Rich_talk4():ILanguageElement{return this.getElement(1159)};
	/**看你今天面色红润，运气应该不会差，来助力一局吗？*/
	get Rich_talk5():ILanguageElement{return this.getElement(1160)};
	/**看你在门口徘徊好几次了，犹豫什么？你选中的马不会让你失望！*/
	get Rich_talk6():ILanguageElement{return this.getElement(1161)};
	/**慧眼识马的本领，需要多多实践！今天要助力参赛马吗？*/
	get Rich_talk7():ILanguageElement{return this.getElement(1162)};
	/**如果追求平稳，那注定与财富无缘，来这里助力，成为富翁不是梦！*/
	get Rich_talk8():ILanguageElement{return this.getElement(1163)};
	/**经营马场？哪有到这里成功助力赚得多，来试试吧！*/
	get Rich_talk9():ILanguageElement{return this.getElement(1164)};
	/**今天参赛的马都很厉害，可真难分出哪一只可以夺冠，你不来看看你的对手马吗？*/
	get Rich_talk10():ILanguageElement{return this.getElement(1165)};
	/**相信你现在识马本领已有长进了！期待你今天的助力选择！*/
	get Rich_talk11():ILanguageElement{return this.getElement(1166)};
	/**想摆脱贫穷？来助力，就有机会像我一样富裕！*/
	get Rich_talk12():ILanguageElement{return this.getElement(1167)};
	/**话不多说，直接助力！*/
	get Rich_talk13():ILanguageElement{return this.getElement(1168)};
	/**现在还没有新比赛，无法助力马，稍后再来吧！*/
	get Rich_none1():ILanguageElement{return this.getElement(1169)};
	/**马匹不够，可没办法繁育新小马哦，等准备好两匹都有生育力的成年马再来吧！*/
	get Breed_none1():ILanguageElement{return this.getElement(1170)};
	/**点击这里可以选择你想参与繁育的马。*/
	get Breed_introduce1():ILanguageElement{return this.getElement(1171)};
	/**选择一匹马吧！*/
	get Breed_introduce2():ILanguageElement{return this.getElement(1172)};
	/**再选择一匹马吧，两只马才可以繁育出小马哦！*/
	get Breed_introduce3():ILanguageElement{return this.getElement(1173)};
	/**点击这里开始繁育！繁育过程中可能会出现变异马，可能生出几只小马，敬请期待吧！*/
	get Breed_introduce4():ILanguageElement{return this.getElement(1174)};
	/**我是小岛的繁育员，也是你奶奶的好朋友，让我来帮你繁育一匹漂亮的小马吧！*/
	get Breed_talk1():ILanguageElement{return this.getElement(1175)};
	/**你奶奶的信里有提过我吗？算了，还是先看看你要繁育的马吧！*/
	get Breed_talk2():ILanguageElement{return this.getElement(1176)};
	/**繁育出的新马，会获得父母马的基因，所以要好好挑选父母马哦！*/
	get Breed_talk3():ILanguageElement{return this.getElement(1177)};
	/**听说你奶奶来了信，回信的时候可否替我问好？非常感谢你，这次我也会帮你好好繁育小马！*/
	get Breed_talk4():ILanguageElement{return this.getElement(1178)};
	/**你的家园如果装满了，记得放生一些马，他们会感激你的，让我看看你今天带来的繁育马吧！*/
	get Breed_talk5():ILanguageElement{return this.getElement(1179)};
	/**
你奶奶年轻的时候很漂亮呢~能和她做朋友真是我的荣幸，先繁育你的小马吧，下次再和你细聊！*/
	get Breed_talk6():ILanguageElement{return this.getElement(1180)};
	/**新小马可以拍张照片寄给你奶奶，她一定为你感到开心，快繁育吧！迫不及待想给新马拍照了！*/
	get Breed_talk7():ILanguageElement{return this.getElement(1181)};
	/**不知道你奶奶现在到了哪里？祝愿她一切顺利，让我看看你今天挑选的父母马吧？*/
	get Breed_talk8():ILanguageElement{return this.getElement(1182)};
	/**以前你奶奶总是把马照顾得很健康，期待你也能繁育出同样好的小马！*/
	get Breed_talk9():ILanguageElement{return this.getElement(1183)};
	/**买的马哪有繁育的马厉害，快繁育一只新的好马给那寻马星探瞧瞧！*/
	get Breed_talk10():ILanguageElement{return this.getElement(1184)};
	/**你奶奶繁育的小马总是很漂亮，希望你繁殖的新马也能这样！*/
	get Breed_talk11():ILanguageElement{return this.getElement(1185)};
	/**话不多说，直接繁育！*/
	get Breed_talk12():ILanguageElement{return this.getElement(1186)};
	/**新的小马出生了，走近看看！*/
	get Breed_get1():ILanguageElement{return this.getElement(1187)};
	/**求求你了~带我回家吧！*/
	get Breed_horse1():ILanguageElement{return this.getElement(1188)};
	/**我这么可爱，你带我回家吧！*/
	get Breed_horse2():ILanguageElement{return this.getElement(1189)};
	/**想和你生活在一起，带我一起回家好吗？*/
	get Breed_horse3():ILanguageElement{return this.getElement(1190)};
	/**主人你长得真帅！带我回家吧！*/
	get Breed_horse4():ILanguageElement{return this.getElement(1191)};
	/**你好，初次见面，我叫霍利，你有捡到新鲜的马粪吗？卖给我可以获得收益哦！*/
	get Shit_talk1():ILanguageElement{return this.getElement(1192)};
	/**觉得我面熟？哈哈哈那你一定认错人啦，先卖马粪吧！*/
	get Shit_talk2():ILanguageElement{return this.getElement(1193)};
	/**被你发现了？我确实是曾经的赛马明星，没想到年轻人也认识我，先做正事吧！*/
	get Shit_talk3():ILanguageElement{return this.getElement(1194)};
	/**这附近的马场，就属你卖马粪最勤奋！不枉我开在你家门口。*/
	get Shit_talk4():ILanguageElement{return this.getElement(1195)};
	/**曾经我带着马纵横赛场，那时候的确很风光，也许你也会有那样的时刻！先卖马粪吧！*/
	get Shit_talk5():ILanguageElement{return this.getElement(1196)};
	/**好好对待马，多去比赛，就是你获胜的秘诀！先卖马粪吧！*/
	get Shit_talk6():ILanguageElement{return this.getElement(1197)};
	/**又来卖粪啦？你家马儿拉屎能力真强！来看看今天能卖多少钱吧？*/
	get Shit_talk7():ILanguageElement{return this.getElement(1198)};
	/**收马粪有什么不好呢？我爱马的一切，先看看你收集的马粪吧！*/
	get Shit_talk8():ILanguageElement{return this.getElement(1199)};
	/**我的马儿确实是常胜冠军，但在拉屎这件事上，还是比不上你马场里的马！看看今天收集的马粪吧！*/
	get Shit_talk9():ILanguageElement{return this.getElement(1200)};
	/**如果我重入赛场，那可没有你得冠军的机会了，还是先看看你今天的卖粪收益吧！*/
	get Shit_talk10():ILanguageElement{return this.getElement(1201)};
	/**这里赛马场总是很热闹，坚持经营马场，你一定能获得意想不到的收获！比如......卖粪收益！*/
	get Shit_talk11():ILanguageElement{return this.getElement(1202)};
	/**话不多说，直接售卖！*/
	get Shit_talk12():ILanguageElement{return this.getElement(1203)};
	/**不接受闲聊，你还没有捡到马粪，先去捡了新马粪再来售卖吧！*/
	get Shit_none1():ILanguageElement{return this.getElement(1204)};
	/**你快去捡马粪吧！不想跟没马粪的人聊天！*/
	get Shit_none2():ILanguageElement{return this.getElement(1205)};
	/**你又没有新鲜马粪，再这样下去，我要搬到别的马场去了！*/
	get Shit_none3():ILanguageElement{return this.getElement(1206)};
	/**经常清理马粪才是好习惯，快去捡马粪吧！*/
	get Shit_none4():ILanguageElement{return this.getElement(1207)};
	/**音乐*/
	get Setting_ui_1():ILanguageElement{return this.getElement(1208)};
	/**音效*/
	get Setting_ui_2():ILanguageElement{return this.getElement(1209)};
	/**参赛倒计时*/
	get Basic_ui_1():ILanguageElement{return this.getElement(1210)};
	/**参与*/
	get Basic_ui_2():ILanguageElement{return this.getElement(1211)};
	/**寻马*/
	get Basic_ui_3():ILanguageElement{return this.getElement(1212)};
	/**家园*/
	get Basic_ui_4():ILanguageElement{return this.getElement(1213)};
	/**小镇*/
	get Basic_ui_5():ILanguageElement{return this.getElement(1214)};
	/**设置*/
	get Basic_ui_6():ILanguageElement{return this.getElement(1215)};
	/**助力*/
	get Basic_ui_7():ILanguageElement{return this.getElement(1216)};
	/**繁育*/
	get Basic_ui_8():ILanguageElement{return this.getElement(1217)};
	/**晴天*/
	get Weather_1():ILanguageElement{return this.getElement(1218)};
	/**雨天*/
	get Weather_2():ILanguageElement{return this.getElement(1219)};
	/**阴天*/
	get Weather_3():ILanguageElement{return this.getElement(1220)};
	/**雪天*/
	get Weather_4():ILanguageElement{return this.getElement(1221)};
	/**晴天下XXXXXXXXXX*/
	get Weather_des_1():ILanguageElement{return this.getElement(1222)};
	/**雨天下XXXXXXXXXX*/
	get Weather_des_2():ILanguageElement{return this.getElement(1223)};
	/**阴天下XXXXXXXXXX*/
	get Weather_des_3():ILanguageElement{return this.getElement(1224)};
	/**雪天下XXXXXXXXXX*/
	get Weather_des_4():ILanguageElement{return this.getElement(1225)};
	/**执着*/
	get Nature_1():ILanguageElement{return this.getElement(1226)};
	/**暴躁*/
	get Nature_2():ILanguageElement{return this.getElement(1227)};
	/**沉稳*/
	get Nature_3():ILanguageElement{return this.getElement(1228)};
	/**灵动*/
	get Nature_4():ILanguageElement{return this.getElement(1229)};
	/**内向*/
	get Nature_5():ILanguageElement{return this.getElement(1230)};
	/**自闭*/
	get Nature_6():ILanguageElement{return this.getElement(1231)};
	/**疯狂*/
	get Nature_7():ILanguageElement{return this.getElement(1232)};
	/**谦虚*/
	get Nature_8():ILanguageElement{return this.getElement(1233)};
	/**狡猾*/
	get Nature_9():ILanguageElement{return this.getElement(1234)};
	/**善良*/
	get Nature_10():ILanguageElement{return this.getElement(1235)};
	/**喜欢晴天*/
	get Hobby_des_1():ILanguageElement{return this.getElement(1236)};
	/**喜欢阴天*/
	get Hobby_des_2():ILanguageElement{return this.getElement(1237)};
	/**喜欢雨天*/
	get Hobby_des_3():ILanguageElement{return this.getElement(1238)};
	/**喜欢雪天*/
	get Hobby_des_4():ILanguageElement{return this.getElement(1239)};
	/**喜欢1号赛道*/
	get Hobby_des_5():ILanguageElement{return this.getElement(1240)};
	/**喜欢2号赛道*/
	get Hobby_des_6():ILanguageElement{return this.getElement(1241)};
	/**喜欢3号赛道*/
	get Hobby_des_7():ILanguageElement{return this.getElement(1242)};
	/**喜欢4号赛道*/
	get Hobby_des_8():ILanguageElement{return this.getElement(1243)};
	/**喜欢5号赛道*/
	get Hobby_des_9():ILanguageElement{return this.getElement(1244)};
	/**喜欢6号赛道*/
	get Hobby_des_10():ILanguageElement{return this.getElement(1245)};
	/**喜欢7号赛道*/
	get Hobby_des_11():ILanguageElement{return this.getElement(1246)};
	/**喜欢8号赛道*/
	get Hobby_des_12():ILanguageElement{return this.getElement(1247)};
	/**本土马*/
	get Lineage_1():ILanguageElement{return this.getElement(1248)};
	/**非主流马*/
	get Lineage_2():ILanguageElement{return this.getElement(1249)};
	/**独角马*/
	get Lineage_3():ILanguageElement{return this.getElement(1250)};
	/**特立独行马*/
	get Lineage_4():ILanguageElement{return this.getElement(1251)};
	/**艺术马*/
	get Lineage_5():ILanguageElement{return this.getElement(1252)};
	/**美食马*/
	get Lineage_6():ILanguageElement{return this.getElement(1253)};
	/**产自本土，强壮又精力旺盛的马*/
	get Lineage_des_1():ILanguageElement{return this.getElement(1254)};
	/**个性且冲刺速度更快的马*/
	get Lineage_des_2():ILanguageElement{return this.getElement(1255)};
	/**美丽且能力超群的特色马*/
	get Lineage_des_3():ILanguageElement{return this.getElement(1256)};
	/**性格特异的超高速马*/
	get Lineage_des_4():ILanguageElement{return this.getElement(1257)};
	/**热爱艺术和繁育的文艺马*/
	get Lineage_des_5():ILanguageElement{return this.getElement(1258)};
	/**饭量奇大且粪便量惊人的马*/
	get Lineage_des_6():ILanguageElement{return this.getElement(1259)};
	/**跟随*/
	get Follow():ILanguageElement{return this.getElement(1260)};
	/**投喂*/
	get Feed():ILanguageElement{return this.getElement(1261)};
	/**改*/
	get Modify_edit():ILanguageElement{return this.getElement(1262)};
	/**完成*/
	get Modify_complicate():ILanguageElement{return this.getElement(1263)};
	/**{0}号马赢得了比赛*/
	get Guessresult_1():ILanguageElement{return this.getElement(1264)};
	/**您助力的马都输掉了比赛*/
	get Guessresult_2():ILanguageElement{return this.getElement(1265)};
	/**您助力的马是{0}号马 */
	get Guessresult_3():ILanguageElement{return this.getElement(1266)};
	/**获得*/
	get Guessresult_4():ILanguageElement{return this.getElement(1267)};
	/**损失*/
	get Guessresult_5():ILanguageElement{return this.getElement(1268)};
	/**{0}了{1}钱*/
	get Guessresult_6():ILanguageElement{return this.getElement(1269)};
	/**是*/
	get Btn_yes():ILanguageElement{return this.getElement(1270)};
	/**否*/
	get Btn_no():ILanguageElement{return this.getElement(1271)};
	/**对话*/
	get Interactiveui_1():ILanguageElement{return this.getElement(1272)};
	/**比赛结束*/
	get Matchendui():ILanguageElement{return this.getElement(1273)};
	/**赛前准备*/
	get Matchreadyui_1():ILanguageElement{return this.getElement(1274)};
	/**本场比赛的天气是*/
	get Matchreadyui_2():ILanguageElement{return this.getElement(1275)};
	/**你的赛马在*/
	get Matchreadyui_3():ILanguageElement{return this.getElement(1276)};
	/**赛道*/
	get Matchreadyui_4():ILanguageElement{return this.getElement(1277)};
	/**倒计时*/
	get Uiqte_countdown():ILanguageElement{return this.getElement(1278)};
	/**连续点击按钮为你的马儿加油吧！！*/
	get Uiqte_tips_1():ILanguageElement{return this.getElement(1279)};
	/**点击次数越多，赛马跑的越快哦！！*/
	get Uiqte_tips_2():ILanguageElement{return this.getElement(1280)};
	/**欢呼时刻*/
	get Uiqte_cheer_tittle():ILanguageElement{return this.getElement(1281)};
	/**你的马不受影响*/
	get Uiqte_cheer_describe_1():ILanguageElement{return this.getElement(1282)};
	/**你的马受到了鼓励*/
	get Uiqte_cheer_describe_2():ILanguageElement{return this.getElement(1283)};
	/**你的马受到了极大鼓励*/
	get Uiqte_cheer_describe_3():ILanguageElement{return this.getElement(1284)};
	/**你的马受到了巨大鼓励*/
	get Uiqte_cheer_describe_4():ILanguageElement{return this.getElement(1285)};
	/**头名*/
	get Raceui_first():ILanguageElement{return this.getElement(1286)};
	/**次名*/
	get Raceui_second():ILanguageElement{return this.getElement(1287)};
	/**第三名*/
	get Raceui_third():ILanguageElement{return this.getElement(1288)};
	/**在后半程竟然*/
	get Skill_broadcast_1():ILanguageElement{return this.getElement(1289)};
	/**在落后时竟然*/
	get Skill_broadcast_2():ILanguageElement{return this.getElement(1290)};
	/**在被超过时竟然*/
	get Skill_broadcast_3():ILanguageElement{return this.getElement(1291)};
	/**在领先时竟然*/
	get Skill_broadcast_4():ILanguageElement{return this.getElement(1292)};
	/**在超过对手时竟然*/
	get Skill_broadcast_5():ILanguageElement{return this.getElement(1293)};
	/**在比赛中竟然*/
	get Skill_broadcast_6():ILanguageElement{return this.getElement(1294)};
	/**跳起野性的毛利战舞！*/
	get Behavior_brocasttwo_1():ILanguageElement{return this.getElement(1295)};
	/**变身小马牌吹风机！*/
	get Behavior_brocasttwo_2():ILanguageElement{return this.getElement(1296)};
	/**发动野蛮又疯狂的伸缩！*/
	get Behavior_brocasttwo_3():ILanguageElement{return this.getElement(1297)};
	/**跳起优雅的小步芭蕾！*/
	get Behavior_brocasttwo_4():ILanguageElement{return this.getElement(1298)};
	/**变身车轮滚滚的轮胎马！*/
	get Behavior_brocasttwo_5():ILanguageElement{return this.getElement(1299)};
	/**跳起魔性的交叉小步舞！*/
	get Behavior_brocasttwo_6():ILanguageElement{return this.getElement(1300)};
	/**开始模仿超人的飞行动作并真的起飞！*/
	get Behavior_brocasttwo_7():ILanguageElement{return this.getElement(1301)};
	/**脖子开始疯狂甩动！*/
	get Behavior_brocasttwo_8():ILanguageElement{return this.getElement(1302)};
	/**脖子开始急速伸缩！*/
	get Behavior_brocasttwo_9():ILanguageElement{return this.getElement(1303)};
	/**直接变身马型陀螺转转转！*/
	get Behavior_brocasttwo_10():ILanguageElement{return this.getElement(1304)};
	/**变身马型高速直升机！*/
	get Behavior_brocasttwo_11():ILanguageElement{return this.getElement(1305)};
	/**直接以头抢地！*/
	get Behavior_brocasttwo_12():ILanguageElement{return this.getElement(1306)};
	/**开始急刹刹刹刹车！*/
	get Behavior_brocasttwo_13():ILanguageElement{return this.getElement(1307)};
	/**因此让*/
	get Behavior_brocastthird():ILanguageElement{return this.getElement(1308)};
	/**跑得更快了！*/
	get Behavior_brocastfourth_1():ILanguageElement{return this.getElement(1309)};
	/**跑得变慢了！*/
	get Behavior_brocastfourth_2():ILanguageElement{return this.getElement(1310)};
	/**直接摆烂了！*/
	get Behavior_brocastfourth_3():ILanguageElement{return this.getElement(1311)};
	/**开始倒着跑了？！*/
	get Behavior_brocastfourth_4():ILanguageElement{return this.getElement(1312)};
	/**提前出发了！*/
	get Behavior_brocastfourth_5():ILanguageElement{return this.getElement(1313)};
	/**越跑越快了！*/
	get Behavior_brocastfourth_6():ILanguageElement{return this.getElement(1314)};
	/**越跑越慢了！*/
	get Behavior_brocastfourth_7():ILanguageElement{return this.getElement(1315)};
	/**原地自嗨了？！*/
	get Behavior_brocastfourth_8():ILanguageElement{return this.getElement(1316)};
	/**马粪收益*/
	get Reward_1():ILanguageElement{return this.getElement(1317)};
	/**您没有收集的马粪！！！*/
	get Reward_2():ILanguageElement{return this.getElement(1318)};
	/**您一共拾取了*/
	get Reward_3():ILanguageElement{return this.getElement(1319)};
	/**大马粪{0}坨*/
	get Reward_4():ILanguageElement{return this.getElement(1320)};
	/**小马粪{0}坨*/
	get Reward_5():ILanguageElement{return this.getElement(1321)};
	/**总收益：{0}*/
	get Reward_6():ILanguageElement{return this.getElement(1322)};
	/**关闭*/
	get Reward_7():ILanguageElement{return this.getElement(1323)};
	/**比赛结果*/
	get Settlementui_title():ILanguageElement{return this.getElement(1324)};
	/**名次*/
	get Settlementui_rank():ILanguageElement{return this.getElement(1325)};
	/**赛马名称*/
	get Settlementui_name():ILanguageElement{return this.getElement(1326)};
	/**时间(秒)*/
	get Settlementui_time():ILanguageElement{return this.getElement(1327)};
	/**奖金*/
	get Settlementui_money():ILanguageElement{return this.getElement(1328)};
	/**助力金额*/
	get Settlementui_betmoney():ILanguageElement{return this.getElement(1329)};
	/**时长奖励*/
	get Settlementui_betpeople():ILanguageElement{return this.getElement(1330)};
	/**下一步*/
	get Settlementui_next():ILanguageElement{return this.getElement(1331)};
	/**点击马匹查看*/
	get Shopinnerui_look():ILanguageElement{return this.getElement(1332)};
	/**牵走*/
	get Shopinnerui_take():ILanguageElement{return this.getElement(1333)};
	/**选择*/
	get Shopinnerui_select():ILanguageElement{return this.getElement(1334)};
	/**上一匹*/
	get Shopinnerui_last():ILanguageElement{return this.getElement(1335)};
	/**下一匹*/
	get Shopinnerui_next():ILanguageElement{return this.getElement(1336)};
	/**返回*/
	get Shopinnerui_return():ILanguageElement{return this.getElement(1337)};
	/**我再看看*/
	get Shopui_look():ILanguageElement{return this.getElement(1338)};
	/**就它了！*/
	get Shopui_makeit():ILanguageElement{return this.getElement(1339)};
	/**夜幕降临*/
	get Weatherui_tips():ILanguageElement{return this.getElement(1340)};
	/**清晨*/
	get Weatherui_moring():ILanguageElement{return this.getElement(1341)};
	/**公元{0}年{1}月{2}日*/
	get Time_data():ILanguageElement{return this.getElement(1342)};
	/**雪蝶 */
	get Lastname_1():ILanguageElement{return this.getElement(1343)};
	/**枫以*/
	get Lastname_2():ILanguageElement{return this.getElement(1344)};
	/**浮临*/
	get Lastname_3():ILanguageElement{return this.getElement(1345)};
	/**浅浅*/
	get Lastname_4():ILanguageElement{return this.getElement(1346)};
	/**茶挽*/
	get Lastname_5():ILanguageElement{return this.getElement(1347)};
	/**盼兮*/
	get Lastname_6():ILanguageElement{return this.getElement(1348)};
	/**春日*/
	get Lastname_7():ILanguageElement{return this.getElement(1349)};
	/**瑾沫*/
	get Lastname_8():ILanguageElement{return this.getElement(1350)};
	/**流年*/
	get Lastname_9():ILanguageElement{return this.getElement(1351)};
	/**风铃*/
	get Lastname_10():ILanguageElement{return this.getElement(1352)};
	/**桃花*/
	get Lastname_11():ILanguageElement{return this.getElement(1353)};
	/**满栀*/
	get Lastname_12():ILanguageElement{return this.getElement(1354)};
	/**风行*/
	get Lastname_13():ILanguageElement{return this.getElement(1355)};
	/**月霜*/
	get Lastname_14():ILanguageElement{return this.getElement(1356)};
	/**花辞*/
	get Lastname_15():ILanguageElement{return this.getElement(1357)};
	/**一梦*/
	get Lastname_16():ILanguageElement{return this.getElement(1358)};
	/**念河*/
	get Lastname_17():ILanguageElement{return this.getElement(1359)};
	/**若怜*/
	get Lastname_18():ILanguageElement{return this.getElement(1360)};
	/**伊意*/
	get Lastname_19():ILanguageElement{return this.getElement(1361)};
	/**幽离*/
	get Lastname_20():ILanguageElement{return this.getElement(1362)};
	/**冬瑾*/
	get Lastname_21():ILanguageElement{return this.getElement(1363)};
	/**弥枳*/
	get Lastname_22():ILanguageElement{return this.getElement(1364)};
	/**南故*/
	get Lastname_23():ILanguageElement{return this.getElement(1365)};
	/**夏凉*/
	get Lastname_24():ILanguageElement{return this.getElement(1366)};
	/**浮生*/
	get Lastname_25():ILanguageElement{return this.getElement(1367)};
	/**浅墨*/
	get Lastname_26():ILanguageElement{return this.getElement(1368)};
	/**野稚*/
	get Lastname_27():ILanguageElement{return this.getElement(1369)};
	/**夏迟*/
	get Lastname_28():ILanguageElement{return this.getElement(1370)};
	/**志恒*/
	get Lastname_29():ILanguageElement{return this.getElement(1371)};
	/**旻宇*/
	get Lastname_30():ILanguageElement{return this.getElement(1372)};
	/**昱辰*/
	get Lastname_31():ILanguageElement{return this.getElement(1373)};
	/**轶凡*/
	get Lastname_32():ILanguageElement{return this.getElement(1374)};
	/**雨诗*/
	get Lastname_33():ILanguageElement{return this.getElement(1375)};
	/**西钥*/
	get Firstname_1():ILanguageElement{return this.getElement(1376)};
	/**拓拔*/
	get Firstname_2():ILanguageElement{return this.getElement(1377)};
	/**汝嫣*/
	get Firstname_3():ILanguageElement{return this.getElement(1378)};
	/**容成*/
	get Firstname_4():ILanguageElement{return this.getElement(1379)};
	/**九方*/
	get Firstname_5():ILanguageElement{return this.getElement(1380)};
	/**尔朱*/
	get Firstname_6():ILanguageElement{return this.getElement(1381)};
	/**安岭*/
	get Firstname_7():ILanguageElement{return this.getElement(1382)};
	/**仲长*/
	get Firstname_8():ILanguageElement{return this.getElement(1383)};
	/**东里*/
	get Firstname_9():ILanguageElement{return this.getElement(1384)};
	/**呼延*/
	get Firstname_10():ILanguageElement{return this.getElement(1385)};
	/**百里*/
	get Firstname_11():ILanguageElement{return this.getElement(1386)};
	/**宇文*/
	get Firstname_12():ILanguageElement{return this.getElement(1387)};
	/**司空*/
	get Firstname_13():ILanguageElement{return this.getElement(1388)};
	/**钟离 */
	get Firstname_14():ILanguageElement{return this.getElement(1389)};
	/**上官*/
	get Firstname_15():ILanguageElement{return this.getElement(1390)};
	/**端木*/
	get Firstname_16():ILanguageElement{return this.getElement(1391)};
	/**欧阳*/
	get Firstname_17():ILanguageElement{return this.getElement(1392)};
	/**司马*/
	get Firstname_18():ILanguageElement{return this.getElement(1393)};
	/**独孤*/
	get Firstname_19():ILanguageElement{return this.getElement(1394)};
	/**慕容*/
	get Firstname_20():ILanguageElement{return this.getElement(1395)};
	/**公孙*/
	get Firstname_21():ILanguageElement{return this.getElement(1396)};
	/**皇甫*/
	get Firstname_22():ILanguageElement{return this.getElement(1397)};
	/**尉迟*/
	get Firstname_23():ILanguageElement{return this.getElement(1398)};
	/**夏侯*/
	get Firstname_24():ILanguageElement{return this.getElement(1399)};
	/**公主*/
	get Firstname_25():ILanguageElement{return this.getElement(1400)};
	/**南宫*/
	get Firstname_26():ILanguageElement{return this.getElement(1401)};
	/**东方*/
	get Firstname_27():ILanguageElement{return this.getElement(1402)};
	/**罗*/
	get Firstname_28():ILanguageElement{return this.getElement(1403)};
	/**刘*/
	get Firstname_29():ILanguageElement{return this.getElement(1404)};
	/**江*/
	get Firstname_30():ILanguageElement{return this.getElement(1405)};
	/**崔*/
	get Firstname_31():ILanguageElement{return this.getElement(1406)};
	/**孔*/
	get Firstname_32():ILanguageElement{return this.getElement(1407)};
	/**芜湖！起飞！*/
	get Horsetalk_1():ILanguageElement{return this.getElement(1408)};
	/**感觉马腿被黏住了！*/
	get Horsetalk_2():ILanguageElement{return this.getElement(1409)};
	/**我要回家！让我回家！*/
	get Horsetalk_3():ILanguageElement{return this.getElement(1410)};
	/**好累啊！不跑了！我要睡觉！*/
	get Horsetalk_4():ILanguageElement{return this.getElement(1411)};
	/**嘿嘿嘿溜了溜了！*/
	get Horsetalk_5():ILanguageElement{return this.getElement(1412)};
	/**哈哈哈哈嘎嘎嘎嘎嘿嘿嘿今天天气真好!*/
	get Horsetalk_6():ILanguageElement{return this.getElement(1413)};
	/**今天天气不错*/
	get Horsetalk_7():ILanguageElement{return this.getElement(1414)};
	/**好累啊，能不能放我回家园？*/
	get Horsetalk_8():ILanguageElement{return this.getElement(1415)};
	/**可恶！今天的胡萝卜好像不太新鲜！小马只成长了一点！*/
	get Horsetalk_9():ILanguageElement{return this.getElement(1416)};
	/**今天的小马看起来忧心忡忡，不是很想吃胡萝卜。*/
	get Horsetalk_10():ILanguageElement{return this.getElement(1417)};
	/**小马不想吃胡萝卜并且朝你吐了口水！*/
	get Horsetalk_11():ILanguageElement{return this.getElement(1418)};
	/**小马啃了几口胡萝卜，成长值增加了！*/
	get Horsetalk_12():ILanguageElement{return this.getElement(1419)};
	/**小马非常感谢你喂它吃胡萝卜，并且舔了舔你的手。*/
	get Horsetalk_13():ILanguageElement{return this.getElement(1420)};
	/**小马吃掉你的投喂的胡萝卜，成长值增加了！*/
	get Horsetalk_14():ILanguageElement{return this.getElement(1421)};
	/**今天的胡萝卜很优质，小马的成长值有了明显提升！*/
	get Horsetalk_15():ILanguageElement{return this.getElement(1422)};
	/**小马今天胃口很好，成长值有了明显提升！*/
	get Horsetalk_16():ILanguageElement{return this.getElement(1423)};
	/**小马很喜欢你投喂的胡萝卜，成长值有了显著提升！*/
	get Horsetalk_17():ILanguageElement{return this.getElement(1424)};
	/**今天的胡萝卜很优质，小马的成长值有了明显提升！*/
	get Horsetalk_18():ILanguageElement{return this.getElement(1425)};
	/**小马超级喜欢你投喂的胡萝卜，高兴的上蹿下跳！成长值有了巨大提升！*/
	get Horsetalk_19():ILanguageElement{return this.getElement(1426)};
	/**竟然买到了黄金胡萝卜！小马吃了获得了极大成长！*/
	get Horsetalk_20():ILanguageElement{return this.getElement(1427)};
	/**这匹小马竟然是个大胃王，它把胡萝卜全部吃完了！成长值获得了极大提升！*/
	get Horsetalk_21():ILanguageElement{return this.getElement(1428)};
	/**是否花费{0}金币购买饲料投喂小马*/
	get GrowUI_Talk1():ILanguageElement{return this.getElement(1429)};
	/**是否放生这匹马？*/
	get GrowUI_Talk2():ILanguageElement{return this.getElement(1430)};
	/**恭喜你的小马变成大马了*/
	get GrowUI_Talk3():ILanguageElement{return this.getElement(1431)};
	/**放弃跟随*/
	get UnFollow():ILanguageElement{return this.getElement(1432)};
	/**助力结果*/
	get GuessResult_Title():ILanguageElement{return this.getElement(1433)};
	/**让它比赛*/
	get HorseTakeIn():ILanguageElement{return this.getElement(1434)};
	/**喂养*/
	get HorseBagFeed():ILanguageElement{return this.getElement(1435)};
	/**放回家园*/
	get HorseBagBack():ILanguageElement{return this.getElement(1436)};
	/**现在还不是报名时间，报名时间再来吧*/
	get Interactive_Talk1():ILanguageElement{return this.getElement(1437)};
	/**要将这匹小马放入家园吗？*/
	get Interactive_Talk2():ILanguageElement{return this.getElement(1438)};
	/**你还有小马没有放入家园，要开始新的繁育？*/
	get Interactive_Talk3():ILanguageElement{return this.getElement(1439)};
	/**退出后将放弃这些马，确认退出？*/
	get Interactive_Talk4():ILanguageElement{return this.getElement(1440)};
	/**完赛*/
	get RankItem_1():ILanguageElement{return this.getElement(1441)};
	/**摆烂*/
	get RankItem_2():ILanguageElement{return this.getElement(1442)};
	/**卖出*/
	get Sellout():ILanguageElement{return this.getElement(1443)};
	/**我找到了！三匹靓马！*/
	get Shopinnerui_Title():ILanguageElement{return this.getElement(1444)};
	/**价钱*/
	get Shopinnerui_Price():ILanguageElement{return this.getElement(1445)};
	/**血统价格*/
	get ShopUI_Price():ILanguageElement{return this.getElement(1446)};
	/**放弃比赛*/
	get GiveUp():ILanguageElement{return this.getElement(1447)};
	/**{0}，也许会让你成为常胜将军！是否需要花费{1}让我为你找这种血统的马？*/
	get ShopUI_Des():ILanguageElement{return this.getElement(1448)};
	/**第{0}匹小马出生了*/
	get BreedMgr_talk_1():ILanguageElement{return this.getElement(1449)};
	/**它的{0}部位，产生了基因突变！！*/
	get BreedMgr_talk_2():ILanguageElement{return this.getElement(1450)};
	/**不在报名时间*/
	get ErrorCode_1():ILanguageElement{return this.getElement(1451)};
	/**已经报名成功了*/
	get ErrorCode_2():ILanguageElement{return this.getElement(1452)};
	/**当前不能放弃*/
	get ErrorCode_3():ILanguageElement{return this.getElement(1453)};
	/**还没有报名,放弃报名失败*/
	get ErrorCode_4():ILanguageElement{return this.getElement(1454)};
	/**您的家园已经满了，请先放生一些马*/
	get ErrorCode_5():ILanguageElement{return this.getElement(1455)};
	/**你还没有出战的马*/
	get ErrorCode_6():ILanguageElement{return this.getElement(1456)};
	/**你的伙伴马没有精力了，无法报名！*/
	get ErrorCode_7():ILanguageElement{return this.getElement(1457)};
	/**等等！它好像不太对劲！*/
	get ErrorCode_8():ILanguageElement{return this.getElement(1458)};
	/**请先选择两匹马*/
	get ErrorCode_9():ILanguageElement{return this.getElement(1459)};
	/**还没有成年马匹,请前往商店购买*/
	get ErrorCode_10():ILanguageElement{return this.getElement(1460)};
	/**马匹出战成功!!!!*/
	get ErrorCode_11():ILanguageElement{return this.getElement(1461)};
	/**开始报名了*/
	get ErrorCode_12():ILanguageElement{return this.getElement(1462)};
	/**开始助力小马啦！*/
	get ErrorCode_13():ILanguageElement{return this.getElement(1463)};
	/**报名成功*/
	get ErrorCode_14():ILanguageElement{return this.getElement(1464)};
	/**放弃成功*/
	get ErrorCode_15():ILanguageElement{return this.getElement(1465)};
	/**你没有成年马*/
	get ErrorCode_16():ILanguageElement{return this.getElement(1466)};
	/**你的金币不够！！！*/
	get ErrorCode_17():ILanguageElement{return this.getElement(1467)};
	/**小马吃饱啦！*/
	get ErrorCode_18():ILanguageElement{return this.getElement(1468)};
	/**改名成功！！！*/
	get ErrorCode_19():ILanguageElement{return this.getElement(1469)};
	/**您的马已达到最大拥有值*/
	get ErrorCode_20():ILanguageElement{return this.getElement(1470)};
	/**购买成功!!!*/
	get ErrorCode_21():ILanguageElement{return this.getElement(1471)};
	/**没有啦！*/
	get ErrorCode_22():ILanguageElement{return this.getElement(1472)};
	/**请选择一个血统*/
	get ErrorCode_23():ILanguageElement{return this.getElement(1473)};
	/**未找到相应的马匹*/
	get ErrorCode_24():ILanguageElement{return this.getElement(1474)};
	/**请选择一匹大马跟随，才能参赛*/
	get ErrorCode_25():ILanguageElement{return this.getElement(1475)};
	/**开始*/
	get MatchCdui_Start():ILanguageElement{return this.getElement(1476)};
	/**胜率*/
	get Win_Rate():ILanguageElement{return this.getElement(1477)};
	/**我不想卖！*/
	get RewardUI_DontBuy():ILanguageElement{return this.getElement(1478)};
	/**我不买了！*/
	get ShopUI_SellNo():ILanguageElement{return this.getElement(1479)};
	/**最大速度*/
	get Var_MaxSpeed():ILanguageElement{return this.getElement(1480)};
	/**起跑速度*/
	get Var_StartSpeed():ILanguageElement{return this.getElement(1481)};
	/**排便量*/
	get Var_Defect():ILanguageElement{return this.getElement(1482)};
	/**加速度*/
	get Var_Acc():ILanguageElement{return this.getElement(1483)};
	/**精力值*/
	get Var_Energy():ILanguageElement{return this.getElement(1484)};
	/**生育*/
	get Var_Bear():ILanguageElement{return this.getElement(1485)};
	/**休赛中*/
	get Race_Wait():ILanguageElement{return this.getElement(1486)};
	/**速度*/
	get Raceui_speed():ILanguageElement{return this.getElement(1487)};
	/**你的成年马数量不足*/
	get BreedUI_MatureHorseShort():ILanguageElement{return this.getElement(1488)};
	/**你的可生育的成年马大于等于两只*/
	get BreedUI_CanBreed():ILanguageElement{return this.getElement(1489)};
	/**你的可生育的成年马小于两只*/
	get BreedUI_CannotBreed():ILanguageElement{return this.getElement(1490)};
	/**捡到{0}坨粪便*/
	get FectchFit():ILanguageElement{return this.getElement(1491)};
	/**不可繁育*/
	get CanNotBreed():ILanguageElement{return this.getElement(1492)};
	/**现在是比赛报名时间！*/
	get BasicUI_SignTime():ILanguageElement{return this.getElement(1493)};
	/**去报名*/
	get BasicUI_GoSign():ILanguageElement{return this.getElement(1494)};
	/**赛马比赛就要正式开始！快来助力小马吧！*/
	get BasicUI_BetTime():ILanguageElement{return this.getElement(1495)};
	/**去助力*/
	get BasicUI_GoBet():ILanguageElement{return this.getElement(1496)};
	/**比赛正在激烈进行中，快去观赛吧！*/
	get BasicUI_WatchTime():ILanguageElement{return this.getElement(1497)};
	/**观赛*/
	get BasicUI_GoWatch():ILanguageElement{return this.getElement(1498)};
	/**助力成功*/
	get GuessUI_BetSuccess():ILanguageElement{return this.getElement(1499)};
	/**离开赛场*/
	get RaceUI_LeaveRace():ILanguageElement{return this.getElement(1500)};
	/**是否退出赛场？*/
	get RaceUI_LeaveRaceConfirm():ILanguageElement{return this.getElement(1501)};
	/**比赛中*/
	get BasicUI_InRace():ILanguageElement{return this.getElement(1502)};
	/**距离下次小马进食还有：{0}min{1}s*/
	get GrowUI_Feed_Info():ILanguageElement{return this.getElement(1503)};
	/**的坐骑*/
	get Brocast_1():ILanguageElement{return this.getElement(1504)};
	/**其他人*/
	get Brocast_2():ILanguageElement{return this.getElement(1505)};
	/**所有人*/
	get Brocast_3():ILanguageElement{return this.getElement(1506)};
	/**自己*/
	get Brocast_4():ILanguageElement{return this.getElement(1507)};
	/**小马岛*/
	get TransformUI_Hall():ILanguageElement{return this.getElement(1508)};
	/**小镇*/
	get TransformUI_Bussiness():ILanguageElement{return this.getElement(1509)};
	/**家园*/
	get TransformUI_Stable():ILanguageElement{return this.getElement(1510)};
	/**牧场*/
	get TransformUI_Breed():ILanguageElement{return this.getElement(1511)};
	/**买马集市*/
	get TransformUI_Shop():ILanguageElement{return this.getElement(1512)};
	/**赛场助力屋*/
	get TransformUI_Bet():ILanguageElement{return this.getElement(1513)};
	/**报名参赛*/
	get TransformUI_Sign():ILanguageElement{return this.getElement(1514)};
	/**解锁*/
	get ShopUI_Unlock():ILanguageElement{return this.getElement(1515)};
	/**这是你的最后一匹马，请不要放生*/
	get HasNoHorse():ILanguageElement{return this.getElement(1516)};
	/**你关注的比赛快要开始了，等比赛结束再来吧*/
	get Concern_1():ILanguageElement{return this.getElement(1517)};
	/**解锁失败*/
	get UnlockDefeat():ILanguageElement{return this.getElement(1518)};
	/**捡到{0}颗钻石*/
	get FectchDiamond():ILanguageElement{return this.getElement(1519)};
	/**钻石奖励*/
	get DiamondReward():ILanguageElement{return this.getElement(1520)};
	/**金币奖励*/
	get GoldReward():ILanguageElement{return this.getElement(1521)};
	/**你的马超越了{0}！ */
	get Barrage_Beyond():ILanguageElement{return this.getElement(1522)};
	/**你的马被{0} 超越了！ */
	get Barrage_Backward():ILanguageElement{return this.getElement(1523)};
	/**马场的小芳真美，想和它做朋友！*/
	get Horsetalk_22():ILanguageElement{return this.getElement(1524)};
	/**好无聊啊，好想去比赛！*/
	get Horsetalk_23():ILanguageElement{return this.getElement(1525)};
	/**隔壁的马拉屎好臭！投诉投诉！*/
	get Horsetalk_24():ILanguageElement{return this.getElement(1526)};
	/**不喜欢今天的食物！主人不懂我！*/
	get Horsetalk_25():ILanguageElement{return this.getElement(1527)};
	/**今天的天气真好啊！*/
	get Horsetalk_26():ILanguageElement{return this.getElement(1528)};
	/**下雪的话，就可以吃棉花糖了！*/
	get Horsetalk_27():ILanguageElement{return this.getElement(1529)};
	/**我跟你讲一个八卦......*/
	get Horsetalk_28():ILanguageElement{return this.getElement(1530)};
	/**主人总捡马粪，他不会偷偷吃掉吧！*/
	get Horsetalk_29():ILanguageElement{return this.getElement(1531)};
	/**新来的马要是住我旁边就好了！*/
	get Horsetalk_30():ILanguageElement{return this.getElement(1532)};
	/**旁边那只马一直在乱叫，好吵啊！*/
	get Horsetalk_31():ILanguageElement{return this.getElement(1533)};
	/**今天心情真好！*/
	get Horsetalk_32():ILanguageElement{return this.getElement(1534)};
	/**今天的食物很美味！*/
	get Horsetalk_33():ILanguageElement{return this.getElement(1535)};
	/**终于可以出来玩咯！*/
	get Horsetalk_34():ILanguageElement{return this.getElement(1536)};
	/**不知道主人会带我去哪玩！好期待！*/
	get Horsetalk_35():ILanguageElement{return this.getElement(1537)};
	/**主人老是跟别人说话，都不理我！*/
	get Horsetalk_36():ILanguageElement{return this.getElement(1538)};
	/**外面的世界好新奇啊！*/
	get Horsetalk_37():ILanguageElement{return this.getElement(1539)};
	/**空气真好，新鲜多了！*/
	get Horsetalk_38():ILanguageElement{return this.getElement(1540)};
	/**今天天气不错，适合出门玩！*/
	get Horsetalk_39():ILanguageElement{return this.getElement(1541)};
	/**好想去看看赛马现场！*/
	get Horsetalk_40():ILanguageElement{return this.getElement(1542)};
	/**听说赛场来了厉害的马，好想看！*/
	get Horsetalk_41():ILanguageElement{return this.getElement(1543)};
	/**好累啊，好想回家！*/
	get Horsetalk_42():ILanguageElement{return this.getElement(1544)};
	/**主人怎么不给我买好吃的！*/
	get Horsetalk_43():ILanguageElement{return this.getElement(1545)};
	/**听说小镇上有很多美食！好想吃！*/
	get Horsetalk_44():ILanguageElement{return this.getElement(1546)};
	/**等会回去又可以给同伴讲故事了！*/
	get Horsetalk_45():ILanguageElement{return this.getElement(1547)};
	/**乔治叔叔*/
	get Npc_name1():ILanguageElement{return this.getElement(1548)};
	/**汤姆*/
	get Npc_name2():ILanguageElement{return this.getElement(1549)};
	/**鲍比富翁*/
	get Npc_name3():ILanguageElement{return this.getElement(1550)};
	/**亨利*/
	get Npc_name4():ILanguageElement{return this.getElement(1551)};
	/**霍利*/
	get Npc_name5():ILanguageElement{return this.getElement(1552)};
	/**渔民*/
	get Npc_name6():ILanguageElement{return this.getElement(1553)};
	/**前往家园*/
	get Npc_station1():ILanguageElement{return this.getElement(1554)};
	/**前往小镇*/
	get Npc_station2():ILanguageElement{return this.getElement(1555)};
	/**购买马匹*/
	get Npc_station3():ILanguageElement{return this.getElement(1556)};
	/**助力赛马*/
	get Npc_station4():ILanguageElement{return this.getElement(1557)};
	/**参赛报名*/
	get Npc_station5():ILanguageElement{return this.getElement(1558)};
	/**繁育牧场*/
	get Npc_station6():ILanguageElement{return this.getElement(1559)};
	/**马粪出售点*/
	get Npc_station7():ILanguageElement{return this.getElement(1560)};
	/**前往繁育场*/
	get Npc_station8():ILanguageElement{return this.getElement(1561)};
	/**免费*/
	get No_Pay():ILanguageElement{return this.getElement(1562)};
	/**你还没有带出战的伙伴马，不能参赛哦！*/
	get Uncle_tip1():ILanguageElement{return this.getElement(1563)};
	/**快去带你的伙伴马，才可以参赛哦！*/
	get Uncle_tip2():ILanguageElement{return this.getElement(1564)};
	/**你没带马儿，可不能参赛！*/
	get Uncle_tip3():ILanguageElement{return this.getElement(1565)};
	/**比赛*/
	get Competition():ILanguageElement{return this.getElement(1566)};
	/**我直接开冲！*/
	get Horsetalk_46():ILanguageElement{return this.getElement(1567)};
	/**好恐怖啊我要回家！*/
	get Horsetalk_47():ILanguageElement{return this.getElement(1568)};
	/**我要飞得更高！*/
	get Horsetalk_48():ILanguageElement{return this.getElement(1569)};
	/**怎么会选到我了！*/
	get Horsetalk_49():ILanguageElement{return this.getElement(1570)};
	/**时间暂停了！*/
	get Horsetalk_50():ILanguageElement{return this.getElement(1571)};
	/**呜呜呜我要回家！*/
	get Horsetalk_51():ILanguageElement{return this.getElement(1572)};
	/**再也不想比赛了！*/
	get Horsetalk_52():ILanguageElement{return this.getElement(1573)};
	/**马腿好黏！*/
	get Horsetalk_53():ILanguageElement{return this.getElement(1574)};
	/**原地打瞌睡！*/
	get Horsetalk_54():ILanguageElement{return this.getElement(1575)};
	/**感觉腿一点都不软了！*/
	get Horsetalk_55():ILanguageElement{return this.getElement(1576)};
	/**车轮滚滚：速度极大提升！*/
	get Skill_1():ILanguageElement{return this.getElement(1577)};
	/**狂野伸缩：其他马都吓到后退！*/
	get Skill_2():ILanguageElement{return this.getElement(1578)};
	/**天马行空：速度极大提升！*/
	get Skill_3():ILanguageElement{return this.getElement(1579)};
	/**巨型马头水母：随机选择一匹马倒着跑！*/
	get Skill_4():ILanguageElement{return this.getElement(1580)};
	/**巨型弹力马头：全体停下！*/
	get Skill_5():ILanguageElement{return this.getElement(1581)};
	/**小马战机：其他马都往家里跑！*/
	get Skill_6():ILanguageElement{return this.getElement(1582)};
	/**头脑飞旋：随机挑选一匹马回家！*/
	get Skill_7():ILanguageElement{return this.getElement(1583)};
	/**马屁股陀螺：全体马都减速！*/
	get Skill_8():ILanguageElement{return this.getElement(1584)};
	/**颠头舞：随机挑选一匹马摆烂！*/
	get Skill_9():ILanguageElement{return this.getElement(1585)};
	/**小马战舞：大家都加速！*/
	get Skill_10():ILanguageElement{return this.getElement(1586)};
	/**转动摇杆控制移动*/
	get Newguide_1():ILanguageElement{return this.getElement(1587)};
	/**滑动屏幕控制视角 */
	get Newguide_2():ILanguageElement{return this.getElement(1588)};
	/**精力恢复时间*/
	get Energy_1():ILanguageElement{return this.getElement(1589)};
	/**选择种马*/
	get StudSelection():ILanguageElement{return this.getElement(1590)};
	/**抚摸*/
	get Touch():ILanguageElement{return this.getElement(1591)};
	/**剩余时间：*/
	get Remainingtime():ILanguageElement{return this.getElement(1592)};
	/**头*/
	get Head ():ILanguageElement{return this.getElement(1593)};
	/**脖子*/
	get Neck():ILanguageElement{return this.getElement(1594)};
	/**身体*/
	get Body():ILanguageElement{return this.getElement(1595)};
	/**尾巴*/
	get Tail():ILanguageElement{return this.getElement(1596)};
	/**大腿*/
	get Leg():ILanguageElement{return this.getElement(1597)};
	/**小腿*/
	get Shank():ILanguageElement{return this.getElement(1598)};
	/**跟随不能喂养小马*/
	get FollowFeed ():ILanguageElement{return this.getElement(1599)};
	/**号*/
	get Number():ILanguageElement{return this.getElement(1600)};

}