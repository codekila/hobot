/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

module.exports = {
    userDb: {
        "users": [
                {
                    "userId": "Uc173149caaa1f02eb263e113fe154fd0",
                    "nickNames": [
                        "爸爸", "Daddy", "阿爹", "James"
                    ],
                    "gender": "male",
                    "birthday": "1972-06-26",
                    "location": {
                        "timezone": "Asia/Taipei",
                        "place": "Taiwan 新竹縣竹北市興隆路一段"
                    },
                    "contacts": {
                        "phone": "+886988227881",
                        "email": "jamesho86@gmail.com"
                    },
                    "hobbies": [
                        "釣魚"
                    ]
                },
                {
                    "userId": "Ua686b3b6f5a0fefb00f7897cef7a58c8",
                    "nickNames": [
                        "媽媽", "Mom", "媽咪", "綸綸"
                    ],
                    "gender": "female",
                    "birthday": "1972-04-03",
                    "location": {
                        "timezone": "Asia/Taipei",
                        "place": "Taiwan 新竹縣竹北市興隆路一段"
                    },
                    "contacts": {
                        "phone": "+886988227966",
                        "email": "huang.yulun@gmail.com"
                    },
                    "hobbies": [
                        "udn小說", "玩Zuma"
                    ]
                },
                {
                    "userId": "U28ab0fb7603d306cfdf90db017d5489e",
                    "nickNames": [
                        "姊姊", "阿姊", "Sabby", "Sab", "Sabrina", "阿澧"
                    ],
                    "gender": "female",
                    "birthday": "1999-11-07",
                    "location": {
                        "timezone": "America/Los_Angeles",
                        "place": ""
                    },
                    "contacts": {
                        "phone": "+18582262846",
                        "email": "sabrina.sj.ho@gmail.com"
                    },
                    "hobbies": [
                        "TKD", "跆拳道"
                    ]
                },
                {
                    "userId": "U723a896291d80108cf013c1a628857ea",
                    "nickNames": [
                        "妹妹", "小妹", "ＪＪ", "Jocelyn", "Ren", "荷荷"
                    ],
                    "gender": "female",
                    "birthday": "2004-03-22",
                    "location": {
                        "timezone": "Asia/Taipei",
                        "place": "Taiwan 新竹縣竹北市興隆路一段"
                    },
                    "contacts": {
                        "phone": "+886919322773",
                        "email": "jocelyn.her.ho@gmail.com"
                    },
                    "hobbies": [
                        "看動漫", "玩電動", "做蛋糕", "畫畫", "看Youtube"
                    ]
                }
            ]
    },
    cmdDb: {
        "version": "1.0.0",
        "db": [
            {
                "queries": [
                    {
                        "priority": "first",
                        "model": "fuzzy",
                        "texts": [
                            "idiot", "stupid", "moron"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "笨", "蠢", "白痴", "白吃", "白癡", "智障", "傻", "呆", "聰明"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "對不起，我智商比較低",
                            "說你笨你不相信",
                            "別罵我",
                            "豬笑鱉沒尾",
                            "五十步笑百步",
                            "可能比你聰明一點點",
                            "別笑我啦",
                            "你確定我比你笨？"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "first",
                        "model": "fuzzy",
                        "texts": [
                            "morning"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "早安", "早啊"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "何寶在此跟您問個早",
                            "早安，要記得吃早餐喔！",
                            "早安，今天也要開心喔！",
                            "早啊，運動有益身體健康",
                            "出門記得伸手要錢",
                            "還有人沒起床的嗎？"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "first",
                        "model": "fuzzy",
                        "texts": [
                            "good afternoon", "nap", "hello", "hihi", "hii"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "午安", "你好", "妳好", "您好", "hi"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "我想睡個午覺",
                            "喝杯咖啡？",
                            "起來走一走",
                            "吃飯了沒？"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "first",
                        "model": "fuzzy",
                        "texts": [
                            "good night", "sleep tight"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "晚安", "睡了"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "大家一起來睡覺喔",
                            "何寶跟大家說晚安",
                            "我早睡了",
                            "可是我睡不著誒，跟我聊天？"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "meowco", "meow", "妙可", "貓可", "喵咪", "貓咪"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "貓", "喵"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "誒～我只知道這隻貓很肥！",
                            "就是一隻大肥貓",
                            "喵在睡覺吧",
                            "喵嗚～～～",
                            "喵的啦",
                            "喵身上油很多",
                            "喵不想理你"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "help", "hobot", "蛤", "什麼", "等等"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "幫忙", "何寶", "?", "what", "how", "？", "等一下"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "我也很想啊，但是我目前的智商還差得很遠勒～",
                            "你覺得這是我現在可以做到的嗎？",
                            "可能要很久",
                            "直接找老闆",
                            "等我變聰明一點",
                            "有問題嗎？"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "hobot", "何寶"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "您找我？",
                            "有事嗎？",
                            "什麼吩咐？"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "um", "嗯", "m", "en", "恩", "ㄣ", "啊", "呀", "喔"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "umm", "恩恩", "嗯嗯", "ㄣㄣ", "啊啊", "啊呀", "喔喔", "啊喔", "嗯呀"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "嗯嗯嗯～",
                            "啊～",
                            "矮油～",
                            "嗯呀～",
                            "ummmmmm..."
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "fat"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "肥", "胖"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "怎摸辦，我也覺得自己有點肥耶～",
                            "該減肥了",
                            "我不覺得呀",
                            "肥已經無法形容我了",
                            "長得壯也是一種罪啊"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "欠扁", "欠揍", "欠打"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "嘿嘿，來打我啊～",
                            "別打人啦",
                            "文明一點",
                            "屁股給你打"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "hsr", "高鐵", "開車"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "小心開車，等你回家喔～",
                            "別又睡過站了啦",
                            "希望有位子",
                            "在家裡等你"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "haha", "lol", "funny", "哈", "呵", "嘿", "笑", "顆顆", "科科", "嘻", "ㄎㄎ"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "ha"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "超好笑的～",
                            "嘿呀，我也覺得很好笑",
                            "哈哈哈",
                            "@@sticker 1 2",
                            "@@sticker 1 13",
                            "@@sticker 1 106",
                            "顆顆",
                            "lol lol lol",
                            "笑鼠人了",
                            "今天很開心喔",
                            "@@sticker 1 110",
                            "@@sticker 1 100",
                            "超想笑的！",
                            "呵，哈哈！"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "...", "無言", "沒事", "來亂"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "... ... ...",
                            "...?",
                            "真的...無言",
                            "有點兒...",
                            "@@sticker 1 109",
                            "@@sticker 1 100",
                            "有事嗎？",
                            "是不是很OOXX?"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "好玩", "有趣", "funny", "interesting", "有意思"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "是喔",
                            "哪裏有意思?",
                            "totally!",
                            "我也覺得超好玩的啦",
                            "@@sticker 1 5",
                            "@@sticker 1 1114",
                            "真的假的～",
                            "agree with you..."
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "喜歡", "like", "love", "可愛", "討喜"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "是喔",
                            "哪裏有意思?",
                            "totally!",
                            "是真的嗎？",
                            "真的假的～",
                            "好喔"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "討厭", "hate", "dislike", "可惡", "閃啦", "不要"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "是喔",
                            "怎麼啦?",
                            "好吧～",
                            "放輕鬆",
                            "開心點",
                            "嗯嗯嗯"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "開心", "高興", "爽", " happy", "great", "excellent"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "YEAH!",
                            "超high的啦",
                            "我也替你高興呢",
                            "@@sticker 1 14",
                            "@@sticker 1 103",
                            "一起爽啊",
                            "Great!",
                            "Yo!"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "e04", "幹", "靠"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "媽的", "fuck", "shit", "fxck", "fxxk", "fuxk", "xxx"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "矮油",
                            "什麼事？",
                            "@@sticker 1 7",
                            "@@sticker 1 113",
                            "我們是文明人～",
                            "放輕鬆點啦～"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "ok", "好的", "好", "okok", "可以", "沒問題", "np", "yes"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "okok", "好啦", "okay", "no problem"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "你ＯＫ我當然也ＯＫ拉，顆顆",
                            "ＯＫＯＫ",
                            "沒問題喔",
                            "@@sticker 1 13",
                            "@@sticker 1 13",
                            "No problem!",
                            "ＯＫ的",
                            "@@sticker 1 106",
                            "@@sticker 1 114",
                            "好啊",
                            "就這樣子",
                            "-- O K A Y --",
                            "就醬"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "great", "nice", "爽", "ya", "棒"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "讚", "yeah"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "顆顆～",
                            "就是爽！",
                            "你真棒！",
                            "有夠讚",
                            "好樣的！",
                            "Yeah!"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "boring"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "無聊", "煩", "懶"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "怎麼辦？",
                            "找點樂子吧",
                            "去唸書",
                            "去運動一下？",
                            "聽聽音樂？",
                            "一起無聊也許就不無聊了！",
                            "說說笑？"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "mad", "angry", "nuts", "crazy"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "fuzzy",
                        "texts": [
                            "生氣", "可惡", "討厭", "火大", "去死"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": null
                    },
                    {
                        "priority": "default",
                        "model": "canned",
                        "texts": [
                            "怎麼辦？",
                            "找點樂子吧",
                            "輕鬆一下啦",
                            "Take it easy",
                            "聽聽音樂？",
                            "給你按按摩？",
                            "clam down and eat cookie",
                            "let's have a cup of coffee?"
                        ]
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "time", "now"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "時間", "現在", "タイム"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": "methodUserCheckTime"
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "bday", "birthday"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "生日"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": "methodUserCheckBirthday"
                    }
                ]
            },
            {
                "queries": [
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "image", "picture", "pic", "photo"
                        ]
                    }
                ],
                "responses": [
                    {
                        "priority": "first",
                        "model": "smart",
                        "method": "methodReplyTheImage"
                    }
                ]
            }
        ]
    }
};
