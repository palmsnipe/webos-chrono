function PreferencesAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

PreferencesAssistant.prototype.setup = function() {
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
	var textPreferences = ["Prefer\350ncies", "Pr\351f\351rences", "Preferences"];
	this.controller.get("title-prefs").update(textPreferences[this.lang]);
	var textLanguage = ["Idioma", "Langage", "Language"];
	var textSelectLang = ["Seleccionar l'idioma", "Choix de la langue", "Select language"];
	this.controller.get("select-languages").update(textSelectLang[this.lang]);
	var textRestart = ["Necessiteu reiniciar per aplicar els canvis.", "N\351cessite un red\351marrage pour appliquer les modifications.", "Requires restart to apply changes."];
	this.controller.get("text-restart").update(textRestart[this.lang]);
	
	this.selectorChanged = this.selectorChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('selectLang'), Mojo.Event.propertyChange, this.selectorChanged);
	this.setupChoices();
	this.controller.setupWidget('selectLang', {
												label : textLanguage[this.lang],
												choices : this.mychoice, 
												modelProperty : 'current'
											}, this.selectorsModel);
	
	/* add event handlers to listen to events from widgets */
};

PreferencesAssistant.prototype.setupChoices = function() {
	this.mychoice = [{label : 'Catal\340', value : 'cat'},
					{label : "Fran\347ais", value : 'fr'},
					{label : "English", value : 'en'}];
	this.selectorsModel = {current: this.mychoice[this.lang].label};
};

PreferencesAssistant.prototype.selectorChanged = function(event) {
	if (event.value == "cat") {
		this.lang = 0;
	}
	if (event.value == "fr") {
		this.lang = 1;
	}
	if (event.value == "en") {
		this.lang = 2;
	}
};

PreferencesAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

PreferencesAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
	   this.cookie.put({lang : this.lang});
};

PreferencesAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
