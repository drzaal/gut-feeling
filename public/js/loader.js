'use strict';
var gutFeeling = gutFeeling || {};

/**
 * Application loading and screen
 */
gutFeeling.Loader = function Loader() {
    var self = this;
    this.data = {};
    this.templates = {};
    this.music = {};
    this.sfx = [];
    this.icons = [];
    this.ready;

    /**
     * Request a json asset
     */
    this.getJSONResource = function getJSONResource(path, id) {
        var request = $.getJSON(path)
            .then(function (data) {
                self.setData(id, data);
            });
        request.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Data request error.");
            console.log(errorThrown);
        });
        return request;
    };

    this.setData = function setData(selector, value) {
        if (!self.data) {
            self.data = {};
        }
        var cursor = self.data;
        var key_path = selector.split('.');
        var key_depth = key_path.length - 1;
        key_path.forEach(function (key, ix) {
            if (ix < key_path) {
                cursor[key] = cursor[key] || {};
                cursor = cursor[key];
            } else {
                cursor = value;
            }
        });
    }

    /**
     * Request a text or binary asset
     */
    this.getResource = function getResource(path, id) {
        var request = $.get(path)
            .then(function (data) {
                self.setData(id, data);
            });
        request.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Data request error.");
            console.log(errorThrown);
        });
        return request;
    };
};
gutFeeling.Loader();
gutFeeling.Loader.load = function load() {
    var loader, music_ichiban, tmpl_html, icons_src;

    loader = new gutFeeling.Loader();

    loader.ready = $.when(
        // Audio loading.
        //new Promise(function() {
        //loader.music['ichiban'] = new buzz.sound("/audio/guineo_feat_kristina_maier-expectacion.mp3", {preload: true});
        //}),

        // var music_ichiban = new buzz.sound("/audio/guineo-metamorfosis.mp3");

        // OUR HTML TEMPLATES Loading
        loader.getResource("/view/control_column.txt", "templates.control"),
        loader.getResource("/view/title.txt", "templates.title"),
        loader.getResource("/view/meal.txt", "templates.meal"),
        loader.getResource("/view/body.txt", "templates.body"),
        // loader.getResource("/view/other.txt", function(data){ loader.templates.other = data; }),
        loader.getResource("/view/bar_heads_up.txt", "templates.bar_ui"),

        // OUR ICON IMG ASSETS Loading
        $.getJSON("config/icons.json"),

        //Asset constructor works for foods and bacteria
        $.getJSON("config/flora.json", "flora"),
        $.getJSON("config/newfoods.json", "food"),
        $.getJSON("config/foodmod.json", "food_mods"),

        // ActionEvent queue
        $.getJSON("config/test-actions.json")
    );

    loader.ready.then(null, loader.failure.bind(loader));

    // Bacteria definitions
    intestine.flora_cluster_collection.push(new FloraCluster({
        name: "ecoli",
        triple_point: {
            r: 0.2,
            g: 0.6,
            b: 0.2
        },
        nutrition: {
            r: 0.001,
            g: 0.05,
            b: 0.001
        }
    }));
    intestine.flora_cluster_collection.push(new FloraCluster({
        name: "stephalo",
        triple_point: {
            r: 0.2,
            g: 0.2,
            b: 0.6
        },
        nutrition: {
            r: 0.001,
            g: 0.001,
            b: 0.05
        }
    }));
    intestine.flora_cluster_collection.push(new FloraCluster({
        name: "homily",
        triple_point: {
            r: 0.6,
            g: 0.2,
            b: 0.2
        },
        nutrition: {
            r: 0.05,
            g: 0.001,
            b: 0.001
        }
    }));

    return loader;
};

/**
 * Return a completion notice
 */
gutFeeling.Loader.prototype.complete = function complete() {
    console.log(this);
    console.log(this.ready);
    // this.ready.resolve();  
};
/**
 * The Loader FAIIIIIIILED
 */
gutFeeling.Loader.prototype.failure = function failure(err) {
    console.log(err);
    console.log(this);
};
