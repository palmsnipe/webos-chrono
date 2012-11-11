function StageAssistant() {
	/* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the stage is first created */
	
	/* for a simple application, the stage assistant's only task is to push the scene, making it visible */
	this.cookie = new Mojo.Model.Cookie('preferences');
	var oldCookie = this.cookie.get();
	if (!oldCookie) {
		this.lang = 2;
		this.cookie.put({lang : this.lang});
	}
	else {
		this.lang = oldCookie.lang;
	}
	
	var textPreferences = ["Prefer\350ncies", "Pr\351f\351rences", "Preferences"];
	var textHelp = ["Ajuda", "Aide", "Help"];
	
	myMenuAttr = {
        omitDefaultItems: true
    };
 
    myMenuModel = {
        visible: true,
        items: [{label : textPreferences[this.lang], command : 'preferences'},
                {label : textHelp[this.lang], command : 'help'}
        ]
    };
	this.controller.setWindowOrientation("free"); 
	this.controller.pushScene('first');
};

StageAssistant.prototype.handleCommand = function (event) {
    var currentScene = this.controller.activeScene();
 
    switch(event.type) {
        case Mojo.Event.commandEnable:
            switch (event.command) {
                case 'preferences':
                    event.stopPropagation();
                    break;
                case 'help':
                    event.stopPropagation();
                    break;
            }
            break;
        case Mojo.Event.command:
            switch (event.command) {   
                case 'help':
                    this.controller.pushScene('help');
                    break;
 
                case 'preferences':
                    this.controller.pushScene('preferences');
                    break;
            }
        break;
    }
};