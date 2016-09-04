/**
 jquery.businessHours v1.0.1
 https://github.com/gEndelf/jquery.businessHours

 requirements:
 - jQuery 1.7+

 recommended time-picker:
 - jquery-timepicker 1.2.7+ // https://github.com/jonthornton/jquery-timepicker
 **/

(function($) {
    $.fn.businessHours = function(opts) {
        var defaults = {
            preInit: function() {
            },
            postInit: function() {
            },
            postCreateTime: function() {
            },
            inputDisabled: false,
            checkedColorClass: "WorkingDayState",
            uncheckedColorClass: "RestDayState",
            colorBoxVal$containerClass: "colorBox$container",
            weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            operationTime: [
                {},
                {},
                {},
                {},
                {},
                {isActive: false},
                {isActive: false}
            ],
            defaultOperationTimeFrom: '9:00',
            defaultOperationTimeTill: '18:00',
            defaultActive: true,
            //labelOn: "Working day",
            //labelOff: "Day off",
            //labelTimeFrom: "from:",
            //labelTimeTill: "till:",
            $containerTmpl: '<div class="clean"/>',
            dayTmpl:
              '<div class="dayContainer">' +
                '<div data-original-title="" class="colorBox"><input type="checkbox" class="invisible operationState"/></div>' +
                '<div class="weekday"></div>' +
                '<div class="operationDayTimeContainer">' +
                  '<div class="operationTime">' +
                    '<input type="text" name="startTime" class="mini-time operationTimeFrom" value=""/>' +
                    '<input type="text" name="endTime" class="mini-time operationTimeTill" value=""/>' +
                  '</div>' +
                  '<div class="operators">' +
                    '<a class="add"><img width="20" height="20" title="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAEfSURBVDhPtVVLcoJAFISYsyUsjIfS3MMd3xvAgjVrFslQHEFvoGD3+EyGccBQwa7q8tV73e0DRvRcSNN0FcfxB7hPkqTG55GUep9l2ZoakU8DpgBUYP+A1ARiu0ff9z6+/RPsLOMoRbuD3b+mGODAFM9hFEUM/QWawdhmRVGcm6Y5kaxdGvFeL78sy1c0Glt0Y1VVZ9wODdYujVDpB4ViYw0GnBFIbjxsx6PhGmrOCWQWN6zNZp7nHYw0a7Zt20mers0ZtaYXrBl4MJtKqZ+NHoFa04sNj08JXPaSn/FQlj02ix9sIgzDf//0mKHDbkBz6xL/hfRKzAA+hruxTV0U7fBNYwOid/DbNjv4hTf3m9imgfv/gtDJvwBqRG7A8y7z/BHhIrq2kgAAAABJRU5ErkJggg==" /></a>' +
                    '<a class="remove"><img width="20" height="20" title="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMK0KCsAAAAD8SURBVDhPtVVJEoIwEAT1bcpBeZT4D26sP+DCmTMHjW/QJ0jsgbEMMSIR6KouqEl3M6kM4JiQZdk6SZIDGKZpWuN6J/J9mOf5njQsHwZMHihA+YOk8dj2CSmli6efwEYzfiVrA9jdLkUBLahiG8ZxTKFvoOjZdKaTvd32y7LcoHDVRX9QtAeFG19bmELfQXc0GqZFa1IWdVirxaIomqqq5BiSVvWCNQXe1KIQ4oERGgXSql50eF8kcN4tL3Eo847N7INNiKJo8qtHGW3YCygeTeIxJC/H9OBiMbDplLX9L40OiHbgRTcbeMaXe8u2YWBmVwgd/AWQhuUKHOcJNzj62iDrHWcAAAAASUVORK5CYII=" /></a>' +
                  '</div>' +
                '</div>' +
              '</div>'
        };

        var $container = $(this);

        function initTimeBox(timeBoxSelector, time, isInputDisabled) {
            timeBoxSelector.val(time);

            if(isInputDisabled) {
                timeBoxSelector.prop('readonly', true);
            }
        }
        
        var methods = {
            getValueOrDefault: function(val, defaultVal) {
                return (jQuery.type(val) === "undefined" || val == null) ? defaultVal : val;
            },
            initOperationTime: function($operationTimes, index, time) {
              
                var options = this.options;
              
                $time = $operationTimes.eq(index);
                if (!$time.length) {
                  $template = $operationTimes.eq(0);
                  $time = $template.clone().insertAfter($template);
                }
                
                var startTime, endTime;
                if (time != null) {
                  startTime = this.getValueOrDefault(time.start, options.defaultOperationTimeFrom);
                  endTime = this.getValueOrDefault(time.end, options.defaultOperationTimeTill);
                } else {
                  if (index > 0) {
                    startTime = $operationTimes.eq(index - 1).find('[name="endTime"]').val();
                  } else {
                    startTime = options.defaultOperationTimeFrom;
                  }
                  endTime = options.defaultOperationTimeTill;
                }
                
                initTimeBox($time.find('[name="startTime"]'), startTime, options.inputDisabled);
                initTimeBox($time.find('[name="endTime"]'), endTime, options.inputDisabled);
                
                if(typeof this.options.postCreateTime === "function") {
                    this.options.postCreateTime($time);
                }
            },
            init: function(opts) {
                this.options = $.extend(defaults, opts);
                $container.html("");

                if(typeof this.options.preInit === "function") {
                    this.options.preInit();
                }

                this.initView(this.options);

                if(typeof this.options.postInit === "function") {
                    //$('.operationTimeFrom, .operationTimeTill').timepicker(options.timepickerOptions);
                    this.options.postInit();
                }

                return {
                    serialize: function() {
                        var data = [];

                        $container.find('.operationState').each(function(num, item) {
                            var isWorkingDay = $(item).prop('checked');
                            var $dayContainer = $(item).parents('.dayContainer');

                            data.push({
                                isActive: isWorkingDay,
                                times : !isWorkingDay ? null : $dayContainer
                                  .find('.operationTime')
                                  .map(function(i, el) {
                                    return {
                                      start: $('[name="startTime"]', el).val(),
                                      end: $('[name="endTime"]', el).val()
                                    }
                                  })
                            });
                        });

                        return data;
                    }
                };
            },
            initView: function(options) {
                var stateClasses = [options.checkedColorClass, options.uncheckedColorClass];
                var subcontainer = $container.append($(options.$containerTmpl));
                var $this = this;

                for(var i = 0; i < options.weekdays.length; i++) {
                    subcontainer.append(options.dayTmpl);
                }

                $.each(options.weekdays, function(pos, weekday) {
                    // populate form
                    var day = options.operationTime[pos];
                    var $operationDayNode = $container.find('.dayContainer').eq(pos);
                    $operationDayNode.find('.weekday').html(weekday);

                    var isWorkingDay = $this.getValueOrDefault(day.isActive, options.defaultActive);
                    $operationDayNode.find('.operationState').prop('checked', isWorkingDay);

                    $operationTimes = $operationDayNode.find('.operationTime');
                    
                    if (!day.times) {
                        $this.initOperationTime($operationTimes, 0, {});
                    } else {
                        for (var i=0; i < day.times.length; i++) {
                            $this.initOperationTime($operationTimes, i, day.times[i]);
                        }
                    }
                });

                $container.find(".operationState").change(function() {
                    var checkbox = $(this);
                    var boxClass = options.checkedColorClass;
                    var timeControlDisabled = false;

                    if(!checkbox.prop("checked")) {
                        // disabled
                        boxClass = options.uncheckedColorClass;
                        timeControlDisabled = true;
                    }

                    checkbox.parents(".colorBox").removeClass(stateClasses.join(' ')).addClass(boxClass);
                    checkbox.parents(".dayContainer").find(".operationDayTimeContainer").toggle(!timeControlDisabled);
                }).trigger("change");

                if(!options.inputDisabled) {
                    $container.find(".colorBox").on("click", function() {
                        var checkbox = $(this).find(".operationState");
                        checkbox.prop("checked", !checkbox.prop('checked')).trigger("change");
                    });
                    $container.find(".add").on("click", function() {
                        $operationTimes = $(this).parents('.dayContainer').find('.operationTime:last');
                        $this.initOperationTime($operationTimes, $operationTimes.length, null);
                    });
                    $container.find(".remove").on("click", function() {
                        $dayContainer = $(this).parents('.dayContainer');
                        
                        $operationTimes = $dayContainer.find('.operationTime');
                        if ($operationTimes.length > 1) {
                            $operationTimes.last().remove();
                        } else{
                            var checkbox = $dayContainer.find(".operationState");
                            checkbox.prop("checked", false).trigger("change");
                        }
                    });
                }
            }
        };

        return methods.init(opts);
    };
})(jQuery);
