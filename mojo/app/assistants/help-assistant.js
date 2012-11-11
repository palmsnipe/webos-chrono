function HelpAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

HelpAssistant.prototype.setup = function() {
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
	var textHelp = ["Ajuda", "Aide", "Help"];
	this.controller.get("title-help").update(textHelp[this.lang]);
	var textAbout = ["Desenvolupat per Cyril Morales.", "D\351velopp\351 par Cyril Morales.", "Developed by Cyril Morales."];
	this.controller.get("about").update(textAbout[this.lang]);
	var textAboutTitle = ["Sobre", "A Propos", "About"];
	this.controller.get("title-aboutbox").update(textAboutTitle[this.lang]);
	var textWebsite = ["Lloc Web", "Site Web", "Website"];
	this.controller.get("text-website").update(textWebsite[this.lang]);
	var textSupportTitle = ["Suport", "Support", "Support"];
	this.controller.get("title-support").update(textSupportTitle[this.lang]);
	var textForum = ["F\362rum", "Forum", "Forum"];
	this.controller.get("text-forum").update(textForum[this.lang]);
	var textSubject = ["Tema", "Sujet", "Subject"];
	this.controller.get("text-subject").update(textSubject[this.lang]);
	var textSendEmail = ["Enviar un missatge", "Envoyer un message", "Send Email"];
	this.controller.get("text-send-email").update(textSendEmail[this.lang]);
	
	
	Mojo.Event.listen(this.controller.get("website"), Mojo.Event.tap, this.openWebsite.bind(this));
	Mojo.Event.listen(this.controller.get("forum"), Mojo.Event.tap, this.openForum.bind(this));
	Mojo.Event.listen(this.controller.get("email"), Mojo.Event.tap, this.openMail.bind(this));
};

HelpAssistant.prototype.openWebsite = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.browser',
								params: {target: "http://www.palmsnipe.cat"}
							}
						});
};

HelpAssistant.prototype.openForum = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.browser',
								params: {target: "http://forum.palmpre-france.com/viewtopic.php?id=1349"}
							}
						});
};

HelpAssistant.prototype.openMail = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.email',
								params: {
                        summary: '[Chrono] ',
						recipients: [{type: "email",
                contactDisplay: "Cyril Morales", 
                role: 1,
                value: "palmsnipe@gmail.com"}]
                    }
							}
						});
};

HelpAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

HelpAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

HelpAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
