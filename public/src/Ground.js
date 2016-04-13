var Ground = cc.Node.extend({
	_ground_pieces:null,
	_amountOfGround:0,
	ctor:function(){
		// init
		this._super();

		// instantiate sprite
		this._ground_pieces = new Array();
		var groundSprite = cc.Sprite.create(res.ground_png);
		var gRect = groundSprite.getBoundingBox();
		var wSize = cc.winSize;


		// set position
		this.setPosition(0, 0)

		// detect amount of ground pieces needed
		this._amountOfGround = Math.ceil(wSize.width / gRect.width) + 10;
		var incPosX = Math.ceil(this._amountOfGround / 2) * gRect.width;
		var startPosX = 0; //-incPosX;
		var startPosY = 0;
		// -gRect.height/2;

		// create the ground and adjust position
		for(var i = 0; i < this._amountOfGround; i++){

			// creates ground sprite
			var ground_ith = cc.Sprite.create(res.ground_png);
			ground_ith.setPosition(startPosX, startPosY);
			ground_ith.setAnchorPoint(0, 0);

			// decrement position
			startPosX += gRect.width / 2;
			this.addChild(ground_ith);
			this._ground_pieces.push(ground_ith);
		}

		return true;
	},
	update:function(dt, velocity){

		for(var i = 0; i < this._amountOfGround; i++){

			var ground = this._ground_pieces[i];
			ground.setPositionX(ground.getPositionX() - velocity * dt);

			if (ground.getPositionX() + ground.getBoundingBox().width <= 0){
				ground.setPositionX(cc.winSize.width + ground.getBoundingBox().width);
			}
		}
	},
	getBoundingBox:function(){
		var ground0 = this._ground_pieces[0];
		return cc.rect(
										ground0.getPositionX() + ground0.getBoundingBox().width * 0.5,
										ground0.getPositionY() + ground0.getBoundingBox().height * 0.5,
										cc.winSize.width,
										ground0.getBoundingBox().height);

	}
})
