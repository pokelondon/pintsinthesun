define(
    ['jquery', 'jquery.event.move'],
    function($, $_move) {
        var has_touchstart = false;

        if('ontouchstart' in document.documentElement) {
            has_touchstart = true;
        }

        var Slider = function Constructor($el, onDrag, onChange) {
            var self = this;
            this.$el = $el;
            this.$indicator = this.$el.find('.Slider-indicator');
            this.$thumb = this.$indicator.find('.Slider-thumb');
            this.offset = this.$indicator.offset().left;
            this.onDrag = onDrag ? _.throttle(onDrag, 100, {trailing: true}) : null;
            this.onChange = onChange || null;

            // Events
            //this.$el.on('click', $.proxy(this.clicked, this));

            /**
            * Has touchstart event
            * ====================================================== */
            //this.$el.on('touchstart', $.proxy(this.clicked, this));
            this.$thumb.on('movestart', $.proxy(this.movestart, this));
            this.$thumb.on('moveend', $.proxy(this.moveend, this));

            $(window).on('resize', function() {
                self.offset = self.$indicator.offset().left;
            });
        };

        /**
         * Find the current percentage
         */
        Slider.prototype.getState = function getState() {
            var total = this.$el.width();
            var width = this.$indicator.width();
            this.value = parseInt(width / total * 100, 10);
            return this.value;
        };

        /**
         * Fire this on touchmove and mousemove events
         * to keep the thing moving
         */
        Slider.prototype.dragging = function dragging(evt) {
            var x = evt.pageX - this.offset;
            evt.preventDefault();
            this.$indicator.css('width', x + 'px');

            if('function' === typeof this.onDrag) {
                this.getState();
                this.onDrag(this.value);
            }
        };

        /**
         * Fire once on click and touchstart
         * To animate the bar to the location of the tap
         */
        Slider.prototype.clicked = function clicked(evt) {
            var x = evt.pageX - this.offset;
            this.$indicator.addClass('is-moving').css('width', x + 'px');
        };

        /**
         * Fired when the drag interaction is over,
         * update the slider handle state and possibly run a callback
         */
        Slider.prototype.moveend = function moveend(evt) {
            this.$thumb.off('move');
            this.$thumb.removeClass('is-active');
            this.$el.trigger('updated');
            this.getState();
            if('function' === typeof this.onChange) {
                this.onChange(this.value);
            }
        };

        /**
         * Beggin the dragging, and bind move event
         */
        Slider.prototype.movestart = function movestart(evt) {
            this.$thumb.on('move', $.proxy(this.dragging, this));
            this.$thumb.addClass('is-active');
            this.$indicator.removeClass('is-moving');
            this.$el.addClass('is-moved');
            if('function' === typeof ga) {
                ga('send', 'event', 'slider', 'movestart');
            }
        };

        /**
         * Give it a value that's not come from the dragging
         */
        Slider.prototype.set = function(percentage) {
            var total = this.$el.width();
            var width = total * percentage / 100;

            this.$indicator.addClass('is-moving').css('width', width + 'px');
            if('function' === typeof this.onDrag) {
                this.getState();
                this.onDrag(this.value);
            }
            return this;
        };

        return Slider;
    }
);
