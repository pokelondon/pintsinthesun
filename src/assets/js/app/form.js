define([
        'jquery',
        'underscore',
        'mediator'
    ], function($, _, Mediator) {

        var FOURSQUARE_URL = 'https://api.foursquare.com/v2/venues/search\?client_id\=FNJEOV4QV4YBMJ4J5EQNKQTCQXOQBCUSIIYIZAXWMKLY5XPN\&client_secret\=NEKCZ4IFX4SOJEPDY2E1ZIV4NTAYZ3GWQHWKKPSQF3KOZKCS\&v\=1396279715756\&ll\={lat}%2C{lng}\&radius\=60000\&intent\=browse\&limit\=50\&categoryId\=4bf58dd8d48988d11b941735%2C4bf58dd8d48988d116941735&query={query}&near={near}';

        /**
         * Utility to parse strings with placeholders
         * TODO un dupe this
         */
        function format(str, values) {
           _(values).each(function(v, k) {
               var val = encodeURIComponent(v);
               str = str.replace('{' + k + '}', val);
            });
           return str;
        }

        var Form = function(mapController) {
            _.extend(this, Mediator);
            this.$el = $('.js-search-form');
            this.$results = $('.js-search-results');
            this.$submit = this.$el.find('.js-submit');

            this.mapController = mapController;
            this.pubs = [];

            this.template = _.template($('#tpl_search_result').html());

            // DOM Events
            this.$el.on('submit', _.bind(this.onSubmit, this));

            // Mediator Events
            this.subscribe('foursquare:loaded', this.listPubs);
        };

        Form.prototype.clearResults = function() {
            this.$results.find('.Media-item').remove();
        };

        Form.prototype.onSubmit = function(evt) {
            evt.preventDefault();
            this.publish('form:submit');
            var searchTerm = this.$el.find('#input_search').val();
            var searchNear = this.$el.find('#input_search_near').val();
            this.getPubs(searchTerm, searchNear);
            this.$submit.addClass('is-loading');
        };
        /**
         * Load pubs form FSQ near to the map centre.
         * Publishes an event to the mediator when complete
         */
        Form.prototype.getPubs = function(query, near) {
            var centre = this.mapController.map.getCenter();
            var url = format(FOURSQUARE_URL, {lat: centre.lat, lng: centre.lng, query:query, near:near});
            $.getJSON(url, _.bind(function(data) {
                this.publish('foursquare:loaded', data);
            }, this));
        };

        /**
         * List pubs in the results list
         * Subscribe to the ajax event to recieve data when its ready
         */
        Form.prototype.listPubs = function(data) {
            var self = this;
            this.$submit.removeClass('is-loading');
            self.clearResults();
            _(data.response.venues).each(function(item) {
                self.pubs.push(item.id);
                self.$results.append(self.template({name: item.name, address: item.location.city, location: item.location}));
            });
        };


        return Form;
});


