const menuItems = [
    {
        title: 'Start',
        id: 'start',
        selected: false
    }
];

const screens = {
    startScreen: {
        enabled: true,
        id: 'startScreen'
    },
    levels: {
        enabled: true,
        id: 'levels'
    },
    gameplay: {
        enabled: true,
        id: 'gameplay'
    },
    gameover: {
        enabled: true,
        id: 'gameover'
    },
    leaderboard: {
        enabled: true,
        id: 'leaderboard'
    },
    help: {
        enabled: true,
        id: 'help'
    }

}

const __levels = [
    {
        title:'Beginner',
        id:'beginner',
        unit:3,
        chances:6,
        icon:'👶'
    },
    {
        title: 'Moderate',
        id: 'moderate',
        unit: 5,
        chances: 5,
        icon: '🙅'
        
    },
    {
        title: 'Pro',
        id: 'pro',
        unit: 6,
        chances: 4,
        icon: '💂'
    },
    {
        title: 'Legend',
        id: 'legend',
        unit: 7,
        chances: 3,
        icon: '🐅'
    }
]


/*
    Game Class
*/
class Game {
    isStarted = false;
    level = null;
    rootNode = null;
    currentScreen = null;
    specialCell = null;
    stopwatch = null;
    score = null;
    attempts=1;
    finalScore=0;
    constructor(rootElem){
        this.rootNode = rootElem;
        this.currentScreen = screens['startScreen'];
        this.showStartupScreen();
    }

    showStartupScreen = () =>{
        this.cleanRootNode();
        /*
            Start Screen Parent
        */
        let startScreenParent = document.createElement('div');
        startScreenParent.classList.add('startScreen');
        startScreenParent.innerHTML = '<span class="diamond-icon">💎</span><span class="title">Find My <b>Di</b>amond</span>';

        /*
            Menu Markup
        */
        let menuMarkup = document.createElement('ul');
        menuMarkup.classList.add('menu');
        menuMarkup.id = 'menu';

        menuItems.forEach((item, index) => {
            let classname = index === 0 ? 'menuItem' : 'menuItem';
            menuMarkup.innerHTML += `<li class="${classname}" onclick="selectMenu('${item.id}')">${item.title}</li>`;
        });

        
        startScreenParent.append(menuMarkup);
        this.addToRootNode(startScreenParent);
    }

    selectMenu = (id) =>{
        switch(id){
            case "start":
                window.audio.play();
                this.currentScreen = screens['levels'];
                this.showLevelsScreen();
                break;
            default:
                break;
        }
    }

    showLevelsScreen = () =>{
        this.cleanRootNode();
        const levelRoot = document.createElement('div');
        levelRoot.classList.add('levelRoot');
        levelRoot.innerHTML = ` <span class="title">🔥 Levels 🔥</span>`;
        const levelsParent = document.createElement('div');
        levelsParent.classList.add("levels");
        __levels.map((item,index)=>{
            levelsParent.innerHTML += `<div class="levelParent" onClick="selectLevel('${item.id}')">
                    <span>${item.unit} X ${item.unit}</span>
                    <span class="levelName">${item.title}</span>
                    <span class="icon">${item.icon}</span>
                 </div>`
        });
        levelRoot.append(levelsParent);
        this.addToRootNode(levelRoot);
    }

    selectLevel = (id) =>{
        const levelObj = this.getLevelFromId(id);
        this.level = levelObj;
        if(levelObj){
            this.renderMesh(levelObj.unit);
        }
    }

    addToRootNode = (toBeAddedNode) => {
        this.rootNode.append(toBeAddedNode);
    }
    replaceRoot = (innerHTML) =>{
        this.rootNode.innerHTML = innerHTML;
    }
    
    cleanRootNode = () =>{
        if(this.rootNode){
            this.rootNode.innerHTML = "";
        }
    }

    getLevelFromId = (id) =>{
        return __levels.find(item=>item.id===id);
    }

    /*
        Render Mesh
    */

    renderMesh(unit){
        this.cleanRootNode();
        // Get Total Units
        const totalUnits = unit * unit;
        let cellSize = "";
        for(var i=1; i<=unit; i++){
            cellSize += "auto ";
        }

        // Get and Store Random Int in Global Variable
        const randomBtn = this.getRandomInt(totalUnits);
        this.specialCell = randomBtn;
        // Build Game Canvas
        const gameCanvas = document.createElement('div');
        gameCanvas.classList.add('game__canvas');
        gameCanvas.id = 'gameCanvas'
        
        
        // Build Game Parent
        const gridParent = document.createElement('div');
        gridParent.classList.add('grid');
        gridParent.id = 'grid';
        gridParent.style = `grid-template-columns: ${cellSize}`;
        for(var i=1; i<=totalUnits; i++){
            gridParent.innerHTML += `<div class="grid__cell" id="cell_${i}">
                    <road-button id="tile_${i}"></road-button>
                </div>`
        }
        
        // Render Stat Bar
        const statBar = this.renderMenuBar();

        // Render Total Chances
        const totalChances = document.createElement('div');
        totalChances.id="totalChances";
        totalChances.classList.add('children');
        totalChances.classList.add('chances');
        totalChances.innerHTML = `<span class="menutitle">👍</span><span id="chances" class="menuValue">${this.level.chances}</span>`;
        
        // Render Level Chances
        const level = document.createElement('div');
        level.id="currentLevel";
        level.classList.add('children');
        level.classList.add('level');
        level.innerHTML = `<span class="menutitle">🔱</span><span class="menuValue">${this.level.title}</span>`;
        
        // Render Stop Watch
        const stopWatch = document.createElement('div');
        stopWatch.classList.add('children');
        stopWatch.classList.add('stopwatch');

        const results = document.createElement('ul');
        results.classList.add('results');

        statBar.append(totalChances);
        statBar.append(stopWatch);
        statBar.append(results);
        statBar.append(level)
        
        this.addToRootNode(statBar);
        

        gameCanvas.append(gridParent);
        this.addToRootNode(gameCanvas); 
        
        // Add Hint For the result
        this.getNumberTrivia(randomBtn);

        /*
            Initiate StopWatch
        */
        this.stopwatch = new Stopwatch(stopWatch,results);
        this.stopwatch.start();

        /*
            Add Event Handler to All Mesh Buttons
        */
        document.querySelectorAll('road-button').forEach(item=>addEventListener('click', this.btnClickAction));  
    }

    getNumberTrivia = async (number) =>{
        let getTrivia = await fetch(`http://numbersapi.com/${number}`, {
            "headers": {
                "accept": "text/plain, */*; q=0.01",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "x-requested-with": "XMLHttpRequest"
            },
        });

        if(getTrivia && getTrivia.status ===200){
            let hint = await getTrivia.text();
            hint = `Hint : ${hint.replace(number, 'XX')}`;
            const hintElem = document.createElement('div');
            hintElem.id = 'hintElem';
            hintElem.classList.add('hint')
            hintElem.innerText = hint;
            document.getElementById('gameRoot').insertBefore(hintElem, document.getElementById('gameCanvas'))
            
        }
    }

    renderMenuBar = () =>{
        const statBar = document.createElement('div');
        statBar.id = "statBar";
        statBar.classList.add('stat');
        return statBar;
    }

    btnClickAction = (e) =>{
        window.audio.play();
        /*
            Add a Press Effect
        */
       if(e.target.id){
           const id = parseInt(e.target.id.split('_')[1]);
           if (id === this.specialCell) {
               let newNode = document.createElement("span");
               newNode.id = "treasureFound";
               newNode.classList.add("treasure");
               document.getElementById(`cell_${id}`).insertBefore(newNode, document.getElementById(e.target.id));
               this.score = this.stopwatch.stop();
               this.calculateScore(1);
               this.stopwatch.clear();
               setTimeout(()=>{
                   this.renderGameWin();
               },3000)
               
            }
            else{
               if (this.attempts === this.level.chances) {
                   this.attempts === 0;
                   this.score = this.stopwatch.stop();
                   this.calculateScore(0);
                   this.stopwatch.clear();
                   document.querySelectorAll('road-button').forEach(item => removeEventListener('click', this.btnClickAction));
                   this.renderGameOver();
                   
                }
            }
           document.getElementById('chances').innerText = this.level.chances - this.attempts;
           this.attempts = this.attempts + 1;
           
        }   
    }

    /*
        Calculate Game Score
    */
    calculateScore = (outcome) =>{
        let threshold = 1;
        if(outcome){
            threshold = 2
        }
        else{
            threshold = 0.5
        }
        let minutesTaken = this.score[0]/60; // Convert to seconds
        let secondsTaken = this.score[1];
        let millsecondsTaken = this.score[2] / 1000; // Convert to seconds
        let timeTaken = minutesTaken + secondsTaken + millsecondsTaken;
        let finalScore = (this.level.chances  - this.attempts) / timeTaken;
        finalScore = outcome ? (threshold * finalScore) + this.level.unit : 0 - timeTaken;
        this.finalScore = finalScore.toFixed(2);
    }

    renderGameOver = () =>{
        this.cleanRootNode();
        
        const gameOverParent = document.createElement('div');
        gameOverParent.classList.add('gameOver');

        gameOverParent.innerHTML = `
            <div class="score">
                <span>Game Over</span>
                <span>Score : ${this.finalScore}</span>
                <span class="new-game-cta" onclick="startOverNewGame()">
                    Start New Game
                </span>
            </div>
        `;

        this.addToRootNode(gameOverParent);
    }

    renderGameWin = () =>{
        this.cleanRootNode();
        const gameOverParent = document.createElement('div');
        gameOverParent.classList.add('gameOver');

        gameOverParent.innerHTML = `
            <div class="score">
                <span>Kudos Mate! You've Got a Sixth Sense</span>
                <span>Score : ${this.finalScore}</span>
                <span class="new-game-cta" onclick="startOverNewGame()">
                    Start New Game
                </span>
            </div>
        `;

        this.addToRootNode(gameOverParent);
    }

    /*
        Get Random Number
    */
    getRandomInt = maxNum => {
        const min = 0;
        const max = Math.floor(maxNum);

        let resultant = Math.floor(Math.random() * (max - min + 1)) + min;
        if(!resultant){
            this.getRandomInt(maxNum);
        }
        else{
            return resultant;
        }
    };

    /*
        Clean up
    */
    cleanup = () =>{
        this.isStarted = false;
        this.level = null;
        this.rootNode = null;
        this.currentScreen = null;
        this.specialCell = null;
        this.stopwatch = null;
        this.score = null;
        this.attempts = 1;
        this.finalScore = 0;
    }
}
