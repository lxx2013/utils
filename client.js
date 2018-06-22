var client = function () {
	//呈现引擎
	var engine = {
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,

		//完整的版本号
		ver: null
	};

	//浏览器
	var browser = {
		ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0,
		edge: 0,

		//我添加的
		uc: 0,
		qq: 0,
		360: 0,

		//具体的版本号
		ver: null
	};

	//平台/设备/操作系统
	var system = {
		Win: false,
		Mac: false,
		Linux: false,
		iOS: false,
	};
	var device = {
		//mobile
		iPhone: false,
		iPod: false,
		iPad: false,
		"Apple Watch": false,
		Android: false,
		NokiaN: false,
		WinMobile: false,

		//game system
		Wii: false,
		PS: false,
		Switch: false
	}

	//检测呈现引擎和浏览器
	var ua = navigator.userAgent;
	if (window.opera) {
		//1. 第一步是识别 Opera,因为它的用户代理字符串有可能完全模仿其他浏览器.我们不相信 Opera,是因为(在任何情况下)其用户代理字符串(都)不会将自己标识为 Opera
		engine.ver = browser.ver = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.ver)
	} else if (/AppleWebKit\/(\S+)/.test(ua)) {
		//2. 应该放在第二位检测的呈现引擎是 WebKit,因为 WebKit 的用户代理字符串中包含 Gecko 和 KHTML 这两个字符串.所以如果首先检测他们,很可能会得出错误的结论,但其 APPleWebKit 字符串是独一无二的,因此检测它.
		engine.ver = RegExp["$1"];
		engine.webkit = parseFloat(engine.ver);

		//确定是 Chrome 还是 Safari
		if (/Edge\/([^;]+)/.test(ua)) {
			engine.ver = browser.ver = RegExp["$1"];
			engine.edge = browser.edge = parseFloat(engine.ver);
		} else if (/Chrome\/(\S+)/.test(ua)) {
			browser.ver = RegExp.$1;
			browser.chrome = parseFloat(browser.ver)
		} else if (/Version\/(\S+)/.test(ua)) {
			browser.ver = RegExp.$1;
			browser.safari = parseFloat(browser.ver)
		} else {
			//其它浏览器例如 QQ 和360 UC 等应该放在 Chrome 前面
			console.error("client.js 未识别当前 UA 为哪种浏览器,UA: " + ua);
		}
	} else if (/Firefox\/(\S+)/.test(ua)) {
		engine.ver = browser.ver = RegExp["$1"];
		engine.firefox = browser.firefox = parseFloat(engine.ver);

	} else if (/rv:([^\)]+) Gecko\/\d{8}/.test(ua)) {
		engine.ver = RegExp["$1"];
		engine.gecko = parseFloat(engine.ver);
	} else
	if (/MSIE ([^;]+)/.test(ua)) {
		engine.ver = browser.ver = RegExp["$1"];
		engine.ie = browser.ie = parseFloat(engine.ver);
	}

	//识别操作系统
	var p = navigator.platform;
	system.Win = p.indexOf("Win") == 0;
	system.Mac = p.indexOf("Mac") == 0;
	system.Linux = (p.indexOf("X11") == 0) || (p.indexOf("Linux") == 0);
	if (system.win) {
		if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
			if (RegExp.$1 == "NT") {
				let versions = {
					"5.0": "2000",
					"5.1": "XP",
					"6.0": "Vista",
					"6.1": "7",
					"6.4": "10",
					"10.0": "10"
				};
				system.win = versions[RegExp.$2]
			} else if (RegExp.$1 == "9x") {
				system.win = "ME";
			} else {
				system.win = RegExp.$1;
			}
		}
	}
	if (system.Mac) {
		if (/Mac OS X (\d+(_|\.)\d+[^;]*)/.test(ua)) {
			system.Mac = RegExp.$1.replace("_", ".");
		}
	}
	//识别移动设备
	device.iPhone = ua.indexOf("iPhone;") > -1;
	device.iPod = ua.indexOf("iPod") > -1;
	device.iPad = ua.indexOf("iPad") > -1;
	system.iOS = device.iPad || device.iPhone || device.iPod;
	//检测 iOS 版本
	if (system.Mac && ua.indexOf("Mobile") > -1) {
		if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
			system.iOS = RegExp.$1.replace("_", ".");
		} else {
			system.iOS = 2; //不能真正检测出来,只能猜测
		}
		system.Mac = false;
	}
	//检测 Android 版本
	if (/Android (\d+\.\d+)/.test(ua)) {
		system.android = parseFloat(RegExp.$1);
	}
	//NokiaN
	system.nokiaN = ua.indexOf("NokiaN") > -1;
	//游戏系统
	system.wii = ua.indexOf("Wii") > -1;
	system.ps = /playstation/i.test(ua);


	return {
		engine: engine,
		browser: browser,
		system: system,
		toString() {
			var str = "操作系统:";
			for (var i in system) {
				if (system[i]) {
					str += i + " " + system[i] + " 浏览器版本:";
					break;
				}
			}
			for (var i in browser) {
				if (browser[i]) {
					str += i.replace(/./, (t) => t.toUpperCase()) + " " + browser.ver;
					break;
				}
			}
			for (var i in device) {
				if (device[i]) {
					str += " 设备:" + i;
					break;
				}
			}
			return str;
		}
	}
}
