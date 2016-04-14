var MAX_HOP = 5;

var PlayerState = {
	ALIVE:'ALIVE',
	DEAD:'DEAD'
};

var Player = cc.Node.extend({
	_sprite:null,
	_gravity:-9.8,
	_currentVelocity:1,
	_currentState:null,
	_MIN_HEIGHT:0,
	_MAX_HEIGHT:0,
	ctor:function(){
		// super call
		this._super();

		// set gravity and velocity
		this._currentVelocity = 1;
		this._gravity = -9.8;
		this._isHopping = false;
		this._hopHeight = 0;

		// set current state
		this._currentState = PlayerState.ALIVE;

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
	setMinMaxHeight:function(MIN_HEIGHT,MAX_HEIGHT){
		// set MIN and MAX height that the play can jump to
		this._MIN_HEIGHT = MIN_HEIGHT;
		this._MAX_HEIGHT = MAX_HEIGHT;
	},
	getRect:function(){
		return this._sprite.getBoundingBox();
	},
	getBoundingBox:function(){
		var bb = cc.rect(	this.getPositionX() - this._sprite.getBoundingBox().width * 0.5 * this.getScaleX(),
							this.getPositionY() - this._sprite.getBoundingBox().height * 0.5 * this.getScaleY(),
							this._sprite.getBoundingBox().width * this.getScaleX(),
							this._sprite.getBoundingBox().height * this.getScaleY());
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
	die:function(){
		console.log('Bird Bounding Box:',this.getBoundingBox());
		this._currentState = PlayerState.DEAD;
	},
	update:function(deltaTime, velocity){

		// really need to change to State Pattern
		switch(this._currentState){
			case PlayerState.ALIVE:
				// hopping the jump
				if(this._isHopping)
					this.hopping();
				break;

			case PlayerState.DEAD:
				// just DIE
				break;
		}


		var positionY = this.getPositionY();


		// setup the maximum values to jump to
		if (positionY < this._MAX_HEIGHT && positionY > this._MIN_HEIGHT){
		
			positionY += this._currentVelocity * deltaTime * velocity;
			this._currentVelocity += this._gravity * deltaTime;

			var offsetFromMiddle = (positionY / cc.winSize.height) - 0.5;

			this.setPositionY(positionY);
			this.setRotation(Math.sin(offsetFromMiddle));
			console.log(offsetFromMiddle);		
		}
	}
})
