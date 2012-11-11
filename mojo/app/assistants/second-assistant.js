function SecondAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SecondAssistant.prototype.setup = function() {
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
	this.controller.get("title-chrono").update(textTimer[this.lang]);
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
	
	this.controller.setupWidget("integerPickerMinutes",
		{label: 'Minutes', min: 0, max: 60, visible: false}, this.minutesModel = {value: 5});
	this.controller.setupWidget("integerPickerSeconds",
		{label: 'Seconds', min: 0, max: 60}, this.secondsModel = {value: 0});
	
	Mojo.Event.listen(this.controller.get('integerPickerMinutes'), Mojo.Event.propertyChange,
	this.propChangeMinutes.bindAsEventListener(this));
	Mojo.Event.listen(this.controller.get('integerPickerSeconds'), Mojo.Event.propertyChange,
	this.propChangeSeconds.bindAsEventListener(this));
	/* Buttons */
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
	
	function mini(nb) {
	if (nb > 9) {
		return (nb);
	}
	return ('0' + nb);
}
	
	this.controller.get("min").update(mini(this.minutesModel.value));
	this.controller.get("sec").update(mini(this.secondsModel.value));
	
	
	this.bottomMenuModel = {
		visible: true,
		items: [
			{
				label:'My Bottom Menu',
				items: [
					{},
					{ label: "Menu", toggleCmd:'timerView',
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

SecondAssistant.prototype.timer = function() {
function mini(nb) {
	if (nb > 9) {
		return (nb);
	}
	return ('0' + nb);
}

	this.tps = this.pms - (new Date()).getTime();
	this.s = Math.floor(this.tps / 1000);
	this.m = Math.floor(this.s / 60);
	this.s = Math.floor(this.s - (this.m * 60));
	this.c = Math.floor((this.tps%1000) / 100);
	this.mi = Math.floor((this.tps%100) / 1);
	this.controller.get("min").innerHTML= mini(this.m);
	this.controller.get("sec").innerHTML= mini(this.s);
	this.controller.get("cent").innerHTML= this.c;
	this.controller.get("milli").innerHTML= mini(this.mi);
	
	if (this.tps <= 0) {
		this.endTimer();
	}
	if (this.run == true) {
		this.controller.window.setTimeout(this.timer.bind(this), 42);
	}
}

SecondAssistant.prototype.endTimer = function() {
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
	
	function mini(nb) {
	if (nb > 9) {
		return (nb);
	}
	return ('0' + nb);
}
	
	this.controller.get("min").update(mini(this.minutesModel.value));
	this.controller.get("sec").update(mini(this.secondsModel.value));
	
	this.buttonStartModel.label = this.textStart[this.lang];
	this.buttonStartModel.buttonClass = 'affirmative';
	this.controller.modelChanged(this.buttonStartModel, this);
	
	this.controller.get('integerPickerMinutes').show();
	this.controller.get('integerPickerSeconds').show();
	this.controller.toggleMenuVisible(Mojo.Menu.commandMenu);
	
	this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
    method:"playFeedback",   parameters:{ name: 'tones_3beeps_otasp_done' }
 });
};

SecondAssistant.prototype.handleButtonStartPress = function(event) {
	if (this.run == false) {
	this.run = true;
	this.controller.toggleMenuVisible(Mojo.Menu.commandMenu);
	this.buttonStartModel.label = this.textStop[this.lang];
	this.buttonStartModel.buttonClass = 'negative';
	this.controller.modelChanged(this.buttonStartModel, this);
	this.controller.get('integerPickerMinutes').hide();
	this.controller.get('integerPickerSeconds').hide();
	
	if (this.first == 0) {
		this.first = 1;
		this.pms = (new Date()).getTime() + (this.minutesModel.value * 1000 * 60) + (this.secondsModel.value * 1000);
	}
	else {
		this.pms = (new Date()).getTime() - (this.lms - this.pms);
	}

	this.timer();
}
else {
	this.run = false;
	this.controller.toggleMenuVisible(Mojo.Menu.commandMenu);
	this.lms = (new Date()).getTime();
	this.buttonStartModel.label = this.textStart[this.lang];
	this.buttonStartModel.buttonClass = 'affirmative';
	this.controller.modelChanged(this.buttonStartModel, this);
	
	this.controller.get('integerPickerMinutes').show();
	this.controller.get('integerPickerSeconds').show();
}
};

SecondAssistant.prototype.handleButtonResetPress = function(event) {
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
	
	function mini(nb) {
	if (nb > 9) {
		return (nb);
	}
	return ('0' + nb);
}
	
	this.controller.get("min").update(mini(this.minutesModel.value));
	this.controller.get("sec").update(mini(this.secondsModel.value));
	
	this.buttonStartModel.label = this.textStart[this.lang];
	this.buttonStartModel.buttonClass = 'affirmative';
	this.controller.modelChanged(this.buttonStartModel, this);
	
	this.controller.get('integerPickerMinutes').show();
	this.controller.get('integerPickerSeconds').show();
};

SecondAssistant.prototype.handleCommand = function(event) {
  if(event.type == Mojo.Event.command) {
    switch(event.command) {
      case 'chronoView':
			Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"first"});
        break;
      case 'timerView':
			// Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"second"});
        break;
    }
  }
};

SecondAssistant.prototype.propChangeMinutes = function(event) {
function mini(nb) {
	if (nb > 9) {
		return (nb);
	}
	return ('0' + nb);
}
	this.controller.get("min").update(mini(this.minutesModel.value));
};

SecondAssistant.prototype.propChangeSeconds = function(event) {
function mini(nb) {
	if (nb > 9) {
		return (nb);
	}
	return ('0' + nb);
}
	this.controller.get("sec").update(mini(this.secondsModel.value));
};

SecondAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SecondAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SecondAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
