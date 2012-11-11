function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function() {
	/* Recuperation du cookie */
	this.cookie = new Mojo.Model.Cookie('preferences');
	var oldCookie = this.cookie.get();
	if (!oldCookie) {
		this.lang = 2;
		this.cookie.put({lang : this.lang});
	}
	else {
		this.lang = oldCookie.lang;
	}
	/* Affichage du menu */
	this.controller.setupWidget(Mojo.Menu.appMenu, myMenuAttr, myMenuModel);
	/* Traduction du texte */
	var textStopwatch = ["Cron\362metre", "Chronom\350tre", "Stopwatch"];
	var textTimer = ["Temporitzador", "Minuterie", "Timer"];
	this.controller.get("title-chrono").update(textStopwatch[this.lang]);
	this.textStart = ["Comen\347ament", "D\351marrage", "Start"];
	this.textStop = ["Parada", "Arr\352t", "Stop"];
	var textReset = ["Reajustar", "R\351initialiser", "Reset"];
	
	this.run = false;
	this.first = 0;
	this.tps = 0;
	this.pms = 0;
	this.lms = 0;
	this.h = 0;
	this.m = 0;
	this.s = 0;
	this.c = 0;
	this.mi = 0;
	
	/* add event handlers to listen to events from widgets */
	this.buttonStartModel = {
		label : this.textStart[this.lang],
		buttonClass : 'affirmative'
	};
	this.buttonResetModel = {
		label : textReset[this.lang],
		buttonClass : 'primary',
	};
	// set up the button
	this.controller.setupWidget("start", {}, this.buttonStartModel); 
	Mojo.Event.listen(this.controller.get("start"), Mojo.Event.tap, 
	this.handleButtonStartPress.bind(this));
	this.controller.setupWidget("reset", {}, this.buttonResetModel); 
    Mojo.Event.listen(this.controller.get("reset"), Mojo.Event.tap, 
	this.handleButtonResetPress.bind(this));

		
	this.bottomMenuModel = {
		visible: true,
		items: [
			{
				label:'My Bottom Menu',
				items: [
					{},
					{ label: "Menu", toggleCmd:'chronoView',
                  items:[
                      { label: textStopwatch[this.lang], command: "chronoView"},
                      { label: textTimer[this.lang], command: "timerView"}
                  ] },
					{}
				]
			}
		]
	};
	this.controller.setupWidget( Mojo.Menu.commandMenu, {menuClass: 'no-fade'}, this.bottomMenuModel );
};

FirstAssistant.prototype.chrono = function() {
function mini(nb) {
	if (nb > 9) {
		return (nb);
	}
	return ('0' + nb);
}

	this.tps = (new Date()).getTime() - this.pms;
	this.s = Math.floor(this.tps / 1000);
	this.m = Math.floor(this.s / 60);
	this.s = Math.floor(this.s - (this.m * 60));
	this.c = Math.floor((this.tps%1000) / 100);
	this.mi = Math.floor((this.tps%100) / 1);
	this.controller.get("min").innerHTML= mini(this.m);
	this.controller.get("sec").innerHTML= mini(this.s);
	this.controller.get("cent").innerHTML= this.c;
	this.controller.get("milli").innerHTML= mini(this.mi);
	if (this.run == true) {
		this.controller.window.setTimeout(this.chrono.bind(this), 42);
	}
}

FirstAssistant.prototype.handleButtonStartPress = function(event) {
if (this.run == false) {
	this.run = true;
	this.controller.toggleMenuVisible(Mojo.Menu.commandMenu);
	this.buttonStartModel.label = this.textStop[this.lang];
	this.buttonStartModel.buttonClass = 'negative';
	this.controller.modelChanged(this.buttonStartModel, this);
	
	if (this.first == 0) {
		this.first = 1;
		this.pms = (new Date()).getTime();
	}
	else {
		this.pms = (new Date()).getTime() - (this.lms - this.pms);
	}

	this.chrono();
}
else {
	this.run = false;
	this.controller.toggleMenuVisible(Mojo.Menu.commandMenu);
	this.lms = (new Date()).getTime();
	this.buttonStartModel.label = this.textStart[this.lang];
	this.buttonStartModel.buttonClass = 'affirmative';
	this.controller.modelChanged(this.buttonStartModel, this);
}
};

FirstAssistant.prototype.handleButtonResetPress = function(event) {
	this.run = false;
	this.first = 0;
	this.tps = 0;
	this.h = 0;
	this.m = 0;
	this.s = 0;
	this.c = 0;
	this.mi = 0;
	this.controller.get("min").update('00');
	this.controller.get("sec").update('00');
	this.controller.get("cent").update('0');
	this.controller.get("milli").update('00');
	this.buttonStartModel.label = this.textStart[this.lang];
	this.buttonStartModel.buttonClass = 'affirmative';
	this.controller.modelChanged(this.buttonStartModel, this);
};

FirstAssistant.prototype.handleCommand = function(event) {
  if(event.type == Mojo.Event.command) {
    switch(event.command) {
      case 'chronoView':
			// Mojo.Controller.stageController.swapScene("first");
        break;
      case 'timerView':
			Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"second"});
        break;
    }
  }
};

FirstAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

FirstAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FirstAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
