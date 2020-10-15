const API_KEY = '1d8090427fb992fcf133881f665aba7f';

async function getPosition() {
    return new Promise(async (resolve, reject) => {
        try {
            //测试用：113.44566048199594  23.158141073300676
            let { longitude, latitude } = await Location.current()
            let request = new Request(`https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${API_KEY}&radius=1000&extensions=base`);
            let data = await request.loadJSON()
            let { province, district, township, adcode } = data.regeocode.addressComponent

            resolve({
                currentPosition: `${district} ${township}`,
                adcode
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function getWeather(adcode) {
    return new Promise(async (resolve, reject) => {
        try {
            let request = new Request(`https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${API_KEY}`);
            let data = await request.loadJSON();
            /**
             * province 省份名
             * city 城市名
             * weather 天气现象（汉字描述）
             * temperature 实时气温，单位：摄氏度
             * winddirection 风向描述
             * windpower 风力级别，单位：级
             * humidity 空气湿度
             * reporttime 数据发布的时间
             */
            resolve(data.lives[0])
        } catch (error) {
            reject(error)
        }
    })
}

function readImage(name) {
    return new Promise(async (resolve, reject) => {
        let fileManager = FileManager.local();
        let path = fileManager.bookmarkedPath('Scriptable');
        let imagePath = path + '/images/' + name;
        if (fileManager.fileExists(imagePath)) {
            console.log("file exists")
            await fileManager.downloadFileFromiCloud(imagePath);
            resolve(fileManager.readImage(imagePath))
        } else {
            resolve(null)
        }
    })
}

/**
 * 计算两个日期的间隔天数
 * @param {String} strDateStart 
 * @param {String} strDateEnd 
 * @example getDays("2012-12-01","2012-12-25")
 */
function getDays(strDateStart, strDateEnd) {
    let strSeparator = "-"; //日期分隔符
    let oDate1 = strDateStart.split(strSeparator);
    let oDate2 = strDateEnd.split(strSeparator);
    let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
    let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
    return parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
}

function createTextStack(targetStack, texts) {
    texts.map(item => {
        let text = targetStack.addText(item.text);
        text.font = Font[item.font](item.fontSize);
        text.textColor = new Color(item.textColor);
    })
}

(async function () {
    try {
        let { currentPosition, adcode } = await getPosition();
        let { weather, temperature, winddirection, windpower, humidity } = await getWeather(adcode)

        let listWidget = new ListWidget();
        let bgImage = await readImage('bg.jpg')
        //背景图片不存在，则设置背景色
        !bgImage && (listWidget.backgroundColor = new Color('#ffffff', 0));
        //背景图片存在，则设置
        bgImage && (listWidget.backgroundImage = bgImage);

        let stack = listWidget.addStack();

        let leftStack = stack.addStack(); //左边容器
        leftStack.size = new Size(180, 200);
        leftStack.layoutVertically();
        leftStack.topAlignContent();
        leftStack.spacing = 10;

        stack.addSpacer(10);//左右容器间隔

        let rightStack = stack.addStack(); //右边容器
        rightStack.size = new Size(120, 200);
        rightStack.spacing = 5;
        rightStack.layoutVertically()

        let date = new DateFormatter();
        date.locale = 'en';
        date.useFullDateStyle();

        let dateText = date.string(new Date());
        dateText = dateText.split(',')[0] + ',' + dateText.split(',')[1];

        let d = new Date();

        //今年剩余天数
        let remainingDays = getDays(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, `${d.getFullYear()}-12-31`);

        //距自定义节日天数，这里是春节
        let countdown = getDays(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, `${d.getFullYear() + 1}-02-12`);

        let elements = [
            {
                direction: 'left',
                type: 'Text',
                texts: [
                    {
                        text: dateText,
                        font: 'systemFont',
                        fontSize: 15,
                        textColor: '#33cccc',
                    },
                ],
                align: 'centerAlignText',
                space: 0,
            },
            {
                direction: 'left',
                type: 'Text',
                texts: [
                    {
                        text: '距今年结束还有 ',
                        textColor: '#33cccc',
                        font: 'systemFont',
                        fontSize: 18
                    },
                    {
                        text: remainingDays.toString(),
                        textColor: '#D62828',
                        font: 'systemFont',
                        fontSize: 18
                    },
                    {
                        text: ' 天',
                        textColor: '#33cccc',
                        font: 'systemFont',
                        fontSize: 18
                    },
                ],
                align: 'centerAlignText',
                space: 0,
            },
            {
                direction: 'left',
                type: 'Text',
                texts: [
                    {
                        text: '距离春节还有 ',
                        textColor: '#33cccc',
                        font: 'systemFont',
                        fontSize: 18
                    },
                    {
                        text: countdown.toString(),
                        textColor: '#D62828',
                        font: 'systemFont',
                        fontSize: 18
                    },
                    {
                        text: ' 天',
                        textColor: '#33cccc',
                        font: 'systemFont',
                        fontSize: 18
                    },
                ],
                align: 'centerAlignText',
                space: 0,
            },
            {
                direction: 'right',
                type: 'Image',
                name: `${weather}.PNG`,
                mode: 'applyFillingContentMode',
                align: 'rightAlignImage',
                width: 15,
                height: 15,
                space: 25,
            },
            {
                direction: 'right',
                type: 'Text',
                texts: [
                    {
                        text: `${temperature} ℃ ${weather}`,
                        font: 'regularSystemFont',
                        fontSize: 15,
                        textColor: '#33cccc',
                    },
                ],
                align: 'centerAlignText',
                space: 38,
            },
            {
                direction: 'right',
                type: 'Text',
                texts: [
                    {
                        text: `${winddirection}风 ${windpower}级`,
                        font: 'systemFont',
                        fontSize: 13,
                        textColor: '#33cccc',
                    }
                ],
                align: 'centerAlignText',
                space: 32,
            },
            {
                direction: 'right',
                type: 'Text',
                texts: [
                    {
                        text: `空气湿度：${humidity}%`,
                        font: 'systemFont',
                        fontSize: 13,
                        textColor: '#33cccc',
                    }
                ],
                align: 'centerAlignText',
                space: 21,
            },
            {
                direction: 'right',
                type: 'Text',
                texts: [
                    {
                        text: `${currentPosition}`,
                        font: 'systemFont',
                        fontSize: 13,
                        textColor: '#33cccc',
                    }
                ],
                align: 'leftAlignText',
                space: 18,
            },
        ]

        elements.map(async el => {
            let stack = el.direction === 'left' ? leftStack.addStack() : rightStack.addStack();
            stack.layoutHorizontally();
            stack.setPadding(0, 0, 0, 0);
            stack.addSpacer(el.space);

            if (el.type === 'Text') {
                createTextStack(stack, el.texts)
            } else if (el.type === 'Image') {
                stack.size = new Size(100, 25);
                let image = await readImage(el.name);
                if (image) {
                    let widgetImage = new ListWidget().addImage(image);
                    widgetImage.imageSize = new Size(el.width, el.height);
                    widgetImage[el.mode]();
                    widgetImage[el.align]();
                    stack.addImage(widgetImage.image)
                }
            }
        })

        Script.setWidget(listWidget);
        Script.complete();

        console.log('run end--------------')
    } catch (error) {
        console.error(error);
    }
})()
