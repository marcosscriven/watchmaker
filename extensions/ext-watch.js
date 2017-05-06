methodDraw.addExtension("Watch", function (editor) {

    // Setup

    var currentDevice = "vivoactive_hr";

    var devices = {
        "epix":"205x148",
        "fr920xt":"205x148",
        "vivoactive":"205x148",
        "vivoactive_hr":"148x205"
    };

    var templates = {

        // Compound
        "Time": "{hour:%02d}:{min:%02d}",
        "Date": "{day:%02d}/{month:%02d}/{year}",

        // Vanilla
        "Year": "{year}",
        "Month": "{month}",
        "Day": "{day}",
        "Hour": "{hour}",
        "Min": "{min}",
        "Sec": "{sec}",
        "Short Month": "{monthM}",
        "Short Day": "{dayM}",
        "Full Month": "{monthL}",
        "Full Day": "{dayL}",
        "Active Minutes Goal": "{activeMinutesWeekGoal}",
        "Calories": "{calories}",
        "Distance": "{distance}",
        "Floors Climbed": "{floorsClimbed}",
        "Floors Goal": "{floorsClimbedGoal}",
        "Floors Descended": "{floorsDescended}",
        "Meters Climbed": "{metersClimbed}",
        "Meters Descended": "{metersDescended}",
        "Movebar Level": "{moveBarLevel}",
        "Steps Goal": "{stepGoal}",
        "Steps": "{steps:%5d}",
        "Battery": "{battery}",
        "Phone Connected": "{phoneConnected}"
    };

    function getTemplateKey(template) {
        for(key in templates) {
            if(templates[key] === template) {
                return key;
            }
        }
        return "custom";
    }

    function getTextForTemplate(template) {
     return template.replace(/{(.*?)}/g, function (match, group) {

         var monthNames = ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"
         ];

         var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

         var now = new Date();
         var param = group.split(':')[0];
         var format = group.split(':')[1]
         var text = "";
         
         switch (param) {
             case "year":
                 text = now.getFullYear();
                 break;
             case "month":
                 text = now.getMonth()+1;
                 break;
             case "day":
                 text = now.getDate();
                 break;
             case "hour":
                 text = now.getHours();
                 break;
             case "min":
                 text = now.getMinutes();
                 break;
             case "sec":
                 text = now.getSeconds();
                 break;
             case "monthM":
                 text = monthNames[now.getMonth()].substring(0,3);
                 break;
             case "dayM":
                 text = dayNames[now.getDay()].substring(0,3);
                 break;
             case "monthL":
                 text = monthNames[now.getMonth()];
                 break;
             case "dayL":
                 text = dayNames[now.getDay()];
                 break;
             case "activeMinutesWeekGoal":
                 text = "120";
                 break;
             case "calories":
                 text = "2200";
                 break;
             case "distance":
                 text = "11.2";
                 break;
             case "floorsClimbed":
                 text = "26";
                 break;
             case "floorsClimbedGoal":
                 text = "50";
                 break;
             case "floorsDescended":
                 text = "4";
                 break;
             case "metersClimbed":
                 text = "102";
                 break;
             case "metersDescended":
                 text = "142";
                 break;
             case "moveBarLevel":
                 text = "4";
                 break;
             case "stepGoal":
                 text = "9500";
                 break;
             case "steps":
                 text = "11242";
                 break;
             case "battery":
                 text = "46";
                 break;
             case "phoneConnected":
                 text = "yes";
                 break;
             default:
                 text = "???"
         }

         try {
             return format ? sprintf(format, text) : text;
         }
         catch (e) {
             console.error("Couldn't format text:" + text + "with format:" + format);
             return text;
         }
     });
    }

    function updateAllTemplates() {
        $(svgcontent).find(".watch").each(
            function (i, e) {
                var id = $(e).attr('id');
                var template = $(e).attr('data-template');
                var text = getTextForTemplate(template);
                e.textContent = text;
            }
        );
        setTimeout(updateAllTemplates, 1000);
    }

    setTimeout(updateAllTemplates, 1000);

    var fontSizes = {
        "XTINY" : "Extra Tiny",
        "TINY" : "Tiny",
        "SMALL" : "Small",
        "MEDIUM" : "Medium",
        "LARGE" : "Large",
        "NUMBER_MILD" : "Small Number",
        "NUMBER_MEDIUM" : "Medium Number",
        "NUMBER_HOT" : "Large Number",
        "NUMBER_THAI_HOT" : "Extra Large Number"
    };

    var fontToSize = {
        "XTINY" : 13,
        "TINY" : 13,
        "SMALL" : 14,
        "MEDIUM" : 18,
        "LARGE" : 19,
        "NUMBER_MILD" : 18,
        "NUMBER_MEDIUM" : 30,
        "NUMBER_HOT" : 36,
        "NUMBER_THAI_HOT" : 45
    };
        
    var templates
    (function init() {

        // Select options
        for (var key in templates) {
            $('#watch_type')
                .append($("<option></option>")
                    .attr("value",templates[key])
                    .text(key)); 
        }

        for (var key in fontSizes) {
            $('#watch_font_size')
                .append($("<option></option>")
                    .attr("value", key)
                    .text(fontSizes[key]));
        }

        for (var key in devices) {
            $('#resolution')
                .append($("<option></option>")
                    .attr("value", devices[key])
                    .text(key));
        }

        // Change events

        $('#watch_font_size').change(function(){
            var selected = $(this).val();
            var fontSize = fontToSize[selected];

            $("#watch_font_size_label").html(this.options[this.selectedIndex].text)
            console.log("Set font name:" + selected + "  and size:" + fontSize);
            svgCanvas.changeSelectedAttribute("font-size", fontSize);
            svgCanvas.changeSelectedAttribute("data-font", selected);
        });

        $('#resolution').change(function(){
            var selected = this.options[this.selectedIndex].text;
            console.log("Setting device:" + selected);
            currentDevice = selected;
        });

        $('#watch_type').change(function(){
            var template = $(this).val();
            svgCanvas.changeSelectedAttribute("data-template", template);
            $("#watch_template").val(template);
            $("#watch_type_label").html(this.options[this.selectedIndex].text);
            updateAllTemplates();
        });

        $('#watch_template').change(function(){
            var template = $(this).val();
            svgCanvas.changeSelectedAttribute("data-template", template);
            $("#watch_template").val(template);
            $("#watch_type_label").html(getTemplateKey(template));
            updateAllTemplates();
        });

        // Initial document
        Editor.loadFromURL("extensions/watchlib/default.svg", {
            callback: function () {
                //$("#zoom").val(300).trigger("change");
                updateAllTemplates();
            }
        });

    })();

    function updateWatchPanel(elem) {

        var fontType = $(elem).attr("data-font");
        var template = $(elem).attr("data-template");

        var fontName = fontSizes[fontType];
        $("#watch_font_size").val(fontName);
        $("#watch_font_size_label").html(fontName);
        $("#watch_template").val(template);
        $("#watch_type_label").html(getTemplateKey(template));
    }

    function makeWatch() {

        console.log("Building watchface");
        $.process_cancel("Building watchface...", restartWorker);
        $("#dialog_content").append("<div id='progress'></div>");

        var bar = new ProgressBar.Line($("#progress")[0], {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: '100%', height: '100%'},
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            step: function (state, bar)  {
                bar.path.setAttribute('stroke', state.color);
            }
        });

        var progress = 0.0;
        (function updateProgress() {
            try {
                bar.animate(progress);
            }
            catch (e) {
                // Ignore errors here
            }

            // Assume four minutes
            progress += (1.0 / 240);
            setTimeout(updateProgress, 1000);
        })();

        monkeyClient.loadTemplate('watchapp')
            .then(saveCanvas)
            .then(function (imageBlob) { return monkeyClient.writeFile('resources/images/watchface.png', imageBlob, true) })
            .then(addDynamicElements)
            .then(function () { return monkeyClient.make(currentDevice) })
            .then(saveBlob);
    }

    function addDynamicElements() {

        var oParser = new DOMParser();
        return monkeyClient.readFile('resources/layouts.xml')
            .then(function (xmlString) { return oParser.parseFromString(xmlString, "text/xml") })
            .then(addSvgElements)
            .then(function (xml) { return new XMLSerializer().serializeToString(xml) })
            .then(function (xmlString) { console.log(xmlString); return xmlString })
            .then(function (xmlString) { return monkeyClient.writeFile('resources/layouts.xml', xmlString) });

    }

    function addSvgElements(xmlDoc) {
        $(svgcontent).find(".watch").each(
            function (i, e) {
                var id = $(e).attr('id');
                var template = $(e).attr('data-template');

                var bBox = e.getBBox();
                var x = Math.round($(e).attr('x') + (bBox.width / 2.0) );
                var y = Math.round($(e).attr('y') - bBox.height);

                var color = $(e).attr('fill').replace("#", "0x");

                // TODO
                var font = "Gfx.FONT_" + $(e).attr('data-font');

                // TODO
                // var justify = $(e).attr('text-align');
                var justify = "Gfx.TEXT_JUSTIFY_CENTER";

                addLabelElementToDoc(xmlDoc, i, template, x, y, font, color, justify);
            }
        );

        return xmlDoc;
    }

    function addTestLabels(xmlDoc) {
        addLabelElementToDoc(xmlDoc, "dynamic0", '{hour}:{min:%02d}:{sec:%02d}', 10, 10, "Gfx.FONT_TINY", "Gfx.COLOR_WHITE", "Gfx.TEXT_JUSTIFY_RIGHT");
        addLabelElementToDoc(xmlDoc, "dynamic1", '{battery:%02d}%', 10, 22, "Gfx.FONT_TINY", "Gfx.COLOR_RED", "Gfx.TEXT_JUSTIFY_LEFT");
        return xmlDoc;
    }

    function addLabelElementToDoc(xmlDoc, id, template, x, y, font, color, justification) {

        /*
            E.g :

                 <drawable class="DynamicText" id="dynamic0">
                     <param name="template">"{hour}:{min}:{sec:%02d}"</param>
                     <param name="locX">10</param>
                     <param name="locY">10</param>
                     <param name="font">Gfx.FONT_TINY</param>
                 </drawable>
        */

        var labelElement = xmlDoc.createElement('drawable');
        labelElement.setAttribute('class', 'DynamicText');
        labelElement.setAttribute('id', id);

        var quotedTemplate = '\"' + template + '\"';
        labelElement.appendChild(addParamElement(xmlDoc, 'template', quotedTemplate));
        labelElement.appendChild(addParamElement(xmlDoc, 'locX', x));
        labelElement.appendChild(addParamElement(xmlDoc, 'locY', y));
        labelElement.appendChild(addParamElement(xmlDoc, 'font', font));
        labelElement.appendChild(addParamElement(xmlDoc, 'color', color));
        labelElement.appendChild(addParamElement(xmlDoc, 'justification', justification));

        xmlDoc.documentElement.children[0].appendChild(labelElement);

        return xmlDoc;
    }

    function addParamElement(xmlDoc, name, value) {
        var param = xmlDoc.createElement('param');
        param.setAttribute('name', name);
        param.appendChild(xmlDoc.createTextNode(value));
        return param;
    }

    function saveCanvas() {
        return new Promise(function (resolve, reject) {
            if (!$('#export_canvas').length) {
                $('<canvas>', {id: 'export_canvas'}).hide().appendTo('body');
            }
            var c = $('#export_canvas')[0];
            c.width = svgCanvas.contentW;
            c.height = svgCanvas.contentH;
            $.getScript('lib/canvg/canvg.js', function () {

                $(svgcontent).find(".watch").attr("opacity", "0");
                canvg(c, svgCanvas.svgCanvasToString(), {
                    renderCallback: function () {
                        var datauri = c.toDataURL('image/png');
                        var uiStrings = methodDraw.uiStrings;
                        var png_data = svgedit.utilities.encode64(datauri);
                        $(svgcontent).find(".watch").attr("opacity", "100");
                        var imageBlob = datauri.replace(/^data:image\/(png|jpg);base64,/, '');
                        resolve(imageBlob)
                    }
                })
            });
        })
    }

    function saveBlob(blob) {
        console.log("Saving blob.");
        $.alert('Watchface successfully built.');
        var data = new Blob([new Uint8Array(blob.data)], {type: "octet/octet-binary"});
        saveAs(data, 'watch.prg', false);
    }

    function setPanels() {
        $('#text_panel').hide();
        $('#selected_panel').hide();
        $('#stroke_panel').hide();
        $('#watch_panel').show();
    }

    return {
        name: "Watch",
        svgicons: "extensions/watch-icon.xml",
        buttons: [{
            id: "watch",
            type: "mode",
            title: "Watch Components",
            events: {
                'click': function () {
                    svgCanvas.setMode("watch");
                }
            }
        },
            {
                id: "build_watchface",
                type: "menu",
                panel: "file_menu",
                title: "Build watchface",
                events: {
                    'click': function () {
                        makeWatch();
                    }
                }
            }
        ],
        mouseDown: function (opts) {

            if (svgCanvas.getMode() == "watch") {
                var newWidget = editor.addSvgElementFromJson({
                    "element": "text",
                    "curStyles": false,
                    "attr": {
                        "x": opts.start_x,
                        "y": opts.start_y,
                        "id": svgCanvas.getNextId(),
                        "fill": svgCanvas.getStyle().fill,
                        "font-size": fontSizes['TINY'],
                        "font-family": svgCanvas.getFontFamily(),
                        "data-template": templates['Time'],
                        "data-font": "TINY",
                        "text-anchor": "start",
                        "xml:space": "preserve",
                        "opacity": svgCanvas.getOpacity(),
                        "class": "watch"
                    }
                });

                newWidget.textContent = getTextForTemplate(templates['Time']);
                svgCanvas.setMode('select');
                svgCanvas.addToSelection([newWidget], true);
                return {started: true};
            }
            else if (svgCanvas.getMode() == "select") {
                var selectedElement = opts.selectedElements[0];
                svgCanvas.selectorManager.requestSelector(selectedElement).showGrips(false);
                return {started: true};
            }
        },
        mouseMove: function (opts) {
            // Prevent resizing watch elements
            if (svgCanvas.getMode() == "resize" && $(opts.selected).attr('class') == "watch") {
                //svgCanvas.removeFromSelection([opts.selected]);
                svgCanvas.getTransformList(opts.selected).clear();
            }
        },
        mouseUp: function (opts) {
            if (svgCanvas.getMode() == "watch") {
                return {
                    keep: true
                }
            }
        },
        callback: function () {
            methodDraw.setCustomHandlers({
                mything: function (win, data) {
                    console.log("Watch hanlder");
                }
            });
        },
        selectedChanged: function(opts) {
            //opts.elems.map(function (e) { })
            //setPanels();
            //updateWatchPanel(opts.element);
        },
        elementChanged: function(opts) {
            var elem = opts.elems[0];
            if (elem && $(elem).attr('class') == 'watch' ) {
                setPanels();
                updateWatchPanel(elem);
            }
        }
    };

});

