/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

module.exports = {
    userDb: {
        "users": [
            [
                {
                    "userId": "Uc173149caaa1f02eb263e113fe154fd0",
                    "nickNames": [
                        "爸爸", "Daddy", "阿爹", "James"
                    ]
                },
                {
                    "userId": "",
                    "nickNames": [
                        "媽媽", "Mom", "媽咪", "綸綸"
                    ]
                },
                {
                    "userId": "",
                    "nickNames": [
                        "姊姊", "阿姊", "Sabby", "Sab", "Sabrina", "阿澧"
                    ]
                },
                {
                    "userId": "",
                    "nickNames": [
                        "妹妹", "小妹", "ＪＪ", "Jocelyn", "Ren", "荷荷"
                    ]
                }
            ]
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
                        "model": "precise",
                        "texts": [
                            "笨", "蠢", "白痴", "白吃", "白癡", "智障"
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
                            "good afternoon", "nap"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "午安", "你好", "妳好", "您好"
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
                        "model": "precise",
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
                            "meowco", "meow", "妙可"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "貓"
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
                            "一隻大肥貓",
                            "在睡覺吧",
                            "身上油很多",
                            "不想理你"
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
                            "help", "hobot"
                        ]
                    },
                    {
                        "priority": "default",
                        "model": "precise",
                        "texts": [
                            "幫忙", "何寶"
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
                            "等我變聰明一點"
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
                            "hsr", "高鐵"
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
                            "haha", "lol", "funny", "哈", "呵", "嘿", "笑", "顆顆", "科科", "嘻"
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
                            "顆顆",
                            "~~lol~~",
                            "笑鼠人了",
                            "今天很開心喔",
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
                            "...", "無言"
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
                            "是不是很OOXX?"
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
                            "No problem!",
                            "ＯＫ的",
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
                            "無聊", "煩"
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
                        "method": "methodTime"
                    }
                ]
            }
        ]
    }
};
