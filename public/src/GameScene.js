var ScoreLayer = cc.Layer.extend({
    ctor:function(){
      // call to super class
      this._super();

      // Creates the score layer

    }
});

var GAMEOVER = 'GAMEOVER';
var RUNNING = 'RUNNING';
var PAUSED = 'PAUSED';

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
    _currentState:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        // markup self reference
        var self = this;

        // set current state of the game (in advance, we need to change the switch state by the State Pattern)
        this._currentState = RUNNING;

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

        // creates this._ground
        this._ground = new Ground();
        this.addChild(this._ground, 5);

        // instantiate player
        this._bird = new Player();
        this._bird.setMinMaxHeight(this._ground.getBoundingBox().height + this._bird.getBoundingBox().height / 2.4, cc.winSize.height);
        this.addChild(this._bird, 9);

        // threshold will be 1.5 this._bird size
        this._tubesHandler = new TubesHandler(this._bird.getBoundingBox().height * 7, 10, this._ground.getBoundingBox().height);
        this._tubesHandler.checkIntersectionWithPlayer = function(tubeUpRect, tubeDownRect, coinRect, tubePair){

          var birdRect = self._bird.getBoundingBox();
          var hasIntersectedTube =
              cc.rectIntersectsRect(tubeUpRect, birdRect) ||
              cc.rectIntersectsRect(tubeDownRect, birdRect);
          var hasIntersectedGround = cc.rectIntersectsRect(self._ground.getBoundingBox(), birdRect);
          var hasIntersectedCoin = cc.rectIntersectsRect(coinRect, birdRect);

          // you're going to die!
          if (hasIntersectedTube || hasIntersectedGround){
            console.log('Tube or Ground, DIE!');
            // Change game state to game over state
            self.gameOver();
            self._currentState = GAMEOVER;
            return true;            
          }
          // you've got some coins
          else if (hasIntersectedCoin){

            console.log("Coin!!!! Point!");
            self.earnPoint();
            tubePair.removeCoin();
          }

          return false;
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
                  if (key === 65) cc.log("Bird Bounding Box and Rect:", self._bird.getBoundingBox(), self._bird.getRect());
                }
            }, this);
        }

        // checks if the device you are using is capable of mouse input
        if ( cc.sys.capabilities.hasOwnProperty( 'mouse' ) )
        {
            cc.eventManager.addListener(
            {
              event: cc.EventListener.MOUSE,
              
              onMouseDown: function( event )
              {
                  if ( event.getButton( ) == cc.EventMouse.BUTTON_LEFT )
                  {
                      cc.log("Mouse:(",event.getLocationX( ),",",event.getLocationY(),")");
                  }
              }
            }, self);
        }


        return true;
    },
    update : function(dt){

        switch(this._currentState){
          case RUNNING:
            for(var i = 0; i < this._child_nodes.length; i++){
                this._child_nodes[i].update(dt, 100);
            }
            break;
          case PAUSED:
            // Do nothing, just pause
            break;

          case GAMEOVER:
            this._bird.update(dt, 80);
            break;
        }
    },
    earnPoint:function(){
        this._points++;
        this._label.string = "Score: " + this._points.toString();
    },
    gameOver:function(){
      this._bird.die();
    }
});


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
