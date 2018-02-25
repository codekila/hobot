/**
 * Created by jamesho on 25/02/2018.
 */

'use strict';

export var cmdDb = {
    "version": "1.0.0",
    "db": [
        {
            "queries": [
                {
                    "priority": "first",
                    "model": "fuzzy",
                    "texts":[
                        "idiot", "stupid", "moron"
                    ]
                },
                {
                    "priority": "default",
                    "model": "precise",
                    "texts":[
                        "笨", "蠢", "白痴", "白吃", "白癡", "智障"
                    ]
                }
            ],
            "responses": [
                {
                    "priority": "first",
                    "model": "smart",
                    "method": ""
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
                    "texts":[
                        "morning"
                    ]
                },
                {
                    "priority": "default",
                    "model": "precise",
                    "texts":[
                        "早安", "早啊"
                    ]
                }
            ],
            "responses": [
                {
                    "priority": "first",
                    "model": "smart",
                    "method": ""
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
        }
    ]
};
