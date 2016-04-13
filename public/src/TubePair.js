var TubePair = cc.Node.extend({
	_up:null,
	_down:null,
	_self:null,
	_coin:null,
	_hasRemovedCoin:false,
	_distanceBetween:0,
	ctor:function(distanceBetween){
		// call super class
		this._super();

		// creates up tube sprite
		this._up = cc.Sprite.create(res.tube_png);
		this._down = cc.Sprite.create(res.tube_png);

		// creates the coin instance
		this._coin = new Coin();
		this._coin.isCoin = true;

		// add coin to the middle
		this.addChild(this._coin);

		// add it to it's node
		this.addChild(this._up);
		this.addChild(this._down);

		// configure their complementary position
		// and distance between tubes
		this._distanceBetween = distanceBetween;
		this._setRelativePostionsAndDistance(distanceBetween);

		return true;
	},
	_setRelativePostionsAndDistance:function(distanceBetween){


		// setup UP tube
		var _upBox = this._up.getBoundingBox();
		this._up.setScaleX(1.5); // by using the same sprite, "flip" image
		this._up.setScaleY(-1.5);
		this._up.setPosition(0, _upBox.height / 2 + distanceBetween / 2);


		// setup DOWN tube
		var _downBox = this._down.getBoundingBox();
		this._down.setScaleX(1.5);
		this._down.setScaleY(1.5);
		this._down.setPosition(0, -_downBox.height / 2 - distanceBetween / 2);

		// Coin
		var scaleFactor = this._coin.getBoundingBox().width / distanceBetween / 4;
		this._coin.setPosition(0, 0);
		this._coin.setScale(scaleFactor * 0.6, scaleFactor);
	},
	getBoundingBox:function(){
		return cc.rect(
			// positions
			// X
			this.getPositionX(),
			//Y
			this.getPositionY(),

			// Dimensions
			// WIDTH
			this._up.getBoundingBox().width,
			// HEIGHT
			this._up.getBoundingBox().height * 2 + this._distanceBetween);
	},
	getUpRect:function(){
		var uRect = this._up.getBoundingBox();
		return cc.rect(	this.getPositionX(),
										uRect.y + cc.winSize.height,
										uRect.width,
										uRect.height);
	},
	getDownRect:function(){
		var dRect = this._down.getBoundingBox();
		console.log(dRect);
		return cc.rect(	this.getPositionX(),
										dRect.y + cc.winSize.height,
										dRect.width,
										dRect.height);
	},
	getCoinRect:function(){
		if (!this._hasRemovedCoin){
			var cRect = this._coin.getContentSize();
			var rRect = cc.rect(	this.getPositionX() - (cRect.width * this._coin.getScaleX()) * 0.25,
														this.getPositionY(),
														cRect.width * this._coin.getScaleX(),
														cRect.height);
			return rRect;

		}
		return cc.rect(cc.winSize.width, cc.winSize.height, 1, 1);

	},
	removeCoin:function(){
		if(!this._hasRemovedCoin){
			this._hasRemovedCoin = true;
			this._coin.removeFromParentAndCleanup(true);
		}
	},
	insertCoinAgain:function(){
		if (this._hasRemovedCoin){
			this._hasRemovedCoin = false;
			this.addChild(this._coin);
		}
	}
})
