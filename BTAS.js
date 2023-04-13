// ==UserScript==
// @name         BTAS
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Blue Team Assistance Script
// @author       Barry Y Yang; Jack SA Chen
// @require      https://raw.githubusercontent.com/Ripper-S/BTAS/main/update.meta.js
// @match        https://caas.pwchk.com/*
// @icon         https://www.google.com/s2/favicons?domain=pwchk.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==
var $ = window.jQuery;


/**
 * This function registers a Tampermonkey search menu command
 * @param {Array} searchEngines - Search engines array containing the Jira, VT, AbuseIPDB
 */
function registerSearchMenu() {
    console.log('#### Code registerSearchMenu run ####');
    const searchEngines = [
        { name: 'Jira', url: 'https://caas.pwchk.com/issues/?jql=text%20~%20%22%s%22%20ORDER%20BY%20created%20DESC' },
        { name: 'VT', url: 'https://www.virustotal.com/gui/search/%s' },
        { name: 'AbuseIPDB', url: 'https://www.abuseipdb.com/check/%s' }
    ];
    searchEngines.forEach(engine => {
        GM_registerMenuCommand(engine.name, () => {
            const selectedText = window.getSelection().toString();
            const searchURL = engine.url.replace('%s', selectedText);
            selectedText.length === 0 ? alert('No text selected') : window.open(searchURL, '_blank');
        });
    });
}
/**
 * This function registers two Tampermonkey exception menu command
 * Add Exception: adds the currently selected text to an exception list stored in local storage
 * Clear Exception: clears the exception list from local storage
 */
const exceptionKey = localStorage.getItem('exceptionKey')?.split(',') || [];
const notifyKey = [...exceptionKey];
function registerExceptionMenu() {
    console.log('#### Code registerExceptionMenu run ####');
    GM_registerMenuCommand("Add Exception", () => {
    const selection = window.getSelection().toString().trim();
    if (!selection) {
        return alert('No text selected');
    }
    exceptionKey.push(selection);
    localStorage.setItem("exceptionKey", exceptionKey.toString());
    alert('Added successfully');
    });

    GM_registerMenuCommand("Clear Exception", () => {
        localStorage.setItem("exceptionKey", "");
        exceptionKey = notifyKey = [];
        alert('Cleared successfully');
    });
}


/**
 * This function creates audio and checkbox controls and adds them to the Jira share button's parent node
 * @returns {Object} Object containing references to the audio control and audio checkbox, keep checkbox
 */
// ## In the future, the alert sound will be migrated to another server, and more fun music will be added.
function createBellControls() {
    console.log('#### Code createBellControls run ####');
    const operationsBar = $('div.saved-search-operations.operations');
    const audioControl = $('<span></span>');

    function createAudioControl(parentNode) {
        const currentDate = new Date();
        const audioURL = currentDate.getHours() >= 9 && currentDate.getHours() < 21
        ? 'https://aspirepig-1251964320.cos.ap-shanghai.myqcloud.com/12221.wav'
        : 'https://aspirepig-1251964320.cos.ap-shanghai.myqcloud.com/alerts.wav';
        audioControl.html(`<audio src="${audioURL}" type="audio/mpeg" controls></audio>`);
        parentNode.prepend(audioControl);
    }

    function createCheckbox(parentNode, localStorageKey) {
        const checkbox = $('<span></span>');
        const value = localStorage.getItem(localStorageKey);
        checkbox.html(`<input type="checkbox" name="${localStorageKey}" ${value == 'true' ? 'checked' : ''}>${localStorageKey}`);
        checkbox.find('input').on('click', () => {
            localStorage.setItem(localStorageKey, checkbox.find('input').prop('checked'));
        });
        parentNode.prepend(checkbox);
        return checkbox;
    }
    createAudioControl(operationsBar);
    const audioCheckbox = createCheckbox(operationsBar, 'audioNotify');
    const keepCheckbox = createCheckbox(operationsBar, 'keepNotify');

    return { audioControl, audioCheckbox, keepCheckbox };
}
/**
 * Check for updates in the issues list and play a sound if new issues are found
 * @param {Object} BellControls - Object containing the audio control, audio checkbox, keep checkbox
 */
function checkupdate(BellControls) {
    console.log('#### Code checkupdate run ####');
    const table = $('tbody');
    if (!table.length) return;

    let content = '';
    table.find('tr').each(function() {
        const summary = $(this).find('.summary p').text().trim();
        const issuekey = $(this).find('.issuekey a.issue-link').attr('data-issue-key');
        if (!notifyKey.includes(issuekey)) {
            notifyKey.push(issuekey);
            content += `${summary}==${issuekey}\n\n`;
        }
    });
    const { audioControl, audioCheckbox, keepCheckbox } = BellControls;
    if (content || keepCheckbox.find('input').prop('checked')) {
        if (audioCheckbox.find('input').prop('checked')) {
            audioControl.find('audio').get(0).currentTime = 0;
            audioControl.find('audio').get(0).play();
        }
    }
    // console.info(`#### checkupdate_end: ${notifyKey} ####`);
}


/**
 * This function checks for specific keywords within a string
 * Advises the user to double-check and contact L2 or TL if suspicious.
 * @param {Array} keywords - An array of strings containing the high risk keywords to check for
 */
function checkKeywords() {
    console.log('#### Code checkKeywords run ####');
    const keywords = ['keyword1', 'mimikatz', 'keyword3'];
    const strToCheck = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().toLowerCase();
    const matchedKeyword = keywords.find(keyword => strToCheck.includes(keyword.toLowerCase()));
    if (matchedKeyword) {
      alert(`High Risk Keyword: ${matchedKeyword}\nPlease double-check it, and if it seems suspicious, contact L2 or TL.`);
    }
}


/**
 * Creates a new button and adds it to the DOM.
 * @param {string} id - The ID attribute for the new button element.
 * @param {string} text - The text content to display on the new button.
 * @param {string} onClick - The function to call when the button is clicked.
 */
function addButton(id, text, onClick) {
    console.log(`#### Add Button: ${text}  ####`);
    const toolbar = $('.aui-toolbar2-primary');
    toolbar.append(`
        <div class="aui-buttons pluggable-ops">
        <a id="${id}" onclick="${onClick}" class="aui-button toolbar-trigger">
            <span class="trigger-label">${text}</span>
        </a>
        </div>
    `);
    $('#' + id).click(onClick);
}
/**
 * Creates three buttons on a JIRA issue page to handle Cortex XDR alerts
 * The buttons allow users to generate a description of the alerts, open the alert card page and timeline page
 */
function cortexAlertHandler() {
    console.log('#### Code cortexAlertHandler run ####');
    /**
     * Extracts the log information and organization name from the current JIRA issue page
     * @param {Object} orgDict - A dictionary that maps organization name to navigator name
     * @returns {Object} An object that contains the organization's name, organization's navigator URL, raw log information
     */
    const orgDict = {
        'bossini': 'https://bossini.xdr.sg.paloaltonetworks.com/',
        'hkuniversity': 'https://cpos.xdr.sg.paloaltonetworks.com/',
        'citysuper': 'https://citysuper.xdr.sg.paloaltonetworks.com/',
        'esf-dc': 'https://esf.xdr.us.paloaltonetworks.com/',
        'glshk': 'https://glshk.xdr.us.paloaltonetworks.com/',
        'kerrylogistics': 'https://kerrylogistics.xdr.us.paloaltonetworks.com/',
        'k11-hk': 'https://k11.xdr.sg.paloaltonetworks.com/',
        'newworld': 'https://nwcs.xdr.sg.paloaltonetworks.com/',
        'nws': 'https://nws.xdr.sg.paloaltonetworks.com/',
        'toppanmerrill': 'https://tpm-apac.xdr.us.paloaltonetworks.com/',
        'welab': 'https://welabbank.xdr.sg.paloaltonetworks.com/'
    };
    function extractLog(orgDict) {
        const orgName = $('#customfield_10223-val').text().trim();
        const orgNavigator = orgDict[orgName];
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        // # Add a click event listener to the "Edit" button for ESF tickets
        if (orgName.includes('esf')) {
            $('#edit-issue').on('click', () => {
                alert('ESF ticket: Please escalated according to the Label tags and document!!!\nhttp://172.18.2.13/books/customers/page/esf-cortex-endpoint-group-jira-organization-mapshareButtong');
            });
        }
        return { orgName, orgNavigator, rawLog };
    }
    const { orgName, orgNavigator, rawLog} = extractLog(orgDict);

    /**
     * Parse the relevant information from the raw log data
     * @param {Array} rawLog - An array of JSON strings representing the raw log data
     * @returns {Array} An array of objects containing the alert relevant information
     */
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { cortex_xdr } = JSON.parse(log);
                const { source, alert_id, name, description } = cortex_xdr;
                const isPANNGFW = source === 'PAN NGFW';
                const alert = { source, alert_id, name, description };
                if (isPANNGFW) {
                    const { action_local_ip, action_local_port, action_remote_ip, action_remote_port, action_pretty } = cortex_xdr;
                    acc.push({ ...alert, action_local_ip, action_local_port, action_remote_ip, action_remote_port, action_pretty });
                } else {
                    const { action_file_name, action_file_path, action_file_sha256, actor_process_image_name, actor_process_image_path, actor_process_image_sha256, host_name, host_ip, user_name, actor_process_command_line } = cortex_xdr;
                    const filename = action_file_name || actor_process_image_name;
                    const filepath = action_file_path || actor_process_image_path;
                    const sha256 = action_file_sha256 || actor_process_image_sha256;
                    acc.push({ ...alert, host_name, host_ip, user_name, actor_process_command_line, filename, filepath, sha256 });
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);

    /**
     * Define three functions for handling alert information:
     * generateDescription creates a description for each alert, and displays the combined description in an alert box
     * openCard opens a new window to display the alert card page for each alert
     * openTimeline opens a new window to display the timeline page for each alert
     */
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { source, name, action_local_ip, action_local_port, action_remote_ip, action_remote_port, action_pretty, host_name, host_ip, user_name, actor_process_command_line, filename, filepath, sha256, description } = info;
            if (source === 'PAN NGFW') {
                const desc = `Observed ${name}\nSrcip: ${action_local_ip}   Srcport: ${action_local_port}\nDstip: ${action_remote_ip}   Dstport: ${action_remote_port}\nAction: ${action_pretty}\n\nPlease help to verify if this activity is legitimate.\n`;
                alertDescriptions.push(desc);
            } else {
                const desc = `Observed ${description || name}\nHost: ${host_name}   IP: ${host_ip}\nusername: ${user_name}\ncmd: ${actor_process_command_line}\nfilename: ${filename}\nfilepath:\n${filepath}\nhttps://www.virustotal.com/gui/file/${sha256}\n\nPlease help to verify if it is legitimate, if not please remove it and perform a full scan.\n`;
                alertDescriptions.push(desc);
            }
            const toolbarSha256 = $('.aui-toolbar2-inner');
            // console.info(`toolbar_sha256: ${toolbarSha256.clone().children().remove().end().text().trim()}`);
            // console.info(`sha256: ${sha256}`);
            if (sha256 && !toolbarSha256.clone().children().remove().end().text().trim().includes(sha256)) {
                toolbarSha256.append(`${sha256} `);
            }
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    }
    function openCard() {
        for (const info of alertInfo) {
            const { source, alert_id } = info;
            if (orgNavigator) {
                let cardURL;
                switch (source) {
                    case 'XDR Analytics':
                        cardURL = `${orgNavigator}card/analytics2/${alert_id}`;
                        break;
                    case 'Correlation':
                        cardURL = `${orgNavigator}alerts/${alert_id}`;
                        break;
                    default:
                        cardURL = `${orgNavigator}card/alert/${alert_id}`;
                        break;
                }
                window.open(cardURL, '_blank');
            } else {
                alert(`There is no ${orgName} Navigator on Cortex`);
            }
        }
    }
    function openTimeline() {
        for (const info of alertInfo) {
            const { source, alert_id } = info;
            if (orgNavigator) {
                let timelineURL;
                switch (source) {
                    case 'Correlation':
                        alert(`Source of the Alert is ${source}, There is no Timeline on Cortex`);
                        break;
                    default:
                        timelineURL = `${orgNavigator}forensic-timeline/alert_id/${alert_id}`;
                        break;
                }
                timelineURL && window.open(timelineURL, '_blank');
            } else {
                alert(`There is no ${orgName} Navigator on Cortex`);
            }
        }
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openCard', 'Card', openCard);
    addButton('openTimeline', 'Timeline', openTimeline);
}

function MDEAlertHandler() {
    console.log('#### Code MDEAlertHandler run ####');
    function extractLog() {
        const orgName = $('#customfield_10223-val').text().trim();
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        // # Add a click event listener to the "Edit" button for LSH-HK tickets
        if (orgName.includes('lsh-hk')) {
            $('#edit-issue').on('click', () => {
                alert('LSH-HK ticket: Please escalated according to the Label tags and document!!!\nhttp://172.18.2.13/books/customers/page/lsh-hk-lei-shing-hong-hk');
            });
        }
        return { orgName, rawLog };
    }
    const { orgName, rawLog} = extractLog();
    // console.info(`orgName: ${orgName}`);
    // console.info(`rawLog: ${rawLog}`);

    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { mde } = JSON.parse(log);
                const { title, id, computerDnsName, relatedUser, evidence } = mde;
                const alert = { title, id, computerDnsName };
                const userName = relatedUser ? relatedUser.userName : "N/A";
                let extrainfo = "";
                if (evidence) {
                  const tmp = [];
                  for (const evidenceItem of evidence) {
                    if (evidenceItem.entityType === "File") {
                      const description = `filename:${evidenceItem.fileName}\nfilePath:${evidenceItem.filePath}\nsha1:${evidenceItem.sha1}\n`;
                      tmp.push(description);
                    }
                    if (evidenceItem.entityType === "Process") {
                      const description = `cmd:${evidenceItem.processCommandLine}\naccount:${evidenceItem.accountName}\nsha1:${evidenceItem.sha1}\n`;
                      tmp.push(description);
                    }
                }
                const uniqueDescriptions = Array.from(new Set(tmp));
                extrainfo = uniqueDescriptions.join("\n");
                }
                acc.push({ ...alert, userName, extrainfo });
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    // console.info(`alertInfo: ${alertInfo}`);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { title, computerDnsName, userName, extrainfo } = info;
            const desc = `Observed ${title}\nHost: ${computerDnsName}\nusername: ${userName}\n${extrainfo}\nPlease help to verify if it is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    }
    function openMDE() {
        let MDEURL = "";
        for (const info of alertInfo) {
            const { id } = info;
            if (id) {
                MDEURL += `https://security.microsoft.com/alerts/${id}\n`;
            }
        }
        alert(MDEURL);
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openMDE', 'MDE', openMDE);
}

function HTSCAlertHandler() {
    console.log('#### Code HTSCAlertHandler run ####');
    function decodeHtml(encodedString) {
        var tmpElement = document.createElement('span');
        tmpElement.innerHTML = encodedString;
        return tmpElement.innerText;
    }

    function extractLog() {
        const orgName = $('#customfield_10223-val').text().trim();
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        return { orgName, rawLog };
    }
    const { orgName, rawLog} = extractLog();
    // console.info(`orgName: ${orgName}`);
    // console.info(`rawLog: ${rawLog}`);

    const parseLog = (rawLog) => {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const formatJson = log.substring(log.indexOf("{")).trim();
                // const logObj = JSON.parse(formatJson);
                const logObj = JSON.parse(formatJson.replace(/\\\(n/g, '\\n('));
                const eventEvidence = decodeHtml(logObj.event_evidence);
                const alert = {
                    attackType: logObj.tag,
                    hostRisk: logObj.hostRisk,
                    srcIP: logObj.src_ip,
                    eventEvidence,
                    hostName: logObj.hostName,
                    dstIP: logObj.dst_ip,
                };
                acc.push(alert);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
          return acc;
        }, []);
        return alertInfo;
    };
    const alertInfo = parseLog(rawLog);
    // console.info(`alertInfo: ${alertInfo}`);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { attackType, hostRisk, srcIP, hostName, dstIP, eventEvidence } = info;
            const desc = `Observed ${attackType} Attack\nhostRisk: ${hostRisk}\nSrc_IP: ${srcIP}\nhostname: ${hostName}\nDst_IP: ${dstIP}\nevent_evidence: ${eventEvidence}\n\nPlease help to verify if this activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function CBAlertHandler() {
    console.log('#### Code CBAlertHandler run ####');
    function extractLog() {
        const orgName = $('#customfield_10223-val').text().trim();
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        // # Add a click event listener to the "Edit" button for swireproperties tickets
        if (orgName.includes('swireproperties')) {
            $('#edit-issue').on('click', () => {
                alert('swireproperties ticket: Please escalated according to the group, hostname value, Check if additional Participants need to be added through HK_MSS_SOP.doc !!!');
            });
        }
        return { orgName, rawLog };
    }
    const { orgName, rawLog} = extractLog();
    // console.info(`orgName: ${orgName}`);
    // console.info(`rawLog: ${rawLog}`);

    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            const cb_log = {};
            try {
                const log_obj = log.split("\t");
                log_obj.forEach((log_item) => {
                    try {
                        const [key, value] = log_item.split("=");
                        cb_log[key] = value;
                    } catch (error) {
                        console.error(`Error: ${error.message}`);
                    }
                });
                acc.push({ AlertTitle: cb_log.watchlist_name, HostName: cb_log.computer_name, HostIp: cb_log.interface_ip, UserName: cb_log.username, CmdLine: cb_log.cmdline, CBlink: cb_log.link_process, Filepath: cb_log.path, Sha256: cb_log.process_sha256 });
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    // console.info(`alertInfo: ${alertInfo}`);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { AlertTitle, HostName, HostIp, UserName, CmdLine, Filepath, Sha256 } = info;
            const desc = `Observed ${AlertTitle}\nHost: ${HostName}  IP: ${HostIp}\nusername: ${UserName}\nCmdline: ${CmdLine}\nFilepath: ${Filepath}\nsha256: ${Sha256}\n\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    };
    function openCB() {
        let CBURL = "";
        for (const info of alertInfo) {
            const { CBlink } = info;
            if (CBlink) {
                CBURL += `${CBlink}\n`;
            }
        }
        alert(CBURL);
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openCB', 'CB', openCB);
}

(function() {
    'use strict';

    registerSearchMenu();
    registerExceptionMenu();

    // Filter page: audio control registration and regular issues table update
    if (window.location.href.includes('filter=15200') && !window.location.href.includes('MSS')) {
        console.log('#### Code includes filter run ####');
        const BellControls = createBellControls();

        setInterval(() => {
            $('.aui-button.aui-button-primary.search-button').click();
            setTimeout(checkupdate(BellControls), 5000);
        }, 180000);
        setInterval(() => {
            notifyKey = [];
            window.location.href = 'https://caas.pwchk.com/issues/?filter=15200';
        }, 1800000);
    }

    // Issue page: Alert Handler
    setInterval(() => {
        if ($('#issue-content').length && !$('#generateDescription').length) {
            console.log('#### Code Issue page run ####');
            checkKeywords();

            const handlers = {
                'cortex-xdr-json': cortexAlertHandler,
                'mde-api-json': MDEAlertHandler,
                'sangfor-ccom-json': HTSCAlertHandler,
                'CarbonBlack': CBAlertHandler
            };
            const decoderName = $('#customfield_10807-val').text().trim();
            const handler = handlers[decoderName];
            if (handler) {
                handler();
            }
        }
    }, 3000);
})();
