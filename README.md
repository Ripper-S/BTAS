# BTAS

> Blue Team Assistance Script

**BTAS** is being developed by Barry & Jack

[中文版本(Chinese version)](README.zh-cn.md)

## GIT TEST222
## Installation & Usage

You can use Greasy Fork to install and update BTAS scripts, as follows:

https://greasyfork.org/en/scripts/463908-btas


## Features

### Code Architecture and Style
- Code Style: Use new language features and syntax of ECMAScript 6 (ES6); Use jQuery to manipulate HTML documents and handle events, making the code concise and elegant.

- Readability & Maintainability: Use camel case naming conventions for variables and function declarations; Use English to describe text information uniformly; Add comments to main functions and special treatments.

- Architecture: Refactor the code as a whole, abstract functions, reduce code reuse.

### Tampermonkey Menu Command
- When selecting text with the mouse, clicking on the Tampermonkey icon in the upper right corner will call Jira, VT, and AbuseIPDB for searching.

- If you encounter a ticket that cannot be processed temporarily, but you don't want it to keep ringing in the filter queue, you can select the issue key with the mouse, and then click on the Tampermonkey icon in the upper right corner to call Add Exception to add an exception. Clear Exception is to clear all exceptions.

### Notification Controls
**Only supports List View (the default mode on the filter page).**
- **audioNotify** is for turning on notification sound. It regularly refreshes the filter list and plays a notification sound only when there are new tickets that are different from the last time the list was refreshed.

- **keepNotify** is for keeping the notification sound. It regularly refreshes the filter list and plays the notification sound as long as there are unfinished tickets.

- **prompt** is for turning on banner notifications. It regularly refreshes the filter list and displays a banner notification if there are tickets with customer responses that have not been processed for more than 30 minutes.

### High-Risk Keyword Check
- When high-risk keywords such as "mimikatz" are detected in the log, a reminder will pop up saying "Please double-check it, and if it seems suspicious, contact L2 or TL."


### Log Summary and Security Platform Shortcut Keys
- In the specific MSS-ticket interface, add Description, Card, and Timeline buttons to the toolbar.
    - Description: Log summary information.
    - Card, Timeline: Shortcut jumps or URL information to the corresponding security platform in Alter.


## Contribution
Developed by Barry before version 0.93, and refactored by Jack for version 1.0.1 and responsible for subsequent development and maintenance


## License
License: Apache License 2.0
