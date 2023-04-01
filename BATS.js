// ==UserScript==
// @name         蓝队增强
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  SDC blue team Jira helper
// @author       Barry Y Yang
// @match        https://caas.pwchk.com/*
// @icon         https://www.google.com/s2/favicons?domain=pwchk.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==


var exceptticket = localStorage.getItem("exceptticket")? localStorage.getItem("exceptticket").split(','):[]
var notifykey = exceptticket

let JiraSearch=GM_registerMenuCommand ("Jira Search", function(){
    //https://caas.pwchk.com/issues/?jql=text%20~%20mshta%20ORDER%20BY%20created%20DESC
   var selection = window.getSelection().toString()
   if (selection.length ==0){
       alert('未选中任何值');
   }else{
       window.open("https://caas.pwchk.com/issues/?jql=text%20~%20"+ selection +"%20ORDER%20BY%20created%20DESC", "_blank")
   }
}, "h");

let VTSearch=GM_registerMenuCommand ("VT Search", function(){
    //https://caas.pwchk.com/issues/?jql=text%20~%20mshta%20ORDER%20BY%20created%20DESC
   var selection = window.getSelection().toString()
   if (selection.length ==0){
       alert('未选中任何值');
   }else{
       window.open("https://www.virustotal.com/gui/search/"+ selection , "_blank")
   }
}, "h");

let ipSearch=GM_registerMenuCommand ("AbuseIp Search", function(){
    //https://www.abuseipdb.com/check/
   var selection = window.getSelection().toString()
   if (selection.length ==0){
       alert('未选中任何值');
   }else{
       window.open("https://www.abuseipdb.com/check/"+ selection , "_blank")
   }
}, "h");

let XTSearch=GM_registerMenuCommand ("微步 Search", function(){
    //https://s.threatbook.com/search?query=B522F365240FF66D374F7A1F2ACD685A12C2F3E41928838217F18AAA8A1D1335
   var selection = window.getSelection().toString()
   if (selection.length ==0){
       alert('未选中任何值');
   }else{
       window.open("https://s.threatbook.com/search?query="+ selection , "_blank")
   }
}, "h");


let Add2Except=GM_registerMenuCommand ("添加例外", function(){
   var selection = window.getSelection().toString().trim()
   if (selection.length ==0){
       alert('未选中任何值');
   }else{
       exceptticket = localStorage.getItem("exceptticket")? localStorage.getItem("exceptticket").split(','):[]
       exceptticket.push(selection)
       console.log(exceptticket)
       localStorage.setItem("exceptticket",exceptticket.toString())
       notifykey.push(notifykey)
       alert('添加成功');
   }
}, "h");

let CleanExcept=GM_registerMenuCommand ("清除例外", function(){
    localStorage.setItem("exceptticket","")
    exceptticket = notifykey = []
    alert('清除完成');

}, "h");

(function() {
    'use strict';
    function decodeHtml(encodedString) {
    var tmpElement = document.createElement('span');
    tmpElement.innerHTML = encodedString;
    return tmpElement.innerText;
}

    if (window.location.href.includes('filter=15200') ){ //更改为自己的filter id
        console.log("filter页面 代码生效")
        var d = new Date();
        var pin = document.getElementById("jira-share-trigger")
        var gener_audio=document.createElement("span");

        if (d.getHours() >= 9 && d.getHours() < 21 ){//获取当前时间，判断是白班还是夜班
            gener_audio.innerHTML='<audio  src="https://aspirepig-1251964320.cos.ap-shanghai.myqcloud.com/12221.wav" type="audio/mpeg"  controls="controls"></audio>' //短通知
        }else{
            gener_audio.innerHTML='<audio  src="https://aspirepig-1251964320.cos.ap-shanghai.myqcloud.com/alerts.wav" type="audio/mpeg"  controls="controls"></audio>' //长歌曲
        }

        pin.parentNode.prepend(gener_audio)

        var checkbox_audio=document.createElement("span");
        var musicnotify=localStorage.getItem("musicnotify");
         if(musicnotify == "true"){
            checkbox_audio.innerHTML='<input type="checkbox"  name="notify_audio" checked >音乐通知'
        }else{
            checkbox_audio.innerHTML='<input type="checkbox"  name="notify_audio" >音乐通知'
        }

        pin.parentNode.prepend(checkbox_audio)
        checkbox_audio.firstChild.addEventListener('click', checkbox2, false);
        function checkbox2() {
            localStorage.setItem("musicnotify",checkbox_audio.firstChild.checked);
        }

        var checkbox_music=document.createElement("span");
        var keepnotify=localStorage.getItem("keepnotify");
        if(keepnotify == "true"){
            checkbox_music.innerHTML='<input type="checkbox" name="notify_music" checked>持续通知'
        }else{
            checkbox_music.innerHTML='<input type="checkbox" name="notify_music">持续通知'
        }
        pin.parentNode.prepend(checkbox_music)
        checkbox_music.firstChild.addEventListener('click', checkbox1, false);
        function checkbox1() {
            localStorage.setItem("keepnotify",checkbox_music.firstChild.checked);
        }


        function checkupdate(){//检查table 数据是否有新增
            if(document.getElementsByClassName('issue-list').length > 0){
                var table2 = document.getElementsByClassName('issue-list')
                if (table2.length > 0) {
                    var rows = table2[0].childNodes
                    var content = ""
                    for (var i =0;i < rows.length;i++) {
                        var summary = rows[i].innerText
                        var issuekey = rows[i].getAttribute("data-key")
                        if (notifykey.includes(issuekey) == false)
                        {
                            notifykey.push(issuekey)
                            content = content + summary + "==" + issuekey + '\n\n'
                        }
                    }
                    if (content != "" || checkbox_music.firstChild.checked ){
                        if (checkbox_audio.firstChild.checked){
                            gener_audio.firstChild.currentTime = 0;
                            gener_audio.firstChild.play()
                        }
                    }
                }
            }else{
                var table = document.getElementsByTagName('tbody')
                if (table.length > 0) {
                    var rows = table[0].childNodes
                    var content = ""
                    for (var i =0;i < rows.length;i++) {
                        var summary = rows[i].firstChild.innerText
                        var issuekey = rows[i].firstChild.firstChild.getAttribute("data-issue-key")
                        if (notifykey.includes(issuekey) == false)
                        {
                            notifykey.push(issuekey)
                            content = content + summary + "==" + issuekey + '\n\n'
                        }
                    }
                    if (content != "" || checkbox_music.firstChild.checked ){
                        if (checkbox_audio.firstChild.checked){
                            gener_audio.firstChild.currentTime = 0;
                            gener_audio.firstChild.play()
                        }
                    }
                }
            }
            //console.log(notifykey)
        }

        setInterval(function() {
            document.getElementsByClassName("aui-button aui-button-primary search-button")[0].click();
            setTimeout(checkupdate, 7000)
        }, 120000);
        setInterval(function() {
            notifykey = []
            window.location.href = "https://caas.pwchk.com/issues/?filter=15200"
        }, 900000);
    }

    setInterval(function() {
            if (document.getElementById('issue-content') && !document.getElementById('gen_describ')){

                // 定义关键词列表
                const keywords = ['关键词1', 'mimikatz', '关键词3'];

                // 获取需要检查的字符串
                var strToCheck = document.getElementById('field-customfield_10219').children[1].children[1].innerText.trim()

                // 遍历关键词列表，检查是否包含其中的关键词（忽略大小写）
                for (let i = 0; i < keywords.length; i++) {
                    const keywordLowercase = keywords[i].toLowerCase(); // 将关键词转换为小写字母
                    const strLowercase = strToCheck.toLowerCase(); // 将字符串转换为小写字母
                    if (strLowercase.includes(keywordLowercase)) {
                        alert(`Sample Raw log 中包含关键词：${keywords[i]}，请仔细确认，如可疑，请通知L2或TL`);
                        break;
                    }
                }

                //cortex逻辑处理
                if (document.getElementById('customfield_10204-val').innerText.trim() == "cortex_xdr"){
                    console.log("cortex_xdr 详情页面 代码生效")
                    //生成描述 按钮
                    var div_par = document.getElementsByClassName("aui-toolbar2-primary")[0]
                    var gener_desc=document.createElement("div");
                    gener_desc.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc.innerHTML='<a id="gen_describ" onclick="gen_describ" title="Generate description" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Generate description</span></a>'
                    div_par.append(gener_desc)


                    //生成cortex跳转按钮
                    var gener_desc2=document.createElement("div");
                    gener_desc2.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc2.innerHTML='<a id="open_card" onclick="open_card"  title="open-card" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Open Card</span></a>'
                    div_par.append(gener_desc2)

                    var gener_desc3=document.createElement("div");
                    gener_desc3.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc3.innerHTML='<a id="open_timeline" onclick="open_timeline" title="open-timeline" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Open Timeline</span></a>'
                    div_par.append(gener_desc3)

                    var LogSource = document.getElementById("customfield_10223-val").textContent.trim()
                    var domain_dict = {
                        "kerrylogistics":"https://kerrylogistics.xdr.us.paloaltonetworks.com/",
                        "newworld":"https://nwcs.xdr.sg.paloaltonetworks.com/",
                        "esf-dc":"https://esf.xdr.us.paloaltonetworks.com/",
                        "bossini":"https://bossini.xdr.sg.paloaltonetworks.com/",
                        "genting":"https://gentinghk.xdr.sg.paloaltonetworks.com/",
                        "glshk":"https://glshk.xdr.us.paloaltonetworks.com/",
                        "toppanmerrill":"https://tpm-apac.xdr.us.paloaltonetworks.com/",
                        "hkuniversity":"https://cpos.xdr.sg.paloaltonetworks.com/",
                        "citysuper":"https://citysuper.xdr.sg.paloaltonetworks.com/",
                        "k11-hk":"https://k11.xdr.sg.paloaltonetworks.com/"
                    }
                    var domain = domain_dict[LogSource]
                    var raw_log = document.getElementById('field-customfield_10219').children[1].children[1].innerText.trim()
                    raw_log = raw_log.split('\n')

                    if(LogSource.indexOf("esf")>-1 ){
                        $("#edit-issue").click(function(){
                            alert("ESF ticket 请根据 Label 标签，在文档中查找对应组织进行升级！！！\nhttp://172.18.2.13/books/customers/page/esf-cortex-endpoint-group-jira-organization-mapping")
                        });
                    }

                    var alert_info = []

                    for (var x in raw_log){
                        try {
                            var log_obj = JSON.parse(raw_log[x])
                            } catch(e) {
                                continue
                            }
                        var cortex_log = log_obj.cortex_xdr
                        var log_source = cortex_log.source
                        if (log_source == "PAN NGFW"){//日志来源为防火墙
                            alert_info.push({
                                source:log_source,
                                alert_id:cortex_log.alert_id,
                                srcip:cortex_log.action_local_ip,
                                srcport:cortex_log.action_local_port,
                                dstip:cortex_log.action_remote_ip,
                                dstport:cortex_log.action_remote_port,
                                action_pretty:cortex_log.action_pretty,
                                name:cortex_log.name,
                                description:cortex_log.description
                            })
                        }else{
                            if (cortex_log.action_file_name != "" && cortex_log.action_file_name != undefined ){
                                var filename = cortex_log.action_file_name
                                var filepath = cortex_log.action_file_path
                                var vs = cortex_log.action_file_sha256
                                }
                            else{
                                var filename = cortex_log.actor_process_image_name
                                var filepath = cortex_log.actor_process_image_path
                                var vs = cortex_log.actor_process_image_sha256
                                }
                            alert_info.push({
                                source:log_source,
                                host:cortex_log.host_name,
                                ip:cortex_log.host_ip,
                                username:cortex_log.user_name,
                                alert_id:cortex_log.alert_id,
                                cmd:cortex_log.actor_process_command_line,
                                filename:filename,
                                filepath:filepath,
                                vs:vs,
                                name:cortex_log.name,
                                description:cortex_log.description
                            })
                        }


                    }



                    //事件绑定
                    document.getElementById('gen_describ').addEventListener('click', gen_describ, false);
                    document.getElementById('open_card').addEventListener('click', open_card, false);
                    document.getElementById('open_timeline').addEventListener('click', open_timeline, false);

                    function gen_describ() {
                        var tmp = []
                        for (var y in alert_info) {
                            var alert_log = alert_info[y]
                            if(alert_log.source == "PAN NGFW"){
                                var des = "Observed "+alert_log.name+"\nSrcip: "+alert_log.srcip+"   Srcport: "+alert_log.srcport+"\nDstip: "+alert_log.dstip+"   Dstport: "+alert_log.dstport+"\nAction: "+alert_log.action_pretty+"\n\nPlease help to verify if this activity is legitimate.\n"
                                }else{
                                    if(alert_log.description == undefined)
                                        alert_log.description = alert_log.name
                                    var des = "Observed "+alert_log.description+"\nHost: "+alert_log.host+"   IP: "+alert_log.ip+"\nusername: "+alert_log.username+"\ncmd: "+alert_log.cmd+"\nfilename: "+alert_log.filename+"\nfilepath:\n"+alert_log.filepath+"\nhttps://www.virustotal.com/gui/file/"+alert_log.vs+"\n\nPlease help to verify if it is legitimate, if not please remove it and perform a full scan.\n"
                                    }
                            tmp.push(des)
                            div_par.append(alert_log.vs+" ")
                        }
                        tmp = Array.from(new Set(tmp)) //去重
                        var des_str = tmp.join("\n")
                        alert(des_str)
                    }

                    function open_card() {
                        for (var y in alert_info) {
                            if (alert_info[y].source == "Correlation"){
                                alert("Correlation 告警无 card 查看，请访问 "+domain + "alerts, 查看alert_id " + alert_info[y].alert_id)

                            }else{
                                if (alert_info[y].source == "XDR Analytics"){
                                window.open(domain + "card/analytics2/" + alert_info[y].alert_id, "_blank")
                                }else{
                                    //console.log(alert_info[y])
                                    window.open(domain + "card/alert/" + alert_info[y].alert_id, "_blank")
                                }
                            }

                        }
                    }


                    function open_timeline() {
                        for (var y in alert_info){
                            if (alert_info[y].source == "Correlation"){
                                alert("Correlation 告警无 card 查看，请访问 "+domain + "alerts, 查看alert_id " + alert_info[y].alert_id)
                            }else{
                                window.open(domain + "forensic-timeline/alert_id/" + alert_info[y].alert_id, "_blank");
                            }

                        }
                    }

                }
                //huatai逻辑处理
                if (document.getElementById('customfield_10807-val').innerText.trim() == "sangfor-ccom-json"){
                    console.log("ticket详情页面 代码生效")
                    var LogSource  = document.getElementById("customfield_10223-val").textContent.trim()
                    var raw_log = document.getElementById('field-customfield_10219').children[1].children[1].innerText.trim()
                    raw_log = raw_log.split('\n')

                    var alert_info = []

                    for (var x in raw_log){
                        try {
                            var formatjson = raw_log[x].substring(raw_log[x].indexOf("{")).trim()
                            var log_obj = JSON.parse(formatjson)
                            } catch(e) {
                                continue
                            }
                        var event_evidence = decodeHtml(log_obj.event_evidence)
                        alert_info.push({
                            attackType:log_obj.tag,
                            hostRisk:log_obj.hostRisk,
                            src_ip:log_obj.src_ip,
                            event_evidence:event_evidence,
                            hostName:log_obj.hostName,
                            dst_ip:log_obj.dst_ip,
                            dst_port:log_obj.dst_port
                        })

                    }

                    //生成描述 按钮

                    var div_par = document.getElementsByClassName("aui-toolbar2-primary")[0]
                    var gener_desc=document.createElement("div");
                    gener_desc.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc.innerHTML='<a id="gen_describ" onclick="gen_describ" title="Generate description" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Generate description</span></a>'
                    div_par.append(gener_desc)


                    //事件绑定
                    document.getElementById('gen_describ').addEventListener('click', gen_describ, false);

                    function gen_describ() {
                        var tmp = []
                        for (var y in alert_info) {
                            var alert_log = alert_info[y]
                            var des = "Observed  "+alert_log.attackType+" Attack \nhostRisk:  "+alert_log.hostRisk+"\nSrc_IP:  "+alert_log.src_ip+"\nhostname: "+alert_log.hostName+"\nDst_IP: "+alert_log.dst_ip+"\nevent_evidence: "+alert_log.event_evidence+"\n\nPlease help to verify if this activity is legitimate.\n"
                            tmp.push(des)
                        }
                        tmp = Array.from(new Set(tmp)) //去重
                        var des_str = tmp.join("\n")
                        alert(des_str)
                    }
                }

                //MDE逻辑处理
                if (document.getElementById('customfield_10807-val').innerText.trim() == "mde-api-json"){
                    console.log("mde 详情页面 代码生效")

                    var LogSource = document.getElementById("customfield_10223-val").textContent.trim()
                    if(LogSource.indexOf("lsh-hk")>-1 ){
                        $("#edit-issue").click(function(){
                            alert("lsh-hk ticket 请根据 Label 标签，在文档中查找对应组织进行升级！！！\nhttp://172.18.2.13/books/customers/page/lsh-hk-lei-shing-hong-hk")
                        });
                    }

                    //生成描述 按钮
                    var div_par = document.getElementsByClassName("aui-toolbar2-primary")[0]
                    var gener_desc=document.createElement("div");
                    gener_desc.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc.innerHTML='<a id="gen_describ" onclick="gen_describ" title="Generate description" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Generate description</span></a>'
                    div_par.append(gener_desc)


                    //生成mde跳转按钮
                    var gener_desc2=document.createElement("div");
                    gener_desc2.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc2.innerHTML='<a id="open_mde" onclick="open_mde"  title="open-MDE" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Open MDE</span></a>'
                    div_par.append(gener_desc2)


                    var raw_log = document.getElementById('field-customfield_10219').children[1].children[1].innerText.trim()
                    raw_log = raw_log.split('\n')

                    var alert_info = []

                    for (var x in raw_log){
                        try {
                            var log_obj = JSON.parse(raw_log[x])
                            } catch(e) {
                                continue
                            }
                        var mde_log = log_obj.mde
                        if(mde_log.relatedUser){
                            var UserName = mde_log.relatedUser.userName
                            }else{
                                var UserName = "N/A"
                                }
                        var loggedOnUsers = ""
                        if(mde_log.loggedOnUsers){
                            for (var i in mde_log.loggedOnUsers){
                                loggedOnUsers = loggedOnUsers + mde_log.loggedOnUsers[i].accountName+ "  "
                            }
                        }else{
                            loggedOnUsers = "N/A"
                        }
                        var extrainfo = ""
                        if(mde_log.evidence){
                            var tmp = []
                            var tmp_des = ""
                            for (var i in mde_log.evidence){
                                if(mde_log.evidence[i].entityType == "File"){
                                    console.log()
                                    tmp_des = "filename:"+ mde_log.evidence[i].fileName+ "\n"+ "filePath:"+ mde_log.evidence[i].filePath+ "\n"+ "sha1:"+ mde_log.evidence[i].sha1+ "\n"
                                }
                                if(mde_log.evidence[i].entityType == "Process"){
                                    console.log()
                                    tmp_des = "cmd:"+ mde_log.evidence[i].processCommandLine+ "\n"+ "account:"+ mde_log.evidence[i].accountName+ "\n"+ "sha1:"+ mde_log.evidence[i].sha1+ "\n"
                                }
                                tmp.push(tmp_des)
                            }
                            tmp = Array.from(new Set(tmp))
                            extrainfo = tmp.join("\n")
                        }
                        var ComputerDnsName= mde_log.computerDnsName.replace("[","").replace("]","")
                        alert_info.push({
                            AlertTitle:mde_log.title,
                            AlertId:mde_log.id,
                            ComputerDnsName:ComputerDnsName,
                            UserName:UserName,
                            loggedOnUsers:loggedOnUsers,
                            extrainfo:extrainfo,
                            Source:mde_log.detectionSource
                        })

                    }

                    //事件绑定
                    document.getElementById('gen_describ').addEventListener('click', gen_describ, false);
                    document.getElementById('open_mde').addEventListener('click', open_mde, false);

                    function gen_describ() {
                        var tmp = []
                        for (var y in alert_info) {
                            var alert_log = alert_info[y]
                            var des = "Observed "+alert_log.AlertTitle+"\nHost: "+alert_log.ComputerDnsName+"\nusername: "+alert_log.UserName+"\nloggedOnUsers: "+alert_log.loggedOnUsers+"\n"+ alert_log.extrainfo+"\nPlease verify if the activity is legitimate.\n"
                            tmp.push(des)
                        }
                        tmp = Array.from(new Set(tmp)) //去重
                        var des_str = tmp.join("\n")
                        alert(des_str)
                    }

                    function open_mde() {
                        var mdelink = ""
                        for (var y in alert_info) {
                            mdelink = 'https://security.microsoft.com/alerts/' + alert_info[y].AlertId + "\n"
                        }
                        alert(mdelink)
                    }

                }


                //CB逻辑处理
                if (document.getElementById('customfield_10807-val').innerText.trim() == "CarbonBlack"){
                    console.log("CarbonBlack 详情页面 代码生效")

                    $("#edit-issue").click(function(){
                        alert("swireproperties ticket 请根据 group/hostname 值，在HK_MSS注意事项.doc 文档中查找是否需要额外添加 Participants ")
                    });

                    if(document.getElementById('summary-val').innerText.trim().indexOf("fileTreat") > 1 || document.getElementById('summary-val').innerText.trim().indexOf("Critical IOC Detected") > 1)
                        {
                            var div_par = document.getElementsByClassName("aui-toolbar2-primary")[0]
                            var gener_desc=document.createElement("div");
                            gener_desc.setAttribute('class',"aui-buttons pluggable-ops")
                            gener_desc.innerHTML='<a id="gen_describ"  onclick="gen_describ" title="Generate description" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Generate description</span></a>'
                            gener_desc.hidden = true
                            div_par.append(gener_desc)
                            return
                        }
                    //生成描述 按钮
                    var div_par = document.getElementsByClassName("aui-toolbar2-primary")[0]
                    var gener_desc=document.createElement("div");
                    gener_desc.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc.innerHTML='<a id="gen_describ" onclick="gen_describ" title="Generate description" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Generate description</span></a>'
                    div_par.append(gener_desc)


                    //生成CB跳转按钮
                    var gener_desc2=document.createElement("div");
                    gener_desc2.setAttribute('class',"aui-buttons pluggable-ops")
                    gener_desc2.innerHTML='<a id="open_cb" onclick="open_cb"  title="open-CB" class="aui-button toolbar-trigger><span class="icon aui-icon aui-icon-small"></span> <span class="trigger-label">Open CB</span></a>'
                    div_par.append(gener_desc2)


                    var raw_log = document.getElementById('field-customfield_10219').children[1].children[1].innerText.trim()
                    raw_log = raw_log.split('\n')

                    var alert_info = []

                    for (var x in raw_log){
                        if(raw_log[x].length < 20 )
                            continue
                        var cb_log = {}
                        try {
                            var log_obj = raw_log[x].split('\t')
                        } catch(e) {
                            continue
                        }
                        for (var i in log_obj) {
                            try{
                                var tmp = log_obj[i].split('=')
                                cb_log[tmp[0]] = tmp[1]
                            } catch(e){
                                continue
                            }
                        }

                        alert_info.push({
                            AlertTitle:cb_log.watchlist_name,
                            HostName:cb_log.computer_name,
                            HostIp:cb_log.interface_ip,
                            UserName:cb_log.username,
                            CmdLine:cb_log.cmdline,
                            CBlink:cb_log.link_process,
                            Filepath:cb_log.path,
                            Sha256:cb_log.process_sha256
                        })
                    }


                    function gen_describ() {
                        var tmp = []
                        for (var y in alert_info) {
                            var alert_log = alert_info[y]
                            var des = "Observed "+alert_log.AlertTitle+"\nHost: "+alert_log.HostName+"  IP: "+ alert_log.HostIp +"\nusername: "+alert_log.UserName+"\nCmdline: "+alert_log.CmdLine+"\nFilepath: "+alert_log.Filepath+"\nsha256: "+alert_log.Sha256+"\n" +"\nPlease verify if the activity is legitimate.\n"
                            tmp.push(des)
                        }
                        tmp = Array.from(new Set(tmp)) //去重
                        var des_str = tmp.join("\n")
                        alert(des_str)
                    }

                    function open_cb() {
                        var cblink = ""
                        for (var y in alert_info) {
                            cblink = cblink + alert_info[y].CBlink + "\n\n"
                        }
                        alert(cblink)
                    }

                    //事件绑定
                    document.getElementById('gen_describ').addEventListener('click', gen_describ, false);
                    document.getElementById('open_cb').addEventListener('click', open_cb, false);


                }

                }
        }, 3000);



})();
