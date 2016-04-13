var Coin = cc.Node.extend({
	ctor:function(){


		// creates a coin instance
		this._super();

		// instantiate sprite and add to this node
		this._sprite = cc.Sprite.create(res.coin_png);
		this.addChild(this._sprite);

		// set mark as a coin
		this.isCoin = true;

		return true;
	},
	getBoundingBox:function(){
		return this._sprite.getBoundingBox();
	},
	getContentSize:function(){
		return this._sprite.getContentSize();
	}
});
