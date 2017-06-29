var rocket;
var food;
var population;
var airBubbles;
var lifespan = 60 * 24; //60 minutes for 24 hours
var lifespanDisplayZeros = '0';
var lifeP;
var count = 0;
var target;
var maxForce = 0.2;
var rocketRecoverySpeed = 0.1;

var rocketCount = 10;

var rx = 100;
var ry = 150;
var rw = 200;
var rh = 10;

var canvasWidth = window.innerWidth * 0.7;
var canvasHeight = window.innerHeight * 0.8;

var targetX = canvasWidth / 2;
var targetY = 50;

var buyButton;

var sellButton;

var feedButton;
var hasTheFeedButtonBeenPressed = false;
var foodDropsCount = 0;
var foodDroplets = []
var maxFoodSupply = 15;
//var inventoryDropdown;

var airReleaseButton;
var hasTheAirButtonBeenPressed = false;
var airBubblesCount = 0;
var maxAirBubblesCount = 10;

var moneyAmount = 500;

var updatedRockets;
var updatedFoodDroplets;

function setup() {
	var canvas = createCanvas(canvasWidth, canvasHeight/*400, 300*/);
	canvas.parent('aquarium-tank');
	
	rocket = new Rocket();
	population = new Population();
	food = new FoodDroplets(/*maxFoodSupply*/);
	airBubbles = new AirBubbles();  

	lifeP = createP(); //html <p>
	lifeP.parent('lifespan-timer')
	
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

  	// inventoryDropdown = createSelect();
  	// inventoryDropdown.option('Fish');
  	// inventoryDropdown.option('Food');
  	// inventoryDropdown.parent('inventory-select');

  	feedButton = createButton('Feed');
  	feedButton.parent('feed-option');
  	feedButton.mousePressed(dropFood);

  	moneyP = createP();
  	moneyP.parent('money-amount');
}

function draw() {
	background(5, 25, 50);
	target.x = targetX;
	target.y = targetY;
	// rocket.update();
	// rocket.show();
	population.run();
	
	manageTimer();
	
	moneyP.html(moneyAmount + "$");

	count++;

	if (count == lifespan) {
		//population = new Population();
		population.evaluate();
		population.selection();
		count = 0;	
	}

	updatedRockets = population.getRockets();

	// fill(255);
	// rect(rx, ry, rw, rh);	

	if (hasTheFeedButtonBeenPressed) {
		food.dropDown();
		updatedFoodDroplets = food.getFoodDrops();
		food.checkForEatenFood();
	}

	if (hasTheAirButtonBeenPressed) {
		airBubbles.flyUp();
		updatedAirBubbles = airBubbles.getAirBubbles();
		airBubbles.checkForBreathedAir();
	}

	ellipse(target.x, target.y, 16, 16);
}

function releaseAir() {
	hasTheAirButtonBeenPressed = true;
	
	if(airBubblesCount < maxAirBubblesCount) {
		airBubblesCount++;
	}
}

function AirBubbles() {
	this.airBubbles = [];
	this.airBubblesCount = maxAirBubblesCount;

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
		for (var i = 0; i < rocketCount; i++) {
			for (var j = 0; j < airBubblesCount; j++) {
				if (dist(updatedRockets[i].pos.x, updatedRockets[i].pos.y, updatedAirBubbles[j].pos.x, updatedAirBubbles[j].pos.y) < 15) {
					this.airBubbles.splice(j, 1);
					airBubblesCount--;					
				}
			}
		}	

	}
}

function dropFood() {
	hasTheFeedButtonBeenPressed = true;
	
	if(maxFoodSupply > foodDropsCount) {
		foodDropsCount++;
	}
}

function FoodDroplets() {
	this.foodDroplets = [];
	this.foodcount = maxFoodSupply;

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
		for (var i = 0; i < rocketCount; i++) {
			for (var j = 0; j < foodDropsCount; j++) {
				if (dist(updatedRockets[i].pos.x, updatedRockets[i].pos.y, updatedFoodDroplets[j].pos.x, updatedFoodDroplets[j].pos.y) < 15) {
					this.foodDroplets.splice(j, 1);
					foodDropsCount--;					
				}
			}
		}	

	}
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

function buy() {
	// var greeting = createElement('h2', 'asdasdas');
	// fill(255);
	// greeting.position(canvasWidth/2, canvasHeight/2);
	// greeting.html("fafafvz");
	moneyAmount -= 50;
}

function sell() {
	moneyAmount += 50;
}

function Population() {
	this.rockets = [];
	this.popsize = rocketCount;
	this.matingPool = [];

	for (var i = 0; i < this.popsize; i++) {
		this.rockets[i] = new Rocket();
	}

	//rockets = this.rockets;

	this.getRockets = function() {
		return this.rockets;
	}

	this.evaluate = function() {
		var maxfit = 0;

		for (var i = 0; i < this.popsize; i++) {
			this.rockets[i].calcFitness();
			if (this.rockets[i].fitness > maxfit) {
				maxfit = this.rockets[i].fitness;
			}
		}


		for (var i = 0; i < this.popsize; i++) {
			this.rockets[i].fitness /= maxfit; // might be divide by 0
		}

		this.matingpool = [];


		for (var i = 0; i < this.popsize; i++) {
			var n = this.rockets[i].fitness * 100;

			for (var j = 0; j < n; j++) {
				this.matingpool.push(this.rockets[i]);
			}
		}
	}

	this.selection = function() {
		var newRockets = [];

		for (var i = 0; i < this.rockets.length; i++) {
			var parentA = random(this.matingpool).dna; //random(this.matingPool[]) picks a random element from the array
			var parentB = random(this.matingpool).dna;
			var child =  parentA.crossover(parentB);	
			child.mutation();
			newRockets[i] = new Rocket(child);
		}

		this.rockets = newRockets;
	}

	this.run = function() {	
		for (var i = 0; i < this.popsize; i++) {
			this.rockets[i].update();
			this.rockets[i].show();
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
			if (random(1) < 0.01) {
				this.genes[i] = p5.Vector.random2D();
				this.genes[i].setMag(maxForce);
			}
		}
	}
}


function Rocket(dna) {
	this.pos = createVector(width/2, height/2);
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
			targetX = random(canvasWidth);
			targetY = random(canvasHeight);	
		}

		if (this.crashed) {
			this.fitness /= 10;
		}
	}

	this.update = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		if (d < 10) {
			this.completed = true;
			this.pos = target.copy();
		}

		// if (this.pos.x > rx && this.pos.x < rx + rw && this.pos.y > ry && this.pos.y < ry + rh) {
		// 	this.crashed = true;
		// } else {
		// 	this.crashed = false;
		// }

		if (this.pos.y > height || this.pos.y < 0) {
			this.crashed = true;
			if (this.pos.y > height) {
				//this.crashRecovery.add(0, -10);
				this.crashRecoveryY = -rocketRecoverySpeed;
			}
			if (this.pos.y < 0) {
				//this.crashRecovery.add(0, 10);
				this.crashRecoveryY = rocketRecoverySpeed;
			}
		} else {
			this.crashed = false;
		}

		if (this.pos.x > width || this.pos.x < 0) {
			this.crashed = true;
			if (this.pos.x > width) {
				//this.crashRecovery.add(-10, 0);
				this.crashRecoveryX = -rocketRecoverySpeed; 
			}
			if (this.pos.x < 0) {
				//this.crashRecovery.add(10, 0);	
				this.crashRecoveryX = rocketRecoverySpeed;
			}
		} else {
			this.crashed = false;
		}

		

		this.applyForce(this.dna.genes[count]);

		this.crashRecovery.add(this.crashRecoveryX, this.crashRecoveryY);

		if (!this.completed && this.crashed) {
			this.vel = (this.crashRecovery);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.vel.limit(4);
			this.crashRecovery.mult(0);
		}

		if (!this.completed && !this.crashed) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.vel.limit(4);
		}
	}

	this.show = function() {
		push();
		noStroke();
		fill(255, 100);
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0, 0, 25, 5);
		pop();
	}
}

function AirBubble() {
	this.pos = createVector(random(width), height);
	this.vel = createVector(0, -random(0.5) - 0.1);
	this.acc = createVector();
	
	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.vel.limit(4);
	}

	this.show = function() {
		push();		
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		ellipse(0, 0, 8, 8)
		pop();
	}
}

function Food() {
	this.pos = createVector(random(width), 0);
	this.vel = createVector(0, random(0.5) + 0.1);
	this.acc = createVector();
	
	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.vel.limit(4);
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
