# BTAS

> Blue Team Assistance Script

**BTAS** is being developed by Barry & Jack & Xingyu

[中文版本(Chinese version)](README.zh-cn.md)


## Installation & Usage

You can use Greasy Fork to install and update BTAS scripts, as follows:

https://greasyfork.org/en/scripts/463908-btas

If you want to experience the latest features or help us test the program, you can install the BTAS Beta version. Click on the following link: 

https://greasyfork.org/en/scripts/469395-btas-beta


## Features

### Code Architecture and Style
- Code Style: Use new language features and syntax of ECMAScript 6 (ES6); Use jQuery to manipulate HTML documents and handle events, making the code concise and elegant.

- Readability & Maintainability: Use camel case naming conventions for variables and function declarations; Use English to describe text information uniformly; Add comments to main functions and special treatments.

- Architecture: Refactor the code as a whole, abstract functions, reduce code reuse.

### Tampermonkey Menu Command
- Function introduction
    - When selecting text with the mouse, clicking on the Tampermonkey icon in the upper right corner will call Jira, Reputation, VT, and AbuseIPDB for searching.

    - If you encounter a ticket that cannot be processed temporarily, but you don't want it to keep ringing in the filter queue, you can select the issue key with the mouse, and then click on the Tampermonkey icon in the upper right corner to call Add Exception to add an exception. Clear Exception is to clear all exceptions.
  
- Addition: Integrate Reputation search functionality, enabling IP reputation value queries through the XSOAR platform.

- Refactoring: Consolidate the functionality of registering multiple Greasy Monkey menus into an array-based search engine, allowing for a one-time loop registration solution.

- Removal: The Weibu search engine has been removed as it had a Chinese interface, which was not conducive to user experience.

### Notification Controls
**Only supports List View (the default mode on the filter page).**
- Function introduction
    - **audioNotify** is for turning on notification sound. It regularly refreshes the filter list and plays a notification sound only when there are new tickets that are different from the last time the list was refreshed.

    - **keepNotify** is for keeping the notification sound. It regularly refreshes the filter list and plays the notification sound as long as there are unfinished tickets.

    - **prompt** is for turning on banner notifications. It regularly refreshes the filter list and displays a banner notification if there are tickets with customer responses that have not been processed for more than 30 minutes.

- Refactoring: Abstract the audio control and checkbox functionalities into functions. Integrate multiple alert sound components into a single object as a return value, facilitating subsequent calls.

- Removal: Due to the interruption caused by periodic filter list refresh when upgrading tickets in Edit mode under Detail View, resulting in the loss of entered description information, the alert sound component now does not support Detail View and only supports List View (the default mode on the filter page).

### High-Risk Keyword Check
- Function introduction
  
    - When high-risk keywords such as "mimikatz" are detected in the log, a reminder will pop up saying "Please double-check it, and if it seems suspicious, contact L2 or TL."
      
- Optimization: Abstract the high-risk keyword checking functionality into a function to facilitate future development and maintenance.

### Log Summary and Security Platform Shortcut Keys
- Function Introduction
    - In the specific MSS-ticket interface, add Description, Card, and Timeline buttons to the toolbar.
        - Description: Log summary information.
        - Card, Timeline: Shortcut jumps or URL information to the corresponding security platform in Alter.

- Refactoring: Abstract the information summary and platform navigation functionalities into functions to improve readability. Abstract the add button function to reduce duplicate code and make it more concise.

- Optimization: Create objects for Cortex platform clients and navigation to facilitate adding clients and maintenance in the future.

- Bug Fixes: The issue of appending hash text every time Description is clicked has been resolved. The problem of not being able to navigate to new client cards such as Welab has been fixed. The issue of blank Description for certain tickets in HTSC has been resolved. The problem of "Description undefined" on the Carbonblack platform has been fixed.


## Contribution
Developed by Barry before version 0.93, and refactored by Jack for version 1.0.1 and responsible for subsequent development and maintenance. Xingyu will be actively engaged in the development tasks following the release of version 1.3.2


## License
License: Apache License 2.0
