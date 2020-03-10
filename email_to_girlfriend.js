//this is node.js code
const Request = require('request');
const nodemailer = require('nodemailer');//email
const cheerio = require('cheerio');//jq for server
const iconv = require('iconv-lite');//decode gb2312
const schedule = require('node-schedule');//

//全局data
global.data={
    count:0,//时间计数
    //日期 纪念日 获取倒数时间 天数
    remenber:{
        date:null,
        love:null,
        birthday:null,
    }
}


startWork()

// 7:50 每天七点五十执行
// var interval = schedule.scheduleJob('00 50 07 * * *',()=>{
//     startWork()
// })

function startWork() {
    console.log('执行');
    global.data.remenber.date = getDate();//今天
    global.data.remenber.love = getPassDay(new Date('2017-07-15'),new Date());//示例 纪念日
    global.data.remenber.birthday = birthday('9-10');//填入生日 MM-DD
    one();//获取ONE
    global.checkTimer = setTimeout(() => {
        // console.log(JSON.stringify(global.data));
        renderHtml((html)=>{
            //渲染完成后 发送邮件
            sendEmail('765797511@qq.com',html);//这里填女朋友的邮箱哦！
        },(error)=>{
            //当遇到错误时 将错误信息发送到你自己的邮箱 
            sendEmail('765797511@qq.com',`<p>${JSON.stringify(error)}</p>`);
        });
    }, 1000);
}

function birthday(date){
    let _date = '';
    let nowYear = new Date().getFullYear();
    let nowMonth = new Date().getMonth()+1;
    if(nowMonth>10){
        _date = `${nowYear+1}-${date}`;
    }else{
        _date = `${nowYear}-${date}`;
    }
    return getPassDay(new Date(),new Date(_date));
}
function getPassDay(startTime,nowTime){
    //计算时间间隔
    // nowTime - startTime
    let oneday = 60*60*24;
    let day = ((nowTime - startTime)/oneday)/1000;
    return parseInt(day);
}
function getDate(){
    let time = new Date();
    let week = ['日','一','二','三','四','五','六'];
    return `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日 星期${week[time.getDay()]}`;
}

function one(){
    Request({
        url:'http://wufazhuce.com/',
        encoding:null
    },
    (error, response, body)=>{
        if(error){
            console.error('获取one失败',error);
            return;
        }
        const html = iconv.decode(body,'utf8');
        const $ = cheerio.load(html);
        let img_src = $('.fp-one-imagen')[0].attribs.src;
        let title = $('.fp-one-cita>a')[0].children[0].data;
        global.data.one={img_src,title}
    })
}

function renderHtml(onOk,onErr){
    // console.log(JSON.stringify(global.data.wheather))
    // global.data.wheather;debugger
    try{
        //HTML
        var html=`<p>${global.data.remenber.date}<span style="float:right">❤️ ${global.data.remenber.love} 天</span></p>
        <h2>在一起的 ${global.data.remenber.love} 天</h2>
        <h2>距离你的生日还有 ${global.data.remenber.birthday} 天</h2>
        <br />
        `;
        onOk&&onOk(html);
    }catch(err){
        onErr&&onErr(err);
    }
}
function sendEmail(emailAddress,html){
    let transporter = nodemailer.createTransport({
        // host: 'smtp.gmail.com',
        service:'qq',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user:'765797511@qq.com',//这里填写你的qq邮箱
            pass:'ggbqpycsggwgbccb',//示例 qq邮箱smtp授权码 ！非密码 授权码需进qq邮箱手动获取
        }
    });
    let mailOptions = {
        from:'gglanjian@foxmail.com ',//你的邮箱 与前面一致
        to:emailAddress,//对方邮箱
        subject: `💌一封爱的小邮件  在一起的 ${global.data.remenber.love} 天` ,  // Subject line 邮件标题
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.error('发送错误',error)
        }else{
            console.log('发送成功',info);
            //清空 data
            global.data={
                one:{title:'',img:''},//ONE
                //日期 纪念日
                remenber:{
                    date:null,
                    love:null,
                    birthday:null,
                }
            }
            //end
        }
    });
}
