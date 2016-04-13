var _position = 0;
var Background = cc.Node.extend({
	_back_sprites:null,
	_amount_of_backs:0,
	_boundingBox:null,
	_position:0,
	ctor:function(){

		// super call
		this._super();
		this._back_sprites = new Array();

		// starting this._position
		_position = 0;

		// first sprite
		var _sprite = cc.Sprite.create(res.background_png);
		// add it to this graph pipe
		this.addChild(_sprite);

		// set the scale
		this._boundingBox = _sprite.getBoundingBox();		
		var expScale = cc.winSize.height / this._boundingBox.height;
		_sprite.setScale(expScale);

		// detect amount of backs
		this._amount_of_backs = Math.ceil(cc.winSize.width / this._boundingBox.width) + 1;
		_position = this._boundingBox.width / 2;
		_sprite.setPosition(_position, cc.winSize.height / 2);
		

		

		// add to the handler array
		this._back_sprites.push(_sprite);

		// creates
		for(var i = 1; i < this._amount_of_backs; i++){

			// create, 
			var sprite = cc.Sprite.create(res.background_png);
			// add to this node and to the handler array
			this.addChild(sprite);
			this._back_sprites.push(sprite);

			// this._position and scale
			_position += this._boundingBox.width;
			sprite.setScale(expScale);
			sprite.setPosition(_position, cc.winSize.height / 2);
		}
		
	},
	update:function(dt,velocity){

		
		for(var i = 0; i < this._amount_of_backs; i++){
			var nextPosX = this._back_sprites[i].getPositionX() - dt * velocity / 2;
			this._back_sprites[i].setPositionX(nextPosX);

			// trigger reapear on the right side
			if (this._back_sprites[i].getPositionX() + this._boundingBox.width / 2 <= 0){
				this._back_sprites[i].setPositionX(_position);
			}
		}
		
	}
});