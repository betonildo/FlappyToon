//var plusOrMinus = Math.random()*2|0 || -1;
//var initialDistortion = (Math.random() * (cc.winSize.height - THRESHOLD * 2)) / 2 * plusOrMinus;

var TubesHandler = cc.Node.extend({
	_amountOfTubesPairs:0,
	_tubes:null,
	_positionsSum:0,
	_displacementBetweenTubes:0,
	_distanceBetweenUpAndDown:0,
	_groundheight:0,
	_tubesBoundingBox:null,
	ctor:function(distanceBetween, numOfTubes, groundheight){
		// call super class
		this._super();

		// init this._tubes array
		this._tubes = new Array();

		// get ground height
		this._groundheight = groundheight;

		// get amount of tubes
		this._amountOfTubesPairs = numOfTubes;

		// initialize this._positionsSum
		this._displacementBetweenTubes = cc.winSize.width / 4;
		this._positionsSum = 0;

		// Distance between up and down tube
		this._distanceBetweenUpAndDown = distanceBetween;

		// create tubes this._tubes
		this._createTubes(distanceBetween);

		return true;
	},
	_createTubes:function(distanceBetween){

		for(var i = 0; i < this._amountOfTubesPairs; i++){

			// instantiate and push to the scene
			var tubePair = new TubePair(distanceBetween);
			this.addChild(tubePair);

			// push it to the tubes array
			this._tubes.push(tubePair);

			//get only the first tube creted bounding box
			if (i == 0)
				this._tubesBoundingBox = tubePair.getBoundingBox();

			// set next position of the tubes based on space available on screen
			this._positionsSum += this._displacementBetweenTubes;

			// initial position
			tubePair.setPosition(cc.winSize.width + this._positionsSum, this.randomizeYpos());//cc.winSize.height/2);
		}
	},
	//TODO: create a randomly update to frequency of the tubes
	update:function(dt, velocity){
		for(var i = 0; i < this._amountOfTubesPairs; i++){

			// get tube pair instance to work easely
			var tubePair = this._tubes[i];

			// test tube pair intersection with player
			if (!!this.checkIntersectionWithPlayer){
				this.checkIntersectionWithPlayer(tubePair.getUpRect(), tubePair.getDownRect(), tubePair.getCoinRect(), tubePair);
			}

			// set tube pair next position on this frame
			tubePair.setPositionX(tubePair.getPositionX() - velocity * dt);

			// reuse tube pair to save memory
			if (tubePair.getPositionX() + tubePair.getBoundingBox().width <= 0){
				tubePair.setPositionX(this._positionsSum);

				// TODO: Randomize the y position with a displacement

				tubePair.setPositionY(this.randomizeYpos());
				// TODO: After a while (time or coins), reduce the distance between tubes
				// Add coin again on reapearance
				tubePair.insertCoinAgain();
			}
		}
	},
	randomizeYpos:function(){
		var plusOrMinus = Math.random()*2|0 || -1;
		var desloc = cc.winSize.height*0.5 + this._groundheight*0.5;
		var restOfSpace = cc.winSize.height*0.5 - this._groundheight*0.5 - this._distanceBetweenUpAndDown * 0.25;
		var distortion = desloc + (Math.random() * restOfSpace) * plusOrMinus;
		// distortion = desloc + restOfSpace;
		return distortion;
	}
})
