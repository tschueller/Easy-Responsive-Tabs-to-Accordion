/*!
 *  Easy Responsive Tabs Plugin
 *  Author: Samson.Onna <Email : samson3d@gmail.com>
 *  Modified by: Thorsten Schüller 2025 (made it accessible)
 */
(function ($) {
    $.fn.extend({
        easyResponsiveTabs: function (options) {
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                type: 'default', //default, vertical, accordion;
                width: 'auto',
                fit: true,
                closed: false,
                tabidentify: '',
                activetab_bg: 'white',
                inactive_bg: '#F5F5F5',
                active_border_color: '#c1c1c1',
                active_content_border_color: '#c1c1c1',
                accordionTitleHeading: 'h2',
                activate: function () {
                }
            }
            //Variables
            var options = $.extend(defaults, options);
            var opt = options, jtype = opt.type, jfit = opt.fit, jwidth = opt.width, vtabs = 'vertical', accord = 'accordion';
            var hash = window.location.hash;
            var historyApi = !!(window.history && history.replaceState);

            //Events
            $(this).on('tabactivate', function (e, currentTab) {
                if (typeof options.activate === 'function') {
                    options.activate.call(currentTab, e)
                }
            });

            //Main function
            this.each(function () {
                var $respTabs = $(this);
                var $respTabsList = $respTabs.find('ul.resp-tabs-list.' + options.tabidentify);
                var respTabsId = $respTabs.attr('id');
                $respTabs.find('ul.resp-tabs-list.' + options.tabidentify + ' li').addClass('resp-tab-item').addClass(options.tabidentify);
                $respTabs.css({
                    'display': 'block',
                    'width': jwidth
                });

                $respTabsList.attr('role', 'tablist');
                if (options.type == 'vertical')
                    $respTabsList.css('margin-top', '3px');

                $respTabs.find('.resp-tabs-container.' + options.tabidentify).css('border-color', options.active_content_border_color);
                $respTabs.find('.resp-tabs-container.' + options.tabidentify + ' > div').addClass('resp-tab-content').addClass(options.tabidentify);
                jtab_options();
                //Properties Function
                function jtab_options() {
                    if (jtype == vtabs) {
                        $respTabs.addClass('resp-vtabs').addClass(options.tabidentify);
                    }
                    if (jfit == true) {
                        $respTabs.css({ width: '100%', margin: '0px' });
                    }
                    if (jtype == accord) {
                        $respTabs.addClass('resp-easy-accordion').addClass(options.tabidentify);
                        $respTabs.find('.resp-tabs-list').css('display', 'none');
                    }
                }

                //Assigning the h2 markup to accordion title
                var $tabItemHeader;
                $respTabs.find('.resp-tab-content.' + options.tabidentify).before("<" + options.accordionTitleHeading + " class='resp-accordion " + options.tabidentify + "'><span class='resp-arrow'></span></" + options.accordionTitleHeading +">");

                $respTabs.find('.resp-tab-content.' + options.tabidentify).prev(options.accordionTitleHeading).css({
                    'background-color': options.inactive_bg,
                    'border-color': options.active_border_color
                });

                $respTabs.find('.resp-accordion').each(function (itemCount) {
                    $tabItemHeader = $(this);
                    var $tabItem = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')');
                    var $accItem = $respTabs.find('.resp-accordion:eq(' + itemCount + ')');
                    $accItem.append($tabItem.html());
                    $accItem.data($tabItem.data());
                    $tabItemHeader.attr('tabindex', '0');
                    $tabItemHeader.attr('role', 'button');
                    $tabItemHeader.attr('aria-expanded', 'false');
                    $tabItemHeader.attr('aria-controls', options.tabidentify + '_tab_content-' + itemCount);
                });

                //Assigning the 'aria-controls' to Tab items
                var $tabContent;
                $respTabs.find('.resp-tab-item').each(function (index) {
                    var $tabItem = $(this);
                    $tabItem.attr('id', options.tabidentify + '_tab_item-' + index);
                    $tabItem.attr('aria-controls', options.tabidentify + '_tab_content-' + index);
                    $tabItem.attr('role', 'tab');
                    $tabItem.attr('aria-selected', 'false');
                    $tabItem.attr('tabindex', '-1');
                    $tabItem.css({
                        'background-color': options.inactive_bg,
                        'border-color': 'none'
                    });
                });

                //Assigning the 'aria-labelledby' attr to tab-content
                $respTabs.find('.resp-tab-content.' + options.tabidentify).each(function (contentIndex) {
                    var $tabContent = $(this);
                    $tabContent.attr('id', options.tabidentify + '_tab_content-' + contentIndex);
                    $tabContent.attr('role', 'tabpanel');
                    $tabContent.attr('aria-labelledby', options.tabidentify + '_tab_item-' + contentIndex).css({
                        'border-color': options.active_border_color
                    });
                });

                // Show correct content area
                var tabNum = 0;
                if (hash != '') {
                    var matches = hash.match(new RegExp(respTabsId + "([0-9]+)"));
                    if (matches !== null && matches.length === 2) {
                        tabNum = parseInt(matches[1], 10) - 1;
                        var count = $respTabs.find('.resp-tab-item').length;
                        if (tabNum >= count) {
                            tabNum = 0;
                        }
                    }
                }

                //Active correct tab
                $($respTabs.find('.resp-tab-item.' + options.tabidentify)[tabNum]).addClass('resp-tab-active').css({
                    'background-color': options.activetab_bg,
                    'border-color': options.active_border_color
                }).attr('aria-selected', 'true').attr('tabindex', '0');

                //keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode
                if (options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {
                    $($respTabs.find('.resp-accordion.' + options.tabidentify)[tabNum]).addClass('resp-tab-active').css({
                        'background-color': options.activetab_bg + ' !important',
                        'border-color': options.active_border_color,
                        'background': 'none'
                    }).attr('aria-expanded', 'true');

                    $($respTabs.find('.resp-tab-content.' + options.tabidentify)[tabNum]).addClass('resp-tab-content-active').addClass(options.tabidentify).attr('style', 'display:block');
                }
                //assign proper classes for when tabs mode is activated before making a selection in accordion mode
                else {
                   // $($respTabs.find('.resp-tab-content.' + options.tabidentify)[tabNum]).addClass('resp-accordion-closed'); //removed resp-tab-content-active
                }

                //Tab Click action function
                $respTabs.find(".resp-tab-item, .resp-accordion").each(function () {
                    var $currentTab = $(this);

                    $currentTab.on("click", handleTabClick);

                    $currentTab.on("keydown", function(event) {
                        var stopEvent = false;
                        var elmToFocus = null;
                        var accordion = $currentTab.hasClass('resp-accordion');
                        var verticalTabs = options.type === 'vertical';
                        switch (event.key) {
                            case 'Enter':
                            case ' ':
                                handleTabClick(event); stopEvent = true;
                                break;
                            case 'ArrowRight':
                                elmToFocus = event.currentTarget.nextElementSibling;
                                if (!verticalTabs && elmToFocus) { elmToFocus.focus(); stopEvent = true; }
                                break;
                            case 'ArrowLeft':
                                elmToFocus = event.currentTarget.previousElementSibling;
                                if (!verticalTabs && elmToFocus) { elmToFocus.focus(); stopEvent = true; }
                                break;
                            case 'ArrowDown':
                                if (accordion) {
                                    elmToFocus = $currentTab.nextAll(options.accordionTitleHeading+':first').get(0);
                                } else {
                                    elmToFocus = verticalTabs ? event.currentTarget.nextElementSibling : null;
                                }
                                if (elmToFocus) { elmToFocus.focus(); stopEvent = true; }
                                break;
                            case 'ArrowUp':
                                if (accordion) {
                                    elmToFocus = $currentTab.prevAll(options.accordionTitleHeading+':first').get(0);
                                } else {
                                    elmToFocus = verticalTabs ? event.currentTarget.previousElementSibling : null;
                                }
                                if (elmToFocus) { elmToFocus.focus(); stopEvent = true; }
                                break;
                            case 'Home':
                                var selector = accordion ? '.resp-accordion.' : '.resp-tab-item.';
                                $respTabs.find(selector + options.tabidentify).first().focus(); stopEvent = true;
                                break;
                            case 'End':
                                var selector = accordion ? '.resp-accordion.' : '.resp-tab-item.';
                                $respTabs.find(selector + options.tabidentify).last().focus(); stopEvent = true;
                                break;
                            default:
                                break;
                        }
                        if (stopEvent) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    });

                    function handleTabClick(event) {
                        var $currentTab = $(event.currentTarget);
                        var tabAria = $currentTab.attr('aria-controls');

                        if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
                            // handle accordion click: collapse
                            $respTabs.find('.resp-tab-content-active.' + options.tabidentify).slideUp('', function () {
                                $(this).addClass('resp-accordion-closed');
                            });
                            $currentTab.removeClass('resp-tab-active').css({
                                'background-color': options.inactive_bg,
                                'border-color': 'none'
                            }).attr('aria-expanded', 'false');
                            return false;
                        }
                        if ($currentTab.hasClass('resp-accordion') && !$currentTab.hasClass('resp-tab-active')) {
                            // handle accordion click: expand
                            var $activeTabAndHeader = $respTabs.find('.resp-tab-active.' + options.tabidentify);
                            $activeTabAndHeader.removeClass('resp-tab-active').css({
                                'background-color': options.inactive_bg,
                                'border-color': 'none'

                            });
                            $activeTabAndHeader.each(function() {
                                $element = $(this);
                                if ($element.attr('role') === 'tab') {
                                    $element.attr('aria-selected', 'false');
                                    $element.attr('tabindex', '-1'); // ??
                                } else {
                                    $element.attr('aria-expanded', 'false');
                                }
                            });

                            $respTabs.find('.resp-tab-content-active.' + options.tabidentify).slideUp().removeClass('resp-tab-content-active resp-accordion-closed');

                            var $tabAndHeader = $respTabs.find("[aria-controls=" + tabAria + "]");
                            $tabAndHeader.addClass('resp-tab-active').css({
                                'background-color': options.activetab_bg,
                                'border-color': options.active_border_color
                            });
                            $tabAndHeader.each(function() {
                                $element = $(this);
                                if ($element.attr('role') === 'tab') {
                                    $element.attr('aria-selected', 'true');
                                    $element.attr('tabindex', '0');
                                } else {
                                    $element.attr('aria-expanded', 'true');
                                }
                            });

                            $respTabs.find('#' + tabAria + '.resp-tab-content.' + options.tabidentify).slideDown().addClass('resp-tab-content-active');
                        } else {
                            // handle tab click
                            $activeTabAndHeader = $respTabs.find('.resp-tab-active.' + options.tabidentify);
                            $activeTabAndHeader.removeClass('resp-tab-active').css({
                                'background-color': options.inactive_bg,
                                'border-color': 'none'
                            });
                            $activeTabAndHeader.each(function() {
                                $element = $(this);
                                if ($element.attr('role') === 'tab') {
                                    $element.attr('aria-selected', 'false');
                                    $element.attr('tabindex', '-1');
                                } else {
                                    $element.attr('aria-expanded', 'false');
                                }
                            });

                            $respTabs.find('.resp-tab-content-active.' + options.tabidentify).removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');

                            var $tabAndHeader = $respTabs.find("[aria-controls=" + tabAria + "]")
                            $tabAndHeader.addClass('resp-tab-active').css({
                                'background-color': options.activetab_bg,
                                'border-color': options.active_border_color
                            });
                            $tabAndHeader.each(function() {
                                $element = $(this);
                                if ($element.attr('role') === 'tab') {
                                    $element.attr('aria-selected', 'true');
                                    $element.attr('tabindex', '0');
                                } else {
                                    $element.attr('aria-expanded', 'true');
                                }
                            });

                            $respTabs.find('#' + tabAria + '.resp-tab-content.' + options.tabidentify).addClass('resp-tab-content-active').attr('style', 'display:block');
                        }
                        //Trigger tab activation event
                        $currentTab.trigger('tabactivate', $currentTab);

                        //Update Browser History
                        if (historyApi) {
                            var currentHash = window.location.hash;
                            var tabAriaParts = tabAria.split('tab_content-');
                             // var newHash = respTabsId + (parseInt(tabAria.substring(9), 10) + 1).toString();
                            var newHash = respTabsId + (parseInt(tabAriaParts[1], 10) + 1).toString();
                            if (currentHash != "") {
                                var re = new RegExp(respTabsId + "[0-9]+");
                                if (currentHash.match(re) != null) {
                                    newHash = currentHash.replace(re, newHash);
                                }
                                else {
                                    newHash = currentHash + "|" + newHash;
                            }
                            }
                            else {
                                newHash = '#' + newHash;
                            }

                            history.replaceState(null, null, newHash);
                        }
                    };

                });

                //Window resize function
                $(window).resize(function () {
                    $respTabs.find('.resp-accordion-closed').removeAttr('style');
                });
            });
        }
    });
})(jQuery);

