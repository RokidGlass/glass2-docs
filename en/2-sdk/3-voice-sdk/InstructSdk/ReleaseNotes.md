# Release notes

### v1.6.1  --  June 9, 2021

1. Fix the bug that the plug-in hides the tips floating bar and the Lark function will trigger in the mixed use mode of the voice command plug-in and the lark;
2. Fix the bug that initialization fails when InstructLifeManager is used as a tool and the Context parameter is not Activity;

### v1.6.0  --  April 21, 2021

1. Add speech online aar, online tts related functions, use SpeechUserManager to call;
2. Optimize the aar sharing logic, and change the shared warehouse from Jcenter to rokid's own external shared maven warehouse;

### v1.5.9  --  February 28, 2021

1. Open the lifeCycle lifecycle status setting received by the command, Resumed is used by default;

### v1.5.8  --  December 7, 2020

1. The initialization process is modified, and the control switch of the mutex feature of the lark service is added (by default, it is enabled);

### v1.5.7  --  December 1, 2020

1. InstructionManager is integrated with the activity method to optimize the processing timing of instructions;

### v1.5.6  --  October 21, 2020

1. By default, the feature of automatic smart instruction service whitelist is enabled;

### v1.5.4  --  September 21, 2020

1. The feature of controlling the help floating layer showing/hiding is provided for external users;
2. The callback listening of the changes of the help floating layer showing/hiding status is provided;
3. The bug of error in obtaining ActionKey in the lifecycle mode is fixed;

### v1.5.0  --  September 12, 2020

1. The method of using the SDK is optimized, lifeCyle is supported, and the implementation of manager instances is simplified;
2. The callback of the completion of the tips UI is optimized, and the listening of the showing/hiding of the floating layer of the help system is added;
3. The implementation logic of InstructActivity is optimized, and the logic code relating to the implementation of the demo is adjusted.

### v1.4.2  --  July 15, 2020

1. When an instruction word is added, a feature of removing a duplicate and filtering according to the system voice is added to prevent the instruction word from being added repeatedly;
2. The features of quickly making the number instruction effective and quickly removing it are added;
3. When a number instruction is set, a feature of setting the hit toast, sound effects, and showing/hiding of the help is added;

### v1.4.1  --  July 1, 2020

1. The display of the UI on the left side of the tips is optimized, and the English instruction words are replaced.

### v1.4.0  --  June 23, 2020

1. The display of the instruction bar UI of the tips is modified.

### v1.3.9  --  June 19, 2020

1. The text of the tips is aligned to the left, and the UI of going back to the previous level is adjusted and fixed to the position on the left side.

### v1.3.7  --  June 12, 2020

1. The logic of the tips is optimized, and the showing/hiding of the back tip on the left side is opened.

### v1.3.6  --  June 10, 2020

1. The layout of the tips is optimized, and the fixed tip of going back to the previous level is added.

### v1.3.5  --  June 4, 2020

1. The playing of the tip sound is optimized.

### v1.3.4  --  March 31, 2020

1. The bug of 0 attached to the hundred of the Chinese number instruction is fixed.

### v1.3.3  --  March 30, 2020

1. The automatic transformation logic of the Chinese number instruction is optimized, and the bugs of the 100th page and the 110th page are fixed;
2. A null instruction is added, and the activity of testing the global instructions is removed.

### v1.3.2  --  March 19, 2020

1. The UI and code logic relating to the help floating layer are removed;
2. Some global instructions are removed, and the processing logics relating to the system instructions are added;
3. The limitation on the total number of number instructions is released, and the transfer logic of the content of the help is optimized.

### v1.3.1  --  March 7, 2020

1. The target of the context of the TextView created by oneself is modified;

### v1.3.0  --  February 25, 2020

1. The tool framework of number-type instructions is re-constructed, and a feature of continuous instructions of English numbers is added;
2. The features of global multilingual instructions are optimized, and the issue of destroying the global instruction sometimes is solved;
3. The related calling demo is updated, and continuous instructions of multilingual numbers are supported.