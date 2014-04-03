define(
    ['jquery', 'jquery.event.move'],
    function($, $_move) {
        var has_touchstart = false;

        if('ontouchstart' in document.documentElement) {
            has_touchstart = true;
        }

        var Slider = function Constructor($el, onChange) {
            var self = this;
            this.$el = $el;
            this.$indicator = this.$el.find('.Slider-indicator');
            this.$thumb = this.$indicator.find('.Slider-thumb');
            this.offset = this.$indicator.offset().left;
            this.onChange = onChange;

            // Events
            this.$el.on('click', $.proxy(this.clicked, this));

            /**
            * Has touchstart event
            * ====================================================== */
            this.$el.on('touchstart', $.proxy(this.clicked, this));
            this.$thumb.on('movestart', function(evt) {
                self.$thumb.on('move', $.proxy(self.dragging, self));
                self.$thumb.addClass('is-active');
                self.$indicator.removeClass('is-moving');
            });
            this.$thumb.on('moveend', function() {
                self.$thumb.off('move');
                self.$thumb.removeClass('is-active');
                self.$el.trigger('updated');
                self.getState();
                self.onChange(self.value);
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
        };

        /**
         * Fire once on click and touchstart
         * To animate the bar to the location of the tap
         */
        Slider.prototype.clicked = function clicked(evt) {
            var x = evt.pageX - this.offset;
            this.$indicator.addClass('is-moving').css('width', x + 'px');
        }

        return Slider;
    }
);
