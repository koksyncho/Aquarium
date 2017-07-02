//Fish global variables
var fish;
var fishCount = 10;
var beginningFishSize = 25;
var currentFishSizes = [];
var fishRecoverySpeed = 0.2;
var indexOfTheBiggestFish = 0;
var biggestSizeOfAFish = beginningFishSize;
var maxForce = 0.2;
var updatedfishs;
var fishMutationChance = 0.5;

var population;

//html <p>'s
var lifeP;
var dayP;
var foodStockP;
var airStockP;

//Time related
var lifespan = 60 * 5/** 24*/; //60 minutes per hour for 24 hours
var lifespanDisplayZeros = '0';
var count = 0;
var currentDay = 1;
var dayLimit = 4;
var dayOfLastPurchase = -1;

//Canvas
var canvasWidth = window.innerWidth * 0.7;
var canvasHeight = window.innerHeight * 0.8;

//Invisible target
var target;
var targetX = canvasWidth / 2;
var targetY = 50;

//html <button>'s
var buyButton;
var sellButton;
var saveAndExitButton;
var feedButton;
var airReleaseButton;

//Food drops
var food;
var hasTheFeedButtonBeenPressed = false;
var foodDropsCount = 0;
//var foodDroplets = [];
var foodDropletsConsumed = [];
var maxFoodSupply = 15;
var foodSupplyLeft = maxFoodSupply;
var unconsumedFoodDropsOnScreen = 0;
var priceForADropOfFood = 5;
var updatedFoodDroplets;

//Air bubbles
var airBubbles;
var hasTheAirButtonBeenPressed = false;
var airBubblesCount = 0;
var airConsumed = [];
var maxAirBubblesCount = 10;
var airSupplyLeft = maxAirBubblesCount;
var unconsumedAirBubblesOnScreen = 0;
var updatedAirBubbles;

//Money related
var moneyAmount = 500;
var dailyIncome = 50; 

function setup() {
	for (var i = 0; i < fishCount; i++) {
		foodDropletsConsumed[i] = 0;
		airConsumed[i] = 0;
		currentFishSizes[i] = beginningFishSize;
	}

	var canvas = createCanvas(canvasWidth, canvasHeight/*400, 300*/);
	canvas.parent('aquarium-tank');
	
	fish = new Fish();
	population = new Population();
	food = new FoodDroplets(/*maxFoodSupply*/);
	airBubbles = new AirBubbles();  

	lifeP = createP(); //html <p>
	lifeP.parent('lifespan-timer');
	
	dayP = createP();
	dayP.parent('day-timer');

	foodStockP = createP();
	foodStockP.parent('food-stock-info');

	airStockP = createP();
	airStockP.parent('air-stock-info');

	target = createVector(targetX, targetY);

	buyButton = createButton('Buy');
	buyButton.parent('buy-option');
  	buyButton.mousePressed(buy);

  	sellButton = createButton('Sell');
	sellButton.parent('sell-option');
  	sellButton.mousePressed(sell);

	airReleaseButton = createButton('Air');
	airReleaseButton.parent('air-option');
  	airReleaseButton.mousePressed(releaseAir);

  	feedButton = createButton('Feed');
  	feedButton.parent('feed-option');
  	feedButton.mousePressed(dropFood);

	saveAndExitButton = createButton('Save & Exit');
	saveAndExitButton.parent('save-option');
	saveAndExitButton.mousePressed(saveAndExitGame);

  	moneyP = createP();
  	moneyP.parent('money-amount');
}

function draw() {
	background(15, 94, 156, 80)//90,188,216, 80);//5, 25, 50);
	if (currentDay < dayLimit) {

	target.x = targetX;
	target.y = targetY;
	
	population.run();
	
	manageTimer();
	manageStock();
	
	moneyP.html(moneyAmount + "$");
	dayP.html(currentDay);

	count++;

	if (count == lifespan) {
		//population = new Population();
		population.evaluate();
		population.selection();
		getDailyIncome();

		airBubblesCount = maxAirBubblesCount - airSupplyLeft + unconsumedAirBubblesOnScreen; //unconsumedAirBubblesOnScreen;
		airSupplyLeft = maxAirBubblesCount - airBubblesCount;
		unconsumedAirBubblesOnScreen = 0;	
		
		count = 0;
		currentDay++;	
	}

	updatedfishs = population.getfishs();

	manageFoodDrops();
	
	manageAirDrops();
	

	} else {
		displayEndingInformation();
	}

	generateTerrain();
}


function displayEndingInformation() {
	findTheBiggestFish();
	//console.log(currentFishSizes[indexOfTheBiggestFish] + " " + biggestSizeOfAFish + " " + indexOfTheBiggestFish);
	updatedfishs[indexOfTheBiggestFish].update();
	updatedfishs[indexOfTheBiggestFish].show(indexOfTheBiggestFish, foodDropletsConsumed[indexOfTheBiggestFish], airConsumed[indexOfTheBiggestFish]);
	textSize(16);
	fill(1, 166, 17);
	text("Fish N." + indexOfTheBiggestFish + " won! It ate " + foodDropletsConsumed[indexOfTheBiggestFish] + " drops of food and " + airConsumed[indexOfTheBiggestFish] + " air bubbles. It became first with a size of " + biggestSizeOfAFish + ".", canvasWidth / 2 - canvasWidth / 5, canvasHeight / 2 - canvasHeight / 5, canvasWidth / 2.5, canvasHeight / 2.5);
}

function generateTerrain() {
	
	//sand at the bottom
	noStroke();
	fill(254, 123, 51, 150);
	rect(0, height - 50, canvasWidth, 50);
	
	//plants
	fill(164,251,166, 150);
	for (var i = 3; i < 7; i++) {
		rect(canvasWidth/(i), height - 50, 3, -(canvasHeight)/5);	
		rect(canvasWidth-canvasWidth/(i), height - 50, 3, -(canvasHeight)/5);	
		for (var j = 1; j < 5; j++) {
			rect(canvasWidth/(i), height - 50*j/2 - 35, 15, 3);	
			rect(canvasWidth/(i), height - 50*j/2 - 45, -15, 3);	
			rect(canvasWidth-canvasWidth/(i), height - 50*j/2 - 35, -15, 3);			
			rect(canvasWidth-canvasWidth/(i), height - 50*j/2 - 45, 15, 3);			
		}	
	}

	//rock
	fill(150, 150, 150, 150);
	//rotate(-HALF_PI);
  	//arc(canvasWidth/2, height - 50, canvasWidth/7, 100, PI);
	translate(width/2, height/2);
	rotate(HALF_PI + HALF_PI);
	arc(0, -height/2 + 50, 150, 70, 0, PI);
	//ellipse(canvasWidth/2, height - 50, canvasWidth/7, 100);

}

function getDailyIncome() {
	moneyAmount += dailyIncome;
}

function saveAndExitGame() {
	//TODO
	//pass data and save it in the database
	window.open("index.jsp", "__self"); 
}

function manageStock() {
  	airStockP.html(airSupplyLeft + " - " + airBubblesCount + "/" + maxAirBubblesCount);	
  	foodStockP.html(foodSupplyLeft + " - " + foodDropsCount + "/" + maxFoodSupply);
}

function manageTimer() {
	if (count / 60 < 10 || count % 60 < 10) {
		if (count / 60 < 10) {
			lifeP.html(lifespanDisplayZeros + Math.floor(count / 60) + ":" + Math.floor(count % 60));
		} 
		if (count % 60 < 10) {
			lifeP.html(Math.floor(count / 60) + ":" + lifespanDisplayZeros + Math.floor(count % 60));
		}
		if (count / 60 < 10 && count % 60 < 10) {
			lifeP.html(lifespanDisplayZeros + Math.floor(count / 60) + ":" + lifespanDisplayZeros + Math.floor(count % 60));	
		}
	} else {
		lifeP.html(Math.floor(count / 60) + ":" + Math.floor(count % 60));	
	}
}

function manageFoodDrops() {
	if (hasTheFeedButtonBeenPressed) {
		food.dropDown();
		updatedFoodDroplets = food.getFoodDrops();
		food.checkForEatenFood();
	}
}

function manageAirDrops() {
	if (hasTheAirButtonBeenPressed/* && (unconsumedAirBubblesOnScreen + airSupplyLeft + airBubblesCount <= maxAirBubblesCount)*/) {
		airBubbles.flyUp();
		updatedAirBubbles = airBubbles.getAirBubbles();
		airBubbles.checkForBreathedAir();
	}
}

function mousePressed() {
  	for (var i = 0; i < fishCount; i++) { 
		if (dist(updatedfishs[i].pos.x, updatedfishs[i].pos.y, mouseX, mouseY) < currentFishSizes[i]) {
			console.log("Touched fish " + i);				
		}
	}
}

function releaseAir() {
	hasTheAirButtonBeenPressed = true;

	if (airSupplyLeft > 0) {
		airSupplyLeft--;	
	}

	if((airBubblesCount - unconsumedAirBubblesOnScreen) < maxAirBubblesCount && airSupplyLeft >= 0) {
		airBubblesCount++;
	}
}

function AirBubbles() {
	this.airBubbles = [];
	this.airBubblesCount = maxAirBubblesCount * dayLimit;

	for (var i = 0; i < this.airBubblesCount; i++) {
		this.airBubbles[i] = new AirBubble();
	}

	this.getAirBubbles = function() {
		return this.airBubbles;
	}

	this.flyUp = function() {	
		this.airBubblesCount = airBubblesCount;
		for (var i = 0; i < this.airBubblesCount; i++) {
			this.airBubbles[i].update();
			this.airBubbles[i].show();
		}
	}

	this.checkForBreathedAir = function() {	
		for (var i = 0; i < fishCount; i++) {
			for (var j = 0; j < airBubblesCount; j++) {
				if (dist(updatedfishs[i].pos.x, updatedfishs[i].pos.y, updatedAirBubbles[j].pos.x, updatedAirBubbles[j].pos.y) < currentFishSizes[i]) {
					this.airBubbles.splice(j, 1);
					airBubblesCount--;
					airConsumed[i]++;	
					unconsumedAirBubblesOnScreen--;				
				}
			}
		}	

	}
}

function dropFood() {
	hasTheFeedButtonBeenPressed = true;
	
	if (foodSupplyLeft > 0) {
		foodSupplyLeft--;
	}
	
	if(maxFoodSupply > (foodDropsCount - unconsumedFoodDropsOnScreen) && foodSupplyLeft >= 0) {
		foodDropsCount++;
	} 
}

function FoodDroplets() {
	this.foodDroplets = [];
	this.foodcount = maxFoodSupply * dayLimit;

	for (var i = 0; i < this.foodcount; i++) {
		this.foodDroplets[i] = new Food();
	}

	this.getFoodDrops = function() {
		return this.foodDroplets;
	}

	this.dropDown = function() {
		this.foodcount = foodDropsCount;	
		
		for (var i = 0; i < this.foodcount; i++) {
			this.foodDroplets[i].update();
			this.foodDroplets[i].show();
		}
	}

	this.checkForEatenFood = function() {	
		for (var i = 0; i < fishCount; i++) {
			for (var j = 0; j < foodDropsCount; j++) {
				if (dist(updatedfishs[i].pos.x, updatedfishs[i].pos.y, updatedFoodDroplets[j].pos.x, updatedFoodDroplets[j].pos.y) < currentFishSizes[i]) {
					this.foodDroplets.splice(j, 1);
					foodDropsCount--;	
					foodDropletsConsumed[i]++;
					unconsumedFoodDropsOnScreen--;	
				}
			}
		}	

	}
}

function buy() {
	// var greeting = createElement('h2', 'asdasdas');
	// fill(255);
	// greeting.position(canvasWidth/2, canvasHeight/2);
	// greeting.html("fafafvz");
	if (dayOfLastPurchase != currentDay ) {
		foodDropsCount = maxFoodSupply - foodSupplyLeft + unconsumedFoodDropsOnScreen;
		foodSupplyLeft = maxFoodSupply - foodDropsCount;
		moneyAmount -= priceForADropOfFood * (-1) * unconsumedFoodDropsOnScreen;
		unconsumedFoodDropsOnScreen = 0;
		dayOfLastPurchase = currentDay;	
	} else {
		console.log("You already went to the store today today.");
	}
}

function sell() {
	console.log("You sold a piece of furniture from your house in order to feed your aquarium.");
	moneyAmount += 50;
}

function findTheBiggestFish() {
	for (var i = 0; i < fishCount; i++) {
		if (biggestSizeOfAFish < currentFishSizes[i]) {
			biggestSizeOfAFish = currentFishSizes[i];
			indexOfTheBiggestFish = i;
		}
	}
}

function Population() {
	this.fishs = [];
	this.popsize = fishCount;
	this.matingPool = [];

	for (var i = 0; i < this.popsize; i++) {
		this.fishs[i] = new Fish();
	}

	//fishs = this.fishs;

	this.getfishs = function() {
		return this.fishs;
	}

	this.evaluate = function() {
		var maxfit = 0;

		for (var i = 0; i < this.popsize; i++) {
			this.fishs[i].calcFitness();
			if (this.fishs[i].fitness > maxfit) {
				maxfit = this.fishs[i].fitness;
			}
		}


		for (var i = 0; i < this.popsize; i++) {
			this.fishs[i].fitness /= maxfit; // might be divide by 0
		}

		this.matingpool = [];


		for (var i = 0; i < this.popsize; i++) {
			var n = this.fishs[i].fitness * 100;

			for (var j = 0; j < n; j++) {
				this.matingpool.push(this.fishs[i]);
			}
		}
	}

	this.selection = function() {
		var newfishs = [];

		for (var i = 0; i < this.fishs.length; i++) {
			var parentA = random(this.matingpool).dna; //random(this.matingPool[]) picks a random element from the array
			var parentB = random(this.matingpool).dna;
			var child =  parentA.crossover(parentB);	
			child.mutation();
			newfishs[i] = new Fish(child, this.fishs[i].pos.x, this.fishs[i].pos.y);
		}

		this.fishs = newfishs;
	}

	this.run = function() {	
		for (var i = 0; i < this.popsize; i++) {
			this.fishs[i].update();
			this.fishs[i].show(i, foodDropletsConsumed[i], airConsumed[i]);
		}
	}
}

function DNA(genes) {
	if (genes) {
		this.genes = genes;
	} else {
		this.genes = [];

		for (var i = 0; i < lifespan; i++) {
			this.genes[i] = p5.Vector.random2D();
			this.genes[i].setMag(maxForce);
		}	
	}

	this.crossover = function(partner) {
		var newgenes = [];
		var mid = floor(random(this.genes.length));
		for (var i = 0; i < this.genes.length; i++) {
			if (i > mid) {
				newgenes[i] = this.genes[i];
			} else {
				newgenes[i] = partner.genes[i];
			}
		}
		return new DNA(newgenes);
	}

	this.mutation = function() {
		for (var i = 0; i < this.genes.length; i++) {
			if (random(1) < fishMutationChance/*0.01*/) {
				this.genes[i] = p5.Vector.random2D();
				this.genes[i].setMag(maxForce);
			}
		}
	}
}


function Fish(dna, posX, posY) {
	if (posX && posY) {
		this.pos = createVector(posX, posY);
	} else {
		this.pos = createVector(width/2, height/2);
	}
	this.vel = createVector();
	this.acc = createVector();
	this.crashed = false;
	this.crashRecovery = createVector();
	this.crashRecoveryX = 0;
	this.crashRecoveryY = 0;
	this.completed = false;
	if (dna) {
		this.dna = dna;
	} else {
		this.dna = new DNA();	
	}
	this.fitness = 0;

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.calcFitness = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);

		this.fitness = map(d, 0, width, width, 0);
	
		if (this.completed) {
			this.fitness *= 10;	
		}

		if (this.crashed) {
			this.fitness /= 10;
		}
	}

	this.update = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		if (d < 10) {
			this.completed = true;

			targetX = random(canvasWidth);
			targetY = random(canvasHeight);
			//this.pos = target.copy();
		}


		if (this.pos.y > height - 50 - 10 || this.pos.y < 10) {
			this.crashed = true;
			if (this.pos.y > height - 50 - 10) {
				//this.crashRecovery.add(0, -10);
				this.crashRecoveryY = -fishRecoverySpeed;
			}
			if (this.pos.y < 10) {
				//this.crashRecovery.add(0, 10);
				this.crashRecoveryY = fishRecoverySpeed;
			}
		}

		if (this.pos.x > width || this.pos.x < 0) {
			this.crashed = true;
			if (this.pos.x > width) {
				//this.crashRecovery.add(-10, 0);
				this.crashRecoveryX = -fishRecoverySpeed; 
			}
			if (this.pos.x < 0) {
				//this.crashRecovery.add(10, 0);	
				this.crashRecoveryX = fishRecoverySpeed;
			}
		} 


		if (this.pos.y < height - 50 - 10 && this.pos.y > 10 && this.pos.x < width && this.pos.x > 0) {
			this.crashed = false;
		}

		//if it hits the rock
		if (this.pos.x < width/2 + 75 && this.pos.x > width/2 - 75 && this.pos.y > height - 50 - 10 - 40) {
			this.crashRecoveryY = -fishRecoverySpeed;
			this.crashed = true;
		}		

		this.applyForce(this.dna.genes[count]);
		this.recovery = createVector(this.crashRecoveryX, this.crashRecoveryY);
		this.crashRecovery.add(this.recovery);

		if (/*!this.completed && */this.crashed) {
			this.vel = (this.crashRecovery);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.crashRecovery.mult(0);
			this.vel.limit(4);
		}

		//the commented line stops the fish upon reaching the target
		if (/*!this.completed && */!this.crashed) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.vel.limit(4);
		}
	}

	this.show = function(fishIndex, foodConsumptionBonus, airConsumptionBonus) {
		this.sizeBonus = foodConsumptionBonus * 5 + airConsumptionBonus;
		currentFishSizes[fishIndex] = beginningFishSize + this.sizeBonus;
		push();
		noStroke();
		if (fishIndex % 2 == 0) {
			fill(255, 204, 0, 150);//(255, 100);	
		} else if (fishIndex % 3 == 0) {
			fill(174, 219, 23, 150);//(255, 100);	
		} else {
			fill(217, 73, 41, 150);
		}
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0, 0, beginningFishSize + this.sizeBonus, beginningFishSize/5 + this.sizeBonus);
		pop();
	}
}

function AirBubble() {
	this.pos = createVector(random(width), height - 50 - 10);
	// var turningVariable = random(2) < 1;
	// var turningDirection;
	// if (turningVariable) {
	// 	turningDirection = random(2);
	// } else {
	// 	turningDirection = random(-2);
	// }
	this.vel = createVector(0/*turningDirection*/, -random(0.5) - 2);
	this.acc = createVector();
	
	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		if (this.pos.y > 10) {
		
			// if (random(2) < 1) {
			// 	turningDirection = random(0.1);
			// } else {
			// 	turningDirection = random(-0.1);
			// }
			//this.vel.add(turningDirection, 0);
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.vel.limit(4);
		}
	}

	this.show = function() {
		push();		
		noFill();
		stroke(255);
		strokeWeight(3);  // Thicker
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		ellipse(0, 0, 8, 8);
		pop();
	}
}

function Food() {
	this.pos = createVector(random(width), 0);
	// var turningVariable = random(2) < 1;
	// var turningDirection;
	// if (turningVariable) {
	// 	turningDirection = random(-0.5);
	// } else {
	// 	turningDirection = random(0.5);
	// }
	this.vel = createVector(0/*turningDirection*/, random(0.5) + 2);
	this.acc = createVector();
	
	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		if (this.pos.y < height - 50 - 10) {
			if (this.pos.x < width/2 + 75 && this.pos.x > width/2 - 75 && this.pos.y > height - 50 - 10 - 40) {
				//stop the food piece if it hits the boulder
			} else {
				this.vel.add(this.acc);
				this.pos.add(this.vel);
				this.acc.mult(0);
				this.vel.limit(4);	
			}	
		} //else {
			//this.pos.add(0, 0);
		//}
	}

	this.show = function() {
		push();
		noStroke();
		fill(255, 100, 80);
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0, 0, 10, 5);
		pop();
	}
}