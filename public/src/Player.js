var MAX_HOP = 5;

var Player = cc.Node.extend({
	_sprite:null,
	_gravity:-9.8,
	_currentVelocity:1,
	ctor:function(){
		// super call
		this._super();

		// set gravity and velocity
		this._currentVelocity = 1;
		this._gravity = -9.8;
		this._isHopping = false;
		this._hopHeight = 0;

		// time
		this._elapsedTime = 0;

		// creates its sprites
		this._sprite = cc.Sprite.create(res.bird_png);
		this._box = cc.Sprite.create(res.blank_png);

		// add it to this node
		this.addChild(this._box);
		this.addChild(this._sprite);

		// configure
		// aux
		var size = cc.winSize;
		this.setPosition(size.width/2, size.height/2);
		this.setScale(0.1);

		// set the box content size to the size of the node
		this._box.setContentSize(this._sprite.getContentSize());

		var self = this;

		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
	    	cc.eventManager.addListener(
	    	{
	    		event: cc.EventListener.KEYBOARD,
	    		// flappy the bird
	    		// NOTE: Did it here, because the context switch when using this and extend
	    		onKeyPressed:function(key){
	    			if (key === 32) self.startHopping();
				},
				onKeyReleased:function(key){
					if (key === 32) self.stopHopping();
				}
	    	}, self);

	    	cc.eventManager.addListener({
	    		event:cc.EventListener.MOUSE,
	    		onMouseDown:function(event){
		            if ( event.getButton() == cc.EventMouse.BUTTON_LEFT )
						self.startHopping();
		        },
		        onMouseUp:function(event){
		        	if ( event.getButton() == cc.EventMouse.BUTTON_LEFT )
		        		self.stopHopping();
		        }
	    	}, self);
		}

		return true;
	},
	getRect:function(){
		return this._sprite.getBoundingBox();
	},
	getBoundingBox:function(){
		var bb = cc.rect(	this.getPositionX(),
											this.getPositionY(),
											this.getRect().width * this.getScale(),
											this.getRect().height * this.getScale());
		return bb;
	},
	startHopping:function(){
		this._hopHeight = 0;
		this._isHopping = true;
	},
	stopHopping:function(){
		this._currentVelocity = this._hopHeight;
		this._isHopping = false;
	},
	hopping:function(){
		if (this._hopHeight < MAX_HOP){
			this._hopHeight++;
			//console.log(this._hopHeight);
		}
		/// trigger jump
		else this.stopHopping();
	},
	update:function(deltaTime, velocity){

		// hopping the jump
		if(this._isHopping)
			this.hopping();


		var positionY = this.getPositionY();
		positionY += this._currentVelocity * deltaTime * velocity;
		this._currentVelocity += this._gravity * deltaTime;

		var screenPercentage = (positionY - cc.winSize.height * 2) / cc.winSize.height;
		this.setPositionY(positionY);
		this.setRotation(Math.sin(screenPercentage));
	}
})
