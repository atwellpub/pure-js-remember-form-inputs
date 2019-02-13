/**
 * Pure JS class to remember all inputs for forms with class "remember-inputs"
 * Dynamically added forms, such as modal driven forms, will have to have their event handlers added manually
 * Example: myDynamicForm.addEventListener('submit', RememberInputs.storeAll, false);
 * @author Hudson Atwell
 * @authorlink https://codeable.io/developers/hudson-atwell/?ref=99TG1
 */
var RememberInputs =  {

    /**
     * initialize class
     * @return {[type]} [description]
     */
    init : function () {

        /* wait for interactive state */
        while(document.readyState == 'loading') {
            setTimeout(function() {
                RememberInputs.init();
            },200);
            return;
        }

        RememberInputs.load();
        RememberInputs.listen();
    },

    /**
     * load all stored inputs for tracked forms
     * @return {[type]} [description]
     */
    load : function() {
        var forms = document.getElementsByClassName("remember-inputs");
        for (var i = 0; i < forms.length; i++) {
            RememberInputs.loadAll(forms[i]);
        }
    },

    /**
     * Create listeners for tracked form submissions
     * @return {[type]} [description]
     */
    listen : function() {
        var forms = document.getElementsByClassName("remember-inputs");
        for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener('submit', RememberInputs.storeAll, false);
        }
    },

    /**
     * Given a form element, retrieve and set stored input values for all inputs
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    loadAll : function(e) {

        /* get inputs */
        var inputs = e.querySelectorAll('input');

        for (var i = 0; i < inputs.length; i++) {

            var type = inputs[i].type;
            var name = inputs[i].name;
            var value = inputs[i].value;

            switch(type) {
                case 'color':
                case 'date':
                case 'email':
                case 'month':
                case 'range':
                case 'search':
                case 'number':
                case 'text':
                    var stored = RememberInputs.retrieve(name);
                    inputs[i].value = stored;

                    break;
                case 'radio':
                    var checked = RememberInputs.retrieve(name);
                    if (checked && typeof checked[value] != 'undefined' ) {
                        if (checked[value]===true) {
                            inputs[i].click(); /* why I had to do it this way, idk */
                        }
                    }
                    break;
                case 'checkbox':
                    var checked = RememberInputs.retrieve(name);
                    if (checked && typeof checked[value] != 'undefined' ) {
                        if (checked[value]===true) {
                            inputs[i].checked = "checked";
                        }
                    }
                    break;
            }
        }

        /* get dropdowns */
        var selects = e.querySelectorAll('select');

        for (var i = 0; i < selects.length; i++) {

            var name = selects[i].name;
            var selected = RememberInputs.retrieve(name);
            var options = selects[i].querySelectorAll('option');

            /* loop through options and check if should be checked */
            for (var o = 0; o < options.length; o++) {
                var optionValue = options[o].value.toString();

                if (selected.length>0) {
                    for (key in selected) {
                        if (selected[key] == optionValue) {
                            options[o].selected = "selected";
                        }
                    }
                }

            }
        }
    },

    /**
     * Record input values for all inputs given form element
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    storeAll : function (e) {

        var thisForm = e.currentTarget;

        /* get inputs */
        var inputs = thisForm.querySelectorAll('input');

        /* define array for storing array based inputs */
        var checked = {};

        for (var i = 0; i < inputs.length; i++) {

            var type = inputs[i].type;
            var name = inputs[i].name;
            var value = inputs[i].value;

            switch(type) {
                case 'color':
                case 'date':
                case 'email':
                case 'month':
                case 'range':
                case 'search':
                case 'number':
                case 'text':

                    var value = inputs[i].value;
                    RememberInputs.store(name,value);

                    break;
                case 'checkbox':
                case 'radio':

                    if (typeof checked[name] == 'undefined') {
                        checked[name] = {};
                    }

                    /* prepare checked object */
                    checked[name][value] = inputs[i].checked
                    break;
            }

        }

        /* get dropdowns */
        var selects = thisForm.querySelectorAll('select');

        for (var i = 0; i < selects.length; i++) {
            var name = selects[i].name;

            var selected = selects[i].querySelectorAll('option:checked');
            checked[name] = Array.from(selected).map(el => el.value);

        }

        /* store checked objects */
        if (Object.keys(checked).length>0) {
            for (key in checked) {
                RememberInputs.store(key, checked[key]);
            }
        }
    },

    /**
     * Store input value into local storage
     * @param  {[type]} name  [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    store : function( name ,  value ) {
        if (typeof value == 'object') {
            value = JSON.stringify(value)
        }
        localStorage.setItem( 'remember_' + name , value );
    },

    /**
     * Retrieve input value from local storage
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    retrieve: function(name) {
        var store = localStorage.getItem('remember_' + name);
        if (RememberInputs.checkJSON(store)) {
            store = JSON.parse(store);
        }

        return store;
    },

    /**
     * checks string to see if it's a JSON string
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    checkJSON : function (str) {
        try {
            var json = JSON.parse(str);
            return (typeof json === 'object');
        } catch (e) {
            return false;
        }
    }

};

/* load class after DOM ready */
//document.addEventListener('DOMContentLoaded', RememberInputs.init(1) );
window.addEventListener('DOMContentLoaded', RememberInputs.init() );
/**
 * Pure JS class to remember all inputs for forms with class "remember-inputs"
 * Dynamically added forms, such as modal driven forms, will have to have their event handlers added manually
 * Example: myDynamicForm.addEventListener('submit', RememberInputs.storeAll, false);
 * @author Hudson Atwell
 * @authorlink https://codeable.io/developers/hudson-atwell/?ref=99TG1
 */
var RememberInputs =  {

    /**
     * initialize class
     * @return {[type]} [description]
     */
    init : function () {

        /* wait for interactive state */
        while(document.readyState == 'loading') {
            setTimeout(function() {
                RememberInputs.init();
            },200);
            return;
        }

        RememberInputs.load();
        RememberInputs.listen();
    },

    /**
     * load all stored inputs for tracked forms
     * @return {[type]} [description]
     */
    load : function() {
        var forms = document.getElementsByClassName("remember-inputs");
        for (var i = 0; i < forms.length; i++) {
            RememberInputs.loadAll(forms[i]);
        }
    },

    /**
     * Create listeners for tracked form submissions
     * @return {[type]} [description]
     */
    listen : function() {
        var forms = document.getElementsByClassName("remember-inputs");
        for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener('submit', RememberInputs.storeAll, false);
        }
    },

    /**
     * Given a form element, retrieve and set stored input values for all inputs
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    loadAll : function(e) {

        /* get inputs */
        var inputs = e.querySelectorAll('input');

        for (var i = 0; i < inputs.length; i++) {

            var type = inputs[i].type;
            var name = inputs[i].name;
            var value = inputs[i].value;

            switch(type) {
                case 'color':
                case 'date':
                case 'email':
                case 'month':
                case 'range':
                case 'search':
                case 'number':
                case 'text':
                    var stored = RememberInputs.retrieve(name);
                    inputs[i].value = stored;

                    break;
                case 'radio':
                    var checked = RememberInputs.retrieve(name);

                    if (checked && typeof checked[value] != 'undefined' ) {
                        if (checked[value]===true) {
                            inputs[i].click();
                        }
                    }
                    break;
                case 'checkbox':
                    var checked = RememberInputs.retrieve(name);
                    if (checked && typeof checked[value] != 'undefined' ) {
                        if (checked[value]===true) {
                            inputs[i].checked = "checked";
                        }
                    }

                    break;
            }
        }

        /* get dropdowns */
        var selects = e.querySelectorAll('select');

        for (var i = 0; i < selects.length; i++) {

            var name = selects[i].name;
            var selected = RememberInputs.retrieve(name);
            var options = selects[i].querySelectorAll('option');

            /* loop through options and check if should be checked */
            for (var o = 0; o < options.length; o++) {
                var optionValue = options[o].value.toString();

                if (selected.length>0) {
                    for (key in selected) {
                        if (selected[key] == optionValue) {
                            options[o].selected = "selected";
                        }
                    }
                }

            }
        }
    },

    /**
     * Record input values for all inputs given form element
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    storeAll : function (e) {

        var thisForm = e.currentTarget;

        /* get inputs */
        var inputs = thisForm.querySelectorAll('input');

        /* define array for storing array based inputs */
        var checked = {};

        for (var i = 0; i < inputs.length; i++) {

            var type = inputs[i].type;
            var name = inputs[i].name;
            var value = inputs[i].value;

            switch(type) {
                case 'color':
                case 'date':
                case 'email':
                case 'month':
                case 'range':
                case 'search':
                case 'number':
                case 'text':

                    var value = inputs[i].value;
                    RememberInputs.store(name,value);

                    break;
                case 'checkbox':
                case 'radio':

                    if (typeof checked[name] == 'undefined') {
                        checked[name] = {};
                    }

                    /* prepare checked object */
                    checked[name][value] = inputs[i].checked
                    break;
            }

        }

        /* get dropdowns */
        var selects = thisForm.querySelectorAll('select');

        for (var i = 0; i < selects.length; i++) {
            var name = selects[i].name;

            var selected = selects[i].querySelectorAll('option:checked');
            checked[name] = Array.from(selected).map(el => el.value);

        }

        /* store checked objects */
        if (Object.keys(checked).length>0) {
            for (key in checked) {
                RememberInputs.store(key, checked[key]);
            }
        }
    },

    /**
     * Store input value into local storage
     * @param  {[type]} name  [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    store : function( name ,  value ) {
        if (typeof value == 'object') {
            value = JSON.stringify(value)
        }
        localStorage.setItem( 'remember_' + name , value );
    },

    /**
     * Retrieve input value from local storage
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    retrieve: function(name) {
        var store = localStorage.getItem('remember_' + name);
        if (RememberInputs.checkJSON(store)) {
            store = JSON.parse(store);
        }

        return store;
    },

    /**
     * checks string to see if it's a JSON string
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    checkJSON : function (str) {
        try {
            var json = JSON.parse(str);
            return (typeof json === 'object');
        } catch (e) {
            return false;
        }
    }

};

/* load class after DOM ready */
window.addEventListener('DOMContentLoaded', RememberInputs.init() );
