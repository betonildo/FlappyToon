var ScoreLayer = cc.Layer.extend({
    ctor:function(){
      // call to super class
      this._super();

      // Creates the score layer

    }
});

var GameLayer = cc.Layer.extend({
    _bird: null,
    _tubesHandler:null,
    _child_nodes:null,
    _ground:null,
    _paused:false,
    _background:null,
    _points:0,
    _label:null,
    _scoreLayer:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        // markup self reference
        var self = this;

        // start the definition of points
        this._points = 0;

        // set score layer
        this._scoreLayer = new ScoreLayer();
        this.addChild(this._scoreLayer);

        // score show _label
        this._label = new cc.LabelTTF( "Score: " + this._points.toString(), res.ComicSansMSNormal, 48 );
        this._label.setPosition(cc.winSize.width / 2, cc.winSize.height - 50);
        this.addChild(this._label, 10);

        // add background
        this._background = new Background();
        this.addChild(this._background);

        // instantiate player
        this._bird = new Player();
        this.addChild(this._bird);

        // creates this._ground
        this._ground = new Ground();
        this.addChild(this._ground, 5);

        // threshold will be 1.5 this._bird size

        this._tubesHandler = new TubesHandler(this._bird.getBoundingBox().height * 7, 10, this._ground.getBoundingBox().height);
        this._tubesHandler.checkIntersectionWithPlayer = function(tubeUpRect, tubeDownRect, coinRect, tubePair){
          var birdRect = self._bird.getBoundingBox();
          console.log(tubeDownRect)
          var hasIntersectedTube =
              cc.rectIntersectsRect(tubeUpRect, birdRect) ||
              cc.rectIntersectsRect(tubeDownRect, birdRect);
          var hasIntersectedGround = cc.rectIntersectsRect(self._ground.getBoundingBox(), birdRect);
          var hasIntersectedCoin = cc.rectIntersectsRect(coinRect, birdRect);

          if (hasIntersectedTube || hasIntersectedGround){
            console.log("Tube Or Ground!! Game Over!!!");
            console.log(self._bird.getBoundingBox());
            self._paused = true;
            self.gameOver();
          }
          else if (hasIntersectedCoin){
            self.earnPoint();
            tubePair.removeCoin();
            console.log("Coin!!!! Point!");
          }
        };

        this.addChild(this._tubesHandler, 4);

        // instantiate this._child_nodes
        this._child_nodes = new Array();
        // background node doesn't need to be watched with containing node
        this._child_nodes.push(this._background);
        this._child_nodes.push(this._ground);
        this._child_nodes.push(this._bird);
        this._child_nodes.push(this._tubesHandler);

        // active update function
        this.scheduleUpdate();

        // if we have keyboard, handle key to jump by
        if (cc.sys.capabilities.hasOwnProperty('keyboard'))
        {
            cc.eventManager.addListener({
                event : cc.EventListener.KEYBOARD,
                onKeyPressed: function(key,event){
                  console.log(key);
                  if (key === 27) this._paused = !this._paused;
                }
            }, this);
        }

        return true;
    },
    update : function(dt){

        // if game paused, return
        if (!this._paused){
          for(var i = 0; i < this._child_nodes.length; i++){
              this._child_nodes[i].update(dt, 100);
          }

        }

        // console.log(this._bird.getPosition())
    },
    earnPoint:function(){
        this._points++;
        this._label.string = "Score: " + this._points.toString();
    },
    _has_gameovered:false,
    gameOver:function(){

      if(!this._has_gameovered)
      {
        this._has_gameovered = true;

          //TODO: Make a game ending
        var jumpTo = new cc.JumpTo(1,
          cc.p( cc.winSize.width * 0.5,
          this._ground.getBoundingBox().height + (this._bird.getBoundingBox().width * this._bird.getScaleX()) * 0.5
        ), 0.5, 1);

        this._bird.runAction(new cc.EaseBackInOut( jumpTo ));
        // this._ground.setVisible(false);
      }
    }
});


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
