import { c as bind_props } from "./index2.js";
import "./comlink.js";
var litegraph = {};
var hasRequiredLitegraph;
function requireLitegraph() {
  if (hasRequiredLitegraph) return litegraph;
  hasRequiredLitegraph = 1;
  (function(exports) {
    (function(global) {
      var LiteGraph = global.LiteGraph = {
        VERSION: 0.4,
        CANVAS_GRID_SIZE: 10,
        NODE_TITLE_HEIGHT: 30,
        NODE_TITLE_TEXT_Y: 20,
        NODE_SLOT_HEIGHT: 20,
        NODE_WIDGET_HEIGHT: 20,
        NODE_WIDTH: 140,
        NODE_MIN_WIDTH: 50,
        NODE_COLLAPSED_RADIUS: 10,
        NODE_COLLAPSED_WIDTH: 80,
        NODE_TITLE_COLOR: "#999",
        NODE_SELECTED_TITLE_COLOR: "#FFF",
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: "#AAA",
        NODE_SUBTEXT_SIZE: 12,
        NODE_DEFAULT_COLOR: "#333",
        NODE_DEFAULT_BGCOLOR: "#353535",
        NODE_DEFAULT_BOXCOLOR: "#666",
        NODE_DEFAULT_SHAPE: "box",
        NODE_BOX_OUTLINE_COLOR: "#FFF",
        DEFAULT_SHADOW_COLOR: "rgba(0,0,0,0.5)",
        DEFAULT_GROUP_FONT: 24,
        WIDGET_BGCOLOR: "#222",
        WIDGET_OUTLINE_COLOR: "#666",
        WIDGET_TEXT_COLOR: "#DDD",
        WIDGET_SECONDARY_TEXT_COLOR: "#999",
        LINK_COLOR: "#9A9",
        EVENT_LINK_COLOR: "#A86",
        CONNECTING_LINK_COLOR: "#AFA",
        MAX_NUMBER_OF_NODES: 1e3,
        //avoid infinite loops
        DEFAULT_POSITION: [100, 100],
        //default node position
        VALID_SHAPES: ["default", "box", "round", "card"],
        //,"circle"
        //shapes are used for nodes but also for slots
        BOX_SHAPE: 1,
        ROUND_SHAPE: 2,
        CIRCLE_SHAPE: 3,
        CARD_SHAPE: 4,
        ARROW_SHAPE: 5,
        GRID_SHAPE: 6,
        // intended for slot arrays
        //enums
        INPUT: 1,
        OUTPUT: 2,
        EVENT: -1,
        //for outputs
        ACTION: -1,
        //for inputs
        NODE_MODES: ["Always", "On Event", "Never", "On Trigger"],
        // helper, will add "On Request" and more in the future
        NODE_MODES_COLORS: ["#666", "#422", "#333", "#224", "#626"],
        // use with node_box_coloured_by_mode
        ALWAYS: 0,
        ON_EVENT: 1,
        NEVER: 2,
        ON_TRIGGER: 3,
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4,
        CENTER: 5,
        LINK_RENDER_MODES: ["Straight", "Linear", "Spline"],
        // helper
        STRAIGHT_LINK: 0,
        LINEAR_LINK: 1,
        SPLINE_LINK: 2,
        NORMAL_TITLE: 0,
        NO_TITLE: 1,
        TRANSPARENT_TITLE: 2,
        AUTOHIDE_TITLE: 3,
        VERTICAL_LAYOUT: "vertical",
        // arrange nodes vertically
        proxy: null,
        //used to redirect calls
        node_images_path: "",
        debug: false,
        catch_exceptions: true,
        throw_errors: true,
        allow_scripts: false,
        //if set to true some nodes like Formula would be allowed to evaluate code that comes from unsafe sources (like node configuration), which could lead to exploits
        use_deferred_actions: true,
        //executes actions during the graph execution flow
        registered_node_types: {},
        //nodetypes by string
        node_types_by_file_extension: {},
        //used for dropping files in the canvas
        Nodes: {},
        //node types by classname
        Globals: {},
        //used to store vars between graphs
        searchbox_extras: {},
        //used to add extra features to the search box
        auto_sort_node_types: false,
        // [true!] If set to true, will automatically sort node types / categories in the context menus
        node_box_coloured_when_on: false,
        // [true!] this make the nodes box (top left circle) coloured when triggered (execute/action), visual feedback
        node_box_coloured_by_mode: false,
        // [true!] nodebox based on node mode, visual feedback
        dialog_close_on_mouse_leave: true,
        // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false
        dialog_close_on_mouse_leave_delay: 500,
        shift_click_do_break_link_from: false,
        // [false!] prefer false if results too easy to break links - implement with ALT or TODO custom keys
        click_do_break_link_to: false,
        // [false!]prefer false, way too easy to break links
        search_hide_on_mouse_leave: true,
        // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false
        search_filter_enabled: false,
        // [true!] enable filtering slots type in the search widget, !requires auto_load_slot_types or manual set registered_slot_[in/out]_types and slot_types_[in/out]
        search_show_all_on_open: true,
        // [true!] opens the results list when opening the search widget
        auto_load_slot_types: false,
        // [if want false, use true, run, get vars values to be statically set, than disable] nodes types and nodeclass association with node types need to be calculated, if dont want this, calculate once and set registered_slot_[in/out]_types and slot_types_[in/out]
        // set these values if not using auto_load_slot_types
        registered_slot_in_types: {},
        // slot types for nodeclass
        registered_slot_out_types: {},
        // slot types for nodeclass
        slot_types_in: [],
        // slot types IN
        slot_types_out: [],
        // slot types OUT
        slot_types_default_in: [],
        // specify for each IN slot type a(/many) default node(s), use single string, array, or object (with node, title, parameters, ..) like for search
        slot_types_default_out: [],
        // specify for each OUT slot type a(/many) default node(s), use single string, array, or object (with node, title, parameters, ..) like for search
        alt_drag_do_clone_nodes: false,
        // [true!] very handy, ALT click to clone and drag the new node
        do_add_triggers_slots: false,
        // [true!] will create and connect event slots when using action/events connections, !WILL CHANGE node mode when using onTrigger (enable mode colors), onExecuted does not need this
        allow_multi_output_for_events: true,
        // [false!] being events, it is strongly reccomended to use them sequentially, one by one
        middle_click_slot_add_default_node: false,
        //[true!] allows to create and connect a ndoe clicking with the third button (wheel)
        release_link_on_empty_shows_menu: false,
        //[true!] dragging a link to empty space will open a menu, add from list, search or defaults
        pointerevents_method: "mouse",
        // "mouse"|"pointer" use mouse for retrocompatibility issues? (none found @ now)
        // TODO implement pointercancel, gotpointercapture, lostpointercapture, (pointerover, pointerout if necessary)
        ctrl_shift_v_paste_connect_unselected_outputs: false,
        //[true!] allows ctrl + shift + v to paste nodes with the outputs of the unselected nodes connected with the inputs of the newly pasted nodes
        // if true, all newly created nodes/links will use string UUIDs for their id fields instead of integers.
        // use this if you must have node IDs that are unique across all graphs and subgraphs.
        use_uuids: false,
        /**
         * Register a node class so it can be listed when the user wants to create a new one
         * @method registerNodeType
         * @param {String} type name of the node and path
         * @param {Class} base_class class containing the structure of a node
         */
        registerNodeType: function(type, base_class) {
          if (!base_class.prototype) {
            throw "Cannot register a simple object, it must be a class with a prototype";
          }
          base_class.type = type;
          if (LiteGraph.debug) {
            console.log("Node registered: " + type);
          }
          const classname = base_class.name;
          const pos2 = type.lastIndexOf("/");
          base_class.category = type.substring(0, pos2);
          if (!base_class.title) {
            base_class.title = classname;
          }
          for (var i2 in LGraphNode.prototype) {
            if (!base_class.prototype[i2]) {
              base_class.prototype[i2] = LGraphNode.prototype[i2];
            }
          }
          const prev = this.registered_node_types[type];
          if (prev) {
            console.log("replacing node type: " + type);
          }
          if (!Object.prototype.hasOwnProperty.call(base_class.prototype, "shape")) {
            Object.defineProperty(base_class.prototype, "shape", {
              set: function(v2) {
                switch (v2) {
                  case "default":
                    delete this._shape;
                    break;
                  case "box":
                    this._shape = LiteGraph.BOX_SHAPE;
                    break;
                  case "round":
                    this._shape = LiteGraph.ROUND_SHAPE;
                    break;
                  case "circle":
                    this._shape = LiteGraph.CIRCLE_SHAPE;
                    break;
                  case "card":
                    this._shape = LiteGraph.CARD_SHAPE;
                    break;
                  default:
                    this._shape = v2;
                }
              },
              get: function() {
                return this._shape;
              },
              enumerable: true,
              configurable: true
            });
            if (base_class.supported_extensions) {
              for (let i3 in base_class.supported_extensions) {
                const ext = base_class.supported_extensions[i3];
                if (ext && ext.constructor === String) {
                  this.node_types_by_file_extension[ext.toLowerCase()] = base_class;
                }
              }
            }
          }
          this.registered_node_types[type] = base_class;
          if (base_class.constructor.name) {
            this.Nodes[classname] = base_class;
          }
          if (LiteGraph.onNodeTypeRegistered) {
            LiteGraph.onNodeTypeRegistered(type, base_class);
          }
          if (prev && LiteGraph.onNodeTypeReplaced) {
            LiteGraph.onNodeTypeReplaced(type, base_class, prev);
          }
          if (base_class.prototype.onPropertyChange) {
            console.warn(
              "LiteGraph node class " + type + " has onPropertyChange method, it must be called onPropertyChanged with d at the end"
            );
          }
          if (this.auto_load_slot_types) {
            new base_class(base_class.title || "tmpnode");
          }
        },
        /**
         * removes a node type from the system
         * @method unregisterNodeType
         * @param {String|Object} type name of the node or the node constructor itself
         */
        unregisterNodeType: function(type) {
          const base_class = type.constructor === String ? this.registered_node_types[type] : type;
          if (!base_class) {
            throw "node type not found: " + type;
          }
          delete this.registered_node_types[base_class.type];
          if (base_class.constructor.name) {
            delete this.Nodes[base_class.constructor.name];
          }
        },
        /**
        * Save a slot type and his node
        * @method registerSlotType
        * @param {String|Object} type name of the node or the node constructor itself
        * @param {String} slot_type name of the slot type (variable type), eg. string, number, array, boolean, ..
        */
        registerNodeAndSlotType: function(type, slot_type, out) {
          out = out || false;
          const base_class = type.constructor === String && this.registered_node_types[type] !== "anonymous" ? this.registered_node_types[type] : type;
          const class_type = base_class.constructor.type;
          let allTypes = [];
          if (typeof slot_type === "string") {
            allTypes = slot_type.split(",");
          } else if (slot_type == this.EVENT || slot_type == this.ACTION) {
            allTypes = ["_event_"];
          } else {
            allTypes = ["*"];
          }
          for (let i2 = 0; i2 < allTypes.length; ++i2) {
            let slotType = allTypes[i2];
            if (slotType === "") {
              slotType = "*";
            }
            const registerTo = out ? "registered_slot_out_types" : "registered_slot_in_types";
            if (this[registerTo][slotType] === void 0) {
              this[registerTo][slotType] = { nodes: [] };
            }
            if (!this[registerTo][slotType].nodes.includes(class_type)) {
              this[registerTo][slotType].nodes.push(class_type);
            }
            if (!out) {
              if (!this.slot_types_in.includes(slotType.toLowerCase())) {
                this.slot_types_in.push(slotType.toLowerCase());
                this.slot_types_in.sort();
              }
            } else {
              if (!this.slot_types_out.includes(slotType.toLowerCase())) {
                this.slot_types_out.push(slotType.toLowerCase());
                this.slot_types_out.sort();
              }
            }
          }
        },
        /**
         * Create a new nodetype by passing an object with some properties
         * like onCreate, inputs:Array, outputs:Array, properties, onExecute
         * @method buildNodeClassFromObject
         * @param {String} name node name with namespace (p.e.: 'math/sum')
         * @param {Object} object methods expected onCreate, inputs, outputs, properties, onExecute
         */
        buildNodeClassFromObject: function(name, object) {
          var ctor_code = "";
          if (object.inputs)
            for (var i2 = 0; i2 < object.inputs.length; ++i2) {
              var _name = object.inputs[i2][0];
              var _type = object.inputs[i2][1];
              if (_type && _type.constructor === String)
                _type = '"' + _type + '"';
              ctor_code += "this.addInput('" + _name + "'," + _type + ");\n";
            }
          if (object.outputs)
            for (var i2 = 0; i2 < object.outputs.length; ++i2) {
              var _name = object.outputs[i2][0];
              var _type = object.outputs[i2][1];
              if (_type && _type.constructor === String)
                _type = '"' + _type + '"';
              ctor_code += "this.addOutput('" + _name + "'," + _type + ");\n";
            }
          if (object.properties)
            for (var i2 in object.properties) {
              var prop = object.properties[i2];
              if (prop && prop.constructor === String)
                prop = '"' + prop + '"';
              ctor_code += "this.addProperty('" + i2 + "'," + prop + ");\n";
            }
          ctor_code += "if(this.onCreate)this.onCreate()";
          var classobj = Function(ctor_code);
          for (var i2 in object)
            if (i2 != "inputs" && i2 != "outputs" && i2 != "properties")
              classobj.prototype[i2] = object[i2];
          classobj.title = object.title || name.split("/").pop();
          classobj.desc = object.desc || "Generated from object";
          this.registerNodeType(name, classobj);
          return classobj;
        },
        /**
         * Create a new nodetype by passing a function, it wraps it with a proper class and generates inputs according to the parameters of the function.
         * Useful to wrap simple methods that do not require properties, and that only process some input to generate an output.
         * @method wrapFunctionAsNode
         * @param {String} name node name with namespace (p.e.: 'math/sum')
         * @param {Function} func
         * @param {Array} param_types [optional] an array containing the type of every parameter, otherwise parameters will accept any type
         * @param {String} return_type [optional] string with the return type, otherwise it will be generic
         * @param {Object} properties [optional] properties to be configurable
         */
        wrapFunctionAsNode: function(name, func, param_types, return_type, properties) {
          var params = Array(func.length);
          var code = "";
          if (param_types !== null) {
            var names = LiteGraph.getParameterNames(func);
            for (var i2 = 0; i2 < names.length; ++i2) {
              var type = 0;
              if (param_types) {
                if (param_types[i2] != null && param_types[i2].constructor === String)
                  type = "'" + param_types[i2] + "'";
                else if (param_types[i2] != null)
                  type = param_types[i2];
              }
              code += "this.addInput('" + names[i2] + "'," + type + ");\n";
            }
          }
          if (return_type !== null)
            code += "this.addOutput('out'," + (return_type != null ? return_type.constructor === String ? "'" + return_type + "'" : return_type : 0) + ");\n";
          if (properties) {
            code += "this.properties = " + JSON.stringify(properties) + ";\n";
          }
          var classobj = Function(code);
          classobj.title = name.split("/").pop();
          classobj.desc = "Generated from " + func.name;
          classobj.prototype.onExecute = function onExecute() {
            for (var i3 = 0; i3 < params.length; ++i3) {
              params[i3] = this.getInputData(i3);
            }
            var r = func.apply(this, params);
            this.setOutputData(0, r);
          };
          this.registerNodeType(name, classobj);
          return classobj;
        },
        /**
         * Removes all previously registered node's types
         */
        clearRegisteredTypes: function() {
          this.registered_node_types = {};
          this.node_types_by_file_extension = {};
          this.Nodes = {};
          this.searchbox_extras = {};
        },
        /**
         * Adds this method to all nodetypes, existing and to be created
         * (You can add it to LGraphNode.prototype but then existing node types wont have it)
         * @method addNodeMethod
         * @param {Function} func
         */
        addNodeMethod: function(name, func) {
          LGraphNode.prototype[name] = func;
          for (var i2 in this.registered_node_types) {
            var type = this.registered_node_types[i2];
            if (type.prototype[name]) {
              type.prototype["_" + name] = type.prototype[name];
            }
            type.prototype[name] = func;
          }
        },
        /**
         * Create a node of a given type with a name. The node is not attached to any graph yet.
         * @method createNode
         * @param {String} type full name of the node class. p.e. "math/sin"
         * @param {String} name a name to distinguish from other nodes
         * @param {Object} options to set options
         */
        createNode: function(type, title, options) {
          var base_class = this.registered_node_types[type];
          if (!base_class) {
            if (LiteGraph.debug) {
              console.log(
                'GraphNode type "' + type + '" not registered.'
              );
            }
            return null;
          }
          base_class.prototype || base_class;
          title = title || base_class.title || type;
          var node2 = null;
          if (LiteGraph.catch_exceptions) {
            try {
              node2 = new base_class(title);
            } catch (err) {
              console.error(err);
              return null;
            }
          } else {
            node2 = new base_class(title);
          }
          node2.type = type;
          if (!node2.title && title) {
            node2.title = title;
          }
          if (!node2.properties) {
            node2.properties = {};
          }
          if (!node2.properties_info) {
            node2.properties_info = [];
          }
          if (!node2.flags) {
            node2.flags = {};
          }
          if (!node2.size) {
            node2.size = node2.computeSize();
          }
          if (!node2.pos) {
            node2.pos = LiteGraph.DEFAULT_POSITION.concat();
          }
          if (!node2.mode) {
            node2.mode = LiteGraph.ALWAYS;
          }
          if (options) {
            for (var i2 in options) {
              node2[i2] = options[i2];
            }
          }
          if (node2.onNodeCreated) {
            node2.onNodeCreated();
          }
          return node2;
        },
        /**
         * Returns a registered node type with a given name
         * @method getNodeType
         * @param {String} type full name of the node class. p.e. "math/sin"
         * @return {Class} the node class
         */
        getNodeType: function(type) {
          return this.registered_node_types[type];
        },
        /**
         * Returns a list of node types matching one category
         * @method getNodeType
         * @param {String} category category name
         * @return {Array} array with all the node classes
         */
        getNodeTypesInCategory: function(category, filter) {
          var r = [];
          for (var i2 in this.registered_node_types) {
            var type = this.registered_node_types[i2];
            if (type.filter != filter) {
              continue;
            }
            if (category == "") {
              if (type.category == null) {
                r.push(type);
              }
            } else if (type.category == category) {
              r.push(type);
            }
          }
          if (this.auto_sort_node_types) {
            r.sort(function(a, b) {
              return a.title.localeCompare(b.title);
            });
          }
          return r;
        },
        /**
         * Returns a list with all the node type categories
         * @method getNodeTypesCategories
         * @param {String} filter only nodes with ctor.filter equal can be shown
         * @return {Array} array with all the names of the categories
         */
        getNodeTypesCategories: function(filter) {
          var categories = { "": 1 };
          for (var i2 in this.registered_node_types) {
            var type = this.registered_node_types[i2];
            if (type.category && !type.skip_list) {
              if (type.filter != filter)
                continue;
              categories[type.category] = 1;
            }
          }
          var result = [];
          for (var i2 in categories) {
            result.push(i2);
          }
          return this.auto_sort_node_types ? result.sort() : result;
        },
        //debug purposes: reloads all the js scripts that matches a wildcard
        reloadNodes: function(folder_wildcard) {
          var tmp = document.getElementsByTagName("script");
          var script_files = [];
          for (var i2 = 0; i2 < tmp.length; i2++) {
            script_files.push(tmp[i2]);
          }
          var docHeadObj = document.getElementsByTagName("head")[0];
          folder_wildcard = document.location.href + folder_wildcard;
          for (var i2 = 0; i2 < script_files.length; i2++) {
            var src = script_files[i2].src;
            if (!src || src.substr(0, folder_wildcard.length) != folder_wildcard) {
              continue;
            }
            try {
              if (LiteGraph.debug) {
                console.log("Reloading: " + src);
              }
              var dynamicScript = document.createElement("script");
              dynamicScript.type = "text/javascript";
              dynamicScript.src = src;
              docHeadObj.appendChild(dynamicScript);
              docHeadObj.removeChild(script_files[i2]);
            } catch (err) {
              if (LiteGraph.throw_errors) {
                throw err;
              }
              if (LiteGraph.debug) {
                console.log("Error while reloading " + src);
              }
            }
          }
          if (LiteGraph.debug) {
            console.log("Nodes reloaded");
          }
        },
        //separated just to improve if it doesn't work
        cloneObject: function(obj, target) {
          if (obj == null) {
            return null;
          }
          var r = JSON.parse(JSON.stringify(obj));
          if (!target) {
            return r;
          }
          for (var i2 in r) {
            target[i2] = r[i2];
          }
          return target;
        },
        /*
         * https://gist.github.com/jed/982883?permalink_comment_id=852670#gistcomment-852670
         */
        uuidv4: function() {
          return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (a) => (a ^ Math.random() * 16 >> a / 4).toString(16));
        },
        /**
         * Returns if the types of two slots are compatible (taking into account wildcards, etc)
         * @method isValidConnection
         * @param {String} type_a
         * @param {String} type_b
         * @return {Boolean} true if they can be connected
         */
        isValidConnection: function(type_a, type_b) {
          if (type_a == "" || type_a === "*") type_a = 0;
          if (type_b == "" || type_b === "*") type_b = 0;
          if (!type_a || !type_b || type_a == type_b || type_a == LiteGraph.EVENT && type_b == LiteGraph.ACTION) {
            return true;
          }
          type_a = String(type_a);
          type_b = String(type_b);
          type_a = type_a.toLowerCase();
          type_b = type_b.toLowerCase();
          if (type_a.indexOf(",") == -1 && type_b.indexOf(",") == -1) {
            return type_a == type_b;
          }
          var supported_types_a = type_a.split(",");
          var supported_types_b = type_b.split(",");
          for (var i2 = 0; i2 < supported_types_a.length; ++i2) {
            for (var j = 0; j < supported_types_b.length; ++j) {
              if (this.isValidConnection(supported_types_a[i2], supported_types_b[j])) {
                return true;
              }
            }
          }
          return false;
        },
        /**
         * Register a string in the search box so when the user types it it will recommend this node
         * @method registerSearchboxExtra
         * @param {String} node_type the node recommended
         * @param {String} description text to show next to it
         * @param {Object} data it could contain info of how the node should be configured
         * @return {Boolean} true if they can be connected
         */
        registerSearchboxExtra: function(node_type, description, data) {
          this.searchbox_extras[description.toLowerCase()] = {
            type: node_type,
            desc: description,
            data
          };
        },
        /**
         * Wrapper to load files (from url using fetch or from file using FileReader)
         * @method fetchFile
         * @param {String|File|Blob} url the url of the file (or the file itself)
         * @param {String} type an string to know how to fetch it: "text","arraybuffer","json","blob"
         * @param {Function} on_complete callback(data)
         * @param {Function} on_error in case of an error
         * @return {FileReader|Promise} returns the object used to 
         */
        fetchFile: function(url, type, on_complete, on_error) {
          if (!url)
            return null;
          type = type || "text";
          if (url.constructor === String) {
            if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
              url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
            }
            return fetch(url).then(function(response) {
              if (!response.ok)
                throw new Error("File not found");
              if (type == "arraybuffer")
                return response.arrayBuffer();
              else if (type == "text" || type == "string")
                return response.text();
              else if (type == "json")
                return response.json();
              else if (type == "blob")
                return response.blob();
            }).then(function(data) {
              if (on_complete)
                on_complete(data);
            }).catch(function(error) {
              console.error("error fetching file:", url);
              if (on_error)
                on_error(error);
            });
          } else if (url.constructor === File || url.constructor === Blob) {
            var reader = new FileReader();
            reader.onload = function(e) {
              var v2 = e.target.result;
              if (type == "json")
                v2 = JSON.parse(v2);
              if (on_complete)
                on_complete(v2);
            };
            if (type == "arraybuffer")
              return reader.readAsArrayBuffer(url);
            else if (type == "text" || type == "json")
              return reader.readAsText(url);
            else if (type == "blob")
              return reader.readAsBinaryString(url);
          }
          return null;
        }
      };
      if (typeof performance != "undefined") {
        LiteGraph.getTime = performance.now.bind(performance);
      } else if (typeof Date != "undefined" && Date.now) {
        LiteGraph.getTime = Date.now.bind(Date);
      } else if (typeof process != "undefined") {
        LiteGraph.getTime = function() {
          var t = process.hrtime();
          return t[0] * 1e-3 + t[1] * 1e-6;
        };
      } else {
        LiteGraph.getTime = function getTime2() {
          return (/* @__PURE__ */ new Date()).getTime();
        };
      }
      function LGraph(o) {
        if (LiteGraph.debug) {
          console.log("Graph created");
        }
        this.list_of_graphcanvas = null;
        this.clear();
        if (o) {
          this.configure(o);
        }
      }
      global.LGraph = LiteGraph.LGraph = LGraph;
      LGraph.supported_types = ["number", "string", "boolean"];
      LGraph.prototype.getSupportedTypes = function() {
        return this.supported_types || LGraph.supported_types;
      };
      LGraph.STATUS_STOPPED = 1;
      LGraph.STATUS_RUNNING = 2;
      LGraph.prototype.clear = function() {
        this.stop();
        this.status = LGraph.STATUS_STOPPED;
        this.last_node_id = 0;
        this.last_link_id = 0;
        this._version = -1;
        if (this._nodes) {
          for (var i2 = 0; i2 < this._nodes.length; ++i2) {
            var node2 = this._nodes[i2];
            if (node2.onRemoved) {
              node2.onRemoved();
            }
          }
        }
        this._nodes = [];
        this._nodes_by_id = {};
        this._nodes_in_order = [];
        this._nodes_executable = null;
        this._groups = [];
        this.links = {};
        this.iteration = 0;
        this.config = {};
        this.vars = {};
        this.extra = {};
        this.globaltime = 0;
        this.runningtime = 0;
        this.fixedtime = 0;
        this.fixedtime_lapse = 0.01;
        this.elapsed_time = 0.01;
        this.last_update_time = 0;
        this.starttime = 0;
        this.catch_errors = true;
        this.nodes_executing = [];
        this.nodes_actioning = [];
        this.nodes_executedAction = [];
        this.inputs = {};
        this.outputs = {};
        this.change();
        this.sendActionToCanvas("clear");
      };
      LGraph.prototype.attachCanvas = function(graphcanvas) {
        if (graphcanvas.constructor != LGraphCanvas) {
          throw "attachCanvas expects a LGraphCanvas instance";
        }
        if (graphcanvas.graph && graphcanvas.graph != this) {
          graphcanvas.graph.detachCanvas(graphcanvas);
        }
        graphcanvas.graph = this;
        if (!this.list_of_graphcanvas) {
          this.list_of_graphcanvas = [];
        }
        this.list_of_graphcanvas.push(graphcanvas);
      };
      LGraph.prototype.detachCanvas = function(graphcanvas) {
        if (!this.list_of_graphcanvas) {
          return;
        }
        var pos2 = this.list_of_graphcanvas.indexOf(graphcanvas);
        if (pos2 == -1) {
          return;
        }
        graphcanvas.graph = null;
        this.list_of_graphcanvas.splice(pos2, 1);
      };
      LGraph.prototype.start = function(interval) {
        if (this.status == LGraph.STATUS_RUNNING) {
          return;
        }
        this.status = LGraph.STATUS_RUNNING;
        if (this.onPlayEvent) {
          this.onPlayEvent();
        }
        this.sendEventToAllNodes("onStart");
        this.starttime = LiteGraph.getTime();
        this.last_update_time = this.starttime;
        interval = interval || 0;
        var that2 = this;
        if (interval == 0 && typeof window != "undefined" && window.requestAnimationFrame) {
          let on_frame = function() {
            if (that2.execution_timer_id != -1) {
              return;
            }
            window.requestAnimationFrame(on_frame);
            if (that2.onBeforeStep)
              that2.onBeforeStep();
            that2.runStep(1, !that2.catch_errors);
            if (that2.onAfterStep)
              that2.onAfterStep();
          };
          this.execution_timer_id = -1;
          on_frame();
        } else {
          this.execution_timer_id = setInterval(function() {
            if (that2.onBeforeStep)
              that2.onBeforeStep();
            that2.runStep(1, !that2.catch_errors);
            if (that2.onAfterStep)
              that2.onAfterStep();
          }, interval);
        }
      };
      LGraph.prototype.stop = function() {
        if (this.status == LGraph.STATUS_STOPPED) {
          return;
        }
        this.status = LGraph.STATUS_STOPPED;
        if (this.onStopEvent) {
          this.onStopEvent();
        }
        if (this.execution_timer_id != null) {
          if (this.execution_timer_id != -1) {
            clearInterval(this.execution_timer_id);
          }
          this.execution_timer_id = null;
        }
        this.sendEventToAllNodes("onStop");
      };
      LGraph.prototype.runStep = function(num, do_not_catch_errors, limit) {
        num = num || 1;
        var start = LiteGraph.getTime();
        this.globaltime = 1e-3 * (start - this.starttime);
        var nodes = this._nodes_executable ? this._nodes_executable : this._nodes;
        if (!nodes) {
          return;
        }
        limit = limit || nodes.length;
        if (do_not_catch_errors) {
          for (var i2 = 0; i2 < num; i2++) {
            for (var j = 0; j < limit; ++j) {
              var node2 = nodes[j];
              if (LiteGraph.use_deferred_actions && node2._waiting_actions && node2._waiting_actions.length)
                node2.executePendingActions();
              if (node2.mode == LiteGraph.ALWAYS && node2.onExecute) {
                node2.doExecute();
              }
            }
            this.fixedtime += this.fixedtime_lapse;
            if (this.onExecuteStep) {
              this.onExecuteStep();
            }
          }
          if (this.onAfterExecute) {
            this.onAfterExecute();
          }
        } else {
          try {
            for (var i2 = 0; i2 < num; i2++) {
              for (var j = 0; j < limit; ++j) {
                var node2 = nodes[j];
                if (LiteGraph.use_deferred_actions && node2._waiting_actions && node2._waiting_actions.length)
                  node2.executePendingActions();
                if (node2.mode == LiteGraph.ALWAYS && node2.onExecute) {
                  node2.onExecute();
                }
              }
              this.fixedtime += this.fixedtime_lapse;
              if (this.onExecuteStep) {
                this.onExecuteStep();
              }
            }
            if (this.onAfterExecute) {
              this.onAfterExecute();
            }
            this.errors_in_execution = false;
          } catch (err) {
            this.errors_in_execution = true;
            if (LiteGraph.throw_errors) {
              throw err;
            }
            if (LiteGraph.debug) {
              console.log("Error during execution: " + err);
            }
            this.stop();
          }
        }
        var now = LiteGraph.getTime();
        var elapsed = now - start;
        if (elapsed == 0) {
          elapsed = 1;
        }
        this.execution_time = 1e-3 * elapsed;
        this.globaltime += 1e-3 * elapsed;
        this.iteration += 1;
        this.elapsed_time = (now - this.last_update_time) * 1e-3;
        this.last_update_time = now;
        this.nodes_executing = [];
        this.nodes_actioning = [];
        this.nodes_executedAction = [];
      };
      LGraph.prototype.updateExecutionOrder = function() {
        this._nodes_in_order = this.computeExecutionOrder(false);
        this._nodes_executable = [];
        for (var i2 = 0; i2 < this._nodes_in_order.length; ++i2) {
          if (this._nodes_in_order[i2].onExecute) {
            this._nodes_executable.push(this._nodes_in_order[i2]);
          }
        }
      };
      LGraph.prototype.computeExecutionOrder = function(only_onExecute, set_level) {
        var L = [];
        var S = [];
        var M = {};
        var visited_links = {};
        var remaining_links = {};
        for (var i2 = 0, l = this._nodes.length; i2 < l; ++i2) {
          var node2 = this._nodes[i2];
          if (only_onExecute && !node2.onExecute) {
            continue;
          }
          M[node2.id] = node2;
          var num = 0;
          if (node2.inputs) {
            for (var j = 0, l2 = node2.inputs.length; j < l2; j++) {
              if (node2.inputs[j] && node2.inputs[j].link != null) {
                num += 1;
              }
            }
          }
          if (num == 0) {
            S.push(node2);
            if (set_level) {
              node2._level = 1;
            }
          } else {
            if (set_level) {
              node2._level = 0;
            }
            remaining_links[node2.id] = num;
          }
        }
        while (true) {
          if (S.length == 0) {
            break;
          }
          var node2 = S.shift();
          L.push(node2);
          delete M[node2.id];
          if (!node2.outputs) {
            continue;
          }
          for (var i2 = 0; i2 < node2.outputs.length; i2++) {
            var output = node2.outputs[i2];
            if (output == null || output.links == null || output.links.length == 0) {
              continue;
            }
            for (var j = 0; j < output.links.length; j++) {
              var link_id = output.links[j];
              var link = this.links[link_id];
              if (!link) {
                continue;
              }
              if (visited_links[link.id]) {
                continue;
              }
              var target_node = this.getNodeById(link.target_id);
              if (target_node == null) {
                visited_links[link.id] = true;
                continue;
              }
              if (set_level && (!target_node._level || target_node._level <= node2._level)) {
                target_node._level = node2._level + 1;
              }
              visited_links[link.id] = true;
              remaining_links[target_node.id] -= 1;
              if (remaining_links[target_node.id] == 0) {
                S.push(target_node);
              }
            }
          }
        }
        for (var i2 in M) {
          L.push(M[i2]);
        }
        if (L.length != this._nodes.length && LiteGraph.debug) {
          console.warn("something went wrong, nodes missing");
        }
        var l = L.length;
        for (var i2 = 0; i2 < l; ++i2) {
          L[i2].order = i2;
        }
        L = L.sort(function(A, B) {
          var Ap = A.constructor.priority || A.priority || 0;
          var Bp = B.constructor.priority || B.priority || 0;
          if (Ap == Bp) {
            return A.order - B.order;
          }
          return Ap - Bp;
        });
        for (var i2 = 0; i2 < l; ++i2) {
          L[i2].order = i2;
        }
        return L;
      };
      LGraph.prototype.getAncestors = function(node2) {
        var ancestors = [];
        var pending = [node2];
        var visited = {};
        while (pending.length) {
          var current = pending.shift();
          if (!current.inputs) {
            continue;
          }
          if (!visited[current.id] && current != node2) {
            visited[current.id] = true;
            ancestors.push(current);
          }
          for (var i2 = 0; i2 < current.inputs.length; ++i2) {
            var input = current.getInputNode(i2);
            if (input && ancestors.indexOf(input) == -1) {
              pending.push(input);
            }
          }
        }
        ancestors.sort(function(a, b) {
          return a.order - b.order;
        });
        return ancestors;
      };
      LGraph.prototype.arrange = function(margin, layout) {
        margin = margin || 100;
        const nodes = this.computeExecutionOrder(false, true);
        const columns = [];
        for (let i2 = 0; i2 < nodes.length; ++i2) {
          const node2 = nodes[i2];
          const col = node2._level || 1;
          if (!columns[col]) {
            columns[col] = [];
          }
          columns[col].push(node2);
        }
        let x2 = margin;
        for (let i2 = 0; i2 < columns.length; ++i2) {
          const column = columns[i2];
          if (!column) {
            continue;
          }
          let max_size = 100;
          let y2 = margin + LiteGraph.NODE_TITLE_HEIGHT;
          for (let j = 0; j < column.length; ++j) {
            const node2 = column[j];
            node2.pos[0] = layout == LiteGraph.VERTICAL_LAYOUT ? y2 : x2;
            node2.pos[1] = layout == LiteGraph.VERTICAL_LAYOUT ? x2 : y2;
            const max_size_index = layout == LiteGraph.VERTICAL_LAYOUT ? 1 : 0;
            if (node2.size[max_size_index] > max_size) {
              max_size = node2.size[max_size_index];
            }
            const node_size_index = layout == LiteGraph.VERTICAL_LAYOUT ? 0 : 1;
            y2 += node2.size[node_size_index] + margin + LiteGraph.NODE_TITLE_HEIGHT;
          }
          x2 += max_size + margin;
        }
        this.setDirtyCanvas(true, true);
      };
      LGraph.prototype.getTime = function() {
        return this.globaltime;
      };
      LGraph.prototype.getFixedTime = function() {
        return this.fixedtime;
      };
      LGraph.prototype.getElapsedTime = function() {
        return this.elapsed_time;
      };
      LGraph.prototype.sendEventToAllNodes = function(eventname, params, mode) {
        mode = mode || LiteGraph.ALWAYS;
        var nodes = this._nodes_in_order ? this._nodes_in_order : this._nodes;
        if (!nodes) {
          return;
        }
        for (var j = 0, l = nodes.length; j < l; ++j) {
          var node2 = nodes[j];
          if (node2.constructor === LiteGraph.Subgraph && eventname != "onExecute") {
            if (node2.mode == mode) {
              node2.sendEventToAllNodes(eventname, params, mode);
            }
            continue;
          }
          if (!node2[eventname] || node2.mode != mode) {
            continue;
          }
          if (params === void 0) {
            node2[eventname]();
          } else if (params && params.constructor === Array) {
            node2[eventname].apply(node2, params);
          } else {
            node2[eventname](params);
          }
        }
      };
      LGraph.prototype.sendActionToCanvas = function(action, params) {
        if (!this.list_of_graphcanvas) {
          return;
        }
        for (var i2 = 0; i2 < this.list_of_graphcanvas.length; ++i2) {
          var c = this.list_of_graphcanvas[i2];
          if (c[action]) {
            c[action].apply(c, params);
          }
        }
      };
      LGraph.prototype.add = function(node2, skip_compute_order) {
        if (!node2) {
          return;
        }
        if (node2.constructor === LGraphGroup) {
          this._groups.push(node2);
          this.setDirtyCanvas(true);
          this.change();
          node2.graph = this;
          this._version++;
          return;
        }
        if (node2.id != -1 && this._nodes_by_id[node2.id] != null) {
          console.warn(
            "LiteGraph: there is already a node with this ID, changing it"
          );
          if (LiteGraph.use_uuids) {
            node2.id = LiteGraph.uuidv4();
          } else {
            node2.id = ++this.last_node_id;
          }
        }
        if (this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES) {
          throw "LiteGraph: max number of nodes in a graph reached";
        }
        if (LiteGraph.use_uuids) {
          if (node2.id == null || node2.id == -1)
            node2.id = LiteGraph.uuidv4();
        } else {
          if (node2.id == null || node2.id == -1) {
            node2.id = ++this.last_node_id;
          } else if (this.last_node_id < node2.id) {
            this.last_node_id = node2.id;
          }
        }
        node2.graph = this;
        this._version++;
        this._nodes.push(node2);
        this._nodes_by_id[node2.id] = node2;
        if (node2.onAdded) {
          node2.onAdded(this);
        }
        if (this.config.align_to_grid) {
          node2.alignToGrid();
        }
        if (!skip_compute_order) {
          this.updateExecutionOrder();
        }
        if (this.onNodeAdded) {
          this.onNodeAdded(node2);
        }
        this.setDirtyCanvas(true);
        this.change();
        return node2;
      };
      LGraph.prototype.remove = function(node2) {
        if (node2.constructor === LiteGraph.LGraphGroup) {
          var index2 = this._groups.indexOf(node2);
          if (index2 != -1) {
            this._groups.splice(index2, 1);
          }
          node2.graph = null;
          this._version++;
          this.setDirtyCanvas(true, true);
          this.change();
          return;
        }
        if (this._nodes_by_id[node2.id] == null) {
          return;
        }
        if (node2.ignore_remove) {
          return;
        }
        this.beforeChange();
        if (node2.inputs) {
          for (var i2 = 0; i2 < node2.inputs.length; i2++) {
            var slot = node2.inputs[i2];
            if (slot.link != null) {
              node2.disconnectInput(i2);
            }
          }
        }
        if (node2.outputs) {
          for (var i2 = 0; i2 < node2.outputs.length; i2++) {
            var slot = node2.outputs[i2];
            if (slot.links != null && slot.links.length) {
              node2.disconnectOutput(i2);
            }
          }
        }
        if (node2.onRemoved) {
          node2.onRemoved();
        }
        node2.graph = null;
        this._version++;
        if (this.list_of_graphcanvas) {
          for (var i2 = 0; i2 < this.list_of_graphcanvas.length; ++i2) {
            var canvas = this.list_of_graphcanvas[i2];
            if (canvas.selected_nodes[node2.id]) {
              delete canvas.selected_nodes[node2.id];
            }
            if (canvas.node_dragged == node2) {
              canvas.node_dragged = null;
            }
          }
        }
        var pos2 = this._nodes.indexOf(node2);
        if (pos2 != -1) {
          this._nodes.splice(pos2, 1);
        }
        delete this._nodes_by_id[node2.id];
        if (this.onNodeRemoved) {
          this.onNodeRemoved(node2);
        }
        this.sendActionToCanvas("checkPanels");
        this.setDirtyCanvas(true, true);
        this.afterChange();
        this.change();
        this.updateExecutionOrder();
      };
      LGraph.prototype.getNodeById = function(id) {
        if (id == null) {
          return null;
        }
        return this._nodes_by_id[id];
      };
      LGraph.prototype.findNodesByClass = function(classObject, result) {
        result = result || [];
        result.length = 0;
        for (var i2 = 0, l = this._nodes.length; i2 < l; ++i2) {
          if (this._nodes[i2].constructor === classObject) {
            result.push(this._nodes[i2]);
          }
        }
        return result;
      };
      LGraph.prototype.findNodesByType = function(type, result) {
        var type = type.toLowerCase();
        result = result || [];
        result.length = 0;
        for (var i2 = 0, l = this._nodes.length; i2 < l; ++i2) {
          if (this._nodes[i2].type.toLowerCase() == type) {
            result.push(this._nodes[i2]);
          }
        }
        return result;
      };
      LGraph.prototype.findNodeByTitle = function(title) {
        for (var i2 = 0, l = this._nodes.length; i2 < l; ++i2) {
          if (this._nodes[i2].title == title) {
            return this._nodes[i2];
          }
        }
        return null;
      };
      LGraph.prototype.findNodesByTitle = function(title) {
        var result = [];
        for (var i2 = 0, l = this._nodes.length; i2 < l; ++i2) {
          if (this._nodes[i2].title == title) {
            result.push(this._nodes[i2]);
          }
        }
        return result;
      };
      LGraph.prototype.getNodeOnPos = function(x2, y2, nodes_list, margin) {
        nodes_list = nodes_list || this._nodes;
        var nRet = null;
        for (var i2 = nodes_list.length - 1; i2 >= 0; i2--) {
          var n = nodes_list[i2];
          if (n.isPointInside(x2, y2, margin)) {
            return n;
          }
        }
        return nRet;
      };
      LGraph.prototype.getGroupOnPos = function(x2, y2) {
        for (var i2 = this._groups.length - 1; i2 >= 0; i2--) {
          var g = this._groups[i2];
          if (g.isPointInside(x2, y2, 2, true)) {
            return g;
          }
        }
        return null;
      };
      LGraph.prototype.checkNodeTypes = function() {
        for (var i2 = 0; i2 < this._nodes.length; i2++) {
          var node2 = this._nodes[i2];
          var ctor = LiteGraph.registered_node_types[node2.type];
          if (node2.constructor == ctor) {
            continue;
          }
          console.log("node being replaced by newer version: " + node2.type);
          var newnode = LiteGraph.createNode(node2.type);
          this._nodes[i2] = newnode;
          newnode.configure(node2.serialize());
          newnode.graph = this;
          this._nodes_by_id[newnode.id] = newnode;
          if (node2.inputs) {
            newnode.inputs = node2.inputs.concat();
          }
          if (node2.outputs) {
            newnode.outputs = node2.outputs.concat();
          }
        }
        this.updateExecutionOrder();
      };
      LGraph.prototype.onAction = function(action, param, options) {
        this._input_nodes = this.findNodesByClass(
          LiteGraph.GraphInput,
          this._input_nodes
        );
        for (var i2 = 0; i2 < this._input_nodes.length; ++i2) {
          var node2 = this._input_nodes[i2];
          if (node2.properties.name != action) {
            continue;
          }
          node2.actionDo(action, param, options);
          break;
        }
      };
      LGraph.prototype.trigger = function(action, param) {
        if (this.onTrigger) {
          this.onTrigger(action, param);
        }
      };
      LGraph.prototype.addInput = function(name, type, value) {
        var input = this.inputs[name];
        if (input) {
          return;
        }
        this.beforeChange();
        this.inputs[name] = { name, type, value };
        this._version++;
        this.afterChange();
        if (this.onInputAdded) {
          this.onInputAdded(name, type);
        }
        if (this.onInputsOutputsChange) {
          this.onInputsOutputsChange();
        }
      };
      LGraph.prototype.setInputData = function(name, data) {
        var input = this.inputs[name];
        if (!input) {
          return;
        }
        input.value = data;
      };
      LGraph.prototype.getInputData = function(name) {
        var input = this.inputs[name];
        if (!input) {
          return null;
        }
        return input.value;
      };
      LGraph.prototype.renameInput = function(old_name, name) {
        if (name == old_name) {
          return;
        }
        if (!this.inputs[old_name]) {
          return false;
        }
        if (this.inputs[name]) {
          console.error("there is already one input with that name");
          return false;
        }
        this.inputs[name] = this.inputs[old_name];
        delete this.inputs[old_name];
        this._version++;
        if (this.onInputRenamed) {
          this.onInputRenamed(old_name, name);
        }
        if (this.onInputsOutputsChange) {
          this.onInputsOutputsChange();
        }
      };
      LGraph.prototype.changeInputType = function(name, type) {
        if (!this.inputs[name]) {
          return false;
        }
        if (this.inputs[name].type && String(this.inputs[name].type).toLowerCase() == String(type).toLowerCase()) {
          return;
        }
        this.inputs[name].type = type;
        this._version++;
        if (this.onInputTypeChanged) {
          this.onInputTypeChanged(name, type);
        }
      };
      LGraph.prototype.removeInput = function(name) {
        if (!this.inputs[name]) {
          return false;
        }
        delete this.inputs[name];
        this._version++;
        if (this.onInputRemoved) {
          this.onInputRemoved(name);
        }
        if (this.onInputsOutputsChange) {
          this.onInputsOutputsChange();
        }
        return true;
      };
      LGraph.prototype.addOutput = function(name, type, value) {
        this.outputs[name] = { name, type, value };
        this._version++;
        if (this.onOutputAdded) {
          this.onOutputAdded(name, type);
        }
        if (this.onInputsOutputsChange) {
          this.onInputsOutputsChange();
        }
      };
      LGraph.prototype.setOutputData = function(name, value) {
        var output = this.outputs[name];
        if (!output) {
          return;
        }
        output.value = value;
      };
      LGraph.prototype.getOutputData = function(name) {
        var output = this.outputs[name];
        if (!output) {
          return null;
        }
        return output.value;
      };
      LGraph.prototype.renameOutput = function(old_name, name) {
        if (!this.outputs[old_name]) {
          return false;
        }
        if (this.outputs[name]) {
          console.error("there is already one output with that name");
          return false;
        }
        this.outputs[name] = this.outputs[old_name];
        delete this.outputs[old_name];
        this._version++;
        if (this.onOutputRenamed) {
          this.onOutputRenamed(old_name, name);
        }
        if (this.onInputsOutputsChange) {
          this.onInputsOutputsChange();
        }
      };
      LGraph.prototype.changeOutputType = function(name, type) {
        if (!this.outputs[name]) {
          return false;
        }
        if (this.outputs[name].type && String(this.outputs[name].type).toLowerCase() == String(type).toLowerCase()) {
          return;
        }
        this.outputs[name].type = type;
        this._version++;
        if (this.onOutputTypeChanged) {
          this.onOutputTypeChanged(name, type);
        }
      };
      LGraph.prototype.removeOutput = function(name) {
        if (!this.outputs[name]) {
          return false;
        }
        delete this.outputs[name];
        this._version++;
        if (this.onOutputRemoved) {
          this.onOutputRemoved(name);
        }
        if (this.onInputsOutputsChange) {
          this.onInputsOutputsChange();
        }
        return true;
      };
      LGraph.prototype.triggerInput = function(name, value) {
        var nodes = this.findNodesByTitle(name);
        for (var i2 = 0; i2 < nodes.length; ++i2) {
          nodes[i2].onTrigger(value);
        }
      };
      LGraph.prototype.setCallback = function(name, func) {
        var nodes = this.findNodesByTitle(name);
        for (var i2 = 0; i2 < nodes.length; ++i2) {
          nodes[i2].setTrigger(func);
        }
      };
      LGraph.prototype.beforeChange = function(info) {
        if (this.onBeforeChange) {
          this.onBeforeChange(this, info);
        }
        this.sendActionToCanvas("onBeforeChange", this);
      };
      LGraph.prototype.afterChange = function(info) {
        if (this.onAfterChange) {
          this.onAfterChange(this, info);
        }
        this.sendActionToCanvas("onAfterChange", this);
      };
      LGraph.prototype.connectionChange = function(node2, link_info) {
        this.updateExecutionOrder();
        if (this.onConnectionChange) {
          this.onConnectionChange(node2);
        }
        this._version++;
        this.sendActionToCanvas("onConnectionChange");
      };
      LGraph.prototype.isLive = function() {
        if (!this.list_of_graphcanvas) {
          return false;
        }
        for (var i2 = 0; i2 < this.list_of_graphcanvas.length; ++i2) {
          var c = this.list_of_graphcanvas[i2];
          if (c.live_mode) {
            return true;
          }
        }
        return false;
      };
      LGraph.prototype.clearTriggeredSlots = function() {
        for (var i2 in this.links) {
          var link_info = this.links[i2];
          if (!link_info) {
            continue;
          }
          if (link_info._last_time) {
            link_info._last_time = 0;
          }
        }
      };
      LGraph.prototype.change = function() {
        if (LiteGraph.debug) {
          console.log("Graph changed");
        }
        this.sendActionToCanvas("setDirty", [true, true]);
        if (this.on_change) {
          this.on_change(this);
        }
      };
      LGraph.prototype.setDirtyCanvas = function(fg, bg) {
        this.sendActionToCanvas("setDirty", [fg, bg]);
      };
      LGraph.prototype.removeLink = function(link_id) {
        var link = this.links[link_id];
        if (!link) {
          return;
        }
        var node2 = this.getNodeById(link.target_id);
        if (node2) {
          node2.disconnectInput(link.target_slot);
        }
      };
      LGraph.prototype.serialize = function() {
        var nodes_info = [];
        for (var i2 = 0, l = this._nodes.length; i2 < l; ++i2) {
          nodes_info.push(this._nodes[i2].serialize());
        }
        var links = [];
        for (var i2 in this.links) {
          var link = this.links[i2];
          if (!link.serialize) {
            console.warn(
              "weird LLink bug, link info is not a LLink but a regular object"
            );
            var link2 = new LLink();
            for (var j in link) {
              link2[j] = link[j];
            }
            this.links[i2] = link2;
            link = link2;
          }
          links.push(link.serialize());
        }
        var groups_info = [];
        for (var i2 = 0; i2 < this._groups.length; ++i2) {
          groups_info.push(this._groups[i2].serialize());
        }
        var data = {
          last_node_id: this.last_node_id,
          last_link_id: this.last_link_id,
          nodes: nodes_info,
          links,
          groups: groups_info,
          config: this.config,
          extra: this.extra,
          version: LiteGraph.VERSION
        };
        if (this.onSerialize)
          this.onSerialize(data);
        return data;
      };
      LGraph.prototype.configure = function(data, keep_old) {
        if (!data) {
          return;
        }
        if (!keep_old) {
          this.clear();
        }
        var nodes = data.nodes;
        if (data.links && data.links.constructor === Array) {
          var links = [];
          for (var i2 = 0; i2 < data.links.length; ++i2) {
            var link_data = data.links[i2];
            if (!link_data) {
              console.warn("serialized graph link data contains errors, skipping.");
              continue;
            }
            var link = new LLink();
            link.configure(link_data);
            links[link.id] = link;
          }
          data.links = links;
        }
        for (var i2 in data) {
          if (i2 == "nodes" || i2 == "groups")
            continue;
          this[i2] = data[i2];
        }
        var error = false;
        this._nodes = [];
        if (nodes) {
          for (var i2 = 0, l = nodes.length; i2 < l; ++i2) {
            var n_info = nodes[i2];
            var node2 = LiteGraph.createNode(n_info.type, n_info.title);
            if (!node2) {
              if (LiteGraph.debug) {
                console.log(
                  "Node not found or has errors: " + n_info.type
                );
              }
              node2 = new LGraphNode();
              node2.last_serialization = n_info;
              node2.has_errors = true;
              error = true;
            }
            node2.id = n_info.id;
            this.add(node2, true);
          }
          for (var i2 = 0, l = nodes.length; i2 < l; ++i2) {
            var n_info = nodes[i2];
            var node2 = this.getNodeById(n_info.id);
            if (node2) {
              node2.configure(n_info);
            }
          }
        }
        this._groups.length = 0;
        if (data.groups) {
          for (var i2 = 0; i2 < data.groups.length; ++i2) {
            var group = new LiteGraph.LGraphGroup();
            group.configure(data.groups[i2]);
            this.add(group);
          }
        }
        this.updateExecutionOrder();
        this.extra = data.extra || {};
        if (this.onConfigure)
          this.onConfigure(data);
        this._version++;
        this.setDirtyCanvas(true, true);
        return error;
      };
      LGraph.prototype.load = function(url, callback) {
        var that2 = this;
        if (url.constructor === File || url.constructor === Blob) {
          var reader = new FileReader();
          reader.addEventListener("load", function(event2) {
            var data = JSON.parse(event2.target.result);
            that2.configure(data);
            if (callback)
              callback();
          });
          reader.readAsText(url);
          return;
        }
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.send(null);
        req.onload = function(oEvent) {
          if (req.status !== 200) {
            console.error("Error loading graph:", req.status, req.response);
            return;
          }
          var data = JSON.parse(req.response);
          that2.configure(data);
          if (callback)
            callback();
        };
        req.onerror = function(err) {
          console.error("Error loading graph:", err);
        };
      };
      LGraph.prototype.onNodeTrace = function(node2, msg, color) {
      };
      function LLink(id, type, origin_id, origin_slot, target_id, target_slot) {
        this.id = id;
        this.type = type;
        this.origin_id = origin_id;
        this.origin_slot = origin_slot;
        this.target_id = target_id;
        this.target_slot = target_slot;
        this._data = null;
        this._pos = new Float32Array(2);
      }
      LLink.prototype.configure = function(o) {
        if (o.constructor === Array) {
          this.id = o[0];
          this.origin_id = o[1];
          this.origin_slot = o[2];
          this.target_id = o[3];
          this.target_slot = o[4];
          this.type = o[5];
        } else {
          this.id = o.id;
          this.type = o.type;
          this.origin_id = o.origin_id;
          this.origin_slot = o.origin_slot;
          this.target_id = o.target_id;
          this.target_slot = o.target_slot;
        }
      };
      LLink.prototype.serialize = function() {
        return [
          this.id,
          this.origin_id,
          this.origin_slot,
          this.target_id,
          this.target_slot,
          this.type
        ];
      };
      LiteGraph.LLink = LLink;
      function LGraphNode(title) {
        this._ctor(title);
      }
      global.LGraphNode = LiteGraph.LGraphNode = LGraphNode;
      LGraphNode.prototype._ctor = function(title) {
        this.title = title || "Unnamed";
        this.size = [LiteGraph.NODE_WIDTH, 60];
        this.graph = null;
        this._pos = new Float32Array(10, 10);
        Object.defineProperty(this, "pos", {
          set: function(v2) {
            if (!v2 || v2.length < 2) {
              return;
            }
            this._pos[0] = v2[0];
            this._pos[1] = v2[1];
          },
          get: function() {
            return this._pos;
          },
          enumerable: true
        });
        if (LiteGraph.use_uuids) {
          this.id = LiteGraph.uuidv4();
        } else {
          this.id = -1;
        }
        this.type = null;
        this.inputs = [];
        this.outputs = [];
        this.connections = [];
        this.properties = {};
        this.properties_info = [];
        this.flags = {};
      };
      LGraphNode.prototype.configure = function(info) {
        if (this.graph) {
          this.graph._version++;
        }
        for (var j in info) {
          if (j == "properties") {
            for (var k in info.properties) {
              this.properties[k] = info.properties[k];
              if (this.onPropertyChanged) {
                this.onPropertyChanged(k, info.properties[k]);
              }
            }
            continue;
          }
          if (info[j] == null) {
            continue;
          } else if (typeof info[j] == "object") {
            if (this[j] && this[j].configure) {
              this[j].configure(info[j]);
            } else {
              this[j] = LiteGraph.cloneObject(info[j], this[j]);
            }
          } else {
            this[j] = info[j];
          }
        }
        if (!info.title) {
          this.title = this.constructor.title;
        }
        if (this.inputs) {
          for (var i2 = 0; i2 < this.inputs.length; ++i2) {
            var input = this.inputs[i2];
            var link_info = this.graph ? this.graph.links[input.link] : null;
            if (this.onConnectionsChange)
              this.onConnectionsChange(LiteGraph.INPUT, i2, true, link_info, input);
            if (this.onInputAdded)
              this.onInputAdded(input);
          }
        }
        if (this.outputs) {
          for (var i2 = 0; i2 < this.outputs.length; ++i2) {
            var output = this.outputs[i2];
            if (!output.links) {
              continue;
            }
            for (var j = 0; j < output.links.length; ++j) {
              var link_info = this.graph ? this.graph.links[output.links[j]] : null;
              if (this.onConnectionsChange)
                this.onConnectionsChange(LiteGraph.OUTPUT, i2, true, link_info, output);
            }
            if (this.onOutputAdded)
              this.onOutputAdded(output);
          }
        }
        if (this.widgets) {
          for (var i2 = 0; i2 < this.widgets.length; ++i2) {
            var w2 = this.widgets[i2];
            if (!w2)
              continue;
            if (w2.options && w2.options.property && this.properties[w2.options.property] != void 0)
              w2.value = JSON.parse(JSON.stringify(this.properties[w2.options.property]));
          }
          if (info.widgets_values) {
            for (var i2 = 0; i2 < info.widgets_values.length; ++i2) {
              if (this.widgets[i2]) {
                this.widgets[i2].value = info.widgets_values[i2];
              }
            }
          }
        }
        if (this.onConfigure) {
          this.onConfigure(info);
        }
      };
      LGraphNode.prototype.serialize = function() {
        var o = {
          id: this.id,
          type: this.type,
          pos: this.pos,
          size: this.size,
          flags: LiteGraph.cloneObject(this.flags),
          order: this.order,
          mode: this.mode
        };
        if (this.constructor === LGraphNode && this.last_serialization) {
          return this.last_serialization;
        }
        if (this.inputs) {
          o.inputs = this.inputs;
        }
        if (this.outputs) {
          for (var i2 = 0; i2 < this.outputs.length; i2++) {
            delete this.outputs[i2]._data;
          }
          o.outputs = this.outputs;
        }
        if (this.title && this.title != this.constructor.title) {
          o.title = this.title;
        }
        if (this.properties) {
          o.properties = LiteGraph.cloneObject(this.properties);
        }
        if (this.widgets && this.serialize_widgets) {
          o.widgets_values = [];
          for (var i2 = 0; i2 < this.widgets.length; ++i2) {
            if (this.widgets[i2])
              o.widgets_values[i2] = this.widgets[i2].value;
            else
              o.widgets_values[i2] = null;
          }
        }
        if (!o.type) {
          o.type = this.constructor.type;
        }
        if (this.color) {
          o.color = this.color;
        }
        if (this.bgcolor) {
          o.bgcolor = this.bgcolor;
        }
        if (this.boxcolor) {
          o.boxcolor = this.boxcolor;
        }
        if (this.shape) {
          o.shape = this.shape;
        }
        if (this.onSerialize) {
          if (this.onSerialize(o)) {
            console.warn(
              "node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter"
            );
          }
        }
        return o;
      };
      LGraphNode.prototype.clone = function() {
        var node2 = LiteGraph.createNode(this.type);
        if (!node2) {
          return null;
        }
        var data = LiteGraph.cloneObject(this.serialize());
        if (data.inputs) {
          for (var i2 = 0; i2 < data.inputs.length; ++i2) {
            data.inputs[i2].link = null;
          }
        }
        if (data.outputs) {
          for (var i2 = 0; i2 < data.outputs.length; ++i2) {
            if (data.outputs[i2].links) {
              data.outputs[i2].links.length = 0;
            }
          }
        }
        delete data["id"];
        if (LiteGraph.use_uuids) {
          data["id"] = LiteGraph.uuidv4();
        }
        node2.configure(data);
        return node2;
      };
      LGraphNode.prototype.toString = function() {
        return JSON.stringify(this.serialize());
      };
      LGraphNode.prototype.getTitle = function() {
        return this.title || this.constructor.title;
      };
      LGraphNode.prototype.setProperty = function(name, value) {
        if (!this.properties) {
          this.properties = {};
        }
        if (value === this.properties[name])
          return;
        var prev_value = this.properties[name];
        this.properties[name] = value;
        if (this.onPropertyChanged) {
          if (this.onPropertyChanged(name, value, prev_value) === false)
            this.properties[name] = prev_value;
        }
        if (this.widgets)
          for (var i2 = 0; i2 < this.widgets.length; ++i2) {
            var w2 = this.widgets[i2];
            if (!w2)
              continue;
            if (w2.options.property == name) {
              w2.value = value;
              break;
            }
          }
      };
      LGraphNode.prototype.setOutputData = function(slot, data) {
        if (!this.outputs) {
          return;
        }
        if (slot == -1 || slot >= this.outputs.length) {
          return;
        }
        var output_info = this.outputs[slot];
        if (!output_info) {
          return;
        }
        output_info._data = data;
        if (this.outputs[slot].links) {
          for (var i2 = 0; i2 < this.outputs[slot].links.length; i2++) {
            var link_id = this.outputs[slot].links[i2];
            var link = this.graph.links[link_id];
            if (link)
              link.data = data;
          }
        }
      };
      LGraphNode.prototype.setOutputDataType = function(slot, type) {
        if (!this.outputs) {
          return;
        }
        if (slot == -1 || slot >= this.outputs.length) {
          return;
        }
        var output_info = this.outputs[slot];
        if (!output_info) {
          return;
        }
        output_info.type = type;
        if (this.outputs[slot].links) {
          for (var i2 = 0; i2 < this.outputs[slot].links.length; i2++) {
            var link_id = this.outputs[slot].links[i2];
            this.graph.links[link_id].type = type;
          }
        }
      };
      LGraphNode.prototype.getInputData = function(slot, force_update) {
        if (!this.inputs) {
          return;
        }
        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
          return;
        }
        var link_id = this.inputs[slot].link;
        var link = this.graph.links[link_id];
        if (!link) {
          return null;
        }
        if (!force_update) {
          return link.data;
        }
        var node2 = this.graph.getNodeById(link.origin_id);
        if (!node2) {
          return link.data;
        }
        if (node2.updateOutputData) {
          node2.updateOutputData(link.origin_slot);
        } else if (node2.onExecute) {
          node2.onExecute();
        }
        return link.data;
      };
      LGraphNode.prototype.getInputDataType = function(slot) {
        if (!this.inputs) {
          return null;
        }
        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
          return null;
        }
        var link_id = this.inputs[slot].link;
        var link = this.graph.links[link_id];
        if (!link) {
          return null;
        }
        var node2 = this.graph.getNodeById(link.origin_id);
        if (!node2) {
          return link.type;
        }
        var output_info = node2.outputs[link.origin_slot];
        if (output_info) {
          return output_info.type;
        }
        return null;
      };
      LGraphNode.prototype.getInputDataByName = function(slot_name, force_update) {
        var slot = this.findInputSlot(slot_name);
        if (slot == -1) {
          return null;
        }
        return this.getInputData(slot, force_update);
      };
      LGraphNode.prototype.isInputConnected = function(slot) {
        if (!this.inputs) {
          return false;
        }
        return slot < this.inputs.length && this.inputs[slot].link != null;
      };
      LGraphNode.prototype.getInputInfo = function(slot) {
        if (!this.inputs) {
          return null;
        }
        if (slot < this.inputs.length) {
          return this.inputs[slot];
        }
        return null;
      };
      LGraphNode.prototype.getInputLink = function(slot) {
        if (!this.inputs) {
          return null;
        }
        if (slot < this.inputs.length) {
          var slot_info = this.inputs[slot];
          return this.graph.links[slot_info.link];
        }
        return null;
      };
      LGraphNode.prototype.getInputNode = function(slot) {
        if (!this.inputs) {
          return null;
        }
        if (slot >= this.inputs.length) {
          return null;
        }
        var input = this.inputs[slot];
        if (!input || input.link === null) {
          return null;
        }
        var link_info = this.graph.links[input.link];
        if (!link_info) {
          return null;
        }
        return this.graph.getNodeById(link_info.origin_id);
      };
      LGraphNode.prototype.getInputOrProperty = function(name) {
        if (!this.inputs || !this.inputs.length) {
          return this.properties ? this.properties[name] : null;
        }
        for (var i2 = 0, l = this.inputs.length; i2 < l; ++i2) {
          var input_info = this.inputs[i2];
          if (name == input_info.name && input_info.link != null) {
            var link = this.graph.links[input_info.link];
            if (link) {
              return link.data;
            }
          }
        }
        return this.properties[name];
      };
      LGraphNode.prototype.getOutputData = function(slot) {
        if (!this.outputs) {
          return null;
        }
        if (slot >= this.outputs.length) {
          return null;
        }
        var info = this.outputs[slot];
        return info._data;
      };
      LGraphNode.prototype.getOutputInfo = function(slot) {
        if (!this.outputs) {
          return null;
        }
        if (slot < this.outputs.length) {
          return this.outputs[slot];
        }
        return null;
      };
      LGraphNode.prototype.isOutputConnected = function(slot) {
        if (!this.outputs) {
          return false;
        }
        return slot < this.outputs.length && this.outputs[slot].links && this.outputs[slot].links.length;
      };
      LGraphNode.prototype.isAnyOutputConnected = function() {
        if (!this.outputs) {
          return false;
        }
        for (var i2 = 0; i2 < this.outputs.length; ++i2) {
          if (this.outputs[i2].links && this.outputs[i2].links.length) {
            return true;
          }
        }
        return false;
      };
      LGraphNode.prototype.getOutputNodes = function(slot) {
        if (!this.outputs || this.outputs.length == 0) {
          return null;
        }
        if (slot >= this.outputs.length) {
          return null;
        }
        var output = this.outputs[slot];
        if (!output.links || output.links.length == 0) {
          return null;
        }
        var r = [];
        for (var i2 = 0; i2 < output.links.length; i2++) {
          var link_id = output.links[i2];
          var link = this.graph.links[link_id];
          if (link) {
            var target_node = this.graph.getNodeById(link.target_id);
            if (target_node) {
              r.push(target_node);
            }
          }
        }
        return r;
      };
      LGraphNode.prototype.addOnTriggerInput = function() {
        var trigS = this.findInputSlot("onTrigger");
        if (trigS == -1) {
          //!trigS || 
          this.addInput("onTrigger", LiteGraph.EVENT, { optional: true, nameLocked: true });
          return this.findInputSlot("onTrigger");
        }
        return trigS;
      };
      LGraphNode.prototype.addOnExecutedOutput = function() {
        var trigS = this.findOutputSlot("onExecuted");
        if (trigS == -1) {
          //!trigS || 
          this.addOutput("onExecuted", LiteGraph.ACTION, { optional: true, nameLocked: true });
          return this.findOutputSlot("onExecuted");
        }
        return trigS;
      };
      LGraphNode.prototype.onAfterExecuteNode = function(param, options) {
        var trigS = this.findOutputSlot("onExecuted");
        if (trigS != -1) {
          this.triggerSlot(trigS, param, null, options);
        }
      };
      LGraphNode.prototype.changeMode = function(modeTo) {
        switch (modeTo) {
          case LiteGraph.ON_EVENT:
            break;
          case LiteGraph.ON_TRIGGER:
            this.addOnTriggerInput();
            this.addOnExecutedOutput();
            break;
          case LiteGraph.NEVER:
            break;
          case LiteGraph.ALWAYS:
            break;
          case LiteGraph.ON_REQUEST:
            break;
          default:
            return false;
        }
        this.mode = modeTo;
        return true;
      };
      LGraphNode.prototype.executePendingActions = function() {
        if (!this._waiting_actions || !this._waiting_actions.length)
          return;
        for (var i2 = 0; i2 < this._waiting_actions.length; ++i2) {
          var p2 = this._waiting_actions[i2];
          this.onAction(p2[0], p2[1], p2[2], p2[3], p2[4]);
        }
        this._waiting_actions.length = 0;
      };
      LGraphNode.prototype.doExecute = function(param, options) {
        options = options || {};
        if (this.onExecute) {
          if (!options.action_call) options.action_call = this.id + "_exec_" + Math.floor(Math.random() * 9999);
          this.graph.nodes_executing[this.id] = true;
          this.onExecute(param, options);
          this.graph.nodes_executing[this.id] = false;
          this.exec_version = this.graph.iteration;
          if (options && options.action_call) {
            this.action_call = options.action_call;
            this.graph.nodes_executedAction[this.id] = options.action_call;
          }
        }
        this.execute_triggered = 2;
        if (this.onAfterExecuteNode) this.onAfterExecuteNode(param, options);
      };
      LGraphNode.prototype.actionDo = function(action, param, options, action_slot) {
        options = options || {};
        if (this.onAction) {
          if (!options.action_call) options.action_call = this.id + "_" + (action ? action : "action") + "_" + Math.floor(Math.random() * 9999);
          this.graph.nodes_actioning[this.id] = action ? action : "actioning";
          this.onAction(action, param, options, action_slot);
          this.graph.nodes_actioning[this.id] = false;
          if (options && options.action_call) {
            this.action_call = options.action_call;
            this.graph.nodes_executedAction[this.id] = options.action_call;
          }
        }
        this.action_triggered = 2;
        if (this.onAfterExecuteNode) this.onAfterExecuteNode(param, options);
      };
      LGraphNode.prototype.trigger = function(action, param, options) {
        if (!this.outputs || !this.outputs.length) {
          return;
        }
        if (this.graph)
          this.graph._last_trigger_time = LiteGraph.getTime();
        for (var i2 = 0; i2 < this.outputs.length; ++i2) {
          var output = this.outputs[i2];
          if (!output || output.type !== LiteGraph.EVENT || action && output.name != action)
            continue;
          this.triggerSlot(i2, param, null, options);
        }
      };
      LGraphNode.prototype.triggerSlot = function(slot, param, link_id, options) {
        options = options || {};
        if (!this.outputs) {
          return;
        }
        if (slot == null) {
          console.error("slot must be a number");
          return;
        }
        if (slot.constructor !== Number)
          console.warn("slot must be a number, use node.trigger('name') if you want to use a string");
        var output = this.outputs[slot];
        if (!output) {
          return;
        }
        var links = output.links;
        if (!links || !links.length) {
          return;
        }
        if (this.graph) {
          this.graph._last_trigger_time = LiteGraph.getTime();
        }
        for (var k = 0; k < links.length; ++k) {
          var id = links[k];
          if (link_id != null && link_id != id) {
            continue;
          }
          var link_info = this.graph.links[links[k]];
          if (!link_info) {
            continue;
          }
          link_info._last_time = LiteGraph.getTime();
          var node2 = this.graph.getNodeById(link_info.target_id);
          if (!node2) {
            continue;
          }
          var target_connection = node2.inputs[link_info.target_slot];
          if (node2.mode === LiteGraph.ON_TRIGGER) {
            if (!options.action_call) options.action_call = this.id + "_trigg_" + Math.floor(Math.random() * 9999);
            if (node2.onExecute) {
              node2.doExecute(param, options);
            }
          } else if (node2.onAction) {
            if (!options.action_call) options.action_call = this.id + "_act_" + Math.floor(Math.random() * 9999);
            var target_connection = node2.inputs[link_info.target_slot];
            if (LiteGraph.use_deferred_actions && node2.onExecute) {
              if (!node2._waiting_actions)
                node2._waiting_actions = [];
              node2._waiting_actions.push([target_connection.name, param, options, link_info.target_slot]);
            } else {
              node2.actionDo(target_connection.name, param, options, link_info.target_slot);
            }
          }
        }
      };
      LGraphNode.prototype.clearTriggeredSlot = function(slot, link_id) {
        if (!this.outputs) {
          return;
        }
        var output = this.outputs[slot];
        if (!output) {
          return;
        }
        var links = output.links;
        if (!links || !links.length) {
          return;
        }
        for (var k = 0; k < links.length; ++k) {
          var id = links[k];
          if (link_id != null && link_id != id) {
            continue;
          }
          var link_info = this.graph.links[links[k]];
          if (!link_info) {
            continue;
          }
          link_info._last_time = 0;
        }
      };
      LGraphNode.prototype.setSize = function(size) {
        this.size = size;
        if (this.onResize)
          this.onResize(this.size);
      };
      LGraphNode.prototype.addProperty = function(name, default_value, type, extra_info) {
        var o = { name, type, default_value };
        if (extra_info) {
          for (var i2 in extra_info) {
            o[i2] = extra_info[i2];
          }
        }
        if (!this.properties_info) {
          this.properties_info = [];
        }
        this.properties_info.push(o);
        if (!this.properties) {
          this.properties = {};
        }
        this.properties[name] = default_value;
        return o;
      };
      LGraphNode.prototype.addOutput = function(name, type, extra_info) {
        var output = { name, type, links: null };
        if (extra_info) {
          for (var i2 in extra_info) {
            output[i2] = extra_info[i2];
          }
        }
        if (!this.outputs) {
          this.outputs = [];
        }
        this.outputs.push(output);
        if (this.onOutputAdded) {
          this.onOutputAdded(output);
        }
        if (LiteGraph.auto_load_slot_types) LiteGraph.registerNodeAndSlotType(this, type, true);
        this.setSize(this.computeSize());
        this.setDirtyCanvas(true, true);
        return output;
      };
      LGraphNode.prototype.addOutputs = function(array) {
        for (var i2 = 0; i2 < array.length; ++i2) {
          var info = array[i2];
          var o = { name: info[0], type: info[1], link: null };
          if (array[2]) {
            for (var j in info[2]) {
              o[j] = info[2][j];
            }
          }
          if (!this.outputs) {
            this.outputs = [];
          }
          this.outputs.push(o);
          if (this.onOutputAdded) {
            this.onOutputAdded(o);
          }
          if (LiteGraph.auto_load_slot_types) LiteGraph.registerNodeAndSlotType(this, info[1], true);
        }
        this.setSize(this.computeSize());
        this.setDirtyCanvas(true, true);
      };
      LGraphNode.prototype.removeOutput = function(slot) {
        this.disconnectOutput(slot);
        this.outputs.splice(slot, 1);
        for (var i2 = slot; i2 < this.outputs.length; ++i2) {
          if (!this.outputs[i2] || !this.outputs[i2].links) {
            continue;
          }
          var links = this.outputs[i2].links;
          for (var j = 0; j < links.length; ++j) {
            var link = this.graph.links[links[j]];
            if (!link) {
              continue;
            }
            link.origin_slot -= 1;
          }
        }
        this.setSize(this.computeSize());
        if (this.onOutputRemoved) {
          this.onOutputRemoved(slot);
        }
        this.setDirtyCanvas(true, true);
      };
      LGraphNode.prototype.addInput = function(name, type, extra_info) {
        type = type || 0;
        var input = { name, type, link: null };
        if (extra_info) {
          for (var i2 in extra_info) {
            input[i2] = extra_info[i2];
          }
        }
        if (!this.inputs) {
          this.inputs = [];
        }
        this.inputs.push(input);
        this.setSize(this.computeSize());
        if (this.onInputAdded) {
          this.onInputAdded(input);
        }
        LiteGraph.registerNodeAndSlotType(this, type);
        this.setDirtyCanvas(true, true);
        return input;
      };
      LGraphNode.prototype.addInputs = function(array) {
        for (var i2 = 0; i2 < array.length; ++i2) {
          var info = array[i2];
          var o = { name: info[0], type: info[1], link: null };
          if (array[2]) {
            for (var j in info[2]) {
              o[j] = info[2][j];
            }
          }
          if (!this.inputs) {
            this.inputs = [];
          }
          this.inputs.push(o);
          if (this.onInputAdded) {
            this.onInputAdded(o);
          }
          LiteGraph.registerNodeAndSlotType(this, info[1]);
        }
        this.setSize(this.computeSize());
        this.setDirtyCanvas(true, true);
      };
      LGraphNode.prototype.removeInput = function(slot) {
        this.disconnectInput(slot);
        var slot_info = this.inputs.splice(slot, 1);
        for (var i2 = slot; i2 < this.inputs.length; ++i2) {
          if (!this.inputs[i2]) {
            continue;
          }
          var link = this.graph.links[this.inputs[i2].link];
          if (!link) {
            continue;
          }
          link.target_slot -= 1;
        }
        this.setSize(this.computeSize());
        if (this.onInputRemoved) {
          this.onInputRemoved(slot, slot_info[0]);
        }
        this.setDirtyCanvas(true, true);
      };
      LGraphNode.prototype.addConnection = function(name, type, pos2, direction) {
        var o = {
          name,
          type,
          pos: pos2,
          direction,
          links: null
        };
        this.connections.push(o);
        return o;
      };
      LGraphNode.prototype.computeSize = function(out) {
        if (this.constructor.size) {
          return this.constructor.size.concat();
        }
        var rows = Math.max(
          this.inputs ? this.inputs.length : 1,
          this.outputs ? this.outputs.length : 1
        );
        var size = out || new Float32Array([0, 0]);
        rows = Math.max(rows, 1);
        var font_size = LiteGraph.NODE_TEXT_SIZE;
        var title_width = compute_text_size(this.title);
        var input_width = 0;
        var output_width = 0;
        if (this.inputs) {
          for (var i2 = 0, l = this.inputs.length; i2 < l; ++i2) {
            var input = this.inputs[i2];
            var text = input.label || input.name || "";
            var text_width = compute_text_size(text);
            if (input_width < text_width) {
              input_width = text_width;
            }
          }
        }
        if (this.outputs) {
          for (var i2 = 0, l = this.outputs.length; i2 < l; ++i2) {
            var output = this.outputs[i2];
            var text = output.label || output.name || "";
            var text_width = compute_text_size(text);
            if (output_width < text_width) {
              output_width = text_width;
            }
          }
        }
        size[0] = Math.max(input_width + output_width + 10, title_width);
        size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH);
        if (this.widgets && this.widgets.length) {
          size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH * 1.5);
        }
        size[1] = (this.constructor.slot_start_y || 0) + rows * LiteGraph.NODE_SLOT_HEIGHT;
        var widgets_height = 0;
        if (this.widgets && this.widgets.length) {
          for (var i2 = 0, l = this.widgets.length; i2 < l; ++i2) {
            if (this.widgets[i2].computeSize)
              widgets_height += this.widgets[i2].computeSize(size[0])[1] + 4;
            else
              widgets_height += LiteGraph.NODE_WIDGET_HEIGHT + 4;
          }
          widgets_height += 8;
        }
        if (this.widgets_up)
          size[1] = Math.max(size[1], widgets_height);
        else if (this.widgets_start_y != null)
          size[1] = Math.max(size[1], widgets_height + this.widgets_start_y);
        else
          size[1] += widgets_height;
        function compute_text_size(text2) {
          if (!text2) {
            return 0;
          }
          return font_size * text2.length * 0.6;
        }
        if (this.constructor.min_height && size[1] < this.constructor.min_height) {
          size[1] = this.constructor.min_height;
        }
        size[1] += 6;
        return size;
      };
      LGraphNode.prototype.getPropertyInfo = function(property) {
        var info = null;
        if (this.properties_info) {
          for (var i2 = 0; i2 < this.properties_info.length; ++i2) {
            if (this.properties_info[i2].name == property) {
              info = this.properties_info[i2];
              break;
            }
          }
        }
        if (this.constructor["@" + property])
          info = this.constructor["@" + property];
        if (this.constructor.widgets_info && this.constructor.widgets_info[property])
          info = this.constructor.widgets_info[property];
        if (!info && this.onGetPropertyInfo) {
          info = this.onGetPropertyInfo(property);
        }
        if (!info)
          info = {};
        if (!info.type)
          info.type = typeof this.properties[property];
        if (info.widget == "combo")
          info.type = "enum";
        return info;
      };
      LGraphNode.prototype.addWidget = function(type, name, value, callback, options) {
        if (!this.widgets) {
          this.widgets = [];
        }
        if (!options && callback && callback.constructor === Object) {
          options = callback;
          callback = null;
        }
        if (options && options.constructor === String)
          options = { property: options };
        if (callback && callback.constructor === String) {
          if (!options)
            options = {};
          options.property = callback;
          callback = null;
        }
        if (callback && callback.constructor !== Function) {
          console.warn("addWidget: callback must be a function");
          callback = null;
        }
        var w2 = {
          type: type.toLowerCase(),
          name,
          value,
          callback,
          options: options || {}
        };
        if (w2.options.y !== void 0) {
          w2.y = w2.options.y;
        }
        if (!callback && !w2.options.callback && !w2.options.property) {
          console.warn("LiteGraph addWidget(...) without a callback or property assigned");
        }
        if (type == "combo" && !w2.options.values) {
          throw "LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }";
        }
        this.widgets.push(w2);
        this.setSize(this.computeSize());
        return w2;
      };
      LGraphNode.prototype.addCustomWidget = function(custom_widget) {
        if (!this.widgets) {
          this.widgets = [];
        }
        this.widgets.push(custom_widget);
        return custom_widget;
      };
      LGraphNode.prototype.getBounding = function(out, compute_outer) {
        out = out || new Float32Array(4);
        const nodePos = this.pos;
        const isCollapsed = this.flags.collapsed;
        const nodeSize = this.size;
        let left_offset = 0;
        let right_offset = 1;
        let top_offset = 0;
        let bottom_offset = 0;
        if (compute_outer) {
          left_offset = 4;
          right_offset = 6 + left_offset;
          top_offset = 4;
          bottom_offset = 5 + top_offset;
        }
        out[0] = nodePos[0] - left_offset;
        out[1] = nodePos[1] - LiteGraph.NODE_TITLE_HEIGHT - top_offset;
        out[2] = isCollapsed ? (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + right_offset : nodeSize[0] + right_offset;
        out[3] = isCollapsed ? LiteGraph.NODE_TITLE_HEIGHT + bottom_offset : nodeSize[1] + LiteGraph.NODE_TITLE_HEIGHT + bottom_offset;
        if (this.onBounding) {
          this.onBounding(out);
        }
        return out;
      };
      LGraphNode.prototype.isPointInside = function(x2, y2, margin, skip_title) {
        margin = margin || 0;
        var margin_top = this.graph && this.graph.isLive() ? 0 : LiteGraph.NODE_TITLE_HEIGHT;
        if (skip_title) {
          margin_top = 0;
        }
        if (this.flags && this.flags.collapsed) {
          if (isInsideRectangle(
            x2,
            y2,
            this.pos[0] - margin,
            this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT - margin,
            (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + 2 * margin,
            LiteGraph.NODE_TITLE_HEIGHT + 2 * margin
          )) {
            return true;
          }
        } else if (this.pos[0] - 4 - margin < x2 && this.pos[0] + this.size[0] + 4 + margin > x2 && this.pos[1] - margin_top - margin < y2 && this.pos[1] + this.size[1] + margin > y2) {
          return true;
        }
        return false;
      };
      LGraphNode.prototype.getSlotInPosition = function(x2, y2) {
        var link_pos = new Float32Array(2);
        if (this.inputs) {
          for (var i2 = 0, l = this.inputs.length; i2 < l; ++i2) {
            var input = this.inputs[i2];
            this.getConnectionPos(true, i2, link_pos);
            if (isInsideRectangle(
              x2,
              y2,
              link_pos[0] - 10,
              link_pos[1] - 5,
              20,
              10
            )) {
              return { input, slot: i2, link_pos };
            }
          }
        }
        if (this.outputs) {
          for (var i2 = 0, l = this.outputs.length; i2 < l; ++i2) {
            var output = this.outputs[i2];
            this.getConnectionPos(false, i2, link_pos);
            if (isInsideRectangle(
              x2,
              y2,
              link_pos[0] - 10,
              link_pos[1] - 5,
              20,
              10
            )) {
              return { output, slot: i2, link_pos };
            }
          }
        }
        return null;
      };
      LGraphNode.prototype.findInputSlot = function(name, returnObj) {
        if (!this.inputs) {
          return -1;
        }
        for (var i2 = 0, l = this.inputs.length; i2 < l; ++i2) {
          if (name == this.inputs[i2].name) {
            return !returnObj ? i2 : this.inputs[i2];
          }
        }
        return -1;
      };
      LGraphNode.prototype.findOutputSlot = function(name, returnObj) {
        returnObj = returnObj || false;
        if (!this.outputs) {
          return -1;
        }
        for (var i2 = 0, l = this.outputs.length; i2 < l; ++i2) {
          if (name == this.outputs[i2].name) {
            return !returnObj ? i2 : this.outputs[i2];
          }
        }
        return -1;
      };
      LGraphNode.prototype.findInputSlotFree = function(optsIn) {
        var optsIn = optsIn || {};
        var optsDef = {
          returnObj: false,
          typesNotAccepted: []
        };
        var opts = Object.assign(optsDef, optsIn);
        if (!this.inputs) {
          return -1;
        }
        for (var i2 = 0, l = this.inputs.length; i2 < l; ++i2) {
          if (this.inputs[i2].link && this.inputs[i2].link != null) {
            continue;
          }
          if (opts.typesNotAccepted && opts.typesNotAccepted.includes && opts.typesNotAccepted.includes(this.inputs[i2].type)) {
            continue;
          }
          return !opts.returnObj ? i2 : this.inputs[i2];
        }
        return -1;
      };
      LGraphNode.prototype.findOutputSlotFree = function(optsIn) {
        var optsIn = optsIn || {};
        var optsDef = {
          returnObj: false,
          typesNotAccepted: []
        };
        var opts = Object.assign(optsDef, optsIn);
        if (!this.outputs) {
          return -1;
        }
        for (var i2 = 0, l = this.outputs.length; i2 < l; ++i2) {
          if (this.outputs[i2].links && this.outputs[i2].links != null) {
            continue;
          }
          if (opts.typesNotAccepted && opts.typesNotAccepted.includes && opts.typesNotAccepted.includes(this.outputs[i2].type)) {
            continue;
          }
          return !opts.returnObj ? i2 : this.outputs[i2];
        }
        return -1;
      };
      LGraphNode.prototype.findInputSlotByType = function(type, returnObj, preferFreeSlot, doNotUseOccupied) {
        return this.findSlotByType(true, type, returnObj, preferFreeSlot, doNotUseOccupied);
      };
      LGraphNode.prototype.findOutputSlotByType = function(type, returnObj, preferFreeSlot, doNotUseOccupied) {
        return this.findSlotByType(false, type, returnObj, preferFreeSlot, doNotUseOccupied);
      };
      LGraphNode.prototype.findSlotByType = function(input, type, returnObj, preferFreeSlot, doNotUseOccupied) {
        input = input || false;
        returnObj = returnObj || false;
        preferFreeSlot = preferFreeSlot || false;
        doNotUseOccupied = doNotUseOccupied || false;
        var aSlots = input ? this.inputs : this.outputs;
        if (!aSlots) {
          return -1;
        }
        if (type == "" || type == "*") type = 0;
        for (var i2 = 0, l = aSlots.length; i2 < l; ++i2) {
          var aSource = (type + "").toLowerCase().split(",");
          var aDest = aSlots[i2].type == "0" || aSlots[i2].type == "*" ? "0" : aSlots[i2].type;
          aDest = (aDest + "").toLowerCase().split(",");
          for (var sI = 0; sI < aSource.length; sI++) {
            for (var dI = 0; dI < aDest.length; dI++) {
              if (aSource[sI] == "_event_") aSource[sI] = LiteGraph.EVENT;
              if (aDest[sI] == "_event_") aDest[sI] = LiteGraph.EVENT;
              if (aSource[sI] == "*") aSource[sI] = 0;
              if (aDest[sI] == "*") aDest[sI] = 0;
              if (aSource[sI] == aDest[dI]) {
                if (preferFreeSlot && aSlots[i2].links && aSlots[i2].links !== null) continue;
                return !returnObj ? i2 : aSlots[i2];
              }
            }
          }
        }
        if (preferFreeSlot && !doNotUseOccupied) {
          for (var i2 = 0, l = aSlots.length; i2 < l; ++i2) {
            var aSource = (type + "").toLowerCase().split(",");
            var aDest = aSlots[i2].type == "0" || aSlots[i2].type == "*" ? "0" : aSlots[i2].type;
            aDest = (aDest + "").toLowerCase().split(",");
            for (var sI = 0; sI < aSource.length; sI++) {
              for (var dI = 0; dI < aDest.length; dI++) {
                if (aSource[sI] == "*") aSource[sI] = 0;
                if (aDest[sI] == "*") aDest[sI] = 0;
                if (aSource[sI] == aDest[dI]) {
                  return !returnObj ? i2 : aSlots[i2];
                }
              }
            }
          }
        }
        return -1;
      };
      LGraphNode.prototype.connectByType = function(slot, target_node, target_slotType, optsIn) {
        var optsIn = optsIn || {};
        var optsDef = {
          createEventInCase: true,
          firstFreeIfOutputGeneralInCase: true,
          generalTypeInCase: true
        };
        var opts = Object.assign(optsDef, optsIn);
        if (target_node && target_node.constructor === Number) {
          target_node = this.graph.getNodeById(target_node);
        }
        var target_slot = target_node.findInputSlotByType(target_slotType, false, true);
        if (target_slot >= 0 && target_slot !== null) {
          return this.connect(slot, target_node, target_slot);
        } else {
          if (opts.createEventInCase && target_slotType == LiteGraph.EVENT) {
            return this.connect(slot, target_node, -1);
          }
          if (opts.generalTypeInCase) {
            var target_slot = target_node.findInputSlotByType(0, false, true, true);
            if (target_slot >= 0) {
              return this.connect(slot, target_node, target_slot);
            }
          }
          if (opts.firstFreeIfOutputGeneralInCase && (target_slotType == 0 || target_slotType == "*" || target_slotType == "")) {
            var target_slot = target_node.findInputSlotFree({ typesNotAccepted: [LiteGraph.EVENT] });
            if (target_slot >= 0) {
              return this.connect(slot, target_node, target_slot);
            }
          }
          console.debug("no way to connect type: ", target_slotType, " to targetNODE ", target_node);
          return null;
        }
      };
      LGraphNode.prototype.connectByTypeOutput = function(slot, source_node, source_slotType, optsIn) {
        var optsIn = optsIn || {};
        var optsDef = {
          createEventInCase: true,
          firstFreeIfInputGeneralInCase: true,
          generalTypeInCase: true
        };
        var opts = Object.assign(optsDef, optsIn);
        if (source_node && source_node.constructor === Number) {
          source_node = this.graph.getNodeById(source_node);
        }
        var source_slot = source_node.findOutputSlotByType(source_slotType, false, true);
        if (source_slot >= 0 && source_slot !== null) {
          return source_node.connect(source_slot, this, slot);
        } else {
          if (opts.generalTypeInCase) {
            var source_slot = source_node.findOutputSlotByType(0, false, true, true);
            if (source_slot >= 0) {
              return source_node.connect(source_slot, this, slot);
            }
          }
          if (opts.createEventInCase && source_slotType == LiteGraph.EVENT) {
            if (LiteGraph.do_add_triggers_slots) {
              var source_slot = source_node.addOnExecutedOutput();
              return source_node.connect(source_slot, this, slot);
            }
          }
          if (opts.firstFreeIfInputGeneralInCase && (source_slotType == 0 || source_slotType == "*" || source_slotType == "")) {
            var source_slot = source_node.findOutputSlotFree({ typesNotAccepted: [LiteGraph.EVENT] });
            if (source_slot >= 0) {
              return source_node.connect(source_slot, this, slot);
            }
          }
          console.debug("no way to connect byOUT type: ", source_slotType, " to sourceNODE ", source_node);
          return null;
        }
      };
      LGraphNode.prototype.connect = function(slot, target_node, target_slot) {
        target_slot = target_slot || 0;
        if (!this.graph) {
          console.log(
            "Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them."
          );
          return null;
        }
        if (slot.constructor === String) {
          slot = this.findOutputSlot(slot);
          if (slot == -1) {
            if (LiteGraph.debug) {
              console.log("Connect: Error, no slot of name " + slot);
            }
            return null;
          }
        } else if (!this.outputs || slot >= this.outputs.length) {
          if (LiteGraph.debug) {
            console.log("Connect: Error, slot number not found");
          }
          return null;
        }
        if (target_node && target_node.constructor === Number) {
          target_node = this.graph.getNodeById(target_node);
        }
        if (!target_node) {
          throw "target node is null";
        }
        if (target_node == this) {
          return null;
        }
        if (target_slot.constructor === String) {
          target_slot = target_node.findInputSlot(target_slot);
          if (target_slot == -1) {
            if (LiteGraph.debug) {
              console.log(
                "Connect: Error, no slot of name " + target_slot
              );
            }
            return null;
          }
        } else if (target_slot === LiteGraph.EVENT) {
          if (LiteGraph.do_add_triggers_slots) {
            target_node.changeMode(LiteGraph.ON_TRIGGER);
            target_slot = target_node.findInputSlot("onTrigger");
          } else {
            return null;
          }
        } else if (!target_node.inputs || target_slot >= target_node.inputs.length) {
          if (LiteGraph.debug) {
            console.log("Connect: Error, slot number not found");
          }
          return null;
        }
        var changed = false;
        var input = target_node.inputs[target_slot];
        var link_info = null;
        var output = this.outputs[slot];
        if (!this.outputs[slot]) {
          return null;
        }
        if (target_node.onBeforeConnectInput) {
          target_slot = target_node.onBeforeConnectInput(target_slot);
        }
        if (target_slot === false || target_slot === null || !LiteGraph.isValidConnection(output.type, input.type)) {
          this.setDirtyCanvas(false, true);
          if (changed)
            this.graph.connectionChange(this, link_info);
          return null;
        }
        if (target_node.onConnectInput) {
          if (target_node.onConnectInput(target_slot, output.type, output, this, slot) === false) {
            return null;
          }
        }
        if (this.onConnectOutput) {
          if (this.onConnectOutput(slot, input.type, input, target_node, target_slot) === false) {
            return null;
          }
        }
        if (target_node.inputs[target_slot] && target_node.inputs[target_slot].link != null) {
          this.graph.beforeChange();
          target_node.disconnectInput(target_slot, { doProcessChange: false });
          changed = true;
        }
        if (output.links !== null && output.links.length) {
          switch (output.type) {
            case LiteGraph.EVENT:
              if (!LiteGraph.allow_multi_output_for_events) {
                this.graph.beforeChange();
                this.disconnectOutput(slot, false, { doProcessChange: false });
                changed = true;
              }
              break;
          }
        }
        var nextId;
        if (LiteGraph.use_uuids)
          nextId = LiteGraph.uuidv4();
        else
          nextId = ++this.graph.last_link_id;
        link_info = new LLink(
          nextId,
          input.type || output.type,
          this.id,
          slot,
          target_node.id,
          target_slot
        );
        this.graph.links[link_info.id] = link_info;
        if (output.links == null) {
          output.links = [];
        }
        output.links.push(link_info.id);
        target_node.inputs[target_slot].link = link_info.id;
        if (this.graph) {
          this.graph._version++;
        }
        if (this.onConnectionsChange) {
          this.onConnectionsChange(
            LiteGraph.OUTPUT,
            slot,
            true,
            link_info,
            output
          );
        }
        if (target_node.onConnectionsChange) {
          target_node.onConnectionsChange(
            LiteGraph.INPUT,
            target_slot,
            true,
            link_info,
            input
          );
        }
        if (this.graph && this.graph.onNodeConnectionChange) {
          this.graph.onNodeConnectionChange(
            LiteGraph.INPUT,
            target_node,
            target_slot,
            this,
            slot
          );
          this.graph.onNodeConnectionChange(
            LiteGraph.OUTPUT,
            this,
            slot,
            target_node,
            target_slot
          );
        }
        this.setDirtyCanvas(false, true);
        this.graph.afterChange();
        this.graph.connectionChange(this, link_info);
        return link_info;
      };
      LGraphNode.prototype.disconnectOutput = function(slot, target_node) {
        if (slot.constructor === String) {
          slot = this.findOutputSlot(slot);
          if (slot == -1) {
            if (LiteGraph.debug) {
              console.log("Connect: Error, no slot of name " + slot);
            }
            return false;
          }
        } else if (!this.outputs || slot >= this.outputs.length) {
          if (LiteGraph.debug) {
            console.log("Connect: Error, slot number not found");
          }
          return false;
        }
        var output = this.outputs[slot];
        if (!output || !output.links || output.links.length == 0) {
          return false;
        }
        if (target_node) {
          if (target_node.constructor === Number) {
            target_node = this.graph.getNodeById(target_node);
          }
          if (!target_node) {
            throw "Target Node not found";
          }
          for (var i2 = 0, l = output.links.length; i2 < l; i2++) {
            var link_id = output.links[i2];
            var link_info = this.graph.links[link_id];
            if (link_info.target_id == target_node.id) {
              output.links.splice(i2, 1);
              var input = target_node.inputs[link_info.target_slot];
              input.link = null;
              delete this.graph.links[link_id];
              if (this.graph) {
                this.graph._version++;
              }
              if (target_node.onConnectionsChange) {
                target_node.onConnectionsChange(
                  LiteGraph.INPUT,
                  link_info.target_slot,
                  false,
                  link_info,
                  input
                );
              }
              if (this.onConnectionsChange) {
                this.onConnectionsChange(
                  LiteGraph.OUTPUT,
                  slot,
                  false,
                  link_info,
                  output
                );
              }
              if (this.graph && this.graph.onNodeConnectionChange) {
                this.graph.onNodeConnectionChange(
                  LiteGraph.OUTPUT,
                  this,
                  slot
                );
              }
              if (this.graph && this.graph.onNodeConnectionChange) {
                this.graph.onNodeConnectionChange(
                  LiteGraph.OUTPUT,
                  this,
                  slot
                );
                this.graph.onNodeConnectionChange(
                  LiteGraph.INPUT,
                  target_node,
                  link_info.target_slot
                );
              }
              break;
            }
          }
        } else {
          for (var i2 = 0, l = output.links.length; i2 < l; i2++) {
            var link_id = output.links[i2];
            var link_info = this.graph.links[link_id];
            if (!link_info) {
              continue;
            }
            var target_node = this.graph.getNodeById(link_info.target_id);
            var input = null;
            if (this.graph) {
              this.graph._version++;
            }
            if (target_node) {
              input = target_node.inputs[link_info.target_slot];
              input.link = null;
              if (target_node.onConnectionsChange) {
                target_node.onConnectionsChange(
                  LiteGraph.INPUT,
                  link_info.target_slot,
                  false,
                  link_info,
                  input
                );
              }
              if (this.graph && this.graph.onNodeConnectionChange) {
                this.graph.onNodeConnectionChange(
                  LiteGraph.INPUT,
                  target_node,
                  link_info.target_slot
                );
              }
            }
            delete this.graph.links[link_id];
            if (this.onConnectionsChange) {
              this.onConnectionsChange(
                LiteGraph.OUTPUT,
                slot,
                false,
                link_info,
                output
              );
            }
            if (this.graph && this.graph.onNodeConnectionChange) {
              this.graph.onNodeConnectionChange(
                LiteGraph.OUTPUT,
                this,
                slot
              );
              this.graph.onNodeConnectionChange(
                LiteGraph.INPUT,
                target_node,
                link_info.target_slot
              );
            }
          }
          output.links = null;
        }
        this.setDirtyCanvas(false, true);
        this.graph.connectionChange(this);
        return true;
      };
      LGraphNode.prototype.disconnectInput = function(slot) {
        if (slot.constructor === String) {
          slot = this.findInputSlot(slot);
          if (slot == -1) {
            if (LiteGraph.debug) {
              console.log("Connect: Error, no slot of name " + slot);
            }
            return false;
          }
        } else if (!this.inputs || slot >= this.inputs.length) {
          if (LiteGraph.debug) {
            console.log("Connect: Error, slot number not found");
          }
          return false;
        }
        var input = this.inputs[slot];
        if (!input) {
          return false;
        }
        var link_id = this.inputs[slot].link;
        if (link_id != null) {
          this.inputs[slot].link = null;
          var link_info = this.graph.links[link_id];
          if (link_info) {
            var target_node = this.graph.getNodeById(link_info.origin_id);
            if (!target_node) {
              return false;
            }
            var output = target_node.outputs[link_info.origin_slot];
            if (!output || !output.links || output.links.length == 0) {
              return false;
            }
            for (var i2 = 0, l = output.links.length; i2 < l; i2++) {
              if (output.links[i2] == link_id) {
                output.links.splice(i2, 1);
                break;
              }
            }
            delete this.graph.links[link_id];
            if (this.graph) {
              this.graph._version++;
            }
            if (this.onConnectionsChange) {
              this.onConnectionsChange(
                LiteGraph.INPUT,
                slot,
                false,
                link_info,
                input
              );
            }
            if (target_node.onConnectionsChange) {
              target_node.onConnectionsChange(
                LiteGraph.OUTPUT,
                i2,
                false,
                link_info,
                output
              );
            }
            if (this.graph && this.graph.onNodeConnectionChange) {
              this.graph.onNodeConnectionChange(
                LiteGraph.OUTPUT,
                target_node,
                i2
              );
              this.graph.onNodeConnectionChange(LiteGraph.INPUT, this, slot);
            }
          }
        }
        this.setDirtyCanvas(false, true);
        if (this.graph)
          this.graph.connectionChange(this);
        return true;
      };
      LGraphNode.prototype.getConnectionPos = function(is_input, slot_number, out) {
        out = out || new Float32Array(2);
        var num_slots = 0;
        if (is_input && this.inputs) {
          num_slots = this.inputs.length;
        }
        if (!is_input && this.outputs) {
          num_slots = this.outputs.length;
        }
        var offset = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
        if (this.flags.collapsed) {
          var w2 = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
          if (this.horizontal) {
            out[0] = this.pos[0] + w2 * 0.5;
            if (is_input) {
              out[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT;
            } else {
              out[1] = this.pos[1];
            }
          } else {
            if (is_input) {
              out[0] = this.pos[0];
            } else {
              out[0] = this.pos[0] + w2;
            }
            out[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5;
          }
          return out;
        }
        if (is_input && slot_number == -1) {
          out[0] = this.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
          out[1] = this.pos[1] + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
          return out;
        }
        if (is_input && num_slots > slot_number && this.inputs[slot_number].pos) {
          out[0] = this.pos[0] + this.inputs[slot_number].pos[0];
          out[1] = this.pos[1] + this.inputs[slot_number].pos[1];
          return out;
        } else if (!is_input && num_slots > slot_number && this.outputs[slot_number].pos) {
          out[0] = this.pos[0] + this.outputs[slot_number].pos[0];
          out[1] = this.pos[1] + this.outputs[slot_number].pos[1];
          return out;
        }
        if (this.horizontal) {
          out[0] = this.pos[0] + (slot_number + 0.5) * (this.size[0] / num_slots);
          if (is_input) {
            out[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT;
          } else {
            out[1] = this.pos[1] + this.size[1];
          }
          return out;
        }
        if (is_input) {
          out[0] = this.pos[0] + offset;
        } else {
          out[0] = this.pos[0] + this.size[0] + 1 - offset;
        }
        out[1] = this.pos[1] + (slot_number + 0.7) * LiteGraph.NODE_SLOT_HEIGHT + (this.constructor.slot_start_y || 0);
        return out;
      };
      LGraphNode.prototype.alignToGrid = function() {
        this.pos[0] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE);
        this.pos[1] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE);
      };
      LGraphNode.prototype.trace = function(msg) {
        if (!this.console) {
          this.console = [];
        }
        this.console.push(msg);
        if (this.console.length > LGraphNode.MAX_CONSOLE) {
          this.console.shift();
        }
        if (this.graph.onNodeTrace)
          this.graph.onNodeTrace(this, msg);
      };
      LGraphNode.prototype.setDirtyCanvas = function(dirty_foreground, dirty_background) {
        if (!this.graph) {
          return;
        }
        this.graph.sendActionToCanvas("setDirty", [
          dirty_foreground,
          dirty_background
        ]);
      };
      LGraphNode.prototype.loadImage = function(url) {
        var img = new Image();
        img.src = LiteGraph.node_images_path + url;
        img.ready = false;
        var that2 = this;
        img.onload = function() {
          this.ready = true;
          that2.setDirtyCanvas(true);
        };
        return img;
      };
      LGraphNode.prototype.captureInput = function(v2) {
        if (!this.graph || !this.graph.list_of_graphcanvas) {
          return;
        }
        var list = this.graph.list_of_graphcanvas;
        for (var i2 = 0; i2 < list.length; ++i2) {
          var c = list[i2];
          if (!v2 && c.node_capturing_input != this) {
            continue;
          }
          c.node_capturing_input = v2 ? this : null;
        }
      };
      LGraphNode.prototype.collapse = function(force) {
        this.graph._version++;
        if (this.constructor.collapsable === false && !force) {
          return;
        }
        if (!this.flags.collapsed) {
          this.flags.collapsed = true;
        } else {
          this.flags.collapsed = false;
        }
        this.setDirtyCanvas(true, true);
      };
      LGraphNode.prototype.pin = function(v2) {
        this.graph._version++;
        if (v2 === void 0) {
          this.flags.pinned = !this.flags.pinned;
        } else {
          this.flags.pinned = v2;
        }
      };
      LGraphNode.prototype.localToScreen = function(x2, y2, graphcanvas) {
        return [
          (x2 + this.pos[0]) * graphcanvas.scale + graphcanvas.offset[0],
          (y2 + this.pos[1]) * graphcanvas.scale + graphcanvas.offset[1]
        ];
      };
      function LGraphGroup(title) {
        this._ctor(title);
      }
      global.LGraphGroup = LiteGraph.LGraphGroup = LGraphGroup;
      LGraphGroup.prototype._ctor = function(title) {
        this.title = title || "Group";
        this.font_size = 24;
        this.color = LGraphCanvas.node_colors.pale_blue ? LGraphCanvas.node_colors.pale_blue.groupcolor : "#AAA";
        this._bounding = new Float32Array([10, 10, 140, 80]);
        this._pos = this._bounding.subarray(0, 2);
        this._size = this._bounding.subarray(2, 4);
        this._nodes = [];
        this.graph = null;
        Object.defineProperty(this, "pos", {
          set: function(v2) {
            if (!v2 || v2.length < 2) {
              return;
            }
            this._pos[0] = v2[0];
            this._pos[1] = v2[1];
          },
          get: function() {
            return this._pos;
          },
          enumerable: true
        });
        Object.defineProperty(this, "size", {
          set: function(v2) {
            if (!v2 || v2.length < 2) {
              return;
            }
            this._size[0] = Math.max(140, v2[0]);
            this._size[1] = Math.max(80, v2[1]);
          },
          get: function() {
            return this._size;
          },
          enumerable: true
        });
      };
      LGraphGroup.prototype.configure = function(o) {
        this.title = o.title;
        this._bounding.set(o.bounding);
        this.color = o.color;
        this.font_size = o.font_size;
      };
      LGraphGroup.prototype.serialize = function() {
        var b = this._bounding;
        return {
          title: this.title,
          bounding: [
            Math.round(b[0]),
            Math.round(b[1]),
            Math.round(b[2]),
            Math.round(b[3])
          ],
          color: this.color,
          font_size: this.font_size
        };
      };
      LGraphGroup.prototype.move = function(deltax, deltay, ignore_nodes) {
        this._pos[0] += deltax;
        this._pos[1] += deltay;
        if (ignore_nodes) {
          return;
        }
        for (var i2 = 0; i2 < this._nodes.length; ++i2) {
          var node2 = this._nodes[i2];
          node2.pos[0] += deltax;
          node2.pos[1] += deltay;
        }
      };
      LGraphGroup.prototype.recomputeInsideNodes = function() {
        this._nodes.length = 0;
        var nodes = this.graph._nodes;
        var node_bounding = new Float32Array(4);
        for (var i2 = 0; i2 < nodes.length; ++i2) {
          var node2 = nodes[i2];
          node2.getBounding(node_bounding);
          if (!overlapBounding(this._bounding, node_bounding)) {
            continue;
          }
          this._nodes.push(node2);
        }
      };
      LGraphGroup.prototype.isPointInside = LGraphNode.prototype.isPointInside;
      LGraphGroup.prototype.setDirtyCanvas = LGraphNode.prototype.setDirtyCanvas;
      function DragAndScale(element, skip_events) {
        this.offset = new Float32Array([0, 0]);
        this.scale = 1;
        this.max_scale = 10;
        this.min_scale = 0.1;
        this.onredraw = null;
        this.enabled = true;
        this.last_mouse = [0, 0];
        this.element = null;
        this.visible_area = new Float32Array(4);
        if (element) {
          this.element = element;
          if (!skip_events) {
            this.bindEvents(element);
          }
        }
      }
      LiteGraph.DragAndScale = DragAndScale;
      DragAndScale.prototype.bindEvents = function(element) {
        this.last_mouse = new Float32Array(2);
        this._binded_mouse_callback = this.onMouse.bind(this);
        LiteGraph.pointerListenerAdd(element, "down", this._binded_mouse_callback);
        LiteGraph.pointerListenerAdd(element, "move", this._binded_mouse_callback);
        LiteGraph.pointerListenerAdd(element, "up", this._binded_mouse_callback);
        element.addEventListener(
          "mousewheel",
          this._binded_mouse_callback,
          false
        );
        element.addEventListener("wheel", this._binded_mouse_callback, false);
      };
      DragAndScale.prototype.computeVisibleArea = function(viewport) {
        if (!this.element) {
          this.visible_area[0] = this.visible_area[1] = this.visible_area[2] = this.visible_area[3] = 0;
          return;
        }
        var width2 = this.element.width;
        var height = this.element.height;
        var startx = -this.offset[0];
        var starty = -this.offset[1];
        if (viewport) {
          startx += viewport[0] / this.scale;
          starty += viewport[1] / this.scale;
          width2 = viewport[2];
          height = viewport[3];
        }
        var endx = startx + width2 / this.scale;
        var endy = starty + height / this.scale;
        this.visible_area[0] = startx;
        this.visible_area[1] = starty;
        this.visible_area[2] = endx - startx;
        this.visible_area[3] = endy - starty;
      };
      DragAndScale.prototype.onMouse = function(e) {
        if (!this.enabled) {
          return;
        }
        var canvas = this.element;
        var rect = canvas.getBoundingClientRect();
        var x2 = e.clientX - rect.left;
        var y2 = e.clientY - rect.top;
        e.canvasx = x2;
        e.canvasy = y2;
        e.dragging = this.dragging;
        var is_inside = !this.viewport || this.viewport && x2 >= this.viewport[0] && x2 < this.viewport[0] + this.viewport[2] && y2 >= this.viewport[1] && y2 < this.viewport[1] + this.viewport[3];
        var ignore = false;
        if (this.onmouse) {
          ignore = this.onmouse(e);
        }
        if (e.type == LiteGraph.pointerevents_method + "down" && is_inside) {
          this.dragging = true;
          LiteGraph.pointerListenerRemove(canvas, "move", this._binded_mouse_callback);
          LiteGraph.pointerListenerAdd(document, "move", this._binded_mouse_callback);
          LiteGraph.pointerListenerAdd(document, "up", this._binded_mouse_callback);
        } else if (e.type == LiteGraph.pointerevents_method + "move") {
          if (!ignore) {
            var deltax = x2 - this.last_mouse[0];
            var deltay = y2 - this.last_mouse[1];
            if (this.dragging) {
              this.mouseDrag(deltax, deltay);
            }
          }
        } else if (e.type == LiteGraph.pointerevents_method + "up") {
          this.dragging = false;
          LiteGraph.pointerListenerRemove(document, "move", this._binded_mouse_callback);
          LiteGraph.pointerListenerRemove(document, "up", this._binded_mouse_callback);
          LiteGraph.pointerListenerAdd(canvas, "move", this._binded_mouse_callback);
        } else if (is_inside && (e.type == "mousewheel" || e.type == "wheel" || e.type == "DOMMouseScroll")) {
          e.eventType = "mousewheel";
          if (e.type == "wheel") {
            e.wheel = -e.deltaY;
          } else {
            e.wheel = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;
          }
          e.delta = e.wheelDelta ? e.wheelDelta / 40 : e.deltaY ? -e.deltaY / 3 : 0;
          this.changeDeltaScale(1 + e.delta * 0.05);
        }
        this.last_mouse[0] = x2;
        this.last_mouse[1] = y2;
        if (is_inside) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };
      DragAndScale.prototype.toCanvasContext = function(ctx) {
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset[0], this.offset[1]);
      };
      DragAndScale.prototype.convertOffsetToCanvas = function(pos2) {
        return [
          (pos2[0] + this.offset[0]) * this.scale,
          (pos2[1] + this.offset[1]) * this.scale
        ];
      };
      DragAndScale.prototype.convertCanvasToOffset = function(pos2, out) {
        out = out || [0, 0];
        out[0] = pos2[0] / this.scale - this.offset[0];
        out[1] = pos2[1] / this.scale - this.offset[1];
        return out;
      };
      DragAndScale.prototype.mouseDrag = function(x2, y2) {
        this.offset[0] += x2 / this.scale;
        this.offset[1] += y2 / this.scale;
        if (this.onredraw) {
          this.onredraw(this);
        }
      };
      DragAndScale.prototype.changeScale = function(value, zooming_center) {
        if (value < this.min_scale) {
          value = this.min_scale;
        } else if (value > this.max_scale) {
          value = this.max_scale;
        }
        if (value == this.scale) {
          return;
        }
        if (!this.element) {
          return;
        }
        var rect = this.element.getBoundingClientRect();
        if (!rect) {
          return;
        }
        zooming_center = zooming_center || [
          rect.width * 0.5,
          rect.height * 0.5
        ];
        var center = this.convertCanvasToOffset(zooming_center);
        this.scale = value;
        if (Math.abs(this.scale - 1) < 0.01) {
          this.scale = 1;
        }
        var new_center = this.convertCanvasToOffset(zooming_center);
        var delta_offset = [
          new_center[0] - center[0],
          new_center[1] - center[1]
        ];
        this.offset[0] += delta_offset[0];
        this.offset[1] += delta_offset[1];
        if (this.onredraw) {
          this.onredraw(this);
        }
      };
      DragAndScale.prototype.changeDeltaScale = function(value, zooming_center) {
        this.changeScale(this.scale * value, zooming_center);
      };
      DragAndScale.prototype.reset = function() {
        this.scale = 1;
        this.offset[0] = 0;
        this.offset[1] = 0;
      };
      function LGraphCanvas(canvas, graph, options) {
        this.options = options = options || {};
        this.background_image = LGraphCanvas.DEFAULT_BACKGROUND_IMAGE;
        if (canvas && canvas.constructor === String) {
          canvas = document.querySelector(canvas);
        }
        this.ds = new DragAndScale();
        this.zoom_modify_alpha = true;
        this.title_text_font = "" + LiteGraph.NODE_TEXT_SIZE + "px Arial";
        this.inner_text_font = "normal " + LiteGraph.NODE_SUBTEXT_SIZE + "px Arial";
        this.node_title_color = LiteGraph.NODE_TITLE_COLOR;
        this.default_link_color = LiteGraph.LINK_COLOR;
        this.default_connection_color = {
          input_off: "#778",
          input_on: "#7F7",
          //"#BBD"
          output_off: "#778",
          output_on: "#7F7"
          //"#BBD"
        };
        this.default_connection_color_byType = {
          /*number: "#7F7",
          string: "#77F",
          boolean: "#F77",*/
        };
        this.default_connection_color_byTypeOff = {
          /*number: "#474",
          string: "#447",
          boolean: "#744",*/
        };
        this.highquality_render = true;
        this.use_gradients = false;
        this.editor_alpha = 1;
        this.pause_rendering = false;
        this.clear_background = true;
        this.clear_background_color = "#222";
        this.read_only = false;
        this.render_only_selected = true;
        this.live_mode = false;
        this.show_info = true;
        this.allow_dragcanvas = true;
        this.allow_dragnodes = true;
        this.allow_interaction = true;
        this.multi_select = false;
        this.allow_searchbox = true;
        this.allow_reconnect_links = true;
        this.align_to_grid = false;
        this.drag_mode = false;
        this.dragging_rectangle = null;
        this.filter = null;
        this.set_canvas_dirty_on_mouse_event = true;
        this.always_render_background = false;
        this.render_shadows = true;
        this.render_canvas_border = true;
        this.render_connections_shadows = false;
        this.render_connections_border = true;
        this.render_curved_connections = false;
        this.render_connection_arrows = false;
        this.render_collapsed_slots = true;
        this.render_execution_order = false;
        this.render_title_colored = true;
        this.render_link_tooltip = true;
        this.links_render_mode = LiteGraph.SPLINE_LINK;
        this.mouse = [0, 0];
        this.graph_mouse = [0, 0];
        this.canvas_mouse = this.graph_mouse;
        this.onSearchBox = null;
        this.onSearchBoxSelection = null;
        this.onMouse = null;
        this.onDrawBackground = null;
        this.onDrawForeground = null;
        this.onDrawOverlay = null;
        this.onDrawLinkTooltip = null;
        this.onNodeMoved = null;
        this.onSelectionChange = null;
        this.onConnectingChange = null;
        this.onBeforeChange = null;
        this.onAfterChange = null;
        this.connections_width = 3;
        this.round_radius = 8;
        this.current_node = null;
        this.node_widget = null;
        this.over_link_center = null;
        this.last_mouse_position = [0, 0];
        this.visible_area = this.ds.visible_area;
        this.visible_links = [];
        this.viewport = options.viewport || null;
        if (graph) {
          graph.attachCanvas(this);
        }
        this.setCanvas(canvas, options.skip_events);
        this.clear();
        if (!options.skip_render) {
          this.startRendering();
        }
        this.autoresize = options.autoresize;
      }
      global.LGraphCanvas = LiteGraph.LGraphCanvas = LGraphCanvas;
      LGraphCanvas.DEFAULT_BACKGROUND_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII=";
      LGraphCanvas.link_type_colors = {
        "-1": LiteGraph.EVENT_LINK_COLOR,
        number: "#AAA",
        node: "#DCA"
      };
      LGraphCanvas.gradients = {};
      LGraphCanvas.prototype.clear = function() {
        this.frame = 0;
        this.last_draw_time = 0;
        this.render_time = 0;
        this.fps = 0;
        this.dragging_rectangle = null;
        this.selected_nodes = {};
        this.selected_group = null;
        this.visible_nodes = [];
        this.node_dragged = null;
        this.node_over = null;
        this.node_capturing_input = null;
        this.connecting_node = null;
        this.highlighted_links = {};
        this.dragging_canvas = false;
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
        this.dirty_area = null;
        this.node_in_panel = null;
        this.node_widget = null;
        this.last_mouse = [0, 0];
        this.last_mouseclick = 0;
        this.pointer_is_down = false;
        this.pointer_is_double = false;
        this.visible_area.set([0, 0, 0, 0]);
        if (this.onClear) {
          this.onClear();
        }
      };
      LGraphCanvas.prototype.setGraph = function(graph, skip_clear) {
        if (this.graph == graph) {
          return;
        }
        if (!skip_clear) {
          this.clear();
        }
        if (!graph && this.graph) {
          this.graph.detachCanvas(this);
          return;
        }
        graph.attachCanvas(this);
        if (this._graph_stack)
          this._graph_stack = null;
        this.setDirty(true, true);
      };
      LGraphCanvas.prototype.getTopGraph = function() {
        if (this._graph_stack.length)
          return this._graph_stack[0];
        return this.graph;
      };
      LGraphCanvas.prototype.openSubgraph = function(graph) {
        if (!graph) {
          throw "graph cannot be null";
        }
        if (this.graph == graph) {
          throw "graph cannot be the same";
        }
        this.clear();
        if (this.graph) {
          if (!this._graph_stack) {
            this._graph_stack = [];
          }
          this._graph_stack.push(this.graph);
        }
        graph.attachCanvas(this);
        this.checkPanels();
        this.setDirty(true, true);
      };
      LGraphCanvas.prototype.closeSubgraph = function() {
        if (!this._graph_stack || this._graph_stack.length == 0) {
          return;
        }
        var subgraph_node = this.graph._subgraph_node;
        var graph = this._graph_stack.pop();
        this.selected_nodes = {};
        this.highlighted_links = {};
        graph.attachCanvas(this);
        this.setDirty(true, true);
        if (subgraph_node) {
          this.centerOnNode(subgraph_node);
          this.selectNodes([subgraph_node]);
        }
        this.ds.offset = [0, 0];
        this.ds.scale = 1;
      };
      LGraphCanvas.prototype.getCurrentGraph = function() {
        return this.graph;
      };
      LGraphCanvas.prototype.setCanvas = function(canvas, skip_events) {
        if (canvas) {
          if (canvas.constructor === String) {
            canvas = document.getElementById(canvas);
            if (!canvas) {
              throw "Error creating LiteGraph canvas: Canvas not found";
            }
          }
        }
        if (canvas === this.canvas) {
          return;
        }
        if (!canvas && this.canvas) {
          if (!skip_events) {
            this.unbindEvents();
          }
        }
        this.canvas = canvas;
        this.ds.element = canvas;
        if (!canvas) {
          return;
        }
        canvas.className += " lgraphcanvas";
        canvas.data = this;
        canvas.tabindex = "1";
        this.bgcanvas = null;
        if (!this.bgcanvas) {
          this.bgcanvas = document.createElement("canvas");
          this.bgcanvas.width = this.canvas.width;
          this.bgcanvas.height = this.canvas.height;
        }
        if (canvas.getContext == null) {
          if (canvas.localName != "canvas") {
            throw "Element supplied for LGraphCanvas must be a <canvas> element, you passed a " + canvas.localName;
          }
          throw "This browser doesn't support Canvas";
        }
        var ctx = this.ctx = canvas.getContext("2d");
        if (ctx == null) {
          if (!canvas.webgl_enabled) {
            console.warn(
              "This canvas seems to be WebGL, enabling WebGL renderer"
            );
          }
          this.enableWebGL();
        }
        if (!skip_events) {
          this.bindEvents();
        }
      };
      LGraphCanvas.prototype._doNothing = function doNothing(e) {
        e.preventDefault();
        return false;
      };
      LGraphCanvas.prototype._doReturnTrue = function doNothing(e) {
        e.preventDefault();
        return true;
      };
      LGraphCanvas.prototype.bindEvents = function() {
        if (this._events_binded) {
          console.warn("LGraphCanvas: events already binded");
          return;
        }
        var canvas = this.canvas;
        var ref_window2 = this.getCanvasWindow();
        var document2 = ref_window2.document;
        this._mousedown_callback = this.processMouseDown.bind(this);
        this._mousewheel_callback = this.processMouseWheel.bind(this);
        this._mousemove_callback = this.processMouseMove.bind(this);
        this._mouseup_callback = this.processMouseUp.bind(this);
        LiteGraph.pointerListenerAdd(canvas, "down", this._mousedown_callback, true);
        canvas.addEventListener("mousewheel", this._mousewheel_callback, false);
        LiteGraph.pointerListenerAdd(canvas, "up", this._mouseup_callback, true);
        LiteGraph.pointerListenerAdd(canvas, "move", this._mousemove_callback);
        canvas.addEventListener("contextmenu", this._doNothing);
        canvas.addEventListener(
          "DOMMouseScroll",
          this._mousewheel_callback,
          false
        );
        this._key_callback = this.processKey.bind(this);
        canvas.setAttribute("tabindex", 1);
        canvas.addEventListener("keydown", this._key_callback, true);
        document2.addEventListener("keyup", this._key_callback, true);
        this._ondrop_callback = this.processDrop.bind(this);
        canvas.addEventListener("dragover", this._doNothing, false);
        canvas.addEventListener("dragend", this._doNothing, false);
        canvas.addEventListener("drop", this._ondrop_callback, false);
        canvas.addEventListener("dragenter", this._doReturnTrue, false);
        this._events_binded = true;
      };
      LGraphCanvas.prototype.unbindEvents = function() {
        if (!this._events_binded) {
          console.warn("LGraphCanvas: no events binded");
          return;
        }
        var ref_window2 = this.getCanvasWindow();
        var document2 = ref_window2.document;
        LiteGraph.pointerListenerRemove(this.canvas, "move", this._mousedown_callback);
        LiteGraph.pointerListenerRemove(this.canvas, "up", this._mousedown_callback);
        LiteGraph.pointerListenerRemove(this.canvas, "down", this._mousedown_callback);
        this.canvas.removeEventListener(
          "mousewheel",
          this._mousewheel_callback
        );
        this.canvas.removeEventListener(
          "DOMMouseScroll",
          this._mousewheel_callback
        );
        this.canvas.removeEventListener("keydown", this._key_callback);
        document2.removeEventListener("keyup", this._key_callback);
        this.canvas.removeEventListener("contextmenu", this._doNothing);
        this.canvas.removeEventListener("drop", this._ondrop_callback);
        this.canvas.removeEventListener("dragenter", this._doReturnTrue);
        this._mousedown_callback = null;
        this._mousewheel_callback = null;
        this._key_callback = null;
        this._ondrop_callback = null;
        this._events_binded = false;
      };
      LGraphCanvas.getFileExtension = function(url) {
        var question = url.indexOf("?");
        if (question != -1) {
          url = url.substr(0, question);
        }
        var point = url.lastIndexOf(".");
        if (point == -1) {
          return "";
        }
        return url.substr(point + 1).toLowerCase();
      };
      LGraphCanvas.prototype.enableWebGL = function() {
        if (typeof GL === "undefined") {
          throw "litegl.js must be included to use a WebGL canvas";
        }
        if (typeof enableWebGLCanvas === "undefined") {
          throw "webglCanvas.js must be included to use this feature";
        }
        this.gl = this.ctx = enableWebGLCanvas(this.canvas);
        this.ctx.webgl = true;
        this.bgcanvas = this.canvas;
        this.bgctx = this.gl;
        this.canvas.webgl_enabled = true;
      };
      LGraphCanvas.prototype.setDirty = function(fgcanvas, bgcanvas) {
        if (fgcanvas) {
          this.dirty_canvas = true;
        }
        if (bgcanvas) {
          this.dirty_bgcanvas = true;
        }
      };
      LGraphCanvas.prototype.getCanvasWindow = function() {
        if (!this.canvas) {
          return window;
        }
        var doc = this.canvas.ownerDocument;
        return doc.defaultView || doc.parentWindow;
      };
      LGraphCanvas.prototype.startRendering = function() {
        if (this.is_rendering) {
          return;
        }
        this.is_rendering = true;
        renderFrame.call(this);
        function renderFrame() {
          if (!this.pause_rendering) {
            this.draw();
          }
          var window2 = this.getCanvasWindow();
          if (this.is_rendering) {
            window2.requestAnimationFrame(renderFrame.bind(this));
          }
        }
      };
      LGraphCanvas.prototype.stopRendering = function() {
        this.is_rendering = false;
      };
      LGraphCanvas.prototype.blockClick = function() {
        this.block_click = true;
        this.last_mouseclick = 0;
      };
      LGraphCanvas.prototype.processMouseDown = function(e) {
        if (this.set_canvas_dirty_on_mouse_event)
          this.dirty_canvas = true;
        if (!this.graph) {
          return;
        }
        this.adjustMouseEvent(e);
        var ref_window2 = this.getCanvasWindow();
        ref_window2.document;
        LGraphCanvas.active_canvas = this;
        var that2 = this;
        var x2 = e.clientX;
        var y2 = e.clientY;
        this.ds.viewport = this.viewport;
        var is_inside = !this.viewport || this.viewport && x2 >= this.viewport[0] && x2 < this.viewport[0] + this.viewport[2] && y2 >= this.viewport[1] && y2 < this.viewport[1] + this.viewport[3];
        if (!this.options.skip_events) {
          LiteGraph.pointerListenerRemove(this.canvas, "move", this._mousemove_callback);
          LiteGraph.pointerListenerAdd(ref_window2.document, "move", this._mousemove_callback, true);
          LiteGraph.pointerListenerAdd(ref_window2.document, "up", this._mouseup_callback, true);
        }
        if (!is_inside) {
          return;
        }
        var node2 = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes, 5);
        var skip_action = false;
        var now = LiteGraph.getTime();
        var is_primary = e.isPrimary === void 0 || !e.isPrimary;
        var is_double_click = now - this.last_mouseclick < 300 && is_primary;
        this.mouse[0] = e.clientX;
        this.mouse[1] = e.clientY;
        this.graph_mouse[0] = e.canvasX;
        this.graph_mouse[1] = e.canvasY;
        this.last_click_position = [this.mouse[0], this.mouse[1]];
        if (this.pointer_is_down && is_primary) {
          this.pointer_is_double = true;
        } else {
          this.pointer_is_double = false;
        }
        this.pointer_is_down = true;
        this.canvas.focus();
        LiteGraph.closeAllContextMenus(ref_window2);
        if (this.onMouse) {
          if (this.onMouse(e) == true)
            return;
        }
        if (e.which == 1 && !this.pointer_is_double) {
          if (e.ctrlKey) {
            this.dragging_rectangle = new Float32Array(4);
            this.dragging_rectangle[0] = e.canvasX;
            this.dragging_rectangle[1] = e.canvasY;
            this.dragging_rectangle[2] = 1;
            this.dragging_rectangle[3] = 1;
            skip_action = true;
          }
          if (LiteGraph.alt_drag_do_clone_nodes && e.altKey && node2 && this.allow_interaction && !skip_action && !this.read_only) {
            if (cloned = node2.clone()) {
              cloned.pos[0] += 5;
              cloned.pos[1] += 5;
              this.graph.add(cloned, false, { doCalcSize: false });
              node2 = cloned;
              skip_action = true;
              if (!block_drag_node) {
                if (this.allow_dragnodes) {
                  this.graph.beforeChange();
                  this.node_dragged = node2;
                }
                if (!this.selected_nodes[node2.id]) {
                  this.processNodeSelected(node2, e);
                }
              }
            }
          }
          var clicking_canvas_bg = false;
          if (node2 && (this.allow_interaction || node2.flags.allow_interaction) && !skip_action && !this.read_only) {
            if (!this.live_mode && !node2.flags.pinned) {
              this.bringToFront(node2);
            }
            if (this.allow_interaction && !this.connecting_node && !node2.flags.collapsed && !this.live_mode) {
              if (!skip_action && node2.resizable !== false && isInsideRectangle(
                e.canvasX,
                e.canvasY,
                node2.pos[0] + node2.size[0] - 5,
                node2.pos[1] + node2.size[1] - 5,
                10,
                10
              )) {
                this.graph.beforeChange();
                this.resizing_node = node2;
                this.canvas.style.cursor = "se-resize";
                skip_action = true;
              } else {
                if (node2.outputs) {
                  for (var i2 = 0, l = node2.outputs.length; i2 < l; ++i2) {
                    var output = node2.outputs[i2];
                    var link_pos = node2.getConnectionPos(false, i2);
                    if (isInsideRectangle(
                      e.canvasX,
                      e.canvasY,
                      link_pos[0] - 15,
                      link_pos[1] - 10,
                      30,
                      20
                    )) {
                      this.connecting_node = node2;
                      this.connecting_output = output;
                      this.connecting_output.slot_index = i2;
                      this.connecting_pos = node2.getConnectionPos(false, i2);
                      this.connecting_slot = i2;
                      if (LiteGraph.shift_click_do_break_link_from) {
                        if (e.shiftKey) {
                          node2.disconnectOutput(i2);
                        }
                      }
                      if (is_double_click) {
                        if (node2.onOutputDblClick) {
                          node2.onOutputDblClick(i2, e);
                        }
                      } else {
                        if (node2.onOutputClick) {
                          node2.onOutputClick(i2, e);
                        }
                      }
                      skip_action = true;
                      break;
                    }
                  }
                }
                if (node2.inputs) {
                  for (var i2 = 0, l = node2.inputs.length; i2 < l; ++i2) {
                    var input = node2.inputs[i2];
                    var link_pos = node2.getConnectionPos(true, i2);
                    if (isInsideRectangle(
                      e.canvasX,
                      e.canvasY,
                      link_pos[0] - 15,
                      link_pos[1] - 10,
                      30,
                      20
                    )) {
                      if (is_double_click) {
                        if (node2.onInputDblClick) {
                          node2.onInputDblClick(i2, e);
                        }
                      } else {
                        if (node2.onInputClick) {
                          node2.onInputClick(i2, e);
                        }
                      }
                      if (input.link !== null) {
                        var link_info = this.graph.links[input.link];
                        if (LiteGraph.click_do_break_link_to) {
                          node2.disconnectInput(i2);
                          this.dirty_bgcanvas = true;
                          skip_action = true;
                        }
                        if (this.allow_reconnect_links || //this.move_destination_link_without_shift ||
                        e.shiftKey) {
                          if (!LiteGraph.click_do_break_link_to) {
                            node2.disconnectInput(i2);
                          }
                          this.connecting_node = this.graph._nodes_by_id[link_info.origin_id];
                          this.connecting_slot = link_info.origin_slot;
                          this.connecting_output = this.connecting_node.outputs[this.connecting_slot];
                          this.connecting_pos = this.connecting_node.getConnectionPos(false, this.connecting_slot);
                          this.dirty_bgcanvas = true;
                          skip_action = true;
                        }
                      }
                      if (!skip_action) {
                        this.connecting_node = node2;
                        this.connecting_input = input;
                        this.connecting_input.slot_index = i2;
                        this.connecting_pos = node2.getConnectionPos(true, i2);
                        this.connecting_slot = i2;
                        this.dirty_bgcanvas = true;
                        skip_action = true;
                      }
                    }
                  }
                }
              }
            }
            if (!skip_action) {
              var block_drag_node = false;
              var pos2 = [e.canvasX - node2.pos[0], e.canvasY - node2.pos[1]];
              var widget = this.processNodeWidgets(node2, this.graph_mouse, e);
              if (widget) {
                block_drag_node = true;
                this.node_widget = [node2, widget];
              }
              if (this.allow_interaction && is_double_click && this.selected_nodes[node2.id]) {
                if (node2.onDblClick) {
                  node2.onDblClick(e, pos2, this);
                }
                this.processNodeDblClicked(node2);
                block_drag_node = true;
              }
              if (node2.onMouseDown && node2.onMouseDown(e, pos2, this)) {
                block_drag_node = true;
              } else {
                if (node2.subgraph && !node2.skip_subgraph_button) {
                  if (!node2.flags.collapsed && pos2[0] > node2.size[0] - LiteGraph.NODE_TITLE_HEIGHT && pos2[1] < 0) {
                    var that2 = this;
                    setTimeout(function() {
                      that2.openSubgraph(node2.subgraph);
                    }, 10);
                  }
                }
                if (this.live_mode) {
                  clicking_canvas_bg = true;
                  block_drag_node = true;
                }
              }
              if (!block_drag_node) {
                if (this.allow_dragnodes) {
                  this.graph.beforeChange();
                  this.node_dragged = node2;
                }
                this.processNodeSelected(node2, e);
              } else {
                if (!node2.is_selected) this.processNodeSelected(node2, e);
              }
              this.dirty_canvas = true;
            }
          } else {
            if (!skip_action) {
              if (!this.read_only) {
                for (var i2 = 0; i2 < this.visible_links.length; ++i2) {
                  var link = this.visible_links[i2];
                  var center = link._pos;
                  if (!center || e.canvasX < center[0] - 4 || e.canvasX > center[0] + 4 || e.canvasY < center[1] - 4 || e.canvasY > center[1] + 4) {
                    continue;
                  }
                  this.showLinkMenu(link, e);
                  this.over_link_center = null;
                  break;
                }
              }
              this.selected_group = this.graph.getGroupOnPos(e.canvasX, e.canvasY);
              this.selected_group_resizing = false;
              if (this.selected_group && !this.read_only) {
                if (e.ctrlKey) {
                  this.dragging_rectangle = null;
                }
                var dist = distance([e.canvasX, e.canvasY], [this.selected_group.pos[0] + this.selected_group.size[0], this.selected_group.pos[1] + this.selected_group.size[1]]);
                if (dist * this.ds.scale < 10) {
                  this.selected_group_resizing = true;
                } else {
                  this.selected_group.recomputeInsideNodes();
                }
              }
              if (is_double_click && !this.read_only && this.allow_searchbox) {
                this.showSearchBox(e);
                e.preventDefault();
                e.stopPropagation();
              }
              clicking_canvas_bg = true;
            }
          }
          if (!skip_action && clicking_canvas_bg && this.allow_dragcanvas) {
            this.dragging_canvas = true;
          }
        } else if (e.which == 2) {
          if (LiteGraph.middle_click_slot_add_default_node) {
            if (node2 && this.allow_interaction && !skip_action && !this.read_only) {
              if (!this.connecting_node && !node2.flags.collapsed && !this.live_mode) {
                var mClikSlot = false;
                var mClikSlot_index = false;
                var mClikSlot_isOut = false;
                if (node2.outputs) {
                  for (var i2 = 0, l = node2.outputs.length; i2 < l; ++i2) {
                    var output = node2.outputs[i2];
                    var link_pos = node2.getConnectionPos(false, i2);
                    if (isInsideRectangle(e.canvasX, e.canvasY, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
                      mClikSlot = output;
                      mClikSlot_index = i2;
                      mClikSlot_isOut = true;
                      break;
                    }
                  }
                }
                if (node2.inputs) {
                  for (var i2 = 0, l = node2.inputs.length; i2 < l; ++i2) {
                    var input = node2.inputs[i2];
                    var link_pos = node2.getConnectionPos(true, i2);
                    if (isInsideRectangle(e.canvasX, e.canvasY, link_pos[0] - 15, link_pos[1] - 10, 30, 20)) {
                      mClikSlot = input;
                      mClikSlot_index = i2;
                      mClikSlot_isOut = false;
                      break;
                    }
                  }
                }
                if (mClikSlot && mClikSlot_index !== false) {
                  var alphaPosY = 0.5 - (mClikSlot_index + 1) / (mClikSlot_isOut ? node2.outputs.length : node2.inputs.length);
                  var node_bounding = node2.getBounding();
                  var posRef = [
                    !mClikSlot_isOut ? node_bounding[0] : node_bounding[0] + node_bounding[2],
                    e.canvasY - 80
                    // + node_bounding[0]/this.canvas.width*66 // vertical "derive"
                  ];
                  this.createDefaultNodeForSlot({
                    nodeFrom: !mClikSlot_isOut ? null : node2,
                    slotFrom: !mClikSlot_isOut ? null : mClikSlot_index,
                    nodeTo: !mClikSlot_isOut ? node2 : null,
                    slotTo: !mClikSlot_isOut ? mClikSlot_index : null,
                    position: posRef,
                    nodeType: "AUTO",
                    posAdd: [!mClikSlot_isOut ? -30 : 30, -alphaPosY * 130],
                    posSizeFix: [!mClikSlot_isOut ? -1 : 0, 0]
                    //-alphaPosY*2*/
                  });
                }
              }
            }
          } else if (!skip_action && this.allow_dragcanvas) {
            this.dragging_canvas = true;
          }
        } else if (e.which == 3 || this.pointer_is_double) {
          if (this.allow_interaction && !skip_action && !this.read_only) {
            if (node2) {
              if (Object.keys(this.selected_nodes).length && (this.selected_nodes[node2.id] || e.shiftKey || e.ctrlKey || e.metaKey)) {
                if (!this.selected_nodes[node2.id]) this.selectNodes([node2], true);
              } else {
                this.selectNodes([node2]);
              }
            }
            this.processContextMenu(node2, e);
          }
        }
        this.last_mouse[0] = e.clientX;
        this.last_mouse[1] = e.clientY;
        this.last_mouseclick = LiteGraph.getTime();
        this.last_mouse_dragging = true;
        this.graph.change();
        if (!ref_window2.document.activeElement || ref_window2.document.activeElement.nodeName.toLowerCase() != "input" && ref_window2.document.activeElement.nodeName.toLowerCase() != "textarea") {
          e.preventDefault();
        }
        e.stopPropagation();
        if (this.onMouseDown) {
          this.onMouseDown(e);
        }
        return false;
      };
      LGraphCanvas.prototype.processMouseMove = function(e) {
        if (this.autoresize) {
          this.resize();
        }
        if (this.set_canvas_dirty_on_mouse_event)
          this.dirty_canvas = true;
        if (!this.graph) {
          return;
        }
        LGraphCanvas.active_canvas = this;
        this.adjustMouseEvent(e);
        var mouse = [e.clientX, e.clientY];
        this.mouse[0] = mouse[0];
        this.mouse[1] = mouse[1];
        var delta2 = [
          mouse[0] - this.last_mouse[0],
          mouse[1] - this.last_mouse[1]
        ];
        this.last_mouse = mouse;
        this.graph_mouse[0] = e.canvasX;
        this.graph_mouse[1] = e.canvasY;
        if (this.block_click) {
          e.preventDefault();
          return false;
        }
        e.dragging = this.last_mouse_dragging;
        if (this.node_widget) {
          this.processNodeWidgets(
            this.node_widget[0],
            this.graph_mouse,
            e,
            this.node_widget[1]
          );
          this.dirty_canvas = true;
        }
        var node2 = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);
        if (this.dragging_rectangle) {
          this.dragging_rectangle[2] = e.canvasX - this.dragging_rectangle[0];
          this.dragging_rectangle[3] = e.canvasY - this.dragging_rectangle[1];
          this.dirty_canvas = true;
        } else if (this.selected_group && !this.read_only) {
          if (this.selected_group_resizing) {
            this.selected_group.size = [
              e.canvasX - this.selected_group.pos[0],
              e.canvasY - this.selected_group.pos[1]
            ];
          } else {
            var deltax = delta2[0] / this.ds.scale;
            var deltay = delta2[1] / this.ds.scale;
            this.selected_group.move(deltax, deltay, e.ctrlKey);
            if (this.selected_group._nodes.length) {
              this.dirty_canvas = true;
            }
          }
          this.dirty_bgcanvas = true;
        } else if (this.dragging_canvas) {
          this.ds.offset[0] += delta2[0] / this.ds.scale;
          this.ds.offset[1] += delta2[1] / this.ds.scale;
          this.dirty_canvas = true;
          this.dirty_bgcanvas = true;
        } else if ((this.allow_interaction || node2 && node2.flags.allow_interaction) && !this.read_only) {
          if (this.connecting_node) {
            this.dirty_canvas = true;
          }
          for (var i2 = 0, l = this.graph._nodes.length; i2 < l; ++i2) {
            if (this.graph._nodes[i2].mouseOver && node2 != this.graph._nodes[i2]) {
              this.graph._nodes[i2].mouseOver = false;
              if (this.node_over && this.node_over.onMouseLeave) {
                this.node_over.onMouseLeave(e);
              }
              this.node_over = null;
              this.dirty_canvas = true;
            }
          }
          if (node2) {
            if (node2.redraw_on_mouse)
              this.dirty_canvas = true;
            if (!node2.mouseOver) {
              node2.mouseOver = true;
              this.node_over = node2;
              this.dirty_canvas = true;
              if (node2.onMouseEnter) {
                node2.onMouseEnter(e);
              }
            }
            if (node2.onMouseMove) {
              node2.onMouseMove(e, [e.canvasX - node2.pos[0], e.canvasY - node2.pos[1]], this);
            }
            if (this.connecting_node) {
              if (this.connecting_output) {
                var pos2 = this._highlight_input || [0, 0];
                if (this.isOverNodeBox(node2, e.canvasX, e.canvasY)) ;
                else {
                  var slot = this.isOverNodeInput(node2, e.canvasX, e.canvasY, pos2);
                  if (slot != -1 && node2.inputs[slot]) {
                    var slot_type = node2.inputs[slot].type;
                    if (LiteGraph.isValidConnection(this.connecting_output.type, slot_type)) {
                      this._highlight_input = pos2;
                      this._highlight_input_slot = node2.inputs[slot];
                    }
                  } else {
                    this._highlight_input = null;
                    this._highlight_input_slot = null;
                  }
                }
              } else if (this.connecting_input) {
                var pos2 = this._highlight_output || [0, 0];
                if (this.isOverNodeBox(node2, e.canvasX, e.canvasY)) ;
                else {
                  var slot = this.isOverNodeOutput(node2, e.canvasX, e.canvasY, pos2);
                  if (slot != -1 && node2.outputs[slot]) {
                    var slot_type = node2.outputs[slot].type;
                    if (LiteGraph.isValidConnection(this.connecting_input.type, slot_type)) {
                      this._highlight_output = pos2;
                    }
                  } else {
                    this._highlight_output = null;
                  }
                }
              }
            }
            if (this.canvas) {
              if (isInsideRectangle(
                e.canvasX,
                e.canvasY,
                node2.pos[0] + node2.size[0] - 5,
                node2.pos[1] + node2.size[1] - 5,
                5,
                5
              )) {
                this.canvas.style.cursor = "se-resize";
              } else {
                this.canvas.style.cursor = "crosshair";
              }
            }
          } else {
            var over_link = null;
            for (var i2 = 0; i2 < this.visible_links.length; ++i2) {
              var link = this.visible_links[i2];
              var center = link._pos;
              if (!center || e.canvasX < center[0] - 4 || e.canvasX > center[0] + 4 || e.canvasY < center[1] - 4 || e.canvasY > center[1] + 4) {
                continue;
              }
              over_link = link;
              break;
            }
            if (over_link != this.over_link_center) {
              this.over_link_center = over_link;
              this.dirty_canvas = true;
            }
            if (this.canvas) {
              this.canvas.style.cursor = "";
            }
          }
          if (this.node_capturing_input && this.node_capturing_input != node2 && this.node_capturing_input.onMouseMove) {
            this.node_capturing_input.onMouseMove(e, [e.canvasX - this.node_capturing_input.pos[0], e.canvasY - this.node_capturing_input.pos[1]], this);
          }
          if (this.node_dragged && !this.live_mode) {
            for (var i2 in this.selected_nodes) {
              var n = this.selected_nodes[i2];
              n.pos[0] += delta2[0] / this.ds.scale;
              n.pos[1] += delta2[1] / this.ds.scale;
              if (!n.is_selected) this.processNodeSelected(n, e);
            }
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
          }
          if (this.resizing_node && !this.live_mode) {
            var desired_size = [e.canvasX - this.resizing_node.pos[0], e.canvasY - this.resizing_node.pos[1]];
            var min_size = this.resizing_node.computeSize();
            desired_size[0] = Math.max(min_size[0], desired_size[0]);
            desired_size[1] = Math.max(min_size[1], desired_size[1]);
            this.resizing_node.setSize(desired_size);
            this.canvas.style.cursor = "se-resize";
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
          }
        }
        e.preventDefault();
        return false;
      };
      LGraphCanvas.prototype.processMouseUp = function(e) {
        var is_primary = e.isPrimary === void 0 || e.isPrimary;
        if (!is_primary) {
          return false;
        }
        if (this.set_canvas_dirty_on_mouse_event)
          this.dirty_canvas = true;
        if (!this.graph)
          return;
        var window2 = this.getCanvasWindow();
        var document2 = window2.document;
        LGraphCanvas.active_canvas = this;
        if (!this.options.skip_events) {
          LiteGraph.pointerListenerRemove(document2, "move", this._mousemove_callback, true);
          LiteGraph.pointerListenerAdd(this.canvas, "move", this._mousemove_callback, true);
          LiteGraph.pointerListenerRemove(document2, "up", this._mouseup_callback, true);
        }
        this.adjustMouseEvent(e);
        var now = LiteGraph.getTime();
        e.click_time = now - this.last_mouseclick;
        this.last_mouse_dragging = false;
        this.last_click_position = null;
        if (this.block_click) {
          this.block_click = false;
        }
        if (e.which == 1) {
          if (this.node_widget) {
            this.processNodeWidgets(this.node_widget[0], this.graph_mouse, e);
          }
          this.node_widget = null;
          if (this.selected_group) {
            var diffx = this.selected_group.pos[0] - Math.round(this.selected_group.pos[0]);
            var diffy = this.selected_group.pos[1] - Math.round(this.selected_group.pos[1]);
            this.selected_group.move(diffx, diffy, e.ctrlKey);
            this.selected_group.pos[0] = Math.round(
              this.selected_group.pos[0]
            );
            this.selected_group.pos[1] = Math.round(
              this.selected_group.pos[1]
            );
            if (this.selected_group._nodes.length) {
              this.dirty_canvas = true;
            }
            this.selected_group = null;
          }
          this.selected_group_resizing = false;
          var node2 = this.graph.getNodeOnPos(
            e.canvasX,
            e.canvasY,
            this.visible_nodes
          );
          if (this.dragging_rectangle) {
            if (this.graph) {
              var nodes = this.graph._nodes;
              var node_bounding = new Float32Array(4);
              var w2 = Math.abs(this.dragging_rectangle[2]);
              var h = Math.abs(this.dragging_rectangle[3]);
              var startx = this.dragging_rectangle[2] < 0 ? this.dragging_rectangle[0] - w2 : this.dragging_rectangle[0];
              var starty = this.dragging_rectangle[3] < 0 ? this.dragging_rectangle[1] - h : this.dragging_rectangle[1];
              this.dragging_rectangle[0] = startx;
              this.dragging_rectangle[1] = starty;
              this.dragging_rectangle[2] = w2;
              this.dragging_rectangle[3] = h;
              if (!node2 || w2 > 10 && h > 10) {
                var to_select = [];
                for (var i2 = 0; i2 < nodes.length; ++i2) {
                  var nodeX = nodes[i2];
                  nodeX.getBounding(node_bounding);
                  if (!overlapBounding(
                    this.dragging_rectangle,
                    node_bounding
                  )) {
                    continue;
                  }
                  to_select.push(nodeX);
                }
                if (to_select.length) {
                  this.selectNodes(to_select, e.shiftKey);
                }
              } else {
                this.selectNodes([node2], e.shiftKey || e.ctrlKey);
              }
            }
            this.dragging_rectangle = null;
          } else if (this.connecting_node) {
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            var connInOrOut = this.connecting_output || this.connecting_input;
            var connType = connInOrOut.type;
            if (node2) {
              if (this.connecting_output) {
                var slot = this.isOverNodeInput(
                  node2,
                  e.canvasX,
                  e.canvasY
                );
                if (slot != -1) {
                  this.connecting_node.connect(this.connecting_slot, node2, slot);
                } else {
                  this.connecting_node.connectByType(this.connecting_slot, node2, connType);
                }
              } else if (this.connecting_input) {
                var slot = this.isOverNodeOutput(
                  node2,
                  e.canvasX,
                  e.canvasY
                );
                if (slot != -1) {
                  node2.connect(slot, this.connecting_node, this.connecting_slot);
                } else {
                  this.connecting_node.connectByTypeOutput(this.connecting_slot, node2, connType);
                }
              }
            } else {
              if (LiteGraph.release_link_on_empty_shows_menu) {
                if (e.shiftKey && this.allow_searchbox) {
                  if (this.connecting_output) {
                    this.showSearchBox(e, { node_from: this.connecting_node, slot_from: this.connecting_output, type_filter_in: this.connecting_output.type });
                  } else if (this.connecting_input) {
                    this.showSearchBox(e, { node_to: this.connecting_node, slot_from: this.connecting_input, type_filter_out: this.connecting_input.type });
                  }
                } else {
                  if (this.connecting_output) {
                    this.showConnectionMenu({ nodeFrom: this.connecting_node, slotFrom: this.connecting_output, e });
                  } else if (this.connecting_input) {
                    this.showConnectionMenu({ nodeTo: this.connecting_node, slotTo: this.connecting_input, e });
                  }
                }
              }
            }
            this.connecting_output = null;
            this.connecting_input = null;
            this.connecting_pos = null;
            this.connecting_node = null;
            this.connecting_slot = -1;
          } else if (this.resizing_node) {
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            this.graph.afterChange(this.resizing_node);
            this.resizing_node = null;
          } else if (this.node_dragged) {
            var node2 = this.node_dragged;
            if (node2 && e.click_time < 300 && isInsideRectangle(e.canvasX, e.canvasY, node2.pos[0], node2.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT)) {
              node2.collapse();
            }
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
            this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
            if (this.graph.config.align_to_grid || this.align_to_grid) {
              this.node_dragged.alignToGrid();
            }
            if (this.onNodeMoved)
              this.onNodeMoved(this.node_dragged);
            this.graph.afterChange(this.node_dragged);
            this.node_dragged = null;
          } else {
            var node2 = this.graph.getNodeOnPos(
              e.canvasX,
              e.canvasY,
              this.visible_nodes
            );
            if (!node2 && e.click_time < 300) {
              this.deselectAllNodes();
            }
            this.dirty_canvas = true;
            this.dragging_canvas = false;
            if (this.node_over && this.node_over.onMouseUp) {
              this.node_over.onMouseUp(e, [e.canvasX - this.node_over.pos[0], e.canvasY - this.node_over.pos[1]], this);
            }
            if (this.node_capturing_input && this.node_capturing_input.onMouseUp) {
              this.node_capturing_input.onMouseUp(e, [
                e.canvasX - this.node_capturing_input.pos[0],
                e.canvasY - this.node_capturing_input.pos[1]
              ]);
            }
          }
        } else if (e.which == 2) {
          this.dirty_canvas = true;
          this.dragging_canvas = false;
        } else if (e.which == 3) {
          this.dirty_canvas = true;
          this.dragging_canvas = false;
        }
        if (is_primary) {
          this.pointer_is_down = false;
          this.pointer_is_double = false;
        }
        this.graph.change();
        e.stopPropagation();
        e.preventDefault();
        return false;
      };
      LGraphCanvas.prototype.processMouseWheel = function(e) {
        if (!this.graph || !this.allow_dragcanvas) {
          return;
        }
        var delta2 = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;
        this.adjustMouseEvent(e);
        var x2 = e.clientX;
        var y2 = e.clientY;
        var is_inside = !this.viewport || this.viewport && x2 >= this.viewport[0] && x2 < this.viewport[0] + this.viewport[2] && y2 >= this.viewport[1] && y2 < this.viewport[1] + this.viewport[3];
        if (!is_inside)
          return;
        var scale = this.ds.scale;
        if (delta2 > 0) {
          scale *= 1.1;
        } else if (delta2 < 0) {
          scale *= 1 / 1.1;
        }
        this.ds.changeScale(scale, [e.clientX, e.clientY]);
        this.graph.change();
        e.preventDefault();
        return false;
      };
      LGraphCanvas.prototype.isOverNodeBox = function(node2, canvasx, canvasy) {
        var title_height = LiteGraph.NODE_TITLE_HEIGHT;
        if (isInsideRectangle(
          canvasx,
          canvasy,
          node2.pos[0] + 2,
          node2.pos[1] + 2 - title_height,
          title_height - 4,
          title_height - 4
        )) {
          return true;
        }
        return false;
      };
      LGraphCanvas.prototype.isOverNodeInput = function(node2, canvasx, canvasy, slot_pos) {
        if (node2.inputs) {
          for (var i2 = 0, l = node2.inputs.length; i2 < l; ++i2) {
            node2.inputs[i2];
            var link_pos = node2.getConnectionPos(true, i2);
            var is_inside = false;
            if (node2.horizontal) {
              is_inside = isInsideRectangle(
                canvasx,
                canvasy,
                link_pos[0] - 5,
                link_pos[1] - 10,
                10,
                20
              );
            } else {
              is_inside = isInsideRectangle(
                canvasx,
                canvasy,
                link_pos[0] - 10,
                link_pos[1] - 5,
                40,
                10
              );
            }
            if (is_inside) {
              if (slot_pos) {
                slot_pos[0] = link_pos[0];
                slot_pos[1] = link_pos[1];
              }
              return i2;
            }
          }
        }
        return -1;
      };
      LGraphCanvas.prototype.isOverNodeOutput = function(node2, canvasx, canvasy, slot_pos) {
        if (node2.outputs) {
          for (var i2 = 0, l = node2.outputs.length; i2 < l; ++i2) {
            node2.outputs[i2];
            var link_pos = node2.getConnectionPos(false, i2);
            var is_inside = false;
            if (node2.horizontal) {
              is_inside = isInsideRectangle(
                canvasx,
                canvasy,
                link_pos[0] - 5,
                link_pos[1] - 10,
                10,
                20
              );
            } else {
              is_inside = isInsideRectangle(
                canvasx,
                canvasy,
                link_pos[0] - 10,
                link_pos[1] - 5,
                40,
                10
              );
            }
            if (is_inside) {
              if (slot_pos) {
                slot_pos[0] = link_pos[0];
                slot_pos[1] = link_pos[1];
              }
              return i2;
            }
          }
        }
        return -1;
      };
      LGraphCanvas.prototype.processKey = function(e) {
        if (!this.graph) {
          return;
        }
        var block_default = false;
        if (e.target.localName == "input") {
          return;
        }
        if (e.type == "keydown") {
          if (e.keyCode == 32) {
            this.dragging_canvas = true;
            block_default = true;
          }
          if (e.keyCode == 27) {
            if (this.node_panel) this.node_panel.close();
            if (this.options_panel) this.options_panel.close();
            block_default = true;
          }
          if (e.keyCode == 65 && e.ctrlKey) {
            this.selectNodes();
            block_default = true;
          }
          if (e.keyCode === 67 && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
            if (this.selected_nodes) {
              this.copyToClipboard();
              block_default = true;
            }
          }
          if (e.keyCode === 86 && (e.metaKey || e.ctrlKey)) {
            this.pasteFromClipboard(e.shiftKey);
          }
          if (e.keyCode == 46 || e.keyCode == 8) {
            if (e.target.localName != "input" && e.target.localName != "textarea") {
              this.deleteSelectedNodes();
              block_default = true;
            }
          }
          if (this.selected_nodes) {
            for (var i2 in this.selected_nodes) {
              if (this.selected_nodes[i2].onKeyDown) {
                this.selected_nodes[i2].onKeyDown(e);
              }
            }
          }
        } else if (e.type == "keyup") {
          if (e.keyCode == 32) {
            this.dragging_canvas = false;
          }
          if (this.selected_nodes) {
            for (var i2 in this.selected_nodes) {
              if (this.selected_nodes[i2].onKeyUp) {
                this.selected_nodes[i2].onKeyUp(e);
              }
            }
          }
        }
        this.graph.change();
        if (block_default) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
      };
      LGraphCanvas.prototype.copyToClipboard = function() {
        var clipboard_info = {
          nodes: [],
          links: []
        };
        var index2 = 0;
        var selected_nodes_array = [];
        for (var i2 in this.selected_nodes) {
          var node2 = this.selected_nodes[i2];
          if (node2.clonable === false)
            continue;
          node2._relative_id = index2;
          selected_nodes_array.push(node2);
          index2 += 1;
        }
        for (var i2 = 0; i2 < selected_nodes_array.length; ++i2) {
          var node2 = selected_nodes_array[i2];
          if (node2.clonable === false)
            continue;
          var cloned2 = node2.clone();
          if (!cloned2) {
            console.warn("node type not found: " + node2.type);
            continue;
          }
          clipboard_info.nodes.push(cloned2.serialize());
          if (node2.inputs && node2.inputs.length) {
            for (var j = 0; j < node2.inputs.length; ++j) {
              var input = node2.inputs[j];
              if (!input || input.link == null) {
                continue;
              }
              var link_info = this.graph.links[input.link];
              if (!link_info) {
                continue;
              }
              var target_node = this.graph.getNodeById(
                link_info.origin_id
              );
              if (!target_node) {
                continue;
              }
              clipboard_info.links.push([
                target_node._relative_id,
                link_info.origin_slot,
                //j,
                node2._relative_id,
                link_info.target_slot,
                target_node.id
              ]);
            }
          }
        }
        localStorage.setItem(
          "litegrapheditor_clipboard",
          JSON.stringify(clipboard_info)
        );
      };
      LGraphCanvas.prototype.pasteFromClipboard = function(isConnectUnselected = false) {
        if (!LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && isConnectUnselected) {
          return;
        }
        var data = localStorage.getItem("litegrapheditor_clipboard");
        if (!data) {
          return;
        }
        this.graph.beforeChange();
        var clipboard_info = JSON.parse(data);
        var posMin = false;
        var posMinIndexes = false;
        for (var i2 = 0; i2 < clipboard_info.nodes.length; ++i2) {
          if (posMin) {
            if (posMin[0] > clipboard_info.nodes[i2].pos[0]) {
              posMin[0] = clipboard_info.nodes[i2].pos[0];
              posMinIndexes[0] = i2;
            }
            if (posMin[1] > clipboard_info.nodes[i2].pos[1]) {
              posMin[1] = clipboard_info.nodes[i2].pos[1];
              posMinIndexes[1] = i2;
            }
          } else {
            posMin = [clipboard_info.nodes[i2].pos[0], clipboard_info.nodes[i2].pos[1]];
            posMinIndexes = [i2, i2];
          }
        }
        var nodes = [];
        for (var i2 = 0; i2 < clipboard_info.nodes.length; ++i2) {
          var node_data = clipboard_info.nodes[i2];
          var node2 = LiteGraph.createNode(node_data.type);
          if (node2) {
            node2.configure(node_data);
            node2.pos[0] += this.graph_mouse[0] - posMin[0];
            node2.pos[1] += this.graph_mouse[1] - posMin[1];
            this.graph.add(node2, { doProcessChange: false });
            nodes.push(node2);
          }
        }
        for (var i2 = 0; i2 < clipboard_info.links.length; ++i2) {
          var link_info = clipboard_info.links[i2];
          var origin_node;
          var origin_node_relative_id = link_info[0];
          if (origin_node_relative_id != null) {
            origin_node = nodes[origin_node_relative_id];
          } else if (LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && isConnectUnselected) {
            var origin_node_id = link_info[4];
            if (origin_node_id) {
              origin_node = this.graph.getNodeById(origin_node_id);
            }
          }
          var target_node = nodes[link_info[2]];
          if (origin_node && target_node)
            origin_node.connect(link_info[1], target_node, link_info[3]);
          else
            console.warn("Warning, nodes missing on pasting");
        }
        this.selectNodes(nodes);
        this.graph.afterChange();
      };
      LGraphCanvas.prototype.processDrop = function(e) {
        e.preventDefault();
        this.adjustMouseEvent(e);
        var x2 = e.clientX;
        var y2 = e.clientY;
        var is_inside = !this.viewport || this.viewport && x2 >= this.viewport[0] && x2 < this.viewport[0] + this.viewport[2] && y2 >= this.viewport[1] && y2 < this.viewport[1] + this.viewport[3];
        if (!is_inside) {
          return;
        }
        var pos2 = [e.canvasX, e.canvasY];
        var node2 = this.graph ? this.graph.getNodeOnPos(pos2[0], pos2[1]) : null;
        if (!node2) {
          var r = null;
          if (this.onDropItem) {
            r = this.onDropItem(event);
          }
          if (!r) {
            this.checkDropItem(e);
          }
          return;
        }
        if (node2.onDropFile || node2.onDropData) {
          var files = e.dataTransfer.files;
          if (files && files.length) {
            for (var i2 = 0; i2 < files.length; i2++) {
              var file = e.dataTransfer.files[0];
              var filename = file.name;
              LGraphCanvas.getFileExtension(filename);
              if (node2.onDropFile) {
                node2.onDropFile(file);
              }
              if (node2.onDropData) {
                var reader = new FileReader();
                reader.onload = function(event2) {
                  var data = event2.target.result;
                  node2.onDropData(data, filename, file);
                };
                var type = file.type.split("/")[0];
                if (type == "text" || type == "") {
                  reader.readAsText(file);
                } else if (type == "image") {
                  reader.readAsDataURL(file);
                } else {
                  reader.readAsArrayBuffer(file);
                }
              }
            }
          }
        }
        if (node2.onDropItem) {
          if (node2.onDropItem(event)) {
            return true;
          }
        }
        if (this.onDropItem) {
          return this.onDropItem(event);
        }
        return false;
      };
      LGraphCanvas.prototype.checkDropItem = function(e) {
        if (e.dataTransfer.files.length) {
          var file = e.dataTransfer.files[0];
          var ext = LGraphCanvas.getFileExtension(file.name).toLowerCase();
          var nodetype = LiteGraph.node_types_by_file_extension[ext];
          if (nodetype) {
            this.graph.beforeChange();
            var node2 = LiteGraph.createNode(nodetype.type);
            node2.pos = [e.canvasX, e.canvasY];
            this.graph.add(node2);
            if (node2.onDropFile) {
              node2.onDropFile(file);
            }
            this.graph.afterChange();
          }
        }
      };
      LGraphCanvas.prototype.processNodeDblClicked = function(n) {
        if (this.onShowNodePanel) {
          this.onShowNodePanel(n);
        } else {
          this.showShowNodePanel(n);
        }
        if (this.onNodeDblClicked) {
          this.onNodeDblClicked(n);
        }
        this.setDirty(true);
      };
      LGraphCanvas.prototype.processNodeSelected = function(node2, e) {
        this.selectNode(node2, e && (e.shiftKey || e.ctrlKey || this.multi_select));
        if (this.onNodeSelected) {
          this.onNodeSelected(node2);
        }
      };
      LGraphCanvas.prototype.selectNode = function(node2, add_to_current_selection) {
        if (node2 == null) {
          this.deselectAllNodes();
        } else {
          this.selectNodes([node2], add_to_current_selection);
        }
      };
      LGraphCanvas.prototype.selectNodes = function(nodes, add_to_current_selection) {
        if (!add_to_current_selection) {
          this.deselectAllNodes();
        }
        nodes = nodes || this.graph._nodes;
        if (typeof nodes == "string") nodes = [nodes];
        for (var i2 in nodes) {
          var node2 = nodes[i2];
          if (node2.is_selected) {
            this.deselectNode(node2);
            continue;
          }
          if (!node2.is_selected && node2.onSelected) {
            node2.onSelected();
          }
          node2.is_selected = true;
          this.selected_nodes[node2.id] = node2;
          if (node2.inputs) {
            for (var j = 0; j < node2.inputs.length; ++j) {
              this.highlighted_links[node2.inputs[j].link] = true;
            }
          }
          if (node2.outputs) {
            for (var j = 0; j < node2.outputs.length; ++j) {
              var out = node2.outputs[j];
              if (out.links) {
                for (var k = 0; k < out.links.length; ++k) {
                  this.highlighted_links[out.links[k]] = true;
                }
              }
            }
          }
        }
        if (this.onSelectionChange)
          this.onSelectionChange(this.selected_nodes);
        this.setDirty(true);
      };
      LGraphCanvas.prototype.deselectNode = function(node2) {
        if (!node2.is_selected) {
          return;
        }
        if (node2.onDeselected) {
          node2.onDeselected();
        }
        node2.is_selected = false;
        if (this.onNodeDeselected) {
          this.onNodeDeselected(node2);
        }
        if (node2.inputs) {
          for (var i2 = 0; i2 < node2.inputs.length; ++i2) {
            delete this.highlighted_links[node2.inputs[i2].link];
          }
        }
        if (node2.outputs) {
          for (var i2 = 0; i2 < node2.outputs.length; ++i2) {
            var out = node2.outputs[i2];
            if (out.links) {
              for (var j = 0; j < out.links.length; ++j) {
                delete this.highlighted_links[out.links[j]];
              }
            }
          }
        }
      };
      LGraphCanvas.prototype.deselectAllNodes = function() {
        if (!this.graph) {
          return;
        }
        var nodes = this.graph._nodes;
        for (var i2 = 0, l = nodes.length; i2 < l; ++i2) {
          var node2 = nodes[i2];
          if (!node2.is_selected) {
            continue;
          }
          if (node2.onDeselected) {
            node2.onDeselected();
          }
          node2.is_selected = false;
          if (this.onNodeDeselected) {
            this.onNodeDeselected(node2);
          }
        }
        this.selected_nodes = {};
        this.current_node = null;
        this.highlighted_links = {};
        if (this.onSelectionChange)
          this.onSelectionChange(this.selected_nodes);
        this.setDirty(true);
      };
      LGraphCanvas.prototype.deleteSelectedNodes = function() {
        this.graph.beforeChange();
        for (var i2 in this.selected_nodes) {
          var node2 = this.selected_nodes[i2];
          if (node2.block_delete)
            continue;
          if (node2.inputs && node2.inputs.length && node2.outputs && node2.outputs.length && LiteGraph.isValidConnection(node2.inputs[0].type, node2.outputs[0].type) && node2.inputs[0].link && node2.outputs[0].links && node2.outputs[0].links.length) {
            var input_link = node2.graph.links[node2.inputs[0].link];
            var output_link = node2.graph.links[node2.outputs[0].links[0]];
            var input_node = node2.getInputNode(0);
            var output_node = node2.getOutputNodes(0)[0];
            if (input_node && output_node)
              input_node.connect(input_link.origin_slot, output_node, output_link.target_slot);
          }
          this.graph.remove(node2);
          if (this.onNodeDeselected) {
            this.onNodeDeselected(node2);
          }
        }
        this.selected_nodes = {};
        this.current_node = null;
        this.highlighted_links = {};
        this.setDirty(true);
        this.graph.afterChange();
      };
      LGraphCanvas.prototype.centerOnNode = function(node2) {
        this.ds.offset[0] = -node2.pos[0] - node2.size[0] * 0.5 + this.canvas.width * 0.5 / this.ds.scale;
        this.ds.offset[1] = -node2.pos[1] - node2.size[1] * 0.5 + this.canvas.height * 0.5 / this.ds.scale;
        this.setDirty(true, true);
      };
      LGraphCanvas.prototype.adjustMouseEvent = function(e) {
        var clientX_rel = 0;
        var clientY_rel = 0;
        if (this.canvas) {
          var b = this.canvas.getBoundingClientRect();
          clientX_rel = e.clientX - b.left;
          clientY_rel = e.clientY - b.top;
        } else {
          clientX_rel = e.clientX;
          clientY_rel = e.clientY;
        }
        this.last_mouse_position[0] = clientX_rel;
        this.last_mouse_position[1] = clientY_rel;
        e.canvasX = clientX_rel / this.ds.scale - this.ds.offset[0];
        e.canvasY = clientY_rel / this.ds.scale - this.ds.offset[1];
      };
      LGraphCanvas.prototype.setZoom = function(value, zooming_center) {
        this.ds.changeScale(value, zooming_center);
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
      };
      LGraphCanvas.prototype.convertOffsetToCanvas = function(pos2, out) {
        return this.ds.convertOffsetToCanvas(pos2, out);
      };
      LGraphCanvas.prototype.convertCanvasToOffset = function(pos2, out) {
        return this.ds.convertCanvasToOffset(pos2, out);
      };
      LGraphCanvas.prototype.convertEventToCanvasOffset = function(e) {
        var rect = this.canvas.getBoundingClientRect();
        return this.convertCanvasToOffset([
          e.clientX - rect.left,
          e.clientY - rect.top
        ]);
      };
      LGraphCanvas.prototype.bringToFront = function(node2) {
        var i2 = this.graph._nodes.indexOf(node2);
        if (i2 == -1) {
          return;
        }
        this.graph._nodes.splice(i2, 1);
        this.graph._nodes.push(node2);
      };
      LGraphCanvas.prototype.sendToBack = function(node2) {
        var i2 = this.graph._nodes.indexOf(node2);
        if (i2 == -1) {
          return;
        }
        this.graph._nodes.splice(i2, 1);
        this.graph._nodes.unshift(node2);
      };
      var temp = new Float32Array(4);
      LGraphCanvas.prototype.computeVisibleNodes = function(nodes, out) {
        var visible_nodes = out || [];
        visible_nodes.length = 0;
        nodes = nodes || this.graph._nodes;
        for (var i2 = 0, l = nodes.length; i2 < l; ++i2) {
          var n = nodes[i2];
          if (this.live_mode && !n.onDrawBackground && !n.onDrawForeground) {
            continue;
          }
          if (!overlapBounding(this.visible_area, n.getBounding(temp, true))) {
            continue;
          }
          visible_nodes.push(n);
        }
        return visible_nodes;
      };
      LGraphCanvas.prototype.draw = function(force_canvas, force_bgcanvas) {
        if (!this.canvas || this.canvas.width == 0 || this.canvas.height == 0) {
          return;
        }
        var now = LiteGraph.getTime();
        this.render_time = (now - this.last_draw_time) * 1e-3;
        this.last_draw_time = now;
        if (this.graph) {
          this.ds.computeVisibleArea(this.viewport);
        }
        if (this.dirty_bgcanvas || force_bgcanvas || this.always_render_background || this.graph && this.graph._last_trigger_time && now - this.graph._last_trigger_time < 1e3) {
          this.drawBackCanvas();
        }
        if (this.dirty_canvas || force_canvas) {
          this.drawFrontCanvas();
        }
        this.fps = this.render_time ? 1 / this.render_time : 0;
        this.frame += 1;
      };
      LGraphCanvas.prototype.drawFrontCanvas = function() {
        this.dirty_canvas = false;
        if (!this.ctx) {
          this.ctx = this.bgcanvas.getContext("2d");
        }
        var ctx = this.ctx;
        if (!ctx) {
          return;
        }
        var canvas = this.canvas;
        if (ctx.start2D && !this.viewport) {
          ctx.start2D();
          ctx.restore();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        var area = this.viewport || this.dirty_area;
        if (area) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(area[0], area[1], area[2], area[3]);
          ctx.clip();
        }
        if (this.clear_background) {
          if (area)
            ctx.clearRect(area[0], area[1], area[2], area[3]);
          else
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (this.bgcanvas == this.canvas) {
          this.drawBackCanvas();
        } else {
          ctx.drawImage(this.bgcanvas, 0, 0);
        }
        if (this.onRender) {
          this.onRender(canvas, ctx);
        }
        if (this.show_info) {
          this.renderInfo(ctx, area ? area[0] : 0, area ? area[1] : 0);
        }
        if (this.graph) {
          ctx.save();
          this.ds.toCanvasContext(ctx);
          var visible_nodes = this.computeVisibleNodes(
            null,
            this.visible_nodes
          );
          for (var i2 = 0; i2 < visible_nodes.length; ++i2) {
            var node2 = visible_nodes[i2];
            ctx.save();
            ctx.translate(node2.pos[0], node2.pos[1]);
            this.drawNode(node2, ctx);
            ctx.restore();
          }
          if (this.render_execution_order) {
            this.drawExecutionOrder(ctx);
          }
          if (this.graph.config.links_ontop) {
            if (!this.live_mode) {
              this.drawConnections(ctx);
            }
          }
          if (this.connecting_pos != null) {
            ctx.lineWidth = this.connections_width;
            var link_color = null;
            var connInOrOut = this.connecting_output || this.connecting_input;
            var connType = connInOrOut.type;
            var connDir = connInOrOut.dir;
            if (connDir == null) {
              if (this.connecting_output)
                connDir = this.connecting_node.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT;
              else
                connDir = this.connecting_node.horizontal ? LiteGraph.UP : LiteGraph.LEFT;
            }
            var connShape = connInOrOut.shape;
            switch (connType) {
              case LiteGraph.EVENT:
                link_color = LiteGraph.EVENT_LINK_COLOR;
                break;
              default:
                link_color = LiteGraph.CONNECTING_LINK_COLOR;
            }
            this.renderLink(
              ctx,
              this.connecting_pos,
              [this.graph_mouse[0], this.graph_mouse[1]],
              null,
              false,
              null,
              link_color,
              connDir,
              LiteGraph.CENTER
            );
            ctx.beginPath();
            if (connType === LiteGraph.EVENT || connShape === LiteGraph.BOX_SHAPE) {
              ctx.rect(
                this.connecting_pos[0] - 6 + 0.5,
                this.connecting_pos[1] - 5 + 0.5,
                14,
                10
              );
              ctx.fill();
              ctx.beginPath();
              ctx.rect(
                this.graph_mouse[0] - 6 + 0.5,
                this.graph_mouse[1] - 5 + 0.5,
                14,
                10
              );
            } else if (connShape === LiteGraph.ARROW_SHAPE) {
              ctx.moveTo(this.connecting_pos[0] + 8, this.connecting_pos[1] + 0.5);
              ctx.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] + 6 + 0.5);
              ctx.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] - 6 + 0.5);
              ctx.closePath();
            } else {
              ctx.arc(
                this.connecting_pos[0],
                this.connecting_pos[1],
                4,
                0,
                Math.PI * 2
              );
              ctx.fill();
              ctx.beginPath();
              ctx.arc(
                this.graph_mouse[0],
                this.graph_mouse[1],
                4,
                0,
                Math.PI * 2
              );
            }
            ctx.fill();
            ctx.fillStyle = "#ffcc00";
            if (this._highlight_input) {
              ctx.beginPath();
              var shape = this._highlight_input_slot.shape;
              if (shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(this._highlight_input[0] + 8, this._highlight_input[1] + 0.5);
                ctx.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] + 6 + 0.5);
                ctx.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] - 6 + 0.5);
                ctx.closePath();
              } else {
                ctx.arc(
                  this._highlight_input[0],
                  this._highlight_input[1],
                  6,
                  0,
                  Math.PI * 2
                );
              }
              ctx.fill();
            }
            if (this._highlight_output) {
              ctx.beginPath();
              if (shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(this._highlight_output[0] + 8, this._highlight_output[1] + 0.5);
                ctx.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] + 6 + 0.5);
                ctx.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] - 6 + 0.5);
                ctx.closePath();
              } else {
                ctx.arc(
                  this._highlight_output[0],
                  this._highlight_output[1],
                  6,
                  0,
                  Math.PI * 2
                );
              }
              ctx.fill();
            }
          }
          if (this.dragging_rectangle) {
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(
              this.dragging_rectangle[0],
              this.dragging_rectangle[1],
              this.dragging_rectangle[2],
              this.dragging_rectangle[3]
            );
          }
          if (this.over_link_center && this.render_link_tooltip)
            this.drawLinkTooltip(ctx, this.over_link_center);
          else if (this.onDrawLinkTooltip)
            this.onDrawLinkTooltip(ctx, null);
          if (this.onDrawForeground) {
            this.onDrawForeground(ctx, this.visible_rect);
          }
          ctx.restore();
        }
        if (this._graph_stack && this._graph_stack.length) {
          this.drawSubgraphPanel(ctx);
        }
        if (this.onDrawOverlay) {
          this.onDrawOverlay(ctx);
        }
        if (area) {
          ctx.restore();
        }
        if (ctx.finish2D) {
          ctx.finish2D();
        }
      };
      LGraphCanvas.prototype.drawSubgraphPanel = function(ctx) {
        var subgraph = this.graph;
        var subnode = subgraph._subgraph_node;
        if (!subnode) {
          console.warn("subgraph without subnode");
          return;
        }
        this.drawSubgraphPanelLeft(subgraph, subnode, ctx);
        this.drawSubgraphPanelRight(subgraph, subnode, ctx);
      };
      LGraphCanvas.prototype.drawSubgraphPanelLeft = function(subgraph, subnode, ctx) {
        var num = subnode.inputs ? subnode.inputs.length : 0;
        var w2 = 200;
        var h = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
        ctx.fillStyle = "#111";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.roundRect(10, 10, w2, (num + 1) * h + 50, [8]);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#888";
        ctx.font = "14px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Graph Inputs", 20, 34);
        if (this.drawButton(w2 - 20, 20, 20, 20, "X", "#151515")) {
          this.closeSubgraph();
          return;
        }
        var y2 = 50;
        ctx.font = "14px Arial";
        if (subnode.inputs)
          for (var i2 = 0; i2 < subnode.inputs.length; ++i2) {
            var input = subnode.inputs[i2];
            if (input.not_subgraph_input)
              continue;
            if (this.drawButton(20, y2 + 2, w2 - 20, h - 2)) {
              var type = subnode.constructor.input_node_type || "graph/input";
              this.graph.beforeChange();
              var newnode = LiteGraph.createNode(type);
              if (newnode) {
                subgraph.add(newnode);
                this.block_click = false;
                this.last_click_position = null;
                this.selectNodes([newnode]);
                this.node_dragged = newnode;
                this.dragging_canvas = false;
                newnode.setProperty("name", input.name);
                newnode.setProperty("type", input.type);
                this.node_dragged.pos[0] = this.graph_mouse[0] - 5;
                this.node_dragged.pos[1] = this.graph_mouse[1] - 5;
                this.graph.afterChange();
              } else
                console.error("graph input node not found:", type);
            }
            ctx.fillStyle = "#9C9";
            ctx.beginPath();
            ctx.arc(w2 - 16, y2 + h * 0.5, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#AAA";
            ctx.fillText(input.name, 30, y2 + h * 0.75);
            ctx.fillStyle = "#777";
            ctx.fillText(input.type, 130, y2 + h * 0.75);
            y2 += h;
          }
        if (this.drawButton(20, y2 + 2, w2 - 20, h - 2, "+", "#151515", "#222")) {
          this.showSubgraphPropertiesDialog(subnode);
        }
      };
      LGraphCanvas.prototype.drawSubgraphPanelRight = function(subgraph, subnode, ctx) {
        var num = subnode.outputs ? subnode.outputs.length : 0;
        var canvas_w = this.bgcanvas.width;
        var w2 = 200;
        var h = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
        ctx.fillStyle = "#111";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.roundRect(canvas_w - w2 - 10, 10, w2, (num + 1) * h + 50, [8]);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#888";
        ctx.font = "14px Arial";
        ctx.textAlign = "left";
        var title_text = "Graph Outputs";
        var tw = ctx.measureText(title_text).width;
        ctx.fillText(title_text, canvas_w - tw - 20, 34);
        if (this.drawButton(canvas_w - w2, 20, 20, 20, "X", "#151515")) {
          this.closeSubgraph();
          return;
        }
        var y2 = 50;
        ctx.font = "14px Arial";
        if (subnode.outputs)
          for (var i2 = 0; i2 < subnode.outputs.length; ++i2) {
            var output = subnode.outputs[i2];
            if (output.not_subgraph_input)
              continue;
            if (this.drawButton(canvas_w - w2, y2 + 2, w2 - 20, h - 2)) {
              var type = subnode.constructor.output_node_type || "graph/output";
              this.graph.beforeChange();
              var newnode = LiteGraph.createNode(type);
              if (newnode) {
                subgraph.add(newnode);
                this.block_click = false;
                this.last_click_position = null;
                this.selectNodes([newnode]);
                this.node_dragged = newnode;
                this.dragging_canvas = false;
                newnode.setProperty("name", output.name);
                newnode.setProperty("type", output.type);
                this.node_dragged.pos[0] = this.graph_mouse[0] - 5;
                this.node_dragged.pos[1] = this.graph_mouse[1] - 5;
                this.graph.afterChange();
              } else
                console.error("graph input node not found:", type);
            }
            ctx.fillStyle = "#9C9";
            ctx.beginPath();
            ctx.arc(canvas_w - w2 + 16, y2 + h * 0.5, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#AAA";
            ctx.fillText(output.name, canvas_w - w2 + 30, y2 + h * 0.75);
            ctx.fillStyle = "#777";
            ctx.fillText(output.type, canvas_w - w2 + 130, y2 + h * 0.75);
            y2 += h;
          }
        if (this.drawButton(canvas_w - w2, y2 + 2, w2 - 20, h - 2, "+", "#151515", "#222")) {
          this.showSubgraphPropertiesDialogRight(subnode);
        }
      };
      LGraphCanvas.prototype.drawButton = function(x2, y2, w2, h, text, bgcolor, hovercolor, textcolor) {
        var ctx = this.ctx;
        bgcolor = bgcolor || LiteGraph.NODE_DEFAULT_COLOR;
        hovercolor = hovercolor || "#555";
        textcolor = textcolor || LiteGraph.NODE_TEXT_COLOR;
        var pos2 = this.ds.convertOffsetToCanvas(this.graph_mouse);
        var hover = LiteGraph.isInsideRectangle(pos2[0], pos2[1], x2, y2, w2, h);
        pos2 = this.last_click_position ? [this.last_click_position[0], this.last_click_position[1]] : null;
        if (pos2) {
          var rect = this.canvas.getBoundingClientRect();
          pos2[0] -= rect.left;
          pos2[1] -= rect.top;
        }
        var clicked = pos2 && LiteGraph.isInsideRectangle(pos2[0], pos2[1], x2, y2, w2, h);
        ctx.fillStyle = hover ? hovercolor : bgcolor;
        if (clicked)
          ctx.fillStyle = "#AAA";
        ctx.beginPath();
        ctx.roundRect(x2, y2, w2, h, [4]);
        ctx.fill();
        if (text != null) {
          if (text.constructor == String) {
            ctx.fillStyle = textcolor;
            ctx.textAlign = "center";
            ctx.font = (h * 0.65 | 0) + "px Arial";
            ctx.fillText(text, x2 + w2 * 0.5, y2 + h * 0.75);
            ctx.textAlign = "left";
          }
        }
        var was_clicked = clicked && !this.block_click;
        if (clicked)
          this.blockClick();
        return was_clicked;
      };
      LGraphCanvas.prototype.isAreaClicked = function(x2, y2, w2, h, hold_click) {
        var pos2 = this.mouse;
        LiteGraph.isInsideRectangle(pos2[0], pos2[1], x2, y2, w2, h);
        pos2 = this.last_click_position;
        var clicked = pos2 && LiteGraph.isInsideRectangle(pos2[0], pos2[1], x2, y2, w2, h);
        var was_clicked = clicked && !this.block_click;
        if (clicked && hold_click)
          this.blockClick();
        return was_clicked;
      };
      LGraphCanvas.prototype.renderInfo = function(ctx, x2, y2) {
        x2 = x2 || 10;
        y2 = y2 || this.canvas.height - 80;
        ctx.save();
        ctx.translate(x2, y2);
        ctx.font = "10px Arial";
        ctx.fillStyle = "#888";
        ctx.textAlign = "left";
        if (this.graph) {
          ctx.fillText("T: " + this.graph.globaltime.toFixed(2) + "s", 5, 13 * 1);
          ctx.fillText("I: " + this.graph.iteration, 5, 13 * 2);
          ctx.fillText("N: " + this.graph._nodes.length + " [" + this.visible_nodes.length + "]", 5, 13 * 3);
          ctx.fillText("V: " + this.graph._version, 5, 13 * 4);
          ctx.fillText("FPS:" + this.fps.toFixed(2), 5, 13 * 5);
        } else {
          ctx.fillText("No graph selected", 5, 13 * 1);
        }
        ctx.restore();
      };
      LGraphCanvas.prototype.drawBackCanvas = function() {
        var canvas = this.bgcanvas;
        if (canvas.width != this.canvas.width || canvas.height != this.canvas.height) {
          canvas.width = this.canvas.width;
          canvas.height = this.canvas.height;
        }
        if (!this.bgctx) {
          this.bgctx = this.bgcanvas.getContext("2d");
        }
        var ctx = this.bgctx;
        if (ctx.start) {
          ctx.start();
        }
        var viewport = this.viewport || [0, 0, ctx.canvas.width, ctx.canvas.height];
        if (this.clear_background) {
          ctx.clearRect(viewport[0], viewport[1], viewport[2], viewport[3]);
        }
        if (this._graph_stack && this._graph_stack.length) {
          ctx.save();
          this._graph_stack[this._graph_stack.length - 1];
          var subgraph_node = this.graph._subgraph_node;
          ctx.strokeStyle = subgraph_node.bgcolor;
          ctx.lineWidth = 10;
          ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
          ctx.lineWidth = 1;
          ctx.font = "40px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = subgraph_node.bgcolor || "#AAA";
          var title = "";
          for (var i2 = 1; i2 < this._graph_stack.length; ++i2) {
            title += this._graph_stack[i2]._subgraph_node.getTitle() + " >> ";
          }
          ctx.fillText(
            title + subgraph_node.getTitle(),
            canvas.width * 0.5,
            40
          );
          ctx.restore();
        }
        var bg_already_painted = false;
        if (this.onRenderBackground) {
          bg_already_painted = this.onRenderBackground(canvas, ctx);
        }
        if (!this.viewport) {
          ctx.restore();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        this.visible_links.length = 0;
        if (this.graph) {
          ctx.save();
          this.ds.toCanvasContext(ctx);
          if (this.ds.scale < 1.5 && !bg_already_painted && this.clear_background_color) {
            ctx.fillStyle = this.clear_background_color;
            ctx.fillRect(
              this.visible_area[0],
              this.visible_area[1],
              this.visible_area[2],
              this.visible_area[3]
            );
          }
          if (this.background_image && this.ds.scale > 0.5 && !bg_already_painted) {
            if (this.zoom_modify_alpha) {
              ctx.globalAlpha = (1 - 0.5 / this.ds.scale) * this.editor_alpha;
            } else {
              ctx.globalAlpha = this.editor_alpha;
            }
            ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
            if (!this._bg_img || this._bg_img.name != this.background_image) {
              this._bg_img = new Image();
              this._bg_img.name = this.background_image;
              this._bg_img.src = this.background_image;
              var that2 = this;
              this._bg_img.onload = function() {
                that2.draw(true, true);
              };
            }
            var pattern = null;
            if (this._pattern == null && this._bg_img.width > 0) {
              pattern = ctx.createPattern(this._bg_img, "repeat");
              this._pattern_img = this._bg_img;
              this._pattern = pattern;
            } else {
              pattern = this._pattern;
            }
            if (pattern) {
              ctx.fillStyle = pattern;
              ctx.fillRect(
                this.visible_area[0],
                this.visible_area[1],
                this.visible_area[2],
                this.visible_area[3]
              );
              ctx.fillStyle = "transparent";
            }
            ctx.globalAlpha = 1;
            ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = true;
          }
          if (this.graph._groups.length && !this.live_mode) {
            this.drawGroups(canvas, ctx);
          }
          if (this.onDrawBackground) {
            this.onDrawBackground(ctx, this.visible_area);
          }
          if (this.onBackgroundRender) {
            console.error(
              "WARNING! onBackgroundRender deprecated, now is named onDrawBackground "
            );
            this.onBackgroundRender = null;
          }
          if (this.render_canvas_border) {
            ctx.strokeStyle = "#235";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
          }
          if (this.render_connections_shadows) {
            ctx.shadowColor = "#000";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 6;
          } else {
            ctx.shadowColor = "rgba(0,0,0,0)";
          }
          if (!this.live_mode) {
            this.drawConnections(ctx);
          }
          ctx.shadowColor = "rgba(0,0,0,0)";
          ctx.restore();
        }
        if (ctx.finish) {
          ctx.finish();
        }
        this.dirty_bgcanvas = false;
        this.dirty_canvas = true;
      };
      var temp_vec2 = new Float32Array(2);
      LGraphCanvas.prototype.drawNode = function(node2, ctx) {
        this.current_node = node2;
        var color = node2.color || node2.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
        var bgcolor = node2.bgcolor || node2.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
        if (node2.mouseOver) ;
        var low_quality = this.ds.scale < 0.6;
        if (this.live_mode) {
          if (!node2.flags.collapsed) {
            ctx.shadowColor = "transparent";
            if (node2.onDrawForeground) {
              node2.onDrawForeground(ctx, this, this.canvas);
            }
          }
          return;
        }
        var editor_alpha = this.editor_alpha;
        ctx.globalAlpha = editor_alpha;
        if (this.render_shadows && !low_quality) {
          ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
          ctx.shadowOffsetX = 2 * this.ds.scale;
          ctx.shadowOffsetY = 2 * this.ds.scale;
          ctx.shadowBlur = 3 * this.ds.scale;
        } else {
          ctx.shadowColor = "transparent";
        }
        if (node2.flags.collapsed && node2.onDrawCollapsed && node2.onDrawCollapsed(ctx, this) == true) {
          return;
        }
        var shape = node2._shape || LiteGraph.BOX_SHAPE;
        var size = temp_vec2;
        temp_vec2.set(node2.size);
        var horizontal = node2.horizontal;
        if (node2.flags.collapsed) {
          ctx.font = this.inner_text_font;
          var title = node2.getTitle ? node2.getTitle() : node2.title;
          if (title != null) {
            node2._collapsed_width = Math.min(
              node2.size[0],
              ctx.measureText(title).width + LiteGraph.NODE_TITLE_HEIGHT * 2
            );
            size[0] = node2._collapsed_width;
            size[1] = 0;
          }
        }
        if (node2.clip_area) {
          ctx.save();
          ctx.beginPath();
          if (shape == LiteGraph.BOX_SHAPE) {
            ctx.rect(0, 0, size[0], size[1]);
          } else if (shape == LiteGraph.ROUND_SHAPE) {
            ctx.roundRect(0, 0, size[0], size[1], [10]);
          } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
              size[0] * 0.5,
              size[1] * 0.5,
              size[0] * 0.5,
              0,
              Math.PI * 2
            );
          }
          ctx.clip();
        }
        if (node2.has_errors) {
          bgcolor = "red";
        }
        this.drawNodeShape(
          node2,
          ctx,
          size,
          color,
          bgcolor,
          node2.is_selected,
          node2.mouseOver
        );
        ctx.shadowColor = "transparent";
        if (node2.onDrawForeground) {
          node2.onDrawForeground(ctx, this, this.canvas);
        }
        ctx.textAlign = horizontal ? "center" : "left";
        ctx.font = this.inner_text_font;
        var render_text = !low_quality;
        var out_slot = this.connecting_output;
        var in_slot = this.connecting_input;
        ctx.lineWidth = 1;
        var max_y = 0;
        var slot_pos = new Float32Array(2);
        if (!node2.flags.collapsed) {
          if (node2.inputs) {
            for (var i2 = 0; i2 < node2.inputs.length; i2++) {
              var slot = node2.inputs[i2];
              var slot_type = slot.type;
              var slot_shape = slot.shape;
              ctx.globalAlpha = editor_alpha;
              if (this.connecting_output && !LiteGraph.isValidConnection(slot.type, out_slot.type)) {
                ctx.globalAlpha = 0.4 * editor_alpha;
              }
              ctx.fillStyle = slot.link != null ? slot.color_on || this.default_connection_color_byType[slot_type] || this.default_connection_color.input_on : slot.color_off || this.default_connection_color_byTypeOff[slot_type] || this.default_connection_color_byType[slot_type] || this.default_connection_color.input_off;
              var pos2 = node2.getConnectionPos(true, i2, slot_pos);
              pos2[0] -= node2.pos[0];
              pos2[1] -= node2.pos[1];
              if (max_y < pos2[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                max_y = pos2[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
              }
              ctx.beginPath();
              if (slot_type == "array") {
                slot_shape = LiteGraph.GRID_SHAPE;
              }
              var doStroke = true;
              if (slot.type === LiteGraph.EVENT || slot.shape === LiteGraph.BOX_SHAPE) {
                if (horizontal) {
                  ctx.rect(
                    pos2[0] - 5 + 0.5,
                    pos2[1] - 8 + 0.5,
                    10,
                    14
                  );
                } else {
                  ctx.rect(
                    pos2[0] - 6 + 0.5,
                    pos2[1] - 5 + 0.5,
                    14,
                    10
                  );
                }
              } else if (slot_shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(pos2[0] + 8, pos2[1] + 0.5);
                ctx.lineTo(pos2[0] - 4, pos2[1] + 6 + 0.5);
                ctx.lineTo(pos2[0] - 4, pos2[1] - 6 + 0.5);
                ctx.closePath();
              } else if (slot_shape === LiteGraph.GRID_SHAPE) {
                ctx.rect(pos2[0] - 4, pos2[1] - 4, 2, 2);
                ctx.rect(pos2[0] - 1, pos2[1] - 4, 2, 2);
                ctx.rect(pos2[0] + 2, pos2[1] - 4, 2, 2);
                ctx.rect(pos2[0] - 4, pos2[1] - 1, 2, 2);
                ctx.rect(pos2[0] - 1, pos2[1] - 1, 2, 2);
                ctx.rect(pos2[0] + 2, pos2[1] - 1, 2, 2);
                ctx.rect(pos2[0] - 4, pos2[1] + 2, 2, 2);
                ctx.rect(pos2[0] - 1, pos2[1] + 2, 2, 2);
                ctx.rect(pos2[0] + 2, pos2[1] + 2, 2, 2);
                doStroke = false;
              } else {
                if (low_quality)
                  ctx.rect(pos2[0] - 4, pos2[1] - 4, 8, 8);
                else
                  ctx.arc(pos2[0], pos2[1], 4, 0, Math.PI * 2);
              }
              ctx.fill();
              if (render_text) {
                var text = slot.label != null ? slot.label : slot.name;
                if (text) {
                  ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                  if (horizontal || slot.dir == LiteGraph.UP) {
                    ctx.fillText(text, pos2[0], pos2[1] - 10);
                  } else {
                    ctx.fillText(text, pos2[0] + 10, pos2[1] + 5);
                  }
                }
              }
            }
          }
          ctx.textAlign = horizontal ? "center" : "right";
          ctx.strokeStyle = "black";
          if (node2.outputs) {
            for (var i2 = 0; i2 < node2.outputs.length; i2++) {
              var slot = node2.outputs[i2];
              var slot_type = slot.type;
              var slot_shape = slot.shape;
              if (this.connecting_input && !LiteGraph.isValidConnection(slot_type, in_slot.type)) {
                ctx.globalAlpha = 0.4 * editor_alpha;
              }
              var pos2 = node2.getConnectionPos(false, i2, slot_pos);
              pos2[0] -= node2.pos[0];
              pos2[1] -= node2.pos[1];
              if (max_y < pos2[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                max_y = pos2[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
              }
              ctx.fillStyle = slot.links && slot.links.length ? slot.color_on || this.default_connection_color_byType[slot_type] || this.default_connection_color.output_on : slot.color_off || this.default_connection_color_byTypeOff[slot_type] || this.default_connection_color_byType[slot_type] || this.default_connection_color.output_off;
              ctx.beginPath();
              if (slot_type == "array") {
                slot_shape = LiteGraph.GRID_SHAPE;
              }
              var doStroke = true;
              if (slot_type === LiteGraph.EVENT || slot_shape === LiteGraph.BOX_SHAPE) {
                if (horizontal) {
                  ctx.rect(
                    pos2[0] - 5 + 0.5,
                    pos2[1] - 8 + 0.5,
                    10,
                    14
                  );
                } else {
                  ctx.rect(
                    pos2[0] - 6 + 0.5,
                    pos2[1] - 5 + 0.5,
                    14,
                    10
                  );
                }
              } else if (slot_shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(pos2[0] + 8, pos2[1] + 0.5);
                ctx.lineTo(pos2[0] - 4, pos2[1] + 6 + 0.5);
                ctx.lineTo(pos2[0] - 4, pos2[1] - 6 + 0.5);
                ctx.closePath();
              } else if (slot_shape === LiteGraph.GRID_SHAPE) {
                ctx.rect(pos2[0] - 4, pos2[1] - 4, 2, 2);
                ctx.rect(pos2[0] - 1, pos2[1] - 4, 2, 2);
                ctx.rect(pos2[0] + 2, pos2[1] - 4, 2, 2);
                ctx.rect(pos2[0] - 4, pos2[1] - 1, 2, 2);
                ctx.rect(pos2[0] - 1, pos2[1] - 1, 2, 2);
                ctx.rect(pos2[0] + 2, pos2[1] - 1, 2, 2);
                ctx.rect(pos2[0] - 4, pos2[1] + 2, 2, 2);
                ctx.rect(pos2[0] - 1, pos2[1] + 2, 2, 2);
                ctx.rect(pos2[0] + 2, pos2[1] + 2, 2, 2);
                doStroke = false;
              } else {
                if (low_quality)
                  ctx.rect(pos2[0] - 4, pos2[1] - 4, 8, 8);
                else
                  ctx.arc(pos2[0], pos2[1], 4, 0, Math.PI * 2);
              }
              ctx.fill();
              if (!low_quality && doStroke)
                ctx.stroke();
              if (render_text) {
                var text = slot.label != null ? slot.label : slot.name;
                if (text) {
                  ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                  if (horizontal || slot.dir == LiteGraph.DOWN) {
                    ctx.fillText(text, pos2[0], pos2[1] - 8);
                  } else {
                    ctx.fillText(text, pos2[0] - 10, pos2[1] + 5);
                  }
                }
              }
            }
          }
          ctx.textAlign = "left";
          ctx.globalAlpha = 1;
          if (node2.widgets) {
            var widgets_y = max_y;
            if (horizontal || node2.widgets_up) {
              widgets_y = 2;
            }
            if (node2.widgets_start_y != null)
              widgets_y = node2.widgets_start_y;
            this.drawNodeWidgets(
              node2,
              widgets_y,
              ctx,
              this.node_widget && this.node_widget[0] == node2 ? this.node_widget[1] : null
            );
          }
        } else if (this.render_collapsed_slots) {
          var input_slot = null;
          var output_slot = null;
          if (node2.inputs) {
            for (var i2 = 0; i2 < node2.inputs.length; i2++) {
              var slot = node2.inputs[i2];
              if (slot.link == null) {
                continue;
              }
              input_slot = slot;
              break;
            }
          }
          if (node2.outputs) {
            for (var i2 = 0; i2 < node2.outputs.length; i2++) {
              var slot = node2.outputs[i2];
              if (!slot.links || !slot.links.length) {
                continue;
              }
              output_slot = slot;
            }
          }
          if (input_slot) {
            var x2 = 0;
            var y2 = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
            if (horizontal) {
              x2 = node2._collapsed_width * 0.5;
              y2 = -LiteGraph.NODE_TITLE_HEIGHT;
            }
            ctx.fillStyle = "#686";
            ctx.beginPath();
            if (slot.type === LiteGraph.EVENT || slot.shape === LiteGraph.BOX_SHAPE) {
              ctx.rect(x2 - 7 + 0.5, y2 - 4, 14, 8);
            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
              ctx.moveTo(x2 + 8, y2);
              ctx.lineTo(x2 + -4, y2 - 4);
              ctx.lineTo(x2 + -4, y2 + 4);
              ctx.closePath();
            } else {
              ctx.arc(x2, y2, 4, 0, Math.PI * 2);
            }
            ctx.fill();
          }
          if (output_slot) {
            var x2 = node2._collapsed_width;
            var y2 = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
            if (horizontal) {
              x2 = node2._collapsed_width * 0.5;
              y2 = 0;
            }
            ctx.fillStyle = "#686";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            if (slot.type === LiteGraph.EVENT || slot.shape === LiteGraph.BOX_SHAPE) {
              ctx.rect(x2 - 7 + 0.5, y2 - 4, 14, 8);
            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
              ctx.moveTo(x2 + 6, y2);
              ctx.lineTo(x2 - 6, y2 - 4);
              ctx.lineTo(x2 - 6, y2 + 4);
              ctx.closePath();
            } else {
              ctx.arc(x2, y2, 4, 0, Math.PI * 2);
            }
            ctx.fill();
          }
        }
        if (node2.clip_area) {
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      };
      LGraphCanvas.prototype.drawLinkTooltip = function(ctx, link) {
        var pos2 = link._pos;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(pos2[0], pos2[1], 3, 0, Math.PI * 2);
        ctx.fill();
        if (link.data == null)
          return;
        if (this.onDrawLinkTooltip) {
          if (this.onDrawLinkTooltip(ctx, link, this) == true)
            return;
        }
        var data = link.data;
        var text = null;
        if (data.constructor === Number)
          text = data.toFixed(2);
        else if (data.constructor === String)
          text = '"' + data + '"';
        else if (data.constructor === Boolean)
          text = String(data);
        else if (data.toToolTip)
          text = data.toToolTip();
        else
          text = "[" + data.constructor.name + "]";
        if (text == null)
          return;
        text = text.substr(0, 30);
        ctx.font = "14px Courier New";
        var info = ctx.measureText(text);
        var w2 = info.width + 20;
        var h = 24;
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 3;
        ctx.fillStyle = "#454";
        ctx.beginPath();
        ctx.roundRect(pos2[0] - w2 * 0.5, pos2[1] - 15 - h, w2, h, [3]);
        ctx.moveTo(pos2[0] - 10, pos2[1] - 15);
        ctx.lineTo(pos2[0] + 10, pos2[1] - 15);
        ctx.lineTo(pos2[0], pos2[1] - 5);
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.textAlign = "center";
        ctx.fillStyle = "#CEC";
        ctx.fillText(text, pos2[0], pos2[1] - 15 - h * 0.3);
      };
      var tmp_area = new Float32Array(4);
      LGraphCanvas.prototype.drawNodeShape = function(node2, ctx, size, fgcolor, bgcolor, selected, mouse_over) {
        ctx.strokeStyle = fgcolor;
        ctx.fillStyle = bgcolor;
        var title_height = LiteGraph.NODE_TITLE_HEIGHT;
        var low_quality = this.ds.scale < 0.5;
        var shape = node2._shape || node2.constructor.shape || LiteGraph.ROUND_SHAPE;
        var title_mode = node2.constructor.title_mode;
        var render_title = true;
        if (title_mode == LiteGraph.TRANSPARENT_TITLE || title_mode == LiteGraph.NO_TITLE) {
          render_title = false;
        } else if (title_mode == LiteGraph.AUTOHIDE_TITLE && mouse_over) {
          render_title = true;
        }
        var area = tmp_area;
        area[0] = 0;
        area[1] = render_title ? -title_height : 0;
        area[2] = size[0] + 1;
        area[3] = render_title ? size[1] + title_height : size[1];
        var old_alpha = ctx.globalAlpha;
        {
          ctx.beginPath();
          if (shape == LiteGraph.BOX_SHAPE || low_quality) {
            ctx.fillRect(area[0], area[1], area[2], area[3]);
          } else if (shape == LiteGraph.ROUND_SHAPE || shape == LiteGraph.CARD_SHAPE) {
            ctx.roundRect(
              area[0],
              area[1],
              area[2],
              area[3],
              shape == LiteGraph.CARD_SHAPE ? [this.round_radius, this.round_radius, 0, 0] : [this.round_radius]
            );
          } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
              size[0] * 0.5,
              size[1] * 0.5,
              size[0] * 0.5,
              0,
              Math.PI * 2
            );
          }
          ctx.fill();
          if (!node2.flags.collapsed && render_title) {
            ctx.shadowColor = "transparent";
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, -1, area[2], 2);
          }
        }
        ctx.shadowColor = "transparent";
        if (node2.onDrawBackground) {
          node2.onDrawBackground(ctx, this, this.canvas, this.graph_mouse);
        }
        if (render_title || title_mode == LiteGraph.TRANSPARENT_TITLE) {
          if (node2.onDrawTitleBar) {
            node2.onDrawTitleBar(ctx, title_height, size, this.ds.scale, fgcolor);
          } else if (title_mode != LiteGraph.TRANSPARENT_TITLE && (node2.constructor.title_color || this.render_title_colored)) {
            var title_color = node2.constructor.title_color || fgcolor;
            if (node2.flags.collapsed) {
              ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
            }
            if (this.use_gradients) {
              var grad = LGraphCanvas.gradients[title_color];
              if (!grad) {
                grad = LGraphCanvas.gradients[title_color] = ctx.createLinearGradient(0, 0, 400, 0);
                grad.addColorStop(0, title_color);
                grad.addColorStop(1, "#000");
              }
              ctx.fillStyle = grad;
            } else {
              ctx.fillStyle = title_color;
            }
            ctx.beginPath();
            if (shape == LiteGraph.BOX_SHAPE || low_quality) {
              ctx.rect(0, -title_height, size[0] + 1, title_height);
            } else if (shape == LiteGraph.ROUND_SHAPE || shape == LiteGraph.CARD_SHAPE) {
              ctx.roundRect(
                0,
                -title_height,
                size[0] + 1,
                title_height,
                node2.flags.collapsed ? [this.round_radius] : [this.round_radius, this.round_radius, 0, 0]
              );
            }
            ctx.fill();
            ctx.shadowColor = "transparent";
          }
          var colState = false;
          if (LiteGraph.node_box_coloured_by_mode) {
            if (LiteGraph.NODE_MODES_COLORS[node2.mode]) {
              colState = LiteGraph.NODE_MODES_COLORS[node2.mode];
            }
          }
          if (LiteGraph.node_box_coloured_when_on) {
            colState = node2.action_triggered ? "#FFF" : node2.execute_triggered ? "#AAA" : colState;
          }
          var box_size = 10;
          if (node2.onDrawTitleBox) {
            node2.onDrawTitleBox(ctx, title_height, size, this.ds.scale);
          } else if (shape == LiteGraph.ROUND_SHAPE || shape == LiteGraph.CIRCLE_SHAPE || shape == LiteGraph.CARD_SHAPE) {
            if (low_quality) {
              ctx.fillStyle = "black";
              ctx.beginPath();
              ctx.arc(
                title_height * 0.5,
                title_height * -0.5,
                box_size * 0.5 + 1,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
            ctx.fillStyle = node2.boxcolor || colState || LiteGraph.NODE_DEFAULT_BOXCOLOR;
            if (low_quality)
              ctx.fillRect(title_height * 0.5 - box_size * 0.5, title_height * -0.5 - box_size * 0.5, box_size, box_size);
            else {
              ctx.beginPath();
              ctx.arc(
                title_height * 0.5,
                title_height * -0.5,
                box_size * 0.5,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          } else {
            if (low_quality) {
              ctx.fillStyle = "black";
              ctx.fillRect(
                (title_height - box_size) * 0.5 - 1,
                (title_height + box_size) * -0.5 - 1,
                box_size + 2,
                box_size + 2
              );
            }
            ctx.fillStyle = node2.boxcolor || colState || LiteGraph.NODE_DEFAULT_BOXCOLOR;
            ctx.fillRect(
              (title_height - box_size) * 0.5,
              (title_height + box_size) * -0.5,
              box_size,
              box_size
            );
          }
          ctx.globalAlpha = old_alpha;
          if (node2.onDrawTitleText) {
            node2.onDrawTitleText(
              ctx,
              title_height,
              size,
              this.ds.scale,
              this.title_text_font,
              selected
            );
          }
          if (!low_quality) {
            ctx.font = this.title_text_font;
            var title = String(node2.getTitle());
            if (title) {
              if (selected) {
                ctx.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR;
              } else {
                ctx.fillStyle = node2.constructor.title_text_color || this.node_title_color;
              }
              if (node2.flags.collapsed) {
                ctx.textAlign = "left";
                ctx.measureText(title);
                ctx.fillText(
                  title.substr(0, 20),
                  //avoid urls too long
                  title_height,
                  // + measure.width * 0.5,
                  LiteGraph.NODE_TITLE_TEXT_Y - title_height
                );
                ctx.textAlign = "left";
              } else {
                ctx.textAlign = "left";
                ctx.fillText(
                  title,
                  title_height,
                  LiteGraph.NODE_TITLE_TEXT_Y - title_height
                );
              }
            }
          }
          if (!node2.flags.collapsed && node2.subgraph && !node2.skip_subgraph_button) {
            var w2 = LiteGraph.NODE_TITLE_HEIGHT;
            var x2 = node2.size[0] - w2;
            var over = LiteGraph.isInsideRectangle(this.graph_mouse[0] - node2.pos[0], this.graph_mouse[1] - node2.pos[1], x2 + 2, -w2 + 2, w2 - 4, w2 - 4);
            ctx.fillStyle = over ? "#888" : "#555";
            if (shape == LiteGraph.BOX_SHAPE || low_quality)
              ctx.fillRect(x2 + 2, -w2 + 2, w2 - 4, w2 - 4);
            else {
              ctx.beginPath();
              ctx.roundRect(x2 + 2, -w2 + 2, w2 - 4, w2 - 4, [4]);
              ctx.fill();
            }
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.moveTo(x2 + w2 * 0.2, -w2 * 0.6);
            ctx.lineTo(x2 + w2 * 0.8, -w2 * 0.6);
            ctx.lineTo(x2 + w2 * 0.5, -w2 * 0.3);
            ctx.fill();
          }
          if (node2.onDrawTitle) {
            node2.onDrawTitle(ctx);
          }
        }
        if (selected) {
          if (node2.onBounding) {
            node2.onBounding(area);
          }
          if (title_mode == LiteGraph.TRANSPARENT_TITLE) {
            area[1] -= title_height;
            area[3] += title_height;
          }
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          if (shape == LiteGraph.BOX_SHAPE) {
            ctx.rect(
              -6 + area[0],
              -6 + area[1],
              12 + area[2],
              12 + area[3]
            );
          } else if (shape == LiteGraph.ROUND_SHAPE || shape == LiteGraph.CARD_SHAPE && node2.flags.collapsed) {
            ctx.roundRect(
              -6 + area[0],
              -6 + area[1],
              12 + area[2],
              12 + area[3],
              [this.round_radius * 2]
            );
          } else if (shape == LiteGraph.CARD_SHAPE) {
            ctx.roundRect(
              -6 + area[0],
              -6 + area[1],
              12 + area[2],
              12 + area[3],
              [this.round_radius * 2, 2, this.round_radius * 2, 2]
            );
          } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
              size[0] * 0.5,
              size[1] * 0.5,
              size[0] * 0.5 + 6,
              0,
              Math.PI * 2
            );
          }
          ctx.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR;
          ctx.stroke();
          ctx.strokeStyle = fgcolor;
          ctx.globalAlpha = 1;
        }
        if (node2.execute_triggered > 0) node2.execute_triggered--;
        if (node2.action_triggered > 0) node2.action_triggered--;
      };
      var margin_area = new Float32Array(4);
      var link_bounding = new Float32Array(4);
      var tempA = new Float32Array(2);
      var tempB = new Float32Array(2);
      LGraphCanvas.prototype.drawConnections = function(ctx) {
        var now = LiteGraph.getTime();
        var visible_area = this.visible_area;
        margin_area[0] = visible_area[0] - 20;
        margin_area[1] = visible_area[1] - 20;
        margin_area[2] = visible_area[2] + 40;
        margin_area[3] = visible_area[3] + 40;
        ctx.lineWidth = this.connections_width;
        ctx.fillStyle = "#AAA";
        ctx.strokeStyle = "#AAA";
        ctx.globalAlpha = this.editor_alpha;
        var nodes = this.graph._nodes;
        for (var n = 0, l = nodes.length; n < l; ++n) {
          var node2 = nodes[n];
          if (!node2.inputs || !node2.inputs.length) {
            continue;
          }
          for (var i2 = 0; i2 < node2.inputs.length; ++i2) {
            var input = node2.inputs[i2];
            if (!input || input.link == null) {
              continue;
            }
            var link_id = input.link;
            var link = this.graph.links[link_id];
            if (!link) {
              continue;
            }
            var start_node = this.graph.getNodeById(link.origin_id);
            if (start_node == null) {
              continue;
            }
            var start_node_slot = link.origin_slot;
            var start_node_slotpos = null;
            if (start_node_slot == -1) {
              start_node_slotpos = [
                start_node.pos[0] + 10,
                start_node.pos[1] + 10
              ];
            } else {
              start_node_slotpos = start_node.getConnectionPos(
                false,
                start_node_slot,
                tempA
              );
            }
            var end_node_slotpos = node2.getConnectionPos(true, i2, tempB);
            link_bounding[0] = start_node_slotpos[0];
            link_bounding[1] = start_node_slotpos[1];
            link_bounding[2] = end_node_slotpos[0] - start_node_slotpos[0];
            link_bounding[3] = end_node_slotpos[1] - start_node_slotpos[1];
            if (link_bounding[2] < 0) {
              link_bounding[0] += link_bounding[2];
              link_bounding[2] = Math.abs(link_bounding[2]);
            }
            if (link_bounding[3] < 0) {
              link_bounding[1] += link_bounding[3];
              link_bounding[3] = Math.abs(link_bounding[3]);
            }
            if (!overlapBounding(link_bounding, margin_area)) {
              continue;
            }
            var start_slot = start_node.outputs[start_node_slot];
            var end_slot = node2.inputs[i2];
            if (!start_slot || !end_slot) {
              continue;
            }
            var start_dir = start_slot.dir || (start_node.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT);
            var end_dir = end_slot.dir || (node2.horizontal ? LiteGraph.UP : LiteGraph.LEFT);
            this.renderLink(
              ctx,
              start_node_slotpos,
              end_node_slotpos,
              link,
              false,
              0,
              null,
              start_dir,
              end_dir
            );
            if (link && link._last_time && now - link._last_time < 1e3) {
              var f = 2 - (now - link._last_time) * 2e-3;
              var tmp = ctx.globalAlpha;
              ctx.globalAlpha = tmp * f;
              this.renderLink(
                ctx,
                start_node_slotpos,
                end_node_slotpos,
                link,
                true,
                f,
                "white",
                start_dir,
                end_dir
              );
              ctx.globalAlpha = tmp;
            }
          }
        }
        ctx.globalAlpha = 1;
      };
      LGraphCanvas.prototype.renderLink = function(ctx, a, b, link, skip_border, flow, color, start_dir, end_dir, num_sublines) {
        if (link) {
          this.visible_links.push(link);
        }
        if (!color && link) {
          color = link.color || LGraphCanvas.link_type_colors[link.type];
        }
        if (!color) {
          color = this.default_link_color;
        }
        if (link != null && this.highlighted_links[link.id]) {
          color = "#FFF";
        }
        start_dir = start_dir || LiteGraph.RIGHT;
        end_dir = end_dir || LiteGraph.LEFT;
        var dist = distance(a, b);
        if (this.render_connections_border && this.ds.scale > 0.6) {
          ctx.lineWidth = this.connections_width + 4;
        }
        ctx.lineJoin = "round";
        num_sublines = num_sublines || 1;
        if (num_sublines > 1) {
          ctx.lineWidth = 0.5;
        }
        ctx.beginPath();
        for (var i2 = 0; i2 < num_sublines; i2 += 1) {
          var offsety = (i2 - (num_sublines - 1) * 0.5) * 5;
          if (this.links_render_mode == LiteGraph.SPLINE_LINK) {
            ctx.moveTo(a[0], a[1] + offsety);
            var start_offset_x = 0;
            var start_offset_y = 0;
            var end_offset_x = 0;
            var end_offset_y = 0;
            switch (start_dir) {
              case LiteGraph.LEFT:
                start_offset_x = dist * -0.25;
                break;
              case LiteGraph.RIGHT:
                start_offset_x = dist * 0.25;
                break;
              case LiteGraph.UP:
                start_offset_y = dist * -0.25;
                break;
              case LiteGraph.DOWN:
                start_offset_y = dist * 0.25;
                break;
            }
            switch (end_dir) {
              case LiteGraph.LEFT:
                end_offset_x = dist * -0.25;
                break;
              case LiteGraph.RIGHT:
                end_offset_x = dist * 0.25;
                break;
              case LiteGraph.UP:
                end_offset_y = dist * -0.25;
                break;
              case LiteGraph.DOWN:
                end_offset_y = dist * 0.25;
                break;
            }
            ctx.bezierCurveTo(
              a[0] + start_offset_x,
              a[1] + start_offset_y + offsety,
              b[0] + end_offset_x,
              b[1] + end_offset_y + offsety,
              b[0],
              b[1] + offsety
            );
          } else if (this.links_render_mode == LiteGraph.LINEAR_LINK) {
            ctx.moveTo(a[0], a[1] + offsety);
            var start_offset_x = 0;
            var start_offset_y = 0;
            var end_offset_x = 0;
            var end_offset_y = 0;
            switch (start_dir) {
              case LiteGraph.LEFT:
                start_offset_x = -1;
                break;
              case LiteGraph.RIGHT:
                start_offset_x = 1;
                break;
              case LiteGraph.UP:
                start_offset_y = -1;
                break;
              case LiteGraph.DOWN:
                start_offset_y = 1;
                break;
            }
            switch (end_dir) {
              case LiteGraph.LEFT:
                end_offset_x = -1;
                break;
              case LiteGraph.RIGHT:
                end_offset_x = 1;
                break;
              case LiteGraph.UP:
                end_offset_y = -1;
                break;
              case LiteGraph.DOWN:
                end_offset_y = 1;
                break;
            }
            var l = 15;
            ctx.lineTo(
              a[0] + start_offset_x * l,
              a[1] + start_offset_y * l + offsety
            );
            ctx.lineTo(
              b[0] + end_offset_x * l,
              b[1] + end_offset_y * l + offsety
            );
            ctx.lineTo(b[0], b[1] + offsety);
          } else if (this.links_render_mode == LiteGraph.STRAIGHT_LINK) {
            ctx.moveTo(a[0], a[1]);
            var start_x = a[0];
            var start_y = a[1];
            var end_x = b[0];
            var end_y = b[1];
            if (start_dir == LiteGraph.RIGHT) {
              start_x += 10;
            } else {
              start_y += 10;
            }
            if (end_dir == LiteGraph.LEFT) {
              end_x -= 10;
            } else {
              end_y -= 10;
            }
            ctx.lineTo(start_x, start_y);
            ctx.lineTo((start_x + end_x) * 0.5, start_y);
            ctx.lineTo((start_x + end_x) * 0.5, end_y);
            ctx.lineTo(end_x, end_y);
            ctx.lineTo(b[0], b[1]);
          } else {
            return;
          }
        }
        if (this.render_connections_border && this.ds.scale > 0.6 && !skip_border) {
          ctx.strokeStyle = "rgba(0,0,0,0.5)";
          ctx.stroke();
        }
        ctx.lineWidth = this.connections_width;
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.stroke();
        var pos2 = this.computeConnectionPoint(a, b, 0.5, start_dir, end_dir);
        if (link && link._pos) {
          link._pos[0] = pos2[0];
          link._pos[1] = pos2[1];
        }
        if (this.ds.scale >= 0.6 && this.highquality_render && end_dir != LiteGraph.CENTER) {
          if (this.render_connection_arrows) {
            var posA = this.computeConnectionPoint(
              a,
              b,
              0.25,
              start_dir,
              end_dir
            );
            var posB = this.computeConnectionPoint(
              a,
              b,
              0.26,
              start_dir,
              end_dir
            );
            var posC = this.computeConnectionPoint(
              a,
              b,
              0.75,
              start_dir,
              end_dir
            );
            var posD = this.computeConnectionPoint(
              a,
              b,
              0.76,
              start_dir,
              end_dir
            );
            var angleA = 0;
            var angleB = 0;
            if (this.render_curved_connections) {
              angleA = -Math.atan2(posB[0] - posA[0], posB[1] - posA[1]);
              angleB = -Math.atan2(posD[0] - posC[0], posD[1] - posC[1]);
            } else {
              angleB = angleA = b[1] > a[1] ? 0 : Math.PI;
            }
            ctx.save();
            ctx.translate(posA[0], posA[1]);
            ctx.rotate(angleA);
            ctx.beginPath();
            ctx.moveTo(-5, -3);
            ctx.lineTo(0, 7);
            ctx.lineTo(5, -3);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.translate(posC[0], posC[1]);
            ctx.rotate(angleB);
            ctx.beginPath();
            ctx.moveTo(-5, -3);
            ctx.lineTo(0, 7);
            ctx.lineTo(5, -3);
            ctx.fill();
            ctx.restore();
          }
          ctx.beginPath();
          ctx.arc(pos2[0], pos2[1], 5, 0, Math.PI * 2);
          ctx.fill();
        }
        if (flow) {
          ctx.fillStyle = color;
          for (var i2 = 0; i2 < 5; ++i2) {
            var f = (LiteGraph.getTime() * 1e-3 + i2 * 0.2) % 1;
            var pos2 = this.computeConnectionPoint(
              a,
              b,
              f,
              start_dir,
              end_dir
            );
            ctx.beginPath();
            ctx.arc(pos2[0], pos2[1], 5, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      };
      LGraphCanvas.prototype.computeConnectionPoint = function(a, b, t, start_dir, end_dir) {
        start_dir = start_dir || LiteGraph.RIGHT;
        end_dir = end_dir || LiteGraph.LEFT;
        var dist = distance(a, b);
        var p0 = a;
        var p1 = [a[0], a[1]];
        var p2 = [b[0], b[1]];
        var p3 = b;
        switch (start_dir) {
          case LiteGraph.LEFT:
            p1[0] += dist * -0.25;
            break;
          case LiteGraph.RIGHT:
            p1[0] += dist * 0.25;
            break;
          case LiteGraph.UP:
            p1[1] += dist * -0.25;
            break;
          case LiteGraph.DOWN:
            p1[1] += dist * 0.25;
            break;
        }
        switch (end_dir) {
          case LiteGraph.LEFT:
            p2[0] += dist * -0.25;
            break;
          case LiteGraph.RIGHT:
            p2[0] += dist * 0.25;
            break;
          case LiteGraph.UP:
            p2[1] += dist * -0.25;
            break;
          case LiteGraph.DOWN:
            p2[1] += dist * 0.25;
            break;
        }
        var c1 = (1 - t) * (1 - t) * (1 - t);
        var c2 = 3 * ((1 - t) * (1 - t)) * t;
        var c3 = 3 * (1 - t) * (t * t);
        var c4 = t * t * t;
        var x2 = c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0];
        var y2 = c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1];
        return [x2, y2];
      };
      LGraphCanvas.prototype.drawExecutionOrder = function(ctx) {
        ctx.shadowColor = "transparent";
        ctx.globalAlpha = 0.25;
        ctx.textAlign = "center";
        ctx.strokeStyle = "white";
        ctx.globalAlpha = 0.75;
        var visible_nodes = this.visible_nodes;
        for (var i2 = 0; i2 < visible_nodes.length; ++i2) {
          var node2 = visible_nodes[i2];
          ctx.fillStyle = "black";
          ctx.fillRect(
            node2.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
            node2.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
            LiteGraph.NODE_TITLE_HEIGHT,
            LiteGraph.NODE_TITLE_HEIGHT
          );
          if (node2.order == 0) {
            ctx.strokeRect(
              node2.pos[0] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
              node2.pos[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
              LiteGraph.NODE_TITLE_HEIGHT,
              LiteGraph.NODE_TITLE_HEIGHT
            );
          }
          ctx.fillStyle = "#FFF";
          ctx.fillText(
            node2.order,
            node2.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * -0.5,
            node2.pos[1] - 6
          );
        }
        ctx.globalAlpha = 1;
      };
      LGraphCanvas.prototype.drawNodeWidgets = function(node2, posY, ctx, active_widget2) {
        if (!node2.widgets || !node2.widgets.length) {
          return 0;
        }
        var width2 = node2.size[0];
        var widgets = node2.widgets;
        posY += 2;
        var H = LiteGraph.NODE_WIDGET_HEIGHT;
        var show_text = this.ds.scale > 0.5;
        ctx.save();
        ctx.globalAlpha = this.editor_alpha;
        var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
        var background_color = LiteGraph.WIDGET_BGCOLOR;
        var text_color = LiteGraph.WIDGET_TEXT_COLOR;
        var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
        var margin = 15;
        for (var i2 = 0; i2 < widgets.length; ++i2) {
          var w2 = widgets[i2];
          var y2 = posY;
          if (w2.y) {
            y2 = w2.y;
          }
          w2.last_y = y2;
          ctx.strokeStyle = outline_color;
          ctx.fillStyle = "#222";
          ctx.textAlign = "left";
          if (w2.disabled)
            ctx.globalAlpha *= 0.5;
          var widget_width2 = w2.width || width2;
          switch (w2.type) {
            case "button":
              if (w2.clicked) {
                ctx.fillStyle = "#AAA";
                w2.clicked = false;
                this.dirty_canvas = true;
              }
              ctx.fillRect(margin, y2, widget_width2 - margin * 2, H);
              if (show_text && !w2.disabled)
                ctx.strokeRect(margin, y2, widget_width2 - margin * 2, H);
              if (show_text) {
                ctx.textAlign = "center";
                ctx.fillStyle = text_color;
                ctx.fillText(w2.label || w2.name, widget_width2 * 0.5, y2 + H * 0.7);
              }
              break;
            case "toggle":
              ctx.textAlign = "left";
              ctx.strokeStyle = outline_color;
              ctx.fillStyle = background_color;
              ctx.beginPath();
              if (show_text)
                ctx.roundRect(margin, y2, widget_width2 - margin * 2, H, [H * 0.5]);
              else
                ctx.rect(margin, y2, widget_width2 - margin * 2, H);
              ctx.fill();
              if (show_text && !w2.disabled)
                ctx.stroke();
              ctx.fillStyle = w2.value ? "#89A" : "#333";
              ctx.beginPath();
              ctx.arc(widget_width2 - margin * 2, y2 + H * 0.5, H * 0.36, 0, Math.PI * 2);
              ctx.fill();
              if (show_text) {
                ctx.fillStyle = secondary_text_color;
                const label = w2.label || w2.name;
                if (label != null) {
                  ctx.fillText(label, margin * 2, y2 + H * 0.7);
                }
                ctx.fillStyle = w2.value ? text_color : secondary_text_color;
                ctx.textAlign = "right";
                ctx.fillText(
                  w2.value ? w2.options.on || "true" : w2.options.off || "false",
                  widget_width2 - 40,
                  y2 + H * 0.7
                );
              }
              break;
            case "slider":
              ctx.fillStyle = background_color;
              ctx.fillRect(margin, y2, widget_width2 - margin * 2, H);
              var range = w2.options.max - w2.options.min;
              var nvalue2 = (w2.value - w2.options.min) / range;
              if (nvalue2 < 0) nvalue2 = 0;
              if (nvalue2 > 1) nvalue2 = 1;
              ctx.fillStyle = w2.options.hasOwnProperty("slider_color") ? w2.options.slider_color : active_widget2 == w2 ? "#89A" : "#678";
              ctx.fillRect(margin, y2, nvalue2 * (widget_width2 - margin * 2), H);
              if (show_text && !w2.disabled)
                ctx.strokeRect(margin, y2, widget_width2 - margin * 2, H);
              if (w2.marker) {
                var marker_nvalue = (w2.marker - w2.options.min) / range;
                if (marker_nvalue < 0) marker_nvalue = 0;
                if (marker_nvalue > 1) marker_nvalue = 1;
                ctx.fillStyle = w2.options.hasOwnProperty("marker_color") ? w2.options.marker_color : "#AA9";
                ctx.fillRect(margin + marker_nvalue * (widget_width2 - margin * 2), y2, 2, H);
              }
              if (show_text) {
                ctx.textAlign = "center";
                ctx.fillStyle = text_color;
                ctx.fillText(
                  w2.label || w2.name + "  " + Number(w2.value).toFixed(
                    w2.options.precision != null ? w2.options.precision : 3
                  ),
                  widget_width2 * 0.5,
                  y2 + H * 0.7
                );
              }
              break;
            case "number":
            case "combo":
              ctx.textAlign = "left";
              ctx.strokeStyle = outline_color;
              ctx.fillStyle = background_color;
              ctx.beginPath();
              if (show_text)
                ctx.roundRect(margin, y2, widget_width2 - margin * 2, H, [H * 0.5]);
              else
                ctx.rect(margin, y2, widget_width2 - margin * 2, H);
              ctx.fill();
              if (show_text) {
                if (!w2.disabled)
                  ctx.stroke();
                ctx.fillStyle = text_color;
                if (!w2.disabled) {
                  ctx.beginPath();
                  ctx.moveTo(margin + 16, y2 + 5);
                  ctx.lineTo(margin + 6, y2 + H * 0.5);
                  ctx.lineTo(margin + 16, y2 + H - 5);
                  ctx.fill();
                  ctx.beginPath();
                  ctx.moveTo(widget_width2 - margin - 16, y2 + 5);
                  ctx.lineTo(widget_width2 - margin - 6, y2 + H * 0.5);
                  ctx.lineTo(widget_width2 - margin - 16, y2 + H - 5);
                  ctx.fill();
                }
                ctx.fillStyle = secondary_text_color;
                ctx.fillText(w2.label || w2.name, margin * 2 + 5, y2 + H * 0.7);
                ctx.fillStyle = text_color;
                ctx.textAlign = "right";
                if (w2.type == "number") {
                  ctx.fillText(
                    Number(w2.value).toFixed(
                      w2.options.precision !== void 0 ? w2.options.precision : 3
                    ),
                    widget_width2 - margin * 2 - 20,
                    y2 + H * 0.7
                  );
                } else {
                  var v2 = w2.value;
                  if (w2.options.values) {
                    var values2 = w2.options.values;
                    if (values2.constructor === Function)
                      values2 = values2();
                    if (values2 && values2.constructor !== Array)
                      v2 = values2[w2.value];
                  }
                  ctx.fillText(
                    v2,
                    widget_width2 - margin * 2 - 20,
                    y2 + H * 0.7
                  );
                }
              }
              break;
            case "string":
            case "text":
              ctx.textAlign = "left";
              ctx.strokeStyle = outline_color;
              ctx.fillStyle = background_color;
              ctx.beginPath();
              if (show_text)
                ctx.roundRect(margin, y2, widget_width2 - margin * 2, H, [H * 0.5]);
              else
                ctx.rect(margin, y2, widget_width2 - margin * 2, H);
              ctx.fill();
              if (show_text) {
                if (!w2.disabled)
                  ctx.stroke();
                ctx.save();
                ctx.beginPath();
                ctx.rect(margin, y2, widget_width2 - margin * 2, H);
                ctx.clip();
                ctx.fillStyle = secondary_text_color;
                const label = w2.label || w2.name;
                if (label != null) {
                  ctx.fillText(label, margin * 2, y2 + H * 0.7);
                }
                ctx.fillStyle = text_color;
                ctx.textAlign = "right";
                ctx.fillText(String(w2.value).substr(0, 30), widget_width2 - margin * 2, y2 + H * 0.7);
                ctx.restore();
              }
              break;
            default:
              if (w2.draw) {
                w2.draw(ctx, node2, widget_width2, y2, H);
              }
              break;
          }
          posY += (w2.computeSize ? w2.computeSize(widget_width2)[1] : H) + 4;
          ctx.globalAlpha = this.editor_alpha;
        }
        ctx.restore();
        ctx.textAlign = "left";
      };
      LGraphCanvas.prototype.processNodeWidgets = function(node, pos, event, active_widget) {
        if (!node.widgets || !node.widgets.length || !this.allow_interaction && !node.flags.allow_interaction) {
          return null;
        }
        var x = pos[0] - node.pos[0];
        var y = pos[1] - node.pos[1];
        var width = node.size[0];
        var deltaX = event.deltaX || event.deltax || 0;
        var that = this;
        var ref_window = this.getCanvasWindow();
        for (var i = 0; i < node.widgets.length; ++i) {
          var w = node.widgets[i];
          if (!w || w.disabled)
            continue;
          var widget_height = w.computeSize ? w.computeSize(width)[1] : LiteGraph.NODE_WIDGET_HEIGHT;
          var widget_width = w.width || width;
          if (w != active_widget && (x < 6 || x > widget_width - 12 || y < w.last_y || y > w.last_y + widget_height || w.last_y === void 0))
            continue;
          var old_value = w.value;
          switch (w.type) {
            case "button":
              if (event.type === LiteGraph.pointerevents_method + "down") {
                if (w.callback) {
                  setTimeout(function() {
                    w.callback(w, that, node, pos, event);
                  }, 20);
                }
                w.clicked = true;
                this.dirty_canvas = true;
              }
              break;
            case "slider":
              var old_value = w.value;
              var nvalue = clamp((x - 15) / (widget_width - 30), 0, 1);
              if (w.options.read_only) break;
              w.value = w.options.min + (w.options.max - w.options.min) * nvalue;
              if (old_value != w.value) {
                setTimeout(function() {
                  inner_value_change(w, w.value);
                }, 20);
              }
              this.dirty_canvas = true;
              break;
            case "number":
            case "combo":
              var old_value = w.value;
              if (event.type == LiteGraph.pointerevents_method + "move" && w.type == "number") {
                if (deltaX)
                  w.value += deltaX * 0.1 * (w.options.step || 1);
                if (w.options.min != null && w.value < w.options.min) {
                  w.value = w.options.min;
                }
                if (w.options.max != null && w.value > w.options.max) {
                  w.value = w.options.max;
                }
              } else if (event.type == LiteGraph.pointerevents_method + "down") {
                var values = w.options.values;
                if (values && values.constructor === Function) {
                  values = w.options.values(w, node);
                }
                var values_list = null;
                if (w.type != "number")
                  values_list = values.constructor === Array ? values : Object.keys(values);
                var delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                if (w.type == "number") {
                  w.value += delta * 0.1 * (w.options.step || 1);
                  if (w.options.min != null && w.value < w.options.min) {
                    w.value = w.options.min;
                  }
                  if (w.options.max != null && w.value > w.options.max) {
                    w.value = w.options.max;
                  }
                } else if (delta) {
                  var index = -1;
                  this.last_mouseclick = 0;
                  if (values.constructor === Object)
                    index = values_list.indexOf(String(w.value)) + delta;
                  else
                    index = values_list.indexOf(w.value) + delta;
                  if (index >= values_list.length) {
                    index = values_list.length - 1;
                  }
                  if (index < 0) {
                    index = 0;
                  }
                  if (values.constructor === Array)
                    w.value = values[index];
                  else
                    w.value = index;
                } else {
                  let inner_clicked = function(v2, option, event2) {
                    if (values != values_list)
                      v2 = text_values.indexOf(v2);
                    this.value = v2;
                    inner_value_change(this, v2);
                    that.dirty_canvas = true;
                    return false;
                  };
                  var text_values = values != values_list ? Object.values(values) : values;
                  new LiteGraph.ContextMenu(
                    text_values,
                    {
                      scale: Math.max(1, this.ds.scale),
                      event,
                      className: "dark",
                      callback: inner_clicked.bind(w)
                    },
                    ref_window
                  );
                }
              } else if (event.type == LiteGraph.pointerevents_method + "up" && w.type == "number") {
                var delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                if (event.click_time < 200 && delta == 0) {
                  this.prompt(
                    "Value",
                    w.value,
                    function(v) {
                      if (/^[0-9+\-*/()\s]+|\d+\.\d+$/.test(v)) {
                        try {
                          v = eval(v);
                        } catch (e) {
                        }
                      }
                      this.value = Number(v);
                      inner_value_change(this, this.value);
                    }.bind(w),
                    event
                  );
                }
              }
              if (old_value != w.value)
                setTimeout(
                  function() {
                    inner_value_change(this, this.value);
                  }.bind(w),
                  20
                );
              this.dirty_canvas = true;
              break;
            case "toggle":
              if (event.type == LiteGraph.pointerevents_method + "down") {
                w.value = !w.value;
                setTimeout(function() {
                  inner_value_change(w, w.value);
                }, 20);
              }
              break;
            case "string":
            case "text":
              if (event.type == LiteGraph.pointerevents_method + "down") {
                this.prompt(
                  "Value",
                  w.value,
                  function(v2) {
                    inner_value_change(this, v2);
                  }.bind(w),
                  event,
                  w.options ? w.options.multiline : false
                );
              }
              break;
            default:
              if (w.mouse) {
                this.dirty_canvas = w.mouse(event, [x, y], node);
              }
              break;
          }
          if (old_value != w.value) {
            if (node.onWidgetChanged)
              node.onWidgetChanged(w.name, w.value, old_value, w);
            node.graph._version++;
          }
          return w;
        }
        function inner_value_change(widget, value) {
          if (widget.type == "number") {
            value = Number(value);
          }
          widget.value = value;
          if (widget.options && widget.options.property && node.properties[widget.options.property] !== void 0) {
            node.setProperty(widget.options.property, value);
          }
          if (widget.callback) {
            widget.callback(widget.value, that, node, pos, event);
          }
        }
        return null;
      };
      LGraphCanvas.prototype.drawGroups = function(canvas, ctx) {
        if (!this.graph) {
          return;
        }
        var groups = this.graph._groups;
        ctx.save();
        ctx.globalAlpha = 0.5 * this.editor_alpha;
        for (var i2 = 0; i2 < groups.length; ++i2) {
          var group = groups[i2];
          if (!overlapBounding(this.visible_area, group._bounding)) {
            continue;
          }
          ctx.fillStyle = group.color || "#335";
          ctx.strokeStyle = group.color || "#335";
          var pos2 = group._pos;
          var size = group._size;
          ctx.globalAlpha = 0.25 * this.editor_alpha;
          ctx.beginPath();
          ctx.rect(pos2[0] + 0.5, pos2[1] + 0.5, size[0], size[1]);
          ctx.fill();
          ctx.globalAlpha = this.editor_alpha;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(pos2[0] + size[0], pos2[1] + size[1]);
          ctx.lineTo(pos2[0] + size[0] - 10, pos2[1] + size[1]);
          ctx.lineTo(pos2[0] + size[0], pos2[1] + size[1] - 10);
          ctx.fill();
          var font_size = group.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
          ctx.font = font_size + "px Arial";
          ctx.textAlign = "left";
          ctx.fillText(group.title, pos2[0] + 4, pos2[1] + font_size);
        }
        ctx.restore();
      };
      LGraphCanvas.prototype.adjustNodesSize = function() {
        var nodes = this.graph._nodes;
        for (var i2 = 0; i2 < nodes.length; ++i2) {
          nodes[i2].size = nodes[i2].computeSize();
        }
        this.setDirty(true, true);
      };
      LGraphCanvas.prototype.resize = function(width2, height) {
        if (!width2 && !height) {
          var parent = this.canvas.parentNode;
          width2 = parent.offsetWidth;
          height = parent.offsetHeight;
        }
        if (this.canvas.width == width2 && this.canvas.height == height) {
          return;
        }
        this.canvas.width = width2;
        this.canvas.height = height;
        this.bgcanvas.width = this.canvas.width;
        this.bgcanvas.height = this.canvas.height;
        this.setDirty(true, true);
      };
      LGraphCanvas.prototype.switchLiveMode = function(transition) {
        if (!transition) {
          this.live_mode = !this.live_mode;
          this.dirty_canvas = true;
          this.dirty_bgcanvas = true;
          return;
        }
        var self = this;
        var delta2 = this.live_mode ? 1.1 : 0.9;
        if (this.live_mode) {
          this.live_mode = false;
          this.editor_alpha = 0.1;
        }
        var t = setInterval(function() {
          self.editor_alpha *= delta2;
          self.dirty_canvas = true;
          self.dirty_bgcanvas = true;
          if (delta2 < 1 && self.editor_alpha < 0.01) {
            clearInterval(t);
            if (delta2 < 1) {
              self.live_mode = true;
            }
          }
          if (delta2 > 1 && self.editor_alpha > 0.99) {
            clearInterval(t);
            self.editor_alpha = 1;
          }
        }, 1);
      };
      LGraphCanvas.prototype.onNodeSelectionChange = function(node2) {
        return;
      };
      LGraphCanvas.onGroupAdd = function(info, entry, mouse_event) {
        var canvas = LGraphCanvas.active_canvas;
        canvas.getCanvasWindow();
        var group = new LiteGraph.LGraphGroup();
        group.pos = canvas.convertEventToCanvasOffset(mouse_event);
        canvas.graph.add(group);
      };
      LGraphCanvas.getBoundaryNodes = function(nodes) {
        let top = null;
        let right = null;
        let bottom = null;
        let left = null;
        for (const nID in nodes) {
          const node2 = nodes[nID];
          const [x2, y2] = node2.pos;
          const [width2, height] = node2.size;
          if (top === null || y2 < top.pos[1]) {
            top = node2;
          }
          if (right === null || x2 + width2 > right.pos[0] + right.size[0]) {
            right = node2;
          }
          if (bottom === null || y2 + height > bottom.pos[1] + bottom.size[1]) {
            bottom = node2;
          }
          if (left === null || x2 < left.pos[0]) {
            left = node2;
          }
        }
        return {
          "top": top,
          "right": right,
          "bottom": bottom,
          "left": left
        };
      };
      LGraphCanvas.prototype.boundaryNodesForSelection = function() {
        return LGraphCanvas.getBoundaryNodes(Object.values(this.selected_nodes));
      };
      LGraphCanvas.alignNodes = function(nodes, direction, align_to) {
        if (!nodes) {
          return;
        }
        const canvas = LGraphCanvas.active_canvas;
        let boundaryNodes = [];
        if (align_to === void 0) {
          boundaryNodes = LGraphCanvas.getBoundaryNodes(nodes);
        } else {
          boundaryNodes = {
            "top": align_to,
            "right": align_to,
            "bottom": align_to,
            "left": align_to
          };
        }
        for (const [_, node2] of Object.entries(canvas.selected_nodes)) {
          switch (direction) {
            case "right":
              node2.pos[0] = boundaryNodes["right"].pos[0] + boundaryNodes["right"].size[0] - node2.size[0];
              break;
            case "left":
              node2.pos[0] = boundaryNodes["left"].pos[0];
              break;
            case "top":
              node2.pos[1] = boundaryNodes["top"].pos[1];
              break;
            case "bottom":
              node2.pos[1] = boundaryNodes["bottom"].pos[1] + boundaryNodes["bottom"].size[1] - node2.size[1];
              break;
          }
        }
        canvas.dirty_canvas = true;
        canvas.dirty_bgcanvas = true;
      };
      LGraphCanvas.onNodeAlign = function(value, options, event2, prev_menu, node2) {
        new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
          event: event2,
          callback: inner_clicked,
          parentMenu: prev_menu
        });
        function inner_clicked(value2) {
          LGraphCanvas.alignNodes(LGraphCanvas.active_canvas.selected_nodes, value2.toLowerCase(), node2);
        }
      };
      LGraphCanvas.onGroupAlign = function(value, options, event2, prev_menu) {
        new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
          event: event2,
          callback: inner_clicked,
          parentMenu: prev_menu
        });
        function inner_clicked(value2) {
          LGraphCanvas.alignNodes(LGraphCanvas.active_canvas.selected_nodes, value2.toLowerCase());
        }
      };
      LGraphCanvas.onMenuAdd = function(node2, options, e, prev_menu, callback) {
        var canvas = LGraphCanvas.active_canvas;
        var ref_window2 = canvas.getCanvasWindow();
        var graph = canvas.graph;
        if (!graph)
          return;
        function inner_onMenuAdded(base_category, prev_menu2) {
          var categories = LiteGraph.getNodeTypesCategories(canvas.filter || graph.filter).filter(function(category) {
            return category.startsWith(base_category);
          });
          var entries = [];
          categories.map(function(category) {
            if (!category)
              return;
            var base_category_regex = new RegExp("^(" + base_category + ")");
            var category_name = category.replace(base_category_regex, "").split("/")[0];
            var category_path = base_category === "" ? category_name + "/" : base_category + category_name + "/";
            var name = category_name;
            if (name.indexOf("::") != -1)
              name = name.split("::")[1];
            var index2 = entries.findIndex(function(entry) {
              return entry.value === category_path;
            });
            if (index2 === -1) {
              entries.push({ value: category_path, content: name, has_submenu: true, callback: function(value, event2, mouseEvent, contextMenu) {
                inner_onMenuAdded(value.value, contextMenu);
              } });
            }
          });
          var nodes = LiteGraph.getNodeTypesInCategory(base_category.slice(0, -1), canvas.filter || graph.filter);
          nodes.map(function(node3) {
            if (node3.skip_list)
              return;
            var entry = {
              value: node3.type,
              content: node3.title,
              has_submenu: false,
              callback: function(value, event2, mouseEvent, contextMenu) {
                var first_event = contextMenu.getFirstEvent();
                canvas.graph.beforeChange();
                var node4 = LiteGraph.createNode(value.value);
                if (node4) {
                  node4.pos = canvas.convertEventToCanvasOffset(first_event);
                  canvas.graph.add(node4);
                }
                if (callback)
                  callback(node4);
                canvas.graph.afterChange();
              }
            };
            entries.push(entry);
          });
          new LiteGraph.ContextMenu(entries, { event: e, parentMenu: prev_menu2 }, ref_window2);
        }
        inner_onMenuAdded("", prev_menu);
        return false;
      };
      LGraphCanvas.onMenuCollapseAll = function() {
      };
      LGraphCanvas.onMenuNodeEdit = function() {
      };
      LGraphCanvas.showMenuNodeOptionalInputs = function(v2, options, e, prev_menu, node2) {
        if (!node2) {
          return;
        }
        var that2 = this;
        var canvas = LGraphCanvas.active_canvas;
        var ref_window2 = canvas.getCanvasWindow();
        var options = node2.optional_inputs;
        if (node2.onGetInputs) {
          options = node2.onGetInputs();
        }
        var entries = [];
        if (options) {
          for (var i2 = 0; i2 < options.length; i2++) {
            var entry = options[i2];
            if (!entry) {
              entries.push(null);
              continue;
            }
            var label = entry[0];
            if (!entry[2])
              entry[2] = {};
            if (entry[2].label) {
              label = entry[2].label;
            }
            entry[2].removable = true;
            var data = { content: label, value: entry };
            if (entry[1] == LiteGraph.ACTION) {
              data.className = "event";
            }
            entries.push(data);
          }
        }
        if (node2.onMenuNodeInputs) {
          var retEntries = node2.onMenuNodeInputs(entries);
          if (retEntries) entries = retEntries;
        }
        if (!entries.length) {
          console.log("no input entries");
          return;
        }
        new LiteGraph.ContextMenu(
          entries,
          {
            event: e,
            callback: inner_clicked,
            parentMenu: prev_menu,
            node: node2
          },
          ref_window2
        );
        function inner_clicked(v3, e2, prev) {
          if (!node2) {
            return;
          }
          if (v3.callback) {
            v3.callback.call(that2, node2, v3, e2, prev);
          }
          if (v3.value) {
            node2.graph.beforeChange();
            node2.addInput(v3.value[0], v3.value[1], v3.value[2]);
            if (node2.onNodeInputAdd) {
              node2.onNodeInputAdd(v3.value);
            }
            node2.setDirtyCanvas(true, true);
            node2.graph.afterChange();
          }
        }
        return false;
      };
      LGraphCanvas.showMenuNodeOptionalOutputs = function(v2, options, e, prev_menu, node2) {
        if (!node2) {
          return;
        }
        var that2 = this;
        var canvas = LGraphCanvas.active_canvas;
        var ref_window2 = canvas.getCanvasWindow();
        var options = node2.optional_outputs;
        if (node2.onGetOutputs) {
          options = node2.onGetOutputs();
        }
        var entries = [];
        if (options) {
          for (var i2 = 0; i2 < options.length; i2++) {
            var entry = options[i2];
            if (!entry) {
              entries.push(null);
              continue;
            }
            if (node2.flags && node2.flags.skip_repeated_outputs && node2.findOutputSlot(entry[0]) != -1) {
              continue;
            }
            var label = entry[0];
            if (!entry[2])
              entry[2] = {};
            if (entry[2].label) {
              label = entry[2].label;
            }
            entry[2].removable = true;
            var data = { content: label, value: entry };
            if (entry[1] == LiteGraph.EVENT) {
              data.className = "event";
            }
            entries.push(data);
          }
        }
        if (this.onMenuNodeOutputs) {
          entries = this.onMenuNodeOutputs(entries);
        }
        if (LiteGraph.do_add_triggers_slots) {
          if (node2.findOutputSlot("onExecuted") == -1) {
            entries.push({ content: "On Executed", value: ["onExecuted", LiteGraph.EVENT, { nameLocked: true }], className: "event" });
          }
        }
        if (node2.onMenuNodeOutputs) {
          var retEntries = node2.onMenuNodeOutputs(entries);
          if (retEntries) entries = retEntries;
        }
        if (!entries.length) {
          return;
        }
        new LiteGraph.ContextMenu(
          entries,
          {
            event: e,
            callback: inner_clicked,
            parentMenu: prev_menu,
            node: node2
          },
          ref_window2
        );
        function inner_clicked(v3, e2, prev) {
          if (!node2) {
            return;
          }
          if (v3.callback) {
            v3.callback.call(that2, node2, v3, e2, prev);
          }
          if (!v3.value) {
            return;
          }
          var value = v3.value[1];
          if (value && (value.constructor === Object || value.constructor === Array)) {
            var entries2 = [];
            for (var i3 in value) {
              entries2.push({ content: i3, value: value[i3] });
            }
            new LiteGraph.ContextMenu(entries2, {
              event: e2,
              callback: inner_clicked,
              parentMenu: prev_menu,
              node: node2
            });
            return false;
          } else {
            node2.graph.beforeChange();
            node2.addOutput(v3.value[0], v3.value[1], v3.value[2]);
            if (node2.onNodeOutputAdd) {
              node2.onNodeOutputAdd(v3.value);
            }
            node2.setDirtyCanvas(true, true);
            node2.graph.afterChange();
          }
        }
        return false;
      };
      LGraphCanvas.onShowMenuNodeProperties = function(value, options, e, prev_menu, node2) {
        if (!node2 || !node2.properties) {
          return;
        }
        var canvas = LGraphCanvas.active_canvas;
        var ref_window2 = canvas.getCanvasWindow();
        var entries = [];
        for (var i2 in node2.properties) {
          var value = node2.properties[i2] !== void 0 ? node2.properties[i2] : " ";
          if (typeof value == "object")
            value = JSON.stringify(value);
          var info = node2.getPropertyInfo(i2);
          if (info.type == "enum" || info.type == "combo")
            value = LGraphCanvas.getPropertyPrintableValue(value, info.values);
          value = LGraphCanvas.decodeHTML(value);
          entries.push({
            content: "<span class='property_name'>" + (info.label ? info.label : i2) + "</span><span class='property_value'>" + value + "</span>",
            value: i2
          });
        }
        if (!entries.length) {
          return;
        }
        new LiteGraph.ContextMenu(
          entries,
          {
            event: e,
            callback: inner_clicked,
            parentMenu: prev_menu,
            allow_html: true,
            node: node2
          },
          ref_window2
        );
        function inner_clicked(v2, options2, e2, prev) {
          if (!node2) {
            return;
          }
          var rect = this.getBoundingClientRect();
          canvas.showEditPropertyValue(node2, v2.value, {
            position: [rect.left, rect.top]
          });
        }
        return false;
      };
      LGraphCanvas.decodeHTML = function(str) {
        var e = document.createElement("div");
        e.innerText = str;
        return e.innerHTML;
      };
      LGraphCanvas.onMenuResizeNode = function(value, options, e, menu, node2) {
        if (!node2) {
          return;
        }
        var fApplyMultiNode = function(node3) {
          node3.size = node3.computeSize();
          if (node3.onResize)
            node3.onResize(node3.size);
        };
        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
          fApplyMultiNode(node2);
        } else {
          for (var i2 in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i2]);
          }
        }
        node2.setDirtyCanvas(true, true);
      };
      LGraphCanvas.prototype.showLinkMenu = function(link, e) {
        var that2 = this;
        var node_left = that2.graph.getNodeById(link.origin_id);
        var node_right = that2.graph.getNodeById(link.target_id);
        var fromType = false;
        if (node_left && node_left.outputs && node_left.outputs[link.origin_slot]) fromType = node_left.outputs[link.origin_slot].type;
        var destType = false;
        if (node_right && node_right.outputs && node_right.outputs[link.target_slot]) destType = node_right.inputs[link.target_slot].type;
        var options = ["Add Node", null, "Delete", null];
        var menu = new LiteGraph.ContextMenu(options, {
          event: e,
          title: link.data != null ? link.data.constructor.name : null,
          callback: inner_clicked
        });
        function inner_clicked(v2, options2, e2) {
          switch (v2) {
            case "Add Node":
              LGraphCanvas.onMenuAdd(null, null, e2, menu, function(node2) {
                if (!node2.inputs || !node2.inputs.length || !node2.outputs || !node2.outputs.length) {
                  return;
                }
                if (node_left.connectByType(link.origin_slot, node2, fromType)) {
                  node2.connectByType(link.target_slot, node_right, destType);
                  node2.pos[0] -= node2.size[0] * 0.5;
                }
              });
              break;
            case "Delete":
              that2.graph.removeLink(link.id);
              break;
          }
        }
        return false;
      };
      LGraphCanvas.prototype.createDefaultNodeForSlot = function(optPass) {
        var optPass = optPass || {};
        var opts = Object.assign(
          {
            nodeFrom: null,
            slotFrom: null,
            nodeTo: null,
            slotTo: null,
            position: [],
            nodeType: null,
            posAdd: [0, 0],
            posSizeFix: [0, 0]
            // alpha, adjust the position x,y based on the new node size w,h
          },
          optPass
        );
        var that2 = this;
        var isFrom = opts.nodeFrom && opts.slotFrom !== null;
        var isTo = !isFrom && opts.nodeTo && opts.slotTo !== null;
        if (!isFrom && !isTo) {
          console.warn("No data passed to createDefaultNodeForSlot " + opts.nodeFrom + " " + opts.slotFrom + " " + opts.nodeTo + " " + opts.slotTo);
          return false;
        }
        if (!opts.nodeType) {
          console.warn("No type to createDefaultNodeForSlot");
          return false;
        }
        var nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
        var slotX = isFrom ? opts.slotFrom : opts.slotTo;
        var iSlotConn = false;
        switch (typeof slotX) {
          case "string":
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX, false) : nodeX.findInputSlot(slotX, false);
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
          case "object":
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
            break;
          case "number":
            iSlotConn = slotX;
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
          case "undefined":
          default:
            console.warn("Cant get slot information " + slotX);
            return false;
        }
        if (slotX === false || iSlotConn === false) {
          console.warn("createDefaultNodeForSlot bad slotX " + slotX + " " + iSlotConn);
        }
        var fromSlotType = slotX.type == LiteGraph.EVENT ? "_event_" : slotX.type;
        var slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
        if (slotTypesDefault && slotTypesDefault[fromSlotType]) {
          if (slotX.link !== null) ;
          nodeNewType = false;
          if (typeof slotTypesDefault[fromSlotType] == "object" || typeof slotTypesDefault[fromSlotType] == "array") {
            for (var typeX in slotTypesDefault[fromSlotType]) {
              if (opts.nodeType == slotTypesDefault[fromSlotType][typeX] || opts.nodeType == "AUTO") {
                nodeNewType = slotTypesDefault[fromSlotType][typeX];
                break;
              }
            }
          } else {
            if (opts.nodeType == slotTypesDefault[fromSlotType] || opts.nodeType == "AUTO") nodeNewType = slotTypesDefault[fromSlotType];
          }
          if (nodeNewType) {
            var nodeNewOpts = false;
            if (typeof nodeNewType == "object" && nodeNewType.node) {
              nodeNewOpts = nodeNewType;
              nodeNewType = nodeNewType.node;
            }
            var newNode = LiteGraph.createNode(nodeNewType);
            if (newNode) {
              if (nodeNewOpts) {
                if (nodeNewOpts.properties) {
                  for (var i2 in nodeNewOpts.properties) {
                    newNode.addProperty(i2, nodeNewOpts.properties[i2]);
                  }
                }
                if (nodeNewOpts.inputs) {
                  newNode.inputs = [];
                  for (var i2 in nodeNewOpts.inputs) {
                    newNode.addOutput(
                      nodeNewOpts.inputs[i2][0],
                      nodeNewOpts.inputs[i2][1]
                    );
                  }
                }
                if (nodeNewOpts.outputs) {
                  newNode.outputs = [];
                  for (var i2 in nodeNewOpts.outputs) {
                    newNode.addOutput(
                      nodeNewOpts.outputs[i2][0],
                      nodeNewOpts.outputs[i2][1]
                    );
                  }
                }
                if (nodeNewOpts.title) {
                  newNode.title = nodeNewOpts.title;
                }
                if (nodeNewOpts.json) {
                  newNode.configure(nodeNewOpts.json);
                }
              }
              that2.graph.add(newNode);
              newNode.pos = [
                opts.position[0] + opts.posAdd[0] + (opts.posSizeFix[0] ? opts.posSizeFix[0] * newNode.size[0] : 0),
                opts.position[1] + opts.posAdd[1] + (opts.posSizeFix[1] ? opts.posSizeFix[1] * newNode.size[1] : 0)
              ];
              if (isFrom) {
                opts.nodeFrom.connectByType(iSlotConn, newNode, fromSlotType);
              } else {
                opts.nodeTo.connectByTypeOutput(iSlotConn, newNode, fromSlotType);
              }
              return true;
            } else {
              console.log("failed creating " + nodeNewType);
            }
          }
        }
        return false;
      };
      LGraphCanvas.prototype.showConnectionMenu = function(optPass) {
        var optPass = optPass || {};
        var opts = Object.assign(
          {
            nodeFrom: null,
            slotFrom: null,
            nodeTo: null,
            slotTo: null,
            e: null
          },
          optPass
        );
        var that2 = this;
        var isFrom = opts.nodeFrom && opts.slotFrom;
        var isTo = !isFrom && opts.nodeTo && opts.slotTo;
        if (!isFrom && !isTo) {
          console.warn("No data passed to showConnectionMenu");
          return false;
        }
        var nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
        var slotX = isFrom ? opts.slotFrom : opts.slotTo;
        var iSlotConn = false;
        switch (typeof slotX) {
          case "string":
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX, false) : nodeX.findInputSlot(slotX, false);
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
          case "object":
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
            break;
          case "number":
            iSlotConn = slotX;
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
          default:
            console.warn("Cant get slot information " + slotX);
            return false;
        }
        var options = ["Add Node", null];
        if (that2.allow_searchbox) {
          options.push("Search");
          options.push(null);
        }
        var fromSlotType = slotX.type == LiteGraph.EVENT ? "_event_" : slotX.type;
        var slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
        if (slotTypesDefault && slotTypesDefault[fromSlotType]) {
          if (typeof slotTypesDefault[fromSlotType] == "object" || typeof slotTypesDefault[fromSlotType] == "array") {
            for (var typeX in slotTypesDefault[fromSlotType]) {
              options.push(slotTypesDefault[fromSlotType][typeX]);
            }
          } else {
            options.push(slotTypesDefault[fromSlotType]);
          }
        }
        var menu = new LiteGraph.ContextMenu(options, {
          event: opts.e,
          title: (slotX && slotX.name != "" ? slotX.name + (fromSlotType ? " | " : "") : "") + (slotX && fromSlotType ? fromSlotType : ""),
          callback: inner_clicked
        });
        function inner_clicked(v2, options2, e) {
          switch (v2) {
            case "Add Node":
              LGraphCanvas.onMenuAdd(null, null, e, menu, function(node2) {
                if (isFrom) {
                  opts.nodeFrom.connectByType(iSlotConn, node2, fromSlotType);
                } else {
                  opts.nodeTo.connectByTypeOutput(iSlotConn, node2, fromSlotType);
                }
              });
              break;
            case "Search":
              if (isFrom) {
                that2.showSearchBox(e, { node_from: opts.nodeFrom, slot_from: slotX, type_filter_in: fromSlotType });
              } else {
                that2.showSearchBox(e, { node_to: opts.nodeTo, slot_from: slotX, type_filter_out: fromSlotType });
              }
              break;
            default:
              that2.createDefaultNodeForSlot(Object.assign(opts, {
                position: [opts.e.canvasX, opts.e.canvasY],
                nodeType: v2
              }));
              break;
          }
        }
        return false;
      };
      LGraphCanvas.onShowPropertyEditor = function(item, options, e, menu, node2) {
        var property = item.property || "title";
        var value = node2[property];
        var dialog = document.createElement("div");
        dialog.is_modified = false;
        dialog.className = "graphdialog";
        dialog.innerHTML = "<span class='name'></span><input autofocus type='text' class='value'/><button>OK</button>";
        dialog.close = function() {
          if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
          }
        };
        var title = dialog.querySelector(".name");
        title.innerText = property;
        var input = dialog.querySelector(".value");
        if (input) {
          input.value = value;
          input.addEventListener("blur", function(e2) {
            this.focus();
          });
          input.addEventListener("keydown", function(e2) {
            dialog.is_modified = true;
            if (e2.keyCode == 27) {
              dialog.close();
            } else if (e2.keyCode == 13) {
              inner();
            } else if (e2.keyCode != 13 && e2.target.localName != "textarea") {
              return;
            }
            e2.preventDefault();
            e2.stopPropagation();
          });
        }
        var graphcanvas = LGraphCanvas.active_canvas;
        var canvas = graphcanvas.canvas;
        var rect = canvas.getBoundingClientRect();
        var offsetx = -20;
        var offsety = -20;
        if (rect) {
          offsetx -= rect.left;
          offsety -= rect.top;
        }
        if (event) {
          dialog.style.left = event.clientX + offsetx + "px";
          dialog.style.top = event.clientY + offsety + "px";
        } else {
          dialog.style.left = canvas.width * 0.5 + offsetx + "px";
          dialog.style.top = canvas.height * 0.5 + offsety + "px";
        }
        var button = dialog.querySelector("button");
        button.addEventListener("click", inner);
        canvas.parentNode.appendChild(dialog);
        if (input) input.focus();
        var dialogCloseTimer = null;
        dialog.addEventListener("mouseleave", function(e2) {
          if (LiteGraph.dialog_close_on_mouse_leave) {
            if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave)
              dialogCloseTimer = setTimeout(dialog.close, LiteGraph.dialog_close_on_mouse_leave_delay);
          }
        });
        dialog.addEventListener("mouseenter", function(e2) {
          if (LiteGraph.dialog_close_on_mouse_leave) {
            if (dialogCloseTimer) clearTimeout(dialogCloseTimer);
          }
        });
        function inner() {
          if (input) setValue(input.value);
        }
        function setValue(value2) {
          if (item.type == "Number") {
            value2 = Number(value2);
          } else if (item.type == "Boolean") {
            value2 = Boolean(value2);
          }
          node2[property] = value2;
          if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
          }
          node2.setDirtyCanvas(true, true);
        }
      };
      LGraphCanvas.prototype.prompt = function(title, value, callback, event2, multiline) {
        var that2 = this;
        title = title || "";
        var dialog = document.createElement("div");
        dialog.is_modified = false;
        dialog.className = "graphdialog rounded";
        if (multiline)
          dialog.innerHTML = "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>";
        else
          dialog.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>";
        dialog.close = function() {
          that2.prompt_box = null;
          if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
          }
        };
        var graphcanvas = LGraphCanvas.active_canvas;
        var canvas = graphcanvas.canvas;
        canvas.parentNode.appendChild(dialog);
        if (this.ds.scale > 1) {
          dialog.style.transform = "scale(" + this.ds.scale + ")";
        }
        var dialogCloseTimer = null;
        var prevent_timeout = false;
        LiteGraph.pointerListenerAdd(dialog, "leave", function(e) {
          if (prevent_timeout)
            return;
          if (LiteGraph.dialog_close_on_mouse_leave) {
            if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave)
              dialogCloseTimer = setTimeout(dialog.close, LiteGraph.dialog_close_on_mouse_leave_delay);
          }
        });
        LiteGraph.pointerListenerAdd(dialog, "enter", function(e) {
          if (LiteGraph.dialog_close_on_mouse_leave) {
            if (dialogCloseTimer) clearTimeout(dialogCloseTimer);
          }
        });
        var selInDia = dialog.querySelectorAll("select");
        if (selInDia) {
          selInDia.forEach(function(selIn) {
            selIn.addEventListener("click", function(e) {
              prevent_timeout++;
            });
            selIn.addEventListener("blur", function(e) {
              prevent_timeout = 0;
            });
            selIn.addEventListener("change", function(e) {
              prevent_timeout = -1;
            });
          });
        }
        if (that2.prompt_box) {
          that2.prompt_box.close();
        }
        that2.prompt_box = dialog;
        var name_element = dialog.querySelector(".name");
        name_element.innerText = title;
        var value_element = dialog.querySelector(".value");
        value_element.value = value;
        var input = value_element;
        input.addEventListener("keydown", function(e) {
          dialog.is_modified = true;
          if (e.keyCode == 27) {
            dialog.close();
          } else if (e.keyCode == 13 && e.target.localName != "textarea") {
            if (callback) {
              callback(this.value);
            }
            dialog.close();
          } else {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
        });
        var button = dialog.querySelector("button");
        button.addEventListener("click", function(e) {
          if (callback) {
            callback(input.value);
          }
          that2.setDirty(true);
          dialog.close();
        });
        var rect = canvas.getBoundingClientRect();
        var offsetx = -20;
        var offsety = -20;
        if (rect) {
          offsetx -= rect.left;
          offsety -= rect.top;
        }
        if (event2) {
          dialog.style.left = event2.clientX + offsetx + "px";
          dialog.style.top = event2.clientY + offsety + "px";
        } else {
          dialog.style.left = canvas.width * 0.5 + offsetx + "px";
          dialog.style.top = canvas.height * 0.5 + offsety + "px";
        }
        setTimeout(function() {
          input.focus();
        }, 10);
        return dialog;
      };
      LGraphCanvas.search_limit = -1;
      LGraphCanvas.prototype.showSearchBox = function(event2, options) {
        var def_options = {
          slot_from: null,
          node_from: null,
          node_to: null,
          do_type_filter: LiteGraph.search_filter_enabled,
          type_filter_in: false,
          type_filter_out: false,
          show_general_if_none_on_typefilter: true,
          show_general_after_typefiltered: true,
          hide_on_mouse_leave: LiteGraph.search_hide_on_mouse_leave,
          show_all_if_empty: true,
          show_all_on_open: LiteGraph.search_show_all_on_open
        };
        options = Object.assign(def_options, options || {});
        var that2 = this;
        var graphcanvas = LGraphCanvas.active_canvas;
        var canvas = graphcanvas.canvas;
        var root_document = canvas.ownerDocument || document;
        var dialog = document.createElement("div");
        dialog.className = "litegraph litesearchbox graphdialog rounded";
        dialog.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/>";
        if (options.do_type_filter) {
          dialog.innerHTML += "<select class='slot_in_type_filter'><option value=''></option></select>";
          dialog.innerHTML += "<select class='slot_out_type_filter'><option value=''></option></select>";
        }
        dialog.innerHTML += "<div class='helper'></div>";
        if (root_document.fullscreenElement)
          root_document.fullscreenElement.appendChild(dialog);
        else {
          root_document.body.appendChild(dialog);
          root_document.body.style.overflow = "hidden";
        }
        if (options.do_type_filter) {
          var selIn = dialog.querySelector(".slot_in_type_filter");
          var selOut = dialog.querySelector(".slot_out_type_filter");
        }
        dialog.close = function() {
          that2.search_box = null;
          this.blur();
          canvas.focus();
          root_document.body.style.overflow = "";
          setTimeout(function() {
            that2.canvas.focus();
          }, 20);
          if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
          }
        };
        if (this.ds.scale > 1) {
          dialog.style.transform = "scale(" + this.ds.scale + ")";
        }
        if (options.hide_on_mouse_leave) {
          var prevent_timeout = false;
          var timeout_close = null;
          LiteGraph.pointerListenerAdd(dialog, "enter", function(e) {
            if (timeout_close) {
              clearTimeout(timeout_close);
              timeout_close = null;
            }
          });
          LiteGraph.pointerListenerAdd(dialog, "leave", function(e) {
            if (prevent_timeout) {
              return;
            }
            timeout_close = setTimeout(function() {
              dialog.close();
            }, 500);
          });
          if (options.do_type_filter) {
            selIn.addEventListener("click", function(e) {
              prevent_timeout++;
            });
            selIn.addEventListener("blur", function(e) {
              prevent_timeout = 0;
            });
            selIn.addEventListener("change", function(e) {
              prevent_timeout = -1;
            });
            selOut.addEventListener("click", function(e) {
              prevent_timeout++;
            });
            selOut.addEventListener("blur", function(e) {
              prevent_timeout = 0;
            });
            selOut.addEventListener("change", function(e) {
              prevent_timeout = -1;
            });
          }
        }
        if (that2.search_box) {
          that2.search_box.close();
        }
        that2.search_box = dialog;
        var helper = dialog.querySelector(".helper");
        var first = null;
        var timeout = null;
        var selected = null;
        var input = dialog.querySelector("input");
        if (input) {
          input.addEventListener("blur", function(e) {
            if (that2.search_box)
              this.focus();
          });
          input.addEventListener("keydown", function(e) {
            if (e.keyCode == 38) {
              changeSelection(false);
            } else if (e.keyCode == 40) {
              changeSelection(true);
            } else if (e.keyCode == 27) {
              dialog.close();
            } else if (e.keyCode == 13) {
              refreshHelper();
              if (selected) {
                select(selected.innerHTML);
              } else if (first) {
                select(first);
              } else {
                dialog.close();
              }
            } else {
              if (timeout) {
                clearInterval(timeout);
              }
              timeout = setTimeout(refreshHelper, 250);
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
          });
        }
        if (options.do_type_filter) {
          if (selIn) {
            var aSlots = LiteGraph.slot_types_in;
            var nSlots = aSlots.length;
            if (options.type_filter_in == LiteGraph.EVENT || options.type_filter_in == LiteGraph.ACTION)
              options.type_filter_in = "_event_";
            for (var iK = 0; iK < nSlots; iK++) {
              var opt = document.createElement("option");
              opt.value = aSlots[iK];
              opt.innerHTML = aSlots[iK];
              selIn.appendChild(opt);
              if (options.type_filter_in !== false && (options.type_filter_in + "").toLowerCase() == (aSlots[iK] + "").toLowerCase()) {
                opt.selected = true;
              }
            }
            selIn.addEventListener("change", function() {
              refreshHelper();
            });
          }
          if (selOut) {
            var aSlots = LiteGraph.slot_types_out;
            var nSlots = aSlots.length;
            if (options.type_filter_out == LiteGraph.EVENT || options.type_filter_out == LiteGraph.ACTION)
              options.type_filter_out = "_event_";
            for (var iK = 0; iK < nSlots; iK++) {
              var opt = document.createElement("option");
              opt.value = aSlots[iK];
              opt.innerHTML = aSlots[iK];
              selOut.appendChild(opt);
              if (options.type_filter_out !== false && (options.type_filter_out + "").toLowerCase() == (aSlots[iK] + "").toLowerCase()) {
                opt.selected = true;
              }
            }
            selOut.addEventListener("change", function() {
              refreshHelper();
            });
          }
        }
        var rect = canvas.getBoundingClientRect();
        var left = (event2 ? event2.clientX : rect.left + rect.width * 0.5) - 80;
        var top = (event2 ? event2.clientY : rect.top + rect.height * 0.5) - 20;
        dialog.style.left = left + "px";
        dialog.style.top = top + "px";
        if (event2.layerY > rect.height - 200)
          helper.style.maxHeight = rect.height - event2.layerY - 20 + "px";
        input.focus();
        if (options.show_all_on_open) refreshHelper();
        function select(name) {
          if (name) {
            if (that2.onSearchBoxSelection) {
              that2.onSearchBoxSelection(name, event2, graphcanvas);
            } else {
              var extra = LiteGraph.searchbox_extras[name.toLowerCase()];
              if (extra) {
                name = extra.type;
              }
              graphcanvas.graph.beforeChange();
              var node2 = LiteGraph.createNode(name);
              if (node2) {
                node2.pos = graphcanvas.convertEventToCanvasOffset(
                  event2
                );
                graphcanvas.graph.add(node2, false);
              }
              if (extra && extra.data) {
                if (extra.data.properties) {
                  for (var i2 in extra.data.properties) {
                    node2.addProperty(i2, extra.data.properties[i2]);
                  }
                }
                if (extra.data.inputs) {
                  node2.inputs = [];
                  for (var i2 in extra.data.inputs) {
                    node2.addOutput(
                      extra.data.inputs[i2][0],
                      extra.data.inputs[i2][1]
                    );
                  }
                }
                if (extra.data.outputs) {
                  node2.outputs = [];
                  for (var i2 in extra.data.outputs) {
                    node2.addOutput(
                      extra.data.outputs[i2][0],
                      extra.data.outputs[i2][1]
                    );
                  }
                }
                if (extra.data.title) {
                  node2.title = extra.data.title;
                }
                if (extra.data.json) {
                  node2.configure(extra.data.json);
                }
              }
              if (options.node_from) {
                var iS = false;
                switch (typeof options.slot_from) {
                  case "string":
                    iS = options.node_from.findOutputSlot(options.slot_from);
                    break;
                  case "object":
                    if (options.slot_from.name) {
                      iS = options.node_from.findOutputSlot(options.slot_from.name);
                    } else {
                      iS = -1;
                    }
                    if (iS == -1 && typeof options.slot_from.slot_index !== "undefined") iS = options.slot_from.slot_index;
                    break;
                  case "number":
                    iS = options.slot_from;
                    break;
                  default:
                    iS = 0;
                }
                if (typeof options.node_from.outputs[iS] !== "undefined") {
                  if (iS !== false && iS > -1) {
                    options.node_from.connectByType(iS, node2, options.node_from.outputs[iS].type);
                  }
                }
              }
              if (options.node_to) {
                var iS = false;
                switch (typeof options.slot_from) {
                  case "string":
                    iS = options.node_to.findInputSlot(options.slot_from);
                    break;
                  case "object":
                    if (options.slot_from.name) {
                      iS = options.node_to.findInputSlot(options.slot_from.name);
                    } else {
                      iS = -1;
                    }
                    if (iS == -1 && typeof options.slot_from.slot_index !== "undefined") iS = options.slot_from.slot_index;
                    break;
                  case "number":
                    iS = options.slot_from;
                    break;
                  default:
                    iS = 0;
                }
                if (typeof options.node_to.inputs[iS] !== "undefined") {
                  if (iS !== false && iS > -1) {
                    options.node_to.connectByTypeOutput(iS, node2, options.node_to.inputs[iS].type);
                  }
                }
              }
              graphcanvas.graph.afterChange();
            }
          }
          dialog.close();
        }
        function changeSelection(forward) {
          var prev = selected;
          if (selected) {
            selected.classList.remove("selected");
          }
          if (!selected) {
            selected = forward ? helper.childNodes[0] : helper.childNodes[helper.childNodes.length];
          } else {
            selected = forward ? selected.nextSibling : selected.previousSibling;
            if (!selected) {
              selected = prev;
            }
          }
          if (!selected) {
            return;
          }
          selected.classList.add("selected");
          selected.scrollIntoView({ block: "end", behavior: "smooth" });
        }
        function refreshHelper() {
          timeout = null;
          var str = input.value;
          first = null;
          helper.innerHTML = "";
          if (!str && !options.show_all_if_empty) {
            return;
          }
          if (that2.onSearchBox) {
            var list = that2.onSearchBox(helper, str, graphcanvas);
            if (list) {
              for (var i2 = 0; i2 < list.length; ++i2) {
                addResult(list[i2]);
              }
            }
          } else {
            let inner_test_filter = function(type, optsIn) {
              var optsIn = optsIn || {};
              var optsDef = {
                skipFilter: false,
                inTypeOverride: false,
                outTypeOverride: false
              };
              var opts = Object.assign(optsDef, optsIn);
              var ctor2 = LiteGraph.registered_node_types[type];
              if (filter && ctor2.filter != filter)
                return false;
              if ((!options.show_all_if_empty || str) && type.toLowerCase().indexOf(str) === -1)
                return false;
              if (options.do_type_filter && !opts.skipFilter) {
                var sType = type;
                var sV = sIn.value;
                if (opts.inTypeOverride !== false) sV = opts.inTypeOverride;
                if (sIn && sV) {
                  if (LiteGraph.registered_slot_in_types[sV] && LiteGraph.registered_slot_in_types[sV].nodes) {
                    var doesInc = LiteGraph.registered_slot_in_types[sV].nodes.includes(sType);
                    if (doesInc !== false) ;
                    else {
                      return false;
                    }
                  }
                }
                var sV = sOut.value;
                if (opts.outTypeOverride !== false) sV = opts.outTypeOverride;
                if (sOut && sV) {
                  if (LiteGraph.registered_slot_out_types[sV] && LiteGraph.registered_slot_out_types[sV].nodes) {
                    var doesInc = LiteGraph.registered_slot_out_types[sV].nodes.includes(sType);
                    if (doesInc !== false) ;
                    else {
                      return false;
                    }
                  }
                }
              }
              return true;
            };
            var c = 0;
            str = str.toLowerCase();
            var filter = graphcanvas.filter || graphcanvas.graph.filter;
            if (options.do_type_filter && that2.search_box) {
              var sIn = that2.search_box.querySelector(".slot_in_type_filter");
              var sOut = that2.search_box.querySelector(".slot_out_type_filter");
            } else {
              var sIn = false;
              var sOut = false;
            }
            for (var i2 in LiteGraph.searchbox_extras) {
              var extra = LiteGraph.searchbox_extras[i2];
              if ((!options.show_all_if_empty || str) && extra.desc.toLowerCase().indexOf(str) === -1) {
                continue;
              }
              var ctor = LiteGraph.registered_node_types[extra.type];
              if (ctor && ctor.filter != filter)
                continue;
              if (!inner_test_filter(extra.type))
                continue;
              addResult(extra.desc, "searchbox_extra");
              if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                break;
              }
            }
            var filtered = null;
            if (Array.prototype.filter) {
              var keys = Object.keys(LiteGraph.registered_node_types);
              var filtered = keys.filter(inner_test_filter);
            } else {
              filtered = [];
              for (var i2 in LiteGraph.registered_node_types) {
                if (inner_test_filter(i2))
                  filtered.push(i2);
              }
            }
            for (var i2 = 0; i2 < filtered.length; i2++) {
              addResult(filtered[i2]);
              if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                break;
              }
            }
            if (options.show_general_after_typefiltered && (sIn.value || sOut.value)) {
              filtered_extra = [];
              for (var i2 in LiteGraph.registered_node_types) {
                if (inner_test_filter(i2, { inTypeOverride: sIn && sIn.value ? "*" : false, outTypeOverride: sOut && sOut.value ? "*" : false }))
                  filtered_extra.push(i2);
              }
              for (var i2 = 0; i2 < filtered_extra.length; i2++) {
                addResult(filtered_extra[i2], "generic_type");
                if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                  break;
                }
              }
            }
            if ((sIn.value || sOut.value) && (helper.childNodes.length == 0 && options.show_general_if_none_on_typefilter)) {
              filtered_extra = [];
              for (var i2 in LiteGraph.registered_node_types) {
                if (inner_test_filter(i2, { skipFilter: true }))
                  filtered_extra.push(i2);
              }
              for (var i2 = 0; i2 < filtered_extra.length; i2++) {
                addResult(filtered_extra[i2], "not_in_filter");
                if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                  break;
                }
              }
            }
          }
          function addResult(type, className) {
            var help = document.createElement("div");
            if (!first) {
              first = type;
            }
            help.innerText = type;
            help.dataset["type"] = escape(type);
            help.className = "litegraph lite-search-item";
            if (className) {
              help.className += " " + className;
            }
            help.addEventListener("click", function(e) {
              select(unescape(this.dataset["type"]));
            });
            helper.appendChild(help);
          }
        }
        return dialog;
      };
      LGraphCanvas.prototype.showEditPropertyValue = function(node2, property, options) {
        if (!node2 || node2.properties[property] === void 0) {
          return;
        }
        options = options || {};
        var info = node2.getPropertyInfo(property);
        var type = info.type;
        var input_html = "";
        if (type == "string" || type == "number" || type == "array" || type == "object") {
          input_html = "<input autofocus type='text' class='value'/>";
        } else if ((type == "enum" || type == "combo") && info.values) {
          input_html = "<select autofocus type='text' class='value'>";
          for (var i2 in info.values) {
            var v2 = i2;
            if (info.values.constructor === Array)
              v2 = info.values[i2];
            input_html += "<option value='" + v2 + "' " + (v2 == node2.properties[property] ? "selected" : "") + ">" + info.values[i2] + "</option>";
          }
          input_html += "</select>";
        } else if (type == "boolean" || type == "toggle") {
          input_html = "<input autofocus type='checkbox' class='value' " + (node2.properties[property] ? "checked" : "") + "/>";
        } else {
          console.warn("unknown type: " + type);
          return;
        }
        var dialog = this.createDialog(
          "<span class='name'>" + (info.label ? info.label : property) + "</span>" + input_html + "<button>OK</button>",
          options
        );
        var input = false;
        if ((type == "enum" || type == "combo") && info.values) {
          input = dialog.querySelector("select");
          input.addEventListener("change", function(e) {
            dialog.modified();
            setValue(e.target.value);
          });
        } else if (type == "boolean" || type == "toggle") {
          input = dialog.querySelector("input");
          if (input) {
            input.addEventListener("click", function(e) {
              dialog.modified();
              setValue(!!input.checked);
            });
          }
        } else {
          input = dialog.querySelector("input");
          if (input) {
            input.addEventListener("blur", function(e) {
              this.focus();
            });
            var v2 = node2.properties[property] !== void 0 ? node2.properties[property] : "";
            if (type !== "string") {
              v2 = JSON.stringify(v2);
            }
            input.value = v2;
            input.addEventListener("keydown", function(e) {
              if (e.keyCode == 27) {
                dialog.close();
              } else if (e.keyCode == 13) {
                inner();
              } else if (e.keyCode != 13) {
                dialog.modified();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
            });
          }
        }
        if (input) input.focus();
        var button = dialog.querySelector("button");
        button.addEventListener("click", inner);
        function inner() {
          setValue(input.value);
        }
        function setValue(value) {
          if (info && info.values && info.values.constructor === Object && info.values[value] != void 0)
            value = info.values[value];
          if (typeof node2.properties[property] == "number") {
            value = Number(value);
          }
          if (type == "array" || type == "object") {
            value = JSON.parse(value);
          }
          node2.properties[property] = value;
          if (node2.graph) {
            node2.graph._version++;
          }
          if (node2.onPropertyChanged) {
            node2.onPropertyChanged(property, value);
          }
          if (options.onclose)
            options.onclose();
          dialog.close();
          node2.setDirtyCanvas(true, true);
        }
        return dialog;
      };
      LGraphCanvas.prototype.createDialog = function(html, options) {
        var def_options = { checkForInput: false, closeOnLeave: true, closeOnLeave_checkModified: true };
        options = Object.assign(def_options, options || {});
        var dialog = document.createElement("div");
        dialog.className = "graphdialog";
        dialog.innerHTML = html;
        dialog.is_modified = false;
        var rect = this.canvas.getBoundingClientRect();
        var offsetx = -20;
        var offsety = -20;
        if (rect) {
          offsetx -= rect.left;
          offsety -= rect.top;
        }
        if (options.position) {
          offsetx += options.position[0];
          offsety += options.position[1];
        } else if (options.event) {
          offsetx += options.event.clientX;
          offsety += options.event.clientY;
        } else {
          offsetx += this.canvas.width * 0.5;
          offsety += this.canvas.height * 0.5;
        }
        dialog.style.left = offsetx + "px";
        dialog.style.top = offsety + "px";
        this.canvas.parentNode.appendChild(dialog);
        if (options.checkForInput) {
          var aI = [];
          var focused = false;
          if (aI = dialog.querySelectorAll("input")) {
            aI.forEach(function(iX) {
              iX.addEventListener("keydown", function(e) {
                dialog.modified();
                if (e.keyCode == 27) {
                  dialog.close();
                } else if (e.keyCode != 13) {
                  return;
                }
                e.preventDefault();
                e.stopPropagation();
              });
              if (!focused) iX.focus();
            });
          }
        }
        dialog.modified = function() {
          dialog.is_modified = true;
        };
        dialog.close = function() {
          if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
          }
        };
        var dialogCloseTimer = null;
        var prevent_timeout = false;
        dialog.addEventListener("mouseleave", function(e) {
          if (prevent_timeout)
            return;
          if (options.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) {
            if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave)
              dialogCloseTimer = setTimeout(dialog.close, LiteGraph.dialog_close_on_mouse_leave_delay);
          }
        });
        dialog.addEventListener("mouseenter", function(e) {
          if (options.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) {
            if (dialogCloseTimer) clearTimeout(dialogCloseTimer);
          }
        });
        var selInDia = dialog.querySelectorAll("select");
        if (selInDia) {
          selInDia.forEach(function(selIn) {
            selIn.addEventListener("click", function(e) {
              prevent_timeout++;
            });
            selIn.addEventListener("blur", function(e) {
              prevent_timeout = 0;
            });
            selIn.addEventListener("change", function(e) {
              prevent_timeout = -1;
            });
          });
        }
        return dialog;
      };
      LGraphCanvas.prototype.createPanel = function(title, options) {
        options = options || {};
        var ref_window2 = options.window || window;
        var root = document.createElement("div");
        root.className = "litegraph dialog";
        root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>";
        root.header = root.querySelector(".dialog-header");
        if (options.width)
          root.style.width = options.width + (options.width.constructor === Number ? "px" : "");
        if (options.height)
          root.style.height = options.height + (options.height.constructor === Number ? "px" : "");
        if (options.closable) {
          var close = document.createElement("span");
          close.innerHTML = "&#10005;";
          close.classList.add("close");
          close.addEventListener("click", function() {
            root.close();
          });
          root.header.appendChild(close);
        }
        root.title_element = root.querySelector(".dialog-title");
        root.title_element.innerText = title;
        root.content = root.querySelector(".dialog-content");
        root.alt_content = root.querySelector(".dialog-alt-content");
        root.footer = root.querySelector(".dialog-footer");
        root.close = function() {
          if (root.onClose && typeof root.onClose == "function") {
            root.onClose();
          }
          if (root.parentNode)
            root.parentNode.removeChild(root);
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        };
        root.toggleAltContent = function(force) {
          if (typeof force != "undefined") {
            var vTo = force ? "block" : "none";
            var vAlt = force ? "none" : "block";
          } else {
            var vTo = root.alt_content.style.display != "block" ? "block" : "none";
            var vAlt = root.alt_content.style.display != "block" ? "none" : "block";
          }
          root.alt_content.style.display = vTo;
          root.content.style.display = vAlt;
        };
        root.toggleFooterVisibility = function(force) {
          if (typeof force != "undefined") {
            var vTo = force ? "block" : "none";
          } else {
            var vTo = root.footer.style.display != "block" ? "block" : "none";
          }
          root.footer.style.display = vTo;
        };
        root.clear = function() {
          this.content.innerHTML = "";
        };
        root.addHTML = function(code, classname, on_footer) {
          var elem = document.createElement("div");
          if (classname)
            elem.className = classname;
          elem.innerHTML = code;
          if (on_footer)
            root.footer.appendChild(elem);
          else
            root.content.appendChild(elem);
          return elem;
        };
        root.addButton = function(name, callback, options2) {
          var elem = document.createElement("button");
          elem.innerText = name;
          elem.options = options2;
          elem.classList.add("btn");
          elem.addEventListener("click", callback);
          root.footer.appendChild(elem);
          return elem;
        };
        root.addSeparator = function() {
          var elem = document.createElement("div");
          elem.className = "separator";
          root.content.appendChild(elem);
        };
        root.addWidget = function(type, name, value, options2, callback) {
          options2 = options2 || {};
          var str_value = String(value);
          type = type.toLowerCase();
          if (type == "number")
            str_value = value.toFixed(3);
          var elem = document.createElement("div");
          elem.className = "property";
          elem.innerHTML = "<span class='property_name'></span><span class='property_value'></span>";
          elem.querySelector(".property_name").innerText = options2.label || name;
          var value_element = elem.querySelector(".property_value");
          value_element.innerText = str_value;
          elem.dataset["property"] = name;
          elem.dataset["type"] = options2.type || type;
          elem.options = options2;
          elem.value = value;
          if (type == "code")
            elem.addEventListener("click", function(e) {
              root.inner_showCodePad(this.dataset["property"]);
            });
          else if (type == "boolean") {
            elem.classList.add("boolean");
            if (value)
              elem.classList.add("bool-on");
            elem.addEventListener("click", function() {
              var propname = this.dataset["property"];
              this.value = !this.value;
              this.classList.toggle("bool-on");
              this.querySelector(".property_value").innerText = this.value ? "true" : "false";
              innerChange(propname, this.value);
            });
          } else if (type == "string" || type == "number") {
            value_element.setAttribute("contenteditable", true);
            value_element.addEventListener("keydown", function(e) {
              if (e.code == "Enter" && (type != "string" || !e.shiftKey)) {
                e.preventDefault();
                this.blur();
              }
            });
            value_element.addEventListener("blur", function() {
              var v2 = this.innerText;
              var propname = this.parentNode.dataset["property"];
              var proptype = this.parentNode.dataset["type"];
              if (proptype == "number")
                v2 = Number(v2);
              innerChange(propname, v2);
            });
          } else if (type == "enum" || type == "combo") {
            var str_value = LGraphCanvas.getPropertyPrintableValue(value, options2.values);
            value_element.innerText = str_value;
            value_element.addEventListener("click", function(event2) {
              var values2 = options2.values || [];
              var propname = this.parentNode.dataset["property"];
              var elem_that = this;
              new LiteGraph.ContextMenu(
                values2,
                {
                  event: event2,
                  className: "dark",
                  callback: inner_clicked
                },
                ref_window2
              );
              function inner_clicked(v2, option, event3) {
                elem_that.innerText = v2;
                innerChange(propname, v2);
                return false;
              }
            });
          }
          root.content.appendChild(elem);
          function innerChange(name2, value2) {
            if (options2.callback)
              options2.callback(name2, value2, options2);
            if (callback)
              callback(name2, value2, options2);
          }
          return elem;
        };
        if (root.onOpen && typeof root.onOpen == "function") root.onOpen();
        return root;
      };
      LGraphCanvas.getPropertyPrintableValue = function(value, values2) {
        if (!values2)
          return String(value);
        if (values2.constructor === Array) {
          return String(value);
        }
        if (values2.constructor === Object) {
          var desc_value = "";
          for (var k in values2) {
            if (values2[k] != value)
              continue;
            desc_value = k;
            break;
          }
          return String(value) + " (" + desc_value + ")";
        }
      };
      LGraphCanvas.prototype.closePanels = function() {
        var panel2 = document.querySelector("#node-panel");
        if (panel2)
          panel2.close();
        var panel2 = document.querySelector("#option-panel");
        if (panel2)
          panel2.close();
      };
      LGraphCanvas.prototype.showShowGraphOptionsPanel = function(refOpts, obEv, refMenu, refMenu2) {
        if (this.constructor && this.constructor.name == "HTMLDivElement") {
          if (!obEv || !obEv.event || !obEv.event.target || !obEv.event.target.lgraphcanvas) {
            console.warn("Canvas not found");
            return;
          }
          var graphcanvas = obEv.event.target.lgraphcanvas;
        } else {
          var graphcanvas = this;
        }
        graphcanvas.closePanels();
        var ref_window2 = graphcanvas.getCanvasWindow();
        panel = graphcanvas.createPanel("Options", {
          closable: true,
          window: ref_window2,
          onOpen: function() {
            graphcanvas.OPTIONPANEL_IS_OPEN = true;
          },
          onClose: function() {
            graphcanvas.OPTIONPANEL_IS_OPEN = false;
            graphcanvas.options_panel = null;
          }
        });
        graphcanvas.options_panel = panel;
        panel.id = "option-panel";
        panel.classList.add("settings");
        function inner_refresh() {
          panel.content.innerHTML = "";
          var fUpdate = function(name, value, options) {
            switch (name) {
              /*case "Render mode":
                  // Case "".. 
                  if (options.values && options.key){
                      var kV = Object.values(options.values).indexOf(value);
                      if (kV>=0 && options.values[kV]){
                          console.debug("update graph options: "+options.key+": "+kV);
                          graphcanvas[options.key] = kV;
                          //console.debug(graphcanvas);
                          break;
                      }
                  }
                  console.warn("unexpected options");
                  console.debug(options);
                  break;*/
              default:
                if (options && options.key) {
                  name = options.key;
                }
                if (options.values) {
                  value = Object.values(options.values).indexOf(value);
                }
                graphcanvas[name] = value;
                break;
            }
          };
          var aProps = LiteGraph.availableCanvasOptions;
          aProps.sort();
          for (var pI in aProps) {
            var pX = aProps[pI];
            panel.addWidget("boolean", pX, graphcanvas[pX], { key: pX, on: "True", off: "False" }, fUpdate);
          }
          [graphcanvas.links_render_mode];
          panel.addWidget("combo", "Render mode", LiteGraph.LINK_RENDER_MODES[graphcanvas.links_render_mode], { key: "links_render_mode", values: LiteGraph.LINK_RENDER_MODES }, fUpdate);
          panel.addSeparator();
          panel.footer.innerHTML = "";
        }
        inner_refresh();
        graphcanvas.canvas.parentNode.appendChild(panel);
      };
      LGraphCanvas.prototype.showShowNodePanel = function(node2) {
        this.SELECTED_NODE = node2;
        this.closePanels();
        var ref_window2 = this.getCanvasWindow();
        var graphcanvas = this;
        var panel2 = this.createPanel(node2.title || "", {
          closable: true,
          window: ref_window2,
          onOpen: function() {
            graphcanvas.NODEPANEL_IS_OPEN = true;
          },
          onClose: function() {
            graphcanvas.NODEPANEL_IS_OPEN = false;
            graphcanvas.node_panel = null;
          }
        });
        graphcanvas.node_panel = panel2;
        panel2.id = "node-panel";
        panel2.node = node2;
        panel2.classList.add("settings");
        function inner_refresh() {
          panel2.content.innerHTML = "";
          panel2.addHTML("<span class='node_type'>" + node2.type + "</span><span class='node_desc'>" + (node2.constructor.desc || "") + "</span><span class='separator'></span>");
          panel2.addHTML("<h3>Properties</h3>");
          var fUpdate = function(name, value2) {
            graphcanvas.graph.beforeChange(node2);
            switch (name) {
              case "Title":
                node2.title = value2;
                break;
              case "Mode":
                var kV = Object.values(LiteGraph.NODE_MODES).indexOf(value2);
                if (kV >= 0 && LiteGraph.NODE_MODES[kV]) {
                  node2.changeMode(kV);
                } else {
                  console.warn("unexpected mode: " + value2);
                }
                break;
              case "Color":
                if (LGraphCanvas.node_colors[value2]) {
                  node2.color = LGraphCanvas.node_colors[value2].color;
                  node2.bgcolor = LGraphCanvas.node_colors[value2].bgcolor;
                } else {
                  console.warn("unexpected color: " + value2);
                }
                break;
              default:
                node2.setProperty(name, value2);
                break;
            }
            graphcanvas.graph.afterChange();
            graphcanvas.dirty_canvas = true;
          };
          panel2.addWidget("string", "Title", node2.title, {}, fUpdate);
          panel2.addWidget("combo", "Mode", LiteGraph.NODE_MODES[node2.mode], { values: LiteGraph.NODE_MODES }, fUpdate);
          var nodeCol = "";
          if (node2.color !== void 0) {
            nodeCol = Object.keys(LGraphCanvas.node_colors).filter(function(nK) {
              return LGraphCanvas.node_colors[nK].color == node2.color;
            });
          }
          panel2.addWidget("combo", "Color", nodeCol, { values: Object.keys(LGraphCanvas.node_colors) }, fUpdate);
          for (var pName in node2.properties) {
            var value = node2.properties[pName];
            var info = node2.getPropertyInfo(pName);
            info.type || "string";
            if (node2.onAddPropertyToPanel && node2.onAddPropertyToPanel(pName, panel2))
              continue;
            panel2.addWidget(info.widget || info.type, pName, value, info, fUpdate);
          }
          panel2.addSeparator();
          if (node2.onShowCustomPanelInfo)
            node2.onShowCustomPanelInfo(panel2);
          panel2.footer.innerHTML = "";
          panel2.addButton("Delete", function() {
            if (node2.block_delete)
              return;
            node2.graph.remove(node2);
            panel2.close();
          }).classList.add("delete");
        }
        panel2.inner_showCodePad = function(propname) {
          panel2.classList.remove("settings");
          panel2.classList.add("centered");
          panel2.alt_content.innerHTML = "<textarea class='code'></textarea>";
          var textarea = panel2.alt_content.querySelector("textarea");
          var fDoneWith = function() {
            panel2.toggleAltContent(false);
            panel2.toggleFooterVisibility(true);
            textarea.parentNode.removeChild(textarea);
            panel2.classList.add("settings");
            panel2.classList.remove("centered");
            inner_refresh();
          };
          textarea.value = node2.properties[propname];
          textarea.addEventListener("keydown", function(e) {
            if (e.code == "Enter" && e.ctrlKey) {
              node2.setProperty(propname, textarea.value);
              fDoneWith();
            }
          });
          panel2.toggleAltContent(true);
          panel2.toggleFooterVisibility(false);
          textarea.style.height = "calc(100% - 40px)";
          var assign = panel2.addButton("Assign", function() {
            node2.setProperty(propname, textarea.value);
            fDoneWith();
          });
          panel2.alt_content.appendChild(assign);
          var button = panel2.addButton("Close", fDoneWith);
          button.style.float = "right";
          panel2.alt_content.appendChild(button);
        };
        inner_refresh();
        this.canvas.parentNode.appendChild(panel2);
      };
      LGraphCanvas.prototype.showSubgraphPropertiesDialog = function(node2) {
        console.log("showing subgraph properties dialog");
        var old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
        if (old_panel)
          old_panel.close();
        var panel2 = this.createPanel("Subgraph Inputs", { closable: true, width: 500 });
        panel2.node = node2;
        panel2.classList.add("subgraph_dialog");
        function inner_refresh() {
          panel2.clear();
          if (node2.inputs)
            for (var i2 = 0; i2 < node2.inputs.length; ++i2) {
              var input = node2.inputs[i2];
              if (input.not_subgraph_input)
                continue;
              var html2 = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>";
              var elem2 = panel2.addHTML(html2, "subgraph_property");
              elem2.dataset["name"] = input.name;
              elem2.dataset["slot"] = i2;
              elem2.querySelector(".name").innerText = input.name;
              elem2.querySelector(".type").innerText = input.type;
              elem2.querySelector("button").addEventListener("click", function(e) {
                node2.removeInput(Number(this.parentNode.dataset["slot"]));
                inner_refresh();
              });
            }
        }
        var html = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>";
        var elem = panel2.addHTML(html, "subgraph_property extra", true);
        elem.querySelector("button").addEventListener("click", function(e) {
          var elem2 = this.parentNode;
          var name = elem2.querySelector(".name").value;
          var type = elem2.querySelector(".type").value;
          if (!name || node2.findInputSlot(name) != -1)
            return;
          node2.addInput(name, type);
          elem2.querySelector(".name").value = "";
          elem2.querySelector(".type").value = "";
          inner_refresh();
        });
        inner_refresh();
        this.canvas.parentNode.appendChild(panel2);
        return panel2;
      };
      LGraphCanvas.prototype.showSubgraphPropertiesDialogRight = function(node2) {
        var old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
        if (old_panel)
          old_panel.close();
        var panel2 = this.createPanel("Subgraph Outputs", { closable: true, width: 500 });
        panel2.node = node2;
        panel2.classList.add("subgraph_dialog");
        function inner_refresh() {
          panel2.clear();
          if (node2.outputs)
            for (var i2 = 0; i2 < node2.outputs.length; ++i2) {
              var input = node2.outputs[i2];
              if (input.not_subgraph_output)
                continue;
              var html2 = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>";
              var elem2 = panel2.addHTML(html2, "subgraph_property");
              elem2.dataset["name"] = input.name;
              elem2.dataset["slot"] = i2;
              elem2.querySelector(".name").innerText = input.name;
              elem2.querySelector(".type").innerText = input.type;
              elem2.querySelector("button").addEventListener("click", function(e) {
                node2.removeOutput(Number(this.parentNode.dataset["slot"]));
                inner_refresh();
              });
            }
        }
        var html = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>";
        var elem = panel2.addHTML(html, "subgraph_property extra", true);
        elem.querySelector(".name").addEventListener("keydown", function(e) {
          if (e.keyCode == 13) {
            addOutput.apply(this);
          }
        });
        elem.querySelector("button").addEventListener("click", function(e) {
          addOutput.apply(this);
        });
        function addOutput() {
          var elem2 = this.parentNode;
          var name = elem2.querySelector(".name").value;
          var type = elem2.querySelector(".type").value;
          if (!name || node2.findOutputSlot(name) != -1)
            return;
          node2.addOutput(name, type);
          elem2.querySelector(".name").value = "";
          elem2.querySelector(".type").value = "";
          inner_refresh();
        }
        inner_refresh();
        this.canvas.parentNode.appendChild(panel2);
        return panel2;
      };
      LGraphCanvas.prototype.checkPanels = function() {
        if (!this.canvas)
          return;
        var panels = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
        for (var i2 = 0; i2 < panels.length; ++i2) {
          var panel2 = panels[i2];
          if (!panel2.node)
            continue;
          if (!panel2.node.graph || panel2.graph != this.graph)
            panel2.close();
        }
      };
      LGraphCanvas.onMenuNodeCollapse = function(value, options, e, menu, node2) {
        node2.graph.beforeChange(
          /*?*/
        );
        var fApplyMultiNode = function(node3) {
          node3.collapse();
        };
        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
          fApplyMultiNode(node2);
        } else {
          for (var i2 in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i2]);
          }
        }
        node2.graph.afterChange(
          /*?*/
        );
      };
      LGraphCanvas.onMenuNodePin = function(value, options, e, menu, node2) {
        node2.pin();
      };
      LGraphCanvas.onMenuNodeMode = function(value, options, e, menu, node2) {
        new LiteGraph.ContextMenu(
          LiteGraph.NODE_MODES,
          { event: e, callback: inner_clicked, parentMenu: menu, node: node2 }
        );
        function inner_clicked(v2) {
          if (!node2) {
            return;
          }
          var kV = Object.values(LiteGraph.NODE_MODES).indexOf(v2);
          var fApplyMultiNode = function(node3) {
            if (kV >= 0 && LiteGraph.NODE_MODES[kV])
              node3.changeMode(kV);
            else {
              console.warn("unexpected mode: " + v2);
              node3.changeMode(LiteGraph.ALWAYS);
            }
          };
          var graphcanvas = LGraphCanvas.active_canvas;
          if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
            fApplyMultiNode(node2);
          } else {
            for (var i2 in graphcanvas.selected_nodes) {
              fApplyMultiNode(graphcanvas.selected_nodes[i2]);
            }
          }
        }
        return false;
      };
      LGraphCanvas.onMenuNodeColors = function(value, options, e, menu, node2) {
        if (!node2) {
          throw "no node for color";
        }
        var values2 = [];
        values2.push({
          value: null,
          content: "<span style='display: block; padding-left: 4px;'>No color</span>"
        });
        for (var i2 in LGraphCanvas.node_colors) {
          var color = LGraphCanvas.node_colors[i2];
          var value = {
            value: i2,
            content: "<span style='display: block; color: #999; padding-left: 4px; border-left: 8px solid " + color.color + "; background-color:" + color.bgcolor + "'>" + i2 + "</span>"
          };
          values2.push(value);
        }
        new LiteGraph.ContextMenu(values2, {
          event: e,
          callback: inner_clicked,
          parentMenu: menu,
          node: node2
        });
        function inner_clicked(v2) {
          if (!node2) {
            return;
          }
          var color2 = v2.value ? LGraphCanvas.node_colors[v2.value] : null;
          var fApplyColor = function(node3) {
            if (color2) {
              if (node3.constructor === LiteGraph.LGraphGroup) {
                node3.color = color2.groupcolor;
              } else {
                node3.color = color2.color;
                node3.bgcolor = color2.bgcolor;
              }
            } else {
              delete node3.color;
              delete node3.bgcolor;
            }
          };
          var graphcanvas = LGraphCanvas.active_canvas;
          if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
            fApplyColor(node2);
          } else {
            for (var i3 in graphcanvas.selected_nodes) {
              fApplyColor(graphcanvas.selected_nodes[i3]);
            }
          }
          node2.setDirtyCanvas(true, true);
        }
        return false;
      };
      LGraphCanvas.onMenuNodeShapes = function(value, options, e, menu, node2) {
        if (!node2) {
          throw "no node passed";
        }
        new LiteGraph.ContextMenu(LiteGraph.VALID_SHAPES, {
          event: e,
          callback: inner_clicked,
          parentMenu: menu,
          node: node2
        });
        function inner_clicked(v2) {
          if (!node2) {
            return;
          }
          node2.graph.beforeChange(
            /*?*/
          );
          var fApplyMultiNode = function(node3) {
            node3.shape = v2;
          };
          var graphcanvas = LGraphCanvas.active_canvas;
          if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
            fApplyMultiNode(node2);
          } else {
            for (var i2 in graphcanvas.selected_nodes) {
              fApplyMultiNode(graphcanvas.selected_nodes[i2]);
            }
          }
          node2.graph.afterChange(
            /*?*/
          );
          node2.setDirtyCanvas(true);
        }
        return false;
      };
      LGraphCanvas.onMenuNodeRemove = function(value, options, e, menu, node2) {
        if (!node2) {
          throw "no node passed";
        }
        var graph = node2.graph;
        graph.beforeChange();
        var fApplyMultiNode = function(node3) {
          if (node3.removable === false) {
            return;
          }
          graph.remove(node3);
        };
        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
          fApplyMultiNode(node2);
        } else {
          for (var i2 in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i2]);
          }
        }
        graph.afterChange();
        node2.setDirtyCanvas(true, true);
      };
      LGraphCanvas.onMenuNodeToSubgraph = function(value, options, e, menu, node2) {
        var graph = node2.graph;
        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas)
          return;
        var nodes_list = Object.values(graphcanvas.selected_nodes || {});
        if (!nodes_list.length)
          nodes_list = [node2];
        var subgraph_node = LiteGraph.createNode("graph/subgraph");
        subgraph_node.pos = node2.pos.concat();
        graph.add(subgraph_node);
        subgraph_node.buildFromNodes(nodes_list);
        graphcanvas.deselectAllNodes();
        node2.setDirtyCanvas(true, true);
      };
      LGraphCanvas.onMenuNodeClone = function(value, options, e, menu, node2) {
        node2.graph.beforeChange();
        var newSelected = {};
        var fApplyMultiNode = function(node3) {
          if (node3.clonable === false) {
            return;
          }
          var newnode = node3.clone();
          if (!newnode) {
            return;
          }
          newnode.pos = [node3.pos[0] + 5, node3.pos[1] + 5];
          node3.graph.add(newnode);
          newSelected[newnode.id] = newnode;
        };
        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
          fApplyMultiNode(node2);
        } else {
          for (var i2 in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i2]);
          }
        }
        if (Object.keys(newSelected).length) {
          graphcanvas.selectNodes(newSelected);
        }
        node2.graph.afterChange();
        node2.setDirtyCanvas(true, true);
      };
      LGraphCanvas.node_colors = {
        red: { color: "#322", bgcolor: "#533", groupcolor: "#A88" },
        brown: { color: "#332922", bgcolor: "#593930", groupcolor: "#b06634" },
        green: { color: "#232", bgcolor: "#353", groupcolor: "#8A8" },
        blue: { color: "#223", bgcolor: "#335", groupcolor: "#88A" },
        pale_blue: {
          color: "#2a363b",
          bgcolor: "#3f5159",
          groupcolor: "#3f789e"
        },
        cyan: { color: "#233", bgcolor: "#355", groupcolor: "#8AA" },
        purple: { color: "#323", bgcolor: "#535", groupcolor: "#a1309b" },
        yellow: { color: "#432", bgcolor: "#653", groupcolor: "#b58b2a" },
        black: { color: "#222", bgcolor: "#000", groupcolor: "#444" }
      };
      LGraphCanvas.prototype.getCanvasMenuOptions = function() {
        var options = null;
        if (this.getMenuOptions) {
          options = this.getMenuOptions();
        } else {
          options = [
            {
              content: "Add Node",
              has_submenu: true,
              callback: LGraphCanvas.onMenuAdd
            },
            { content: "Add Group", callback: LGraphCanvas.onGroupAdd }
            //{ content: "Arrange", callback: that.graph.arrange },
            //{content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
          ];
          if (Object.keys(this.selected_nodes).length > 1) {
            options.push({
              content: "Align",
              has_submenu: true,
              callback: LGraphCanvas.onGroupAlign
            });
          }
          if (this._graph_stack && this._graph_stack.length > 0) {
            options.push(null, {
              content: "Close subgraph",
              callback: this.closeSubgraph.bind(this)
            });
          }
        }
        if (this.getExtraMenuOptions) {
          var extra = this.getExtraMenuOptions(this, options);
          if (extra) {
            options = options.concat(extra);
          }
        }
        return options;
      };
      LGraphCanvas.prototype.getNodeMenuOptions = function(node2) {
        var options = null;
        if (node2.getMenuOptions) {
          options = node2.getMenuOptions(this);
        } else {
          options = [
            {
              content: "Inputs",
              has_submenu: true,
              disabled: true,
              callback: LGraphCanvas.showMenuNodeOptionalInputs
            },
            {
              content: "Outputs",
              has_submenu: true,
              disabled: true,
              callback: LGraphCanvas.showMenuNodeOptionalOutputs
            },
            null,
            {
              content: "Properties",
              has_submenu: true,
              callback: LGraphCanvas.onShowMenuNodeProperties
            },
            null,
            {
              content: "Title",
              callback: LGraphCanvas.onShowPropertyEditor
            },
            {
              content: "Mode",
              has_submenu: true,
              callback: LGraphCanvas.onMenuNodeMode
            }
          ];
          if (node2.resizable !== false) {
            options.push({
              content: "Resize",
              callback: LGraphCanvas.onMenuResizeNode
            });
          }
          options.push(
            {
              content: "Collapse",
              callback: LGraphCanvas.onMenuNodeCollapse
            },
            { content: "Pin", callback: LGraphCanvas.onMenuNodePin },
            {
              content: "Colors",
              has_submenu: true,
              callback: LGraphCanvas.onMenuNodeColors
            },
            {
              content: "Shapes",
              has_submenu: true,
              callback: LGraphCanvas.onMenuNodeShapes
            },
            null
          );
        }
        if (node2.onGetInputs) {
          var inputs = node2.onGetInputs();
          if (inputs && inputs.length) {
            options[0].disabled = false;
          }
        }
        if (node2.onGetOutputs) {
          var outputs = node2.onGetOutputs();
          if (outputs && outputs.length) {
            options[1].disabled = false;
          }
        }
        if (node2.getExtraMenuOptions) {
          var extra = node2.getExtraMenuOptions(this, options);
          if (extra) {
            extra.push(null);
            options = extra.concat(options);
          }
        }
        if (node2.clonable !== false) {
          options.push({
            content: "Clone",
            callback: LGraphCanvas.onMenuNodeClone
          });
        }
        if (Object.keys(this.selected_nodes).length > 1) {
          options.push({
            content: "Align Selected To",
            has_submenu: true,
            callback: LGraphCanvas.onNodeAlign
          });
        }
        options.push(null, {
          content: "Remove",
          disabled: !(node2.removable !== false && !node2.block_delete),
          callback: LGraphCanvas.onMenuNodeRemove
        });
        if (node2.graph && node2.graph.onGetNodeMenuOptions) {
          node2.graph.onGetNodeMenuOptions(options, node2);
        }
        return options;
      };
      LGraphCanvas.prototype.getGroupMenuOptions = function(node2) {
        var o = [
          { content: "Title", callback: LGraphCanvas.onShowPropertyEditor },
          {
            content: "Color",
            has_submenu: true,
            callback: LGraphCanvas.onMenuNodeColors
          },
          {
            content: "Font size",
            property: "font_size",
            type: "Number",
            callback: LGraphCanvas.onShowPropertyEditor
          },
          null,
          { content: "Remove", callback: LGraphCanvas.onMenuNodeRemove }
        ];
        return o;
      };
      LGraphCanvas.prototype.processContextMenu = function(node2, event2) {
        var that2 = this;
        var canvas = LGraphCanvas.active_canvas;
        var ref_window2 = canvas.getCanvasWindow();
        var menu_info = null;
        var options = {
          event: event2,
          callback: inner_option_clicked,
          extra: node2
        };
        if (node2)
          options.title = node2.type;
        var slot = null;
        if (node2) {
          slot = node2.getSlotInPosition(event2.canvasX, event2.canvasY);
          LGraphCanvas.active_node = node2;
        }
        if (slot) {
          menu_info = [];
          if (node2.getSlotMenuOptions) {
            menu_info = node2.getSlotMenuOptions(slot);
          } else {
            if (slot && slot.output && slot.output.links && slot.output.links.length) {
              menu_info.push({ content: "Disconnect Links", slot });
            }
            var _slot = slot.input || slot.output;
            if (_slot.removable) {
              menu_info.push(
                _slot.locked ? "Cannot remove" : { content: "Remove Slot", slot }
              );
            }
            if (!_slot.nameLocked) {
              menu_info.push({ content: "Rename Slot", slot });
            }
          }
          options.title = (slot.input ? slot.input.type : slot.output.type) || "*";
          if (slot.input && slot.input.type == LiteGraph.ACTION) {
            options.title = "Action";
          }
          if (slot.output && slot.output.type == LiteGraph.EVENT) {
            options.title = "Event";
          }
        } else {
          if (node2) {
            menu_info = this.getNodeMenuOptions(node2);
          } else {
            menu_info = this.getCanvasMenuOptions();
            var group = this.graph.getGroupOnPos(
              event2.canvasX,
              event2.canvasY
            );
            if (group) {
              menu_info.push(null, {
                content: "Edit Group",
                has_submenu: true,
                submenu: {
                  title: "Group",
                  extra: group,
                  options: this.getGroupMenuOptions(group)
                }
              });
            }
          }
        }
        if (!menu_info) {
          return;
        }
        new LiteGraph.ContextMenu(menu_info, options, ref_window2);
        function inner_option_clicked(v2, options2, e) {
          if (!v2) {
            return;
          }
          if (v2.content == "Remove Slot") {
            var info = v2.slot;
            node2.graph.beforeChange();
            if (info.input) {
              node2.removeInput(info.slot);
            } else if (info.output) {
              node2.removeOutput(info.slot);
            }
            node2.graph.afterChange();
            return;
          } else if (v2.content == "Disconnect Links") {
            var info = v2.slot;
            node2.graph.beforeChange();
            if (info.output) {
              node2.disconnectOutput(info.slot);
            } else if (info.input) {
              node2.disconnectInput(info.slot);
            }
            node2.graph.afterChange();
            return;
          } else if (v2.content == "Rename Slot") {
            var info = v2.slot;
            var slot_info = info.input ? node2.getInputInfo(info.slot) : node2.getOutputInfo(info.slot);
            var dialog = that2.createDialog(
              "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
              options2
            );
            var input = dialog.querySelector("input");
            if (input && slot_info) {
              input.value = slot_info.label || "";
            }
            var inner = function() {
              node2.graph.beforeChange();
              if (input.value) {
                if (slot_info) {
                  slot_info.label = input.value;
                }
                that2.setDirty(true);
              }
              dialog.close();
              node2.graph.afterChange();
            };
            dialog.querySelector("button").addEventListener("click", inner);
            input.addEventListener("keydown", function(e2) {
              dialog.is_modified = true;
              if (e2.keyCode == 27) {
                dialog.close();
              } else if (e2.keyCode == 13) {
                inner();
              } else if (e2.keyCode != 13 && e2.target.localName != "textarea") {
                return;
              }
              e2.preventDefault();
              e2.stopPropagation();
            });
            input.focus();
          }
        }
      };
      function compareObjects(a, b) {
        for (var i2 in a) {
          if (a[i2] != b[i2]) {
            return false;
          }
        }
        return true;
      }
      LiteGraph.compareObjects = compareObjects;
      function distance(a, b) {
        return Math.sqrt(
          (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])
        );
      }
      LiteGraph.distance = distance;
      function colorToString(c) {
        return "rgba(" + Math.round(c[0] * 255).toFixed() + "," + Math.round(c[1] * 255).toFixed() + "," + Math.round(c[2] * 255).toFixed() + "," + (c.length == 4 ? c[3].toFixed(2) : "1.0") + ")";
      }
      LiteGraph.colorToString = colorToString;
      function isInsideRectangle(x2, y2, left, top, width2, height) {
        if (left < x2 && left + width2 > x2 && top < y2 && top + height > y2) {
          return true;
        }
        return false;
      }
      LiteGraph.isInsideRectangle = isInsideRectangle;
      function growBounding(bounding, x2, y2) {
        if (x2 < bounding[0]) {
          bounding[0] = x2;
        } else if (x2 > bounding[2]) {
          bounding[2] = x2;
        }
        if (y2 < bounding[1]) {
          bounding[1] = y2;
        } else if (y2 > bounding[3]) {
          bounding[3] = y2;
        }
      }
      LiteGraph.growBounding = growBounding;
      function isInsideBounding(p2, bb) {
        if (p2[0] < bb[0][0] || p2[1] < bb[0][1] || p2[0] > bb[1][0] || p2[1] > bb[1][1]) {
          return false;
        }
        return true;
      }
      LiteGraph.isInsideBounding = isInsideBounding;
      function overlapBounding(a, b) {
        var A_end_x = a[0] + a[2];
        var A_end_y = a[1] + a[3];
        var B_end_x = b[0] + b[2];
        var B_end_y = b[1] + b[3];
        if (a[0] > B_end_x || a[1] > B_end_y || A_end_x < b[0] || A_end_y < b[1]) {
          return false;
        }
        return true;
      }
      LiteGraph.overlapBounding = overlapBounding;
      function hex2num(hex) {
        if (hex.charAt(0) == "#") {
          hex = hex.slice(1);
        }
        hex = hex.toUpperCase();
        var hex_alphabets = "0123456789ABCDEF";
        var value = new Array(3);
        var k = 0;
        var int1, int2;
        for (var i2 = 0; i2 < 6; i2 += 2) {
          int1 = hex_alphabets.indexOf(hex.charAt(i2));
          int2 = hex_alphabets.indexOf(hex.charAt(i2 + 1));
          value[k] = int1 * 16 + int2;
          k++;
        }
        return value;
      }
      LiteGraph.hex2num = hex2num;
      function num2hex(triplet) {
        var hex_alphabets = "0123456789ABCDEF";
        var hex = "#";
        var int1, int2;
        for (var i2 = 0; i2 < 3; i2++) {
          int1 = triplet[i2] / 16;
          int2 = triplet[i2] % 16;
          hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
        }
        return hex;
      }
      LiteGraph.num2hex = num2hex;
      function ContextMenu(values2, options) {
        options = options || {};
        this.options = options;
        var that2 = this;
        if (options.parentMenu) {
          if (options.parentMenu.constructor !== this.constructor) {
            console.error(
              "parentMenu must be of class ContextMenu, ignoring it"
            );
            options.parentMenu = null;
          } else {
            this.parentMenu = options.parentMenu;
            this.parentMenu.lock = true;
            this.parentMenu.current_submenu = this;
          }
        }
        var eventClass = null;
        if (options.event)
          eventClass = options.event.constructor.name;
        if (eventClass !== "MouseEvent" && eventClass !== "CustomEvent" && eventClass !== "PointerEvent") {
          console.error(
            "Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (" + eventClass + ")"
          );
          options.event = null;
        }
        var root = document.createElement("div");
        root.className = "litegraph litecontextmenu litemenubar-panel";
        if (options.className) {
          root.className += " " + options.className;
        }
        root.style.minWidth = 100;
        root.style.minHeight = 100;
        root.style.pointerEvents = "none";
        setTimeout(function() {
          root.style.pointerEvents = "auto";
        }, 100);
        LiteGraph.pointerListenerAdd(
          root,
          "up",
          function(e) {
            e.preventDefault();
            return true;
          },
          true
        );
        root.addEventListener(
          "contextmenu",
          function(e) {
            if (e.button != 2) {
              return false;
            }
            e.preventDefault();
            return false;
          },
          true
        );
        LiteGraph.pointerListenerAdd(
          root,
          "down",
          function(e) {
            if (e.button == 2) {
              that2.close();
              e.preventDefault();
              return true;
            }
          },
          true
        );
        function on_mouse_wheel(e) {
          var pos2 = parseInt(root.style.top);
          root.style.top = (pos2 + e.deltaY * options.scroll_speed).toFixed() + "px";
          e.preventDefault();
          return true;
        }
        if (!options.scroll_speed) {
          options.scroll_speed = 0.1;
        }
        root.addEventListener("wheel", on_mouse_wheel, true);
        root.addEventListener("mousewheel", on_mouse_wheel, true);
        this.root = root;
        if (options.title) {
          var element = document.createElement("div");
          element.className = "litemenu-title";
          element.innerHTML = options.title;
          root.appendChild(element);
        }
        for (var i2 = 0; i2 < values2.length; i2++) {
          var name = values2.constructor == Array ? values2[i2] : i2;
          if (name != null && name.constructor !== String) {
            name = name.content === void 0 ? String(name) : name.content;
          }
          var value = values2[i2];
          this.addItem(name, value, options);
        }
        LiteGraph.pointerListenerAdd(root, "enter", function(e) {
          if (root.closing_timer) {
            clearTimeout(root.closing_timer);
          }
        });
        var root_document = document;
        if (options.event) {
          root_document = options.event.target.ownerDocument;
        }
        if (!root_document) {
          root_document = document;
        }
        if (root_document.fullscreenElement)
          root_document.fullscreenElement.appendChild(root);
        else
          root_document.body.appendChild(root);
        var left = options.left || 0;
        var top = options.top || 0;
        if (options.event) {
          left = options.event.clientX - 10;
          top = options.event.clientY - 10;
          if (options.title) {
            top -= 20;
          }
          if (options.parentMenu) {
            var rect = options.parentMenu.root.getBoundingClientRect();
            left = rect.left + rect.width;
          }
          var body_rect = document.body.getBoundingClientRect();
          var root_rect = root.getBoundingClientRect();
          if (body_rect.height == 0)
            console.error("document.body height is 0. That is dangerous, set html,body { height: 100%; }");
          if (body_rect.width && left > body_rect.width - root_rect.width - 10) {
            left = body_rect.width - root_rect.width - 10;
          }
          if (body_rect.height && top > body_rect.height - root_rect.height - 10) {
            top = body_rect.height - root_rect.height - 10;
          }
        }
        root.style.left = left + "px";
        root.style.top = top + "px";
        if (options.scale) {
          root.style.transform = "scale(" + options.scale + ")";
        }
      }
      ContextMenu.prototype.addItem = function(name, value, options) {
        var that2 = this;
        options = options || {};
        var element = document.createElement("div");
        element.className = "litemenu-entry submenu";
        var disabled = false;
        if (value === null) {
          element.classList.add("separator");
        } else {
          element.innerHTML = value && value.title ? value.title : name;
          element.value = value;
          if (value) {
            if (value.disabled) {
              disabled = true;
              element.classList.add("disabled");
            }
            if (value.submenu || value.has_submenu) {
              element.classList.add("has_submenu");
            }
          }
          if (typeof value == "function") {
            element.dataset["value"] = name;
            element.onclick_callback = value;
          } else {
            element.dataset["value"] = value;
          }
          if (value.className) {
            element.className += " " + value.className;
          }
        }
        this.root.appendChild(element);
        if (!disabled) {
          element.addEventListener("click", inner_onclick);
        }
        if (!disabled && options.autoopen) {
          LiteGraph.pointerListenerAdd(element, "enter", inner_over);
        }
        function inner_over(e) {
          var value2 = this.value;
          if (!value2 || !value2.has_submenu) {
            return;
          }
          inner_onclick.call(this, e);
        }
        function inner_onclick(e) {
          var value2 = this.value;
          var close_parent = true;
          if (that2.current_submenu) {
            that2.current_submenu.close(e);
          }
          if (options.callback) {
            var r = options.callback.call(
              this,
              value2,
              options,
              e,
              that2,
              options.node
            );
            if (r === true) {
              close_parent = false;
            }
          }
          if (value2) {
            if (value2.callback && !options.ignore_item_callbacks && value2.disabled !== true) {
              var r = value2.callback.call(
                this,
                value2,
                options,
                e,
                that2,
                options.extra
              );
              if (r === true) {
                close_parent = false;
              }
            }
            if (value2.submenu) {
              if (!value2.submenu.options) {
                throw "ContextMenu submenu needs options";
              }
              new that2.constructor(value2.submenu.options, {
                callback: value2.submenu.callback,
                event: e,
                parentMenu: that2,
                ignore_item_callbacks: value2.submenu.ignore_item_callbacks,
                title: value2.submenu.title,
                extra: value2.submenu.extra,
                autoopen: options.autoopen
              });
              close_parent = false;
            }
          }
          if (close_parent && !that2.lock) {
            that2.close();
          }
        }
        return element;
      };
      ContextMenu.prototype.close = function(e, ignore_parent_menu) {
        if (this.root.parentNode) {
          this.root.parentNode.removeChild(this.root);
        }
        if (this.parentMenu && !ignore_parent_menu) {
          this.parentMenu.lock = false;
          this.parentMenu.current_submenu = null;
          if (e === void 0) {
            this.parentMenu.close();
          } else if (e && !ContextMenu.isCursorOverElement(e, this.parentMenu.root)) {
            ContextMenu.trigger(this.parentMenu.root, LiteGraph.pointerevents_method + "leave", e);
          }
        }
        if (this.current_submenu) {
          this.current_submenu.close(e, true);
        }
        if (this.root.closing_timer) {
          clearTimeout(this.root.closing_timer);
        }
      };
      ContextMenu.trigger = function(element, event_name, params, origin) {
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event_name, true, true, params);
        evt.srcElement = origin;
        if (element.dispatchEvent) {
          element.dispatchEvent(evt);
        } else if (element.__events) {
          element.__events.dispatchEvent(evt);
        }
        return evt;
      };
      ContextMenu.prototype.getTopMenu = function() {
        if (this.options.parentMenu) {
          return this.options.parentMenu.getTopMenu();
        }
        return this;
      };
      ContextMenu.prototype.getFirstEvent = function() {
        if (this.options.parentMenu) {
          return this.options.parentMenu.getFirstEvent();
        }
        return this.options.event;
      };
      ContextMenu.isCursorOverElement = function(event2, element) {
        var left = event2.clientX;
        var top = event2.clientY;
        var rect = element.getBoundingClientRect();
        if (!rect) {
          return false;
        }
        if (top > rect.top && top < rect.top + rect.height && left > rect.left && left < rect.left + rect.width) {
          return true;
        }
        return false;
      };
      LiteGraph.ContextMenu = ContextMenu;
      LiteGraph.closeAllContextMenus = function(ref_window2) {
        ref_window2 = ref_window2 || window;
        var elements = ref_window2.document.querySelectorAll(".litecontextmenu");
        if (!elements.length) {
          return;
        }
        var result = [];
        for (var i2 = 0; i2 < elements.length; i2++) {
          result.push(elements[i2]);
        }
        for (var i2 = 0; i2 < result.length; i2++) {
          if (result[i2].close) {
            result[i2].close();
          } else if (result[i2].parentNode) {
            result[i2].parentNode.removeChild(result[i2]);
          }
        }
      };
      LiteGraph.extendClass = function(target, origin) {
        for (var i2 in origin) {
          if (target.hasOwnProperty(i2)) {
            continue;
          }
          target[i2] = origin[i2];
        }
        if (origin.prototype) {
          for (var i2 in origin.prototype) {
            if (!origin.prototype.hasOwnProperty(i2)) {
              continue;
            }
            if (target.prototype.hasOwnProperty(i2)) {
              continue;
            }
            if (origin.prototype.__lookupGetter__(i2)) {
              target.prototype.__defineGetter__(
                i2,
                origin.prototype.__lookupGetter__(i2)
              );
            } else {
              target.prototype[i2] = origin.prototype[i2];
            }
            if (origin.prototype.__lookupSetter__(i2)) {
              target.prototype.__defineSetter__(
                i2,
                origin.prototype.__lookupSetter__(i2)
              );
            }
          }
        }
      };
      function CurveEditor(points) {
        this.points = points;
        this.selected = -1;
        this.nearest = -1;
        this.size = null;
        this.must_update = true;
        this.margin = 5;
      }
      CurveEditor.sampleCurve = function(f, points) {
        if (!points)
          return;
        for (var i2 = 0; i2 < points.length - 1; ++i2) {
          var p2 = points[i2];
          var pn = points[i2 + 1];
          if (pn[0] < f)
            continue;
          var r = pn[0] - p2[0];
          if (Math.abs(r) < 1e-5)
            return p2[1];
          var local_f = (f - p2[0]) / r;
          return p2[1] * (1 - local_f) + pn[1] * local_f;
        }
        return 0;
      };
      CurveEditor.prototype.draw = function(ctx, size, graphcanvas, background_color, line_color, inactive) {
        var points = this.points;
        if (!points)
          return;
        this.size = size;
        var w2 = size[0] - this.margin * 2;
        var h = size[1] - this.margin * 2;
        line_color = line_color || "#666";
        ctx.save();
        ctx.translate(this.margin, this.margin);
        if (background_color) {
          ctx.fillStyle = "#111";
          ctx.fillRect(0, 0, w2, h);
          ctx.fillStyle = "#222";
          ctx.fillRect(w2 * 0.5, 0, 1, h);
          ctx.strokeStyle = "#333";
          ctx.strokeRect(0, 0, w2, h);
        }
        ctx.strokeStyle = line_color;
        if (inactive)
          ctx.globalAlpha = 0.5;
        ctx.beginPath();
        for (var i2 = 0; i2 < points.length; ++i2) {
          var p2 = points[i2];
          ctx.lineTo(p2[0] * w2, (1 - p2[1]) * h);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (!inactive)
          for (var i2 = 0; i2 < points.length; ++i2) {
            var p2 = points[i2];
            ctx.fillStyle = this.selected == i2 ? "#FFF" : this.nearest == i2 ? "#DDD" : "#AAA";
            ctx.beginPath();
            ctx.arc(p2[0] * w2, (1 - p2[1]) * h, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        ctx.restore();
      };
      CurveEditor.prototype.onMouseDown = function(localpos, graphcanvas) {
        var points = this.points;
        if (!points)
          return;
        if (localpos[1] < 0)
          return;
        var w2 = this.size[0] - this.margin * 2;
        var h = this.size[1] - this.margin * 2;
        var x2 = localpos[0] - this.margin;
        var y2 = localpos[1] - this.margin;
        var pos2 = [x2, y2];
        var max_dist = 30 / graphcanvas.ds.scale;
        this.selected = this.getCloserPoint(pos2, max_dist);
        if (this.selected == -1) {
          var point = [x2 / w2, 1 - y2 / h];
          points.push(point);
          points.sort(function(a, b) {
            return a[0] - b[0];
          });
          this.selected = points.indexOf(point);
          this.must_update = true;
        }
        if (this.selected != -1)
          return true;
      };
      CurveEditor.prototype.onMouseMove = function(localpos, graphcanvas) {
        var points = this.points;
        if (!points)
          return;
        var s = this.selected;
        if (s < 0)
          return;
        var x2 = (localpos[0] - this.margin) / (this.size[0] - this.margin * 2);
        var y2 = (localpos[1] - this.margin) / (this.size[1] - this.margin * 2);
        var curvepos = [localpos[0] - this.margin, localpos[1] - this.margin];
        var max_dist = 30 / graphcanvas.ds.scale;
        this._nearest = this.getCloserPoint(curvepos, max_dist);
        var point = points[s];
        if (point) {
          var is_edge_point = s == 0 || s == points.length - 1;
          if (!is_edge_point && (localpos[0] < -10 || localpos[0] > this.size[0] + 10 || localpos[1] < -10 || localpos[1] > this.size[1] + 10)) {
            points.splice(s, 1);
            this.selected = -1;
            return;
          }
          if (!is_edge_point)
            point[0] = clamp(x2, 0, 1);
          else
            point[0] = s == 0 ? 0 : 1;
          point[1] = 1 - clamp(y2, 0, 1);
          points.sort(function(a, b) {
            return a[0] - b[0];
          });
          this.selected = points.indexOf(point);
          this.must_update = true;
        }
      };
      CurveEditor.prototype.onMouseUp = function(localpos, graphcanvas) {
        this.selected = -1;
        return false;
      };
      CurveEditor.prototype.getCloserPoint = function(pos2, max_dist) {
        var points = this.points;
        if (!points)
          return -1;
        max_dist = max_dist || 30;
        var w2 = this.size[0] - this.margin * 2;
        var h = this.size[1] - this.margin * 2;
        var num = points.length;
        var p2 = [0, 0];
        var min_dist = 1e6;
        var closest = -1;
        for (var i2 = 0; i2 < num; ++i2) {
          var p3 = points[i2];
          p2[0] = p3[0] * w2;
          p2[1] = (1 - p3[1]) * h;
          if (p2[0] < pos2[0])
            ;
          var dist = vec2.distance(pos2, p2);
          if (dist > min_dist || dist > max_dist)
            continue;
          closest = i2;
          min_dist = dist;
        }
        return closest;
      };
      LiteGraph.CurveEditor = CurveEditor;
      LiteGraph.getParameterNames = function(func) {
        return (func + "").replace(/[/][/].*$/gm, "").replace(/\s+/g, "").replace(/[/][*][^/*]*[*][/]/g, "").split("){", 1)[0].replace(/^[^(]*[(]/, "").replace(/=[^,]+/g, "").split(",").filter(Boolean);
      };
      LiteGraph.pointerListenerAdd = function(oDOM, sEvIn, fCall, capture = false) {
        if (!oDOM || !oDOM.addEventListener || !sEvIn || typeof fCall !== "function") {
          return;
        }
        var sMethod = LiteGraph.pointerevents_method;
        var sEvent = sEvIn;
        if (sMethod == "pointer" && !window.PointerEvent) {
          console.warn("sMethod=='pointer' && !window.PointerEvent");
          console.log("Converting pointer[" + sEvent + "] : down move up cancel enter TO touchstart touchmove touchend, etc ..");
          switch (sEvent) {
            case "down": {
              sMethod = "touch";
              sEvent = "start";
              break;
            }
            case "move": {
              sMethod = "touch";
              break;
            }
            case "up": {
              sMethod = "touch";
              sEvent = "end";
              break;
            }
            case "cancel": {
              sMethod = "touch";
              break;
            }
            case "enter": {
              console.log("debug: Should I send a move event?");
              break;
            }
            // case "over": case "out": not used at now
            default: {
              console.warn("PointerEvent not available in this browser ? The event " + sEvent + " would not be called");
            }
          }
        }
        switch (sEvent) {
          //both pointer and move events
          case "down":
          case "up":
          case "move":
          case "over":
          case "out":
          case "enter": {
            oDOM.addEventListener(sMethod + sEvent, fCall, capture);
          }
          // only pointerevents
          case "leave":
          case "cancel":
          case "gotpointercapture":
          case "lostpointercapture": {
            if (sMethod != "mouse") {
              return oDOM.addEventListener(sMethod + sEvent, fCall, capture);
            }
          }
          // not "pointer" || "mouse"
          default:
            return oDOM.addEventListener(sEvent, fCall, capture);
        }
      };
      LiteGraph.pointerListenerRemove = function(oDOM, sEvent, fCall, capture = false) {
        if (!oDOM || !oDOM.removeEventListener || !sEvent || typeof fCall !== "function") {
          return;
        }
        switch (sEvent) {
          //both pointer and move events
          case "down":
          case "up":
          case "move":
          case "over":
          case "out":
          case "enter": {
            if (LiteGraph.pointerevents_method == "pointer" || LiteGraph.pointerevents_method == "mouse") {
              oDOM.removeEventListener(LiteGraph.pointerevents_method + sEvent, fCall, capture);
            }
          }
          // only pointerevents
          case "leave":
          case "cancel":
          case "gotpointercapture":
          case "lostpointercapture": {
            if (LiteGraph.pointerevents_method == "pointer") {
              return oDOM.removeEventListener(LiteGraph.pointerevents_method + sEvent, fCall, capture);
            }
          }
          // not "pointer" || "mouse"
          default:
            return oDOM.removeEventListener(sEvent, fCall, capture);
        }
      };
      function clamp(v2, a, b) {
        return a > v2 ? a : b < v2 ? b : v2;
      }
      global.clamp = clamp;
      if (typeof window != "undefined" && !window["requestAnimationFrame"]) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1e3 / 60);
        };
      }
    })(litegraph);
    {
      exports.LiteGraph = litegraph.LiteGraph;
      exports.LGraph = litegraph.LGraph;
      exports.LLink = litegraph.LLink;
      exports.LGraphNode = litegraph.LGraphNode;
      exports.LGraphGroup = litegraph.LGraphGroup;
      exports.DragAndScale = litegraph.DragAndScale;
      exports.LGraphCanvas = litegraph.LGraphCanvas;
      exports.ContextMenu = litegraph.ContextMenu;
    }
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function Time() {
        this.addOutput("in ms", "number");
        this.addOutput("in sec", "number");
      }
      Time.title = "Time";
      Time.desc = "Time";
      Time.prototype.onExecute = function() {
        this.setOutputData(0, this.graph.globaltime * 1e3);
        this.setOutputData(1, this.graph.globaltime);
      };
      LiteGraph2.registerNodeType("basic/time", Time);
      function Subgraph() {
        this.size = [140, 80];
        this.properties = { enabled: true };
        this.enabled = true;
        this.subgraph = new LiteGraph2.LGraph();
        this.subgraph._subgraph_node = this;
        this.subgraph._is_subgraph = true;
        this.subgraph.onTrigger = this.onSubgraphTrigger.bind(this);
        this.subgraph.onInputAdded = this.onSubgraphNewInput.bind(this);
        this.subgraph.onInputRenamed = this.onSubgraphRenamedInput.bind(this);
        this.subgraph.onInputTypeChanged = this.onSubgraphTypeChangeInput.bind(this);
        this.subgraph.onInputRemoved = this.onSubgraphRemovedInput.bind(this);
        this.subgraph.onOutputAdded = this.onSubgraphNewOutput.bind(this);
        this.subgraph.onOutputRenamed = this.onSubgraphRenamedOutput.bind(this);
        this.subgraph.onOutputTypeChanged = this.onSubgraphTypeChangeOutput.bind(this);
        this.subgraph.onOutputRemoved = this.onSubgraphRemovedOutput.bind(this);
      }
      Subgraph.title = "Subgraph";
      Subgraph.desc = "Graph inside a node";
      Subgraph.title_color = "#334";
      Subgraph.prototype.onGetInputs = function() {
        return [["enabled", "boolean"]];
      };
      Subgraph.prototype.onDblClick = function(e, pos2, graphcanvas) {
        var that2 = this;
        setTimeout(function() {
          graphcanvas.openSubgraph(that2.subgraph);
        }, 10);
      };
      Subgraph.prototype.onAction = function(action, param) {
        this.subgraph.onAction(action, param);
      };
      Subgraph.prototype.onExecute = function() {
        this.enabled = this.getInputOrProperty("enabled");
        if (!this.enabled) {
          return;
        }
        if (this.inputs) {
          for (var i2 = 0; i2 < this.inputs.length; i2++) {
            var input = this.inputs[i2];
            var value = this.getInputData(i2);
            this.subgraph.setInputData(input.name, value);
          }
        }
        this.subgraph.runStep();
        if (this.outputs) {
          for (var i2 = 0; i2 < this.outputs.length; i2++) {
            var output = this.outputs[i2];
            var value = this.subgraph.getOutputData(output.name);
            this.setOutputData(i2, value);
          }
        }
      };
      Subgraph.prototype.sendEventToAllNodes = function(eventname, param, mode) {
        if (this.enabled) {
          this.subgraph.sendEventToAllNodes(eventname, param, mode);
        }
      };
      Subgraph.prototype.onDrawBackground = function(ctx, graphcanvas, canvas, pos2) {
        if (this.flags.collapsed)
          return;
        var y2 = this.size[1] - LiteGraph2.NODE_TITLE_HEIGHT + 0.5;
        var over = LiteGraph2.isInsideRectangle(pos2[0], pos2[1], this.pos[0], this.pos[1] + y2, this.size[0], LiteGraph2.NODE_TITLE_HEIGHT);
        let overleft = LiteGraph2.isInsideRectangle(pos2[0], pos2[1], this.pos[0], this.pos[1] + y2, this.size[0] / 2, LiteGraph2.NODE_TITLE_HEIGHT);
        ctx.fillStyle = over ? "#555" : "#222";
        ctx.beginPath();
        if (this._shape == LiteGraph2.BOX_SHAPE) {
          if (overleft) {
            ctx.rect(0, y2, this.size[0] / 2 + 1, LiteGraph2.NODE_TITLE_HEIGHT);
          } else {
            ctx.rect(this.size[0] / 2, y2, this.size[0] / 2 + 1, LiteGraph2.NODE_TITLE_HEIGHT);
          }
        } else {
          if (overleft) {
            ctx.roundRect(0, y2, this.size[0] / 2 + 1, LiteGraph2.NODE_TITLE_HEIGHT, [0, 0, 8, 8]);
          } else {
            ctx.roundRect(this.size[0] / 2, y2, this.size[0] / 2 + 1, LiteGraph2.NODE_TITLE_HEIGHT, [0, 0, 8, 8]);
          }
        }
        if (over) {
          ctx.fill();
        } else {
          ctx.fillRect(0, y2, this.size[0] + 1, LiteGraph2.NODE_TITLE_HEIGHT);
        }
        ctx.textAlign = "center";
        ctx.font = "24px Arial";
        ctx.fillStyle = over ? "#DDD" : "#999";
        ctx.fillText("+", this.size[0] * 0.25, y2 + 24);
        ctx.fillText("+", this.size[0] * 0.75, y2 + 24);
      };
      Subgraph.prototype.onMouseDown = function(e, localpos, graphcanvas) {
        var y2 = this.size[1] - LiteGraph2.NODE_TITLE_HEIGHT + 0.5;
        console.log(0);
        if (localpos[1] > y2) {
          if (localpos[0] < this.size[0] / 2) {
            console.log(1);
            graphcanvas.showSubgraphPropertiesDialog(this);
          } else {
            console.log(2);
            graphcanvas.showSubgraphPropertiesDialogRight(this);
          }
        }
      };
      Subgraph.prototype.computeSize = function() {
        var num_inputs = this.inputs ? this.inputs.length : 0;
        var num_outputs = this.outputs ? this.outputs.length : 0;
        return [200, Math.max(num_inputs, num_outputs) * LiteGraph2.NODE_SLOT_HEIGHT + LiteGraph2.NODE_TITLE_HEIGHT];
      };
      Subgraph.prototype.onSubgraphTrigger = function(event2, param) {
        var slot = this.findOutputSlot(event2);
        if (slot != -1) {
          this.triggerSlot(slot);
        }
      };
      Subgraph.prototype.onSubgraphNewInput = function(name, type) {
        var slot = this.findInputSlot(name);
        if (slot == -1) {
          this.addInput(name, type);
        }
      };
      Subgraph.prototype.onSubgraphRenamedInput = function(oldname, name) {
        var slot = this.findInputSlot(oldname);
        if (slot == -1) {
          return;
        }
        var info = this.getInputInfo(slot);
        info.name = name;
      };
      Subgraph.prototype.onSubgraphTypeChangeInput = function(name, type) {
        var slot = this.findInputSlot(name);
        if (slot == -1) {
          return;
        }
        var info = this.getInputInfo(slot);
        info.type = type;
      };
      Subgraph.prototype.onSubgraphRemovedInput = function(name) {
        var slot = this.findInputSlot(name);
        if (slot == -1) {
          return;
        }
        this.removeInput(slot);
      };
      Subgraph.prototype.onSubgraphNewOutput = function(name, type) {
        var slot = this.findOutputSlot(name);
        if (slot == -1) {
          this.addOutput(name, type);
        }
      };
      Subgraph.prototype.onSubgraphRenamedOutput = function(oldname, name) {
        var slot = this.findOutputSlot(oldname);
        if (slot == -1) {
          return;
        }
        var info = this.getOutputInfo(slot);
        info.name = name;
      };
      Subgraph.prototype.onSubgraphTypeChangeOutput = function(name, type) {
        var slot = this.findOutputSlot(name);
        if (slot == -1) {
          return;
        }
        var info = this.getOutputInfo(slot);
        info.type = type;
      };
      Subgraph.prototype.onSubgraphRemovedOutput = function(name) {
        var slot = this.findOutputSlot(name);
        if (slot == -1) {
          return;
        }
        this.removeOutput(slot);
      };
      Subgraph.prototype.getExtraMenuOptions = function(graphcanvas) {
        var that2 = this;
        return [
          {
            content: "Open",
            callback: function() {
              graphcanvas.openSubgraph(that2.subgraph);
            }
          }
        ];
      };
      Subgraph.prototype.onResize = function(size) {
        size[1] += 20;
      };
      Subgraph.prototype.serialize = function() {
        var data = LiteGraph2.LGraphNode.prototype.serialize.call(this);
        data.subgraph = this.subgraph.serialize();
        return data;
      };
      Subgraph.prototype.reassignSubgraphUUIDs = function(graph) {
        const idMap = { nodeIDs: {}, linkIDs: {} };
        for (const node2 of graph.nodes) {
          const oldID = node2.id;
          const newID = LiteGraph2.uuidv4();
          node2.id = newID;
          if (idMap.nodeIDs[oldID] || idMap.nodeIDs[newID]) {
            throw new Error(`New/old node UUID wasn't unique in changed map! ${oldID} ${newID}`);
          }
          idMap.nodeIDs[oldID] = newID;
          idMap.nodeIDs[newID] = oldID;
        }
        for (const link of graph.links) {
          const oldID = link[0];
          const newID = LiteGraph2.uuidv4();
          link[0] = newID;
          if (idMap.linkIDs[oldID] || idMap.linkIDs[newID]) {
            throw new Error(`New/old link UUID wasn't unique in changed map! ${oldID} ${newID}`);
          }
          idMap.linkIDs[oldID] = newID;
          idMap.linkIDs[newID] = oldID;
          const nodeFrom = link[1];
          const nodeTo = link[3];
          if (!idMap.nodeIDs[nodeFrom]) {
            throw new Error(`Old node UUID not found in mapping! ${nodeFrom}`);
          }
          link[1] = idMap.nodeIDs[nodeFrom];
          if (!idMap.nodeIDs[nodeTo]) {
            throw new Error(`Old node UUID not found in mapping! ${nodeTo}`);
          }
          link[3] = idMap.nodeIDs[nodeTo];
        }
        for (const node2 of graph.nodes) {
          if (node2.inputs) {
            for (const input of node2.inputs) {
              if (input.link) {
                input.link = idMap.linkIDs[input.link];
              }
            }
          }
          if (node2.outputs) {
            for (const output of node2.outputs) {
              if (output.links) {
                output.links = output.links.map((l) => idMap.linkIDs[l]);
              }
            }
          }
        }
        for (const node2 of graph.nodes) {
          if (node2.type === "graph/subgraph") {
            const merge = reassignGraphUUIDs(node2.subgraph);
            idMap.nodeIDs.assign(merge.nodeIDs);
            idMap.linkIDs.assign(merge.linkIDs);
          }
        }
      };
      Subgraph.prototype.clone = function() {
        var node2 = LiteGraph2.createNode(this.type);
        var data = this.serialize();
        if (LiteGraph2.use_uuids) {
          const subgraph = LiteGraph2.cloneObject(data.subgraph);
          this.reassignSubgraphUUIDs(subgraph);
          data.subgraph = subgraph;
        }
        delete data["id"];
        delete data["inputs"];
        delete data["outputs"];
        node2.configure(data);
        return node2;
      };
      Subgraph.prototype.buildFromNodes = function(nodes) {
        var ids = {};
        var min_x = 0;
        for (var i2 = 0; i2 < nodes.length; ++i2) {
          var node2 = nodes[i2];
          ids[node2.id] = node2;
          min_x = Math.min(node2.pos[0], min_x);
          Math.max(node2.pos[0], min_x);
        }
        for (var i2 = 0; i2 < nodes.length; ++i2) {
          var node2 = nodes[i2];
          if (node2.inputs)
            for (var j = 0; j < node2.inputs.length; ++j) {
              var input = node2.inputs[j];
              if (!input || !input.link)
                continue;
              var link = node2.graph.links[input.link];
              if (!link)
                continue;
              if (ids[link.origin_id])
                continue;
              this.subgraph.addInput(input.name, link.type);
            }
          if (node2.outputs)
            for (var j = 0; j < node2.outputs.length; ++j) {
              var output = node2.outputs[j];
              if (!output || !output.links || !output.links.length)
                continue;
              var is_external = false;
              for (var k = 0; k < output.links.length; ++k) {
                var link = node2.graph.links[output.links[k]];
                if (!link)
                  continue;
                if (ids[link.target_id])
                  continue;
                is_external = true;
                break;
              }
              if (!is_external)
                continue;
            }
        }
      };
      LiteGraph2.Subgraph = Subgraph;
      LiteGraph2.registerNodeType("graph/subgraph", Subgraph);
      function GraphInput() {
        this.addOutput("", "number");
        this.name_in_graph = "";
        this.properties = {
          name: "",
          type: "number",
          value: 0
        };
        var that2 = this;
        this.name_widget = this.addWidget(
          "text",
          "Name",
          this.properties.name,
          function(v2) {
            if (!v2) {
              return;
            }
            that2.setProperty("name", v2);
          }
        );
        this.type_widget = this.addWidget(
          "text",
          "Type",
          this.properties.type,
          function(v2) {
            that2.setProperty("type", v2);
          }
        );
        this.value_widget = this.addWidget(
          "number",
          "Value",
          this.properties.value,
          function(v2) {
            that2.setProperty("value", v2);
          }
        );
        this.widgets_up = true;
        this.size = [180, 90];
      }
      GraphInput.title = "Input";
      GraphInput.desc = "Input of the graph";
      GraphInput.prototype.onConfigure = function() {
        this.updateType();
      };
      GraphInput.prototype.updateType = function() {
        var type = this.properties.type;
        this.type_widget.value = type;
        if (this.outputs[0].type != type) {
          if (!LiteGraph2.isValidConnection(this.outputs[0].type, type))
            this.disconnectOutput(0);
          this.outputs[0].type = type;
        }
        if (type == "number") {
          this.value_widget.type = "number";
          this.value_widget.value = 0;
        } else if (type == "boolean") {
          this.value_widget.type = "toggle";
          this.value_widget.value = true;
        } else if (type == "string") {
          this.value_widget.type = "text";
          this.value_widget.value = "";
        } else {
          this.value_widget.type = null;
          this.value_widget.value = null;
        }
        this.properties.value = this.value_widget.value;
        if (this.graph && this.name_in_graph) {
          this.graph.changeInputType(this.name_in_graph, type);
        }
      };
      GraphInput.prototype.onPropertyChanged = function(name, v2) {
        if (name == "name") {
          if (v2 == "" || v2 == this.name_in_graph || v2 == "enabled") {
            return false;
          }
          if (this.graph) {
            if (this.name_in_graph) {
              this.graph.renameInput(this.name_in_graph, v2);
            } else {
              this.graph.addInput(v2, this.properties.type);
            }
          }
          this.name_widget.value = v2;
          this.name_in_graph = v2;
        } else if (name == "type") {
          this.updateType();
        } else ;
      };
      GraphInput.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return this.properties.name;
        }
        return this.title;
      };
      GraphInput.prototype.onAction = function(action, param) {
        if (this.properties.type == LiteGraph2.EVENT) {
          this.triggerSlot(0, param);
        }
      };
      GraphInput.prototype.onExecute = function() {
        var name = this.properties.name;
        var data = this.graph.inputs[name];
        if (!data) {
          this.setOutputData(0, this.properties.value);
          return;
        }
        this.setOutputData(0, data.value !== void 0 ? data.value : this.properties.value);
      };
      GraphInput.prototype.onRemoved = function() {
        if (this.name_in_graph) {
          this.graph.removeInput(this.name_in_graph);
        }
      };
      LiteGraph2.GraphInput = GraphInput;
      LiteGraph2.registerNodeType("graph/input", GraphInput);
      function GraphOutput() {
        this.addInput("", "");
        this.name_in_graph = "";
        this.properties = { name: "", type: "" };
        this.name_widget = this.addWidget("text", "Name", this.properties.name, "name");
        this.type_widget = this.addWidget("text", "Type", this.properties.type, "type");
        this.widgets_up = true;
        this.size = [180, 60];
      }
      GraphOutput.title = "Output";
      GraphOutput.desc = "Output of the graph";
      GraphOutput.prototype.onPropertyChanged = function(name, v2) {
        if (name == "name") {
          if (v2 == "" || v2 == this.name_in_graph || v2 == "enabled") {
            return false;
          }
          if (this.graph) {
            if (this.name_in_graph) {
              this.graph.renameOutput(this.name_in_graph, v2);
            } else {
              this.graph.addOutput(v2, this.properties.type);
            }
          }
          this.name_widget.value = v2;
          this.name_in_graph = v2;
        } else if (name == "type") {
          this.updateType();
        } else ;
      };
      GraphOutput.prototype.updateType = function() {
        var type = this.properties.type;
        if (this.type_widget)
          this.type_widget.value = type;
        if (this.inputs[0].type != type) {
          if (type == "action" || type == "event")
            type = LiteGraph2.EVENT;
          if (!LiteGraph2.isValidConnection(this.inputs[0].type, type))
            this.disconnectInput(0);
          this.inputs[0].type = type;
        }
        if (this.graph && this.name_in_graph) {
          this.graph.changeOutputType(this.name_in_graph, type);
        }
      };
      GraphOutput.prototype.onExecute = function() {
        this._value = this.getInputData(0);
        this.graph.setOutputData(this.properties.name, this._value);
      };
      GraphOutput.prototype.onAction = function(action, param) {
        if (this.properties.type == LiteGraph2.ACTION) {
          this.graph.trigger(this.properties.name, param);
        }
      };
      GraphOutput.prototype.onRemoved = function() {
        if (this.name_in_graph) {
          this.graph.removeOutput(this.name_in_graph);
        }
      };
      GraphOutput.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return this.properties.name;
        }
        return this.title;
      };
      LiteGraph2.GraphOutput = GraphOutput;
      LiteGraph2.registerNodeType("graph/output", GraphOutput);
      function ConstantNumber() {
        this.addOutput("value", "number");
        this.addProperty("value", 1);
        this.widget = this.addWidget("number", "value", 1, "value");
        this.widgets_up = true;
        this.size = [180, 30];
      }
      ConstantNumber.title = "Const Number";
      ConstantNumber.desc = "Constant number";
      ConstantNumber.prototype.onExecute = function() {
        this.setOutputData(0, parseFloat(this.properties["value"]));
      };
      ConstantNumber.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return this.properties.value;
        }
        return this.title;
      };
      ConstantNumber.prototype.setValue = function(v2) {
        this.setProperty("value", v2);
      };
      ConstantNumber.prototype.onDrawBackground = function(ctx) {
        this.outputs[0].label = this.properties["value"].toFixed(3);
      };
      LiteGraph2.registerNodeType("basic/const", ConstantNumber);
      function ConstantBoolean() {
        this.addOutput("bool", "boolean");
        this.addProperty("value", true);
        this.widget = this.addWidget("toggle", "value", true, "value");
        this.serialize_widgets = true;
        this.widgets_up = true;
        this.size = [140, 30];
      }
      ConstantBoolean.title = "Const Boolean";
      ConstantBoolean.desc = "Constant boolean";
      ConstantBoolean.prototype.getTitle = ConstantNumber.prototype.getTitle;
      ConstantBoolean.prototype.onExecute = function() {
        this.setOutputData(0, this.properties["value"]);
      };
      ConstantBoolean.prototype.setValue = ConstantNumber.prototype.setValue;
      ConstantBoolean.prototype.onGetInputs = function() {
        return [["toggle", LiteGraph2.ACTION]];
      };
      ConstantBoolean.prototype.onAction = function(action) {
        this.setValue(!this.properties.value);
      };
      LiteGraph2.registerNodeType("basic/boolean", ConstantBoolean);
      function ConstantString() {
        this.addOutput("string", "string");
        this.addProperty("value", "");
        this.widget = this.addWidget("text", "value", "", "value");
        this.widgets_up = true;
        this.size = [180, 30];
      }
      ConstantString.title = "Const String";
      ConstantString.desc = "Constant string";
      ConstantString.prototype.getTitle = ConstantNumber.prototype.getTitle;
      ConstantString.prototype.onExecute = function() {
        this.setOutputData(0, this.properties["value"]);
      };
      ConstantString.prototype.setValue = ConstantNumber.prototype.setValue;
      ConstantString.prototype.onDropFile = function(file) {
        var that2 = this;
        var reader = new FileReader();
        reader.onload = function(e) {
          that2.setProperty("value", e.target.result);
        };
        reader.readAsText(file);
      };
      LiteGraph2.registerNodeType("basic/string", ConstantString);
      function ConstantObject() {
        this.addOutput("obj", "object");
        this.size = [120, 30];
        this._object = {};
      }
      ConstantObject.title = "Const Object";
      ConstantObject.desc = "Constant Object";
      ConstantObject.prototype.onExecute = function() {
        this.setOutputData(0, this._object);
      };
      LiteGraph2.registerNodeType("basic/object", ConstantObject);
      function ConstantFile() {
        this.addInput("url", "string");
        this.addOutput("file", "string");
        this.addProperty("url", "");
        this.addProperty("type", "text");
        this.widget = this.addWidget("text", "url", "", "url");
        this._data = null;
      }
      ConstantFile.title = "Const File";
      ConstantFile.desc = "Fetches a file from an url";
      ConstantFile["@type"] = { type: "enum", values: ["text", "arraybuffer", "blob", "json"] };
      ConstantFile.prototype.onPropertyChanged = function(name, value) {
        if (name == "url") {
          if (value == null || value == "")
            this._data = null;
          else {
            this.fetchFile(value);
          }
        }
      };
      ConstantFile.prototype.onExecute = function() {
        var url = this.getInputData(0) || this.properties.url;
        if (url && (url != this._url || this._type != this.properties.type))
          this.fetchFile(url);
        this.setOutputData(0, this._data);
      };
      ConstantFile.prototype.setValue = ConstantNumber.prototype.setValue;
      ConstantFile.prototype.fetchFile = function(url) {
        var that2 = this;
        if (!url || url.constructor !== String) {
          that2._data = null;
          that2.boxcolor = null;
          return;
        }
        this._url = url;
        this._type = this.properties.type;
        if (url.substr(0, 4) == "http" && LiteGraph2.proxy) {
          url = LiteGraph2.proxy + url.substr(url.indexOf(":") + 3);
        }
        fetch(url).then(function(response) {
          if (!response.ok)
            throw new Error("File not found");
          if (that2.properties.type == "arraybuffer")
            return response.arrayBuffer();
          else if (that2.properties.type == "text")
            return response.text();
          else if (that2.properties.type == "json")
            return response.json();
          else if (that2.properties.type == "blob")
            return response.blob();
        }).then(function(data) {
          that2._data = data;
          that2.boxcolor = "#AEA";
        }).catch(function(error) {
          that2._data = null;
          that2.boxcolor = "red";
          console.error("error fetching file:", url);
        });
      };
      ConstantFile.prototype.onDropFile = function(file) {
        var that2 = this;
        this._url = file.name;
        this._type = this.properties.type;
        this.properties.url = file.name;
        var reader = new FileReader();
        reader.onload = function(e) {
          that2.boxcolor = "#AEA";
          var v2 = e.target.result;
          if (that2.properties.type == "json")
            v2 = JSON.parse(v2);
          that2._data = v2;
        };
        if (that2.properties.type == "arraybuffer")
          reader.readAsArrayBuffer(file);
        else if (that2.properties.type == "text" || that2.properties.type == "json")
          reader.readAsText(file);
        else if (that2.properties.type == "blob")
          return reader.readAsBinaryString(file);
      };
      LiteGraph2.registerNodeType("basic/file", ConstantFile);
      function JSONParse() {
        this.addInput("parse", LiteGraph2.ACTION);
        this.addInput("json", "string");
        this.addOutput("done", LiteGraph2.EVENT);
        this.addOutput("object", "object");
        this.widget = this.addWidget("button", "parse", "", this.parse.bind(this));
        this._str = null;
        this._obj = null;
      }
      JSONParse.title = "JSON Parse";
      JSONParse.desc = "Parses JSON String into object";
      JSONParse.prototype.parse = function() {
        if (!this._str)
          return;
        try {
          this._str = this.getInputData(1);
          this._obj = JSON.parse(this._str);
          this.boxcolor = "#AEA";
          this.triggerSlot(0);
        } catch (err) {
          this.boxcolor = "red";
        }
      };
      JSONParse.prototype.onExecute = function() {
        this._str = this.getInputData(1);
        this.setOutputData(1, this._obj);
      };
      JSONParse.prototype.onAction = function(name) {
        if (name == "parse")
          this.parse();
      };
      LiteGraph2.registerNodeType("basic/jsonparse", JSONParse);
      function ConstantData() {
        this.addOutput("data", "object");
        this.addProperty("value", "");
        this.widget = this.addWidget("text", "json", "", "value");
        this.widgets_up = true;
        this.size = [140, 30];
        this._value = null;
      }
      ConstantData.title = "Const Data";
      ConstantData.desc = "Constant Data";
      ConstantData.prototype.onPropertyChanged = function(name, value) {
        this.widget.value = value;
        if (value == null || value == "") {
          return;
        }
        try {
          this._value = JSON.parse(value);
          this.boxcolor = "#AEA";
        } catch (err) {
          this.boxcolor = "red";
        }
      };
      ConstantData.prototype.onExecute = function() {
        this.setOutputData(0, this._value);
      };
      ConstantData.prototype.setValue = ConstantNumber.prototype.setValue;
      LiteGraph2.registerNodeType("basic/data", ConstantData);
      function ConstantArray() {
        this._value = [];
        this.addInput("json", "");
        this.addOutput("arrayOut", "array");
        this.addOutput("length", "number");
        this.addProperty("value", "[]");
        this.widget = this.addWidget("text", "array", this.properties.value, "value");
        this.widgets_up = true;
        this.size = [140, 50];
      }
      ConstantArray.title = "Const Array";
      ConstantArray.desc = "Constant Array";
      ConstantArray.prototype.onPropertyChanged = function(name, value) {
        this.widget.value = value;
        if (value == null || value == "") {
          return;
        }
        try {
          if (value[0] != "[")
            this._value = JSON.parse("[" + value + "]");
          else
            this._value = JSON.parse(value);
          this.boxcolor = "#AEA";
        } catch (err) {
          this.boxcolor = "red";
        }
      };
      ConstantArray.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 && v2.length) {
          if (!this._value)
            this._value = new Array();
          this._value.length = v2.length;
          for (var i2 = 0; i2 < v2.length; ++i2)
            this._value[i2] = v2[i2];
        }
        this.setOutputData(0, this._value);
        this.setOutputData(1, this._value ? this._value.length || 0 : 0);
      };
      ConstantArray.prototype.setValue = ConstantNumber.prototype.setValue;
      LiteGraph2.registerNodeType("basic/array", ConstantArray);
      function SetArray() {
        this.addInput("arr", "array");
        this.addInput("value", "");
        this.addOutput("arr", "array");
        this.properties = { index: 0 };
        this.widget = this.addWidget("number", "i", this.properties.index, "index", { precision: 0, step: 10, min: 0 });
      }
      SetArray.title = "Set Array";
      SetArray.desc = "Sets index of array";
      SetArray.prototype.onExecute = function() {
        var arr = this.getInputData(0);
        if (!arr)
          return;
        var v2 = this.getInputData(1);
        if (v2 === void 0)
          return;
        if (this.properties.index)
          arr[Math.floor(this.properties.index)] = v2;
        this.setOutputData(0, arr);
      };
      LiteGraph2.registerNodeType("basic/set_array", SetArray);
      function ArrayElement() {
        this.addInput("array", "array,table,string");
        this.addInput("index", "number");
        this.addOutput("value", "");
        this.addProperty("index", 0);
      }
      ArrayElement.title = "Array[i]";
      ArrayElement.desc = "Returns an element from an array";
      ArrayElement.prototype.onExecute = function() {
        var array = this.getInputData(0);
        var index2 = this.getInputData(1);
        if (index2 == null)
          index2 = this.properties.index;
        if (array == null || index2 == null)
          return;
        this.setOutputData(0, array[Math.floor(Number(index2))]);
      };
      LiteGraph2.registerNodeType("basic/array[]", ArrayElement);
      function TableElement() {
        this.addInput("table", "table");
        this.addInput("row", "number");
        this.addInput("col", "number");
        this.addOutput("value", "");
        this.addProperty("row", 0);
        this.addProperty("column", 0);
      }
      TableElement.title = "Table[row][col]";
      TableElement.desc = "Returns an element from a table";
      TableElement.prototype.onExecute = function() {
        var table = this.getInputData(0);
        var row = this.getInputData(1);
        var col = this.getInputData(2);
        if (row == null)
          row = this.properties.row;
        if (col == null)
          col = this.properties.column;
        if (table == null || row == null || col == null)
          return;
        var row = table[Math.floor(Number(row))];
        if (row)
          this.setOutputData(0, row[Math.floor(Number(col))]);
        else
          this.setOutputData(0, null);
      };
      LiteGraph2.registerNodeType("basic/table[][]", TableElement);
      function ObjectProperty() {
        this.addInput("obj", "object");
        this.addOutput("property", 0);
        this.addProperty("value", 0);
        this.widget = this.addWidget("text", "prop.", "", this.setValue.bind(this));
        this.widgets_up = true;
        this.size = [140, 30];
        this._value = null;
      }
      ObjectProperty.title = "Object property";
      ObjectProperty.desc = "Outputs the property of an object";
      ObjectProperty.prototype.setValue = function(v2) {
        this.properties.value = v2;
        this.widget.value = v2;
      };
      ObjectProperty.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return "in." + this.properties.value;
        }
        return this.title;
      };
      ObjectProperty.prototype.onPropertyChanged = function(name, value) {
        this.widget.value = value;
      };
      ObjectProperty.prototype.onExecute = function() {
        var data = this.getInputData(0);
        if (data != null) {
          this.setOutputData(0, data[this.properties.value]);
        }
      };
      LiteGraph2.registerNodeType("basic/object_property", ObjectProperty);
      function ObjectKeys() {
        this.addInput("obj", "");
        this.addOutput("keys", "array");
        this.size = [140, 30];
      }
      ObjectKeys.title = "Object keys";
      ObjectKeys.desc = "Outputs an array with the keys of an object";
      ObjectKeys.prototype.onExecute = function() {
        var data = this.getInputData(0);
        if (data != null) {
          this.setOutputData(0, Object.keys(data));
        }
      };
      LiteGraph2.registerNodeType("basic/object_keys", ObjectKeys);
      function SetObject() {
        this.addInput("obj", "");
        this.addInput("value", "");
        this.addOutput("obj", "");
        this.properties = { property: "" };
        this.name_widget = this.addWidget("text", "prop.", this.properties.property, "property");
      }
      SetObject.title = "Set Object";
      SetObject.desc = "Adds propertiesrty to object";
      SetObject.prototype.onExecute = function() {
        var obj = this.getInputData(0);
        if (!obj)
          return;
        var v2 = this.getInputData(1);
        if (v2 === void 0)
          return;
        if (this.properties.property)
          obj[this.properties.property] = v2;
        this.setOutputData(0, obj);
      };
      LiteGraph2.registerNodeType("basic/set_object", SetObject);
      function MergeObjects() {
        this.addInput("A", "object");
        this.addInput("B", "object");
        this.addOutput("out", "object");
        this._result = {};
        var that2 = this;
        this.addWidget("button", "clear", "", function() {
          that2._result = {};
        });
        this.size = this.computeSize();
      }
      MergeObjects.title = "Merge Objects";
      MergeObjects.desc = "Creates an object copying properties from others";
      MergeObjects.prototype.onExecute = function() {
        var A = this.getInputData(0);
        var B = this.getInputData(1);
        var C = this._result;
        if (A)
          for (var i2 in A)
            C[i2] = A[i2];
        if (B)
          for (var i2 in B)
            C[i2] = B[i2];
        this.setOutputData(0, C);
      };
      LiteGraph2.registerNodeType("basic/merge_objects", MergeObjects);
      function Variable() {
        this.size = [60, 30];
        this.addInput("in");
        this.addOutput("out");
        this.properties = { varname: "myname", container: Variable.LITEGRAPH };
        this.value = null;
      }
      Variable.title = "Variable";
      Variable.desc = "store/read variable value";
      Variable.LITEGRAPH = 0;
      Variable.GRAPH = 1;
      Variable.GLOBALSCOPE = 2;
      Variable["@container"] = { type: "enum", values: { "litegraph": Variable.LITEGRAPH, "graph": Variable.GRAPH, "global": Variable.GLOBALSCOPE } };
      Variable.prototype.onExecute = function() {
        var container = this.getContainer();
        if (this.isInputConnected(0)) {
          this.value = this.getInputData(0);
          container[this.properties.varname] = this.value;
          this.setOutputData(0, this.value);
          return;
        }
        this.setOutputData(0, container[this.properties.varname]);
      };
      Variable.prototype.getContainer = function() {
        switch (this.properties.container) {
          case Variable.GRAPH:
            if (this.graph)
              return this.graph.vars;
            return {};
          case Variable.GLOBALSCOPE:
            return global2;
          case Variable.LITEGRAPH:
          default:
            return LiteGraph2.Globals;
        }
      };
      Variable.prototype.getTitle = function() {
        return this.properties.varname;
      };
      LiteGraph2.registerNodeType("basic/variable", Variable);
      function length(v2) {
        if (v2 && v2.length != null)
          return Number(v2.length);
        return 0;
      }
      LiteGraph2.wrapFunctionAsNode(
        "basic/length",
        length,
        [""],
        "number"
      );
      function length(v2) {
        if (v2 && v2.length != null)
          return Number(v2.length);
        return 0;
      }
      LiteGraph2.wrapFunctionAsNode(
        "basic/not",
        function(a) {
          return !a;
        },
        [""],
        "boolean"
      );
      function DownloadData() {
        this.size = [60, 30];
        this.addInput("data", 0);
        this.addInput("download", LiteGraph2.ACTION);
        this.properties = { filename: "data.json" };
        this.value = null;
        var that2 = this;
        this.addWidget("button", "Download", "", function(v2) {
          if (!that2.value)
            return;
          that2.downloadAsFile();
        });
      }
      DownloadData.title = "Download";
      DownloadData.desc = "Download some data";
      DownloadData.prototype.downloadAsFile = function() {
        if (this.value == null)
          return;
        var str = null;
        if (this.value.constructor === String)
          str = this.value;
        else
          str = JSON.stringify(this.value);
        var file = new Blob([str]);
        var url = URL.createObjectURL(file);
        var element = document.createElement("a");
        element.setAttribute("href", url);
        element.setAttribute("download", this.properties.filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setTimeout(function() {
          URL.revokeObjectURL(url);
        }, 1e3 * 60);
      };
      DownloadData.prototype.onAction = function(action, param) {
        var that2 = this;
        setTimeout(function() {
          that2.downloadAsFile();
        }, 100);
      };
      DownloadData.prototype.onExecute = function() {
        if (this.inputs[0]) {
          this.value = this.getInputData(0);
        }
      };
      DownloadData.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return this.properties.filename;
        }
        return this.title;
      };
      LiteGraph2.registerNodeType("basic/download", DownloadData);
      function Watch() {
        this.size = [60, 30];
        this.addInput("value", 0, { label: "" });
        this.value = 0;
      }
      Watch.title = "Watch";
      Watch.desc = "Show value of input";
      Watch.prototype.onExecute = function() {
        if (this.inputs[0]) {
          this.value = this.getInputData(0);
        }
      };
      Watch.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return this.inputs[0].label;
        }
        return this.title;
      };
      Watch.toString = function(o) {
        if (o == null) {
          return "null";
        } else if (o.constructor === Number) {
          return o.toFixed(3);
        } else if (o.constructor === Array) {
          var str = "[";
          for (var i2 = 0; i2 < o.length; ++i2) {
            str += Watch.toString(o[i2]) + (i2 + 1 != o.length ? "," : "");
          }
          str += "]";
          return str;
        } else {
          return String(o);
        }
      };
      Watch.prototype.onDrawBackground = function(ctx) {
        this.inputs[0].label = Watch.toString(this.value);
      };
      LiteGraph2.registerNodeType("basic/watch", Watch);
      function Cast() {
        this.addInput("in", 0);
        this.addOutput("out", 0);
        this.size = [40, 30];
      }
      Cast.title = "Cast";
      Cast.desc = "Allows to connect different types";
      Cast.prototype.onExecute = function() {
        this.setOutputData(0, this.getInputData(0));
      };
      LiteGraph2.registerNodeType("basic/cast", Cast);
      function Console() {
        this.mode = LiteGraph2.ON_EVENT;
        this.size = [80, 30];
        this.addProperty("msg", "");
        this.addInput("log", LiteGraph2.EVENT);
        this.addInput("msg", 0);
      }
      Console.title = "Console";
      Console.desc = "Show value inside the console";
      Console.prototype.onAction = function(action, param) {
        var msg = this.getInputData(1);
        if (!msg) msg = this.properties.msg;
        if (!msg) msg = "Event: " + param;
        if (action == "log") {
          console.log(msg);
        } else if (action == "warn") {
          console.warn(msg);
        } else if (action == "error") {
          console.error(msg);
        }
      };
      Console.prototype.onExecute = function() {
        var msg = this.getInputData(1);
        if (!msg) msg = this.properties.msg;
        if (msg != null && typeof msg != "undefined") {
          this.properties.msg = msg;
          console.log(msg);
        }
      };
      Console.prototype.onGetInputs = function() {
        return [
          ["log", LiteGraph2.ACTION],
          ["warn", LiteGraph2.ACTION],
          ["error", LiteGraph2.ACTION]
        ];
      };
      LiteGraph2.registerNodeType("basic/console", Console);
      function Alert() {
        this.mode = LiteGraph2.ON_EVENT;
        this.addProperty("msg", "");
        this.addInput("", LiteGraph2.EVENT);
        this.widget = this.addWidget("text", "Text", "", "msg");
        this.widgets_up = true;
        this.size = [200, 30];
      }
      Alert.title = "Alert";
      Alert.desc = "Show an alert window";
      Alert.color = "#510";
      Alert.prototype.onConfigure = function(o) {
        this.widget.value = o.properties.msg;
      };
      Alert.prototype.onAction = function(action, param) {
        var msg = this.properties.msg;
        setTimeout(function() {
          alert(msg);
        }, 10);
      };
      LiteGraph2.registerNodeType("basic/alert", Alert);
      function NodeScript() {
        this.size = [60, 30];
        this.addProperty("onExecute", "return A;");
        this.addInput("A", 0);
        this.addInput("B", 0);
        this.addOutput("out", 0);
        this._func = null;
        this.data = {};
      }
      NodeScript.prototype.onConfigure = function(o) {
        if (o.properties.onExecute && LiteGraph2.allow_scripts)
          this.compileCode(o.properties.onExecute);
        else
          console.warn("Script not compiled, LiteGraph.allow_scripts is false");
      };
      NodeScript.title = "Script";
      NodeScript.desc = "executes a code (max 256 characters)";
      NodeScript.widgets_info = {
        onExecute: { type: "code" }
      };
      NodeScript.prototype.onPropertyChanged = function(name, value) {
        if (name == "onExecute" && LiteGraph2.allow_scripts)
          this.compileCode(value);
        else
          console.warn("Script not compiled, LiteGraph.allow_scripts is false");
      };
      NodeScript.prototype.compileCode = function(code) {
        this._func = null;
        if (code.length > 256) {
          console.warn("Script too long, max 256 chars");
        } else {
          var code_low = code.toLowerCase();
          var forbidden_words = [
            "script",
            "body",
            "document",
            "eval",
            "nodescript",
            "function"
          ];
          for (var i2 = 0; i2 < forbidden_words.length; ++i2) {
            if (code_low.indexOf(forbidden_words[i2]) != -1) {
              console.warn("invalid script");
              return;
            }
          }
          try {
            this._func = new Function("A", "B", "C", "DATA", "node", code);
          } catch (err) {
            console.error("Error parsing script");
            console.error(err);
          }
        }
      };
      NodeScript.prototype.onExecute = function() {
        if (!this._func) {
          return;
        }
        try {
          var A = this.getInputData(0);
          var B = this.getInputData(1);
          var C = this.getInputData(2);
          this.setOutputData(0, this._func(A, B, C, this.data, this));
        } catch (err) {
          console.error("Error in script");
          console.error(err);
        }
      };
      NodeScript.prototype.onGetOutputs = function() {
        return [["C", ""]];
      };
      LiteGraph2.registerNodeType("basic/script", NodeScript);
      function GenericCompare() {
        this.addInput("A", 0);
        this.addInput("B", 0);
        this.addOutput("true", "boolean");
        this.addOutput("false", "boolean");
        this.addProperty("A", 1);
        this.addProperty("B", 1);
        this.addProperty("OP", "==", "enum", { values: GenericCompare.values });
        this.addWidget("combo", "Op.", this.properties.OP, { property: "OP", values: GenericCompare.values });
        this.size = [80, 60];
      }
      GenericCompare.values = ["==", "!="];
      GenericCompare["@OP"] = {
        type: "enum",
        title: "operation",
        values: GenericCompare.values
      };
      GenericCompare.title = "Compare *";
      GenericCompare.desc = "evaluates condition between A and B";
      GenericCompare.prototype.getTitle = function() {
        return "*A " + this.properties.OP + " *B";
      };
      GenericCompare.prototype.onExecute = function() {
        var A = this.getInputData(0);
        if (A === void 0) {
          A = this.properties.A;
        } else {
          this.properties.A = A;
        }
        var B = this.getInputData(1);
        if (B === void 0) {
          B = this.properties.B;
        } else {
          this.properties.B = B;
        }
        var result = false;
        if (typeof A == typeof B) {
          switch (this.properties.OP) {
            case "==":
            case "!=":
              result = true;
              switch (typeof A) {
                case "object":
                  var aProps = Object.getOwnPropertyNames(A);
                  var bProps = Object.getOwnPropertyNames(B);
                  if (aProps.length != bProps.length) {
                    result = false;
                    break;
                  }
                  for (var i2 = 0; i2 < aProps.length; i2++) {
                    var propName = aProps[i2];
                    if (A[propName] !== B[propName]) {
                      result = false;
                      break;
                    }
                  }
                  break;
                default:
                  result = A == B;
              }
              if (this.properties.OP == "!=") result = !result;
              break;
          }
        }
        this.setOutputData(0, result);
        this.setOutputData(1, !result);
      };
      LiteGraph2.registerNodeType("basic/CompareValues", GenericCompare);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function LogEvent() {
        this.size = [60, 30];
        this.addInput("event", LiteGraph2.ACTION);
      }
      LogEvent.title = "Log Event";
      LogEvent.desc = "Log event in console";
      LogEvent.prototype.onAction = function(action, param, options) {
        console.log(action, param);
      };
      LiteGraph2.registerNodeType("events/log", LogEvent);
      function TriggerEvent() {
        this.size = [60, 30];
        this.addInput("if", "");
        this.addOutput("true", LiteGraph2.EVENT);
        this.addOutput("change", LiteGraph2.EVENT);
        this.addOutput("false", LiteGraph2.EVENT);
        this.properties = { only_on_change: true };
        this.prev = 0;
      }
      TriggerEvent.title = "TriggerEvent";
      TriggerEvent.desc = "Triggers event if input evaluates to true";
      TriggerEvent.prototype.onExecute = function(param, options) {
        var v2 = this.getInputData(0);
        var changed = v2 != this.prev;
        if (this.prev === 0)
          changed = false;
        var must_resend = changed && this.properties.only_on_change || !changed && !this.properties.only_on_change;
        if (v2 && must_resend)
          this.triggerSlot(0, param, null, options);
        if (!v2 && must_resend)
          this.triggerSlot(2, param, null, options);
        if (changed)
          this.triggerSlot(1, param, null, options);
        this.prev = v2;
      };
      LiteGraph2.registerNodeType("events/trigger", TriggerEvent);
      function Sequence() {
        var that2 = this;
        this.addInput("", LiteGraph2.ACTION);
        this.addInput("", LiteGraph2.ACTION);
        this.addInput("", LiteGraph2.ACTION);
        this.addOutput("", LiteGraph2.EVENT);
        this.addOutput("", LiteGraph2.EVENT);
        this.addOutput("", LiteGraph2.EVENT);
        this.addWidget("button", "+", null, function() {
          that2.addInput("", LiteGraph2.ACTION);
          that2.addOutput("", LiteGraph2.EVENT);
        });
        this.size = [90, 70];
        this.flags = { horizontal: true, render_box: false };
      }
      Sequence.title = "Sequence";
      Sequence.desc = "Triggers a sequence of events when an event arrives";
      Sequence.prototype.getTitle = function() {
        return "";
      };
      Sequence.prototype.onAction = function(action, param, options) {
        if (this.outputs) {
          options = options || {};
          for (var i2 = 0; i2 < this.outputs.length; ++i2) {
            this.outputs[i2];
            if (options.action_call)
              options.action_call = options.action_call + "_seq_" + i2;
            else
              options.action_call = this.id + "_" + (action ? action : "action") + "_seq_" + i2 + "_" + Math.floor(Math.random() * 9999);
            this.triggerSlot(i2, param, null, options);
          }
        }
      };
      LiteGraph2.registerNodeType("events/sequence", Sequence);
      function WaitAll() {
        var that2 = this;
        this.addInput("", LiteGraph2.ACTION);
        this.addInput("", LiteGraph2.ACTION);
        this.addOutput("", LiteGraph2.EVENT);
        this.addWidget("button", "+", null, function() {
          that2.addInput("", LiteGraph2.ACTION);
          that2.size[0] = 90;
        });
        this.size = [90, 70];
        this.ready = [];
      }
      WaitAll.title = "WaitAll";
      WaitAll.desc = "Wait until all input events arrive then triggers output";
      WaitAll.prototype.getTitle = function() {
        return "";
      };
      WaitAll.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        for (var i2 = 0; i2 < this.inputs.length; ++i2) {
          var y2 = i2 * LiteGraph2.NODE_SLOT_HEIGHT + 10;
          ctx.fillStyle = this.ready[i2] ? "#AFB" : "#000";
          ctx.fillRect(20, y2, 10, 10);
        }
      };
      WaitAll.prototype.onAction = function(action, param, options, slot_index) {
        if (slot_index == null)
          return;
        this.ready.length = this.outputs.length;
        this.ready[slot_index] = true;
        for (var i2 = 0; i2 < this.ready.length; ++i2)
          if (!this.ready[i2])
            return;
        this.reset();
        this.triggerSlot(0);
      };
      WaitAll.prototype.reset = function() {
        this.ready.length = 0;
      };
      LiteGraph2.registerNodeType("events/waitAll", WaitAll);
      function Stepper() {
        var that2 = this;
        this.properties = { index: 0 };
        this.addInput("index", "number");
        this.addInput("step", LiteGraph2.ACTION);
        this.addInput("reset", LiteGraph2.ACTION);
        this.addOutput("index", "number");
        this.addOutput("", LiteGraph2.EVENT);
        this.addOutput("", LiteGraph2.EVENT);
        this.addOutput("", LiteGraph2.EVENT, { removable: true });
        this.addWidget("button", "+", null, function() {
          that2.addOutput("", LiteGraph2.EVENT, { removable: true });
        });
        this.size = [120, 120];
        this.flags = { render_box: false };
      }
      Stepper.title = "Stepper";
      Stepper.desc = "Trigger events sequentially when an tick arrives";
      Stepper.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        var index2 = this.properties.index || 0;
        ctx.fillStyle = "#AFB";
        var w2 = this.size[0];
        var y2 = (index2 + 1) * LiteGraph2.NODE_SLOT_HEIGHT + 4;
        ctx.beginPath();
        ctx.moveTo(w2 - 30, y2);
        ctx.lineTo(w2 - 30, y2 + LiteGraph2.NODE_SLOT_HEIGHT);
        ctx.lineTo(w2 - 15, y2 + LiteGraph2.NODE_SLOT_HEIGHT * 0.5);
        ctx.fill();
      };
      Stepper.prototype.onExecute = function() {
        var index2 = this.getInputData(0);
        if (index2 != null) {
          index2 = Math.floor(index2);
          index2 = clamp(index2, 0, this.outputs ? this.outputs.length - 2 : 0);
          if (index2 != this.properties.index) {
            this.properties.index = index2;
            this.triggerSlot(index2 + 1);
          }
        }
        this.setOutputData(0, this.properties.index);
      };
      Stepper.prototype.onAction = function(action, param) {
        if (action == "reset")
          this.properties.index = 0;
        else if (action == "step") {
          this.triggerSlot(this.properties.index + 1, param);
          var n = this.outputs ? this.outputs.length - 1 : 0;
          this.properties.index = (this.properties.index + 1) % n;
        }
      };
      LiteGraph2.registerNodeType("events/stepper", Stepper);
      function FilterEvent() {
        this.size = [60, 30];
        this.addInput("event", LiteGraph2.ACTION);
        this.addOutput("event", LiteGraph2.EVENT);
        this.properties = {
          equal_to: "",
          has_property: "",
          property_equal_to: ""
        };
      }
      FilterEvent.title = "Filter Event";
      FilterEvent.desc = "Blocks events that do not match the filter";
      FilterEvent.prototype.onAction = function(action, param, options) {
        if (param == null) {
          return;
        }
        if (this.properties.equal_to && this.properties.equal_to != param) {
          return;
        }
        if (this.properties.has_property) {
          var prop = param[this.properties.has_property];
          if (prop == null) {
            return;
          }
          if (this.properties.property_equal_to && this.properties.property_equal_to != prop) {
            return;
          }
        }
        this.triggerSlot(0, param, null, options);
      };
      LiteGraph2.registerNodeType("events/filter", FilterEvent);
      function EventBranch() {
        this.addInput("in", LiteGraph2.ACTION);
        this.addInput("cond", "boolean");
        this.addOutput("true", LiteGraph2.EVENT);
        this.addOutput("false", LiteGraph2.EVENT);
        this.size = [120, 60];
        this._value = false;
      }
      EventBranch.title = "Branch";
      EventBranch.desc = "If condition is true, outputs triggers true, otherwise false";
      EventBranch.prototype.onExecute = function() {
        this._value = this.getInputData(1);
      };
      EventBranch.prototype.onAction = function(action, param, options) {
        this._value = this.getInputData(1);
        this.triggerSlot(this._value ? 0 : 1, param, null, options);
      };
      LiteGraph2.registerNodeType("events/branch", EventBranch);
      function EventCounter() {
        this.addInput("inc", LiteGraph2.ACTION);
        this.addInput("dec", LiteGraph2.ACTION);
        this.addInput("reset", LiteGraph2.ACTION);
        this.addOutput("change", LiteGraph2.EVENT);
        this.addOutput("num", "number");
        this.addProperty("doCountExecution", false, "boolean", { name: "Count Executions" });
        this.addWidget("toggle", "Count Exec.", this.properties.doCountExecution, "doCountExecution");
        this.num = 0;
      }
      EventCounter.title = "Counter";
      EventCounter.desc = "Counts events";
      EventCounter.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return String(this.num);
        }
        return this.title;
      };
      EventCounter.prototype.onAction = function(action, param, options) {
        var v2 = this.num;
        if (action == "inc") {
          this.num += 1;
        } else if (action == "dec") {
          this.num -= 1;
        } else if (action == "reset") {
          this.num = 0;
        }
        if (this.num != v2) {
          this.trigger("change", this.num);
        }
      };
      EventCounter.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        ctx.fillStyle = "#AAA";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.num, this.size[0] * 0.5, this.size[1] * 0.5);
      };
      EventCounter.prototype.onExecute = function() {
        if (this.properties.doCountExecution) {
          this.num += 1;
        }
        this.setOutputData(1, this.num);
      };
      LiteGraph2.registerNodeType("events/counter", EventCounter);
      function DelayEvent() {
        this.size = [60, 30];
        this.addProperty("time_in_ms", 1e3);
        this.addInput("event", LiteGraph2.ACTION);
        this.addOutput("on_time", LiteGraph2.EVENT);
        this._pending = [];
      }
      DelayEvent.title = "Delay";
      DelayEvent.desc = "Delays one event";
      DelayEvent.prototype.onAction = function(action, param, options) {
        var time = this.properties.time_in_ms;
        if (time <= 0) {
          this.trigger(null, param, options);
        } else {
          this._pending.push([time, param]);
        }
      };
      DelayEvent.prototype.onExecute = function(param, options) {
        var dt = this.graph.elapsed_time * 1e3;
        if (this.isInputConnected(1)) {
          this.properties.time_in_ms = this.getInputData(1);
        }
        for (var i2 = 0; i2 < this._pending.length; ++i2) {
          var actionPass = this._pending[i2];
          actionPass[0] -= dt;
          if (actionPass[0] > 0) {
            continue;
          }
          this._pending.splice(i2, 1);
          --i2;
          this.trigger(null, actionPass[1], options);
        }
      };
      DelayEvent.prototype.onGetInputs = function() {
        return [["event", LiteGraph2.ACTION], ["time_in_ms", "number"]];
      };
      LiteGraph2.registerNodeType("events/delay", DelayEvent);
      function TimerEvent() {
        this.addProperty("interval", 1e3);
        this.addProperty("event", "tick");
        this.addOutput("on_tick", LiteGraph2.EVENT);
        this.time = 0;
        this.last_interval = 1e3;
        this.triggered = false;
      }
      TimerEvent.title = "Timer";
      TimerEvent.desc = "Sends an event every N milliseconds";
      TimerEvent.prototype.onStart = function() {
        this.time = 0;
      };
      TimerEvent.prototype.getTitle = function() {
        return "Timer: " + this.last_interval.toString() + "ms";
      };
      TimerEvent.on_color = "#AAA";
      TimerEvent.off_color = "#222";
      TimerEvent.prototype.onDrawBackground = function() {
        this.boxcolor = this.triggered ? TimerEvent.on_color : TimerEvent.off_color;
        this.triggered = false;
      };
      TimerEvent.prototype.onExecute = function() {
        var dt = this.graph.elapsed_time * 1e3;
        var trigger = this.time == 0;
        this.time += dt;
        this.last_interval = Math.max(
          1,
          this.getInputOrProperty("interval") | 0
        );
        if (!trigger && (this.time < this.last_interval || isNaN(this.last_interval))) {
          if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
            this.setOutputData(1, false);
          }
          return;
        }
        this.triggered = true;
        this.time = this.time % this.last_interval;
        this.trigger("on_tick", this.properties.event);
        if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
          this.setOutputData(1, true);
        }
      };
      TimerEvent.prototype.onGetInputs = function() {
        return [["interval", "number"]];
      };
      TimerEvent.prototype.onGetOutputs = function() {
        return [["tick", "boolean"]];
      };
      LiteGraph2.registerNodeType("events/timer", TimerEvent);
      function SemaphoreEvent() {
        this.addInput("go", LiteGraph2.ACTION);
        this.addInput("green", LiteGraph2.ACTION);
        this.addInput("red", LiteGraph2.ACTION);
        this.addOutput("continue", LiteGraph2.EVENT);
        this.addOutput("blocked", LiteGraph2.EVENT);
        this.addOutput("is_green", "boolean");
        this._ready = false;
        this.properties = {};
        var that2 = this;
        this.addWidget("button", "reset", "", function() {
          that2._ready = false;
        });
      }
      SemaphoreEvent.title = "Semaphore Event";
      SemaphoreEvent.desc = "Until both events are not triggered, it doesnt continue.";
      SemaphoreEvent.prototype.onExecute = function() {
        this.setOutputData(1, this._ready);
        this.boxcolor = this._ready ? "#9F9" : "#FA5";
      };
      SemaphoreEvent.prototype.onAction = function(action, param) {
        if (action == "go")
          this.triggerSlot(this._ready ? 0 : 1);
        else if (action == "green")
          this._ready = true;
        else if (action == "red")
          this._ready = false;
      };
      LiteGraph2.registerNodeType("events/semaphore", SemaphoreEvent);
      function OnceEvent() {
        this.addInput("in", LiteGraph2.ACTION);
        this.addInput("reset", LiteGraph2.ACTION);
        this.addOutput("out", LiteGraph2.EVENT);
        this._once = false;
        this.properties = {};
        var that2 = this;
        this.addWidget("button", "reset", "", function() {
          that2._once = false;
        });
      }
      OnceEvent.title = "Once";
      OnceEvent.desc = "Only passes an event once, then gets locked";
      OnceEvent.prototype.onAction = function(action, param) {
        if (action == "in" && !this._once) {
          this._once = true;
          this.triggerSlot(0, param);
        } else if (action == "reset")
          this._once = false;
      };
      LiteGraph2.registerNodeType("events/once", OnceEvent);
      function DataStore() {
        this.addInput("data", 0);
        this.addInput("assign", LiteGraph2.ACTION);
        this.addOutput("data", 0);
        this._last_value = null;
        this.properties = { data: null, serialize: true };
        var that2 = this;
        this.addWidget("button", "store", "", function() {
          that2.properties.data = that2._last_value;
        });
      }
      DataStore.title = "Data Store";
      DataStore.desc = "Stores data and only changes when event is received";
      DataStore.prototype.onExecute = function() {
        this._last_value = this.getInputData(0);
        this.setOutputData(0, this.properties.data);
      };
      DataStore.prototype.onAction = function(action, param, options) {
        this.properties.data = this._last_value;
      };
      DataStore.prototype.onSerialize = function(o) {
        if (o.data == null)
          return;
        if (this.properties.serialize == false || o.data.constructor !== String && o.data.constructor !== Number && o.data.constructor !== Boolean && o.data.constructor !== Array && o.data.constructor !== Object)
          o.data = null;
      };
      LiteGraph2.registerNodeType("basic/data_store", DataStore);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function WidgetButton() {
        this.addOutput("", LiteGraph2.EVENT);
        this.addOutput("", "boolean");
        this.addProperty("text", "click me");
        this.addProperty("font_size", 30);
        this.addProperty("message", "");
        this.size = [164, 84];
        this.clicked = false;
      }
      WidgetButton.title = "Button";
      WidgetButton.desc = "Triggers an event";
      WidgetButton.font = "Arial";
      WidgetButton.prototype.onDrawForeground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        var margin = 10;
        ctx.fillStyle = "black";
        ctx.fillRect(
          margin + 1,
          margin + 1,
          this.size[0] - margin * 2,
          this.size[1] - margin * 2
        );
        ctx.fillStyle = "#AAF";
        ctx.fillRect(
          margin - 1,
          margin - 1,
          this.size[0] - margin * 2,
          this.size[1] - margin * 2
        );
        ctx.fillStyle = this.clicked ? "white" : this.mouseOver ? "#668" : "#334";
        ctx.fillRect(
          margin,
          margin,
          this.size[0] - margin * 2,
          this.size[1] - margin * 2
        );
        if (this.properties.text || this.properties.text === 0) {
          var font_size = this.properties.font_size || 30;
          ctx.textAlign = "center";
          ctx.fillStyle = this.clicked ? "black" : "white";
          ctx.font = font_size + "px " + WidgetButton.font;
          ctx.fillText(
            this.properties.text,
            this.size[0] * 0.5,
            this.size[1] * 0.5 + font_size * 0.3
          );
          ctx.textAlign = "left";
        }
      };
      WidgetButton.prototype.onMouseDown = function(e, local_pos) {
        if (local_pos[0] > 1 && local_pos[1] > 1 && local_pos[0] < this.size[0] - 2 && local_pos[1] < this.size[1] - 2) {
          this.clicked = true;
          this.setOutputData(1, this.clicked);
          this.triggerSlot(0, this.properties.message);
          return true;
        }
      };
      WidgetButton.prototype.onExecute = function() {
        this.setOutputData(1, this.clicked);
      };
      WidgetButton.prototype.onMouseUp = function(e) {
        this.clicked = false;
      };
      LiteGraph2.registerNodeType("widget/button", WidgetButton);
      function WidgetToggle() {
        this.addInput("", "boolean");
        this.addInput("e", LiteGraph2.ACTION);
        this.addOutput("v", "boolean");
        this.addOutput("e", LiteGraph2.EVENT);
        this.properties = { font: "", value: false };
        this.size = [160, 44];
      }
      WidgetToggle.title = "Toggle";
      WidgetToggle.desc = "Toggles between true or false";
      WidgetToggle.prototype.onDrawForeground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        var size = this.size[1] * 0.5;
        var margin = 0.25;
        var h = this.size[1] * 0.8;
        ctx.font = this.properties.font || (size * 0.8).toFixed(0) + "px Arial";
        var w2 = ctx.measureText(this.title).width;
        var x2 = (this.size[0] - (w2 + size)) * 0.5;
        ctx.fillStyle = "#AAA";
        ctx.fillRect(x2, h - size, size, size);
        ctx.fillStyle = this.properties.value ? "#AEF" : "#000";
        ctx.fillRect(
          x2 + size * margin,
          h - size + size * margin,
          size * (1 - margin * 2),
          size * (1 - margin * 2)
        );
        ctx.textAlign = "left";
        ctx.fillStyle = "#AAA";
        ctx.fillText(this.title, size * 1.2 + x2, h * 0.85);
        ctx.textAlign = "left";
      };
      WidgetToggle.prototype.onAction = function(action) {
        this.properties.value = !this.properties.value;
        this.trigger("e", this.properties.value);
      };
      WidgetToggle.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 != null) {
          this.properties.value = v2;
        }
        this.setOutputData(0, this.properties.value);
      };
      WidgetToggle.prototype.onMouseDown = function(e, local_pos) {
        if (local_pos[0] > 1 && local_pos[1] > 1 && local_pos[0] < this.size[0] - 2 && local_pos[1] < this.size[1] - 2) {
          this.properties.value = !this.properties.value;
          this.graph._version++;
          this.trigger("e", this.properties.value);
          return true;
        }
      };
      LiteGraph2.registerNodeType("widget/toggle", WidgetToggle);
      function WidgetNumber() {
        this.addOutput("", "number");
        this.size = [80, 60];
        this.properties = { min: -1e3, max: 1e3, value: 1, step: 1 };
        this.old_y = -1;
        this._remainder = 0;
        this._precision = 0;
        this.mouse_captured = false;
      }
      WidgetNumber.title = "Number";
      WidgetNumber.desc = "Widget to select number value";
      WidgetNumber.pixels_threshold = 10;
      WidgetNumber.markers_color = "#666";
      WidgetNumber.prototype.onDrawForeground = function(ctx) {
        var x2 = this.size[0] * 0.5;
        var h = this.size[1];
        if (h > 30) {
          ctx.fillStyle = WidgetNumber.markers_color;
          ctx.beginPath();
          ctx.moveTo(x2, h * 0.1);
          ctx.lineTo(x2 + h * 0.1, h * 0.2);
          ctx.lineTo(x2 + h * -0.1, h * 0.2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(x2, h * 0.9);
          ctx.lineTo(x2 + h * 0.1, h * 0.8);
          ctx.lineTo(x2 + h * -0.1, h * 0.8);
          ctx.fill();
          ctx.font = (h * 0.7).toFixed(1) + "px Arial";
        } else {
          ctx.font = (h * 0.8).toFixed(1) + "px Arial";
        }
        ctx.textAlign = "center";
        ctx.font = (h * 0.7).toFixed(1) + "px Arial";
        ctx.fillStyle = "#EEE";
        ctx.fillText(
          this.properties.value.toFixed(this._precision),
          x2,
          h * 0.75
        );
      };
      WidgetNumber.prototype.onExecute = function() {
        this.setOutputData(0, this.properties.value);
      };
      WidgetNumber.prototype.onPropertyChanged = function(name, value) {
        var t = (this.properties.step + "").split(".");
        this._precision = t.length > 1 ? t[1].length : 0;
      };
      WidgetNumber.prototype.onMouseDown = function(e, pos2) {
        if (pos2[1] < 0) {
          return;
        }
        this.old_y = e.canvasY;
        this.captureInput(true);
        this.mouse_captured = true;
        return true;
      };
      WidgetNumber.prototype.onMouseMove = function(e) {
        if (!this.mouse_captured) {
          return;
        }
        var delta2 = this.old_y - e.canvasY;
        if (e.shiftKey) {
          delta2 *= 10;
        }
        if (e.metaKey || e.altKey) {
          delta2 *= 0.1;
        }
        this.old_y = e.canvasY;
        var steps = this._remainder + delta2 / WidgetNumber.pixels_threshold;
        this._remainder = steps % 1;
        steps = steps | 0;
        var v2 = clamp(
          this.properties.value + steps * this.properties.step,
          this.properties.min,
          this.properties.max
        );
        this.properties.value = v2;
        this.graph._version++;
        this.setDirtyCanvas(true);
      };
      WidgetNumber.prototype.onMouseUp = function(e, pos2) {
        if (e.click_time < 200) {
          var steps = pos2[1] > this.size[1] * 0.5 ? -1 : 1;
          this.properties.value = clamp(
            this.properties.value + steps * this.properties.step,
            this.properties.min,
            this.properties.max
          );
          this.graph._version++;
          this.setDirtyCanvas(true);
        }
        if (this.mouse_captured) {
          this.mouse_captured = false;
          this.captureInput(false);
        }
      };
      LiteGraph2.registerNodeType("widget/number", WidgetNumber);
      function WidgetCombo() {
        this.addOutput("", "string");
        this.addOutput("change", LiteGraph2.EVENT);
        this.size = [80, 60];
        this.properties = { value: "A", values: "A;B;C" };
        this.old_y = -1;
        this.mouse_captured = false;
        this._values = this.properties.values.split(";");
        var that2 = this;
        this.widgets_up = true;
        this.widget = this.addWidget("combo", "", this.properties.value, function(v2) {
          that2.properties.value = v2;
          that2.triggerSlot(1, v2);
        }, { property: "value", values: this._values });
      }
      WidgetCombo.title = "Combo";
      WidgetCombo.desc = "Widget to select from a list";
      WidgetCombo.prototype.onExecute = function() {
        this.setOutputData(0, this.properties.value);
      };
      WidgetCombo.prototype.onPropertyChanged = function(name, value) {
        if (name == "values") {
          this._values = value.split(";");
          this.widget.options.values = this._values;
        } else if (name == "value") {
          this.widget.value = value;
        }
      };
      LiteGraph2.registerNodeType("widget/combo", WidgetCombo);
      function WidgetKnob() {
        this.addOutput("", "number");
        this.size = [64, 84];
        this.properties = {
          min: 0,
          max: 1,
          value: 0.5,
          color: "#7AF",
          precision: 2
        };
        this.value = -1;
      }
      WidgetKnob.title = "Knob";
      WidgetKnob.desc = "Circular controller";
      WidgetKnob.size = [80, 100];
      WidgetKnob.prototype.onDrawForeground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        if (this.value == -1) {
          this.value = (this.properties.value - this.properties.min) / (this.properties.max - this.properties.min);
        }
        var center_x = this.size[0] * 0.5;
        var center_y = this.size[1] * 0.5;
        var radius = Math.min(this.size[0], this.size[1]) * 0.5 - 5;
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.rotate(Math.PI * 0.75);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, Math.PI * 1.5);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.properties.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(
          0,
          0,
          radius - 4,
          0,
          Math.PI * 1.5 * Math.max(0.01, this.value)
        );
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.restore();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(center_x, center_y, radius * 0.75, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.fillStyle = this.mouseOver ? "white" : this.properties.color;
        ctx.beginPath();
        var angle = this.value * Math.PI * 1.5 + Math.PI * 0.75;
        ctx.arc(
          center_x + Math.cos(angle) * radius * 0.65,
          center_y + Math.sin(angle) * radius * 0.65,
          radius * 0.05,
          0,
          Math.PI * 2,
          true
        );
        ctx.fill();
        ctx.fillStyle = this.mouseOver ? "white" : "#AAA";
        ctx.font = Math.floor(radius * 0.5) + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          this.properties.value.toFixed(this.properties.precision),
          center_x,
          center_y + radius * 0.15
        );
      };
      WidgetKnob.prototype.onExecute = function() {
        this.setOutputData(0, this.properties.value);
        this.boxcolor = LiteGraph2.colorToString([
          this.value,
          this.value,
          this.value
        ]);
      };
      WidgetKnob.prototype.onMouseDown = function(e) {
        this.center = [this.size[0] * 0.5, this.size[1] * 0.5 + 20];
        this.radius = this.size[0] * 0.5;
        if (e.canvasY - this.pos[1] < 20 || LiteGraph2.distance(
          [e.canvasX, e.canvasY],
          [this.pos[0] + this.center[0], this.pos[1] + this.center[1]]
        ) > this.radius) {
          return false;
        }
        this.oldmouse = [e.canvasX - this.pos[0], e.canvasY - this.pos[1]];
        this.captureInput(true);
        return true;
      };
      WidgetKnob.prototype.onMouseMove = function(e) {
        if (!this.oldmouse) {
          return;
        }
        var m = [e.canvasX - this.pos[0], e.canvasY - this.pos[1]];
        var v2 = this.value;
        v2 -= (m[1] - this.oldmouse[1]) * 0.01;
        if (v2 > 1) {
          v2 = 1;
        } else if (v2 < 0) {
          v2 = 0;
        }
        this.value = v2;
        this.properties.value = this.properties.min + (this.properties.max - this.properties.min) * this.value;
        this.oldmouse = m;
        this.setDirtyCanvas(true);
      };
      WidgetKnob.prototype.onMouseUp = function(e) {
        if (this.oldmouse) {
          this.oldmouse = null;
          this.captureInput(false);
        }
      };
      WidgetKnob.prototype.onPropertyChanged = function(name, value) {
        if (name == "min" || name == "max" || name == "value") {
          this.properties[name] = parseFloat(value);
          return true;
        }
      };
      LiteGraph2.registerNodeType("widget/knob", WidgetKnob);
      function WidgetSliderGUI() {
        this.addOutput("", "number");
        this.properties = {
          value: 0.5,
          min: 0,
          max: 1,
          text: "V"
        };
        var that2 = this;
        this.size = [140, 40];
        this.slider = this.addWidget(
          "slider",
          "V",
          this.properties.value,
          function(v2) {
            that2.properties.value = v2;
          },
          this.properties
        );
        this.widgets_up = true;
      }
      WidgetSliderGUI.title = "Inner Slider";
      WidgetSliderGUI.prototype.onPropertyChanged = function(name, value) {
        if (name == "value") {
          this.slider.value = value;
        }
      };
      WidgetSliderGUI.prototype.onExecute = function() {
        this.setOutputData(0, this.properties.value);
      };
      LiteGraph2.registerNodeType("widget/internal_slider", WidgetSliderGUI);
      function WidgetHSlider() {
        this.size = [160, 26];
        this.addOutput("", "number");
        this.properties = { color: "#7AF", min: 0, max: 1, value: 0.5 };
        this.value = -1;
      }
      WidgetHSlider.title = "H.Slider";
      WidgetHSlider.desc = "Linear slider controller";
      WidgetHSlider.prototype.onDrawForeground = function(ctx) {
        if (this.value == -1) {
          this.value = (this.properties.value - this.properties.min) / (this.properties.max - this.properties.min);
        }
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        ctx.fillStyle = "#000";
        ctx.fillRect(2, 2, this.size[0] - 4, this.size[1] - 4);
        ctx.fillStyle = this.properties.color;
        ctx.beginPath();
        ctx.rect(4, 4, (this.size[0] - 8) * this.value, this.size[1] - 8);
        ctx.fill();
      };
      WidgetHSlider.prototype.onExecute = function() {
        this.properties.value = this.properties.min + (this.properties.max - this.properties.min) * this.value;
        this.setOutputData(0, this.properties.value);
        this.boxcolor = LiteGraph2.colorToString([
          this.value,
          this.value,
          this.value
        ]);
      };
      WidgetHSlider.prototype.onMouseDown = function(e) {
        if (e.canvasY - this.pos[1] < 0) {
          return false;
        }
        this.oldmouse = [e.canvasX - this.pos[0], e.canvasY - this.pos[1]];
        this.captureInput(true);
        return true;
      };
      WidgetHSlider.prototype.onMouseMove = function(e) {
        if (!this.oldmouse) {
          return;
        }
        var m = [e.canvasX - this.pos[0], e.canvasY - this.pos[1]];
        var v2 = this.value;
        var delta2 = m[0] - this.oldmouse[0];
        v2 += delta2 / this.size[0];
        if (v2 > 1) {
          v2 = 1;
        } else if (v2 < 0) {
          v2 = 0;
        }
        this.value = v2;
        this.oldmouse = m;
        this.setDirtyCanvas(true);
      };
      WidgetHSlider.prototype.onMouseUp = function(e) {
        this.oldmouse = null;
        this.captureInput(false);
      };
      WidgetHSlider.prototype.onMouseLeave = function(e) {
      };
      LiteGraph2.registerNodeType("widget/hslider", WidgetHSlider);
      function WidgetProgress() {
        this.size = [160, 26];
        this.addInput("", "number");
        this.properties = { min: 0, max: 1, value: 0, color: "#AAF" };
      }
      WidgetProgress.title = "Progress";
      WidgetProgress.desc = "Shows data in linear progress";
      WidgetProgress.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 != void 0) {
          this.properties["value"] = v2;
        }
      };
      WidgetProgress.prototype.onDrawForeground = function(ctx) {
        ctx.lineWidth = 1;
        ctx.fillStyle = this.properties.color;
        var v2 = (this.properties.value - this.properties.min) / (this.properties.max - this.properties.min);
        v2 = Math.min(1, v2);
        v2 = Math.max(0, v2);
        ctx.fillRect(2, 2, (this.size[0] - 4) * v2, this.size[1] - 4);
      };
      LiteGraph2.registerNodeType("widget/progress", WidgetProgress);
      function WidgetText() {
        this.addInputs("", 0);
        this.properties = {
          value: "...",
          font: "Arial",
          fontsize: 18,
          color: "#AAA",
          align: "left",
          glowSize: 0,
          decimals: 1
        };
      }
      WidgetText.title = "Text";
      WidgetText.desc = "Shows the input value";
      WidgetText.widgets = [
        { name: "resize", text: "Resize box", type: "button" },
        { name: "led_text", text: "LED", type: "minibutton" },
        { name: "normal_text", text: "Normal", type: "minibutton" }
      ];
      WidgetText.prototype.onDrawForeground = function(ctx) {
        ctx.fillStyle = this.properties["color"];
        var v2 = this.properties["value"];
        if (this.properties["glowSize"]) {
          ctx.shadowColor = this.properties.color;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = this.properties["glowSize"];
        } else {
          ctx.shadowColor = "transparent";
        }
        var fontsize = this.properties["fontsize"];
        ctx.textAlign = this.properties["align"];
        ctx.font = fontsize.toString() + "px " + this.properties["font"];
        this.str = typeof v2 == "number" ? v2.toFixed(this.properties["decimals"]) : v2;
        if (typeof this.str == "string") {
          var lines = this.str.replace(/[\r\n]/g, "\\n").split("\\n");
          for (var i2 = 0; i2 < lines.length; i2++) {
            ctx.fillText(
              lines[i2],
              this.properties["align"] == "left" ? 15 : this.size[0] - 15,
              fontsize * -0.15 + fontsize * (parseInt(i2) + 1)
            );
          }
        }
        ctx.shadowColor = "transparent";
        this.last_ctx = ctx;
        ctx.textAlign = "left";
      };
      WidgetText.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 != null) {
          this.properties["value"] = v2;
        }
      };
      WidgetText.prototype.resize = function() {
        if (!this.last_ctx) {
          return;
        }
        var lines = this.str.split("\\n");
        this.last_ctx.font = this.properties["fontsize"] + "px " + this.properties["font"];
        var max = 0;
        for (var i2 = 0; i2 < lines.length; i2++) {
          var w2 = this.last_ctx.measureText(lines[i2]).width;
          if (max < w2) {
            max = w2;
          }
        }
        this.size[0] = max + 20;
        this.size[1] = 4 + lines.length * this.properties["fontsize"];
        this.setDirtyCanvas(true);
      };
      WidgetText.prototype.onPropertyChanged = function(name, value) {
        this.properties[name] = value;
        this.str = typeof value == "number" ? value.toFixed(3) : value;
        return true;
      };
      LiteGraph2.registerNodeType("widget/text", WidgetText);
      function WidgetPanel() {
        this.size = [200, 100];
        this.properties = {
          borderColor: "#ffffff",
          bgcolorTop: "#f0f0f0",
          bgcolorBottom: "#e0e0e0",
          shadowSize: 2,
          borderRadius: 3
        };
      }
      WidgetPanel.title = "Panel";
      WidgetPanel.desc = "Non interactive panel";
      WidgetPanel.widgets = [{ name: "update", text: "Update", type: "button" }];
      WidgetPanel.prototype.createGradient = function(ctx) {
        if (this.properties["bgcolorTop"] == "" || this.properties["bgcolorBottom"] == "") {
          this.lineargradient = 0;
          return;
        }
        this.lineargradient = ctx.createLinearGradient(0, 0, 0, this.size[1]);
        this.lineargradient.addColorStop(0, this.properties["bgcolorTop"]);
        this.lineargradient.addColorStop(1, this.properties["bgcolorBottom"]);
      };
      WidgetPanel.prototype.onDrawForeground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        if (this.lineargradient == null) {
          this.createGradient(ctx);
        }
        if (!this.lineargradient) {
          return;
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.properties["borderColor"];
        ctx.fillStyle = this.lineargradient;
        if (this.properties["shadowSize"]) {
          ctx.shadowColor = "#000";
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = this.properties["shadowSize"];
        } else {
          ctx.shadowColor = "transparent";
        }
        ctx.roundRect(
          0,
          0,
          this.size[0] - 1,
          this.size[1] - 1,
          this.properties["shadowSize"]
        );
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.stroke();
      };
      LiteGraph2.registerNodeType("widget/panel", WidgetPanel);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function GamepadInput() {
        this.addOutput("left_x_axis", "number");
        this.addOutput("left_y_axis", "number");
        this.addOutput("button_pressed", LiteGraph2.EVENT);
        this.properties = { gamepad_index: 0, threshold: 0.1 };
        this._left_axis = new Float32Array(2);
        this._right_axis = new Float32Array(2);
        this._triggers = new Float32Array(2);
        this._previous_buttons = new Uint8Array(17);
        this._current_buttons = new Uint8Array(17);
      }
      GamepadInput.title = "Gamepad";
      GamepadInput.desc = "gets the input of the gamepad";
      GamepadInput.CENTER = 0;
      GamepadInput.LEFT = 1;
      GamepadInput.RIGHT = 2;
      GamepadInput.UP = 4;
      GamepadInput.DOWN = 8;
      GamepadInput.zero = new Float32Array(2);
      GamepadInput.buttons = [
        "a",
        "b",
        "x",
        "y",
        "lb",
        "rb",
        "lt",
        "rt",
        "back",
        "start",
        "ls",
        "rs",
        "home"
      ];
      GamepadInput.prototype.onExecute = function() {
        var gamepad = this.getGamepad();
        var threshold = this.properties.threshold || 0;
        if (gamepad) {
          this._left_axis[0] = Math.abs(gamepad.xbox.axes["lx"]) > threshold ? gamepad.xbox.axes["lx"] : 0;
          this._left_axis[1] = Math.abs(gamepad.xbox.axes["ly"]) > threshold ? gamepad.xbox.axes["ly"] : 0;
          this._right_axis[0] = Math.abs(gamepad.xbox.axes["rx"]) > threshold ? gamepad.xbox.axes["rx"] : 0;
          this._right_axis[1] = Math.abs(gamepad.xbox.axes["ry"]) > threshold ? gamepad.xbox.axes["ry"] : 0;
          this._triggers[0] = Math.abs(gamepad.xbox.axes["ltrigger"]) > threshold ? gamepad.xbox.axes["ltrigger"] : 0;
          this._triggers[1] = Math.abs(gamepad.xbox.axes["rtrigger"]) > threshold ? gamepad.xbox.axes["rtrigger"] : 0;
        }
        if (this.outputs) {
          for (var i2 = 0; i2 < this.outputs.length; i2++) {
            var output = this.outputs[i2];
            if (!output.links || !output.links.length) {
              continue;
            }
            var v2 = null;
            if (gamepad) {
              switch (output.name) {
                case "left_axis":
                  v2 = this._left_axis;
                  break;
                case "right_axis":
                  v2 = this._right_axis;
                  break;
                case "left_x_axis":
                  v2 = this._left_axis[0];
                  break;
                case "left_y_axis":
                  v2 = this._left_axis[1];
                  break;
                case "right_x_axis":
                  v2 = this._right_axis[0];
                  break;
                case "right_y_axis":
                  v2 = this._right_axis[1];
                  break;
                case "trigger_left":
                  v2 = this._triggers[0];
                  break;
                case "trigger_right":
                  v2 = this._triggers[1];
                  break;
                case "a_button":
                  v2 = gamepad.xbox.buttons["a"] ? 1 : 0;
                  break;
                case "b_button":
                  v2 = gamepad.xbox.buttons["b"] ? 1 : 0;
                  break;
                case "x_button":
                  v2 = gamepad.xbox.buttons["x"] ? 1 : 0;
                  break;
                case "y_button":
                  v2 = gamepad.xbox.buttons["y"] ? 1 : 0;
                  break;
                case "lb_button":
                  v2 = gamepad.xbox.buttons["lb"] ? 1 : 0;
                  break;
                case "rb_button":
                  v2 = gamepad.xbox.buttons["rb"] ? 1 : 0;
                  break;
                case "ls_button":
                  v2 = gamepad.xbox.buttons["ls"] ? 1 : 0;
                  break;
                case "rs_button":
                  v2 = gamepad.xbox.buttons["rs"] ? 1 : 0;
                  break;
                case "hat_left":
                  v2 = gamepad.xbox.hatmap & GamepadInput.LEFT;
                  break;
                case "hat_right":
                  v2 = gamepad.xbox.hatmap & GamepadInput.RIGHT;
                  break;
                case "hat_up":
                  v2 = gamepad.xbox.hatmap & GamepadInput.UP;
                  break;
                case "hat_down":
                  v2 = gamepad.xbox.hatmap & GamepadInput.DOWN;
                  break;
                case "hat":
                  v2 = gamepad.xbox.hatmap;
                  break;
                case "start_button":
                  v2 = gamepad.xbox.buttons["start"] ? 1 : 0;
                  break;
                case "back_button":
                  v2 = gamepad.xbox.buttons["back"] ? 1 : 0;
                  break;
                case "button_pressed":
                  for (var j = 0; j < this._current_buttons.length; ++j) {
                    if (this._current_buttons[j] && !this._previous_buttons[j]) {
                      this.triggerSlot(
                        i2,
                        GamepadInput.buttons[j]
                      );
                    }
                  }
                  break;
              }
            } else {
              switch (output.name) {
                case "button_pressed":
                  break;
                case "left_axis":
                case "right_axis":
                  v2 = GamepadInput.zero;
                  break;
                default:
                  v2 = 0;
              }
            }
            this.setOutputData(i2, v2);
          }
        }
      };
      GamepadInput.mapping = { a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, lt: 6, rt: 7, back: 8, start: 9, ls: 10, rs: 11 };
      GamepadInput.mapping_array = ["a", "b", "x", "y", "lb", "rb", "lt", "rt", "back", "start", "ls", "rs"];
      GamepadInput.prototype.getGamepad = function() {
        var getGamepads = navigator.getGamepads || navigator.webkitGetGamepads || navigator.mozGetGamepads;
        if (!getGamepads) {
          return null;
        }
        var gamepads = getGamepads.call(navigator);
        var gamepad = null;
        this._previous_buttons.set(this._current_buttons);
        for (var i2 = this.properties.gamepad_index; i2 < 4; i2++) {
          if (!gamepads[i2]) {
            continue;
          }
          gamepad = gamepads[i2];
          var xbox = this.xbox_mapping;
          if (!xbox) {
            xbox = this.xbox_mapping = {
              axes: [],
              buttons: {},
              hat: "",
              hatmap: GamepadInput.CENTER
            };
          }
          xbox.axes["lx"] = gamepad.axes[0];
          xbox.axes["ly"] = gamepad.axes[1];
          xbox.axes["rx"] = gamepad.axes[2];
          xbox.axes["ry"] = gamepad.axes[3];
          xbox.axes["ltrigger"] = gamepad.buttons[6].value;
          xbox.axes["rtrigger"] = gamepad.buttons[7].value;
          xbox.hat = "";
          xbox.hatmap = GamepadInput.CENTER;
          for (var j = 0; j < gamepad.buttons.length; j++) {
            this._current_buttons[j] = gamepad.buttons[j].pressed;
            if (j < 12) {
              xbox.buttons[GamepadInput.mapping_array[j]] = gamepad.buttons[j].pressed;
              if (gamepad.buttons[j].was_pressed)
                this.trigger(GamepadInput.mapping_array[j] + "_button_event");
            } else
              switch (j) {
                case 12:
                  if (gamepad.buttons[j].pressed) {
                    xbox.hat += "up";
                    xbox.hatmap |= GamepadInput.UP;
                  }
                  break;
                case 13:
                  if (gamepad.buttons[j].pressed) {
                    xbox.hat += "down";
                    xbox.hatmap |= GamepadInput.DOWN;
                  }
                  break;
                case 14:
                  if (gamepad.buttons[j].pressed) {
                    xbox.hat += "left";
                    xbox.hatmap |= GamepadInput.LEFT;
                  }
                  break;
                case 15:
                  if (gamepad.buttons[j].pressed) {
                    xbox.hat += "right";
                    xbox.hatmap |= GamepadInput.RIGHT;
                  }
                  break;
                case 16:
                  xbox.buttons["home"] = gamepad.buttons[j].pressed;
                  break;
              }
          }
          gamepad.xbox = xbox;
          return gamepad;
        }
      };
      GamepadInput.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        var la = this._left_axis;
        var ra = this._right_axis;
        ctx.strokeStyle = "#88A";
        ctx.strokeRect(
          (la[0] + 1) * 0.5 * this.size[0] - 4,
          (la[1] + 1) * 0.5 * this.size[1] - 4,
          8,
          8
        );
        ctx.strokeStyle = "#8A8";
        ctx.strokeRect(
          (ra[0] + 1) * 0.5 * this.size[0] - 4,
          (ra[1] + 1) * 0.5 * this.size[1] - 4,
          8,
          8
        );
        var h = this.size[1] / this._current_buttons.length;
        ctx.fillStyle = "#AEB";
        for (var i2 = 0; i2 < this._current_buttons.length; ++i2) {
          if (this._current_buttons[i2]) {
            ctx.fillRect(0, h * i2, 6, h);
          }
        }
      };
      GamepadInput.prototype.onGetOutputs = function() {
        return [
          ["left_axis", "vec2"],
          ["right_axis", "vec2"],
          ["left_x_axis", "number"],
          ["left_y_axis", "number"],
          ["right_x_axis", "number"],
          ["right_y_axis", "number"],
          ["trigger_left", "number"],
          ["trigger_right", "number"],
          ["a_button", "number"],
          ["b_button", "number"],
          ["x_button", "number"],
          ["y_button", "number"],
          ["lb_button", "number"],
          ["rb_button", "number"],
          ["ls_button", "number"],
          ["rs_button", "number"],
          ["start_button", "number"],
          ["back_button", "number"],
          ["a_button_event", LiteGraph2.EVENT],
          ["b_button_event", LiteGraph2.EVENT],
          ["x_button_event", LiteGraph2.EVENT],
          ["y_button_event", LiteGraph2.EVENT],
          ["lb_button_event", LiteGraph2.EVENT],
          ["rb_button_event", LiteGraph2.EVENT],
          ["ls_button_event", LiteGraph2.EVENT],
          ["rs_button_event", LiteGraph2.EVENT],
          ["start_button_event", LiteGraph2.EVENT],
          ["back_button_event", LiteGraph2.EVENT],
          ["hat_left", "number"],
          ["hat_right", "number"],
          ["hat_up", "number"],
          ["hat_down", "number"],
          ["hat", "number"],
          ["button_pressed", LiteGraph2.EVENT]
        ];
      };
      LiteGraph2.registerNodeType("input/gamepad", GamepadInput);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function Converter() {
        this.addInput("in", 0);
        this.addOutput("out", 0);
        this.size = [80, 30];
      }
      Converter.title = "Converter";
      Converter.desc = "type A to type B";
      Converter.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        if (this.outputs) {
          for (var i2 = 0; i2 < this.outputs.length; i2++) {
            var output = this.outputs[i2];
            if (!output.links || !output.links.length) {
              continue;
            }
            var result = null;
            switch (output.name) {
              case "number":
                result = v2.length ? v2[0] : parseFloat(v2);
                break;
              case "vec2":
              case "vec3":
              case "vec4":
                var result = null;
                var count = 1;
                switch (output.name) {
                  case "vec2":
                    count = 2;
                    break;
                  case "vec3":
                    count = 3;
                    break;
                  case "vec4":
                    count = 4;
                    break;
                }
                var result = new Float32Array(count);
                if (v2.length) {
                  for (var j = 0; j < v2.length && j < result.length; j++) {
                    result[j] = v2[j];
                  }
                } else {
                  result[0] = parseFloat(v2);
                }
                break;
            }
            this.setOutputData(i2, result);
          }
        }
      };
      Converter.prototype.onGetOutputs = function() {
        return [
          ["number", "number"],
          ["vec2", "vec2"],
          ["vec3", "vec3"],
          ["vec4", "vec4"]
        ];
      };
      LiteGraph2.registerNodeType("math/converter", Converter);
      function Bypass() {
        this.addInput("in");
        this.addOutput("out");
        this.size = [80, 30];
      }
      Bypass.title = "Bypass";
      Bypass.desc = "removes the type";
      Bypass.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        this.setOutputData(0, v2);
      };
      LiteGraph2.registerNodeType("math/bypass", Bypass);
      function ToNumber() {
        this.addInput("in");
        this.addOutput("out");
      }
      ToNumber.title = "to Number";
      ToNumber.desc = "Cast to number";
      ToNumber.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        this.setOutputData(0, Number(v2));
      };
      LiteGraph2.registerNodeType("math/to_number", ToNumber);
      function MathRange() {
        this.addInput("in", "number", { locked: true });
        this.addOutput("out", "number", { locked: true });
        this.addOutput("clamped", "number", { locked: true });
        this.addProperty("in", 0);
        this.addProperty("in_min", 0);
        this.addProperty("in_max", 1);
        this.addProperty("out_min", 0);
        this.addProperty("out_max", 1);
        this.size = [120, 50];
      }
      MathRange.title = "Range";
      MathRange.desc = "Convert a number from one range to another";
      MathRange.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return (this._last_v || 0).toFixed(2);
        }
        return this.title;
      };
      MathRange.prototype.onExecute = function() {
        if (this.inputs) {
          for (var i2 = 0; i2 < this.inputs.length; i2++) {
            var input = this.inputs[i2];
            var v2 = this.getInputData(i2);
            if (v2 === void 0) {
              continue;
            }
            this.properties[input.name] = v2;
          }
        }
        var v2 = this.properties["in"];
        if (v2 === void 0 || v2 === null || v2.constructor !== Number) {
          v2 = 0;
        }
        var in_min = this.properties.in_min;
        var in_max = this.properties.in_max;
        var out_min = this.properties.out_min;
        var out_max = this.properties.out_max;
        this._last_v = (v2 - in_min) / (in_max - in_min) * (out_max - out_min) + out_min;
        this.setOutputData(0, this._last_v);
        this.setOutputData(1, clamp(this._last_v, out_min, out_max));
      };
      MathRange.prototype.onDrawBackground = function(ctx) {
        if (this._last_v) {
          this.outputs[0].label = this._last_v.toFixed(3);
        } else {
          this.outputs[0].label = "?";
        }
      };
      MathRange.prototype.onGetInputs = function() {
        return [
          ["in_min", "number"],
          ["in_max", "number"],
          ["out_min", "number"],
          ["out_max", "number"]
        ];
      };
      LiteGraph2.registerNodeType("math/range", MathRange);
      function MathRand() {
        this.addOutput("value", "number");
        this.addProperty("min", 0);
        this.addProperty("max", 1);
        this.size = [80, 30];
      }
      MathRand.title = "Rand";
      MathRand.desc = "Random number";
      MathRand.prototype.onExecute = function() {
        if (this.inputs) {
          for (var i2 = 0; i2 < this.inputs.length; i2++) {
            var input = this.inputs[i2];
            var v2 = this.getInputData(i2);
            if (v2 === void 0) {
              continue;
            }
            this.properties[input.name] = v2;
          }
        }
        var min = this.properties.min;
        var max = this.properties.max;
        this._last_v = Math.random() * (max - min) + min;
        this.setOutputData(0, this._last_v);
      };
      MathRand.prototype.onDrawBackground = function(ctx) {
        this.outputs[0].label = (this._last_v || 0).toFixed(3);
      };
      MathRand.prototype.onGetInputs = function() {
        return [["min", "number"], ["max", "number"]];
      };
      LiteGraph2.registerNodeType("math/rand", MathRand);
      function MathNoise() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.addProperty("min", 0);
        this.addProperty("max", 1);
        this.addProperty("smooth", true);
        this.addProperty("seed", 0);
        this.addProperty("octaves", 1);
        this.addProperty("persistence", 0.8);
        this.addProperty("speed", 1);
        this.size = [90, 30];
      }
      MathNoise.title = "Noise";
      MathNoise.desc = "Random number with temporal continuity";
      MathNoise.data = null;
      MathNoise.getValue = function(f, smooth) {
        if (!MathNoise.data) {
          MathNoise.data = new Float32Array(1024);
          for (var i2 = 0; i2 < MathNoise.data.length; ++i2) {
            MathNoise.data[i2] = Math.random();
          }
        }
        f = f % 1024;
        if (f < 0) {
          f += 1024;
        }
        var f_min = Math.floor(f);
        var f = f - f_min;
        var r1 = MathNoise.data[f_min];
        var r2 = MathNoise.data[f_min == 1023 ? 0 : f_min + 1];
        if (smooth) {
          f = f * f * f * (f * (f * 6 - 15) + 10);
        }
        return r1 * (1 - f) + r2 * f;
      };
      MathNoise.prototype.onExecute = function() {
        var f = this.getInputData(0) || 0;
        var iterations = this.properties.octaves || 1;
        var r = 0;
        var amp = 1;
        var seed = this.properties.seed || 0;
        f += seed;
        var speed = this.properties.speed || 1;
        var total_amp = 0;
        for (var i2 = 0; i2 < iterations; ++i2) {
          r += MathNoise.getValue(f * (1 + i2) * speed, this.properties.smooth) * amp;
          total_amp += amp;
          amp *= this.properties.persistence;
          if (amp < 1e-3)
            break;
        }
        r /= total_amp;
        var min = this.properties.min;
        var max = this.properties.max;
        this._last_v = r * (max - min) + min;
        this.setOutputData(0, this._last_v);
      };
      MathNoise.prototype.onDrawBackground = function(ctx) {
        this.outputs[0].label = (this._last_v || 0).toFixed(3);
      };
      LiteGraph2.registerNodeType("math/noise", MathNoise);
      function MathSpikes() {
        this.addOutput("out", "number");
        this.addProperty("min_time", 1);
        this.addProperty("max_time", 2);
        this.addProperty("duration", 0.2);
        this.size = [90, 30];
        this._remaining_time = 0;
        this._blink_time = 0;
      }
      MathSpikes.title = "Spikes";
      MathSpikes.desc = "spike every random time";
      MathSpikes.prototype.onExecute = function() {
        var dt = this.graph.elapsed_time;
        this._remaining_time -= dt;
        this._blink_time -= dt;
        var v2 = 0;
        if (this._blink_time > 0) {
          var f = this._blink_time / this.properties.duration;
          v2 = 1 / (Math.pow(f * 8 - 4, 4) + 1);
        }
        if (this._remaining_time < 0) {
          this._remaining_time = Math.random() * (this.properties.max_time - this.properties.min_time) + this.properties.min_time;
          this._blink_time = this.properties.duration;
          this.boxcolor = "#FFF";
        } else {
          this.boxcolor = "#000";
        }
        this.setOutputData(0, v2);
      };
      LiteGraph2.registerNodeType("math/spikes", MathSpikes);
      function MathClamp() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
        this.addProperty("min", 0);
        this.addProperty("max", 1);
      }
      MathClamp.title = "Clamp";
      MathClamp.desc = "Clamp number between min and max";
      MathClamp.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        v2 = Math.max(this.properties.min, v2);
        v2 = Math.min(this.properties.max, v2);
        this.setOutputData(0, v2);
      };
      MathClamp.prototype.getCode = function(lang) {
        var code = "";
        if (this.isInputConnected(0)) {
          code += "clamp({{0}}," + this.properties.min + "," + this.properties.max + ")";
        }
        return code;
      };
      LiteGraph2.registerNodeType("math/clamp", MathClamp);
      function MathLerp() {
        this.properties = { f: 0.5 };
        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput("out", "number");
      }
      MathLerp.title = "Lerp";
      MathLerp.desc = "Linear Interpolation";
      MathLerp.prototype.onExecute = function() {
        var v1 = this.getInputData(0);
        if (v1 == null) {
          v1 = 0;
        }
        var v2 = this.getInputData(1);
        if (v2 == null) {
          v2 = 0;
        }
        var f = this.properties.f;
        var _f = this.getInputData(2);
        if (_f !== void 0) {
          f = _f;
        }
        this.setOutputData(0, v1 * (1 - f) + v2 * f);
      };
      MathLerp.prototype.onGetInputs = function() {
        return [["f", "number"]];
      };
      LiteGraph2.registerNodeType("math/lerp", MathLerp);
      function MathAbs() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
      }
      MathAbs.title = "Abs";
      MathAbs.desc = "Absolute";
      MathAbs.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        this.setOutputData(0, Math.abs(v2));
      };
      LiteGraph2.registerNodeType("math/abs", MathAbs);
      function MathFloor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
      }
      MathFloor.title = "Floor";
      MathFloor.desc = "Floor number to remove fractional part";
      MathFloor.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        this.setOutputData(0, Math.floor(v2));
      };
      LiteGraph2.registerNodeType("math/floor", MathFloor);
      function MathFrac() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
      }
      MathFrac.title = "Frac";
      MathFrac.desc = "Returns fractional part";
      MathFrac.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        this.setOutputData(0, v2 % 1);
      };
      LiteGraph2.registerNodeType("math/frac", MathFrac);
      function MathSmoothStep() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
        this.properties = { A: 0, B: 1 };
      }
      MathSmoothStep.title = "Smoothstep";
      MathSmoothStep.desc = "Smoothstep";
      MathSmoothStep.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 === void 0) {
          return;
        }
        var edge0 = this.properties.A;
        var edge1 = this.properties.B;
        v2 = clamp((v2 - edge0) / (edge1 - edge0), 0, 1);
        v2 = v2 * v2 * (3 - 2 * v2);
        this.setOutputData(0, v2);
      };
      LiteGraph2.registerNodeType("math/smoothstep", MathSmoothStep);
      function MathScale() {
        this.addInput("in", "number", { label: "" });
        this.addOutput("out", "number", { label: "" });
        this.size = [80, 30];
        this.addProperty("factor", 1);
      }
      MathScale.title = "Scale";
      MathScale.desc = "v * factor";
      MathScale.prototype.onExecute = function() {
        var value = this.getInputData(0);
        if (value != null) {
          this.setOutputData(0, value * this.properties.factor);
        }
      };
      LiteGraph2.registerNodeType("math/scale", MathScale);
      function Gate() {
        this.addInput("v", "boolean");
        this.addInput("A");
        this.addInput("B");
        this.addOutput("out");
      }
      Gate.title = "Gate";
      Gate.desc = "if v is true, then outputs A, otherwise B";
      Gate.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        this.setOutputData(0, this.getInputData(v2 ? 1 : 2));
      };
      LiteGraph2.registerNodeType("math/gate", Gate);
      function MathAverageFilter() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
        this.addProperty("samples", 10);
        this._values = new Float32Array(10);
        this._current = 0;
      }
      MathAverageFilter.title = "Average";
      MathAverageFilter.desc = "Average Filter";
      MathAverageFilter.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          v2 = 0;
        }
        var num_samples = this._values.length;
        this._values[this._current % num_samples] = v2;
        this._current += 1;
        if (this._current > num_samples) {
          this._current = 0;
        }
        var avr = 0;
        for (var i2 = 0; i2 < num_samples; ++i2) {
          avr += this._values[i2];
        }
        this.setOutputData(0, avr / num_samples);
      };
      MathAverageFilter.prototype.onPropertyChanged = function(name, value) {
        if (value < 1) {
          value = 1;
        }
        this.properties.samples = Math.round(value);
        var old = this._values;
        this._values = new Float32Array(this.properties.samples);
        if (old.length <= this._values.length) {
          this._values.set(old);
        } else {
          this._values.set(old.subarray(0, this._values.length));
        }
      };
      LiteGraph2.registerNodeType("math/average", MathAverageFilter);
      function MathTendTo() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.addProperty("factor", 0.1);
        this.size = [80, 30];
        this._value = null;
      }
      MathTendTo.title = "TendTo";
      MathTendTo.desc = "moves the output value always closer to the input";
      MathTendTo.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          v2 = 0;
        }
        var f = this.properties.factor;
        if (this._value == null) {
          this._value = v2;
        } else {
          this._value = this._value * (1 - f) + v2 * f;
        }
        this.setOutputData(0, this._value);
      };
      LiteGraph2.registerNodeType("math/tendTo", MathTendTo);
      function MathOperation() {
        this.addInput("A", "number,array,object");
        this.addInput("B", "number");
        this.addOutput("=", "number");
        this.addProperty("A", 1);
        this.addProperty("B", 1);
        this.addProperty("OP", "+", "enum", { values: MathOperation.values });
        this._func = MathOperation.funcs[this.properties.OP];
        this._result = [];
      }
      MathOperation.values = ["+", "-", "*", "/", "%", "^", "max", "min"];
      MathOperation.funcs = {
        "+": function(A, B) {
          return A + B;
        },
        "-": function(A, B) {
          return A - B;
        },
        "x": function(A, B) {
          return A * B;
        },
        "X": function(A, B) {
          return A * B;
        },
        "*": function(A, B) {
          return A * B;
        },
        "/": function(A, B) {
          return A / B;
        },
        "%": function(A, B) {
          return A % B;
        },
        "^": function(A, B) {
          return Math.pow(A, B);
        },
        "max": function(A, B) {
          return Math.max(A, B);
        },
        "min": function(A, B) {
          return Math.min(A, B);
        }
      };
      MathOperation.title = "Operation";
      MathOperation.desc = "Easy math operators";
      MathOperation["@OP"] = {
        type: "enum",
        title: "operation",
        values: MathOperation.values
      };
      MathOperation.size = [100, 60];
      MathOperation.prototype.getTitle = function() {
        if (this.properties.OP == "max" || this.properties.OP == "min")
          return this.properties.OP + "(A,B)";
        return "A " + this.properties.OP + " B";
      };
      MathOperation.prototype.setValue = function(v2) {
        if (typeof v2 == "string") {
          v2 = parseFloat(v2);
        }
        this.properties["value"] = v2;
      };
      MathOperation.prototype.onPropertyChanged = function(name, value) {
        if (name != "OP")
          return;
        this._func = MathOperation.funcs[this.properties.OP];
        if (!this._func) {
          console.warn("Unknown operation: " + this.properties.OP);
          this._func = function(A) {
            return A;
          };
        }
      };
      MathOperation.prototype.onExecute = function() {
        var A = this.getInputData(0);
        var B = this.getInputData(1);
        if (A != null) {
          if (A.constructor === Number)
            this.properties["A"] = A;
        } else {
          A = this.properties["A"];
        }
        if (B != null) {
          this.properties["B"] = B;
        } else {
          B = this.properties["B"];
        }
        var func = MathOperation.funcs[this.properties.OP];
        var result;
        if (A.constructor === Number) {
          result = 0;
          result = func(A, B);
        } else if (A.constructor === Array) {
          result = this._result;
          result.length = A.length;
          for (var i2 = 0; i2 < A.length; ++i2)
            result[i2] = func(A[i2], B);
        } else {
          result = {};
          for (var i2 in A)
            result[i2] = func(A[i2], B);
        }
        this.setOutputData(0, result);
      };
      MathOperation.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        ctx.font = "40px Arial";
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.fillText(
          this.properties.OP,
          this.size[0] * 0.5,
          (this.size[1] + LiteGraph2.NODE_TITLE_HEIGHT) * 0.5
        );
        ctx.textAlign = "left";
      };
      LiteGraph2.registerNodeType("math/operation", MathOperation);
      LiteGraph2.registerSearchboxExtra("math/operation", "MAX", {
        properties: { OP: "max" },
        title: "MAX()"
      });
      LiteGraph2.registerSearchboxExtra("math/operation", "MIN", {
        properties: { OP: "min" },
        title: "MIN()"
      });
      function MathCompare() {
        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput("A==B", "boolean");
        this.addOutput("A!=B", "boolean");
        this.addProperty("A", 0);
        this.addProperty("B", 0);
      }
      MathCompare.title = "Compare";
      MathCompare.desc = "compares between two values";
      MathCompare.prototype.onExecute = function() {
        var A = this.getInputData(0);
        var B = this.getInputData(1);
        if (A !== void 0) {
          this.properties["A"] = A;
        } else {
          A = this.properties["A"];
        }
        if (B !== void 0) {
          this.properties["B"] = B;
        } else {
          B = this.properties["B"];
        }
        for (var i2 = 0, l = this.outputs.length; i2 < l; ++i2) {
          var output = this.outputs[i2];
          if (!output.links || !output.links.length) {
            continue;
          }
          var value;
          switch (output.name) {
            case "A==B":
              value = A == B;
              break;
            case "A!=B":
              value = A != B;
              break;
            case "A>B":
              value = A > B;
              break;
            case "A<B":
              value = A < B;
              break;
            case "A<=B":
              value = A <= B;
              break;
            case "A>=B":
              value = A >= B;
              break;
          }
          this.setOutputData(i2, value);
        }
      };
      MathCompare.prototype.onGetOutputs = function() {
        return [
          ["A==B", "boolean"],
          ["A!=B", "boolean"],
          ["A>B", "boolean"],
          ["A<B", "boolean"],
          ["A>=B", "boolean"],
          ["A<=B", "boolean"]
        ];
      };
      LiteGraph2.registerNodeType("math/compare", MathCompare);
      LiteGraph2.registerSearchboxExtra("math/compare", "==", {
        outputs: [["A==B", "boolean"]],
        title: "A==B"
      });
      LiteGraph2.registerSearchboxExtra("math/compare", "!=", {
        outputs: [["A!=B", "boolean"]],
        title: "A!=B"
      });
      LiteGraph2.registerSearchboxExtra("math/compare", ">", {
        outputs: [["A>B", "boolean"]],
        title: "A>B"
      });
      LiteGraph2.registerSearchboxExtra("math/compare", "<", {
        outputs: [["A<B", "boolean"]],
        title: "A<B"
      });
      LiteGraph2.registerSearchboxExtra("math/compare", ">=", {
        outputs: [["A>=B", "boolean"]],
        title: "A>=B"
      });
      LiteGraph2.registerSearchboxExtra("math/compare", "<=", {
        outputs: [["A<=B", "boolean"]],
        title: "A<=B"
      });
      function MathCondition() {
        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput("true", "boolean");
        this.addOutput("false", "boolean");
        this.addProperty("A", 1);
        this.addProperty("B", 1);
        this.addProperty("OP", ">", "enum", { values: MathCondition.values });
        this.addWidget("combo", "Cond.", this.properties.OP, { property: "OP", values: MathCondition.values });
        this.size = [80, 60];
      }
      MathCondition.values = [">", "<", "==", "!=", "<=", ">=", "||", "&&"];
      MathCondition["@OP"] = {
        type: "enum",
        title: "operation",
        values: MathCondition.values
      };
      MathCondition.title = "Condition";
      MathCondition.desc = "evaluates condition between A and B";
      MathCondition.prototype.getTitle = function() {
        return "A " + this.properties.OP + " B";
      };
      MathCondition.prototype.onExecute = function() {
        var A = this.getInputData(0);
        if (A === void 0) {
          A = this.properties.A;
        } else {
          this.properties.A = A;
        }
        var B = this.getInputData(1);
        if (B === void 0) {
          B = this.properties.B;
        } else {
          this.properties.B = B;
        }
        var result = true;
        switch (this.properties.OP) {
          case ">":
            result = A > B;
            break;
          case "<":
            result = A < B;
            break;
          case "==":
            result = A == B;
            break;
          case "!=":
            result = A != B;
            break;
          case "<=":
            result = A <= B;
            break;
          case ">=":
            result = A >= B;
            break;
          case "||":
            result = A || B;
            break;
          case "&&":
            result = A && B;
            break;
        }
        this.setOutputData(0, result);
        this.setOutputData(1, !result);
      };
      LiteGraph2.registerNodeType("math/condition", MathCondition);
      function MathBranch() {
        this.addInput("in", 0);
        this.addInput("cond", "boolean");
        this.addOutput("true", 0);
        this.addOutput("false", 0);
        this.size = [80, 60];
      }
      MathBranch.title = "Branch";
      MathBranch.desc = "If condition is true, outputs IN in true, otherwise in false";
      MathBranch.prototype.onExecute = function() {
        var V = this.getInputData(0);
        var cond = this.getInputData(1);
        if (cond) {
          this.setOutputData(0, V);
          this.setOutputData(1, null);
        } else {
          this.setOutputData(0, null);
          this.setOutputData(1, V);
        }
      };
      LiteGraph2.registerNodeType("math/branch", MathBranch);
      function MathAccumulate() {
        this.addInput("inc", "number");
        this.addOutput("total", "number");
        this.addProperty("increment", 1);
        this.addProperty("value", 0);
      }
      MathAccumulate.title = "Accumulate";
      MathAccumulate.desc = "Increments a value every time";
      MathAccumulate.prototype.onExecute = function() {
        if (this.properties.value === null) {
          this.properties.value = 0;
        }
        var inc = this.getInputData(0);
        if (inc !== null) {
          this.properties.value += inc;
        } else {
          this.properties.value += this.properties.increment;
        }
        this.setOutputData(0, this.properties.value);
      };
      LiteGraph2.registerNodeType("math/accumulate", MathAccumulate);
      function MathTrigonometry() {
        this.addInput("v", "number");
        this.addOutput("sin", "number");
        this.addProperty("amplitude", 1);
        this.addProperty("offset", 0);
        this.bgImageUrl = "nodes/imgs/icon-sin.png";
      }
      MathTrigonometry.title = "Trigonometry";
      MathTrigonometry.desc = "Sin Cos Tan";
      MathTrigonometry.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          v2 = 0;
        }
        var amplitude = this.properties["amplitude"];
        var slot = this.findInputSlot("amplitude");
        if (slot != -1) {
          amplitude = this.getInputData(slot);
        }
        var offset = this.properties["offset"];
        slot = this.findInputSlot("offset");
        if (slot != -1) {
          offset = this.getInputData(slot);
        }
        for (var i2 = 0, l = this.outputs.length; i2 < l; ++i2) {
          var output = this.outputs[i2];
          var value;
          switch (output.name) {
            case "sin":
              value = Math.sin(v2);
              break;
            case "cos":
              value = Math.cos(v2);
              break;
            case "tan":
              value = Math.tan(v2);
              break;
            case "asin":
              value = Math.asin(v2);
              break;
            case "acos":
              value = Math.acos(v2);
              break;
            case "atan":
              value = Math.atan(v2);
              break;
          }
          this.setOutputData(i2, amplitude * value + offset);
        }
      };
      MathTrigonometry.prototype.onGetInputs = function() {
        return [["v", "number"], ["amplitude", "number"], ["offset", "number"]];
      };
      MathTrigonometry.prototype.onGetOutputs = function() {
        return [
          ["sin", "number"],
          ["cos", "number"],
          ["tan", "number"],
          ["asin", "number"],
          ["acos", "number"],
          ["atan", "number"]
        ];
      };
      LiteGraph2.registerNodeType("math/trigonometry", MathTrigonometry);
      LiteGraph2.registerSearchboxExtra("math/trigonometry", "SIN()", {
        outputs: [["sin", "number"]],
        title: "SIN()"
      });
      LiteGraph2.registerSearchboxExtra("math/trigonometry", "COS()", {
        outputs: [["cos", "number"]],
        title: "COS()"
      });
      LiteGraph2.registerSearchboxExtra("math/trigonometry", "TAN()", {
        outputs: [["tan", "number"]],
        title: "TAN()"
      });
      function MathFormula() {
        this.addInput("x", "number");
        this.addInput("y", "number");
        this.addOutput("", "number");
        this.properties = { x: 1, y: 1, formula: "x+y" };
        this.code_widget = this.addWidget(
          "text",
          "F(x,y)",
          this.properties.formula,
          function(v2, canvas, node2) {
            node2.properties.formula = v2;
          }
        );
        this.addWidget("toggle", "allow", LiteGraph2.allow_scripts, function(v2) {
          LiteGraph2.allow_scripts = v2;
        });
        this._func = null;
      }
      MathFormula.title = "Formula";
      MathFormula.desc = "Compute formula";
      MathFormula.size = [160, 100];
      MathAverageFilter.prototype.onPropertyChanged = function(name, value) {
        if (name == "formula") {
          this.code_widget.value = value;
        }
      };
      MathFormula.prototype.onExecute = function() {
        if (!LiteGraph2.allow_scripts) {
          return;
        }
        var x2 = this.getInputData(0);
        var y2 = this.getInputData(1);
        if (x2 != null) {
          this.properties["x"] = x2;
        } else {
          x2 = this.properties["x"];
        }
        if (y2 != null) {
          this.properties["y"] = y2;
        } else {
          y2 = this.properties["y"];
        }
        this.properties["formula"];
        var value;
        try {
          if (!this._func || this._func_code != this.properties.formula) {
            this._func = new Function(
              "x",
              "y",
              "TIME",
              "return " + this.properties.formula
            );
            this._func_code = this.properties.formula;
          }
          value = this._func(x2, y2, this.graph.globaltime);
          this.boxcolor = null;
        } catch (err) {
          this.boxcolor = "red";
        }
        this.setOutputData(0, value);
      };
      MathFormula.prototype.getTitle = function() {
        return this._func_code || "Formula";
      };
      MathFormula.prototype.onDrawBackground = function() {
        var f = this.properties["formula"];
        if (this.outputs && this.outputs.length) {
          this.outputs[0].label = f;
        }
      };
      LiteGraph2.registerNodeType("math/formula", MathFormula);
      function Math3DVec2ToXY() {
        this.addInput("vec2", "vec2");
        this.addOutput("x", "number");
        this.addOutput("y", "number");
      }
      Math3DVec2ToXY.title = "Vec2->XY";
      Math3DVec2ToXY.desc = "vector 2 to components";
      Math3DVec2ToXY.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        this.setOutputData(0, v2[0]);
        this.setOutputData(1, v2[1]);
      };
      LiteGraph2.registerNodeType("math3d/vec2-to-xy", Math3DVec2ToXY);
      function Math3DXYToVec2() {
        this.addInputs([["x", "number"], ["y", "number"]]);
        this.addOutput("vec2", "vec2");
        this.properties = { x: 0, y: 0 };
        this._data = new Float32Array(2);
      }
      Math3DXYToVec2.title = "XY->Vec2";
      Math3DXYToVec2.desc = "components to vector2";
      Math3DXYToVec2.prototype.onExecute = function() {
        var x2 = this.getInputData(0);
        if (x2 == null) {
          x2 = this.properties.x;
        }
        var y2 = this.getInputData(1);
        if (y2 == null) {
          y2 = this.properties.y;
        }
        var data = this._data;
        data[0] = x2;
        data[1] = y2;
        this.setOutputData(0, data);
      };
      LiteGraph2.registerNodeType("math3d/xy-to-vec2", Math3DXYToVec2);
      function Math3DVec3ToXYZ() {
        this.addInput("vec3", "vec3");
        this.addOutput("x", "number");
        this.addOutput("y", "number");
        this.addOutput("z", "number");
      }
      Math3DVec3ToXYZ.title = "Vec3->XYZ";
      Math3DVec3ToXYZ.desc = "vector 3 to components";
      Math3DVec3ToXYZ.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        this.setOutputData(0, v2[0]);
        this.setOutputData(1, v2[1]);
        this.setOutputData(2, v2[2]);
      };
      LiteGraph2.registerNodeType("math3d/vec3-to-xyz", Math3DVec3ToXYZ);
      function Math3DXYZToVec3() {
        this.addInputs([["x", "number"], ["y", "number"], ["z", "number"]]);
        this.addOutput("vec3", "vec3");
        this.properties = { x: 0, y: 0, z: 0 };
        this._data = new Float32Array(3);
      }
      Math3DXYZToVec3.title = "XYZ->Vec3";
      Math3DXYZToVec3.desc = "components to vector3";
      Math3DXYZToVec3.prototype.onExecute = function() {
        var x2 = this.getInputData(0);
        if (x2 == null) {
          x2 = this.properties.x;
        }
        var y2 = this.getInputData(1);
        if (y2 == null) {
          y2 = this.properties.y;
        }
        var z = this.getInputData(2);
        if (z == null) {
          z = this.properties.z;
        }
        var data = this._data;
        data[0] = x2;
        data[1] = y2;
        data[2] = z;
        this.setOutputData(0, data);
      };
      LiteGraph2.registerNodeType("math3d/xyz-to-vec3", Math3DXYZToVec3);
      function Math3DVec4ToXYZW() {
        this.addInput("vec4", "vec4");
        this.addOutput("x", "number");
        this.addOutput("y", "number");
        this.addOutput("z", "number");
        this.addOutput("w", "number");
      }
      Math3DVec4ToXYZW.title = "Vec4->XYZW";
      Math3DVec4ToXYZW.desc = "vector 4 to components";
      Math3DVec4ToXYZW.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        this.setOutputData(0, v2[0]);
        this.setOutputData(1, v2[1]);
        this.setOutputData(2, v2[2]);
        this.setOutputData(3, v2[3]);
      };
      LiteGraph2.registerNodeType("math3d/vec4-to-xyzw", Math3DVec4ToXYZW);
      function Math3DXYZWToVec4() {
        this.addInputs([
          ["x", "number"],
          ["y", "number"],
          ["z", "number"],
          ["w", "number"]
        ]);
        this.addOutput("vec4", "vec4");
        this.properties = { x: 0, y: 0, z: 0, w: 0 };
        this._data = new Float32Array(4);
      }
      Math3DXYZWToVec4.title = "XYZW->Vec4";
      Math3DXYZWToVec4.desc = "components to vector4";
      Math3DXYZWToVec4.prototype.onExecute = function() {
        var x2 = this.getInputData(0);
        if (x2 == null) {
          x2 = this.properties.x;
        }
        var y2 = this.getInputData(1);
        if (y2 == null) {
          y2 = this.properties.y;
        }
        var z = this.getInputData(2);
        if (z == null) {
          z = this.properties.z;
        }
        var w2 = this.getInputData(3);
        if (w2 == null) {
          w2 = this.properties.w;
        }
        var data = this._data;
        data[0] = x2;
        data[1] = y2;
        data[2] = z;
        data[3] = w2;
        this.setOutputData(0, data);
      };
      LiteGraph2.registerNodeType("math3d/xyzw-to-vec4", Math3DXYZWToVec4);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function Math3DMat4() {
        this.addInput("T", "vec3");
        this.addInput("R", "vec3");
        this.addInput("S", "vec3");
        this.addOutput("mat4", "mat4");
        this.properties = {
          "T": [0, 0, 0],
          "R": [0, 0, 0],
          "S": [1, 1, 1],
          R_in_degrees: true
        };
        this._result = mat4.create();
        this._must_update = true;
      }
      Math3DMat4.title = "mat4";
      Math3DMat4.temp_quat = new Float32Array([0, 0, 0, 1]);
      Math3DMat4.temp_mat4 = new Float32Array(16);
      Math3DMat4.temp_vec3 = new Float32Array(3);
      Math3DMat4.prototype.onPropertyChanged = function(name, value) {
        this._must_update = true;
      };
      Math3DMat4.prototype.onExecute = function() {
        var M = this._result;
        var Q = Math3DMat4.temp_quat;
        var temp_mat4 = Math3DMat4.temp_mat4;
        var temp_vec3 = Math3DMat4.temp_vec3;
        var T = this.getInputData(0);
        var R = this.getInputData(1);
        var S = this.getInputData(2);
        if (this._must_update || T || R || S) {
          T = T || this.properties.T;
          R = R || this.properties.R;
          S = S || this.properties.S;
          mat4.identity(M);
          mat4.translate(M, M, T);
          if (this.properties.R_in_degrees) {
            temp_vec3.set(R);
            vec3.scale(temp_vec3, temp_vec3, DEG2RAD);
            quat.fromEuler(Q, temp_vec3);
          } else
            quat.fromEuler(Q, R);
          mat4.fromQuat(temp_mat4, Q);
          mat4.multiply(M, M, temp_mat4);
          mat4.scale(M, M, S);
        }
        this.setOutputData(0, M);
      };
      LiteGraph2.registerNodeType("math3d/mat4", Math3DMat4);
      function Math3DOperation() {
        this.addInput("A", "number,vec3");
        this.addInput("B", "number,vec3");
        this.addOutput("=", "number,vec3");
        this.addProperty("OP", "+", "enum", { values: Math3DOperation.values });
        this._result = vec3.create();
      }
      Math3DOperation.values = ["+", "-", "*", "/", "%", "^", "max", "min", "dot", "cross"];
      LiteGraph2.registerSearchboxExtra("math3d/operation", "CROSS()", {
        properties: { "OP": "cross" },
        title: "CROSS()"
      });
      LiteGraph2.registerSearchboxExtra("math3d/operation", "DOT()", {
        properties: { "OP": "dot" },
        title: "DOT()"
      });
      Math3DOperation.title = "Operation";
      Math3DOperation.desc = "Easy math 3D operators";
      Math3DOperation["@OP"] = {
        type: "enum",
        title: "operation",
        values: Math3DOperation.values
      };
      Math3DOperation.size = [100, 60];
      Math3DOperation.prototype.getTitle = function() {
        if (this.properties.OP == "max" || this.properties.OP == "min")
          return this.properties.OP + "(A,B)";
        return "A " + this.properties.OP + " B";
      };
      Math3DOperation.prototype.onExecute = function() {
        var A = this.getInputData(0);
        var B = this.getInputData(1);
        if (A == null || B == null)
          return;
        if (A.constructor === Number)
          A = [A, A, A];
        if (B.constructor === Number)
          B = [B, B, B];
        var result = this._result;
        switch (this.properties.OP) {
          case "+":
            result = vec3.add(result, A, B);
            break;
          case "-":
            result = vec3.sub(result, A, B);
            break;
          case "x":
          case "X":
          case "*":
            result = vec3.mul(result, A, B);
            break;
          case "/":
            result = vec3.div(result, A, B);
            break;
          case "%":
            result[0] = A[0] % B[0];
            result[1] = A[1] % B[1];
            result[2] = A[2] % B[2];
            break;
          case "^":
            result[0] = Math.pow(A[0], B[0]);
            result[1] = Math.pow(A[1], B[1]);
            result[2] = Math.pow(A[2], B[2]);
            break;
          case "max":
            result[0] = Math.max(A[0], B[0]);
            result[1] = Math.max(A[1], B[1]);
            result[2] = Math.max(A[2], B[2]);
            break;
          case "min":
            result[0] = Math.min(A[0], B[0]);
            result[1] = Math.min(A[1], B[1]);
            result[2] = Math.min(A[2], B[2]);
          case "dot":
            result = vec3.dot(A, B);
            break;
          case "cross":
            vec3.cross(result, A, B);
            break;
          default:
            console.warn("Unknown operation: " + this.properties.OP);
        }
        this.setOutputData(0, result);
      };
      Math3DOperation.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        ctx.font = "40px Arial";
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.fillText(
          this.properties.OP,
          this.size[0] * 0.5,
          (this.size[1] + LiteGraph2.NODE_TITLE_HEIGHT) * 0.5
        );
        ctx.textAlign = "left";
      };
      LiteGraph2.registerNodeType("math3d/operation", Math3DOperation);
      function Math3DVec3Scale() {
        this.addInput("in", "vec3");
        this.addInput("f", "number");
        this.addOutput("out", "vec3");
        this.properties = { f: 1 };
        this._data = new Float32Array(3);
      }
      Math3DVec3Scale.title = "vec3_scale";
      Math3DVec3Scale.desc = "scales the components of a vec3";
      Math3DVec3Scale.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        var f = this.getInputData(1);
        if (f == null) {
          f = this.properties.f;
        }
        var data = this._data;
        data[0] = v2[0] * f;
        data[1] = v2[1] * f;
        data[2] = v2[2] * f;
        this.setOutputData(0, data);
      };
      LiteGraph2.registerNodeType("math3d/vec3-scale", Math3DVec3Scale);
      function Math3DVec3Length() {
        this.addInput("in", "vec3");
        this.addOutput("out", "number");
      }
      Math3DVec3Length.title = "vec3_length";
      Math3DVec3Length.desc = "returns the module of a vector";
      Math3DVec3Length.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        var dist = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);
        this.setOutputData(0, dist);
      };
      LiteGraph2.registerNodeType("math3d/vec3-length", Math3DVec3Length);
      function Math3DVec3Normalize() {
        this.addInput("in", "vec3");
        this.addOutput("out", "vec3");
        this._data = new Float32Array(3);
      }
      Math3DVec3Normalize.title = "vec3_normalize";
      Math3DVec3Normalize.desc = "returns the vector normalized";
      Math3DVec3Normalize.prototype.onExecute = function() {
        var v2 = this.getInputData(0);
        if (v2 == null) {
          return;
        }
        var dist = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);
        var data = this._data;
        data[0] = v2[0] / dist;
        data[1] = v2[1] / dist;
        data[2] = v2[2] / dist;
        this.setOutputData(0, data);
      };
      LiteGraph2.registerNodeType("math3d/vec3-normalize", Math3DVec3Normalize);
      function Math3DVec3Lerp() {
        this.addInput("A", "vec3");
        this.addInput("B", "vec3");
        this.addInput("f", "vec3");
        this.addOutput("out", "vec3");
        this.properties = { f: 0.5 };
        this._data = new Float32Array(3);
      }
      Math3DVec3Lerp.title = "vec3_lerp";
      Math3DVec3Lerp.desc = "returns the interpolated vector";
      Math3DVec3Lerp.prototype.onExecute = function() {
        var A = this.getInputData(0);
        if (A == null) {
          return;
        }
        var B = this.getInputData(1);
        if (B == null) {
          return;
        }
        var f = this.getInputOrProperty("f");
        var data = this._data;
        data[0] = A[0] * (1 - f) + B[0] * f;
        data[1] = A[1] * (1 - f) + B[1] * f;
        data[2] = A[2] * (1 - f) + B[2] * f;
        this.setOutputData(0, data);
      };
      LiteGraph2.registerNodeType("math3d/vec3-lerp", Math3DVec3Lerp);
      function Math3DVec3Dot() {
        this.addInput("A", "vec3");
        this.addInput("B", "vec3");
        this.addOutput("out", "number");
      }
      Math3DVec3Dot.title = "vec3_dot";
      Math3DVec3Dot.desc = "returns the dot product";
      Math3DVec3Dot.prototype.onExecute = function() {
        var A = this.getInputData(0);
        if (A == null) {
          return;
        }
        var B = this.getInputData(1);
        if (B == null) {
          return;
        }
        var dot = A[0] * B[0] + A[1] * B[1] + A[2] * B[2];
        this.setOutputData(0, dot);
      };
      LiteGraph2.registerNodeType("math3d/vec3-dot", Math3DVec3Dot);
      if (global2.glMatrix) {
        let Math3DQuaternion = function() {
          this.addOutput("quat", "quat");
          this.properties = { x: 0, y: 0, z: 0, w: 1, normalize: false };
          this._value = quat.create();
        }, Math3DRotation = function() {
          this.addInputs([["degrees", "number"], ["axis", "vec3"]]);
          this.addOutput("quat", "quat");
          this.properties = { angle: 90, axis: vec3.fromValues(0, 1, 0) };
          this._value = quat.create();
        }, MathEulerToQuat = function() {
          this.addInput("euler", "vec3");
          this.addOutput("quat", "quat");
          this.properties = { euler: [0, 0, 0], use_yaw_pitch_roll: false };
          this._degs = vec3.create();
          this._value = quat.create();
        }, MathQuatToEuler = function() {
          this.addInput(["quat", "quat"]);
          this.addOutput("euler", "vec3");
          this._value = vec3.create();
        }, Math3DRotateVec3 = function() {
          this.addInputs([["vec3", "vec3"], ["quat", "quat"]]);
          this.addOutput("result", "vec3");
          this.properties = { vec: [0, 0, 1] };
        }, Math3DMultQuat = function() {
          this.addInputs([["A", "quat"], ["B", "quat"]]);
          this.addOutput("A*B", "quat");
          this._value = quat.create();
        }, Math3DQuatSlerp = function() {
          this.addInputs([
            ["A", "quat"],
            ["B", "quat"],
            ["factor", "number"]
          ]);
          this.addOutput("slerp", "quat");
          this.addProperty("factor", 0.5);
          this._value = quat.create();
        }, Math3DRemapRange = function() {
          this.addInput("vec3", "vec3");
          this.addOutput("remap", "vec3");
          this.addOutput("clamped", "vec3");
          this.properties = { clamp: true, range_min: [-1, -1, 0], range_max: [1, 1, 0], target_min: [-1, -1, 0], target_max: [1, 1, 0] };
          this._value = vec3.create();
          this._clamped = vec3.create();
        };
        Math3DQuaternion.title = "Quaternion";
        Math3DQuaternion.desc = "quaternion";
        Math3DQuaternion.prototype.onExecute = function() {
          this._value[0] = this.getInputOrProperty("x");
          this._value[1] = this.getInputOrProperty("y");
          this._value[2] = this.getInputOrProperty("z");
          this._value[3] = this.getInputOrProperty("w");
          if (this.properties.normalize) {
            quat.normalize(this._value, this._value);
          }
          this.setOutputData(0, this._value);
        };
        Math3DQuaternion.prototype.onGetInputs = function() {
          return [
            ["x", "number"],
            ["y", "number"],
            ["z", "number"],
            ["w", "number"]
          ];
        };
        LiteGraph2.registerNodeType("math3d/quaternion", Math3DQuaternion);
        Math3DRotation.title = "Rotation";
        Math3DRotation.desc = "quaternion rotation";
        Math3DRotation.prototype.onExecute = function() {
          var angle = this.getInputData(0);
          if (angle == null) {
            angle = this.properties.angle;
          }
          var axis = this.getInputData(1);
          if (axis == null) {
            axis = this.properties.axis;
          }
          var R = quat.setAxisAngle(this._value, axis, angle * 0.0174532925);
          this.setOutputData(0, R);
        };
        LiteGraph2.registerNodeType("math3d/rotation", Math3DRotation);
        MathEulerToQuat.title = "Euler->Quat";
        MathEulerToQuat.desc = "Converts euler angles (in degrees) to quaternion";
        MathEulerToQuat.prototype.onExecute = function() {
          var euler = this.getInputData(0);
          if (euler == null) {
            euler = this.properties.euler;
          }
          vec3.scale(this._degs, euler, DEG2RAD);
          if (this.properties.use_yaw_pitch_roll)
            this._degs = [this._degs[2], this._degs[0], this._degs[1]];
          var R = quat.fromEuler(this._value, this._degs);
          this.setOutputData(0, R);
        };
        LiteGraph2.registerNodeType("math3d/euler_to_quat", MathEulerToQuat);
        MathQuatToEuler.title = "Euler->Quat";
        MathQuatToEuler.desc = "Converts rotX,rotY,rotZ in degrees to quat";
        MathQuatToEuler.prototype.onExecute = function() {
          var q = this.getInputData(0);
          if (!q)
            return;
          quat.toEuler(this._value, q);
          vec3.scale(this._value, this._value, DEG2RAD);
          this.setOutputData(0, this._value);
        };
        LiteGraph2.registerNodeType("math3d/quat_to_euler", MathQuatToEuler);
        Math3DRotateVec3.title = "Rot. Vec3";
        Math3DRotateVec3.desc = "rotate a point";
        Math3DRotateVec3.prototype.onExecute = function() {
          var vec = this.getInputData(0);
          if (vec == null) {
            vec = this.properties.vec;
          }
          var quat2 = this.getInputData(1);
          if (quat2 == null) {
            this.setOutputData(vec);
          } else {
            this.setOutputData(
              0,
              vec3.transformQuat(vec3.create(), vec, quat2)
            );
          }
        };
        LiteGraph2.registerNodeType("math3d/rotate_vec3", Math3DRotateVec3);
        Math3DMultQuat.title = "Mult. Quat";
        Math3DMultQuat.desc = "rotate quaternion";
        Math3DMultQuat.prototype.onExecute = function() {
          var A = this.getInputData(0);
          if (A == null) {
            return;
          }
          var B = this.getInputData(1);
          if (B == null) {
            return;
          }
          var R = quat.multiply(this._value, A, B);
          this.setOutputData(0, R);
        };
        LiteGraph2.registerNodeType("math3d/mult-quat", Math3DMultQuat);
        Math3DQuatSlerp.title = "Quat Slerp";
        Math3DQuatSlerp.desc = "quaternion spherical interpolation";
        Math3DQuatSlerp.prototype.onExecute = function() {
          var A = this.getInputData(0);
          if (A == null) {
            return;
          }
          var B = this.getInputData(1);
          if (B == null) {
            return;
          }
          var factor = this.properties.factor;
          if (this.getInputData(2) != null) {
            factor = this.getInputData(2);
          }
          var R = quat.slerp(this._value, A, B, factor);
          this.setOutputData(0, R);
        };
        LiteGraph2.registerNodeType("math3d/quat-slerp", Math3DQuatSlerp);
        Math3DRemapRange.title = "Remap Range";
        Math3DRemapRange.desc = "remap a 3D range";
        Math3DRemapRange.prototype.onExecute = function() {
          var vec = this.getInputData(0);
          if (vec)
            this._value.set(vec);
          var range_min = this.properties.range_min;
          var range_max = this.properties.range_max;
          var target_min = this.properties.target_min;
          var target_max = this.properties.target_max;
          for (var i2 = 0; i2 < 3; ++i2) {
            var r = range_max[i2] - range_min[i2];
            this._clamped[i2] = clamp(this._value[i2], range_min[i2], range_max[i2]);
            if (r == 0) {
              this._value[i2] = (target_min[i2] + target_max[i2]) * 0.5;
              continue;
            }
            var n = (this._value[i2] - range_min[i2]) / r;
            if (this.properties.clamp)
              n = clamp(n, 0, 1);
            var t = target_max[i2] - target_min[i2];
            this._value[i2] = target_min[i2] + n * t;
          }
          this.setOutputData(0, this._value);
          this.setOutputData(1, this._clamped);
        };
        LiteGraph2.registerNodeType("math3d/remap_range", Math3DRemapRange);
      } else if (LiteGraph2.debug)
        console.warn("No glmatrix found, some Math3D nodes may not work");
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function toString(a) {
        if (a && a.constructor === Object) {
          try {
            return JSON.stringify(a);
          } catch (err) {
            return String(a);
          }
        }
        return String(a);
      }
      LiteGraph2.wrapFunctionAsNode("string/toString", toString, [""], "string");
      function compare(a, b) {
        return a == b;
      }
      LiteGraph2.wrapFunctionAsNode(
        "string/compare",
        compare,
        ["string", "string"],
        "boolean"
      );
      function concatenate(a, b) {
        if (a === void 0) {
          return b;
        }
        if (b === void 0) {
          return a;
        }
        return a + b;
      }
      LiteGraph2.wrapFunctionAsNode(
        "string/concatenate",
        concatenate,
        ["string", "string"],
        "string"
      );
      function contains(a, b) {
        if (a === void 0 || b === void 0) {
          return false;
        }
        return a.indexOf(b) != -1;
      }
      LiteGraph2.wrapFunctionAsNode(
        "string/contains",
        contains,
        ["string", "string"],
        "boolean"
      );
      function toUpperCase(a) {
        if (a != null && a.constructor === String) {
          return a.toUpperCase();
        }
        return a;
      }
      LiteGraph2.wrapFunctionAsNode(
        "string/toUpperCase",
        toUpperCase,
        ["string"],
        "string"
      );
      function split(str, separator) {
        if (separator == null)
          separator = this.properties.separator;
        if (str == null)
          return [];
        if (str.constructor === String)
          return str.split(separator || " ");
        else if (str.constructor === Array) {
          var r = [];
          for (var i2 = 0; i2 < str.length; ++i2) {
            if (typeof str[i2] == "string")
              r[i2] = str[i2].split(separator || " ");
          }
          return r;
        }
        return null;
      }
      LiteGraph2.wrapFunctionAsNode(
        "string/split",
        split,
        ["string,array", "string"],
        "array",
        { separator: "," }
      );
      function toFixed(a) {
        if (a != null && a.constructor === Number) {
          return a.toFixed(this.properties.precision);
        }
        return a;
      }
      LiteGraph2.wrapFunctionAsNode(
        "string/toFixed",
        toFixed,
        ["number"],
        "string",
        { precision: 0 }
      );
      function StringToTable() {
        this.addInput("", "string");
        this.addOutput("table", "table");
        this.addOutput("rows", "number");
        this.addProperty("value", "");
        this.addProperty("separator", ",");
        this._table = null;
      }
      StringToTable.title = "toTable";
      StringToTable.desc = "Splits a string to table";
      StringToTable.prototype.onExecute = function() {
        var input = this.getInputData(0);
        if (!input)
          return;
        var separator = this.properties.separator || ",";
        if (input != this._str || separator != this._last_separator) {
          this._last_separator = separator;
          this._str = input;
          this._table = input.split("\n").map(function(a) {
            return a.trim().split(separator);
          });
        }
        this.setOutputData(0, this._table);
        this.setOutputData(1, this._table ? this._table.length : 0);
      };
      LiteGraph2.registerNodeType("string/toTable", StringToTable);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function Selector() {
        this.addInput("sel", "number");
        this.addInput("A");
        this.addInput("B");
        this.addInput("C");
        this.addInput("D");
        this.addOutput("out");
        this.selected = 0;
      }
      Selector.title = "Selector";
      Selector.desc = "selects an output";
      Selector.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        ctx.fillStyle = "#AFB";
        var y2 = (this.selected + 1) * LiteGraph2.NODE_SLOT_HEIGHT + 6;
        ctx.beginPath();
        ctx.moveTo(50, y2);
        ctx.lineTo(50, y2 + LiteGraph2.NODE_SLOT_HEIGHT);
        ctx.lineTo(34, y2 + LiteGraph2.NODE_SLOT_HEIGHT * 0.5);
        ctx.fill();
      };
      Selector.prototype.onExecute = function() {
        var sel = this.getInputData(0);
        if (sel == null || sel.constructor !== Number)
          sel = 0;
        this.selected = sel = Math.round(sel) % (this.inputs.length - 1);
        var v2 = this.getInputData(sel + 1);
        if (v2 !== void 0) {
          this.setOutputData(0, v2);
        }
      };
      Selector.prototype.onGetInputs = function() {
        return [["E", 0], ["F", 0], ["G", 0], ["H", 0]];
      };
      LiteGraph2.registerNodeType("logic/selector", Selector);
      function Sequence() {
        this.properties = {
          sequence: "A,B,C"
        };
        this.addInput("index", "number");
        this.addInput("seq");
        this.addOutput("out");
        this.index = 0;
        this.values = this.properties.sequence.split(",");
      }
      Sequence.title = "Sequence";
      Sequence.desc = "select one element from a sequence from a string";
      Sequence.prototype.onPropertyChanged = function(name, value) {
        if (name == "sequence") {
          this.values = value.split(",");
        }
      };
      Sequence.prototype.onExecute = function() {
        var seq = this.getInputData(1);
        if (seq && seq != this.current_sequence) {
          this.values = seq.split(",");
          this.current_sequence = seq;
        }
        var index2 = this.getInputData(0);
        if (index2 == null) {
          index2 = 0;
        }
        this.index = index2 = Math.round(index2) % this.values.length;
        this.setOutputData(0, this.values[index2]);
      };
      LiteGraph2.registerNodeType("logic/sequence", Sequence);
      function logicAnd() {
        this.properties = {};
        this.addInput("a", "boolean");
        this.addInput("b", "boolean");
        this.addOutput("out", "boolean");
      }
      logicAnd.title = "AND";
      logicAnd.desc = "Return true if all inputs are true";
      logicAnd.prototype.onExecute = function() {
        var ret = true;
        for (var inX in this.inputs) {
          if (!this.getInputData(inX)) {
            var ret = false;
            break;
          }
        }
        this.setOutputData(0, ret);
      };
      logicAnd.prototype.onGetInputs = function() {
        return [
          ["and", "boolean"]
        ];
      };
      LiteGraph2.registerNodeType("logic/AND", logicAnd);
      function logicOr() {
        this.properties = {};
        this.addInput("a", "boolean");
        this.addInput("b", "boolean");
        this.addOutput("out", "boolean");
      }
      logicOr.title = "OR";
      logicOr.desc = "Return true if at least one input is true";
      logicOr.prototype.onExecute = function() {
        var ret = false;
        for (var inX in this.inputs) {
          if (this.getInputData(inX)) {
            ret = true;
            break;
          }
        }
        this.setOutputData(0, ret);
      };
      logicOr.prototype.onGetInputs = function() {
        return [
          ["or", "boolean"]
        ];
      };
      LiteGraph2.registerNodeType("logic/OR", logicOr);
      function logicNot() {
        this.properties = {};
        this.addInput("in", "boolean");
        this.addOutput("out", "boolean");
      }
      logicNot.title = "NOT";
      logicNot.desc = "Return the logical negation";
      logicNot.prototype.onExecute = function() {
        var ret = !this.getInputData(0);
        this.setOutputData(0, ret);
      };
      LiteGraph2.registerNodeType("logic/NOT", logicNot);
      function logicCompare() {
        this.properties = {};
        this.addInput("a", "boolean");
        this.addInput("b", "boolean");
        this.addOutput("out", "boolean");
      }
      logicCompare.title = "bool == bool";
      logicCompare.desc = "Compare for logical equality";
      logicCompare.prototype.onExecute = function() {
        var last = null;
        var ret = true;
        for (var inX in this.inputs) {
          if (last === null) last = this.getInputData(inX);
          else if (last != this.getInputData(inX)) {
            ret = false;
            break;
          }
        }
        this.setOutputData(0, ret);
      };
      logicCompare.prototype.onGetInputs = function() {
        return [
          ["bool", "boolean"]
        ];
      };
      LiteGraph2.registerNodeType("logic/CompareBool", logicCompare);
      function logicBranch() {
        this.properties = {};
        this.addInput("onTrigger", LiteGraph2.ACTION);
        this.addInput("condition", "boolean");
        this.addOutput("true", LiteGraph2.EVENT);
        this.addOutput("false", LiteGraph2.EVENT);
        this.mode = LiteGraph2.ON_TRIGGER;
      }
      logicBranch.title = "Branch";
      logicBranch.desc = "Branch execution on condition";
      logicBranch.prototype.onExecute = function(param, options) {
        var condtition = this.getInputData(1);
        if (condtition) {
          this.triggerSlot(0);
        } else {
          this.triggerSlot(1);
        }
      };
      LiteGraph2.registerNodeType("logic/IF", logicBranch);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function GraphicsPlot() {
        this.addInput("A", "Number");
        this.addInput("B", "Number");
        this.addInput("C", "Number");
        this.addInput("D", "Number");
        this.values = [[], [], [], []];
        this.properties = { scale: 2 };
      }
      GraphicsPlot.title = "Plot";
      GraphicsPlot.desc = "Plots data over time";
      GraphicsPlot.colors = ["#FFF", "#F99", "#9F9", "#99F"];
      GraphicsPlot.prototype.onExecute = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        var size = this.size;
        for (var i2 = 0; i2 < 4; ++i2) {
          var v2 = this.getInputData(i2);
          if (v2 == null) {
            continue;
          }
          var values2 = this.values[i2];
          values2.push(v2);
          if (values2.length > size[0]) {
            values2.shift();
          }
        }
      };
      GraphicsPlot.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        var size = this.size;
        var scale = 0.5 * size[1] / this.properties.scale;
        var colors = GraphicsPlot.colors;
        var offset = size[1] * 0.5;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, size[0], size[1]);
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(0, offset);
        ctx.lineTo(size[0], offset);
        ctx.stroke();
        if (this.inputs) {
          for (var i2 = 0; i2 < 4; ++i2) {
            var values2 = this.values[i2];
            if (!this.inputs[i2] || !this.inputs[i2].link) {
              continue;
            }
            ctx.strokeStyle = colors[i2];
            ctx.beginPath();
            var v2 = values2[0] * scale * -1 + offset;
            ctx.moveTo(0, clamp(v2, 0, size[1]));
            for (var j = 1; j < values2.length && j < size[0]; ++j) {
              var v2 = values2[j] * scale * -1 + offset;
              ctx.lineTo(j, clamp(v2, 0, size[1]));
            }
            ctx.stroke();
          }
        }
      };
      LiteGraph2.registerNodeType("graphics/plot", GraphicsPlot);
      function GraphicsImage() {
        this.addOutput("frame", "image");
        this.properties = { url: "" };
      }
      GraphicsImage.title = "Image";
      GraphicsImage.desc = "Image loader";
      GraphicsImage.widgets = [{ name: "load", text: "Load", type: "button" }];
      GraphicsImage.supported_extensions = ["jpg", "jpeg", "png", "gif"];
      GraphicsImage.prototype.onAdded = function() {
        if (this.properties["url"] != "" && this.img == null) {
          this.loadImage(this.properties["url"]);
        }
      };
      GraphicsImage.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        if (this.img && this.size[0] > 5 && this.size[1] > 5 && this.img.width) {
          ctx.drawImage(this.img, 0, 0, this.size[0], this.size[1]);
        }
      };
      GraphicsImage.prototype.onExecute = function() {
        if (!this.img) {
          this.boxcolor = "#000";
        }
        if (this.img && this.img.width) {
          this.setOutputData(0, this.img);
        } else {
          this.setOutputData(0, null);
        }
        if (this.img && this.img.dirty) {
          this.img.dirty = false;
        }
      };
      GraphicsImage.prototype.onPropertyChanged = function(name, value) {
        this.properties[name] = value;
        if (name == "url" && value != "") {
          this.loadImage(value);
        }
        return true;
      };
      GraphicsImage.prototype.loadImage = function(url, callback) {
        if (url == "") {
          this.img = null;
          return;
        }
        this.img = document.createElement("img");
        if (url.substr(0, 4) == "http" && LiteGraph2.proxy) {
          url = LiteGraph2.proxy + url.substr(url.indexOf(":") + 3);
        }
        this.img.src = url;
        this.boxcolor = "#F95";
        var that2 = this;
        this.img.onload = function() {
          if (callback) {
            callback(this);
          }
          console.log("Image loaded, size: " + that2.img.width + "x" + that2.img.height);
          this.dirty = true;
          that2.boxcolor = "#9F9";
          that2.setDirtyCanvas(true);
        };
        this.img.onerror = function() {
          console.log("error loading the image:" + url);
        };
      };
      GraphicsImage.prototype.onWidget = function(e, widget) {
        if (widget.name == "load") {
          this.loadImage(this.properties["url"]);
        }
      };
      GraphicsImage.prototype.onDropFile = function(file) {
        var that2 = this;
        if (this._url) {
          URL.revokeObjectURL(this._url);
        }
        this._url = URL.createObjectURL(file);
        this.properties.url = this._url;
        this.loadImage(this._url, function(img) {
          that2.size[1] = img.height / img.width * that2.size[0];
        });
      };
      LiteGraph2.registerNodeType("graphics/image", GraphicsImage);
      function ColorPalette() {
        this.addInput("f", "number");
        this.addOutput("Color", "color");
        this.properties = {
          colorA: "#444444",
          colorB: "#44AAFF",
          colorC: "#44FFAA",
          colorD: "#FFFFFF"
        };
      }
      ColorPalette.title = "Palette";
      ColorPalette.desc = "Generates a color";
      ColorPalette.prototype.onExecute = function() {
        var c = [];
        if (this.properties.colorA != null) {
          c.push(hex2num(this.properties.colorA));
        }
        if (this.properties.colorB != null) {
          c.push(hex2num(this.properties.colorB));
        }
        if (this.properties.colorC != null) {
          c.push(hex2num(this.properties.colorC));
        }
        if (this.properties.colorD != null) {
          c.push(hex2num(this.properties.colorD));
        }
        var f = this.getInputData(0);
        if (f == null) {
          f = 0.5;
        }
        if (f > 1) {
          f = 1;
        } else if (f < 0) {
          f = 0;
        }
        if (c.length == 0) {
          return;
        }
        var result = [0, 0, 0];
        if (f == 0) {
          result = c[0];
        } else if (f == 1) {
          result = c[c.length - 1];
        } else {
          var pos2 = (c.length - 1) * f;
          var c1 = c[Math.floor(pos2)];
          var c2 = c[Math.floor(pos2) + 1];
          var t = pos2 - Math.floor(pos2);
          result[0] = c1[0] * (1 - t) + c2[0] * t;
          result[1] = c1[1] * (1 - t) + c2[1] * t;
          result[2] = c1[2] * (1 - t) + c2[2] * t;
        }
        for (var i2 = 0; i2 < result.length; i2++) {
          result[i2] /= 255;
        }
        this.boxcolor = colorToString(result);
        this.setOutputData(0, result);
      };
      LiteGraph2.registerNodeType("color/palette", ColorPalette);
      function ImageFrame() {
        this.addInput("", "image,canvas");
        this.size = [200, 200];
      }
      ImageFrame.title = "Frame";
      ImageFrame.desc = "Frame viewerew";
      ImageFrame.widgets = [
        { name: "resize", text: "Resize box", type: "button" },
        { name: "view", text: "View Image", type: "button" }
      ];
      ImageFrame.prototype.onDrawBackground = function(ctx) {
        if (this.frame && !this.flags.collapsed) {
          ctx.drawImage(this.frame, 0, 0, this.size[0], this.size[1]);
        }
      };
      ImageFrame.prototype.onExecute = function() {
        this.frame = this.getInputData(0);
        this.setDirtyCanvas(true);
      };
      ImageFrame.prototype.onWidget = function(e, widget) {
        if (widget.name == "resize" && this.frame) {
          var width2 = this.frame.width;
          var height = this.frame.height;
          if (!width2 && this.frame.videoWidth != null) {
            width2 = this.frame.videoWidth;
            height = this.frame.videoHeight;
          }
          if (width2 && height) {
            this.size = [width2, height];
          }
          this.setDirtyCanvas(true, true);
        } else if (widget.name == "view") {
          this.show();
        }
      };
      ImageFrame.prototype.show = function() {
        if (showElement && this.frame) {
          showElement(this.frame);
        }
      };
      LiteGraph2.registerNodeType("graphics/frame", ImageFrame);
      function ImageFade() {
        this.addInputs([
          ["img1", "image"],
          ["img2", "image"],
          ["fade", "number"]
        ]);
        this.addOutput("", "image");
        this.properties = { fade: 0.5, width: 512, height: 512 };
      }
      ImageFade.title = "Image fade";
      ImageFade.desc = "Fades between images";
      ImageFade.widgets = [
        { name: "resizeA", text: "Resize to A", type: "button" },
        { name: "resizeB", text: "Resize to B", type: "button" }
      ];
      ImageFade.prototype.onAdded = function() {
        this.createCanvas();
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.properties["width"], this.properties["height"]);
      };
      ImageFade.prototype.createCanvas = function() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.properties["width"];
        this.canvas.height = this.properties["height"];
      };
      ImageFade.prototype.onExecute = function() {
        var ctx = this.canvas.getContext("2d");
        this.canvas.width = this.canvas.width;
        var A = this.getInputData(0);
        if (A != null) {
          ctx.drawImage(A, 0, 0, this.canvas.width, this.canvas.height);
        }
        var fade = this.getInputData(2);
        if (fade == null) {
          fade = this.properties["fade"];
        } else {
          this.properties["fade"] = fade;
        }
        ctx.globalAlpha = fade;
        var B = this.getInputData(1);
        if (B != null) {
          ctx.drawImage(B, 0, 0, this.canvas.width, this.canvas.height);
        }
        ctx.globalAlpha = 1;
        this.setOutputData(0, this.canvas);
        this.setDirtyCanvas(true);
      };
      LiteGraph2.registerNodeType("graphics/imagefade", ImageFade);
      function ImageCrop() {
        this.addInput("", "image");
        this.addOutput("", "image");
        this.properties = { width: 256, height: 256, x: 0, y: 0, scale: 1 };
        this.size = [50, 20];
      }
      ImageCrop.title = "Crop";
      ImageCrop.desc = "Crop Image";
      ImageCrop.prototype.onAdded = function() {
        this.createCanvas();
      };
      ImageCrop.prototype.createCanvas = function() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.properties["width"];
        this.canvas.height = this.properties["height"];
      };
      ImageCrop.prototype.onExecute = function() {
        var input = this.getInputData(0);
        if (!input) {
          return;
        }
        if (input.width) {
          var ctx = this.canvas.getContext("2d");
          ctx.drawImage(
            input,
            -this.properties["x"],
            -this.properties["y"],
            input.width * this.properties["scale"],
            input.height * this.properties["scale"]
          );
          this.setOutputData(0, this.canvas);
        } else {
          this.setOutputData(0, null);
        }
      };
      ImageCrop.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        if (this.canvas) {
          ctx.drawImage(
            this.canvas,
            0,
            0,
            this.canvas.width,
            this.canvas.height,
            0,
            0,
            this.size[0],
            this.size[1]
          );
        }
      };
      ImageCrop.prototype.onPropertyChanged = function(name, value) {
        this.properties[name] = value;
        if (name == "scale") {
          this.properties[name] = parseFloat(value);
          if (this.properties[name] == 0) {
            console.error("Error in scale");
            this.properties[name] = 1;
          }
        } else {
          this.properties[name] = parseInt(value);
        }
        this.createCanvas();
        return true;
      };
      LiteGraph2.registerNodeType("graphics/cropImage", ImageCrop);
      function CanvasNode() {
        this.addInput("clear", LiteGraph2.ACTION);
        this.addOutput("", "canvas");
        this.properties = { width: 512, height: 512, autoclear: true };
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
      }
      CanvasNode.title = "Canvas";
      CanvasNode.desc = "Canvas to render stuff";
      CanvasNode.prototype.onExecute = function() {
        var canvas = this.canvas;
        var w2 = this.properties.width | 0;
        var h = this.properties.height | 0;
        if (canvas.width != w2) {
          canvas.width = w2;
        }
        if (canvas.height != h) {
          canvas.height = h;
        }
        if (this.properties.autoclear) {
          this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        this.setOutputData(0, canvas);
      };
      CanvasNode.prototype.onAction = function(action, param) {
        if (action == "clear") {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
      };
      LiteGraph2.registerNodeType("graphics/canvas", CanvasNode);
      function DrawImageNode() {
        this.addInput("canvas", "canvas");
        this.addInput("img", "image,canvas");
        this.addInput("x", "number");
        this.addInput("y", "number");
        this.properties = { x: 0, y: 0, opacity: 1 };
      }
      DrawImageNode.title = "DrawImage";
      DrawImageNode.desc = "Draws image into a canvas";
      DrawImageNode.prototype.onExecute = function() {
        var canvas = this.getInputData(0);
        if (!canvas) {
          return;
        }
        var img = this.getInputOrProperty("img");
        if (!img) {
          return;
        }
        var x2 = this.getInputOrProperty("x");
        var y2 = this.getInputOrProperty("y");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, x2, y2);
      };
      LiteGraph2.registerNodeType("graphics/drawImage", DrawImageNode);
      function DrawRectangleNode() {
        this.addInput("canvas", "canvas");
        this.addInput("x", "number");
        this.addInput("y", "number");
        this.addInput("w", "number");
        this.addInput("h", "number");
        this.properties = {
          x: 0,
          y: 0,
          w: 10,
          h: 10,
          color: "white",
          opacity: 1
        };
      }
      DrawRectangleNode.title = "DrawRectangle";
      DrawRectangleNode.desc = "Draws rectangle in canvas";
      DrawRectangleNode.prototype.onExecute = function() {
        var canvas = this.getInputData(0);
        if (!canvas) {
          return;
        }
        var x2 = this.getInputOrProperty("x");
        var y2 = this.getInputOrProperty("y");
        var w2 = this.getInputOrProperty("w");
        var h = this.getInputOrProperty("h");
        var ctx = canvas.getContext("2d");
        ctx.fillRect(x2, y2, w2, h);
      };
      LiteGraph2.registerNodeType("graphics/drawRectangle", DrawRectangleNode);
      function ImageVideo() {
        this.addInput("t", "number");
        this.addOutputs([["frame", "image"], ["t", "number"], ["d", "number"]]);
        this.properties = { url: "", use_proxy: true };
      }
      ImageVideo.title = "Video";
      ImageVideo.desc = "Video playback";
      ImageVideo.widgets = [
        { name: "play", text: "PLAY", type: "minibutton" },
        { name: "stop", text: "STOP", type: "minibutton" },
        { name: "demo", text: "Demo video", type: "button" },
        { name: "mute", text: "Mute video", type: "button" }
      ];
      ImageVideo.prototype.onExecute = function() {
        if (!this.properties.url) {
          return;
        }
        if (this.properties.url != this._video_url) {
          this.loadVideo(this.properties.url);
        }
        if (!this._video || this._video.width == 0) {
          return;
        }
        var t = this.getInputData(0);
        if (t && t >= 0 && t <= 1) {
          this._video.currentTime = t * this._video.duration;
          this._video.pause();
        }
        this._video.dirty = true;
        this.setOutputData(0, this._video);
        this.setOutputData(1, this._video.currentTime);
        this.setOutputData(2, this._video.duration);
        this.setDirtyCanvas(true);
      };
      ImageVideo.prototype.onStart = function() {
        this.play();
      };
      ImageVideo.prototype.onStop = function() {
        this.stop();
      };
      ImageVideo.prototype.loadVideo = function(url) {
        this._video_url = url;
        var pos2 = url.substr(0, 10).indexOf(":");
        var protocol = "";
        if (pos2 != -1)
          protocol = url.substr(0, pos2);
        var host = "";
        if (protocol) {
          host = url.substr(0, url.indexOf("/", protocol.length + 3));
          host = host.substr(protocol.length + 3);
        }
        if (this.properties.use_proxy && protocol && LiteGraph2.proxy && host != location.host) {
          url = LiteGraph2.proxy + url.substr(url.indexOf(":") + 3);
        }
        this._video = document.createElement("video");
        this._video.src = url;
        this._video.type = "type=video/mp4";
        this._video.muted = true;
        this._video.autoplay = true;
        var that2 = this;
        this._video.addEventListener("loadedmetadata", function(e) {
          console.log("Duration: " + this.duration + " seconds");
          console.log("Size: " + this.videoWidth + "," + this.videoHeight);
          that2.setDirtyCanvas(true);
          this.width = this.videoWidth;
          this.height = this.videoHeight;
        });
        this._video.addEventListener("progress", function(e) {
          console.log("video loading...");
        });
        this._video.addEventListener("error", function(e) {
          console.error("Error loading video: " + this.src);
          if (this.error) {
            switch (this.error.code) {
              case this.error.MEDIA_ERR_ABORTED:
                console.error("You stopped the video.");
                break;
              case this.error.MEDIA_ERR_NETWORK:
                console.error("Network error - please try again later.");
                break;
              case this.error.MEDIA_ERR_DECODE:
                console.error("Video is broken..");
                break;
              case this.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                console.error("Sorry, your browser can't play this video.");
                break;
            }
          }
        });
        this._video.addEventListener("ended", function(e) {
          console.log("Video Ended.");
          this.play();
        });
      };
      ImageVideo.prototype.onPropertyChanged = function(name, value) {
        this.properties[name] = value;
        if (name == "url" && value != "") {
          this.loadVideo(value);
        }
        return true;
      };
      ImageVideo.prototype.play = function() {
        if (this._video && this._video.videoWidth) {
          this._video.play();
        }
      };
      ImageVideo.prototype.playPause = function() {
        if (!this._video) {
          return;
        }
        if (this._video.paused) {
          this.play();
        } else {
          this.pause();
        }
      };
      ImageVideo.prototype.stop = function() {
        if (!this._video) {
          return;
        }
        this._video.pause();
        this._video.currentTime = 0;
      };
      ImageVideo.prototype.pause = function() {
        if (!this._video) {
          return;
        }
        console.log("Video paused");
        this._video.pause();
      };
      ImageVideo.prototype.onWidget = function(e, widget) {
      };
      LiteGraph2.registerNodeType("graphics/video", ImageVideo);
      function ImageWebcam() {
        this.addOutput("Webcam", "image");
        this.properties = { filterFacingMode: false, facingMode: "user" };
        this.boxcolor = "black";
        this.frame = 0;
      }
      ImageWebcam.title = "Webcam";
      ImageWebcam.desc = "Webcam image";
      ImageWebcam.is_webcam_open = false;
      ImageWebcam.prototype.openStream = function() {
        if (!navigator.mediaDevices.getUserMedia) {
          console.log("getUserMedia() is not supported in your browser, use chrome and enable WebRTC from about://flags");
          return;
        }
        this._waiting_confirmation = true;
        var constraints = {
          audio: false,
          video: !this.properties.filterFacingMode ? true : { facingMode: this.properties.facingMode }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(this.streamReady.bind(this)).catch(onFailSoHard);
        var that2 = this;
        function onFailSoHard(e) {
          console.log("Webcam rejected", e);
          that2._webcam_stream = false;
          ImageWebcam.is_webcam_open = false;
          that2.boxcolor = "red";
          that2.trigger("stream_error");
        }
      };
      ImageWebcam.prototype.closeStream = function() {
        if (this._webcam_stream) {
          var tracks = this._webcam_stream.getTracks();
          if (tracks.length) {
            for (var i2 = 0; i2 < tracks.length; ++i2) {
              tracks[i2].stop();
            }
          }
          ImageWebcam.is_webcam_open = false;
          this._webcam_stream = null;
          this._video = null;
          this.boxcolor = "black";
          this.trigger("stream_closed");
        }
      };
      ImageWebcam.prototype.onPropertyChanged = function(name, value) {
        if (name == "facingMode") {
          this.properties.facingMode = value;
          this.closeStream();
          this.openStream();
        }
      };
      ImageWebcam.prototype.onRemoved = function() {
        this.closeStream();
      };
      ImageWebcam.prototype.streamReady = function(localMediaStream) {
        this._webcam_stream = localMediaStream;
        this.boxcolor = "green";
        var video = this._video;
        if (!video) {
          video = document.createElement("video");
          video.autoplay = true;
          video.srcObject = localMediaStream;
          this._video = video;
          video.onloadedmetadata = function(e) {
            console.log(e);
            ImageWebcam.is_webcam_open = true;
          };
        }
        this.trigger("stream_ready", video);
      };
      ImageWebcam.prototype.onExecute = function() {
        if (this._webcam_stream == null && !this._waiting_confirmation) {
          this.openStream();
        }
        if (!this._video || !this._video.videoWidth) {
          return;
        }
        this._video.frame = ++this.frame;
        this._video.width = this._video.videoWidth;
        this._video.height = this._video.videoHeight;
        this.setOutputData(0, this._video);
        for (var i2 = 1; i2 < this.outputs.length; ++i2) {
          if (!this.outputs[i2]) {
            continue;
          }
          switch (this.outputs[i2].name) {
            case "width":
              this.setOutputData(i2, this._video.videoWidth);
              break;
            case "height":
              this.setOutputData(i2, this._video.videoHeight);
              break;
          }
        }
      };
      ImageWebcam.prototype.getExtraMenuOptions = function(graphcanvas) {
        var that2 = this;
        var txt = !that2.properties.show ? "Show Frame" : "Hide Frame";
        return [
          {
            content: txt,
            callback: function() {
              that2.properties.show = !that2.properties.show;
            }
          }
        ];
      };
      ImageWebcam.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed || this.size[1] <= 20 || !this.properties.show) {
          return;
        }
        if (!this._video) {
          return;
        }
        ctx.save();
        ctx.drawImage(this._video, 0, 0, this.size[0], this.size[1]);
        ctx.restore();
      };
      ImageWebcam.prototype.onGetOutputs = function() {
        return [
          ["width", "number"],
          ["height", "number"],
          ["stream_ready", LiteGraph2.EVENT],
          ["stream_closed", LiteGraph2.EVENT],
          ["stream_error", LiteGraph2.EVENT]
        ];
      };
      LiteGraph2.registerNodeType("graphics/webcam", ImageWebcam);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      var LGraphCanvas2 = global2.LGraphCanvas;
      global2.LGraphTexture = null;
      if (typeof GL == "undefined")
        return;
      LGraphCanvas2.link_type_colors["Texture"] = "#987";
      function LGraphTexture2() {
        this.addOutput("tex", "Texture");
        this.addOutput("name", "string");
        this.properties = { name: "", filter: true };
        this.size = [
          LGraphTexture2.image_preview_size,
          LGraphTexture2.image_preview_size
        ];
      }
      global2.LGraphTexture = LGraphTexture2;
      LGraphTexture2.title = "Texture";
      LGraphTexture2.desc = "Texture";
      LGraphTexture2.widgets_info = {
        name: { widget: "texture" },
        filter: { widget: "checkbox" }
      };
      LGraphTexture2.loadTextureCallback = null;
      LGraphTexture2.image_preview_size = 256;
      LGraphTexture2.UNDEFINED = 0;
      LGraphTexture2.PASS_THROUGH = 1;
      LGraphTexture2.COPY = 2;
      LGraphTexture2.LOW = 3;
      LGraphTexture2.HIGH = 4;
      LGraphTexture2.REUSE = 5;
      LGraphTexture2.DEFAULT = 2;
      LGraphTexture2.MODE_VALUES = {
        "undefined": LGraphTexture2.UNDEFINED,
        "pass through": LGraphTexture2.PASS_THROUGH,
        copy: LGraphTexture2.COPY,
        low: LGraphTexture2.LOW,
        high: LGraphTexture2.HIGH,
        reuse: LGraphTexture2.REUSE,
        default: LGraphTexture2.DEFAULT
      };
      LGraphTexture2.getTexturesContainer = function() {
        return gl.textures;
      };
      LGraphTexture2.loadTexture = function(name, options) {
        options = options || {};
        var url = name;
        if (url.substr(0, 7) == "http://") {
          if (LiteGraph2.proxy) {
            url = LiteGraph2.proxy + url.substr(7);
          }
        }
        var container = LGraphTexture2.getTexturesContainer();
        var tex = container[name] = GL.Texture.fromURL(url, options);
        return tex;
      };
      LGraphTexture2.getTexture = function(name) {
        var container = this.getTexturesContainer();
        if (!container) {
          throw "Cannot load texture, container of textures not found";
        }
        var tex = container[name];
        if (!tex && name && name[0] != ":") {
          return this.loadTexture(name);
        }
        return tex;
      };
      LGraphTexture2.getTargetTexture = function(origin, target, mode) {
        if (!origin) {
          throw "LGraphTexture.getTargetTexture expects a reference texture";
        }
        var tex_type = null;
        switch (mode) {
          case LGraphTexture2.LOW:
            tex_type = gl.UNSIGNED_BYTE;
            break;
          case LGraphTexture2.HIGH:
            tex_type = gl.HIGH_PRECISION_FORMAT;
            break;
          case LGraphTexture2.REUSE:
            return origin;
          case LGraphTexture2.COPY:
          default:
            tex_type = origin ? origin.type : gl.UNSIGNED_BYTE;
            break;
        }
        if (!target || target.width != origin.width || target.height != origin.height || target.type != tex_type || target.format != origin.format) {
          target = new GL.Texture(origin.width, origin.height, {
            type: tex_type,
            format: origin.format,
            filter: gl.LINEAR
          });
        }
        return target;
      };
      LGraphTexture2.getTextureType = function(precision, ref_texture) {
        var type = ref_texture ? ref_texture.type : gl.UNSIGNED_BYTE;
        switch (precision) {
          case LGraphTexture2.HIGH:
            type = gl.HIGH_PRECISION_FORMAT;
            break;
          case LGraphTexture2.LOW:
            type = gl.UNSIGNED_BYTE;
            break;
        }
        return type;
      };
      LGraphTexture2.getWhiteTexture = function() {
        if (this._white_texture) {
          return this._white_texture;
        }
        var texture = this._white_texture = GL.Texture.fromMemory(
          1,
          1,
          [255, 255, 255, 255],
          { format: gl.RGBA, wrap: gl.REPEAT, filter: gl.NEAREST }
        );
        return texture;
      };
      LGraphTexture2.getNoiseTexture = function() {
        if (this._noise_texture) {
          return this._noise_texture;
        }
        var noise = new Uint8Array(512 * 512 * 4);
        for (var i2 = 0; i2 < 512 * 512 * 4; ++i2) {
          noise[i2] = Math.random() * 255;
        }
        var texture = GL.Texture.fromMemory(512, 512, noise, {
          format: gl.RGBA,
          wrap: gl.REPEAT,
          filter: gl.NEAREST
        });
        this._noise_texture = texture;
        return texture;
      };
      LGraphTexture2.prototype.onDropFile = function(data, filename, file) {
        if (!data) {
          this._drop_texture = null;
          this.properties.name = "";
        } else {
          var texture = null;
          if (typeof data == "string") {
            texture = GL.Texture.fromURL(data);
          } else if (filename.toLowerCase().indexOf(".dds") != -1) {
            texture = GL.Texture.fromDDSInMemory(data);
          } else {
            var blob = new Blob([file]);
            var url = URL.createObjectURL(blob);
            texture = GL.Texture.fromURL(url);
          }
          this._drop_texture = texture;
          this.properties.name = filename;
        }
      };
      LGraphTexture2.prototype.getExtraMenuOptions = function(graphcanvas) {
        var that2 = this;
        if (!this._drop_texture) {
          return;
        }
        return [
          {
            content: "Clear",
            callback: function() {
              that2._drop_texture = null;
              that2.properties.name = "";
            }
          }
        ];
      };
      LGraphTexture2.prototype.onExecute = function() {
        var tex = null;
        if (this.isOutputConnected(1)) {
          tex = this.getInputData(0);
        }
        if (!tex && this._drop_texture) {
          tex = this._drop_texture;
        }
        if (!tex && this.properties.name) {
          tex = LGraphTexture2.getTexture(this.properties.name);
        }
        if (!tex) {
          this.setOutputData(0, null);
          this.setOutputData(1, "");
          return;
        }
        this._last_tex = tex;
        if (this.properties.filter === false) {
          tex.setParameter(gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        } else {
          tex.setParameter(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
        this.setOutputData(0, tex);
        this.setOutputData(1, tex.fullpath || tex.filename);
        for (var i2 = 2; i2 < this.outputs.length; i2++) {
          var output = this.outputs[i2];
          if (!output) {
            continue;
          }
          var v2 = null;
          if (output.name == "width") {
            v2 = tex.width;
          } else if (output.name == "height") {
            v2 = tex.height;
          } else if (output.name == "aspect") {
            v2 = tex.width / tex.height;
          }
          this.setOutputData(i2, v2);
        }
      };
      LGraphTexture2.prototype.onResourceRenamed = function(old_name, new_name) {
        if (this.properties.name == old_name) {
          this.properties.name = new_name;
        }
      };
      LGraphTexture2.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed || this.size[1] <= 20) {
          return;
        }
        if (this._drop_texture && ctx.webgl) {
          ctx.drawImage(
            this._drop_texture,
            0,
            0,
            this.size[0],
            this.size[1]
          );
          return;
        }
        if (this._last_preview_tex != this._last_tex) {
          if (ctx.webgl) {
            this._canvas = this._last_tex;
          } else {
            var tex_canvas = LGraphTexture2.generateLowResTexturePreview(
              this._last_tex
            );
            if (!tex_canvas) {
              return;
            }
            this._last_preview_tex = this._last_tex;
            this._canvas = cloneCanvas(tex_canvas);
          }
        }
        if (!this._canvas) {
          return;
        }
        ctx.save();
        if (!ctx.webgl) {
          ctx.translate(0, this.size[1]);
          ctx.scale(1, -1);
        }
        ctx.drawImage(this._canvas, 0, 0, this.size[0], this.size[1]);
        ctx.restore();
      };
      LGraphTexture2.generateLowResTexturePreview = function(tex) {
        if (!tex) {
          return null;
        }
        var size = LGraphTexture2.image_preview_size;
        var temp_tex = tex;
        if (tex.format == gl.DEPTH_COMPONENT) {
          return null;
        }
        if (tex.width > size || tex.height > size) {
          temp_tex = this._preview_temp_tex;
          if (!this._preview_temp_tex) {
            temp_tex = new GL.Texture(size, size, {
              minFilter: gl.NEAREST
            });
            this._preview_temp_tex = temp_tex;
          }
          tex.copyTo(temp_tex);
          tex = temp_tex;
        }
        var tex_canvas = this._preview_canvas;
        if (!tex_canvas) {
          tex_canvas = createCanvas(size, size);
          this._preview_canvas = tex_canvas;
        }
        if (temp_tex) {
          temp_tex.toCanvas(tex_canvas);
        }
        return tex_canvas;
      };
      LGraphTexture2.prototype.getResources = function(res) {
        if (this.properties.name)
          res[this.properties.name] = GL.Texture;
        return res;
      };
      LGraphTexture2.prototype.onGetInputs = function() {
        return [["in", "Texture"]];
      };
      LGraphTexture2.prototype.onGetOutputs = function() {
        return [
          ["width", "number"],
          ["height", "number"],
          ["aspect", "number"]
        ];
      };
      LGraphTexture2.replaceCode = function(code, context) {
        return code.replace(/\{\{[a-zA-Z0-9_]*\}\}/g, function(v2) {
          v2 = v2.replace(/[\{\}]/g, "");
          return context[v2] || "";
        });
      };
      LiteGraph2.registerNodeType("texture/texture", LGraphTexture2);
      function LGraphTexturePreview() {
        this.addInput("Texture", "Texture");
        this.properties = { flipY: false };
        this.size = [
          LGraphTexture2.image_preview_size,
          LGraphTexture2.image_preview_size
        ];
      }
      LGraphTexturePreview.title = "Preview";
      LGraphTexturePreview.desc = "Show a texture in the graph canvas";
      LGraphTexturePreview.allow_preview = false;
      LGraphTexturePreview.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        if (!ctx.webgl && !LGraphTexturePreview.allow_preview) {
          return;
        }
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        var tex_canvas = null;
        if (!tex.handle && ctx.webgl) {
          tex_canvas = tex;
        } else {
          tex_canvas = LGraphTexture2.generateLowResTexturePreview(tex);
        }
        ctx.save();
        if (this.properties.flipY) {
          ctx.translate(0, this.size[1]);
          ctx.scale(1, -1);
        }
        ctx.drawImage(tex_canvas, 0, 0, this.size[0], this.size[1]);
        ctx.restore();
      };
      LiteGraph2.registerNodeType("texture/preview", LGraphTexturePreview);
      function LGraphTextureSave() {
        this.addInput("Texture", "Texture");
        this.addOutput("tex", "Texture");
        this.addOutput("name", "string");
        this.properties = { name: "", generate_mipmaps: false };
      }
      LGraphTextureSave.title = "Save";
      LGraphTextureSave.desc = "Save a texture in the repository";
      LGraphTextureSave.prototype.getPreviewTexture = function() {
        return this._texture;
      };
      LGraphTextureSave.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (this.properties.generate_mipmaps) {
          tex.bind(0);
          tex.setParameter(gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.generateMipmap(tex.texture_type);
          tex.unbind(0);
        }
        if (this.properties.name) {
          if (LGraphTexture2.storeTexture) {
            LGraphTexture2.storeTexture(this.properties.name, tex);
          } else {
            var container = LGraphTexture2.getTexturesContainer();
            container[this.properties.name] = tex;
          }
        }
        this._texture = tex;
        this.setOutputData(0, tex);
        this.setOutputData(1, this.properties.name);
      };
      LiteGraph2.registerNodeType("texture/save", LGraphTextureSave);
      function LGraphTextureOperation() {
        this.addInput("Texture", "Texture");
        this.addInput("TextureB", "Texture");
        this.addInput("value", "number");
        this.addOutput("Texture", "Texture");
        this.help = "<p>pixelcode must be vec3, uvcode must be vec2, is optional</p>				<p><strong>uv:</strong> tex. coords</p><p><strong>color:</strong> texture <strong>colorB:</strong> textureB</p><p><strong>time:</strong> scene time <strong>value:</strong> input value</p><p>For multiline you must type: result = ...</p>";
        this.properties = {
          value: 1,
          pixelcode: "color + colorB * value",
          uvcode: "",
          precision: LGraphTexture2.DEFAULT
        };
        this.has_error = false;
      }
      LGraphTextureOperation.widgets_info = {
        uvcode: { widget: "code" },
        pixelcode: { widget: "code" },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureOperation.title = "Operation";
      LGraphTextureOperation.desc = "Texture shader operation";
      LGraphTextureOperation.presets = {};
      LGraphTextureOperation.prototype.getExtraMenuOptions = function(graphcanvas) {
        var that2 = this;
        var txt = !that2.properties.show ? "Show Texture" : "Hide Texture";
        return [
          {
            content: txt,
            callback: function() {
              that2.properties.show = !that2.properties.show;
            }
          }
        ];
      };
      LGraphTextureOperation.prototype.onPropertyChanged = function() {
        this.has_error = false;
      };
      LGraphTextureOperation.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed || this.size[1] <= 20 || !this.properties.show) {
          return;
        }
        if (!this._tex) {
          return;
        }
        if (this._tex.gl != ctx) {
          return;
        }
        ctx.save();
        ctx.drawImage(this._tex, 0, 0, this.size[0], this.size[1]);
        ctx.restore();
      };
      LGraphTextureOperation.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
          this.setOutputData(0, tex);
          return;
        }
        var texB = this.getInputData(1);
        if (!this.properties.uvcode && !this.properties.pixelcode) {
          return;
        }
        var width2 = 512;
        var height = 512;
        if (tex) {
          width2 = tex.width;
          height = tex.height;
        } else if (texB) {
          width2 = texB.width;
          height = texB.height;
        }
        if (!texB)
          texB = GL.Texture.getWhiteTexture();
        var type = LGraphTexture2.getTextureType(this.properties.precision, tex);
        if (!tex && !this._tex) {
          this._tex = new GL.Texture(width2, height, { type, format: gl.RGBA, filter: gl.LINEAR });
        } else {
          this._tex = LGraphTexture2.getTargetTexture(tex || this._tex, this._tex, this.properties.precision);
        }
        var uvcode = "";
        if (this.properties.uvcode) {
          uvcode = "uv = " + this.properties.uvcode;
          if (this.properties.uvcode.indexOf(";") != -1) {
            uvcode = this.properties.uvcode;
          }
        }
        var pixelcode = "";
        if (this.properties.pixelcode) {
          pixelcode = "result = " + this.properties.pixelcode;
          if (this.properties.pixelcode.indexOf(";") != -1) {
            pixelcode = this.properties.pixelcode;
          }
        }
        var shader = this._shader;
        if (!this.has_error && (!shader || this._shader_code != uvcode + "|" + pixelcode)) {
          var final_pixel_code = LGraphTexture2.replaceCode(LGraphTextureOperation.pixel_shader, { UV_CODE: uvcode, PIXEL_CODE: pixelcode });
          try {
            shader = new GL.Shader(Shader.SCREEN_VERTEX_SHADER, final_pixel_code);
            this.boxcolor = "#00FF00";
          } catch (err) {
            GL.Shader.dumpErrorToConsole(err, Shader.SCREEN_VERTEX_SHADER, final_pixel_code);
            this.boxcolor = "#FF0000";
            this.has_error = true;
            return;
          }
          this._shader = shader;
          this._shader_code = uvcode + "|" + pixelcode;
        }
        if (!this._shader)
          return;
        var value = this.getInputData(2);
        if (value != null) {
          this.properties.value = value;
        } else {
          value = parseFloat(this.properties.value);
        }
        var time = this.graph.getTime();
        this._tex.drawTo(function() {
          gl.disable(gl.DEPTH_TEST);
          gl.disable(gl.CULL_FACE);
          gl.disable(gl.BLEND);
          if (tex) {
            tex.bind(0);
          }
          if (texB) {
            texB.bind(1);
          }
          var mesh = Mesh.getScreenQuad();
          shader.uniforms({
            u_texture: 0,
            u_textureB: 1,
            value,
            texSize: [width2, height, 1 / width2, 1 / height],
            time
          }).draw(mesh);
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureOperation.pixel_shader = "precision highp float;\n				\n				uniform sampler2D u_texture;\n				uniform sampler2D u_textureB;\n				varying vec2 v_coord;\n				uniform vec4 texSize;\n				uniform float time;\n				uniform float value;\n				\n				void main() {\n					vec2 uv = v_coord;\n					{{UV_CODE}};\n					vec4 color4 = texture2D(u_texture, uv);\n					vec3 color = color4.rgb;\n					vec4 color4B = texture2D(u_textureB, uv);\n					vec3 colorB = color4B.rgb;\n					vec3 result = color;\n					float alpha = 1.0;\n					{{PIXEL_CODE}};\n					gl_FragColor = vec4(result, alpha);\n				}\n				";
      LGraphTextureOperation.registerPreset = function(name, code) {
        LGraphTextureOperation.presets[name] = code;
      };
      LGraphTextureOperation.registerPreset("", "");
      LGraphTextureOperation.registerPreset("bypass", "color");
      LGraphTextureOperation.registerPreset("add", "color + colorB * value");
      LGraphTextureOperation.registerPreset("substract", "(color - colorB) * value");
      LGraphTextureOperation.registerPreset("mate", "mix( color, colorB, color4B.a * value)");
      LGraphTextureOperation.registerPreset("invert", "vec3(1.0) - color");
      LGraphTextureOperation.registerPreset("multiply", "color * colorB * value");
      LGraphTextureOperation.registerPreset("divide", "(color / colorB) / value");
      LGraphTextureOperation.registerPreset("difference", "abs(color - colorB) * value");
      LGraphTextureOperation.registerPreset("max", "max(color, colorB) * value");
      LGraphTextureOperation.registerPreset("min", "min(color, colorB) * value");
      LGraphTextureOperation.registerPreset("displace", "texture2D(u_texture, uv + (colorB.xy - vec2(0.5)) * value).xyz");
      LGraphTextureOperation.registerPreset("grayscale", "vec3(color.x + color.y + color.z) * value / 3.0");
      LGraphTextureOperation.registerPreset("saturation", "mix( vec3(color.x + color.y + color.z) / 3.0, color, value )");
      LGraphTextureOperation.registerPreset("normalmap", "\n				float z0 = texture2D(u_texture, uv + vec2(-texSize.z, -texSize.w) ).x;\n				float z1 = texture2D(u_texture, uv + vec2(0.0, -texSize.w) ).x;\n				float z2 = texture2D(u_texture, uv + vec2(texSize.z, -texSize.w) ).x;\n				float z3 = texture2D(u_texture, uv + vec2(-texSize.z, 0.0) ).x;\n				float z4 = color.x;\n				float z5 = texture2D(u_texture, uv + vec2(texSize.z, 0.0) ).x;\n				float z6 = texture2D(u_texture, uv + vec2(-texSize.z, texSize.w) ).x;\n				float z7 = texture2D(u_texture, uv + vec2(0.0, texSize.w) ).x;\n				float z8 = texture2D(u_texture, uv + vec2(texSize.z, texSize.w) ).x;\n				vec3 normal = vec3( z2 + 2.0*z4 + z7 - z0 - 2.0*z3 - z5, z5 + 2.0*z6 + z7 -z0 - 2.0*z1 - z2, 1.0 );\n				normal.xy *= value;\n				result.xyz = normalize(normal) * 0.5 + vec3(0.5);\n			");
      LGraphTextureOperation.registerPreset("threshold", "vec3(color.x > colorB.x * value ? 1.0 : 0.0,color.y > colorB.y * value ? 1.0 : 0.0,color.z > colorB.z * value ? 1.0 : 0.0)");
      LGraphTextureOperation.prototype.onInspect = function(widgets) {
        var that2 = this;
        widgets.addCombo("Presets", "", { values: Object.keys(LGraphTextureOperation.presets), callback: function(v2) {
          var code = LGraphTextureOperation.presets[v2];
          if (!code)
            return;
          that2.setProperty("pixelcode", code);
          that2.title = v2;
          widgets.refresh();
        } });
      };
      LiteGraph2.registerNodeType("texture/operation", LGraphTextureOperation);
      function LGraphTextureShader() {
        this.addOutput("out", "Texture");
        this.properties = {
          code: "",
          u_value: 1,
          u_color: [1, 1, 1, 1],
          width: 512,
          height: 512,
          precision: LGraphTexture2.DEFAULT
        };
        this.properties.code = LGraphTextureShader.pixel_shader;
        this._uniforms = { u_value: 1, u_color: vec4.create(), in_texture: 0, texSize: vec4.create(), time: 0 };
      }
      LGraphTextureShader.title = "Shader";
      LGraphTextureShader.desc = "Texture shader";
      LGraphTextureShader.widgets_info = {
        code: { type: "code", lang: "glsl" },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureShader.prototype.onPropertyChanged = function(name, value) {
        if (name != "code") {
          return;
        }
        var shader = this.getShader();
        if (!shader) {
          return;
        }
        var uniforms = shader.uniformInfo;
        if (this.inputs) {
          var already = {};
          for (var i2 = 0; i2 < this.inputs.length; ++i2) {
            var info = this.getInputInfo(i2);
            if (!info) {
              continue;
            }
            if (uniforms[info.name] && !already[info.name]) {
              already[info.name] = true;
              continue;
            }
            this.removeInput(i2);
            i2--;
          }
        }
        for (var i2 in uniforms) {
          var info = shader.uniformInfo[i2];
          if (info.loc === null) {
            continue;
          }
          if (i2 == "time") {
            continue;
          }
          var type = "number";
          if (this._shader.samplers[i2]) {
            type = "texture";
          } else {
            switch (info.size) {
              case 1:
                type = "number";
                break;
              case 2:
                type = "vec2";
                break;
              case 3:
                type = "vec3";
                break;
              case 4:
                type = "vec4";
                break;
              case 9:
                type = "mat3";
                break;
              case 16:
                type = "mat4";
                break;
              default:
                continue;
            }
          }
          var slot = this.findInputSlot(i2);
          if (slot == -1) {
            this.addInput(i2, type);
            continue;
          }
          var input_info = this.getInputInfo(slot);
          if (!input_info) {
            this.addInput(i2, type);
          } else {
            if (input_info.type == type) {
              continue;
            }
            this.removeInput(slot, type);
            this.addInput(i2, type);
          }
        }
      };
      LGraphTextureShader.prototype.getShader = function() {
        if (this._shader && this._shader_code == this.properties.code) {
          return this._shader;
        }
        this._shader_code = this.properties.code;
        this._shader = new GL.Shader(Shader.SCREEN_VERTEX_SHADER, this.properties.code);
        if (!this._shader) {
          this.boxcolor = "red";
          return null;
        } else {
          this.boxcolor = "green";
        }
        return this._shader;
      };
      LGraphTextureShader.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var shader = this.getShader();
        if (!shader) {
          return;
        }
        var tex_slot = 0;
        var in_tex = null;
        if (this.inputs)
          for (var i2 = 0; i2 < this.inputs.length; ++i2) {
            var info = this.getInputInfo(i2);
            var data = this.getInputData(i2);
            if (data == null) {
              continue;
            }
            if (data.constructor === GL.Texture) {
              data.bind(tex_slot);
              if (!in_tex) {
                in_tex = data;
              }
              data = tex_slot;
              tex_slot++;
            }
            shader.setUniform(info.name, data);
          }
        var uniforms = this._uniforms;
        var type = LGraphTexture2.getTextureType(this.properties.precision, in_tex);
        var w2 = this.properties.width | 0;
        var h = this.properties.height | 0;
        if (w2 == 0) {
          w2 = in_tex ? in_tex.width : gl.canvas.width;
        }
        if (h == 0) {
          h = in_tex ? in_tex.height : gl.canvas.height;
        }
        uniforms.texSize[0] = w2;
        uniforms.texSize[1] = h;
        uniforms.texSize[2] = 1 / w2;
        uniforms.texSize[3] = 1 / h;
        uniforms.time = this.graph.getTime();
        uniforms.u_value = this.properties.u_value;
        uniforms.u_color.set(this.properties.u_color);
        if (!this._tex || this._tex.type != type || this._tex.width != w2 || this._tex.height != h) {
          this._tex = new GL.Texture(w2, h, { type, format: gl.RGBA, filter: gl.LINEAR });
        }
        var tex = this._tex;
        tex.drawTo(function() {
          shader.uniforms(uniforms).draw(GL.Mesh.getScreenQuad());
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureShader.pixel_shader = "precision highp float;\n		\n		varying vec2 v_coord;\n		uniform float time; //time in seconds\n		uniform vec4 texSize; //tex resolution\n		uniform float u_value;\n		uniform vec4 u_color;\n\n		void main() {\n			vec2 uv = v_coord;\n			vec3 color = vec3(0.0);\n			//your code here\n			color.xy=uv;\n\n			gl_FragColor = vec4(color, 1.0);\n		}\n		";
      LiteGraph2.registerNodeType("texture/shader", LGraphTextureShader);
      function LGraphTextureScaleOffset() {
        this.addInput("in", "Texture");
        this.addInput("scale", "vec2");
        this.addInput("offset", "vec2");
        this.addOutput("out", "Texture");
        this.properties = {
          offset: vec2.fromValues(0, 0),
          scale: vec2.fromValues(1, 1),
          precision: LGraphTexture2.DEFAULT
        };
      }
      LGraphTextureScaleOffset.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureScaleOffset.title = "Scale/Offset";
      LGraphTextureScaleOffset.desc = "Applies an scaling and offseting";
      LGraphTextureScaleOffset.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!this.isOutputConnected(0) || !tex) {
          return;
        }
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
          this.setOutputData(0, tex);
          return;
        }
        var width2 = tex.width;
        var height = tex.height;
        var type = this.precision === LGraphTexture2.LOW ? gl.UNSIGNED_BYTE : gl.HIGH_PRECISION_FORMAT;
        if (this.precision === LGraphTexture2.DEFAULT) {
          type = tex.type;
        }
        if (!this._tex || this._tex.width != width2 || this._tex.height != height || this._tex.type != type) {
          this._tex = new GL.Texture(width2, height, {
            type,
            format: gl.RGBA,
            filter: gl.LINEAR
          });
        }
        var shader = this._shader;
        if (!shader) {
          shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureScaleOffset.pixel_shader
          );
        }
        var scale = this.getInputData(1);
        if (scale) {
          this.properties.scale[0] = scale[0];
          this.properties.scale[1] = scale[1];
        } else {
          scale = this.properties.scale;
        }
        var offset = this.getInputData(2);
        if (offset) {
          this.properties.offset[0] = offset[0];
          this.properties.offset[1] = offset[1];
        } else {
          offset = this.properties.offset;
        }
        this._tex.drawTo(function() {
          gl.disable(gl.DEPTH_TEST);
          gl.disable(gl.CULL_FACE);
          gl.disable(gl.BLEND);
          tex.bind(0);
          var mesh = Mesh.getScreenQuad();
          shader.uniforms({
            u_texture: 0,
            u_scale: scale,
            u_offset: offset
          }).draw(mesh);
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureScaleOffset.pixel_shader = "precision highp float;\n				\n				uniform sampler2D u_texture;\n				uniform sampler2D u_textureB;\n				varying vec2 v_coord;\n				uniform vec2 u_scale;\n				uniform vec2 u_offset;\n				\n				void main() {\n					vec2 uv = v_coord;\n					uv = uv / u_scale - u_offset;\n					gl_FragColor = texture2D(u_texture, uv);\n				}\n				";
      LiteGraph2.registerNodeType(
        "texture/scaleOffset",
        LGraphTextureScaleOffset
      );
      function LGraphTextureWarp() {
        this.addInput("in", "Texture");
        this.addInput("warp", "Texture");
        this.addInput("factor", "number");
        this.addOutput("out", "Texture");
        this.properties = {
          factor: 0.01,
          scale: [1, 1],
          offset: [0, 0],
          precision: LGraphTexture2.DEFAULT
        };
        this._uniforms = {
          u_texture: 0,
          u_textureB: 1,
          u_factor: 1,
          u_scale: vec2.create(),
          u_offset: vec2.create()
        };
      }
      LGraphTextureWarp.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureWarp.title = "Warp";
      LGraphTextureWarp.desc = "Texture warp operation";
      LGraphTextureWarp.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
          this.setOutputData(0, tex);
          return;
        }
        var texB = this.getInputData(1);
        var width2 = 512;
        var height = 512;
        gl.UNSIGNED_BYTE;
        if (tex) {
          width2 = tex.width;
          height = tex.height;
          tex.type;
        } else if (texB) {
          width2 = texB.width;
          height = texB.height;
          texB.type;
        }
        if (!tex && !this._tex) {
          this._tex = new GL.Texture(width2, height, {
            type: this.precision === LGraphTexture2.LOW ? gl.UNSIGNED_BYTE : gl.HIGH_PRECISION_FORMAT,
            format: gl.RGBA,
            filter: gl.LINEAR
          });
        } else {
          this._tex = LGraphTexture2.getTargetTexture(
            tex || this._tex,
            this._tex,
            this.properties.precision
          );
        }
        var shader = this._shader;
        if (!shader) {
          shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureWarp.pixel_shader
          );
        }
        var factor = this.getInputData(2);
        if (factor != null) {
          this.properties.factor = factor;
        } else {
          factor = parseFloat(this.properties.factor);
        }
        var uniforms = this._uniforms;
        uniforms.u_factor = factor;
        uniforms.u_scale.set(this.properties.scale);
        uniforms.u_offset.set(this.properties.offset);
        this._tex.drawTo(function() {
          gl.disable(gl.DEPTH_TEST);
          gl.disable(gl.CULL_FACE);
          gl.disable(gl.BLEND);
          if (tex) {
            tex.bind(0);
          }
          if (texB) {
            texB.bind(1);
          }
          var mesh = Mesh.getScreenQuad();
          shader.uniforms(uniforms).draw(mesh);
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureWarp.pixel_shader = "precision highp float;\n				\n				uniform sampler2D u_texture;\n				uniform sampler2D u_textureB;\n				varying vec2 v_coord;\n				uniform float u_factor;\n				uniform vec2 u_scale;\n				uniform vec2 u_offset;\n				\n				void main() {\n					vec2 uv = v_coord;\n					uv += ( texture2D(u_textureB, uv).rg - vec2(0.5)) * u_factor * u_scale + u_offset;\n					gl_FragColor = texture2D(u_texture, uv);\n				}\n				";
      LiteGraph2.registerNodeType("texture/warp", LGraphTextureWarp);
      function LGraphTextureToViewport() {
        this.addInput("Texture", "Texture");
        this.properties = {
          additive: false,
          antialiasing: false,
          filter: true,
          disable_alpha: false,
          gamma: 1,
          viewport: [0, 0, 1, 1]
        };
        this.size[0] = 130;
      }
      LGraphTextureToViewport.title = "to Viewport";
      LGraphTextureToViewport.desc = "Texture to viewport";
      LGraphTextureToViewport._prev_viewport = new Float32Array(4);
      LGraphTextureToViewport.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed || this.size[1] <= 40)
          return;
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        ctx.drawImage(ctx == gl ? tex : gl.canvas, 10, 30, this.size[0] - 20, this.size[1] - 40);
      };
      LGraphTextureToViewport.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (this.properties.disable_alpha) {
          gl.disable(gl.BLEND);
        } else {
          gl.enable(gl.BLEND);
          if (this.properties.additive) {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
          } else {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          }
        }
        gl.disable(gl.DEPTH_TEST);
        var gamma = this.properties.gamma || 1;
        if (this.isInputConnected(1)) {
          gamma = this.getInputData(1);
        }
        tex.setParameter(
          gl.TEXTURE_MAG_FILTER,
          this.properties.filter ? gl.LINEAR : gl.NEAREST
        );
        var old_viewport = LGraphTextureToViewport._prev_viewport;
        old_viewport.set(gl.viewport_data);
        var new_view = this.properties.viewport;
        gl.viewport(old_viewport[0] + old_viewport[2] * new_view[0], old_viewport[1] + old_viewport[3] * new_view[1], old_viewport[2] * new_view[2], old_viewport[3] * new_view[3]);
        gl.getViewport();
        if (this.properties.antialiasing) {
          if (!LGraphTextureToViewport._shader) {
            LGraphTextureToViewport._shader = new GL.Shader(
              GL.Shader.SCREEN_VERTEX_SHADER,
              LGraphTextureToViewport.aa_pixel_shader
            );
          }
          var mesh = Mesh.getScreenQuad();
          tex.bind(0);
          LGraphTextureToViewport._shader.uniforms({
            u_texture: 0,
            uViewportSize: [tex.width, tex.height],
            u_igamma: 1 / gamma,
            inverseVP: [1 / tex.width, 1 / tex.height]
          }).draw(mesh);
        } else {
          if (gamma != 1) {
            if (!LGraphTextureToViewport._gamma_shader) {
              LGraphTextureToViewport._gamma_shader = new GL.Shader(
                Shader.SCREEN_VERTEX_SHADER,
                LGraphTextureToViewport.gamma_pixel_shader
              );
            }
            tex.toViewport(LGraphTextureToViewport._gamma_shader, {
              u_texture: 0,
              u_igamma: 1 / gamma
            });
          } else {
            tex.toViewport();
          }
        }
        gl.viewport(old_viewport[0], old_viewport[1], old_viewport[2], old_viewport[3]);
      };
      LGraphTextureToViewport.prototype.onGetInputs = function() {
        return [["gamma", "number"]];
      };
      LGraphTextureToViewport.aa_pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform vec2 uViewportSize;\n				uniform vec2 inverseVP;\n				uniform float u_igamma;\n				#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n				#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n				#define FXAA_SPAN_MAX     8.0\n				\n				/* from mitsuhiko/webgl-meincraft based on the code on geeks3d.com */\n				vec4 applyFXAA(sampler2D tex, vec2 fragCoord)\n				{\n					vec4 color = vec4(0.0);\n					/*vec2 inverseVP = vec2(1.0 / uViewportSize.x, 1.0 / uViewportSize.y);*/\n					vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * inverseVP).xyz;\n					vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * inverseVP).xyz;\n					vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * inverseVP).xyz;\n					vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * inverseVP).xyz;\n					vec3 rgbM  = texture2D(tex, fragCoord  * inverseVP).xyz;\n					vec3 luma = vec3(0.299, 0.587, 0.114);\n					float lumaNW = dot(rgbNW, luma);\n					float lumaNE = dot(rgbNE, luma);\n					float lumaSW = dot(rgbSW, luma);\n					float lumaSE = dot(rgbSE, luma);\n					float lumaM  = dot(rgbM,  luma);\n					float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n					float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n					\n					vec2 dir;\n					dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n					dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n					\n					float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n					\n					float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n					dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * inverseVP;\n					\n					vec3 rgbA = 0.5 * (texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz + \n						texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n					vec3 rgbB = rgbA * 0.5 + 0.25 * (texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz + \n						texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n					\n					//return vec4(rgbA,1.0);\n					float lumaB = dot(rgbB, luma);\n					if ((lumaB < lumaMin) || (lumaB > lumaMax))\n						color = vec4(rgbA, 1.0);\n					else\n						color = vec4(rgbB, 1.0);\n					if(u_igamma != 1.0)\n						color.xyz = pow( color.xyz, vec3(u_igamma) );\n					return color;\n				}\n				\n				void main() {\n				   gl_FragColor = applyFXAA( u_texture, v_coord * uViewportSize) ;\n				}\n				";
      LGraphTextureToViewport.gamma_pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform float u_igamma;\n				void main() {\n					vec4 color = texture2D( u_texture, v_coord);\n					color.xyz = pow(color.xyz, vec3(u_igamma) );\n				   gl_FragColor = color;\n				}\n				";
      LiteGraph2.registerNodeType(
        "texture/toviewport",
        LGraphTextureToViewport
      );
      function LGraphTextureCopy() {
        this.addInput("Texture", "Texture");
        this.addOutput("", "Texture");
        this.properties = {
          size: 0,
          generate_mipmaps: false,
          precision: LGraphTexture2.DEFAULT
        };
      }
      LGraphTextureCopy.title = "Copy";
      LGraphTextureCopy.desc = "Copy Texture";
      LGraphTextureCopy.widgets_info = {
        size: {
          widget: "combo",
          values: [0, 32, 64, 128, 256, 512, 1024, 2048]
        },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureCopy.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex && !this._temp_texture) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (tex) {
          var width2 = tex.width;
          var height = tex.height;
          if (this.properties.size != 0) {
            width2 = this.properties.size;
            height = this.properties.size;
          }
          var temp2 = this._temp_texture;
          var type = tex.type;
          if (this.properties.precision === LGraphTexture2.LOW) {
            type = gl.UNSIGNED_BYTE;
          } else if (this.properties.precision === LGraphTexture2.HIGH) {
            type = gl.HIGH_PRECISION_FORMAT;
          }
          if (!temp2 || temp2.width != width2 || temp2.height != height || temp2.type != type) {
            var minFilter = gl.LINEAR;
            if (this.properties.generate_mipmaps && isPowerOfTwo(width2) && isPowerOfTwo(height)) {
              minFilter = gl.LINEAR_MIPMAP_LINEAR;
            }
            this._temp_texture = new GL.Texture(width2, height, {
              type,
              format: gl.RGBA,
              minFilter,
              magFilter: gl.LINEAR
            });
          }
          tex.copyTo(this._temp_texture);
          if (this.properties.generate_mipmaps) {
            this._temp_texture.bind(0);
            gl.generateMipmap(this._temp_texture.texture_type);
            this._temp_texture.unbind(0);
          }
        }
        this.setOutputData(0, this._temp_texture);
      };
      LiteGraph2.registerNodeType("texture/copy", LGraphTextureCopy);
      function LGraphTextureDownsample() {
        this.addInput("Texture", "Texture");
        this.addOutput("", "Texture");
        this.properties = {
          iterations: 1,
          generate_mipmaps: false,
          precision: LGraphTexture2.DEFAULT
        };
      }
      LGraphTextureDownsample.title = "Downsample";
      LGraphTextureDownsample.desc = "Downsample Texture";
      LGraphTextureDownsample.widgets_info = {
        iterations: { type: "number", step: 1, precision: 0, min: 0 },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureDownsample.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex && !this._temp_texture) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (!tex || tex.texture_type !== GL.TEXTURE_2D) {
          return;
        }
        if (this.properties.iterations < 1) {
          this.setOutputData(0, tex);
          return;
        }
        var shader = LGraphTextureDownsample._shader;
        if (!shader) {
          LGraphTextureDownsample._shader = shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureDownsample.pixel_shader
          );
        }
        var width2 = tex.width | 0;
        var height = tex.height | 0;
        var type = tex.type;
        if (this.properties.precision === LGraphTexture2.LOW) {
          type = gl.UNSIGNED_BYTE;
        } else if (this.properties.precision === LGraphTexture2.HIGH) {
          type = gl.HIGH_PRECISION_FORMAT;
        }
        var iterations = this.properties.iterations || 1;
        var origin = tex;
        var target = null;
        var temp2 = [];
        var options = {
          type,
          format: tex.format
        };
        var offset = vec2.create();
        var uniforms = {
          u_offset: offset
        };
        if (this._texture) {
          GL.Texture.releaseTemporary(this._texture);
        }
        for (var i2 = 0; i2 < iterations; ++i2) {
          offset[0] = 1 / width2;
          offset[1] = 1 / height;
          width2 = width2 >> 1 || 0;
          height = height >> 1 || 0;
          target = GL.Texture.getTemporary(width2, height, options);
          temp2.push(target);
          origin.setParameter(GL.TEXTURE_MAG_FILTER, GL.NEAREST);
          origin.copyTo(target, shader, uniforms);
          if (width2 == 1 && height == 1) {
            break;
          }
          origin = target;
        }
        this._texture = temp2.pop();
        for (var i2 = 0; i2 < temp2.length; ++i2) {
          GL.Texture.releaseTemporary(temp2[i2]);
        }
        if (this.properties.generate_mipmaps) {
          this._texture.bind(0);
          gl.generateMipmap(this._texture.texture_type);
          this._texture.unbind(0);
        }
        this.setOutputData(0, this._texture);
      };
      LGraphTextureDownsample.pixel_shader = "precision highp float;\n				precision highp float;\n				uniform sampler2D u_texture;\n				uniform vec2 u_offset;\n				varying vec2 v_coord;\n				\n				void main() {\n					vec4 color = texture2D(u_texture, v_coord );\n					color += texture2D(u_texture, v_coord + vec2( u_offset.x, 0.0 ) );\n					color += texture2D(u_texture, v_coord + vec2( 0.0, u_offset.y ) );\n					color += texture2D(u_texture, v_coord + vec2( u_offset.x, u_offset.y ) );\n				   gl_FragColor = color * 0.25;\n				}\n				";
      LiteGraph2.registerNodeType(
        "texture/downsample",
        LGraphTextureDownsample
      );
      function LGraphTextureResize() {
        this.addInput("Texture", "Texture");
        this.addOutput("", "Texture");
        this.properties = {
          size: [512, 512],
          generate_mipmaps: false,
          precision: LGraphTexture2.DEFAULT
        };
      }
      LGraphTextureResize.title = "Resize";
      LGraphTextureResize.desc = "Resize Texture";
      LGraphTextureResize.widgets_info = {
        iterations: { type: "number", step: 1, precision: 0, min: 0 },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureResize.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex && !this._temp_texture) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (!tex || tex.texture_type !== GL.TEXTURE_2D) {
          return;
        }
        var width2 = this.properties.size[0] | 0;
        var height = this.properties.size[1] | 0;
        if (width2 == 0)
          width2 = tex.width;
        if (height == 0)
          height = tex.height;
        var type = tex.type;
        if (this.properties.precision === LGraphTexture2.LOW) {
          type = gl.UNSIGNED_BYTE;
        } else if (this.properties.precision === LGraphTexture2.HIGH) {
          type = gl.HIGH_PRECISION_FORMAT;
        }
        if (!this._texture || this._texture.width != width2 || this._texture.height != height || this._texture.type != type)
          this._texture = new GL.Texture(width2, height, { type });
        tex.copyTo(this._texture);
        if (this.properties.generate_mipmaps) {
          this._texture.bind(0);
          gl.generateMipmap(this._texture.texture_type);
          this._texture.unbind(0);
        }
        this.setOutputData(0, this._texture);
      };
      LiteGraph2.registerNodeType("texture/resize", LGraphTextureResize);
      function LGraphTextureAverage() {
        this.addInput("Texture", "Texture");
        this.addOutput("tex", "Texture");
        this.addOutput("avg", "vec4");
        this.addOutput("lum", "number");
        this.properties = {
          use_previous_frame: true,
          //to avoid stalls 
          high_quality: false
          //to use as much pixels as possible
        };
        this._uniforms = {
          u_texture: 0,
          u_mipmap_offset: 0
        };
        this._luminance = new Float32Array(4);
      }
      LGraphTextureAverage.title = "Average";
      LGraphTextureAverage.desc = "Compute a partial average (32 random samples) of a texture and stores it as a 1x1 pixel texture.\n If high_quality is true, then it generates the mipmaps first and reads from the lower one.";
      LGraphTextureAverage.prototype.onExecute = function() {
        if (!this.properties.use_previous_frame) {
          this.updateAverage();
        }
        var v2 = this._luminance;
        this.setOutputData(0, this._temp_texture);
        this.setOutputData(1, v2);
        this.setOutputData(2, (v2[0] + v2[1] + v2[2]) / 3);
      };
      LGraphTextureAverage.prototype.onPreRenderExecute = function() {
        this.updateAverage();
      };
      LGraphTextureAverage.prototype.updateAverage = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isOutputConnected(0) && !this.isOutputConnected(1) && !this.isOutputConnected(2)) {
          return;
        }
        if (!LGraphTextureAverage._shader) {
          LGraphTextureAverage._shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureAverage.pixel_shader
          );
          var samples = new Float32Array(16);
          for (var i2 = 0; i2 < samples.length; ++i2) {
            samples[i2] = Math.random();
          }
          LGraphTextureAverage._shader.uniforms({
            u_samples_a: samples.subarray(0, 16),
            u_samples_b: samples.subarray(16, 32)
          });
        }
        var temp2 = this._temp_texture;
        var type = gl.UNSIGNED_BYTE;
        if (tex.type != type) {
          type = gl.FLOAT;
        }
        if (!temp2 || temp2.type != type) {
          this._temp_texture = new GL.Texture(1, 1, {
            type,
            format: gl.RGBA,
            filter: gl.NEAREST
          });
        }
        this._uniforms.u_mipmap_offset = 0;
        if (this.properties.high_quality) {
          if (!this._temp_pot2_texture || this._temp_pot2_texture.type != type)
            this._temp_pot2_texture = new GL.Texture(512, 512, {
              type,
              format: gl.RGBA,
              minFilter: gl.LINEAR_MIPMAP_LINEAR,
              magFilter: gl.LINEAR
            });
          tex.copyTo(this._temp_pot2_texture);
          tex = this._temp_pot2_texture;
          tex.bind(0);
          gl.generateMipmap(GL.TEXTURE_2D);
          this._uniforms.u_mipmap_offset = 9;
        }
        var shader = LGraphTextureAverage._shader;
        var uniforms = this._uniforms;
        uniforms.u_mipmap_offset = this.properties.mipmap_offset;
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        this._temp_texture.drawTo(function() {
          tex.toViewport(shader, uniforms);
        });
        if (this.isOutputConnected(1) || this.isOutputConnected(2)) {
          var pixel = this._temp_texture.getPixels();
          if (pixel) {
            var v2 = this._luminance;
            var type = this._temp_texture.type;
            v2.set(pixel);
            if (type == gl.UNSIGNED_BYTE) {
              vec4.scale(v2, v2, 1 / 255);
            } else if (type == GL.HALF_FLOAT || type == GL.HALF_FLOAT_OES) ;
          }
        }
      };
      LGraphTextureAverage.pixel_shader = "precision highp float;\n				precision highp float;\n				uniform mat4 u_samples_a;\n				uniform mat4 u_samples_b;\n				uniform sampler2D u_texture;\n				uniform float u_mipmap_offset;\n				varying vec2 v_coord;\n				\n				void main() {\n					vec4 color = vec4(0.0);\n					//random average\n					for(int i = 0; i < 4; ++i)\n						for(int j = 0; j < 4; ++j)\n						{\n							color += texture2D(u_texture, vec2( u_samples_a[i][j], u_samples_b[i][j] ), u_mipmap_offset );\n							color += texture2D(u_texture, vec2( 1.0 - u_samples_a[i][j], 1.0 - u_samples_b[i][j] ), u_mipmap_offset );\n						}\n				   gl_FragColor = color * 0.03125;\n				}\n				";
      LiteGraph2.registerNodeType("texture/average", LGraphTextureAverage);
      function LGraphTextureTemporalSmooth() {
        this.addInput("in", "Texture");
        this.addInput("factor", "Number");
        this.addOutput("out", "Texture");
        this.properties = { factor: 0.5 };
        this._uniforms = {
          u_texture: 0,
          u_textureB: 1,
          u_factor: this.properties.factor
        };
      }
      LGraphTextureTemporalSmooth.title = "Smooth";
      LGraphTextureTemporalSmooth.desc = "Smooth texture over time";
      LGraphTextureTemporalSmooth.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex || !this.isOutputConnected(0)) {
          return;
        }
        if (!LGraphTextureTemporalSmooth._shader) {
          LGraphTextureTemporalSmooth._shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureTemporalSmooth.pixel_shader
          );
        }
        var temp2 = this._temp_texture;
        if (!temp2 || temp2.type != tex.type || temp2.width != tex.width || temp2.height != tex.height) {
          var options = {
            type: tex.type,
            format: gl.RGBA,
            filter: gl.NEAREST
          };
          this._temp_texture = new GL.Texture(tex.width, tex.height, options);
          this._temp_texture2 = new GL.Texture(tex.width, tex.height, options);
          tex.copyTo(this._temp_texture2);
        }
        var tempA2 = this._temp_texture;
        var tempB2 = this._temp_texture2;
        var shader = LGraphTextureTemporalSmooth._shader;
        var uniforms = this._uniforms;
        uniforms.u_factor = 1 - this.getInputOrProperty("factor");
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        tempA2.drawTo(function() {
          tempB2.bind(1);
          tex.toViewport(shader, uniforms);
        });
        this.setOutputData(0, tempA2);
        this._temp_texture = tempB2;
        this._temp_texture2 = tempA2;
      };
      LGraphTextureTemporalSmooth.pixel_shader = "precision highp float;\n				precision highp float;\n				uniform sampler2D u_texture;\n				uniform sampler2D u_textureB;\n				uniform float u_factor;\n				varying vec2 v_coord;\n				\n				void main() {\n					gl_FragColor = mix( texture2D( u_texture, v_coord ), texture2D( u_textureB, v_coord ), u_factor );\n				}\n				";
      LiteGraph2.registerNodeType("texture/temporal_smooth", LGraphTextureTemporalSmooth);
      function LGraphTextureLinearAvgSmooth() {
        this.addInput("in", "Texture");
        this.addOutput("avg", "Texture");
        this.addOutput("array", "Texture");
        this.properties = { samples: 64, frames_interval: 1 };
        this._uniforms = {
          u_texture: 0,
          u_textureB: 1,
          u_samples: this.properties.samples,
          u_isamples: 1 / this.properties.samples
        };
        this.frame = 0;
      }
      LGraphTextureLinearAvgSmooth.title = "Lineal Avg Smooth";
      LGraphTextureLinearAvgSmooth.desc = "Smooth texture linearly over time";
      LGraphTextureLinearAvgSmooth["@samples"] = { type: "number", min: 1, max: 64, step: 1, precision: 1 };
      LGraphTextureLinearAvgSmooth.prototype.getPreviewTexture = function() {
        return this._temp_texture2;
      };
      LGraphTextureLinearAvgSmooth.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex || !this.isOutputConnected(0)) {
          return;
        }
        if (!LGraphTextureLinearAvgSmooth._shader) {
          LGraphTextureLinearAvgSmooth._shader_copy = new GL.Shader(GL.Shader.SCREEN_VERTEX_SHADER, LGraphTextureLinearAvgSmooth.pixel_shader_copy);
          LGraphTextureLinearAvgSmooth._shader_avg = new GL.Shader(GL.Shader.SCREEN_VERTEX_SHADER, LGraphTextureLinearAvgSmooth.pixel_shader_avg);
        }
        var samples = clamp(this.properties.samples, 0, 64);
        var frame = this.frame;
        var interval = this.properties.frames_interval;
        if (interval == 0 || frame % interval == 0) {
          var temp2 = this._temp_texture;
          if (!temp2 || temp2.type != tex.type || temp2.width != samples) {
            var options = {
              type: tex.type,
              format: gl.RGBA,
              filter: gl.NEAREST
            };
            this._temp_texture = new GL.Texture(samples, 1, options);
            this._temp_texture2 = new GL.Texture(samples, 1, options);
            this._temp_texture_out = new GL.Texture(1, 1, options);
          }
          var tempA2 = this._temp_texture;
          var tempB2 = this._temp_texture2;
          var shader_copy = LGraphTextureLinearAvgSmooth._shader_copy;
          var shader_avg = LGraphTextureLinearAvgSmooth._shader_avg;
          var uniforms = this._uniforms;
          uniforms.u_samples = samples;
          uniforms.u_isamples = 1 / samples;
          gl.disable(gl.BLEND);
          gl.disable(gl.DEPTH_TEST);
          tempA2.drawTo(function() {
            tempB2.bind(1);
            tex.toViewport(shader_copy, uniforms);
          });
          this._temp_texture_out.drawTo(function() {
            tempA2.toViewport(shader_avg, uniforms);
          });
          this.setOutputData(0, this._temp_texture_out);
          this._temp_texture = tempB2;
          this._temp_texture2 = tempA2;
        } else
          this.setOutputData(0, this._temp_texture_out);
        this.setOutputData(1, this._temp_texture2);
        this.frame++;
      };
      LGraphTextureLinearAvgSmooth.pixel_shader_copy = "precision highp float;\n				precision highp float;\n				uniform sampler2D u_texture;\n				uniform sampler2D u_textureB;\n				uniform float u_isamples;\n				varying vec2 v_coord;\n				\n				void main() {\n					if( v_coord.x <= u_isamples )\n						gl_FragColor = texture2D( u_texture, vec2(0.5) );\n					else\n						gl_FragColor = texture2D( u_textureB, v_coord - vec2(u_isamples,0.0) );\n				}\n				";
      LGraphTextureLinearAvgSmooth.pixel_shader_avg = "precision highp float;\n				precision highp float;\n				uniform sampler2D u_texture;\n				uniform int u_samples;\n				uniform float u_isamples;\n				varying vec2 v_coord;\n				\n				void main() {\n					vec4 color = vec4(0.0);\n					for(int i = 0; i < 64; ++i)\n					{\n						color += texture2D( u_texture, vec2( float(i)*u_isamples,0.0) );\n						if(i == (u_samples - 1))\n							break;\n					}\n					gl_FragColor = color * u_isamples;\n				}\n				";
      LiteGraph2.registerNodeType("texture/linear_avg_smooth", LGraphTextureLinearAvgSmooth);
      function LGraphImageToTexture() {
        this.addInput("Image", "image");
        this.addOutput("", "Texture");
        this.properties = {};
      }
      LGraphImageToTexture.title = "Image to Texture";
      LGraphImageToTexture.desc = "Uploads an image to the GPU";
      LGraphImageToTexture.prototype.onExecute = function() {
        var img = this.getInputData(0);
        if (!img) {
          return;
        }
        var width2 = img.videoWidth || img.width;
        var height = img.videoHeight || img.height;
        if (img.gltexture) {
          this.setOutputData(0, img.gltexture);
          return;
        }
        var temp2 = this._temp_texture;
        if (!temp2 || temp2.width != width2 || temp2.height != height) {
          this._temp_texture = new GL.Texture(width2, height, {
            format: gl.RGBA,
            filter: gl.LINEAR
          });
        }
        try {
          this._temp_texture.uploadImage(img);
        } catch (err) {
          console.error(
            "image comes from an unsafe location, cannot be uploaded to webgl: " + err
          );
          return;
        }
        this.setOutputData(0, this._temp_texture);
      };
      LiteGraph2.registerNodeType(
        "texture/imageToTexture",
        LGraphImageToTexture
      );
      function LGraphTextureLUT() {
        this.addInput("Texture", "Texture");
        this.addInput("LUT", "Texture");
        this.addInput("Intensity", "number");
        this.addOutput("", "Texture");
        this.properties = { enabled: true, intensity: 1, precision: LGraphTexture2.DEFAULT, texture: null };
        if (!LGraphTextureLUT._shader) {
          LGraphTextureLUT._shader = new GL.Shader(Shader.SCREEN_VERTEX_SHADER, LGraphTextureLUT.pixel_shader);
        }
      }
      LGraphTextureLUT.widgets_info = {
        texture: { widget: "texture" },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureLUT.title = "LUT";
      LGraphTextureLUT.desc = "Apply LUT to Texture";
      LGraphTextureLUT.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var tex = this.getInputData(0);
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH || this.properties.enabled === false) {
          this.setOutputData(0, tex);
          return;
        }
        if (!tex) {
          return;
        }
        var lut_tex = this.getInputData(1);
        if (!lut_tex) {
          lut_tex = LGraphTexture2.getTexture(this.properties.texture);
        }
        if (!lut_tex) {
          this.setOutputData(0, tex);
          return;
        }
        lut_tex.bind(0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_S,
          gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_T,
          gl.CLAMP_TO_EDGE
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
        var intensity = this.properties.intensity;
        if (this.isInputConnected(2)) {
          this.properties.intensity = intensity = this.getInputData(2);
        }
        this._tex = LGraphTexture2.getTargetTexture(
          tex,
          this._tex,
          this.properties.precision
        );
        this._tex.drawTo(function() {
          lut_tex.bind(1);
          tex.toViewport(LGraphTextureLUT._shader, {
            u_texture: 0,
            u_textureB: 1,
            u_amount: intensity
          });
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureLUT.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform sampler2D u_textureB;\n				uniform float u_amount;\n				\n				void main() {\n					 lowp vec4 textureColor = clamp( texture2D(u_texture, v_coord), vec4(0.0), vec4(1.0) );\n					 mediump float blueColor = textureColor.b * 63.0;\n					 mediump vec2 quad1;\n					 quad1.y = floor(floor(blueColor) / 8.0);\n					 quad1.x = floor(blueColor) - (quad1.y * 8.0);\n					 mediump vec2 quad2;\n					 quad2.y = floor(ceil(blueColor) / 8.0);\n					 quad2.x = ceil(blueColor) - (quad2.y * 8.0);\n					 highp vec2 texPos1;\n					 texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);\n					 texPos1.y = 1.0 - ((quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g));\n					 highp vec2 texPos2;\n					 texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);\n					 texPos2.y = 1.0 - ((quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g));\n					 lowp vec4 newColor1 = texture2D(u_textureB, texPos1);\n					 lowp vec4 newColor2 = texture2D(u_textureB, texPos2);\n					 lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));\n					 gl_FragColor = vec4( mix( textureColor.rgb, newColor.rgb, u_amount), textureColor.w);\n				}\n				";
      LiteGraph2.registerNodeType("texture/LUT", LGraphTextureLUT);
      function LGraphTextureEncode() {
        this.addInput("Texture", "Texture");
        this.addInput("Atlas", "Texture");
        this.addOutput("", "Texture");
        this.properties = { enabled: true, num_row_symbols: 4, symbol_size: 16, brightness: 1, colorize: false, filter: false, invert: false, precision: LGraphTexture2.DEFAULT, generate_mipmaps: false, texture: null };
        if (!LGraphTextureEncode._shader) {
          LGraphTextureEncode._shader = new GL.Shader(Shader.SCREEN_VERTEX_SHADER, LGraphTextureEncode.pixel_shader);
        }
        this._uniforms = {
          u_texture: 0,
          u_textureB: 1,
          u_row_simbols: 4,
          u_simbol_size: 16,
          u_res: vec2.create()
        };
      }
      LGraphTextureEncode.widgets_info = {
        texture: { widget: "texture" },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureEncode.title = "Encode";
      LGraphTextureEncode.desc = "Apply a texture atlas to encode a texture";
      LGraphTextureEncode.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var tex = this.getInputData(0);
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH || this.properties.enabled === false) {
          this.setOutputData(0, tex);
          return;
        }
        if (!tex) {
          return;
        }
        var symbols_tex = this.getInputData(1);
        if (!symbols_tex) {
          symbols_tex = LGraphTexture2.getTexture(this.properties.texture);
        }
        if (!symbols_tex) {
          this.setOutputData(0, tex);
          return;
        }
        symbols_tex.bind(0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.properties.filter ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.properties.filter ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        var uniforms = this._uniforms;
        uniforms.u_row_simbols = Math.floor(this.properties.num_row_symbols);
        uniforms.u_symbol_size = this.properties.symbol_size;
        uniforms.u_brightness = this.properties.brightness;
        uniforms.u_invert = this.properties.invert ? 1 : 0;
        uniforms.u_colorize = this.properties.colorize ? 1 : 0;
        this._tex = LGraphTexture2.getTargetTexture(tex, this._tex, this.properties.precision);
        uniforms.u_res[0] = this._tex.width;
        uniforms.u_res[1] = this._tex.height;
        this._tex.bind(0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        this._tex.drawTo(function() {
          symbols_tex.bind(1);
          tex.toViewport(LGraphTextureEncode._shader, uniforms);
        });
        if (this.properties.generate_mipmaps) {
          this._tex.bind(0);
          gl.generateMipmap(this._tex.texture_type);
          this._tex.unbind(0);
        }
        this.setOutputData(0, this._tex);
      };
      LGraphTextureEncode.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform sampler2D u_textureB;\n				uniform float u_row_simbols;\n				uniform float u_symbol_size;\n				uniform float u_brightness;\n				uniform float u_invert;\n				uniform float u_colorize;\n				uniform vec2 u_res;\n				\n				void main() {\n					vec2 total_symbols = u_res / u_symbol_size;\n					vec2 uv = floor(v_coord * total_symbols) / total_symbols; //pixelate \n					vec2 local_uv = mod(v_coord * u_res, u_symbol_size) / u_symbol_size;\n					lowp vec4 textureColor = texture2D(u_texture, uv );\n					float lum = clamp(u_brightness * (textureColor.x + textureColor.y + textureColor.z)/3.0,0.0,1.0);\n					if( u_invert == 1.0 ) lum = 1.0 - lum;\n					float index = floor( lum * (u_row_simbols * u_row_simbols - 1.0));\n					float col = mod( index, u_row_simbols );\n					float row = u_row_simbols - floor( index / u_row_simbols ) - 1.0;\n					vec2 simbol_uv = ( vec2( col, row ) + local_uv ) / u_row_simbols;\n					vec4 color = texture2D( u_textureB, simbol_uv );\n					if(u_colorize == 1.0)\n						color *= textureColor;\n					gl_FragColor = color;\n				}\n				";
      LiteGraph2.registerNodeType("texture/encode", LGraphTextureEncode);
      function LGraphTextureChannels() {
        this.addInput("Texture", "Texture");
        this.addOutput("R", "Texture");
        this.addOutput("G", "Texture");
        this.addOutput("B", "Texture");
        this.addOutput("A", "Texture");
        if (!LGraphTextureChannels._shader) {
          LGraphTextureChannels._shader = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureChannels.pixel_shader
          );
        }
      }
      LGraphTextureChannels.title = "Texture to Channels";
      LGraphTextureChannels.desc = "Split texture channels";
      LGraphTextureChannels.prototype.onExecute = function() {
        var texA = this.getInputData(0);
        if (!texA) {
          return;
        }
        if (!this._channels) {
          this._channels = Array(4);
        }
        var format = gl.RGB;
        var connections = 0;
        for (var i2 = 0; i2 < 4; i2++) {
          if (this.isOutputConnected(i2)) {
            if (!this._channels[i2] || this._channels[i2].width != texA.width || this._channels[i2].height != texA.height || this._channels[i2].type != texA.type || this._channels[i2].format != format) {
              this._channels[i2] = new GL.Texture(
                texA.width,
                texA.height,
                {
                  type: texA.type,
                  format,
                  filter: gl.LINEAR
                }
              );
            }
            connections++;
          } else {
            this._channels[i2] = null;
          }
        }
        if (!connections) {
          return;
        }
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        var mesh = Mesh.getScreenQuad();
        var shader = LGraphTextureChannels._shader;
        var masks = [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ];
        for (var i2 = 0; i2 < 4; i2++) {
          if (!this._channels[i2]) {
            continue;
          }
          this._channels[i2].drawTo(function() {
            texA.bind(0);
            shader.uniforms({ u_texture: 0, u_mask: masks[i2] }).draw(mesh);
          });
          this.setOutputData(i2, this._channels[i2]);
        }
      };
      LGraphTextureChannels.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform vec4 u_mask;\n				\n				void main() {\n				   gl_FragColor = vec4( vec3( length( texture2D(u_texture, v_coord) * u_mask )), 1.0 );\n				}\n				";
      LiteGraph2.registerNodeType(
        "texture/textureChannels",
        LGraphTextureChannels
      );
      function LGraphChannelsTexture() {
        this.addInput("R", "Texture");
        this.addInput("G", "Texture");
        this.addInput("B", "Texture");
        this.addInput("A", "Texture");
        this.addOutput("Texture", "Texture");
        this.properties = {
          precision: LGraphTexture2.DEFAULT,
          R: 1,
          G: 1,
          B: 1,
          A: 1
        };
        this._color = vec4.create();
        this._uniforms = {
          u_textureR: 0,
          u_textureG: 1,
          u_textureB: 2,
          u_textureA: 3,
          u_color: this._color
        };
      }
      LGraphChannelsTexture.title = "Channels to Texture";
      LGraphChannelsTexture.desc = "Split texture channels";
      LGraphChannelsTexture.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphChannelsTexture.prototype.onExecute = function() {
        var white = LGraphTexture2.getWhiteTexture();
        var texR = this.getInputData(0) || white;
        var texG = this.getInputData(1) || white;
        var texB = this.getInputData(2) || white;
        var texA = this.getInputData(3) || white;
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        var mesh = Mesh.getScreenQuad();
        if (!LGraphChannelsTexture._shader) {
          LGraphChannelsTexture._shader = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphChannelsTexture.pixel_shader
          );
        }
        var shader = LGraphChannelsTexture._shader;
        var w2 = Math.max(texR.width, texG.width, texB.width, texA.width);
        var h = Math.max(
          texR.height,
          texG.height,
          texB.height,
          texA.height
        );
        var type = this.properties.precision == LGraphTexture2.HIGH ? LGraphTexture2.HIGH_PRECISION_FORMAT : gl.UNSIGNED_BYTE;
        if (!this._texture || this._texture.width != w2 || this._texture.height != h || this._texture.type != type) {
          this._texture = new GL.Texture(w2, h, {
            type,
            format: gl.RGBA,
            filter: gl.LINEAR
          });
        }
        var color = this._color;
        color[0] = this.properties.R;
        color[1] = this.properties.G;
        color[2] = this.properties.B;
        color[3] = this.properties.A;
        var uniforms = this._uniforms;
        this._texture.drawTo(function() {
          texR.bind(0);
          texG.bind(1);
          texB.bind(2);
          texA.bind(3);
          shader.uniforms(uniforms).draw(mesh);
        });
        this.setOutputData(0, this._texture);
      };
      LGraphChannelsTexture.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_textureR;\n				uniform sampler2D u_textureG;\n				uniform sampler2D u_textureB;\n				uniform sampler2D u_textureA;\n				uniform vec4 u_color;\n				\n				void main() {\n				   gl_FragColor = u_color * vec4( 							texture2D(u_textureR, v_coord).r,							texture2D(u_textureG, v_coord).r,							texture2D(u_textureB, v_coord).r,							texture2D(u_textureA, v_coord).r);\n				}\n				";
      LiteGraph2.registerNodeType(
        "texture/channelsTexture",
        LGraphChannelsTexture
      );
      function LGraphTextureColor() {
        this.addOutput("Texture", "Texture");
        this._tex_color = vec4.create();
        this.properties = {
          color: vec4.create(),
          precision: LGraphTexture2.DEFAULT
        };
      }
      LGraphTextureColor.title = "Color";
      LGraphTextureColor.desc = "Generates a 1x1 texture with a constant color";
      LGraphTextureColor.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureColor.prototype.onDrawBackground = function(ctx) {
        var c = this.properties.color;
        ctx.fillStyle = "rgb(" + Math.floor(clamp(c[0], 0, 1) * 255) + "," + Math.floor(clamp(c[1], 0, 1) * 255) + "," + Math.floor(clamp(c[2], 0, 1) * 255) + ")";
        if (this.flags.collapsed) {
          this.boxcolor = ctx.fillStyle;
        } else {
          ctx.fillRect(0, 0, this.size[0], this.size[1]);
        }
      };
      LGraphTextureColor.prototype.onExecute = function() {
        var type = this.properties.precision == LGraphTexture2.HIGH ? LGraphTexture2.HIGH_PRECISION_FORMAT : gl.UNSIGNED_BYTE;
        if (!this._tex || this._tex.type != type) {
          this._tex = new GL.Texture(1, 1, {
            format: gl.RGBA,
            type,
            minFilter: gl.NEAREST
          });
        }
        var color = this.properties.color;
        if (this.inputs) {
          for (var i2 = 0; i2 < this.inputs.length; i2++) {
            var input = this.inputs[i2];
            var v2 = this.getInputData(i2);
            if (v2 === void 0) {
              continue;
            }
            switch (input.name) {
              case "RGB":
              case "RGBA":
                color.set(v2);
                break;
              case "R":
                color[0] = v2;
                break;
              case "G":
                color[1] = v2;
                break;
              case "B":
                color[2] = v2;
                break;
              case "A":
                color[3] = v2;
                break;
            }
          }
        }
        if (vec4.sqrDist(this._tex_color, color) > 1e-3) {
          this._tex_color.set(color);
          this._tex.fill(color);
        }
        this.setOutputData(0, this._tex);
      };
      LGraphTextureColor.prototype.onGetInputs = function() {
        return [
          ["RGB", "vec3"],
          ["RGBA", "vec4"],
          ["R", "number"],
          ["G", "number"],
          ["B", "number"],
          ["A", "number"]
        ];
      };
      LiteGraph2.registerNodeType("texture/color", LGraphTextureColor);
      function LGraphTextureGradient() {
        this.addInput("A", "color");
        this.addInput("B", "color");
        this.addOutput("Texture", "Texture");
        this.properties = {
          angle: 0,
          scale: 1,
          A: [0, 0, 0],
          B: [1, 1, 1],
          texture_size: 32
        };
        if (!LGraphTextureGradient._shader) {
          LGraphTextureGradient._shader = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureGradient.pixel_shader
          );
        }
        this._uniforms = {
          u_angle: 0,
          u_colorA: vec3.create(),
          u_colorB: vec3.create()
        };
      }
      LGraphTextureGradient.title = "Gradient";
      LGraphTextureGradient.desc = "Generates a gradient";
      LGraphTextureGradient["@A"] = { type: "color" };
      LGraphTextureGradient["@B"] = { type: "color" };
      LGraphTextureGradient["@texture_size"] = {
        type: "enum",
        values: [32, 64, 128, 256, 512]
      };
      LGraphTextureGradient.prototype.onExecute = function() {
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        var mesh = GL.Mesh.getScreenQuad();
        var shader = LGraphTextureGradient._shader;
        var A = this.getInputData(0);
        if (!A) {
          A = this.properties.A;
        }
        var B = this.getInputData(1);
        if (!B) {
          B = this.properties.B;
        }
        for (var i2 = 2; i2 < this.inputs.length; i2++) {
          var input = this.inputs[i2];
          var v2 = this.getInputData(i2);
          if (v2 === void 0) {
            continue;
          }
          this.properties[input.name] = v2;
        }
        var uniforms = this._uniforms;
        this._uniforms.u_angle = this.properties.angle * DEG2RAD;
        this._uniforms.u_scale = this.properties.scale;
        vec3.copy(uniforms.u_colorA, A);
        vec3.copy(uniforms.u_colorB, B);
        var size = parseInt(this.properties.texture_size);
        if (!this._tex || this._tex.width != size) {
          this._tex = new GL.Texture(size, size, {
            format: gl.RGB,
            filter: gl.LINEAR
          });
        }
        this._tex.drawTo(function() {
          shader.uniforms(uniforms).draw(mesh);
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureGradient.prototype.onGetInputs = function() {
        return [["angle", "number"], ["scale", "number"]];
      };
      LGraphTextureGradient.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform float u_angle;\n				uniform float u_scale;\n				uniform vec3 u_colorA;\n				uniform vec3 u_colorB;\n				\n				vec2 rotate(vec2 v, float angle)\n				{\n					vec2 result;\n					float _cos = cos(angle);\n					float _sin = sin(angle);\n					result.x = v.x * _cos - v.y * _sin;\n					result.y = v.x * _sin + v.y * _cos;\n					return result;\n				}\n				void main() {\n					float f = (rotate(u_scale * (v_coord - vec2(0.5)), u_angle) + vec2(0.5)).x;\n					vec3 color = mix(u_colorA,u_colorB,clamp(f,0.0,1.0));\n				   gl_FragColor = vec4(color,1.0);\n				}\n				";
      LiteGraph2.registerNodeType("texture/gradient", LGraphTextureGradient);
      function LGraphTextureMix() {
        this.addInput("A", "Texture");
        this.addInput("B", "Texture");
        this.addInput("Mixer", "Texture");
        this.addOutput("Texture", "Texture");
        this.properties = { factor: 0.5, size_from_biggest: true, invert: false, precision: LGraphTexture2.DEFAULT };
        this._uniforms = {
          u_textureA: 0,
          u_textureB: 1,
          u_textureMix: 2,
          u_mix: vec4.create()
        };
      }
      LGraphTextureMix.title = "Mix";
      LGraphTextureMix.desc = "Generates a texture mixing two textures";
      LGraphTextureMix.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureMix.prototype.onExecute = function() {
        var texA = this.getInputData(0);
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
          this.setOutputData(0, texA);
          return;
        }
        var texB = this.getInputData(1);
        if (!texA || !texB) {
          return;
        }
        var texMix = this.getInputData(2);
        var factor = this.getInputData(3);
        this._tex = LGraphTexture2.getTargetTexture(
          this.properties.size_from_biggest && texB.width > texA.width ? texB : texA,
          this._tex,
          this.properties.precision
        );
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        var mesh = Mesh.getScreenQuad();
        var shader = null;
        var uniforms = this._uniforms;
        if (texMix) {
          shader = LGraphTextureMix._shader_tex;
          if (!shader) {
            shader = LGraphTextureMix._shader_tex = new GL.Shader(
              Shader.SCREEN_VERTEX_SHADER,
              LGraphTextureMix.pixel_shader,
              { MIX_TEX: "" }
            );
          }
        } else {
          shader = LGraphTextureMix._shader_factor;
          if (!shader) {
            shader = LGraphTextureMix._shader_factor = new GL.Shader(
              Shader.SCREEN_VERTEX_SHADER,
              LGraphTextureMix.pixel_shader
            );
          }
          var f = factor == null ? this.properties.factor : factor;
          uniforms.u_mix.set([f, f, f, f]);
        }
        var invert = this.properties.invert;
        this._tex.drawTo(function() {
          texA.bind(invert ? 1 : 0);
          texB.bind(invert ? 0 : 1);
          if (texMix) {
            texMix.bind(2);
          }
          shader.uniforms(uniforms).draw(mesh);
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureMix.prototype.onGetInputs = function() {
        return [["factor", "number"]];
      };
      LGraphTextureMix.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_textureA;\n				uniform sampler2D u_textureB;\n				#ifdef MIX_TEX\n					uniform sampler2D u_textureMix;\n				#else\n					uniform vec4 u_mix;\n				#endif\n				\n				void main() {\n					#ifdef MIX_TEX\n					   vec4 f = texture2D(u_textureMix, v_coord);\n					#else\n					   vec4 f = u_mix;\n					#endif\n				   gl_FragColor = mix( texture2D(u_textureA, v_coord), texture2D(u_textureB, v_coord), f );\n				}\n				";
      LiteGraph2.registerNodeType("texture/mix", LGraphTextureMix);
      function LGraphTextureEdges() {
        this.addInput("Tex.", "Texture");
        this.addOutput("Edges", "Texture");
        this.properties = {
          invert: true,
          threshold: false,
          factor: 1,
          precision: LGraphTexture2.DEFAULT
        };
        if (!LGraphTextureEdges._shader) {
          LGraphTextureEdges._shader = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureEdges.pixel_shader
          );
        }
      }
      LGraphTextureEdges.title = "Edges";
      LGraphTextureEdges.desc = "Detects edges";
      LGraphTextureEdges.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureEdges.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var tex = this.getInputData(0);
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
          this.setOutputData(0, tex);
          return;
        }
        if (!tex) {
          return;
        }
        this._tex = LGraphTexture2.getTargetTexture(
          tex,
          this._tex,
          this.properties.precision
        );
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        var mesh = Mesh.getScreenQuad();
        var shader = LGraphTextureEdges._shader;
        var invert = this.properties.invert;
        var factor = this.properties.factor;
        var threshold = this.properties.threshold ? 1 : 0;
        this._tex.drawTo(function() {
          tex.bind(0);
          shader.uniforms({
            u_texture: 0,
            u_isize: [1 / tex.width, 1 / tex.height],
            u_factor: factor,
            u_threshold: threshold,
            u_invert: invert ? 1 : 0
          }).draw(mesh);
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureEdges.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform vec2 u_isize;\n				uniform int u_invert;\n				uniform float u_factor;\n				uniform float u_threshold;\n				\n				void main() {\n					vec4 center = texture2D(u_texture, v_coord);\n					vec4 up = texture2D(u_texture, v_coord + u_isize * vec2(0.0,1.0) );\n					vec4 down = texture2D(u_texture, v_coord + u_isize * vec2(0.0,-1.0) );\n					vec4 left = texture2D(u_texture, v_coord + u_isize * vec2(1.0,0.0) );\n					vec4 right = texture2D(u_texture, v_coord + u_isize * vec2(-1.0,0.0) );\n					vec4 diff = abs(center - up) + abs(center - down) + abs(center - left) + abs(center - right);\n					diff *= u_factor;\n					if(u_invert == 1)\n						diff.xyz = vec3(1.0) - diff.xyz;\n					if( u_threshold == 0.0 )\n						gl_FragColor = vec4( diff.xyz, center.a );\n					else\n						gl_FragColor = vec4( diff.x > 0.5 ? 1.0 : 0.0, diff.y > 0.5 ? 1.0 : 0.0, diff.z > 0.5 ? 1.0 : 0.0, center.a );\n				}\n				";
      LiteGraph2.registerNodeType("texture/edges", LGraphTextureEdges);
      function LGraphTextureDepthRange() {
        this.addInput("Texture", "Texture");
        this.addInput("Distance", "number");
        this.addInput("Range", "number");
        this.addOutput("Texture", "Texture");
        this.properties = {
          distance: 100,
          range: 50,
          only_depth: false,
          high_precision: false
        };
        this._uniforms = {
          u_texture: 0,
          u_distance: 100,
          u_range: 50,
          u_camera_planes: null
        };
      }
      LGraphTextureDepthRange.title = "Depth Range";
      LGraphTextureDepthRange.desc = "Generates a texture with a depth range";
      LGraphTextureDepthRange.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        var precision = gl.UNSIGNED_BYTE;
        if (this.properties.high_precision) {
          precision = gl.half_float_ext ? gl.HALF_FLOAT_OES : gl.FLOAT;
        }
        if (!this._temp_texture || this._temp_texture.type != precision || this._temp_texture.width != tex.width || this._temp_texture.height != tex.height) {
          this._temp_texture = new GL.Texture(tex.width, tex.height, {
            type: precision,
            format: gl.RGBA,
            filter: gl.LINEAR
          });
        }
        var uniforms = this._uniforms;
        var distance2 = this.properties.distance;
        if (this.isInputConnected(1)) {
          distance2 = this.getInputData(1);
          this.properties.distance = distance2;
        }
        var range = this.properties.range;
        if (this.isInputConnected(2)) {
          range = this.getInputData(2);
          this.properties.range = range;
        }
        uniforms.u_distance = distance2;
        uniforms.u_range = range;
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        var mesh = Mesh.getScreenQuad();
        if (!LGraphTextureDepthRange._shader) {
          LGraphTextureDepthRange._shader = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureDepthRange.pixel_shader
          );
          LGraphTextureDepthRange._shader_onlydepth = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureDepthRange.pixel_shader,
            { ONLY_DEPTH: "" }
          );
        }
        var shader = this.properties.only_depth ? LGraphTextureDepthRange._shader_onlydepth : LGraphTextureDepthRange._shader;
        var planes = null;
        if (tex.near_far_planes) {
          planes = tex.near_far_planes;
        } else if (window.LS && LS.Renderer._main_camera) {
          planes = LS.Renderer._main_camera._uniforms.u_camera_planes;
        } else {
          planes = [0.1, 1e3];
        }
        uniforms.u_camera_planes = planes;
        this._temp_texture.drawTo(function() {
          tex.bind(0);
          shader.uniforms(uniforms).draw(mesh);
        });
        this._temp_texture.near_far_planes = planes;
        this.setOutputData(0, this._temp_texture);
      };
      LGraphTextureDepthRange.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform vec2 u_camera_planes;\n				uniform float u_distance;\n				uniform float u_range;\n				\n				float LinearDepth()\n				{\n					float zNear = u_camera_planes.x;\n					float zFar = u_camera_planes.y;\n					float depth = texture2D(u_texture, v_coord).x;\n					depth = depth * 2.0 - 1.0;\n					return zNear * (depth + 1.0) / (zFar + zNear - depth * (zFar - zNear));\n				}\n				\n				void main() {\n					float depth = LinearDepth();\n					#ifdef ONLY_DEPTH\n					   gl_FragColor = vec4(depth);\n					#else\n						float diff = abs(depth * u_camera_planes.y - u_distance);\n						float dof = 1.0;\n						if(diff <= u_range)\n							dof = diff / u_range;\n					   gl_FragColor = vec4(dof);\n					#endif\n				}\n				";
      LiteGraph2.registerNodeType("texture/depth_range", LGraphTextureDepthRange);
      function LGraphTextureLinearDepth() {
        this.addInput("Texture", "Texture");
        this.addOutput("Texture", "Texture");
        this.properties = {
          precision: LGraphTexture2.DEFAULT,
          invert: false
        };
        this._uniforms = {
          u_texture: 0,
          u_camera_planes: null,
          //filled later
          u_ires: vec2.create()
        };
      }
      LGraphTextureLinearDepth.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureLinearDepth.title = "Linear Depth";
      LGraphTextureLinearDepth.desc = "Creates a color texture with linear depth";
      LGraphTextureLinearDepth.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var tex = this.getInputData(0);
        if (!tex || tex.format != gl.DEPTH_COMPONENT && tex.format != gl.DEPTH_STENCIL) {
          return;
        }
        var precision = this.properties.precision == LGraphTexture2.HIGH ? gl.HIGH_PRECISION_FORMAT : gl.UNSIGNED_BYTE;
        if (!this._temp_texture || this._temp_texture.type != precision || this._temp_texture.width != tex.width || this._temp_texture.height != tex.height) {
          this._temp_texture = new GL.Texture(tex.width, tex.height, {
            type: precision,
            format: gl.RGB,
            filter: gl.LINEAR
          });
        }
        var uniforms = this._uniforms;
        uniforms.u_invert = this.properties.invert ? 1 : 0;
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        var mesh = Mesh.getScreenQuad();
        if (!LGraphTextureLinearDepth._shader)
          LGraphTextureLinearDepth._shader = new GL.Shader(GL.Shader.SCREEN_VERTEX_SHADER, LGraphTextureLinearDepth.pixel_shader);
        var shader = LGraphTextureLinearDepth._shader;
        var planes = null;
        if (tex.near_far_planes) {
          planes = tex.near_far_planes;
        } else if (window.LS && LS.Renderer._main_camera) {
          planes = LS.Renderer._main_camera._uniforms.u_camera_planes;
        } else {
          planes = [0.1, 1e3];
        }
        uniforms.u_camera_planes = planes;
        uniforms.u_ires.set([0, 0]);
        this._temp_texture.drawTo(function() {
          tex.bind(0);
          shader.uniforms(uniforms).draw(mesh);
        });
        this._temp_texture.near_far_planes = planes;
        this.setOutputData(0, this._temp_texture);
      };
      LGraphTextureLinearDepth.pixel_shader = "precision highp float;\n				precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform vec2 u_camera_planes;\n				uniform int u_invert;\n				uniform vec2 u_ires;\n				\n				void main() {\n					float zNear = u_camera_planes.x;\n					float zFar = u_camera_planes.y;\n					float depth = texture2D(u_texture, v_coord + u_ires*0.5).x * 2.0 - 1.0;\n					float f = zNear * (depth + 1.0) / (zFar + zNear - depth * (zFar - zNear));\n					if( u_invert == 1 )\n						f = 1.0 - f;\n					gl_FragColor = vec4(vec3(f),1.0);\n				}\n				";
      LiteGraph2.registerNodeType("texture/linear_depth", LGraphTextureLinearDepth);
      function LGraphTextureBlur() {
        this.addInput("Texture", "Texture");
        this.addInput("Iterations", "number");
        this.addInput("Intensity", "number");
        this.addOutput("Blurred", "Texture");
        this.properties = {
          intensity: 1,
          iterations: 1,
          preserve_aspect: false,
          scale: [1, 1],
          precision: LGraphTexture2.DEFAULT
        };
      }
      LGraphTextureBlur.title = "Blur";
      LGraphTextureBlur.desc = "Blur a texture";
      LGraphTextureBlur.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureBlur.max_iterations = 20;
      LGraphTextureBlur.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        var temp2 = this._final_texture;
        if (!temp2 || temp2.width != tex.width || temp2.height != tex.height || temp2.type != tex.type) {
          temp2 = this._final_texture = new GL.Texture(
            tex.width,
            tex.height,
            { type: tex.type, format: gl.RGBA, filter: gl.LINEAR }
          );
        }
        var iterations = this.properties.iterations;
        if (this.isInputConnected(1)) {
          iterations = this.getInputData(1);
          this.properties.iterations = iterations;
        }
        iterations = Math.min(
          Math.floor(iterations),
          LGraphTextureBlur.max_iterations
        );
        if (iterations == 0) {
          this.setOutputData(0, tex);
          return;
        }
        var intensity = this.properties.intensity;
        if (this.isInputConnected(2)) {
          intensity = this.getInputData(2);
          this.properties.intensity = intensity;
        }
        var aspect = LiteGraph2.camera_aspect;
        if (!aspect && window.gl !== void 0) {
          aspect = gl.canvas.height / gl.canvas.width;
        }
        if (!aspect) {
          aspect = 1;
        }
        aspect = this.properties.preserve_aspect ? aspect : 1;
        var scale = this.properties.scale || [1, 1];
        tex.applyBlur(aspect * scale[0], scale[1], intensity, temp2);
        for (var i2 = 1; i2 < iterations; ++i2) {
          temp2.applyBlur(
            aspect * scale[0] * (i2 + 1),
            scale[1] * (i2 + 1),
            intensity
          );
        }
        this.setOutputData(0, temp2);
      };
      LiteGraph2.registerNodeType("texture/blur", LGraphTextureBlur);
      function FXGlow() {
        this.intensity = 0.5;
        this.persistence = 0.6;
        this.iterations = 8;
        this.threshold = 0.8;
        this.scale = 1;
        this.dirt_texture = null;
        this.dirt_factor = 0.5;
        this._textures = [];
        this._uniforms = {
          u_intensity: 1,
          u_texture: 0,
          u_glow_texture: 1,
          u_threshold: 0,
          u_texel_size: vec2.create()
        };
      }
      FXGlow.prototype.applyFX = function(tex, output_texture, glow_texture, average_texture) {
        var width2 = tex.width;
        var height = tex.height;
        var texture_info = {
          format: tex.format,
          type: tex.type,
          minFilter: GL.LINEAR,
          magFilter: GL.LINEAR,
          wrap: gl.CLAMP_TO_EDGE
        };
        var uniforms = this._uniforms;
        var textures = this._textures;
        var shader = FXGlow._cut_shader;
        if (!shader) {
          shader = FXGlow._cut_shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            FXGlow.cut_pixel_shader
          );
        }
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        uniforms.u_threshold = this.threshold;
        var currentDestination = textures[0] = GL.Texture.getTemporary(
          width2,
          height,
          texture_info
        );
        tex.blit(currentDestination, shader.uniforms(uniforms));
        var currentSource = currentDestination;
        var iterations = this.iterations;
        iterations = clamp(iterations, 1, 16) | 0;
        var texel_size = uniforms.u_texel_size;
        var intensity = this.intensity;
        uniforms.u_intensity = 1;
        uniforms.u_delta = this.scale;
        var shader = FXGlow._shader;
        if (!shader) {
          shader = FXGlow._shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            FXGlow.scale_pixel_shader
          );
        }
        var i2 = 1;
        for (; i2 < iterations; i2++) {
          width2 = width2 >> 1;
          if ((height | 0) > 1) {
            height = height >> 1;
          }
          if (width2 < 2) {
            break;
          }
          currentDestination = textures[i2] = GL.Texture.getTemporary(
            width2,
            height,
            texture_info
          );
          texel_size[0] = 1 / currentSource.width;
          texel_size[1] = 1 / currentSource.height;
          currentSource.blit(
            currentDestination,
            shader.uniforms(uniforms)
          );
          currentSource = currentDestination;
        }
        if (average_texture) {
          texel_size[0] = 1 / currentSource.width;
          texel_size[1] = 1 / currentSource.height;
          uniforms.u_intensity = intensity;
          uniforms.u_delta = 1;
          currentSource.blit(average_texture, shader.uniforms(uniforms));
        }
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        uniforms.u_intensity = this.persistence;
        uniforms.u_delta = 0.5;
        for (i2 -= 2; i2 >= 0; i2--) {
          currentDestination = textures[i2];
          textures[i2] = null;
          texel_size[0] = 1 / currentSource.width;
          texel_size[1] = 1 / currentSource.height;
          currentSource.blit(
            currentDestination,
            shader.uniforms(uniforms)
          );
          GL.Texture.releaseTemporary(currentSource);
          currentSource = currentDestination;
        }
        gl.disable(gl.BLEND);
        if (glow_texture) {
          currentSource.blit(glow_texture);
        }
        if (output_texture) {
          var final_texture = output_texture;
          var dirt_texture = this.dirt_texture;
          var dirt_factor = this.dirt_factor;
          uniforms.u_intensity = intensity;
          shader = dirt_texture ? FXGlow._dirt_final_shader : FXGlow._final_shader;
          if (!shader) {
            if (dirt_texture) {
              shader = FXGlow._dirt_final_shader = new GL.Shader(
                GL.Shader.SCREEN_VERTEX_SHADER,
                FXGlow.final_pixel_shader,
                { USE_DIRT: "" }
              );
            } else {
              shader = FXGlow._final_shader = new GL.Shader(
                GL.Shader.SCREEN_VERTEX_SHADER,
                FXGlow.final_pixel_shader
              );
            }
          }
          final_texture.drawTo(function() {
            tex.bind(0);
            currentSource.bind(1);
            if (dirt_texture) {
              shader.setUniform("u_dirt_factor", dirt_factor);
              shader.setUniform(
                "u_dirt_texture",
                dirt_texture.bind(2)
              );
            }
            shader.toViewport(uniforms);
          });
        }
        GL.Texture.releaseTemporary(currentSource);
      };
      FXGlow.cut_pixel_shader = "precision highp float;\n			varying vec2 v_coord;\n			uniform sampler2D u_texture;\n			uniform float u_threshold;\n			void main() {\n				gl_FragColor = max( texture2D( u_texture, v_coord ) - vec4( u_threshold ), vec4(0.0) );\n			}";
      FXGlow.scale_pixel_shader = "precision highp float;\n			varying vec2 v_coord;\n			uniform sampler2D u_texture;\n			uniform vec2 u_texel_size;\n			uniform float u_delta;\n			uniform float u_intensity;\n			\n			vec4 sampleBox(vec2 uv) {\n				vec4 o = u_texel_size.xyxy * vec2(-u_delta, u_delta).xxyy;\n				vec4 s = texture2D( u_texture, uv + o.xy ) + texture2D( u_texture, uv + o.zy) + texture2D( u_texture, uv + o.xw) + texture2D( u_texture, uv + o.zw);\n				return s * 0.25;\n			}\n			void main() {\n				gl_FragColor = u_intensity * sampleBox( v_coord );\n			}";
      FXGlow.final_pixel_shader = "precision highp float;\n			varying vec2 v_coord;\n			uniform sampler2D u_texture;\n			uniform sampler2D u_glow_texture;\n			#ifdef USE_DIRT\n				uniform sampler2D u_dirt_texture;\n			#endif\n			uniform vec2 u_texel_size;\n			uniform float u_delta;\n			uniform float u_intensity;\n			uniform float u_dirt_factor;\n			\n			vec4 sampleBox(vec2 uv) {\n				vec4 o = u_texel_size.xyxy * vec2(-u_delta, u_delta).xxyy;\n				vec4 s = texture2D( u_glow_texture, uv + o.xy ) + texture2D( u_glow_texture, uv + o.zy) + texture2D( u_glow_texture, uv + o.xw) + texture2D( u_glow_texture, uv + o.zw);\n				return s * 0.25;\n			}\n			void main() {\n				vec4 glow = sampleBox( v_coord );\n				#ifdef USE_DIRT\n					glow = mix( glow, glow * texture2D( u_dirt_texture, v_coord ), u_dirt_factor );\n				#endif\n				gl_FragColor = texture2D( u_texture, v_coord ) + u_intensity * glow;\n			}";
      function LGraphTextureGlow() {
        this.addInput("in", "Texture");
        this.addInput("dirt", "Texture");
        this.addOutput("out", "Texture");
        this.addOutput("glow", "Texture");
        this.properties = {
          enabled: true,
          intensity: 1,
          persistence: 0.99,
          iterations: 16,
          threshold: 0,
          scale: 1,
          dirt_factor: 0.5,
          precision: LGraphTexture2.DEFAULT
        };
        this.fx = new FXGlow();
      }
      LGraphTextureGlow.title = "Glow";
      LGraphTextureGlow.desc = "Filters a texture giving it a glow effect";
      LGraphTextureGlow.widgets_info = {
        iterations: {
          type: "number",
          min: 0,
          max: 16,
          step: 1,
          precision: 0
        },
        threshold: {
          type: "number",
          min: 0,
          max: 10,
          step: 0.01,
          precision: 2
        },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureGlow.prototype.onGetInputs = function() {
        return [
          ["enabled", "boolean"],
          ["threshold", "number"],
          ["intensity", "number"],
          ["persistence", "number"],
          ["iterations", "number"],
          ["dirt_factor", "number"]
        ];
      };
      LGraphTextureGlow.prototype.onGetOutputs = function() {
        return [["average", "Texture"]];
      };
      LGraphTextureGlow.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isAnyOutputConnected()) {
          return;
        }
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH || this.getInputOrProperty("enabled") === false) {
          this.setOutputData(0, tex);
          return;
        }
        tex.width;
        tex.height;
        var fx = this.fx;
        fx.threshold = this.getInputOrProperty("threshold");
        fx.iterations = this.getInputOrProperty("iterations");
        fx.intensity = this.getInputOrProperty("intensity");
        fx.persistence = this.getInputOrProperty("persistence");
        fx.dirt_texture = this.getInputData(1);
        fx.dirt_factor = this.getInputOrProperty("dirt_factor");
        fx.scale = this.properties.scale;
        var type = LGraphTexture2.getTextureType(this.properties.precision, tex);
        var average_texture = null;
        if (this.isOutputConnected(2)) {
          average_texture = this._average_texture;
          if (!average_texture || average_texture.type != tex.type || average_texture.format != tex.format) {
            average_texture = this._average_texture = new GL.Texture(
              1,
              1,
              {
                type: tex.type,
                format: tex.format,
                filter: gl.LINEAR
              }
            );
          }
        }
        var glow_texture = null;
        if (this.isOutputConnected(1)) {
          glow_texture = this._glow_texture;
          if (!glow_texture || glow_texture.width != tex.width || glow_texture.height != tex.height || glow_texture.type != type || glow_texture.format != tex.format) {
            glow_texture = this._glow_texture = new GL.Texture(
              tex.width,
              tex.height,
              { type, format: tex.format, filter: gl.LINEAR }
            );
          }
        }
        var final_texture = null;
        if (this.isOutputConnected(0)) {
          final_texture = this._final_texture;
          if (!final_texture || final_texture.width != tex.width || final_texture.height != tex.height || final_texture.type != type || final_texture.format != tex.format) {
            final_texture = this._final_texture = new GL.Texture(
              tex.width,
              tex.height,
              { type, format: tex.format, filter: gl.LINEAR }
            );
          }
        }
        fx.applyFX(tex, final_texture, glow_texture, average_texture);
        if (this.isOutputConnected(0))
          this.setOutputData(0, final_texture);
        if (this.isOutputConnected(1))
          this.setOutputData(1, average_texture);
        if (this.isOutputConnected(2))
          this.setOutputData(2, glow_texture);
      };
      LiteGraph2.registerNodeType("texture/glow", LGraphTextureGlow);
      function LGraphTextureKuwaharaFilter() {
        this.addInput("Texture", "Texture");
        this.addOutput("Filtered", "Texture");
        this.properties = { intensity: 1, radius: 5 };
      }
      LGraphTextureKuwaharaFilter.title = "Kuwahara Filter";
      LGraphTextureKuwaharaFilter.desc = "Filters a texture giving an artistic oil canvas painting";
      LGraphTextureKuwaharaFilter.max_radius = 10;
      LGraphTextureKuwaharaFilter._shaders = [];
      LGraphTextureKuwaharaFilter.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        var temp2 = this._temp_texture;
        if (!temp2 || temp2.width != tex.width || temp2.height != tex.height || temp2.type != tex.type) {
          this._temp_texture = new GL.Texture(tex.width, tex.height, {
            type: tex.type,
            format: gl.RGBA,
            filter: gl.LINEAR
          });
        }
        var radius = this.properties.radius;
        radius = Math.min(
          Math.floor(radius),
          LGraphTextureKuwaharaFilter.max_radius
        );
        if (radius == 0) {
          this.setOutputData(0, tex);
          return;
        }
        var intensity = this.properties.intensity;
        var aspect = LiteGraph2.camera_aspect;
        if (!aspect && window.gl !== void 0) {
          aspect = gl.canvas.height / gl.canvas.width;
        }
        if (!aspect) {
          aspect = 1;
        }
        aspect = this.properties.preserve_aspect ? aspect : 1;
        if (!LGraphTextureKuwaharaFilter._shaders[radius]) {
          LGraphTextureKuwaharaFilter._shaders[radius] = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureKuwaharaFilter.pixel_shader,
            { RADIUS: radius.toFixed(0) }
          );
        }
        var shader = LGraphTextureKuwaharaFilter._shaders[radius];
        var mesh = GL.Mesh.getScreenQuad();
        tex.bind(0);
        this._temp_texture.drawTo(function() {
          shader.uniforms({
            u_texture: 0,
            u_intensity: intensity,
            u_resolution: [tex.width, tex.height],
            u_iResolution: [1 / tex.width, 1 / tex.height]
          }).draw(mesh);
        });
        this.setOutputData(0, this._temp_texture);
      };
      LGraphTextureKuwaharaFilter.pixel_shader = "\n		precision highp float;\n		varying vec2 v_coord;\n		uniform sampler2D u_texture;\n		uniform float u_intensity;\n		uniform vec2 u_resolution;\n		uniform vec2 u_iResolution;\n		#ifndef RADIUS\n			#define RADIUS 7\n		#endif\n		void main() {\n		\n			const int radius = RADIUS;\n			vec2 fragCoord = v_coord;\n			vec2 src_size = u_iResolution;\n			vec2 uv = v_coord;\n			float n = float((radius + 1) * (radius + 1));\n			int i;\n			int j;\n			vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);\n			vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);\n			vec3 c;\n			\n			for (int j = -radius; j <= 0; ++j)  {\n				for (int i = -radius; i <= 0; ++i)  {\n					c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;\n					m0 += c;\n					s0 += c * c;\n				}\n			}\n			\n			for (int j = -radius; j <= 0; ++j)  {\n				for (int i = 0; i <= radius; ++i)  {\n					c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;\n					m1 += c;\n					s1 += c * c;\n				}\n			}\n			\n			for (int j = 0; j <= radius; ++j)  {\n				for (int i = 0; i <= radius; ++i)  {\n					c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;\n					m2 += c;\n					s2 += c * c;\n				}\n			}\n			\n			for (int j = 0; j <= radius; ++j)  {\n				for (int i = -radius; i <= 0; ++i)  {\n					c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;\n					m3 += c;\n					s3 += c * c;\n				}\n			}\n			\n			float min_sigma2 = 1e+2;\n			m0 /= n;\n			s0 = abs(s0 / n - m0 * m0);\n			\n			float sigma2 = s0.r + s0.g + s0.b;\n			if (sigma2 < min_sigma2) {\n				min_sigma2 = sigma2;\n				gl_FragColor = vec4(m0, 1.0);\n			}\n			\n			m1 /= n;\n			s1 = abs(s1 / n - m1 * m1);\n			\n			sigma2 = s1.r + s1.g + s1.b;\n			if (sigma2 < min_sigma2) {\n				min_sigma2 = sigma2;\n				gl_FragColor = vec4(m1, 1.0);\n			}\n			\n			m2 /= n;\n			s2 = abs(s2 / n - m2 * m2);\n			\n			sigma2 = s2.r + s2.g + s2.b;\n			if (sigma2 < min_sigma2) {\n				min_sigma2 = sigma2;\n				gl_FragColor = vec4(m2, 1.0);\n			}\n			\n			m3 /= n;\n			s3 = abs(s3 / n - m3 * m3);\n			\n			sigma2 = s3.r + s3.g + s3.b;\n			if (sigma2 < min_sigma2) {\n				min_sigma2 = sigma2;\n				gl_FragColor = vec4(m3, 1.0);\n			}\n		}\n		";
      LiteGraph2.registerNodeType(
        "texture/kuwahara",
        LGraphTextureKuwaharaFilter
      );
      function LGraphTextureXDoGFilter() {
        this.addInput("Texture", "Texture");
        this.addOutput("Filtered", "Texture");
        this.properties = {
          sigma: 1.4,
          k: 1.6,
          p: 21.7,
          epsilon: 79,
          phi: 0.017
        };
      }
      LGraphTextureXDoGFilter.title = "XDoG Filter";
      LGraphTextureXDoGFilter.desc = "Filters a texture giving an artistic ink style";
      LGraphTextureXDoGFilter.max_radius = 10;
      LGraphTextureXDoGFilter._shaders = [];
      LGraphTextureXDoGFilter.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        var temp2 = this._temp_texture;
        if (!temp2 || temp2.width != tex.width || temp2.height != tex.height || temp2.type != tex.type) {
          this._temp_texture = new GL.Texture(tex.width, tex.height, {
            type: tex.type,
            format: gl.RGBA,
            filter: gl.LINEAR
          });
        }
        if (!LGraphTextureXDoGFilter._xdog_shader) {
          LGraphTextureXDoGFilter._xdog_shader = new GL.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureXDoGFilter.xdog_pixel_shader
          );
        }
        var shader = LGraphTextureXDoGFilter._xdog_shader;
        var mesh = GL.Mesh.getScreenQuad();
        var sigma = this.properties.sigma;
        var k = this.properties.k;
        var p2 = this.properties.p;
        var epsilon = this.properties.epsilon;
        var phi = this.properties.phi;
        tex.bind(0);
        this._temp_texture.drawTo(function() {
          shader.uniforms({
            src: 0,
            sigma,
            k,
            p: p2,
            epsilon,
            phi,
            cvsWidth: tex.width,
            cvsHeight: tex.height
          }).draw(mesh);
        });
        this.setOutputData(0, this._temp_texture);
      };
      LGraphTextureXDoGFilter.xdog_pixel_shader = "\n		precision highp float;\n		uniform sampler2D src;\n\n		uniform float cvsHeight;\n		uniform float cvsWidth;\n\n		uniform float sigma;\n		uniform float k;\n		uniform float p;\n		uniform float epsilon;\n		uniform float phi;\n		varying vec2 v_coord;\n\n		float cosh(float val)\n		{\n			float tmp = exp(val);\n			float cosH = (tmp + 1.0 / tmp) / 2.0;\n			return cosH;\n		}\n\n		float tanh(float val)\n		{\n			float tmp = exp(val);\n			float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);\n			return tanH;\n		}\n\n		float sinh(float val)\n		{\n			float tmp = exp(val);\n			float sinH = (tmp - 1.0 / tmp) / 2.0;\n			return sinH;\n		}\n\n		void main(void){\n			vec3 destColor = vec3(0.0);\n			float tFrag = 1.0 / cvsHeight;\n			float sFrag = 1.0 / cvsWidth;\n			vec2 Frag = vec2(sFrag,tFrag);\n			vec2 uv = gl_FragCoord.st;\n			float twoSigmaESquared = 2.0 * sigma * sigma;\n			float twoSigmaRSquared = twoSigmaESquared * k * k;\n			int halfWidth = int(ceil( 1.0 * sigma * k ));\n\n			const int MAX_NUM_ITERATION = 99999;\n			vec2 sum = vec2(0.0);\n			vec2 norm = vec2(0.0);\n\n			for(int cnt=0;cnt<MAX_NUM_ITERATION;cnt++){\n				if(cnt > (2*halfWidth+1)*(2*halfWidth+1)){break;}\n				int i = int(cnt / (2*halfWidth+1)) - halfWidth;\n				int j = cnt - halfWidth - int(cnt / (2*halfWidth+1)) * (2*halfWidth+1);\n\n				float d = length(vec2(i,j));\n				vec2 kernel = vec2( exp( -d * d / twoSigmaESquared ), \n									exp( -d * d / twoSigmaRSquared ));\n\n				vec2 L = texture2D(src, (uv + vec2(i,j)) * Frag).xx;\n\n				norm += kernel;\n				sum += kernel * L;\n			}\n\n			sum /= norm;\n\n			float H = 100.0 * ((1.0 + p) * sum.x - p * sum.y);\n			float edge = ( H > epsilon )? 1.0 : 1.0 + tanh( phi * (H - epsilon));\n			destColor = vec3(edge);\n			gl_FragColor = vec4(destColor, 1.0);\n		}";
      LiteGraph2.registerNodeType("texture/xDoG", LGraphTextureXDoGFilter);
      function LGraphTextureWebcam() {
        this.addOutput("Webcam", "Texture");
        this.properties = { texture_name: "", facingMode: "user" };
        this.boxcolor = "black";
        this.version = 0;
      }
      LGraphTextureWebcam.title = "Webcam";
      LGraphTextureWebcam.desc = "Webcam texture";
      LGraphTextureWebcam.is_webcam_open = false;
      LGraphTextureWebcam.prototype.openStream = function() {
        if (!navigator.getUserMedia) {
          return;
        }
        this._waiting_confirmation = true;
        var constraints = {
          audio: false,
          video: { facingMode: this.properties.facingMode }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(this.streamReady.bind(this)).catch(onFailSoHard);
        var that2 = this;
        function onFailSoHard(e) {
          LGraphTextureWebcam.is_webcam_open = false;
          console.log("Webcam rejected", e);
          that2._webcam_stream = false;
          that2.boxcolor = "red";
          that2.trigger("stream_error");
        }
      };
      LGraphTextureWebcam.prototype.closeStream = function() {
        if (this._webcam_stream) {
          var tracks = this._webcam_stream.getTracks();
          if (tracks.length) {
            for (var i2 = 0; i2 < tracks.length; ++i2) {
              tracks[i2].stop();
            }
          }
          LGraphTextureWebcam.is_webcam_open = false;
          this._webcam_stream = null;
          this._video = null;
          this.boxcolor = "black";
          this.trigger("stream_closed");
        }
      };
      LGraphTextureWebcam.prototype.streamReady = function(localMediaStream) {
        this._webcam_stream = localMediaStream;
        this.boxcolor = "green";
        var video = this._video;
        if (!video) {
          video = document.createElement("video");
          video.autoplay = true;
          video.srcObject = localMediaStream;
          this._video = video;
          video.onloadedmetadata = function(e) {
            LGraphTextureWebcam.is_webcam_open = true;
            console.log(e);
          };
        }
        this.trigger("stream_ready", video);
      };
      LGraphTextureWebcam.prototype.onPropertyChanged = function(name, value) {
        if (name == "facingMode") {
          this.properties.facingMode = value;
          this.closeStream();
          this.openStream();
        }
      };
      LGraphTextureWebcam.prototype.onRemoved = function() {
        if (!this._webcam_stream) {
          return;
        }
        var tracks = this._webcam_stream.getTracks();
        if (tracks.length) {
          for (var i2 = 0; i2 < tracks.length; ++i2) {
            tracks[i2].stop();
          }
        }
        this._webcam_stream = null;
        this._video = null;
      };
      LGraphTextureWebcam.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed || this.size[1] <= 20) {
          return;
        }
        if (!this._video) {
          return;
        }
        ctx.save();
        if (!ctx.webgl) {
          ctx.drawImage(this._video, 0, 0, this.size[0], this.size[1]);
        } else {
          if (this._video_texture) {
            ctx.drawImage(
              this._video_texture,
              0,
              0,
              this.size[0],
              this.size[1]
            );
          }
        }
        ctx.restore();
      };
      LGraphTextureWebcam.prototype.onExecute = function() {
        if (this._webcam_stream == null && !this._waiting_confirmation) {
          this.openStream();
        }
        if (!this._video || !this._video.videoWidth) {
          return;
        }
        var width2 = this._video.videoWidth;
        var height = this._video.videoHeight;
        var temp2 = this._video_texture;
        if (!temp2 || temp2.width != width2 || temp2.height != height) {
          this._video_texture = new GL.Texture(width2, height, {
            format: gl.RGB,
            filter: gl.LINEAR
          });
        }
        this._video_texture.uploadImage(this._video);
        this._video_texture.version = ++this.version;
        if (this.properties.texture_name) {
          var container = LGraphTexture2.getTexturesContainer();
          container[this.properties.texture_name] = this._video_texture;
        }
        this.setOutputData(0, this._video_texture);
        for (var i2 = 1; i2 < this.outputs.length; ++i2) {
          if (!this.outputs[i2]) {
            continue;
          }
          switch (this.outputs[i2].name) {
            case "width":
              this.setOutputData(i2, this._video.videoWidth);
              break;
            case "height":
              this.setOutputData(i2, this._video.videoHeight);
              break;
          }
        }
      };
      LGraphTextureWebcam.prototype.onGetOutputs = function() {
        return [
          ["width", "number"],
          ["height", "number"],
          ["stream_ready", LiteGraph2.EVENT],
          ["stream_closed", LiteGraph2.EVENT],
          ["stream_error", LiteGraph2.EVENT]
        ];
      };
      LiteGraph2.registerNodeType("texture/webcam", LGraphTextureWebcam);
      function LGraphLensFX() {
        this.addInput("in", "Texture");
        this.addInput("f", "number");
        this.addOutput("out", "Texture");
        this.properties = {
          enabled: true,
          factor: 1,
          precision: LGraphTexture2.LOW
        };
        this._uniforms = { u_texture: 0, u_factor: 1 };
      }
      LGraphLensFX.title = "Lens FX";
      LGraphLensFX.desc = "distortion and chromatic aberration";
      LGraphLensFX.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphLensFX.prototype.onGetInputs = function() {
        return [["enabled", "boolean"]];
      };
      LGraphLensFX.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH || this.getInputOrProperty("enabled") === false) {
          this.setOutputData(0, tex);
          return;
        }
        var temp2 = this._temp_texture;
        if (!temp2 || temp2.width != tex.width || temp2.height != tex.height || temp2.type != tex.type) {
          temp2 = this._temp_texture = new GL.Texture(
            tex.width,
            tex.height,
            { type: tex.type, format: gl.RGBA, filter: gl.LINEAR }
          );
        }
        var shader = LGraphLensFX._shader;
        if (!shader) {
          shader = LGraphLensFX._shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphLensFX.pixel_shader
          );
        }
        var factor = this.getInputData(1);
        if (factor == null) {
          factor = this.properties.factor;
        }
        var uniforms = this._uniforms;
        uniforms.u_factor = factor;
        gl.disable(gl.DEPTH_TEST);
        temp2.drawTo(function() {
          tex.bind(0);
          shader.uniforms(uniforms).draw(GL.Mesh.getScreenQuad());
        });
        this.setOutputData(0, temp2);
      };
      LGraphLensFX.pixel_shader = "precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform float u_factor;\n				vec2 barrelDistortion(vec2 coord, float amt) {\n					vec2 cc = coord - 0.5;\n					float dist = dot(cc, cc);\n					return coord + cc * dist * amt;\n				}\n				\n				float sat( float t )\n				{\n					return clamp( t, 0.0, 1.0 );\n				}\n				\n				float linterp( float t ) {\n					return sat( 1.0 - abs( 2.0*t - 1.0 ) );\n				}\n				\n				float remap( float t, float a, float b ) {\n					return sat( (t - a) / (b - a) );\n				}\n				\n				vec4 spectrum_offset( float t ) {\n					vec4 ret;\n					float lo = step(t,0.5);\n					float hi = 1.0-lo;\n					float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );\n					ret = vec4(lo,1.0,hi, 1.) * vec4(1.0-w, w, 1.0-w, 1.);\n				\n					return pow( ret, vec4(1.0/2.2) );\n				}\n				\n				const float max_distort = 2.2;\n				const int num_iter = 12;\n				const float reci_num_iter_f = 1.0 / float(num_iter);\n				\n				void main()\n				{	\n					vec2 uv=v_coord;\n					vec4 sumcol = vec4(0.0);\n					vec4 sumw = vec4(0.0);	\n					for ( int i=0; i<num_iter;++i )\n					{\n						float t = float(i) * reci_num_iter_f;\n						vec4 w = spectrum_offset( t );\n						sumw += w;\n						sumcol += w * texture2D( u_texture, barrelDistortion(uv, .6 * max_distort*t * u_factor ) );\n					}\n					gl_FragColor = sumcol / sumw;\n				}";
      LiteGraph2.registerNodeType("texture/lensfx", LGraphLensFX);
      function LGraphTextureFromData() {
        this.addInput("in", "");
        this.properties = { precision: LGraphTexture2.LOW, width: 0, height: 0, channels: 1 };
        this.addOutput("out", "Texture");
      }
      LGraphTextureFromData.title = "Data->Tex";
      LGraphTextureFromData.desc = "Generates or applies a curve to a texture";
      LGraphTextureFromData.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureFromData.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var data = this.getInputData(0);
        if (!data)
          return;
        var channels = this.properties.channels;
        var w2 = this.properties.width;
        var h = this.properties.height;
        if (!w2 || !h) {
          w2 = Math.floor(data.length / channels);
          h = 1;
        }
        var format = gl.RGBA;
        if (channels == 3)
          format = gl.RGB;
        else if (channels == 1)
          format = gl.LUMINANCE;
        var temp2 = this._temp_texture;
        var type = LGraphTexture2.getTextureType(this.properties.precision);
        if (!temp2 || temp2.width != w2 || temp2.height != h || temp2.type != type) {
          temp2 = this._temp_texture = new GL.Texture(w2, h, { type, format, filter: gl.LINEAR });
        }
        temp2.uploadData(data);
        this.setOutputData(0, temp2);
      };
      LiteGraph2.registerNodeType("texture/fromdata", LGraphTextureFromData);
      function LGraphTextureCurve() {
        this.addInput("in", "Texture");
        this.addOutput("out", "Texture");
        this.properties = { precision: LGraphTexture2.LOW, split_channels: false };
        this._values = new Uint8Array(256 * 4);
        this._values.fill(255);
        this._curve_texture = null;
        this._uniforms = { u_texture: 0, u_curve: 1, u_range: 1 };
        this._must_update = true;
        this._points = {
          RGB: [[0, 0], [1, 1]],
          R: [[0, 0], [1, 1]],
          G: [[0, 0], [1, 1]],
          B: [[0, 0], [1, 1]]
        };
        this.curve_editor = null;
        this.addWidget("toggle", "Split Channels", false, "split_channels");
        this.addWidget("combo", "Channel", "RGB", { values: ["RGB", "R", "G", "B"] });
        this.curve_offset = 68;
        this.size = [240, 160];
      }
      LGraphTextureCurve.title = "Curve";
      LGraphTextureCurve.desc = "Generates or applies a curve to a texture";
      LGraphTextureCurve.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureCurve.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var tex = this.getInputData(0);
        var temp2 = this._temp_texture;
        if (!tex) {
          if (this._must_update || !this._curve_texture)
            this.updateCurve();
          this.setOutputData(0, this._curve_texture);
          return;
        }
        var type = LGraphTexture2.getTextureType(this.properties.precision, tex);
        if (!temp2 || temp2.type != type || temp2.width != tex.width || temp2.height != tex.height || temp2.format != tex.format)
          temp2 = this._temp_texture = new GL.Texture(tex.width, tex.height, { type, format: tex.format, filter: gl.LINEAR });
        var shader = LGraphTextureCurve._shader;
        if (!shader) {
          shader = LGraphTextureCurve._shader = new GL.Shader(GL.Shader.SCREEN_VERTEX_SHADER, LGraphTextureCurve.pixel_shader);
        }
        if (this._must_update || !this._curve_texture)
          this.updateCurve();
        var uniforms = this._uniforms;
        var curve_texture = this._curve_texture;
        temp2.drawTo(function() {
          gl.disable(gl.DEPTH_TEST);
          tex.bind(0);
          curve_texture.bind(1);
          shader.uniforms(uniforms).draw(GL.Mesh.getScreenQuad());
        });
        this.setOutputData(0, temp2);
      };
      LGraphTextureCurve.prototype.sampleCurve = function(f, points) {
        var points = points || this._points.RGB;
        if (!points)
          return;
        for (var i2 = 0; i2 < points.length - 1; ++i2) {
          var p2 = points[i2];
          var pn = points[i2 + 1];
          if (pn[0] < f)
            continue;
          var r = pn[0] - p2[0];
          if (Math.abs(r) < 1e-5)
            return p2[1];
          var local_f = (f - p2[0]) / r;
          return p2[1] * (1 - local_f) + pn[1] * local_f;
        }
        return 0;
      };
      LGraphTextureCurve.prototype.updateCurve = function() {
        var values2 = this._values;
        var num = values2.length / 4;
        var split = this.properties.split_channels;
        for (var i2 = 0; i2 < num; ++i2) {
          if (split) {
            values2[i2 * 4] = clamp(this.sampleCurve(i2 / num, this._points.R) * 255, 0, 255);
            values2[i2 * 4 + 1] = clamp(this.sampleCurve(i2 / num, this._points.G) * 255, 0, 255);
            values2[i2 * 4 + 2] = clamp(this.sampleCurve(i2 / num, this._points.B) * 255, 0, 255);
          } else {
            var v2 = this.sampleCurve(i2 / num);
            values2[i2 * 4] = values2[i2 * 4 + 1] = values2[i2 * 4 + 2] = clamp(v2 * 255, 0, 255);
          }
          values2[i2 * 4 + 3] = 255;
        }
        if (!this._curve_texture)
          this._curve_texture = new GL.Texture(256, 1, { format: gl.RGBA, magFilter: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE });
        this._curve_texture.uploadData(values2, null, true);
      };
      LGraphTextureCurve.prototype.onSerialize = function(o) {
        var curves = {};
        for (var i2 in this._points)
          curves[i2] = this._points[i2].concat();
        o.curves = curves;
      };
      LGraphTextureCurve.prototype.onConfigure = function(o) {
        this._points = o.curves;
        if (this.curve_editor)
          curve_editor.points = this._points;
        this._must_update = true;
      };
      LGraphTextureCurve.prototype.onMouseDown = function(e, localpos, graphcanvas) {
        if (this.curve_editor) {
          var r = this.curve_editor.onMouseDown([localpos[0], localpos[1] - this.curve_offset], graphcanvas);
          if (r)
            this.captureInput(true);
          return r;
        }
      };
      LGraphTextureCurve.prototype.onMouseMove = function(e, localpos, graphcanvas) {
        if (this.curve_editor)
          return this.curve_editor.onMouseMove([localpos[0], localpos[1] - this.curve_offset], graphcanvas);
      };
      LGraphTextureCurve.prototype.onMouseUp = function(e, localpos, graphcanvas) {
        if (this.curve_editor)
          return this.curve_editor.onMouseUp([localpos[0], localpos[1] - this.curve_offset], graphcanvas);
        this.captureInput(false);
      };
      LGraphTextureCurve.channel_line_colors = { "RGB": "#666", "R": "#F33", "G": "#3F3", "B": "#33F" };
      LGraphTextureCurve.prototype.onDrawBackground = function(ctx, graphcanvas) {
        if (this.flags.collapsed)
          return;
        if (!this.curve_editor)
          this.curve_editor = new LiteGraph2.CurveEditor(this._points.R);
        ctx.save();
        ctx.translate(0, this.curve_offset);
        var channel = this.widgets[1].value;
        if (this.properties.split_channels) {
          if (channel == "RGB") {
            this.widgets[1].value = channel = "R";
            this.widgets[1].disabled = false;
          }
          this.curve_editor.points = this._points.R;
          this.curve_editor.draw(ctx, [this.size[0], this.size[1] - this.curve_offset], graphcanvas, "#111", LGraphTextureCurve.channel_line_colors.R, true);
          ctx.globalCompositeOperation = "lighten";
          this.curve_editor.points = this._points.G;
          this.curve_editor.draw(ctx, [this.size[0], this.size[1] - this.curve_offset], graphcanvas, null, LGraphTextureCurve.channel_line_colors.G, true);
          this.curve_editor.points = this._points.B;
          this.curve_editor.draw(ctx, [this.size[0], this.size[1] - this.curve_offset], graphcanvas, null, LGraphTextureCurve.channel_line_colors.B, true);
          ctx.globalCompositeOperation = "source-over";
        } else {
          this.widgets[1].value = channel = "RGB";
          this.widgets[1].disabled = true;
        }
        this.curve_editor.points = this._points[channel];
        this.curve_editor.draw(ctx, [this.size[0], this.size[1] - this.curve_offset], graphcanvas, this.properties.split_channels ? null : "#111", LGraphTextureCurve.channel_line_colors[channel]);
        ctx.restore();
      };
      LGraphTextureCurve.pixel_shader = "precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform sampler2D u_curve;\n				uniform float u_range;\n				\n				void main() {\n					vec4 color = texture2D( u_texture, v_coord ) * u_range;\n					color.x = texture2D( u_curve, vec2( color.x, 0.5 ) ).x;\n					color.y = texture2D( u_curve, vec2( color.y, 0.5 ) ).y;\n					color.z = texture2D( u_curve, vec2( color.z, 0.5 ) ).z;\n					//color.w = texture2D( u_curve, vec2( color.w, 0.5 ) ).w;\n					gl_FragColor = color;\n				}";
      LiteGraph2.registerNodeType("texture/curve", LGraphTextureCurve);
      function LGraphExposition() {
        this.addInput("in", "Texture");
        this.addInput("exp", "number");
        this.addOutput("out", "Texture");
        this.properties = { exposition: 1, precision: LGraphTexture2.LOW };
        this._uniforms = { u_texture: 0, u_exposition: 1 };
      }
      LGraphExposition.title = "Exposition";
      LGraphExposition.desc = "Controls texture exposition";
      LGraphExposition.widgets_info = {
        exposition: { widget: "slider", min: 0, max: 3 },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphExposition.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        var temp2 = this._temp_texture;
        if (!temp2 || temp2.width != tex.width || temp2.height != tex.height || temp2.type != tex.type) {
          temp2 = this._temp_texture = new GL.Texture(
            tex.width,
            tex.height,
            { type: tex.type, format: gl.RGBA, filter: gl.LINEAR }
          );
        }
        var shader = LGraphExposition._shader;
        if (!shader) {
          shader = LGraphExposition._shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphExposition.pixel_shader
          );
        }
        this.properties.exposition;
        var exp_input = this.getInputData(1);
        if (exp_input != null) {
          this.properties.exposition = exp_input;
        }
        var uniforms = this._uniforms;
        temp2.drawTo(function() {
          gl.disable(gl.DEPTH_TEST);
          tex.bind(0);
          shader.uniforms(uniforms).draw(GL.Mesh.getScreenQuad());
        });
        this.setOutputData(0, temp2);
      };
      LGraphExposition.pixel_shader = "precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform float u_exposition;\n				\n				void main() {\n					vec4 color = texture2D( u_texture, v_coord );\n					gl_FragColor = vec4( color.xyz * u_exposition, color.a );\n				}";
      LiteGraph2.registerNodeType("texture/exposition", LGraphExposition);
      function LGraphToneMapping() {
        this.addInput("in", "Texture");
        this.addInput("avg", "number,Texture");
        this.addOutput("out", "Texture");
        this.properties = {
          enabled: true,
          scale: 1,
          gamma: 1,
          average_lum: 1,
          lum_white: 1,
          precision: LGraphTexture2.LOW
        };
        this._uniforms = {
          u_texture: 0,
          u_lumwhite2: 1,
          u_igamma: 1,
          u_scale: 1,
          u_average_lum: 1
        };
      }
      LGraphToneMapping.title = "Tone Mapping";
      LGraphToneMapping.desc = "Applies Tone Mapping to convert from high to low";
      LGraphToneMapping.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphToneMapping.prototype.onGetInputs = function() {
        return [["enabled", "boolean"]];
      };
      LGraphToneMapping.prototype.onExecute = function() {
        var tex = this.getInputData(0);
        if (!tex) {
          return;
        }
        if (!this.isOutputConnected(0)) {
          return;
        }
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH || this.getInputOrProperty("enabled") === false) {
          this.setOutputData(0, tex);
          return;
        }
        var temp2 = this._temp_texture;
        if (!temp2 || temp2.width != tex.width || temp2.height != tex.height || temp2.type != tex.type) {
          temp2 = this._temp_texture = new GL.Texture(
            tex.width,
            tex.height,
            { type: tex.type, format: gl.RGBA, filter: gl.LINEAR }
          );
        }
        var avg = this.getInputData(1);
        if (avg == null) {
          avg = this.properties.average_lum;
        }
        var uniforms = this._uniforms;
        var shader = null;
        if (avg.constructor === Number) {
          this.properties.average_lum = avg;
          uniforms.u_average_lum = this.properties.average_lum;
          shader = LGraphToneMapping._shader;
          if (!shader) {
            shader = LGraphToneMapping._shader = new GL.Shader(
              GL.Shader.SCREEN_VERTEX_SHADER,
              LGraphToneMapping.pixel_shader
            );
          }
        } else if (avg.constructor === GL.Texture) {
          uniforms.u_average_texture = avg.bind(1);
          shader = LGraphToneMapping._shader_texture;
          if (!shader) {
            shader = LGraphToneMapping._shader_texture = new GL.Shader(
              GL.Shader.SCREEN_VERTEX_SHADER,
              LGraphToneMapping.pixel_shader,
              { AVG_TEXTURE: "" }
            );
          }
        }
        uniforms.u_lumwhite2 = this.properties.lum_white * this.properties.lum_white;
        uniforms.u_scale = this.properties.scale;
        uniforms.u_igamma = 1 / this.properties.gamma;
        gl.disable(gl.DEPTH_TEST);
        temp2.drawTo(function() {
          tex.bind(0);
          shader.uniforms(uniforms).draw(GL.Mesh.getScreenQuad());
        });
        this.setOutputData(0, this._temp_texture);
      };
      LGraphToneMapping.pixel_shader = "precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform float u_scale;\n				#ifdef AVG_TEXTURE\n					uniform sampler2D u_average_texture;\n				#else\n					uniform float u_average_lum;\n				#endif\n				uniform float u_lumwhite2;\n				uniform float u_igamma;\n				vec3 RGB2xyY (vec3 rgb)\n				{\n					 const mat3 RGB2XYZ = mat3(0.4124, 0.3576, 0.1805,\n											   0.2126, 0.7152, 0.0722,\n											   0.0193, 0.1192, 0.9505);\n					vec3 XYZ = RGB2XYZ * rgb;\n					\n					float f = (XYZ.x + XYZ.y + XYZ.z);\n					return vec3(XYZ.x / f,\n								XYZ.y / f,\n								XYZ.y);\n				}\n				\n				void main() {\n					vec4 color = texture2D( u_texture, v_coord );\n					vec3 rgb = color.xyz;\n					float average_lum = 0.0;\n					#ifdef AVG_TEXTURE\n						vec3 pixel = texture2D(u_average_texture,vec2(0.5)).xyz;\n						average_lum = (pixel.x + pixel.y + pixel.z) / 3.0;\n					#else\n						average_lum = u_average_lum;\n					#endif\n					//Ld - this part of the code is the same for both versions\n					float lum = dot(rgb, vec3(0.2126, 0.7152, 0.0722));\n					float L = (u_scale / average_lum) * lum;\n					float Ld = (L * (1.0 + L / u_lumwhite2)) / (1.0 + L);\n					//first\n					//vec3 xyY = RGB2xyY(rgb);\n					//xyY.z *= Ld;\n					//rgb = xyYtoRGB(xyY);\n					//second\n					rgb = (rgb / lum) * Ld;\n					rgb = max(rgb,vec3(0.001));\n					rgb = pow( rgb, vec3( u_igamma ) );\n					gl_FragColor = vec4( rgb, color.a );\n				}";
      LiteGraph2.registerNodeType("texture/tonemapping", LGraphToneMapping);
      function LGraphTexturePerlin() {
        this.addOutput("out", "Texture");
        this.properties = {
          width: 512,
          height: 512,
          seed: 0,
          persistence: 0.1,
          octaves: 8,
          scale: 1,
          offset: [0, 0],
          amplitude: 1,
          precision: LGraphTexture2.DEFAULT
        };
        this._key = 0;
        this._texture = null;
        this._uniforms = {
          u_persistence: 0.1,
          u_seed: 0,
          u_offset: vec2.create(),
          u_scale: 1,
          u_viewport: vec2.create()
        };
      }
      LGraphTexturePerlin.title = "Perlin";
      LGraphTexturePerlin.desc = "Generates a perlin noise texture";
      LGraphTexturePerlin.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES },
        width: { type: "number", precision: 0, step: 1 },
        height: { type: "number", precision: 0, step: 1 },
        octaves: { type: "number", precision: 0, step: 1, min: 1, max: 50 }
      };
      LGraphTexturePerlin.prototype.onGetInputs = function() {
        return [
          ["seed", "number"],
          ["persistence", "number"],
          ["octaves", "number"],
          ["scale", "number"],
          ["amplitude", "number"],
          ["offset", "vec2"]
        ];
      };
      LGraphTexturePerlin.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var w2 = this.properties.width | 0;
        var h = this.properties.height | 0;
        if (w2 == 0) {
          w2 = gl.viewport_data[2];
        }
        if (h == 0) {
          h = gl.viewport_data[3];
        }
        var type = LGraphTexture2.getTextureType(this.properties.precision);
        var temp2 = this._texture;
        if (!temp2 || temp2.width != w2 || temp2.height != h || temp2.type != type) {
          temp2 = this._texture = new GL.Texture(w2, h, {
            type,
            format: gl.RGB,
            filter: gl.LINEAR
          });
        }
        var persistence = this.getInputOrProperty("persistence");
        var octaves = this.getInputOrProperty("octaves");
        var offset = this.getInputOrProperty("offset");
        var scale = this.getInputOrProperty("scale");
        var amplitude = this.getInputOrProperty("amplitude");
        var seed = this.getInputOrProperty("seed");
        var key = "" + w2 + h + type + persistence + octaves + scale + seed + offset[0] + offset[1] + amplitude;
        if (key == this._key) {
          this.setOutputData(0, temp2);
          return;
        }
        this._key = key;
        var uniforms = this._uniforms;
        uniforms.u_persistence = persistence;
        uniforms.u_octaves = octaves;
        uniforms.u_offset.set(offset);
        uniforms.u_scale = scale;
        uniforms.u_amplitude = amplitude;
        uniforms.u_seed = seed * 128;
        uniforms.u_viewport[0] = w2;
        uniforms.u_viewport[1] = h;
        var shader = LGraphTexturePerlin._shader;
        if (!shader) {
          shader = LGraphTexturePerlin._shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphTexturePerlin.pixel_shader
          );
        }
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        temp2.drawTo(function() {
          shader.uniforms(uniforms).draw(GL.Mesh.getScreenQuad());
        });
        this.setOutputData(0, temp2);
      };
      LGraphTexturePerlin.pixel_shader = "precision highp float;\n				varying vec2 v_coord;\n				uniform vec2 u_offset;\n				uniform float u_scale;\n				uniform float u_persistence;\n				uniform int u_octaves;\n				uniform float u_amplitude;\n				uniform vec2 u_viewport;\n				uniform float u_seed;\n				#define M_PI 3.14159265358979323846\n				\n				float rand(vec2 c){	return fract(sin(dot(c.xy ,vec2( 12.9898 + u_seed,78.233 + u_seed))) * 43758.5453); }\n				\n				float noise(vec2 p, float freq ){\n					float unit = u_viewport.x/freq;\n					vec2 ij = floor(p/unit);\n					vec2 xy = mod(p,unit)/unit;\n					//xy = 3.*xy*xy-2.*xy*xy*xy;\n					xy = .5*(1.-cos(M_PI*xy));\n					float a = rand((ij+vec2(0.,0.)));\n					float b = rand((ij+vec2(1.,0.)));\n					float c = rand((ij+vec2(0.,1.)));\n					float d = rand((ij+vec2(1.,1.)));\n					float x1 = mix(a, b, xy.x);\n					float x2 = mix(c, d, xy.x);\n					return mix(x1, x2, xy.y);\n				}\n				\n				float pNoise(vec2 p, int res){\n					float persistance = u_persistence;\n					float n = 0.;\n					float normK = 0.;\n					float f = 4.;\n					float amp = 1.0;\n					int iCount = 0;\n					for (int i = 0; i<50; i++){\n						n+=amp*noise(p, f);\n						f*=2.;\n						normK+=amp;\n						amp*=persistance;\n						if (iCount >= res)\n							break;\n						iCount++;\n					}\n					float nf = n/normK;\n					return nf*nf*nf*nf;\n				}\n				void main() {\n					vec2 uv = v_coord * u_scale * u_viewport + u_offset * u_scale;\n					vec4 color = vec4( pNoise( uv, u_octaves ) * u_amplitude );\n					gl_FragColor = color;\n				}";
      LiteGraph2.registerNodeType("texture/perlin", LGraphTexturePerlin);
      function LGraphTextureCanvas2D() {
        this.addInput("v");
        this.addOutput("out", "Texture");
        this.properties = {
          code: LGraphTextureCanvas2D.default_code,
          width: 512,
          height: 512,
          clear: true,
          precision: LGraphTexture2.DEFAULT,
          use_html_canvas: false
        };
        this._func = null;
        this._temp_texture = null;
        this.compileCode();
      }
      LGraphTextureCanvas2D.title = "Canvas2D";
      LGraphTextureCanvas2D.desc = "Executes Canvas2D code inside a texture or the viewport.";
      LGraphTextureCanvas2D.help = "Set width and height to 0 to match viewport size.";
      LGraphTextureCanvas2D.default_code = "//vars: canvas,ctx,time\nctx.fillStyle='red';\nctx.fillRect(0,0,50,50);\n";
      LGraphTextureCanvas2D.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES },
        code: { type: "code" },
        width: { type: "number", precision: 0, step: 1 },
        height: { type: "number", precision: 0, step: 1 }
      };
      LGraphTextureCanvas2D.prototype.onPropertyChanged = function(name, value) {
        if (name == "code")
          this.compileCode(value);
      };
      LGraphTextureCanvas2D.prototype.compileCode = function(code) {
        this._func = null;
        if (!LiteGraph2.allow_scripts)
          return;
        try {
          this._func = new Function("canvas", "ctx", "time", "script", "v", code);
          this.boxcolor = "#00FF00";
        } catch (err) {
          this.boxcolor = "#FF0000";
          console.error("Error parsing script");
          console.error(err);
        }
      };
      LGraphTextureCanvas2D.prototype.onExecute = function() {
        var func = this._func;
        if (!func || !this.isOutputConnected(0)) {
          return;
        }
        this.executeDraw(func);
      };
      LGraphTextureCanvas2D.prototype.executeDraw = function(func_context) {
        var width2 = this.properties.width || gl.canvas.width;
        var height = this.properties.height || gl.canvas.height;
        var temp2 = this._temp_texture;
        var type = LGraphTexture2.getTextureType(this.properties.precision);
        if (!temp2 || temp2.width != width2 || temp2.height != height || temp2.type != type) {
          temp2 = this._temp_texture = new GL.Texture(width2, height, {
            format: gl.RGBA,
            filter: gl.LINEAR,
            type
          });
        }
        var v2 = this.getInputData(0);
        var properties = this.properties;
        var that2 = this;
        var time = this.graph.getTime();
        var ctx = gl;
        var canvas = gl.canvas;
        if (this.properties.use_html_canvas || !global2.enableWebGLCanvas) {
          if (!this._canvas) {
            canvas = this._canvas = createCanvas(width2.height);
            ctx = this._ctx = canvas.getContext("2d");
          } else {
            canvas = this._canvas;
            ctx = this._ctx;
          }
          canvas.width = width2;
          canvas.height = height;
        }
        if (ctx == gl)
          temp2.drawTo(function() {
            gl.start2D();
            if (properties.clear) {
              gl.clearColor(0, 0, 0, 0);
              gl.clear(gl.COLOR_BUFFER_BIT);
            }
            try {
              if (func_context.draw) {
                func_context.draw.call(that2, canvas, ctx, time, func_context, v2);
              } else {
                func_context.call(that2, canvas, ctx, time, func_context, v2);
              }
              that2.boxcolor = "#00FF00";
            } catch (err) {
              that2.boxcolor = "#FF0000";
              console.error("Error executing script");
              console.error(err);
            }
            gl.finish2D();
          });
        else {
          if (properties.clear)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          try {
            if (func_context.draw) {
              func_context.draw.call(this, canvas, ctx, time, func_context, v2);
            } else {
              func_context.call(this, canvas, ctx, time, func_context, v2);
            }
            this.boxcolor = "#00FF00";
          } catch (err) {
            this.boxcolor = "#FF0000";
            console.error("Error executing script");
            console.error(err);
          }
          temp2.uploadImage(canvas);
        }
        this.setOutputData(0, temp2);
      };
      LiteGraph2.registerNodeType("texture/canvas2D", LGraphTextureCanvas2D);
      function LGraphTextureMatte() {
        this.addInput("in", "Texture");
        this.addOutput("out", "Texture");
        this.properties = {
          key_color: vec3.fromValues(0, 1, 0),
          threshold: 0.8,
          slope: 0.2,
          precision: LGraphTexture2.DEFAULT
        };
      }
      LGraphTextureMatte.title = "Matte";
      LGraphTextureMatte.desc = "Extracts background";
      LGraphTextureMatte.widgets_info = {
        key_color: { widget: "color" },
        precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
      };
      LGraphTextureMatte.prototype.onExecute = function() {
        if (!this.isOutputConnected(0)) {
          return;
        }
        var tex = this.getInputData(0);
        if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
          this.setOutputData(0, tex);
          return;
        }
        if (!tex) {
          return;
        }
        this._tex = LGraphTexture2.getTargetTexture(
          tex,
          this._tex,
          this.properties.precision
        );
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        if (!this._uniforms) {
          this._uniforms = {
            u_texture: 0,
            u_key_color: this.properties.key_color,
            u_threshold: 1,
            u_slope: 1
          };
        }
        var uniforms = this._uniforms;
        var mesh = Mesh.getScreenQuad();
        var shader = LGraphTextureMatte._shader;
        if (!shader) {
          shader = LGraphTextureMatte._shader = new GL.Shader(
            GL.Shader.SCREEN_VERTEX_SHADER,
            LGraphTextureMatte.pixel_shader
          );
        }
        uniforms.u_key_color = this.properties.key_color;
        uniforms.u_threshold = this.properties.threshold;
        uniforms.u_slope = this.properties.slope;
        this._tex.drawTo(function() {
          tex.bind(0);
          shader.uniforms(uniforms).draw(mesh);
        });
        this.setOutputData(0, this._tex);
      };
      LGraphTextureMatte.pixel_shader = "precision highp float;\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				uniform vec3 u_key_color;\n				uniform float u_threshold;\n				uniform float u_slope;\n				\n				void main() {\n					vec3 color = texture2D( u_texture, v_coord ).xyz;\n					float diff = length( normalize(color) - normalize(u_key_color) );\n					float edge = u_threshold * (1.0 - u_slope);\n					float alpha = smoothstep( edge, u_threshold, diff);\n					gl_FragColor = vec4( color, alpha );\n				}";
      LiteGraph2.registerNodeType("texture/matte", LGraphTextureMatte);
      function LGraphCubemapToTexture2D() {
        this.addInput("in", "texture");
        this.addInput("yaw", "number");
        this.addOutput("out", "texture");
        this.properties = { yaw: 0 };
      }
      LGraphCubemapToTexture2D.title = "CubemapToTexture2D";
      LGraphCubemapToTexture2D.desc = "Transforms a CUBEMAP texture into a TEXTURE2D in Polar Representation";
      LGraphCubemapToTexture2D.prototype.onExecute = function() {
        if (!this.isOutputConnected(0))
          return;
        var tex = this.getInputData(0);
        if (!tex || tex.texture_type != GL.TEXTURE_CUBE_MAP)
          return;
        if (this._last_tex && (this._last_tex.height != tex.height || this._last_tex.type != tex.type))
          this._last_tex = null;
        var yaw = this.getInputOrProperty("yaw");
        this._last_tex = GL.Texture.cubemapToTexture2D(tex, tex.height, this._last_tex, true, yaw);
        this.setOutputData(0, this._last_tex);
      };
      LiteGraph2.registerNodeType("texture/cubemapToTexture2D", LGraphCubemapToTexture2D);
    })(litegraph);
    (function(global2) {
      if (typeof GL == "undefined")
        return;
      var LiteGraph2 = global2.LiteGraph;
      global2.LGraphCanvas;
      var SHADERNODES_COLOR = "#345";
      var LGShaders = LiteGraph2.Shaders = {};
      LGShaders.GLSL_types = ["float", "vec2", "vec3", "vec4", "mat3", "mat4", "sampler2D", "samplerCube"];
      var GLSL_types_const = LGShaders.GLSL_types_const = ["float", "vec2", "vec3", "vec4"];
      var GLSL_functions_desc = {
        "radians": "T radians(T degrees)",
        "degrees": "T degrees(T radians)",
        "sin": "T sin(T angle)",
        "cos": "T cos(T angle)",
        "tan": "T tan(T angle)",
        "asin": "T asin(T x)",
        "acos": "T acos(T x)",
        "atan": "T atan(T x)",
        "atan2": "T atan(T x,T y)",
        "pow": "T pow(T x,T y)",
        "exp": "T exp(T x)",
        "log": "T log(T x)",
        "exp2": "T exp2(T x)",
        "log2": "T log2(T x)",
        "sqrt": "T sqrt(T x)",
        "inversesqrt": "T inversesqrt(T x)",
        "abs": "T abs(T x)",
        "sign": "T sign(T x)",
        "floor": "T floor(T x)",
        "round": "T round(T x)",
        "ceil": "T ceil(T x)",
        "fract": "T fract(T x)",
        "mod": "T mod(T x,T y)",
        //"T mod(T x,float y)"
        "min": "T min(T x,T y)",
        "max": "T max(T x,T y)",
        "clamp": "T clamp(T x,T minVal = 0.0,T maxVal = 1.0)",
        "mix": "T mix(T x,T y,T a)",
        //"T mix(T x,T y,float a)"
        "step": "T step(T edge, T edge2, T x)",
        //"T step(float edge, T x)"
        "smoothstep": "T smoothstep(T edge, T edge2, T x)",
        //"T smoothstep(float edge, T x)"
        "length": "float length(T x)",
        "distance": "float distance(T p0, T p1)",
        "normalize": "T normalize(T x)",
        "dot": "float dot(T x,T y)",
        "cross": "vec3 cross(vec3 x,vec3 y)",
        "reflect": "vec3 reflect(vec3 V,vec3 N)",
        "refract": "vec3 refract(vec3 V,vec3 N, float IOR)"
      };
      var GLSL_functions = {};
      var GLSL_functions_name = [];
      parseGLSLDescriptions();
      LGShaders.ALL_TYPES = "float,vec2,vec3,vec4";
      function parseGLSLDescriptions() {
        GLSL_functions_name.length = 0;
        for (var i2 in GLSL_functions_desc) {
          var op = GLSL_functions_desc[i2];
          var index2 = op.indexOf(" ");
          var return_type = op.substr(0, index2);
          var index22 = op.indexOf("(", index2);
          var func_name = op.substr(index2, index22 - index2).trim();
          var params = op.substr(index22 + 1, op.length - index22 - 2).split(",");
          for (var j in params) {
            var p2 = params[j].split(" ").filter(function(a) {
              return a;
            });
            params[j] = { type: p2[0].trim(), name: p2[1].trim() };
            if (p2[2] == "=")
              params[j].value = p2[3].trim();
          }
          GLSL_functions[i2] = { return_type, func: func_name, params };
          GLSL_functions_name.push(func_name);
        }
      }
      function registerShaderNode(type, node_ctor) {
        node_ctor.color = SHADERNODES_COLOR;
        node_ctor.filter = "shader";
        node_ctor.prototype.clearDestination = function() {
          this.shader_destination = {};
        };
        node_ctor.prototype.propagateDestination = function propagateDestination(dest_name) {
          this.shader_destination[dest_name] = true;
          if (this.inputs)
            for (var i2 = 0; i2 < this.inputs.length; ++i2) {
              var origin_node = this.getInputNode(i2);
              if (origin_node)
                origin_node.propagateDestination(dest_name);
            }
        };
        if (!node_ctor.prototype.onPropertyChanged)
          node_ctor.prototype.onPropertyChanged = function() {
            if (this.graph)
              this.graph._version++;
          };
        LiteGraph2.registerNodeType("shader::" + type, node_ctor);
      }
      function getShaderNodeVarName(node2, name) {
        return "VAR_" + (name || "TEMP") + "_" + node2.id;
      }
      function getInputLinkID(node2, slot) {
        if (!node2.inputs)
          return null;
        var link = node2.getInputLink(slot);
        if (!link)
          return null;
        var origin_node = node2.graph.getNodeById(link.origin_id);
        if (!origin_node)
          return null;
        if (origin_node.getOutputVarName)
          return origin_node.getOutputVarName(link.origin_slot);
        return "link_" + origin_node.id + "_" + link.origin_slot;
      }
      function getOutputLinkID(node2, slot) {
        if (!node2.isOutputConnected(slot))
          return null;
        return "link_" + node2.id + "_" + slot;
      }
      LGShaders.registerShaderNode = registerShaderNode;
      LGShaders.getInputLinkID = getInputLinkID;
      LGShaders.getOutputLinkID = getOutputLinkID;
      LGShaders.getShaderNodeVarName = getShaderNodeVarName;
      LGShaders.parseGLSLDescriptions = parseGLSLDescriptions;
      var valueToGLSL = LiteGraph2.valueToGLSL = function valueToGLSL2(v2, type, precision) {
        var n = 5;
        if (precision != null)
          n = precision;
        if (!type) {
          if (v2.constructor === Number)
            type = "float";
          else if (v2.length) {
            switch (v2.length) {
              case 2:
                type = "vec2";
                break;
              case 3:
                type = "vec3";
                break;
              case 4:
                type = "vec4";
                break;
              case 9:
                type = "mat3";
                break;
              case 16:
                type = "mat4";
                break;
              default:
                throw "unknown type for glsl value size";
            }
          } else
            throw "unknown type for glsl value: " + v2.constructor;
        }
        switch (type) {
          case "float":
            return v2.toFixed(n);
          case "vec2":
            return "vec2(" + v2[0].toFixed(n) + "," + v2[1].toFixed(n) + ")";
          case "color3":
          case "vec3":
            return "vec3(" + v2[0].toFixed(n) + "," + v2[1].toFixed(n) + "," + v2[2].toFixed(n) + ")";
          case "color4":
          case "vec4":
            return "vec4(" + v2[0].toFixed(n) + "," + v2[1].toFixed(n) + "," + v2[2].toFixed(n) + "," + v2[3].toFixed(n) + ")";
          case "mat3":
            return "mat3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0)";
          case "mat4":
            return "mat4(1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0)";
          default:
            throw type;
        }
        return "";
      };
      var varToTypeGLSL = LiteGraph2.varToTypeGLSL = function varToTypeGLSL2(v2, input_type, output_type) {
        if (input_type == output_type)
          return v2;
        if (v2 == null)
          switch (output_type) {
            case "float":
              return "0.0";
            case "vec2":
              return "vec2(0.0)";
            case "vec3":
              return "vec3(0.0)";
            case "vec4":
              return "vec4(0.0,0.0,0.0,1.0)";
            default:
              return null;
          }
        if (!output_type)
          throw "error: no output type specified";
        if (output_type == "float") {
          switch (input_type) {
            //case "float":
            case "vec2":
            case "vec3":
            case "vec4":
              return v2 + ".x";
            default:
              return "0.0";
          }
        } else if (output_type == "vec2") {
          switch (input_type) {
            case "float":
              return "vec2(" + v2 + ")";
            //case "vec2":
            case "vec3":
            case "vec4":
              return v2 + ".xy";
            default:
              return "vec2(0.0)";
          }
        } else if (output_type == "vec3") {
          switch (input_type) {
            case "float":
              return "vec3(" + v2 + ")";
            case "vec2":
              return "vec3(" + v2 + ",0.0)";
            //case "vec3":
            case "vec4":
              return v2 + ".xyz";
            default:
              return "vec3(0.0)";
          }
        } else if (output_type == "vec4") {
          switch (input_type) {
            case "float":
              return "vec4(" + v2 + ")";
            case "vec2":
              return "vec4(" + v2 + ",0.0,1.0)";
            case "vec3":
              return "vec4(" + v2 + ",1.0)";
            default:
              return "vec4(0.0,0.0,0.0,1.0)";
          }
        }
        throw "type cannot be converted";
      };
      var convertVarToGLSLType = LiteGraph2.convertVarToGLSLType = function convertVarToGLSLType2(varname, type, target_type) {
        if (type == target_type)
          return varname;
        if (type == "float")
          return target_type + "(" + varname + ")";
        if (target_type == "vec2")
          return "vec2(" + varname + ".xy)";
        if (target_type == "vec3") {
          if (type == "vec2")
            return "vec3(" + varname + ",0.0)";
          if (type == "vec4")
            return "vec4(" + varname + ".xyz)";
        }
        if (target_type == "vec4") {
          if (type == "vec2")
            return "vec4(" + varname + ",0.0,0.0)";
          if (target_type == "vec3")
            return "vec4(" + varname + ",1.0)";
        }
        return null;
      };
      function LGShaderContext() {
        this.vs_template = "";
        this.fs_template = "";
        this.buffer_names = {
          uvs: "v_coord"
        };
        this.extra = {};
        this._functions = {};
        this._uniforms = {};
        this._codeparts = {};
        this._uniform_value = null;
      }
      LGShaderContext.prototype.clear = function() {
        this._uniforms = {};
        this._functions = {};
        this._codeparts = {};
        this._uniform_value = null;
        this.extra = {};
      };
      LGShaderContext.prototype.addUniform = function(name, type, value) {
        this._uniforms[name] = type;
        if (value != null) {
          if (!this._uniform_value)
            this._uniform_value = {};
          this._uniform_value[name] = value;
        }
      };
      LGShaderContext.prototype.addFunction = function(name, code) {
        this._functions[name] = code;
      };
      LGShaderContext.prototype.addCode = function(hook, code, destinations) {
        destinations = destinations || { "": "" };
        for (var i2 in destinations) {
          var h = i2 ? i2 + "_" + hook : hook;
          if (!this._codeparts[h])
            this._codeparts[h] = code + "\n";
          else
            this._codeparts[h] += code + "\n";
        }
      };
      LGShaderContext.prototype.computeCodeBlocks = function(graph, extra_uniforms) {
        this.clear();
        var vertexout = graph.findNodesByType("shader::output/vertex");
        vertexout = vertexout && vertexout.length ? vertexout[0] : null;
        var fragmentout = graph.findNodesByType("shader::output/fragcolor");
        fragmentout = fragmentout && fragmentout.length ? fragmentout[0] : null;
        if (!fragmentout)
          return null;
        graph.sendEventToAllNodes("clearDestination");
        if (vertexout)
          vertexout.propagateDestination("vs");
        if (fragmentout)
          fragmentout.propagateDestination("fs");
        graph.sendEventToAllNodes("onGetCode", this);
        var uniforms = "";
        for (var i2 in this._uniforms)
          uniforms += "uniform " + this._uniforms[i2] + " " + i2 + ";\n";
        if (extra_uniforms)
          for (var i2 in extra_uniforms)
            uniforms += "uniform " + extra_uniforms[i2] + " " + i2 + ";\n";
        var functions = "";
        for (var i2 in this._functions)
          functions += "//" + i2 + "\n" + this._functions[i2] + "\n";
        var blocks = this._codeparts;
        blocks.uniforms = uniforms;
        blocks.functions = functions;
        return blocks;
      };
      LGShaderContext.prototype.computeShaderCode = function(graph) {
        var blocks = this.computeCodeBlocks(graph);
        var vs_code = GL.Shader.replaceCodeUsingContext(this.vs_template, blocks);
        var fs_code = GL.Shader.replaceCodeUsingContext(this.fs_template, blocks);
        return {
          vs_code,
          fs_code
        };
      };
      LGShaderContext.prototype.computeShader = function(graph, shader) {
        var finalcode = this.computeShaderCode(graph);
        console.log(finalcode.vs_code, finalcode.fs_code);
        if (!LiteGraph2.catch_exceptions) {
          this._shader_error = true;
          if (shader)
            shader.updateShader(finalcode.vs_code, finalcode.fs_code);
          else
            shader = new GL.Shader(finalcode.vs_code, finalcode.fs_code);
          this._shader_error = false;
          return shader;
        }
        try {
          if (shader)
            shader.updateShader(finalcode.vs_code, finalcode.fs_code);
          else
            shader = new GL.Shader(finalcode.vs_code, finalcode.fs_code);
          this._shader_error = false;
          return shader;
        } catch (err) {
          if (!this._shader_error) {
            console.error(err);
            if (err.indexOf("Fragment shader") != -1)
              console.log(finalcode.fs_code.split("\n").map(function(v2, i2) {
                return i2 + ".- " + v2;
              }).join("\n"));
            else
              console.log(finalcode.vs_code);
          }
          this._shader_error = true;
          return null;
        }
        return null;
      };
      LGShaderContext.prototype.getShader = function(graph) {
        if (this._shader && this._shader._version == graph._version)
          return this._shader;
        var shader = this.computeShader(graph, this._shader);
        if (!shader)
          return null;
        this._shader = shader;
        shader._version = graph._version;
        return shader;
      };
      LGShaderContext.prototype.fillUniforms = function(uniforms, param) {
        if (!this._uniform_value)
          return;
        for (var i2 in this._uniform_value) {
          var v2 = this._uniform_value[i2];
          if (v2 == null)
            continue;
          if (v2.constructor === Function)
            uniforms[i2] = v2.call(this, param);
          else if (v2.constructor === GL.Texture)
            ;
          else
            uniforms[i2] = v2;
        }
      };
      LiteGraph2.ShaderContext = LiteGraph2.Shaders.Context = LGShaderContext;
      function LGraphShaderGraph() {
        this.subgraph = new LiteGraph2.LGraph();
        this.subgraph._subgraph_node = this;
        this.subgraph._is_subgraph = true;
        this.subgraph.filter = "shader";
        this.addInput("in", "texture");
        this.addOutput("out", "texture");
        this.properties = { width: 0, height: 0, alpha: false, precision: typeof LGraphTexture != "undefined" ? LGraphTexture.DEFAULT : 2 };
        var inputNode = this.subgraph.findNodesByType("shader::input/uniform")[0];
        inputNode.pos = [200, 300];
        var sampler = LiteGraph2.createNode("shader::texture/sampler2D");
        sampler.pos = [400, 300];
        this.subgraph.add(sampler);
        var outnode = LiteGraph2.createNode("shader::output/fragcolor");
        outnode.pos = [600, 300];
        this.subgraph.add(outnode);
        inputNode.connect(0, sampler);
        sampler.connect(0, outnode);
        this.size = [180, 60];
        this.redraw_on_mouse = true;
        this._uniforms = {};
        this._shader = null;
        this._context = new LGShaderContext();
        this._context.vs_template = "#define VERTEX\n" + GL.Shader.SCREEN_VERTEX_SHADER;
        this._context.fs_template = LGraphShaderGraph.template;
      }
      LGraphShaderGraph.template = "\n		#define FRAGMENT\n		precision highp float;\n		varying vec2 v_coord;\n		{{varying}}\n		{{uniforms}}\n		{{functions}}\n		{{fs_functions}}\n		void main() {\n\n		vec2 uv = v_coord;\n		vec4 fragcolor = vec4(0.0);\n		vec4 fragcolor1 = vec4(0.0);\n		{{fs_code}}\n		gl_FragColor = fragcolor;\n		}\n			";
      LGraphShaderGraph.widgets_info = {
        precision: { widget: "combo", values: LGraphTexture.MODE_VALUES }
      };
      LGraphShaderGraph.title = "ShaderGraph";
      LGraphShaderGraph.desc = "Builds a shader using a graph";
      LGraphShaderGraph.input_node_type = "input/uniform";
      LGraphShaderGraph.output_node_type = "output/fragcolor";
      LGraphShaderGraph.title_color = SHADERNODES_COLOR;
      LGraphShaderGraph.prototype.onSerialize = function(o) {
        o.subgraph = this.subgraph.serialize();
      };
      LGraphShaderGraph.prototype.onConfigure = function(o) {
        this.subgraph.configure(o.subgraph);
      };
      LGraphShaderGraph.prototype.onExecute = function() {
        if (!this.isOutputConnected(0))
          return;
        var intex = this.getInputData(0);
        if (intex && intex.constructor != GL.Texture)
          intex = null;
        var w2 = this.properties.width | 0;
        var h = this.properties.height | 0;
        if (w2 == 0) {
          w2 = intex ? intex.width : gl.viewport_data[2];
        }
        if (h == 0) {
          h = intex ? intex.height : gl.viewport_data[3];
        }
        var type = LGraphTexture.getTextureType(this.properties.precision, intex);
        var texture = this._texture;
        if (!texture || texture.width != w2 || texture.height != h || texture.type != type) {
          texture = this._texture = new GL.Texture(w2, h, {
            type,
            format: this.alpha ? gl.RGBA : gl.RGB,
            filter: gl.LINEAR
          });
        }
        var shader = this.getShader(this.subgraph);
        if (!shader)
          return;
        var uniforms = this._uniforms;
        this._context.fillUniforms(uniforms);
        var tex_slot = 0;
        if (this.inputs)
          for (var i2 = 0; i2 < this.inputs.length; ++i2) {
            var input = this.inputs[i2];
            var data = this.getInputData(i2);
            if (input.type == "texture") {
              if (!data)
                data = GL.Texture.getWhiteTexture();
              data = data.bind(tex_slot++);
            }
            if (data != null)
              uniforms["u_" + input.name] = data;
          }
        var mesh = GL.Mesh.getScreenQuad();
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        texture.drawTo(function() {
          shader.uniforms(uniforms);
          shader.draw(mesh);
        });
        this.setOutputData(0, texture);
      };
      LGraphShaderGraph.prototype.onInputAdded = function(slot_info) {
        var subnode = LiteGraph2.createNode("shader::input/uniform");
        subnode.setProperty("name", slot_info.name);
        subnode.setProperty("type", slot_info.type);
        this.subgraph.add(subnode);
      };
      LGraphShaderGraph.prototype.onInputRemoved = function(slot, slot_info) {
        var nodes = this.subgraph.findNodesByType("shader::input/uniform");
        for (var i2 = 0; i2 < nodes.length; ++i2) {
          var node2 = nodes[i2];
          if (node2.properties.name == slot_info.name)
            this.subgraph.remove(node2);
        }
      };
      LGraphShaderGraph.prototype.computeSize = function() {
        var num_inputs = this.inputs ? this.inputs.length : 0;
        var num_outputs = this.outputs ? this.outputs.length : 0;
        return [200, Math.max(num_inputs, num_outputs) * LiteGraph2.NODE_SLOT_HEIGHT + LiteGraph2.NODE_TITLE_HEIGHT + 10];
      };
      LGraphShaderGraph.prototype.getShader = function() {
        var shader = this._context.getShader(this.subgraph);
        if (!shader)
          this.boxcolor = "red";
        else
          this.boxcolor = null;
        return shader;
      };
      LGraphShaderGraph.prototype.onDrawBackground = function(ctx, graphcanvas, canvas, pos2) {
        if (this.flags.collapsed)
          return;
        var tex = this.getOutputData(0);
        var inputs_y = this.inputs ? this.inputs.length * LiteGraph2.NODE_SLOT_HEIGHT : 0;
        if (tex && ctx == tex.gl && this.size[1] > inputs_y + LiteGraph2.NODE_TITLE_HEIGHT) {
          ctx.drawImage(tex, 10, y2, this.size[0] - 20, this.size[1] - inputs_y - LiteGraph2.NODE_TITLE_HEIGHT);
        }
        var y2 = this.size[1] - LiteGraph2.NODE_TITLE_HEIGHT + 0.5;
        var over = LiteGraph2.isInsideRectangle(pos2[0], pos2[1], this.pos[0], this.pos[1] + y2, this.size[0], LiteGraph2.NODE_TITLE_HEIGHT);
        ctx.fillStyle = over ? "#555" : "#222";
        ctx.beginPath();
        if (this._shape == LiteGraph2.BOX_SHAPE)
          ctx.rect(0, y2, this.size[0] + 1, LiteGraph2.NODE_TITLE_HEIGHT);
        else
          ctx.roundRect(0, y2, this.size[0] + 1, LiteGraph2.NODE_TITLE_HEIGHT, 0, 8);
        ctx.fill();
        ctx.textAlign = "center";
        ctx.font = "24px Arial";
        ctx.fillStyle = over ? "#DDD" : "#999";
        ctx.fillText("+", this.size[0] * 0.5, y2 + 24);
      };
      LGraphShaderGraph.prototype.onMouseDown = function(e, localpos, graphcanvas) {
        var y2 = this.size[1] - LiteGraph2.NODE_TITLE_HEIGHT + 0.5;
        if (localpos[1] > y2) {
          graphcanvas.showSubgraphPropertiesDialog(this);
        }
      };
      LGraphShaderGraph.prototype.onDrawSubgraphBackground = function(graphcanvas) {
      };
      LGraphShaderGraph.prototype.getExtraMenuOptions = function(graphcanvas) {
        var that2 = this;
        var options = [{ content: "Print Code", callback: function() {
          var code = that2._context.computeShaderCode();
          console.log(code.vs_code, code.fs_code);
        } }];
        return options;
      };
      LiteGraph2.registerNodeType("texture/shaderGraph", LGraphShaderGraph);
      function LGraphShaderUniform() {
        this.addOutput("out", "");
        this.properties = { name: "", type: "" };
      }
      LGraphShaderUniform.title = "Uniform";
      LGraphShaderUniform.desc = "Input data for the shader";
      LGraphShaderUniform.prototype.getTitle = function() {
        if (this.properties.name && this.flags.collapsed)
          return this.properties.type + " " + this.properties.name;
        return "Uniform";
      };
      LGraphShaderUniform.prototype.onPropertyChanged = function(name, value) {
        this.outputs[0].name = this.properties.type + " " + this.properties.name;
      };
      LGraphShaderUniform.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        var type = this.properties.type;
        if (!type) {
          if (!context.onGetPropertyInfo)
            return;
          var info = context.onGetPropertyInfo(this.property.name);
          if (!info)
            return;
          type = info.type;
        }
        if (type == "number")
          type = "float";
        else if (type == "texture")
          type = "sampler2D";
        if (LGShaders.GLSL_types.indexOf(type) == -1)
          return;
        context.addUniform("u_" + this.properties.name, type);
        this.setOutputData(0, type);
      };
      LGraphShaderUniform.prototype.getOutputVarName = function(slot) {
        return "u_" + this.properties.name;
      };
      registerShaderNode("input/uniform", LGraphShaderUniform);
      function LGraphShaderAttribute() {
        this.addOutput("out", "vec2");
        this.properties = { name: "coord", type: "vec2" };
      }
      LGraphShaderAttribute.title = "Attribute";
      LGraphShaderAttribute.desc = "Input data from mesh attribute";
      LGraphShaderAttribute.prototype.getTitle = function() {
        return "att. " + this.properties.name;
      };
      LGraphShaderAttribute.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        var type = this.properties.type;
        if (!type || LGShaders.GLSL_types.indexOf(type) == -1)
          return;
        if (type == "number")
          type = "float";
        if (this.properties.name != "coord") {
          context.addCode("varying", " varying " + type + " v_" + this.properties.name + ";");
        }
        this.setOutputData(0, type);
      };
      LGraphShaderAttribute.prototype.getOutputVarName = function(slot) {
        return "v_" + this.properties.name;
      };
      registerShaderNode("input/attribute", LGraphShaderAttribute);
      function LGraphShaderSampler2D() {
        this.addInput("tex", "sampler2D");
        this.addInput("uv", "vec2");
        this.addOutput("rgba", "vec4");
        this.addOutput("rgb", "vec3");
      }
      LGraphShaderSampler2D.title = "Sampler2D";
      LGraphShaderSampler2D.desc = "Reads a pixel from a texture";
      LGraphShaderSampler2D.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        var texname = getInputLinkID(this, 0);
        var varname = getShaderNodeVarName(this);
        var code = "vec4 " + varname + " = vec4(0.0);\n";
        if (texname) {
          var uvname = getInputLinkID(this, 1) || context.buffer_names.uvs;
          code += varname + " = texture2D(" + texname + "," + uvname + ");\n";
        }
        var link0 = getOutputLinkID(this, 0);
        if (link0)
          code += "vec4 " + getOutputLinkID(this, 0) + " = " + varname + ";\n";
        var link1 = getOutputLinkID(this, 1);
        if (link1)
          code += "vec3 " + getOutputLinkID(this, 1) + " = " + varname + ".xyz;\n";
        context.addCode("code", code, this.shader_destination);
        this.setOutputData(0, "vec4");
        this.setOutputData(1, "vec3");
      };
      registerShaderNode("texture/sampler2D", LGraphShaderSampler2D);
      function LGraphShaderConstant() {
        this.addOutput("", "float");
        this.properties = {
          type: "float",
          value: 0
        };
        this.addWidget("combo", "type", "float", null, { values: GLSL_types_const, property: "type" });
        this.updateWidgets();
      }
      LGraphShaderConstant.title = "const";
      LGraphShaderConstant.prototype.getTitle = function() {
        if (this.flags.collapsed)
          return valueToGLSL(this.properties.value, this.properties.type, 2);
        return "Const";
      };
      LGraphShaderConstant.prototype.onPropertyChanged = function(name, value) {
        if (name == "type") {
          if (this.outputs[0].type != value) {
            this.disconnectOutput(0);
            this.outputs[0].type = value;
          }
          this.widgets.length = 1;
          this.updateWidgets();
        }
        if (name == "value") {
          if (!value.length)
            this.widgets[1].value = value;
          else {
            this.widgets[1].value = value[1];
            if (value.length > 2)
              this.widgets[2].value = value[2];
            if (value.length > 3)
              this.widgets[3].value = value[3];
          }
        }
      };
      LGraphShaderConstant.prototype.updateWidgets = function(old_value2) {
        var that2 = this;
        var old_value2 = this.properties.value;
        var options = { step: 0.01 };
        switch (this.properties.type) {
          case "float":
            this.properties.value = 0;
            this.addWidget("number", "v", 0, { step: 0.01, property: "value" });
            break;
          case "vec2":
            this.properties.value = old_value2 && old_value2.length == 2 ? [old_value2[0], old_value2[1]] : [0, 0, 0];
            this.addWidget("number", "x", this.properties.value[0], function(v2) {
              that2.properties.value[0] = v2;
            }, options);
            this.addWidget("number", "y", this.properties.value[1], function(v2) {
              that2.properties.value[1] = v2;
            }, options);
            break;
          case "vec3":
            this.properties.value = old_value2 && old_value2.length == 3 ? [old_value2[0], old_value2[1], old_value2[2]] : [0, 0, 0];
            this.addWidget("number", "x", this.properties.value[0], function(v2) {
              that2.properties.value[0] = v2;
            }, options);
            this.addWidget("number", "y", this.properties.value[1], function(v2) {
              that2.properties.value[1] = v2;
            }, options);
            this.addWidget("number", "z", this.properties.value[2], function(v2) {
              that2.properties.value[2] = v2;
            }, options);
            break;
          case "vec4":
            this.properties.value = old_value2 && old_value2.length == 4 ? [old_value2[0], old_value2[1], old_value2[2], old_value2[3]] : [0, 0, 0, 0];
            this.addWidget("number", "x", this.properties.value[0], function(v2) {
              that2.properties.value[0] = v2;
            }, options);
            this.addWidget("number", "y", this.properties.value[1], function(v2) {
              that2.properties.value[1] = v2;
            }, options);
            this.addWidget("number", "z", this.properties.value[2], function(v2) {
              that2.properties.value[2] = v2;
            }, options);
            this.addWidget("number", "w", this.properties.value[3], function(v2) {
              that2.properties.value[3] = v2;
            }, options);
            break;
          default:
            console.error("unknown type for constant");
        }
      };
      LGraphShaderConstant.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        var value = valueToGLSL(this.properties.value, this.properties.type);
        var link_name = getOutputLinkID(this, 0);
        if (!link_name)
          return;
        var code = "	" + this.properties.type + " " + link_name + " = " + value + ";";
        context.addCode("code", code, this.shader_destination);
        this.setOutputData(0, this.properties.type);
      };
      registerShaderNode("const/const", LGraphShaderConstant);
      function LGraphShaderVec2() {
        this.addInput("xy", "vec2");
        this.addInput("x", "float");
        this.addInput("y", "float");
        this.addOutput("xy", "vec2");
        this.addOutput("x", "float");
        this.addOutput("y", "float");
        this.properties = { x: 0, y: 0 };
      }
      LGraphShaderVec2.title = "vec2";
      LGraphShaderVec2.varmodes = ["xy", "x", "y"];
      LGraphShaderVec2.prototype.onPropertyChanged = function() {
        if (this.graph)
          this.graph._version++;
      };
      LGraphShaderVec2.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        var props = this.properties;
        var varname = getShaderNodeVarName(this);
        var code = "	vec2 " + varname + " = " + valueToGLSL([props.x, props.y]) + ";\n";
        for (var i2 = 0; i2 < LGraphShaderVec2.varmodes.length; ++i2) {
          var varmode = LGraphShaderVec2.varmodes[i2];
          var inlink = getInputLinkID(this, i2);
          if (!inlink)
            continue;
          code += "	" + varname + "." + varmode + " = " + inlink + ";\n";
        }
        for (var i2 = 0; i2 < LGraphShaderVec2.varmodes.length; ++i2) {
          var varmode = LGraphShaderVec2.varmodes[i2];
          var outlink = getOutputLinkID(this, i2);
          if (!outlink)
            continue;
          var type = GLSL_types_const[varmode.length - 1];
          code += "	" + type + " " + outlink + " = " + varname + "." + varmode + ";\n";
          this.setOutputData(i2, type);
        }
        context.addCode("code", code, this.shader_destination);
      };
      registerShaderNode("const/vec2", LGraphShaderVec2);
      function LGraphShaderVec3() {
        this.addInput("xyz", "vec3");
        this.addInput("x", "float");
        this.addInput("y", "float");
        this.addInput("z", "float");
        this.addInput("xy", "vec2");
        this.addInput("xz", "vec2");
        this.addInput("yz", "vec2");
        this.addOutput("xyz", "vec3");
        this.addOutput("x", "float");
        this.addOutput("y", "float");
        this.addOutput("z", "float");
        this.addOutput("xy", "vec2");
        this.addOutput("xz", "vec2");
        this.addOutput("yz", "vec2");
        this.properties = { x: 0, y: 0, z: 0 };
      }
      LGraphShaderVec3.title = "vec3";
      LGraphShaderVec3.varmodes = ["xyz", "x", "y", "z", "xy", "xz", "yz"];
      LGraphShaderVec3.prototype.onPropertyChanged = function() {
        if (this.graph)
          this.graph._version++;
      };
      LGraphShaderVec3.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        var props = this.properties;
        var varname = getShaderNodeVarName(this);
        var code = "vec3 " + varname + " = " + valueToGLSL([props.x, props.y, props.z]) + ";\n";
        for (var i2 = 0; i2 < LGraphShaderVec3.varmodes.length; ++i2) {
          var varmode = LGraphShaderVec3.varmodes[i2];
          var inlink = getInputLinkID(this, i2);
          if (!inlink)
            continue;
          code += "	" + varname + "." + varmode + " = " + inlink + ";\n";
        }
        for (var i2 = 0; i2 < LGraphShaderVec3.varmodes.length; ++i2) {
          var varmode = LGraphShaderVec3.varmodes[i2];
          var outlink = getOutputLinkID(this, i2);
          if (!outlink)
            continue;
          var type = GLSL_types_const[varmode.length - 1];
          code += "	" + type + " " + outlink + " = " + varname + "." + varmode + ";\n";
          this.setOutputData(i2, type);
        }
        context.addCode("code", code, this.shader_destination);
      };
      registerShaderNode("const/vec3", LGraphShaderVec3);
      function LGraphShaderVec4() {
        this.addInput("xyzw", "vec4");
        this.addInput("xyz", "vec3");
        this.addInput("x", "float");
        this.addInput("y", "float");
        this.addInput("z", "float");
        this.addInput("w", "float");
        this.addInput("xy", "vec2");
        this.addInput("yz", "vec2");
        this.addInput("zw", "vec2");
        this.addOutput("xyzw", "vec4");
        this.addOutput("xyz", "vec3");
        this.addOutput("x", "float");
        this.addOutput("y", "float");
        this.addOutput("z", "float");
        this.addOutput("xy", "vec2");
        this.addOutput("yz", "vec2");
        this.addOutput("zw", "vec2");
        this.properties = { x: 0, y: 0, z: 0, w: 0 };
      }
      LGraphShaderVec4.title = "vec4";
      LGraphShaderVec4.varmodes = ["xyzw", "xyz", "x", "y", "z", "w", "xy", "yz", "zw"];
      LGraphShaderVec4.prototype.onPropertyChanged = function() {
        if (this.graph)
          this.graph._version++;
      };
      LGraphShaderVec4.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        var props = this.properties;
        var varname = getShaderNodeVarName(this);
        var code = "vec4 " + varname + " = " + valueToGLSL([props.x, props.y, props.z, props.w]) + ";\n";
        for (var i2 = 0; i2 < LGraphShaderVec4.varmodes.length; ++i2) {
          var varmode = LGraphShaderVec4.varmodes[i2];
          var inlink = getInputLinkID(this, i2);
          if (!inlink)
            continue;
          code += "	" + varname + "." + varmode + " = " + inlink + ";\n";
        }
        for (var i2 = 0; i2 < LGraphShaderVec4.varmodes.length; ++i2) {
          var varmode = LGraphShaderVec4.varmodes[i2];
          var outlink = getOutputLinkID(this, i2);
          if (!outlink)
            continue;
          var type = GLSL_types_const[varmode.length - 1];
          code += "	" + type + " " + outlink + " = " + varname + "." + varmode + ";\n";
          this.setOutputData(i2, type);
        }
        context.addCode("code", code, this.shader_destination);
      };
      registerShaderNode("const/vec4", LGraphShaderVec4);
      function LGraphShaderFragColor() {
        this.addInput("color", LGShaders.ALL_TYPES);
        this.block_delete = true;
      }
      LGraphShaderFragColor.title = "FragColor";
      LGraphShaderFragColor.desc = "Pixel final color";
      LGraphShaderFragColor.prototype.onGetCode = function(context) {
        var link_name = getInputLinkID(this, 0);
        if (!link_name)
          return;
        var type = this.getInputData(0);
        var code = varToTypeGLSL(link_name, type, "vec4");
        context.addCode("fs_code", "fragcolor = " + code + ";");
      };
      registerShaderNode("output/fragcolor", LGraphShaderFragColor);
      function LGraphShaderOperation() {
        this.addInput("A", LGShaders.ALL_TYPES);
        this.addInput("B", LGShaders.ALL_TYPES);
        this.addOutput("out", "");
        this.properties = {
          operation: "*"
        };
        this.addWidget("combo", "op.", this.properties.operation, { property: "operation", values: LGraphShaderOperation.operations });
      }
      LGraphShaderOperation.title = "Operation";
      LGraphShaderOperation.operations = ["+", "-", "*", "/"];
      LGraphShaderOperation.prototype.getTitle = function() {
        if (this.flags.collapsed)
          return "A" + this.properties.operation + "B";
        else
          return "Operation";
      };
      LGraphShaderOperation.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        if (!this.isOutputConnected(0))
          return;
        var inlinks = [];
        for (var i2 = 0; i2 < 3; ++i2)
          inlinks.push({ name: getInputLinkID(this, i2), type: this.getInputData(i2) || "float" });
        var outlink = getOutputLinkID(this, 0);
        if (!outlink)
          return;
        var base_type = inlinks[0].type;
        var return_type = base_type;
        var op = this.properties.operation;
        var params = [];
        for (var i2 = 0; i2 < 2; ++i2) {
          var param_code = inlinks[i2].name;
          if (param_code == null) {
            param_code = p.value != null ? p.value : "(1.0)";
            inlinks[i2].type = "float";
          }
          if (inlinks[i2].type != base_type) {
            if (inlinks[i2].type == "float" && (op == "*" || op == "/"))
              ;
            else
              param_code = convertVarToGLSLType(param_code, inlinks[i2].type, base_type);
          }
          params.push(param_code);
        }
        context.addCode("code", return_type + " " + outlink + " = " + params[0] + op + params[1] + ";", this.shader_destination);
        this.setOutputData(0, return_type);
      };
      registerShaderNode("math/operation", LGraphShaderOperation);
      function LGraphShaderFunc() {
        this.addInput("A", LGShaders.ALL_TYPES);
        this.addInput("B", LGShaders.ALL_TYPES);
        this.addOutput("out", "");
        this.properties = {
          func: "floor"
        };
        this._current = "floor";
        this.addWidget("combo", "func", this.properties.func, { property: "func", values: GLSL_functions_name });
      }
      LGraphShaderFunc.title = "Func";
      LGraphShaderFunc.prototype.onPropertyChanged = function(name, value) {
        if (this.graph)
          this.graph._version++;
        if (name == "func") {
          var func_desc = GLSL_functions[value];
          if (!func_desc)
            return;
          for (var i2 = func_desc.params.length; i2 < this.inputs.length; ++i2)
            this.removeInput(i2);
          for (var i2 = 0; i2 < func_desc.params.length; ++i2) {
            var p2 = func_desc.params[i2];
            if (this.inputs[i2])
              this.inputs[i2].name = p2.name + (p2.value ? " (" + p2.value + ")" : "");
            else
              this.addInput(p2.name, LGShaders.ALL_TYPES);
          }
        }
      };
      LGraphShaderFunc.prototype.getTitle = function() {
        if (this.flags.collapsed)
          return this.properties.func;
        else
          return "Func";
      };
      LGraphShaderFunc.prototype.onGetCode = function(context) {
        if (!this.shader_destination)
          return;
        if (!this.isOutputConnected(0))
          return;
        var inlinks = [];
        for (var i2 = 0; i2 < 3; ++i2)
          inlinks.push({ name: getInputLinkID(this, i2), type: this.getInputData(i2) || "float" });
        var outlink = getOutputLinkID(this, 0);
        if (!outlink)
          return;
        var func_desc = GLSL_functions[this.properties.func];
        if (!func_desc)
          return;
        var base_type = inlinks[0].type;
        var return_type = func_desc.return_type;
        if (return_type == "T")
          return_type = base_type;
        var params = [];
        for (var i2 = 0; i2 < func_desc.params.length; ++i2) {
          var p2 = func_desc.params[i2];
          var param_code = inlinks[i2].name;
          if (param_code == null) {
            param_code = p2.value != null ? p2.value : "(1.0)";
            inlinks[i2].type = "float";
          }
          if (p2.type == "T" && inlinks[i2].type != base_type || p2.type != "T" && inlinks[i2].type != base_type)
            param_code = convertVarToGLSLType(param_code, inlinks[i2].type, base_type);
          params.push(param_code);
        }
        context.addFunction("round", "float round(float v){ return floor(v+0.5); }\nvec2 round(vec2 v){ return floor(v+vec2(0.5));}\nvec3 round(vec3 v){ return floor(v+vec3(0.5));}\nvec4 round(vec4 v){ return floor(v+vec4(0.5)); }\n");
        context.addCode("code", return_type + " " + outlink + " = " + func_desc.func + "(" + params.join(",") + ");", this.shader_destination);
        this.setOutputData(0, return_type);
      };
      registerShaderNode("math/func", LGraphShaderFunc);
      function LGraphShaderSnippet() {
        this.addInput("A", LGShaders.ALL_TYPES);
        this.addInput("B", LGShaders.ALL_TYPES);
        this.addOutput("C", "vec4");
        this.properties = {
          code: "C = A+B",
          type: "vec4"
        };
        this.addWidget("text", "code", this.properties.code, { property: "code" });
        this.addWidget("combo", "type", this.properties.type, { values: ["float", "vec2", "vec3", "vec4"], property: "type" });
      }
      LGraphShaderSnippet.title = "Snippet";
      LGraphShaderSnippet.prototype.onPropertyChanged = function(name, value) {
        if (this.graph)
          this.graph._version++;
        if (name == "type" && this.outputs[0].type != value) {
          this.disconnectOutput(0);
          this.outputs[0].type = value;
        }
      };
      LGraphShaderSnippet.prototype.getTitle = function() {
        if (this.flags.collapsed)
          return this.properties.code;
        else
          return "Snippet";
      };
      LGraphShaderSnippet.prototype.onGetCode = function(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
          return;
        var inlinkA = getInputLinkID(this, 0);
        if (!inlinkA)
          inlinkA = "1.0";
        var inlinkB = getInputLinkID(this, 1);
        if (!inlinkB)
          inlinkB = "1.0";
        var outlink = getOutputLinkID(this, 0);
        if (!outlink)
          return;
        var inA_type = this.getInputData(0) || "float";
        var inB_type = this.getInputData(1) || "float";
        var return_type = this.properties.type;
        if (inA_type == "T" || inB_type == "T") {
          return null;
        }
        var funcname = "funcSnippet" + this.id;
        var func_code = "\n" + return_type + " " + funcname + "( " + inA_type + " A, " + inB_type + " B) {\n";
        func_code += "	" + return_type + " C = " + return_type + "(0.0);\n";
        func_code += "	" + this.properties.code + ";\n";
        func_code += "	return C;\n}\n";
        context.addCode("functions", func_code, this.shader_destination);
        context.addCode("code", return_type + " " + outlink + " = " + funcname + "(" + inlinkA + "," + inlinkB + ");", this.shader_destination);
        this.setOutputData(0, return_type);
      };
      registerShaderNode("utils/snippet", LGraphShaderSnippet);
      function LGraphShaderRand() {
        this.addOutput("out", "float");
      }
      LGraphShaderRand.title = "Rand";
      LGraphShaderRand.prototype.onGetCode = function(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
          return;
        var outlink = getOutputLinkID(this, 0);
        context.addUniform("u_rand" + this.id, "float", function() {
          return Math.random();
        });
        context.addCode("code", "float " + outlink + " = u_rand" + this.id + ";", this.shader_destination);
        this.setOutputData(0, "float");
      };
      registerShaderNode("input/rand", LGraphShaderRand);
      function LGraphShaderNoise() {
        this.addInput("out", LGShaders.ALL_TYPES);
        this.addInput("scale", "float");
        this.addOutput("out", "float");
        this.properties = {
          type: "noise",
          scale: 1
        };
        this.addWidget("combo", "type", this.properties.type, { property: "type", values: LGraphShaderNoise.NOISE_TYPES });
        this.addWidget("number", "scale", this.properties.scale, { property: "scale" });
      }
      LGraphShaderNoise.NOISE_TYPES = ["noise", "rand"];
      LGraphShaderNoise.title = "noise";
      LGraphShaderNoise.prototype.onGetCode = function(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
          return;
        var inlink = getInputLinkID(this, 0);
        var outlink = getOutputLinkID(this, 0);
        var intype = this.getInputData(0);
        if (!inlink) {
          intype = "vec2";
          inlink = context.buffer_names.uvs;
        }
        context.addFunction("noise", LGraphShaderNoise.shader_functions);
        context.addUniform("u_noise_scale" + this.id, "float", this.properties.scale);
        if (intype == "float")
          context.addCode("code", "float " + outlink + " = snoise( vec2(" + inlink + ") * u_noise_scale" + this.id + ");", this.shader_destination);
        else if (intype == "vec2" || intype == "vec3")
          context.addCode("code", "float " + outlink + " = snoise(" + inlink + " * u_noise_scale" + this.id + ");", this.shader_destination);
        else if (intype == "vec4")
          context.addCode("code", "float " + outlink + " = snoise(" + inlink + ".xyz * u_noise_scale" + this.id + ");", this.shader_destination);
        this.setOutputData(0, "float");
      };
      registerShaderNode("math/noise", LGraphShaderNoise);
      LGraphShaderNoise.shader_functions = "\n		vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }\n		\n		float snoise(vec2 v){\n		  const vec4 C = vec4(0.211324865405187, 0.366025403784439,-0.577350269189626, 0.024390243902439);\n		  vec2 i  = floor(v + dot(v, C.yy) );\n		  vec2 x0 = v -   i + dot(i, C.xx);\n		  vec2 i1;\n		  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n		  vec4 x12 = x0.xyxy + C.xxzz;\n		  x12.xy -= i1;\n		  i = mod(i, 289.0);\n		  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n		  + i.x + vec3(0.0, i1.x, 1.0 ));\n		  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)), 0.0);\n		  m = m*m ;\n		  m = m*m ;\n		  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n		  vec3 h = abs(x) - 0.5;\n		  vec3 ox = floor(x + 0.5);\n		  vec3 a0 = x - ox;\n		  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n		  vec3 g;\n		  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n		  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n		  return 130.0 * dot(m, g);\n		}\n		vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\n		vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n		\n		float snoise(vec3 v){ \n		  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n		  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n		\n		// First corner\n		  vec3 i  = floor(v + dot(v, C.yyy) );\n		  vec3 x0 =   v - i + dot(i, C.xxx) ;\n		\n		// Other corners\n		  vec3 g = step(x0.yzx, x0.xyz);\n		  vec3 l = 1.0 - g;\n		  vec3 i1 = min( g.xyz, l.zxy );\n		  vec3 i2 = max( g.xyz, l.zxy );\n		\n		  //  x0 = x0 - 0. + 0.0 * C \n		  vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n		  vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n		  vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n		\n		// Permutations\n		  i = mod(i, 289.0 ); \n		  vec4 p = permute( permute( permute( \n		             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n		           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n		           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n		\n		// Gradients\n		// ( N*N points uniformly over a square, mapped onto an octahedron.)\n		  float n_ = 1.0/7.0; // N=7\n		  vec3  ns = n_ * D.wyz - D.xzx;\n		\n		  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)\n		\n		  vec4 x_ = floor(j * ns.z);\n		  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n		\n		  vec4 x = x_ *ns.x + ns.yyyy;\n		  vec4 y = y_ *ns.x + ns.yyyy;\n		  vec4 h = 1.0 - abs(x) - abs(y);\n		\n		  vec4 b0 = vec4( x.xy, y.xy );\n		  vec4 b1 = vec4( x.zw, y.zw );\n		\n		  vec4 s0 = floor(b0)*2.0 + 1.0;\n		  vec4 s1 = floor(b1)*2.0 + 1.0;\n		  vec4 sh = -step(h, vec4(0.0));\n		\n		  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n		  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n		\n		  vec3 p0 = vec3(a0.xy,h.x);\n		  vec3 p1 = vec3(a0.zw,h.y);\n		  vec3 p2 = vec3(a1.xy,h.z);\n		  vec3 p3 = vec3(a1.zw,h.w);\n		\n		//Normalise gradients\n		  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n		  p0 *= norm.x;\n		  p1 *= norm.y;\n		  p2 *= norm.z;\n		  p3 *= norm.w;\n		\n		// Mix final noise value\n		  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n		  m = m * m;\n		  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) );\n		}\n		\n		vec3 hash3( vec2 p ){\n		    vec3 q = vec3( dot(p,vec2(127.1,311.7)), \n						   dot(p,vec2(269.5,183.3)), \n						   dot(p,vec2(419.2,371.9)) );\n			return fract(sin(q)*43758.5453);\n		}\n		vec4 hash4( vec3 p ){\n		    vec4 q = vec4( dot(p,vec3(127.1,311.7,257.3)), \n						   dot(p,vec3(269.5,183.3,335.1)), \n						   dot(p,vec3(314.5,235.1,467.3)), \n						   dot(p,vec3(419.2,371.9,114.9)) );\n			return fract(sin(q)*43758.5453);\n		}\n		\n		float iqnoise( in vec2 x, float u, float v ){\n		    vec2 p = floor(x);\n		    vec2 f = fract(x);\n			\n			float k = 1.0+63.0*pow(1.0-v,4.0);\n			\n			float va = 0.0;\n			float wt = 0.0;\n		    for( int j=-2; j<=2; j++ )\n		    for( int i=-2; i<=2; i++ )\n		    {\n		        vec2 g = vec2( float(i),float(j) );\n				vec3 o = hash3( p + g )*vec3(u,u,1.0);\n				vec2 r = g - f + o.xy;\n				float d = dot(r,r);\n				float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );\n				va += o.z*ww;\n				wt += ww;\n		    }\n			\n		    return va/wt;\n		}\n		";
      function LGraphShaderTime() {
        this.addOutput("out", "float");
      }
      LGraphShaderTime.title = "Time";
      LGraphShaderTime.prototype.onGetCode = function(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
          return;
        var outlink = getOutputLinkID(this, 0);
        context.addUniform("u_time" + this.id, "float", function() {
          return getTime() * 1e-3;
        });
        context.addCode("code", "float " + outlink + " = u_time" + this.id + ";", this.shader_destination);
        this.setOutputData(0, "float");
      };
      registerShaderNode("input/time", LGraphShaderTime);
      function LGraphShaderDither() {
        this.addInput("in", "T");
        this.addOutput("out", "float");
      }
      LGraphShaderDither.title = "Dither";
      LGraphShaderDither.prototype.onGetCode = function(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
          return;
        var inlink = getInputLinkID(this, 0);
        var return_type = "float";
        var outlink = getOutputLinkID(this, 0);
        var intype = this.getInputData(0);
        inlink = varToTypeGLSL(inlink, intype, "float");
        context.addFunction("dither8x8", LGraphShaderDither.dither_func);
        context.addCode("code", return_type + " " + outlink + " = dither8x8(" + inlink + ");", this.shader_destination);
        this.setOutputData(0, return_type);
      };
      LGraphShaderDither.dither_values = [0.515625, 0.140625, 0.640625, 0.046875, 0.546875, 0.171875, 0.671875, 0.765625, 0.265625, 0.890625, 0.390625, 0.796875, 0.296875, 0.921875, 0.421875, 0.203125, 0.703125, 0.078125, 0.578125, 0.234375, 0.734375, 0.109375, 0.609375, 0.953125, 0.453125, 0.828125, 0.328125, 0.984375, 0.484375, 0.859375, 0.359375, 0.0625, 0.5625, 0.1875, 0.6875, 0.03125, 0.53125, 0.15625, 0.65625, 0.8125, 0.3125, 0.9375, 0.4375, 0.78125, 0.28125, 0.90625, 0.40625, 0.25, 0.75, 0.125, 0.625, 0.21875, 0.71875, 0.09375, 0.59375, 1.0001, 0.5, 0.875, 0.375, 0.96875, 0.46875, 0.84375, 0.34375];
      LGraphShaderDither.dither_func = "\n				float dither8x8(float brightness) {\n				  vec2 position = vec2(0.0);\n				  #ifdef FRAGMENT\n					position = gl_FragCoord.xy;\n				  #endif\n				  int x = int(mod(position.x, 8.0));\n				  int y = int(mod(position.y, 8.0));\n				  int index = x + y * 8;\n				  float limit = 0.0;\n				  if (x < 8) {\n					if(index==0) limit = 0.015625;\n					" + LGraphShaderDither.dither_values.map(function(v2, i2) {
        return "else if(index== " + (i2 + 1) + ") limit = " + v2 + ";";
      }).join("\n") + "\n				  }\n				  return brightness < limit ? 0.0 : 1.0;\n				}\n", registerShaderNode("math/dither", LGraphShaderDither);
      function LGraphShaderRemap() {
        this.addInput("", LGShaders.ALL_TYPES);
        this.addOutput("", "");
        this.properties = {
          min_value: 0,
          max_value: 1,
          min_value2: 0,
          max_value2: 1
        };
        this.addWidget("number", "min", 0, { step: 0.1, property: "min_value" });
        this.addWidget("number", "max", 1, { step: 0.1, property: "max_value" });
        this.addWidget("number", "min2", 0, { step: 0.1, property: "min_value2" });
        this.addWidget("number", "max2", 1, { step: 0.1, property: "max_value2" });
      }
      LGraphShaderRemap.title = "Remap";
      LGraphShaderRemap.prototype.onPropertyChanged = function() {
        if (this.graph)
          this.graph._version++;
      };
      LGraphShaderRemap.prototype.onConnectionsChange = function() {
        var return_type = this.getInputDataType(0);
        this.outputs[0].type = return_type || "T";
      };
      LGraphShaderRemap.prototype.onGetCode = function(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
          return;
        var inlink = getInputLinkID(this, 0);
        var outlink = getOutputLinkID(this, 0);
        if (!inlink && !outlink)
          return;
        var return_type = this.getInputDataType(0);
        this.outputs[0].type = return_type;
        if (return_type == "T") {
          console.warn("node type is T and cannot be resolved");
          return;
        }
        if (!inlink) {
          context.addCode("code", "	" + return_type + " " + outlink + " = " + return_type + "(0.0);\n");
          return;
        }
        var minv = valueToGLSL(this.properties.min_value);
        var maxv = valueToGLSL(this.properties.max_value);
        var minv2 = valueToGLSL(this.properties.min_value2);
        var maxv2 = valueToGLSL(this.properties.max_value2);
        context.addCode("code", return_type + " " + outlink + " = ( (" + inlink + " - " + minv + ") / (" + maxv + " - " + minv + ") ) * (" + maxv2 + " - " + minv2 + ") + " + minv2 + ";", this.shader_destination);
        this.setOutputData(0, return_type);
      };
      registerShaderNode("math/remap", LGraphShaderRemap);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      var view_matrix = new Float32Array(16);
      var projection_matrix = new Float32Array(16);
      var viewprojection_matrix = new Float32Array(16);
      var model_matrix = new Float32Array(16);
      var global_uniforms = {
        u_view: view_matrix,
        u_projection: projection_matrix,
        u_viewprojection: viewprojection_matrix,
        u_model: model_matrix
      };
      LiteGraph2.LGraphRender = {
        onRequestCameraMatrices: null
        //overwrite with your 3D engine specifics, it will receive (view_matrix, projection_matrix,viewprojection_matrix) and must be filled
      };
      function generateGeometryId() {
        return Math.random() * 1e5 | 0;
      }
      function LGraphPoints3D() {
        this.addInput("obj", "");
        this.addInput("radius", "number");
        this.addOutput("out", "geometry");
        this.addOutput("points", "[vec3]");
        this.properties = {
          radius: 1,
          num_points: 4096,
          generate_normals: true,
          regular: false,
          mode: LGraphPoints3D.SPHERE,
          force_update: false
        };
        this.points = new Float32Array(this.properties.num_points * 3);
        this.normals = new Float32Array(this.properties.num_points * 3);
        this.must_update = true;
        this.version = 0;
        var that2 = this;
        this.addWidget("button", "update", null, function() {
          that2.must_update = true;
        });
        this.geometry = {
          vertices: null,
          _id: generateGeometryId()
        };
        this._old_obj = null;
        this._last_radius = null;
      }
      global2.LGraphPoints3D = LGraphPoints3D;
      LGraphPoints3D.RECTANGLE = 1;
      LGraphPoints3D.CIRCLE = 2;
      LGraphPoints3D.CUBE = 10;
      LGraphPoints3D.SPHERE = 11;
      LGraphPoints3D.HEMISPHERE = 12;
      LGraphPoints3D.INSIDE_SPHERE = 13;
      LGraphPoints3D.OBJECT = 20;
      LGraphPoints3D.OBJECT_UNIFORMLY = 21;
      LGraphPoints3D.OBJECT_INSIDE = 22;
      LGraphPoints3D.MODE_VALUES = { "rectangle": LGraphPoints3D.RECTANGLE, "circle": LGraphPoints3D.CIRCLE, "cube": LGraphPoints3D.CUBE, "sphere": LGraphPoints3D.SPHERE, "hemisphere": LGraphPoints3D.HEMISPHERE, "inside_sphere": LGraphPoints3D.INSIDE_SPHERE, "object": LGraphPoints3D.OBJECT, "object_uniformly": LGraphPoints3D.OBJECT_UNIFORMLY, "object_inside": LGraphPoints3D.OBJECT_INSIDE };
      LGraphPoints3D.widgets_info = {
        mode: { widget: "combo", values: LGraphPoints3D.MODE_VALUES }
      };
      LGraphPoints3D.title = "list of points";
      LGraphPoints3D.desc = "returns an array of points";
      LGraphPoints3D.prototype.onPropertyChanged = function(name, value) {
        this.must_update = true;
      };
      LGraphPoints3D.prototype.onExecute = function() {
        var obj = this.getInputData(0);
        if (obj != this._old_obj || obj && obj._version != this._old_obj_version) {
          this._old_obj = obj;
          this.must_update = true;
        }
        var radius = this.getInputData(1);
        if (radius == null)
          radius = this.properties.radius;
        if (this._last_radius != radius) {
          this._last_radius = radius;
          this.must_update = true;
        }
        if (this.must_update || this.properties.force_update) {
          this.must_update = false;
          this.updatePoints();
        }
        this.geometry.vertices = this.points;
        this.geometry.normals = this.normals;
        this.geometry._version = this.version;
        this.setOutputData(0, this.geometry);
      };
      LGraphPoints3D.prototype.updatePoints = function() {
        var num_points = this.properties.num_points | 0;
        if (num_points < 1)
          num_points = 1;
        if (!this.points || this.points.length != num_points * 3)
          this.points = new Float32Array(num_points * 3);
        if (this.properties.generate_normals) {
          if (!this.normals || this.normals.length != this.points.length)
            this.normals = new Float32Array(this.points.length);
        } else
          this.normals = null;
        var radius = this._last_radius || this.properties.radius;
        var mode = this.properties.mode;
        var obj = this.getInputData(0);
        this._old_obj_version = obj ? obj._version : null;
        this.points = LGraphPoints3D.generatePoints(radius, num_points, mode, this.points, this.normals, this.properties.regular, obj);
        this.version++;
      };
      LGraphPoints3D.generatePoints = function(radius, num_points, mode, points, normals, regular, obj) {
        var size = num_points * 3;
        if (!points || points.length != size)
          points = new Float32Array(size);
        var temp2 = new Float32Array(3);
        var UP = new Float32Array([0, 1, 0]);
        if (regular) {
          if (mode == LGraphPoints3D.RECTANGLE) {
            var side = Math.floor(Math.sqrt(num_points));
            for (var i2 = 0; i2 < side; ++i2)
              for (var j = 0; j < side; ++j) {
                var pos2 = i2 * 3 + j * 3 * side;
                points[pos2] = (i2 / side - 0.5) * radius * 2;
                points[pos2 + 1] = 0;
                points[pos2 + 2] = (j / side - 0.5) * radius * 2;
              }
            points = new Float32Array(points.subarray(0, side * side * 3));
            if (normals) {
              for (var i2 = 0; i2 < normals.length; i2 += 3)
                normals.set(UP, i2);
            }
          } else if (mode == LGraphPoints3D.SPHERE) {
            var side = Math.floor(Math.sqrt(num_points));
            for (var i2 = 0; i2 < side; ++i2)
              for (var j = 0; j < side; ++j) {
                var pos2 = i2 * 3 + j * 3 * side;
                polarToCartesian(temp2, i2 / side * 2 * Math.PI, (j / side - 0.5) * 2 * Math.PI, radius);
                points[pos2] = temp2[0];
                points[pos2 + 1] = temp2[1];
                points[pos2 + 2] = temp2[2];
              }
            points = new Float32Array(points.subarray(0, side * side * 3));
            if (normals)
              LGraphPoints3D.generateSphericalNormals(points, normals);
          } else if (mode == LGraphPoints3D.CIRCLE) {
            for (var i2 = 0; i2 < size; i2 += 3) {
              var angle = 2 * Math.PI * (i2 / size);
              points[i2] = Math.cos(angle) * radius;
              points[i2 + 1] = 0;
              points[i2 + 2] = Math.sin(angle) * radius;
            }
            if (normals) {
              for (var i2 = 0; i2 < normals.length; i2 += 3)
                normals.set(UP, i2);
            }
          }
        } else {
          if (mode == LGraphPoints3D.RECTANGLE) {
            for (var i2 = 0; i2 < size; i2 += 3) {
              points[i2] = (Math.random() - 0.5) * radius * 2;
              points[i2 + 1] = 0;
              points[i2 + 2] = (Math.random() - 0.5) * radius * 2;
            }
            if (normals) {
              for (var i2 = 0; i2 < normals.length; i2 += 3)
                normals.set(UP, i2);
            }
          } else if (mode == LGraphPoints3D.CUBE) {
            for (var i2 = 0; i2 < size; i2 += 3) {
              points[i2] = (Math.random() - 0.5) * radius * 2;
              points[i2 + 1] = (Math.random() - 0.5) * radius * 2;
              points[i2 + 2] = (Math.random() - 0.5) * radius * 2;
            }
            if (normals) {
              for (var i2 = 0; i2 < normals.length; i2 += 3)
                normals.set(UP, i2);
            }
          } else if (mode == LGraphPoints3D.SPHERE) {
            LGraphPoints3D.generateSphere(points, size, radius);
            if (normals)
              LGraphPoints3D.generateSphericalNormals(points, normals);
          } else if (mode == LGraphPoints3D.HEMISPHERE) {
            LGraphPoints3D.generateHemisphere(points, size, radius);
            if (normals)
              LGraphPoints3D.generateSphericalNormals(points, normals);
          } else if (mode == LGraphPoints3D.CIRCLE) {
            LGraphPoints3D.generateInsideCircle(points, size, radius);
            if (normals)
              LGraphPoints3D.generateSphericalNormals(points, normals);
          } else if (mode == LGraphPoints3D.INSIDE_SPHERE) {
            LGraphPoints3D.generateInsideSphere(points, size, radius);
            if (normals)
              LGraphPoints3D.generateSphericalNormals(points, normals);
          } else if (mode == LGraphPoints3D.OBJECT) {
            LGraphPoints3D.generateFromObject(points, normals, size, obj, false);
          } else if (mode == LGraphPoints3D.OBJECT_UNIFORMLY) {
            LGraphPoints3D.generateFromObject(points, normals, size, obj, true);
          } else if (mode == LGraphPoints3D.OBJECT_INSIDE) {
            LGraphPoints3D.generateFromInsideObject(points, size, obj);
          } else
            console.warn("wrong mode in LGraphPoints3D");
        }
        return points;
      };
      LGraphPoints3D.generateSphericalNormals = function(points, normals) {
        var temp2 = new Float32Array(3);
        for (var i2 = 0; i2 < normals.length; i2 += 3) {
          temp2[0] = points[i2];
          temp2[1] = points[i2 + 1];
          temp2[2] = points[i2 + 2];
          vec3.normalize(temp2, temp2);
          normals.set(temp2, i2);
        }
      };
      LGraphPoints3D.generateSphere = function(points, size, radius) {
        for (var i2 = 0; i2 < size; i2 += 3) {
          var r1 = Math.random();
          var r2 = Math.random();
          var x2 = 2 * Math.cos(2 * Math.PI * r1) * Math.sqrt(r2 * (1 - r2));
          var y2 = 1 - 2 * r2;
          var z = 2 * Math.sin(2 * Math.PI * r1) * Math.sqrt(r2 * (1 - r2));
          points[i2] = x2 * radius;
          points[i2 + 1] = y2 * radius;
          points[i2 + 2] = z * radius;
        }
      };
      LGraphPoints3D.generateHemisphere = function(points, size, radius) {
        for (var i2 = 0; i2 < size; i2 += 3) {
          var r1 = Math.random();
          var r2 = Math.random();
          var x2 = Math.cos(2 * Math.PI * r1) * Math.sqrt(1 - r2 * r2);
          var y2 = r2;
          var z = Math.sin(2 * Math.PI * r1) * Math.sqrt(1 - r2 * r2);
          points[i2] = x2 * radius;
          points[i2 + 1] = y2 * radius;
          points[i2 + 2] = z * radius;
        }
      };
      LGraphPoints3D.generateInsideCircle = function(points, size, radius) {
        for (var i2 = 0; i2 < size; i2 += 3) {
          var r1 = Math.random();
          var r2 = Math.random();
          var x2 = Math.cos(2 * Math.PI * r1) * Math.sqrt(1 - r2 * r2);
          var z = Math.sin(2 * Math.PI * r1) * Math.sqrt(1 - r2 * r2);
          points[i2] = x2 * radius;
          points[i2 + 1] = 0;
          points[i2 + 2] = z * radius;
        }
      };
      LGraphPoints3D.generateInsideSphere = function(points, size, radius) {
        for (var i2 = 0; i2 < size; i2 += 3) {
          var u = Math.random();
          var v2 = Math.random();
          var theta = u * 2 * Math.PI;
          var phi = Math.acos(2 * v2 - 1);
          var r = Math.cbrt(Math.random()) * radius;
          var sinTheta = Math.sin(theta);
          var cosTheta = Math.cos(theta);
          var sinPhi = Math.sin(phi);
          var cosPhi = Math.cos(phi);
          points[i2] = r * sinPhi * cosTheta;
          points[i2 + 1] = r * sinPhi * sinTheta;
          points[i2 + 2] = r * cosPhi;
        }
      };
      function findRandomTriangle(areas, f) {
        var l = areas.length;
        var imin = 0;
        var imid = 0;
        var imax = l;
        if (l == 0)
          return -1;
        if (l == 1)
          return 0;
        while (imax >= imin) {
          imid = (imax + imin) * 0.5 | 0;
          var t = areas[imid];
          if (t == f)
            return imid;
          if (imin == imax - 1)
            return imin;
          if (t < f)
            imin = imid;
          else
            imax = imid;
        }
        return imid;
      }
      LGraphPoints3D.generateFromObject = function(points, normals, size, obj, evenly) {
        if (!obj)
          return;
        var vertices = null;
        var mesh_normals = null;
        var indices = null;
        var areas = null;
        if (obj.constructor === GL.Mesh) {
          vertices = obj.vertexBuffers.vertices.data;
          mesh_normals = obj.vertexBuffers.normals ? obj.vertexBuffers.normals.data : null;
          indices = obj.indexBuffers.indices ? obj.indexBuffers.indices.data : null;
          if (!indices)
            indices = obj.indexBuffers.triangles ? obj.indexBuffers.triangles.data : null;
        }
        if (!vertices)
          return null;
        var num_triangles = indices ? indices.length / 3 : vertices.length / (3 * 3);
        var total_area = 0;
        if (evenly) {
          areas = new Float32Array(num_triangles);
          for (var i2 = 0; i2 < num_triangles; ++i2) {
            if (indices) {
              a = indices[i2 * 3] * 3;
              b = indices[i2 * 3 + 1] * 3;
              c = indices[i2 * 3 + 2] * 3;
            } else {
              a = i2 * 9;
              b = i2 * 9 + 3;
              c = i2 * 9 + 6;
            }
            var P1 = vertices.subarray(a, a + 3);
            var P2 = vertices.subarray(b, b + 3);
            var P3 = vertices.subarray(c, c + 3);
            var aL = vec3.distance(P1, P2);
            var bL = vec3.distance(P2, P3);
            var cL = vec3.distance(P3, P1);
            var s = (aL + bL + cL) / 2;
            total_area += Math.sqrt(s * (s - aL) * (s - bL) * (s - cL));
            areas[i2] = total_area;
          }
          for (var i2 = 0; i2 < num_triangles; ++i2)
            areas[i2] /= total_area;
        }
        for (var i2 = 0; i2 < size; i2 += 3) {
          var r = Math.random();
          var index2 = evenly ? findRandomTriangle(areas, r) : Math.floor(r * num_triangles);
          var a = 0;
          var b = 0;
          var c = 0;
          if (indices) {
            a = indices[index2 * 3] * 3;
            b = indices[index2 * 3 + 1] * 3;
            c = indices[index2 * 3 + 2] * 3;
          } else {
            a = index2 * 9;
            b = index2 * 9 + 3;
            c = index2 * 9 + 6;
          }
          var s = Math.random();
          var t = Math.random();
          var sqrt_s = Math.sqrt(s);
          var af = 1 - sqrt_s;
          var bf = sqrt_s * (1 - t);
          var cf = t * sqrt_s;
          points[i2] = af * vertices[a] + bf * vertices[b] + cf * vertices[c];
          points[i2 + 1] = af * vertices[a + 1] + bf * vertices[b + 1] + cf * vertices[c + 1];
          points[i2 + 2] = af * vertices[a + 2] + bf * vertices[b + 2] + cf * vertices[c + 2];
          if (normals && mesh_normals) {
            normals[i2] = af * mesh_normals[a] + bf * mesh_normals[b] + cf * mesh_normals[c];
            normals[i2 + 1] = af * mesh_normals[a + 1] + bf * mesh_normals[b + 1] + cf * mesh_normals[c + 1];
            normals[i2 + 2] = af * mesh_normals[a + 2] + bf * mesh_normals[b + 2] + cf * mesh_normals[c + 2];
            var N = normals.subarray(i2, i2 + 3);
            vec3.normalize(N, N);
          }
        }
      };
      LGraphPoints3D.generateFromInsideObject = function(points, size, mesh) {
        if (!mesh || mesh.constructor !== GL.Mesh)
          return;
        var aabb = mesh.getBoundingBox();
        if (!mesh.octree)
          mesh.octree = new GL.Octree(mesh);
        var octree = mesh.octree;
        var origin = vec3.create();
        var direction = vec3.fromValues(1, 0, 0);
        var temp2 = vec3.create();
        var i2 = 0;
        var tries = 0;
        while (i2 < size && tries < points.length * 10) {
          tries += 1;
          var r = vec3.random(temp2);
          r[0] = (r[0] * 2 - 1) * aabb[3] + aabb[0];
          r[1] = (r[1] * 2 - 1) * aabb[4] + aabb[1];
          r[2] = (r[2] * 2 - 1) * aabb[5] + aabb[2];
          origin.set(r);
          var hit = octree.testRay(origin, direction, 0, 1e4, true, GL.Octree.ALL);
          if (!hit || hit.length % 2 == 0)
            continue;
          points.set(r, i2);
          i2 += 3;
        }
      };
      LiteGraph2.registerNodeType("geometry/points3D", LGraphPoints3D);
      function LGraphPointsToInstances() {
        this.addInput("points", "geometry");
        this.addOutput("instances", "[mat4]");
        this.properties = {
          mode: 1,
          autoupdate: true
        };
        this.must_update = true;
        this.matrices = [];
        this.first_time = true;
      }
      LGraphPointsToInstances.NORMAL = 0;
      LGraphPointsToInstances.VERTICAL = 1;
      LGraphPointsToInstances.SPHERICAL = 2;
      LGraphPointsToInstances.RANDOM = 3;
      LGraphPointsToInstances.RANDOM_VERTICAL = 4;
      LGraphPointsToInstances.modes = { "normal": 0, "vertical": 1, "spherical": 2, "random": 3, "random_vertical": 4 };
      LGraphPointsToInstances.widgets_info = {
        mode: { widget: "combo", values: LGraphPointsToInstances.modes }
      };
      LGraphPointsToInstances.title = "points to inst";
      LGraphPointsToInstances.prototype.onExecute = function() {
        var geo = this.getInputData(0);
        if (!geo) {
          this.setOutputData(0, null);
          return;
        }
        if (!this.isOutputConnected(0))
          return;
        var has_changed = geo._version != this._version || geo._id != this._geometry_id;
        if (has_changed && this.properties.autoupdate || this.first_time) {
          this.first_time = false;
          this.updateInstances(geo);
        }
        this.setOutputData(0, this.matrices);
      };
      LGraphPointsToInstances.prototype.updateInstances = function(geometry) {
        var vertices = geometry.vertices;
        if (!vertices)
          return null;
        var normals = geometry.normals;
        var matrices = this.matrices;
        var num_points = vertices.length / 3;
        if (matrices.length != num_points)
          matrices.length = num_points;
        var identity = mat4.create();
        var temp2 = vec3.create();
        vec3.create();
        var UP = vec3.fromValues(0, 1, 0);
        var FRONT = vec3.fromValues(0, 0, -1);
        vec3.fromValues(1, 0, 0);
        var R = quat.create();
        var front = vec3.create();
        var right = vec3.create();
        var top = vec3.create();
        for (var i2 = 0; i2 < vertices.length; i2 += 3) {
          var index2 = i2 / 3;
          var m = matrices[index2];
          if (!m)
            m = matrices[index2] = mat4.create();
          m.set(identity);
          var point = vertices.subarray(i2, i2 + 3);
          switch (this.properties.mode) {
            case LGraphPointsToInstances.NORMAL:
              mat4.setTranslation(m, point);
              if (normals) {
                var normal = normals.subarray(i2, i2 + 3);
                top.set(normal);
                vec3.normalize(top, top);
                vec3.cross(right, FRONT, top);
                vec3.normalize(right, right);
                vec3.cross(front, right, top);
                vec3.normalize(front, front);
                m.set(right, 0);
                m.set(top, 4);
                m.set(front, 8);
                mat4.setTranslation(m, point);
              }
              break;
            case LGraphPointsToInstances.VERTICAL:
              mat4.setTranslation(m, point);
              break;
            case LGraphPointsToInstances.SPHERICAL:
              front.set(point);
              vec3.normalize(front, front);
              vec3.cross(right, UP, front);
              vec3.normalize(right, right);
              vec3.cross(top, front, right);
              vec3.normalize(top, top);
              m.set(right, 0);
              m.set(top, 4);
              m.set(front, 8);
              mat4.setTranslation(m, point);
              break;
            case LGraphPointsToInstances.RANDOM:
              temp2[0] = Math.random() * 2 - 1;
              temp2[1] = Math.random() * 2 - 1;
              temp2[2] = Math.random() * 2 - 1;
              vec3.normalize(temp2, temp2);
              quat.setAxisAngle(R, temp2, Math.random() * 2 * Math.PI);
              mat4.fromQuat(m, R);
              mat4.setTranslation(m, point);
              break;
            case LGraphPointsToInstances.RANDOM_VERTICAL:
              quat.setAxisAngle(R, UP, Math.random() * 2 * Math.PI);
              mat4.fromQuat(m, R);
              mat4.setTranslation(m, point);
              break;
          }
        }
        this._version = geometry._version;
        this._geometry_id = geometry._id;
      };
      LiteGraph2.registerNodeType("geometry/points_to_instances", LGraphPointsToInstances);
      function LGraphGeometryTransform() {
        this.addInput("in", "geometry,[mat4]");
        this.addInput("mat4", "mat4");
        this.addOutput("out", "geometry");
        this.properties = {};
        this.geometry = {
          type: "triangles",
          vertices: null,
          _id: generateGeometryId(),
          _version: 0
        };
        this._last_geometry_id = -1;
        this._last_version = -1;
        this._last_key = "";
        this.must_update = true;
      }
      LGraphGeometryTransform.title = "Transform";
      LGraphGeometryTransform.prototype.onExecute = function() {
        var input = this.getInputData(0);
        var model = this.getInputData(1);
        if (!input)
          return;
        if (input.constructor === Array) {
          if (input.length == 0)
            return;
          this.outputs[0].type = "[mat4]";
          if (!this.isOutputConnected(0))
            return;
          if (!model) {
            this.setOutputData(0, input);
            return;
          }
          if (!this._output)
            this._output = new Array();
          if (this._output.length != input.length)
            this._output.length = input.length;
          for (var i2 = 0; i2 < input.length; ++i2) {
            var m = this._output[i2];
            if (!m)
              m = this._output[i2] = mat4.create();
            mat4.multiply(m, input[i2], model);
          }
          this.setOutputData(0, this._output);
          return;
        }
        if (!input.vertices || !input.vertices.length)
          return;
        var geo = input;
        this.outputs[0].type = "geometry";
        if (!this.isOutputConnected(0))
          return;
        if (!model) {
          this.setOutputData(0, geo);
          return;
        }
        var key = typedArrayToArray(model).join(",");
        if (this.must_update || geo._id != this._last_geometry_id || geo._version != this._last_version || key != this._last_key) {
          this.updateGeometry(geo, model);
          this._last_key = key;
          this._last_version = geo._version;
          this._last_geometry_id = geo._id;
          this.must_update = false;
        }
        this.setOutputData(0, this.geometry);
      };
      LGraphGeometryTransform.prototype.updateGeometry = function(geometry, model) {
        var old_vertices = geometry.vertices;
        var vertices = this.geometry.vertices;
        if (!vertices || vertices.length != old_vertices.length)
          vertices = this.geometry.vertices = new Float32Array(old_vertices.length);
        var temp2 = vec3.create();
        for (var i2 = 0, l = vertices.length; i2 < l; i2 += 3) {
          temp2[0] = old_vertices[i2];
          temp2[1] = old_vertices[i2 + 1];
          temp2[2] = old_vertices[i2 + 2];
          mat4.multiplyVec3(temp2, model, temp2);
          vertices[i2] = temp2[0];
          vertices[i2 + 1] = temp2[1];
          vertices[i2 + 2] = temp2[2];
        }
        if (geometry.normals) {
          if (!this.geometry.normals || this.geometry.normals.length != geometry.normals.length)
            this.geometry.normals = new Float32Array(geometry.normals.length);
          var normals = this.geometry.normals;
          var normal_model = mat4.invert(mat4.create(), model);
          if (normal_model)
            mat4.transpose(normal_model, normal_model);
          var old_normals = geometry.normals;
          for (var i2 = 0, l = normals.length; i2 < l; i2 += 3) {
            temp2[0] = old_normals[i2];
            temp2[1] = old_normals[i2 + 1];
            temp2[2] = old_normals[i2 + 2];
            mat4.multiplyVec3(temp2, normal_model, temp2);
            normals[i2] = temp2[0];
            normals[i2 + 1] = temp2[1];
            normals[i2 + 2] = temp2[2];
          }
        }
        this.geometry.type = geometry.type;
        this.geometry._version++;
      };
      LiteGraph2.registerNodeType("geometry/transform", LGraphGeometryTransform);
      function LGraphGeometryPolygon() {
        this.addInput("sides", "number");
        this.addInput("radius", "number");
        this.addOutput("out", "geometry");
        this.properties = { sides: 6, radius: 1, uvs: false };
        this.geometry = {
          type: "line_loop",
          vertices: null,
          _id: generateGeometryId()
        };
        this.geometry_id = -1;
        this.version = -1;
        this.must_update = true;
        this.last_info = { sides: -1, radius: -1 };
      }
      LGraphGeometryPolygon.title = "Polygon";
      LGraphGeometryPolygon.prototype.onExecute = function() {
        if (!this.isOutputConnected(0))
          return;
        var sides = this.getInputOrProperty("sides");
        var radius = this.getInputOrProperty("radius");
        sides = Math.max(3, sides) | 0;
        if (this.last_info.sides != sides || this.last_info.radius != radius)
          this.updateGeometry(sides, radius);
        this.setOutputData(0, this.geometry);
      };
      LGraphGeometryPolygon.prototype.updateGeometry = function(sides, radius) {
        var num = 3 * sides;
        var vertices = this.geometry.vertices;
        if (!vertices || vertices.length != num)
          vertices = this.geometry.vertices = new Float32Array(3 * sides);
        var delta2 = Math.PI * 2 / sides;
        var gen_uvs = this.properties.uvs;
        if (gen_uvs) {
          uvs = this.geometry.coords = new Float32Array(3 * sides);
        }
        for (var i2 = 0; i2 < sides; ++i2) {
          var angle = delta2 * -i2;
          var x2 = Math.cos(angle) * radius;
          var y2 = 0;
          var z = Math.sin(angle) * radius;
          vertices[i2 * 3] = x2;
          vertices[i2 * 3 + 1] = y2;
          vertices[i2 * 3 + 2] = z;
        }
        this.geometry._id = ++this.geometry_id;
        this.geometry._version = ++this.version;
        this.last_info.sides = sides;
        this.last_info.radius = radius;
      };
      LiteGraph2.registerNodeType("geometry/polygon", LGraphGeometryPolygon);
      function LGraphGeometryExtrude() {
        this.addInput("", "geometry");
        this.addOutput("", "geometry");
        this.properties = { top_cap: true, bottom_cap: true, offset: [0, 100, 0] };
        this.version = -1;
        this._last_geo_version = -1;
        this._must_update = true;
      }
      LGraphGeometryExtrude.title = "extrude";
      LGraphGeometryExtrude.prototype.onPropertyChanged = function(name, value) {
        this._must_update = true;
      };
      LGraphGeometryExtrude.prototype.onExecute = function() {
        var geo = this.getInputData(0);
        if (!geo || !this.isOutputConnected(0))
          return;
        if (geo.version != this._last_geo_version || this._must_update) {
          this._geo = this.extrudeGeometry(geo, this._geo);
          if (this._geo)
            this._geo.version = this.version++;
          this._must_update = false;
        }
        this.setOutputData(0, this._geo);
      };
      LGraphGeometryExtrude.prototype.extrudeGeometry = function(geo) {
        var vertices = geo.vertices;
        var num_points = vertices.length / 3;
        var tempA2 = vec3.create();
        var tempB2 = vec3.create();
        var tempC = vec3.create();
        var tempD = vec3.create();
        var offset = new Float32Array(this.properties.offset);
        if (geo.type == "line_loop") {
          var new_vertices = new Float32Array(num_points * 6 * 3);
          var npos = 0;
          for (var i2 = 0, l = vertices.length; i2 < l; i2 += 3) {
            tempA2[0] = vertices[i2];
            tempA2[1] = vertices[i2 + 1];
            tempA2[2] = vertices[i2 + 2];
            if (i2 + 3 < l) {
              tempB2[0] = vertices[i2 + 3];
              tempB2[1] = vertices[i2 + 4];
              tempB2[2] = vertices[i2 + 5];
            } else {
              tempB2[0] = vertices[0];
              tempB2[1] = vertices[1];
              tempB2[2] = vertices[2];
            }
            vec3.add(tempC, tempA2, offset);
            vec3.add(tempD, tempB2, offset);
            new_vertices.set(tempA2, npos);
            npos += 3;
            new_vertices.set(tempB2, npos);
            npos += 3;
            new_vertices.set(tempC, npos);
            npos += 3;
            new_vertices.set(tempB2, npos);
            npos += 3;
            new_vertices.set(tempD, npos);
            npos += 3;
            new_vertices.set(tempC, npos);
            npos += 3;
          }
        }
        var out_geo = {
          _id: generateGeometryId(),
          type: "triangles",
          vertices: new_vertices
        };
        return out_geo;
      };
      LiteGraph2.registerNodeType("geometry/extrude", LGraphGeometryExtrude);
      function LGraphGeometryEval() {
        this.addInput("in", "geometry");
        this.addOutput("out", "geometry");
        this.properties = {
          code: "V[1] += 0.01 * Math.sin(I + T*0.001);",
          execute_every_frame: false
        };
        this.geometry = null;
        this.geometry_id = -1;
        this.version = -1;
        this.must_update = true;
        this.vertices = null;
        this.func = null;
      }
      LGraphGeometryEval.title = "geoeval";
      LGraphGeometryEval.desc = "eval code";
      LGraphGeometryEval.widgets_info = {
        code: { widget: "code" }
      };
      LGraphGeometryEval.prototype.onConfigure = function(o) {
        this.compileCode();
      };
      LGraphGeometryEval.prototype.compileCode = function() {
        if (!this.properties.code)
          return;
        try {
          this.func = new Function("V", "I", "T", this.properties.code);
          this.boxcolor = "#AFA";
          this.must_update = true;
        } catch (err) {
          this.boxcolor = "red";
        }
      };
      LGraphGeometryEval.prototype.onPropertyChanged = function(name, value) {
        if (name == "code") {
          this.properties.code = value;
          this.compileCode();
        }
      };
      LGraphGeometryEval.prototype.onExecute = function() {
        var geometry = this.getInputData(0);
        if (!geometry)
          return;
        if (!this.func) {
          this.setOutputData(0, geometry);
          return;
        }
        if (this.geometry_id != geometry._id || this.version != geometry._version || this.must_update || this.properties.execute_every_frame) {
          this.must_update = false;
          this.geometry_id = geometry._id;
          if (this.properties.execute_every_frame)
            this.version++;
          else
            this.version = geometry._version;
          var func = this.func;
          var T = getTime();
          if (!this.geometry)
            this.geometry = {};
          for (var i2 in geometry) {
            if (geometry[i2] == null)
              continue;
            if (geometry[i2].constructor == Float32Array)
              this.geometry[i2] = new Float32Array(geometry[i2]);
            else
              this.geometry[i2] = geometry[i2];
          }
          this.geometry._id = geometry._id;
          if (this.properties.execute_every_frame)
            this.geometry._version = this.version;
          else
            this.geometry._version = geometry._version + 1;
          var V = vec3.create();
          var vertices = this.vertices;
          if (!vertices || this.vertices.length != geometry.vertices.length)
            vertices = this.vertices = new Float32Array(geometry.vertices);
          else
            vertices.set(geometry.vertices);
          for (var i2 = 0; i2 < vertices.length; i2 += 3) {
            V[0] = vertices[i2];
            V[1] = vertices[i2 + 1];
            V[2] = vertices[i2 + 2];
            func(V, i2 / 3, T);
            vertices[i2] = V[0];
            vertices[i2 + 1] = V[1];
            vertices[i2 + 2] = V[2];
          }
          this.geometry.vertices = vertices;
        }
        this.setOutputData(0, this.geometry);
      };
      LiteGraph2.registerNodeType("geometry/eval", LGraphGeometryEval);
      function LGraphConnectPoints() {
        this.addInput("in", "geometry");
        this.addOutput("out", "geometry");
        this.properties = {
          min_dist: 0.4,
          max_dist: 0.5,
          max_connections: 0,
          probability: 1
        };
        this.geometry_id = -1;
        this.version = -1;
        this.my_version = 1;
        this.must_update = true;
      }
      LGraphConnectPoints.title = "connect points";
      LGraphConnectPoints.desc = "adds indices between near points";
      LGraphConnectPoints.prototype.onPropertyChanged = function(name, value) {
        this.must_update = true;
      };
      LGraphConnectPoints.prototype.onExecute = function() {
        var geometry = this.getInputData(0);
        if (!geometry)
          return;
        if (this.geometry_id != geometry._id || this.version != geometry._version || this.must_update) {
          this.must_update = false;
          this.geometry_id = geometry._id;
          this.version = geometry._version;
          this.geometry = {};
          for (var i2 in geometry)
            this.geometry[i2] = geometry[i2];
          this.geometry._id = generateGeometryId();
          this.geometry._version = this.my_version++;
          var vertices = geometry.vertices;
          var l = vertices.length;
          var min_dist = this.properties.min_dist;
          var max_dist = this.properties.max_dist;
          var probability = this.properties.probability;
          var max_connections = this.properties.max_connections;
          var indices = [];
          for (var i2 = 0; i2 < l; i2 += 3) {
            var x2 = vertices[i2];
            var y2 = vertices[i2 + 1];
            var z = vertices[i2 + 2];
            var connections = 0;
            for (var j = i2 + 3; j < l; j += 3) {
              var x22 = vertices[j];
              var y22 = vertices[j + 1];
              var z2 = vertices[j + 2];
              var dist = Math.sqrt((x2 - x22) * (x2 - x22) + (y2 - y22) * (y2 - y22) + (z - z2) * (z - z2));
              if (dist > max_dist || dist < min_dist || probability < 1 && probability < Math.random())
                continue;
              indices.push(i2 / 3, j / 3);
              connections += 1;
              if (max_connections && connections > max_connections)
                break;
            }
          }
          this.geometry.indices = this.indices = new Uint32Array(indices);
        }
        if (this.indices && this.indices.length) {
          this.geometry.indices = this.indices;
          this.setOutputData(0, this.geometry);
        } else
          this.setOutputData(0, null);
      };
      LiteGraph2.registerNodeType("geometry/connectPoints", LGraphConnectPoints);
      if (typeof GL == "undefined")
        return;
      function LGraphToGeometry() {
        this.addInput("mesh", "mesh");
        this.addOutput("out", "geometry");
        this.geometry = {};
        this.last_mesh = null;
      }
      LGraphToGeometry.title = "to geometry";
      LGraphToGeometry.desc = "converts a mesh to geometry";
      LGraphToGeometry.prototype.onExecute = function() {
        var mesh = this.getInputData(0);
        if (!mesh)
          return;
        if (mesh != this.last_mesh) {
          this.last_mesh = mesh;
          for (i in mesh.vertexBuffers) {
            var buffer = mesh.vertexBuffers[i];
            this.geometry[i] = buffer.data;
          }
          if (mesh.indexBuffers["triangles"])
            this.geometry.indices = mesh.indexBuffers["triangles"].data;
          this.geometry._id = generateGeometryId();
          this.geometry._version = 0;
        }
        this.setOutputData(0, this.geometry);
        if (this.geometry)
          this.setOutputData(1, this.geometry.vertices);
      };
      LiteGraph2.registerNodeType("geometry/toGeometry", LGraphToGeometry);
      function LGraphGeometryToMesh() {
        this.addInput("in", "geometry");
        this.addOutput("mesh", "mesh");
        this.properties = {};
        this.version = -1;
        this.mesh = null;
      }
      LGraphGeometryToMesh.title = "Geo to Mesh";
      LGraphGeometryToMesh.prototype.updateMesh = function(geometry) {
        if (!this.mesh)
          this.mesh = new GL.Mesh();
        for (var i2 in geometry) {
          if (i2[0] == "_")
            continue;
          var buffer_data = geometry[i2];
          var info = GL.Mesh.common_buffers[i2];
          if (!info && i2 != "indices")
            continue;
          var spacing = info ? info.spacing : 3;
          var mesh_buffer = this.mesh.vertexBuffers[i2];
          if (!mesh_buffer || mesh_buffer.data.length != buffer_data.length) {
            mesh_buffer = new GL.Buffer(i2 == "indices" ? GL.ELEMENT_ARRAY_BUFFER : GL.ARRAY_BUFFER, buffer_data, spacing, GL.DYNAMIC_DRAW);
          } else {
            mesh_buffer.data.set(buffer_data);
            mesh_buffer.upload(GL.DYNAMIC_DRAW);
          }
          this.mesh.addBuffer(i2, mesh_buffer);
        }
        if (this.mesh.vertexBuffers.normals && this.mesh.vertexBuffers.normals.data.length != this.mesh.vertexBuffers.vertices.data.length) {
          var n = new Float32Array([0, 1, 0]);
          var normals = new Float32Array(this.mesh.vertexBuffers.vertices.data.length);
          for (var i2 = 0; i2 < normals.length; i2 += 3)
            normals.set(n, i2);
          mesh_buffer = new GL.Buffer(GL.ARRAY_BUFFER, normals, 3);
          this.mesh.addBuffer("normals", mesh_buffer);
        }
        this.mesh.updateBoundingBox();
        this.geometry_id = this.mesh.id = geometry._id;
        this.version = this.mesh.version = geometry._version;
        return this.mesh;
      };
      LGraphGeometryToMesh.prototype.onExecute = function() {
        var geometry = this.getInputData(0);
        if (!geometry)
          return;
        if (this.version != geometry._version || this.geometry_id != geometry._id)
          this.updateMesh(geometry);
        this.setOutputData(0, this.mesh);
      };
      LiteGraph2.registerNodeType("geometry/toMesh", LGraphGeometryToMesh);
      function LGraphRenderMesh() {
        this.addInput("mesh", "mesh");
        this.addInput("mat4", "mat4");
        this.addInput("tex", "texture");
        this.properties = {
          enabled: true,
          primitive: GL.TRIANGLES,
          additive: false,
          color: [1, 1, 1],
          opacity: 1
        };
        this.color = vec4.create([1, 1, 1, 1]);
        this.model_matrix = mat4.create();
        this.uniforms = {
          u_color: this.color,
          u_model: this.model_matrix
        };
      }
      LGraphRenderMesh.title = "Render Mesh";
      LGraphRenderMesh.desc = "renders a mesh flat";
      LGraphRenderMesh.PRIMITIVE_VALUES = { "points": GL.POINTS, "lines": GL.LINES, "line_loop": GL.LINE_LOOP, "line_strip": GL.LINE_STRIP, "triangles": GL.TRIANGLES, "triangle_fan": GL.TRIANGLE_FAN, "triangle_strip": GL.TRIANGLE_STRIP };
      LGraphRenderMesh.widgets_info = {
        primitive: { widget: "combo", values: LGraphRenderMesh.PRIMITIVE_VALUES },
        color: { widget: "color" }
      };
      LGraphRenderMesh.prototype.onExecute = function() {
        if (!this.properties.enabled)
          return;
        var mesh = this.getInputData(0);
        if (!mesh)
          return;
        if (!LiteGraph2.LGraphRender.onRequestCameraMatrices) {
          console.warn("cannot render geometry, LiteGraph.onRequestCameraMatrices is null, remember to fill this with a callback(view_matrix, projection_matrix,viewprojection_matrix) to use 3D rendering from the graph");
          return;
        }
        LiteGraph2.LGraphRender.onRequestCameraMatrices(view_matrix, projection_matrix, viewprojection_matrix);
        var shader = null;
        var texture = this.getInputData(2);
        if (texture) {
          shader = gl.shaders["textured"];
          if (!shader)
            shader = gl.shaders["textured"] = new GL.Shader(LGraphRenderPoints.vertex_shader_code, LGraphRenderPoints.fragment_shader_code, { USE_TEXTURE: "" });
        } else {
          shader = gl.shaders["flat"];
          if (!shader)
            shader = gl.shaders["flat"] = new GL.Shader(LGraphRenderPoints.vertex_shader_code, LGraphRenderPoints.fragment_shader_code);
        }
        this.color.set(this.properties.color);
        this.color[3] = this.properties.opacity;
        var model_matrix2 = this.model_matrix;
        var m = this.getInputData(1);
        if (m)
          model_matrix2.set(m);
        else
          mat4.identity(model_matrix2);
        this.uniforms.u_point_size = 1;
        var primitive = this.properties.primitive;
        shader.uniforms(global_uniforms);
        shader.uniforms(this.uniforms);
        if (this.properties.opacity >= 1)
          gl.disable(gl.BLEND);
        else
          gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        if (this.properties.additive) {
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
          gl.depthMask(false);
        } else
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        var indices = "indices";
        if (mesh.indexBuffers.triangles)
          indices = "triangles";
        shader.draw(mesh, primitive, indices);
        gl.disable(gl.BLEND);
        gl.depthMask(true);
      };
      LiteGraph2.registerNodeType("geometry/render_mesh", LGraphRenderMesh);
      function LGraphGeometryPrimitive() {
        this.addInput("size", "number");
        this.addOutput("out", "mesh");
        this.properties = { type: 1, size: 1, subdivisions: 32 };
        this.version = Math.random() * 1e5 | 0;
        this.last_info = { type: -1, size: -1, subdivisions: -1 };
      }
      LGraphGeometryPrimitive.title = "Primitive";
      LGraphGeometryPrimitive.VALID = { "CUBE": 1, "PLANE": 2, "CYLINDER": 3, "SPHERE": 4, "CIRCLE": 5, "HEMISPHERE": 6, "ICOSAHEDRON": 7, "CONE": 8, "QUAD": 9 };
      LGraphGeometryPrimitive.widgets_info = {
        type: { widget: "combo", values: LGraphGeometryPrimitive.VALID }
      };
      LGraphGeometryPrimitive.prototype.onExecute = function() {
        if (!this.isOutputConnected(0))
          return;
        var size = this.getInputOrProperty("size");
        if (this.last_info.type != this.properties.type || this.last_info.size != size || this.last_info.subdivisions != this.properties.subdivisions)
          this.updateMesh(this.properties.type, size, this.properties.subdivisions);
        this.setOutputData(0, this._mesh);
      };
      LGraphGeometryPrimitive.prototype.updateMesh = function(type, size, subdivisions) {
        subdivisions = Math.max(0, subdivisions) | 0;
        switch (type) {
          case 1:
            this._mesh = GL.Mesh.cube({ size, normals: true, coords: true });
            break;
          case 2:
            this._mesh = GL.Mesh.plane({ size, xz: true, detail: subdivisions, normals: true, coords: true });
            break;
          case 3:
            this._mesh = GL.Mesh.cylinder({ size, subdivisions, normals: true, coords: true });
            break;
          case 4:
            this._mesh = GL.Mesh.sphere({ size, "long": subdivisions, lat: subdivisions, normals: true, coords: true });
            break;
          case 5:
            this._mesh = GL.Mesh.circle({ size, slices: subdivisions, normals: true, coords: true });
            break;
          case 6:
            this._mesh = GL.Mesh.sphere({ size, "long": subdivisions, lat: subdivisions, normals: true, coords: true, hemi: true });
            break;
          case 7:
            this._mesh = GL.Mesh.icosahedron({ size, subdivisions });
            break;
          case 8:
            this._mesh = GL.Mesh.cone({ radius: size, height: size, subdivisions });
            break;
          case 9:
            this._mesh = GL.Mesh.plane({ size, xz: false, detail: subdivisions, normals: true, coords: true });
            break;
        }
        this.last_info.type = type;
        this.last_info.size = size;
        this.last_info.subdivisions = subdivisions;
        this._mesh.version = this.version++;
      };
      LiteGraph2.registerNodeType("geometry/mesh_primitive", LGraphGeometryPrimitive);
      function LGraphRenderPoints() {
        this.addInput("in", "geometry");
        this.addInput("mat4", "mat4");
        this.addInput("tex", "texture");
        this.properties = {
          enabled: true,
          point_size: 0.1,
          fixed_size: false,
          additive: true,
          color: [1, 1, 1],
          opacity: 1
        };
        this.color = vec4.create([1, 1, 1, 1]);
        this.uniforms = {
          u_point_size: 1,
          u_perspective: 1,
          u_point_perspective: 1,
          u_color: this.color
        };
        this.geometry_id = -1;
        this.version = -1;
        this.mesh = null;
      }
      LGraphRenderPoints.title = "renderPoints";
      LGraphRenderPoints.desc = "render points with a texture";
      LGraphRenderPoints.widgets_info = {
        color: { widget: "color" }
      };
      LGraphRenderPoints.prototype.updateMesh = function(geometry) {
        this.buffer;
        if (!this.buffer || !this.buffer.data || this.buffer.data.length != geometry.vertices.length)
          this.buffer = new GL.Buffer(GL.ARRAY_BUFFER, geometry.vertices, 3, GL.DYNAMIC_DRAW);
        else {
          this.buffer.data.set(geometry.vertices);
          this.buffer.upload(GL.DYNAMIC_DRAW);
        }
        if (!this.mesh)
          this.mesh = new GL.Mesh();
        this.mesh.addBuffer("vertices", this.buffer);
        this.geometry_id = this.mesh.id = geometry._id;
        this.version = this.mesh.version = geometry._version;
      };
      LGraphRenderPoints.prototype.onExecute = function() {
        if (!this.properties.enabled)
          return;
        var geometry = this.getInputData(0);
        if (!geometry)
          return;
        if (this.version != geometry._version || this.geometry_id != geometry._id)
          this.updateMesh(geometry);
        if (!LiteGraph2.LGraphRender.onRequestCameraMatrices) {
          console.warn("cannot render geometry, LiteGraph.onRequestCameraMatrices is null, remember to fill this with a callback(view_matrix, projection_matrix,viewprojection_matrix) to use 3D rendering from the graph");
          return;
        }
        LiteGraph2.LGraphRender.onRequestCameraMatrices(view_matrix, projection_matrix, viewprojection_matrix);
        var shader = null;
        var texture = this.getInputData(2);
        if (texture) {
          shader = gl.shaders["textured_points"];
          if (!shader)
            shader = gl.shaders["textured_points"] = new GL.Shader(LGraphRenderPoints.vertex_shader_code, LGraphRenderPoints.fragment_shader_code, { USE_TEXTURED_POINTS: "" });
        } else {
          shader = gl.shaders["points"];
          if (!shader)
            shader = gl.shaders["points"] = new GL.Shader(LGraphRenderPoints.vertex_shader_code, LGraphRenderPoints.fragment_shader_code, { USE_POINTS: "" });
        }
        this.color.set(this.properties.color);
        this.color[3] = this.properties.opacity;
        var m = this.getInputData(1);
        if (m)
          model_matrix.set(m);
        else
          mat4.identity(model_matrix);
        this.uniforms.u_point_size = this.properties.point_size;
        this.uniforms.u_point_perspective = this.properties.fixed_size ? 0 : 1;
        this.uniforms.u_perspective = gl.viewport_data[3] * projection_matrix[5];
        shader.uniforms(global_uniforms);
        shader.uniforms(this.uniforms);
        if (this.properties.opacity >= 1)
          gl.disable(gl.BLEND);
        else
          gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        if (this.properties.additive) {
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
          gl.depthMask(false);
        } else
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        shader.draw(this.mesh, GL.POINTS);
        gl.disable(gl.BLEND);
        gl.depthMask(true);
      };
      LiteGraph2.registerNodeType("geometry/render_points", LGraphRenderPoints);
      LGraphRenderPoints.vertex_shader_code = "				precision mediump float;\n				attribute vec3 a_vertex;\n				varying vec3 v_vertex;\n				attribute vec3 a_normal;\n				varying vec3 v_normal;\n				#ifdef USE_COLOR\n					attribute vec4 a_color;\n					varying vec4 v_color;\n				#endif\n				attribute vec2 a_coord;\n				varying vec2 v_coord;\n				#ifdef USE_SIZE\n					attribute float a_extra;\n				#endif\n				#ifdef USE_INSTANCING\n					attribute mat4 u_model;\n				#else\n					uniform mat4 u_model;\n				#endif\n				uniform mat4 u_viewprojection;\n				uniform float u_point_size;\n				uniform float u_perspective;\n				uniform float u_point_perspective;\n				float computePointSize(float radius, float w)\n				{\n					if(radius < 0.0)\n						return -radius;\n					return u_perspective * radius / w;\n				}\n				void main() {\n					v_coord = a_coord;\n					#ifdef USE_COLOR\n						v_color = a_color;\n					#endif\n					v_vertex = ( u_model * vec4( a_vertex, 1.0 )).xyz;\n					v_normal = ( u_model * vec4( a_normal, 0.0 )).xyz;\n					gl_Position = u_viewprojection * vec4(v_vertex,1.0);\n					gl_PointSize = u_point_size;\n					#ifdef USE_SIZE\n						gl_PointSize = a_extra;\n					#endif\n					if(u_point_perspective != 0.0)\n						gl_PointSize = computePointSize( gl_PointSize, gl_Position.w );\n				}			";
      LGraphRenderPoints.fragment_shader_code = "				precision mediump float;\n				uniform vec4 u_color;\n				#ifdef USE_COLOR\n					varying vec4 v_color;\n				#endif\n				varying vec2 v_coord;\n				uniform sampler2D u_texture;\n				void main() {\n					vec4 color = u_color;\n					#ifdef USE_TEXTURED_POINTS\n						color *= texture2D(u_texture, gl_PointCoord.xy);\n					#else\n						#ifdef USE_TEXTURE\n						  color *= texture2D(u_texture, v_coord);\n						  if(color.a < 0.1)\n							discard;\n						#endif\n						#ifdef USE_POINTS\n							float dist = length( gl_PointCoord.xy - vec2(0.5) );\n							if( dist > 0.45 )\n								discard;\n						#endif\n					#endif\n					#ifdef USE_COLOR\n						color *= v_color;\n					#endif\n					gl_FragColor = color;\n				}			";
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      var LGraphTexture2 = global2.LGraphTexture;
      if (typeof GL != "undefined") {
        let LGraphFXLens = function() {
          this.addInput("Texture", "Texture");
          this.addInput("Aberration", "number");
          this.addInput("Distortion", "number");
          this.addInput("Blur", "number");
          this.addOutput("Texture", "Texture");
          this.properties = {
            aberration: 1,
            distortion: 1,
            blur: 1,
            precision: LGraphTexture2.DEFAULT
          };
          if (!LGraphFXLens._shader) {
            LGraphFXLens._shader = new GL.Shader(
              GL.Shader.SCREEN_VERTEX_SHADER,
              LGraphFXLens.pixel_shader
            );
            LGraphFXLens._texture = new GL.Texture(3, 1, {
              format: gl.RGB,
              wrap: gl.CLAMP_TO_EDGE,
              magFilter: gl.LINEAR,
              minFilter: gl.LINEAR,
              pixel_data: [255, 0, 0, 0, 255, 0, 0, 0, 255]
            });
          }
        }, LGraphFXBokeh = function() {
          this.addInput("Texture", "Texture");
          this.addInput("Blurred", "Texture");
          this.addInput("Mask", "Texture");
          this.addInput("Threshold", "number");
          this.addOutput("Texture", "Texture");
          this.properties = {
            shape: "",
            size: 10,
            alpha: 1,
            threshold: 1,
            high_precision: false
          };
        }, LGraphFXGeneric = function() {
          this.addInput("Texture", "Texture");
          this.addInput("value1", "number");
          this.addInput("value2", "number");
          this.addOutput("Texture", "Texture");
          this.properties = {
            fx: "halftone",
            value1: 1,
            value2: 1,
            precision: LGraphTexture2.DEFAULT
          };
        }, LGraphFXVigneting = function() {
          this.addInput("Tex.", "Texture");
          this.addInput("intensity", "number");
          this.addOutput("Texture", "Texture");
          this.properties = {
            intensity: 1,
            invert: false,
            precision: LGraphTexture2.DEFAULT
          };
          if (!LGraphFXVigneting._shader) {
            LGraphFXVigneting._shader = new GL.Shader(
              Shader.SCREEN_VERTEX_SHADER,
              LGraphFXVigneting.pixel_shader
            );
          }
        };
        LGraphFXLens.title = "Lens";
        LGraphFXLens.desc = "Camera Lens distortion";
        LGraphFXLens.widgets_info = {
          precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
        };
        LGraphFXLens.prototype.onExecute = function() {
          var tex = this.getInputData(0);
          if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
            this.setOutputData(0, tex);
            return;
          }
          if (!tex) {
            return;
          }
          this._tex = LGraphTexture2.getTargetTexture(
            tex,
            this._tex,
            this.properties.precision
          );
          var aberration = this.properties.aberration;
          if (this.isInputConnected(1)) {
            aberration = this.getInputData(1);
            this.properties.aberration = aberration;
          }
          var distortion = this.properties.distortion;
          if (this.isInputConnected(2)) {
            distortion = this.getInputData(2);
            this.properties.distortion = distortion;
          }
          var blur = this.properties.blur;
          if (this.isInputConnected(3)) {
            blur = this.getInputData(3);
            this.properties.blur = blur;
          }
          gl.disable(gl.BLEND);
          gl.disable(gl.DEPTH_TEST);
          var mesh = Mesh.getScreenQuad();
          var shader = LGraphFXLens._shader;
          this._tex.drawTo(function() {
            tex.bind(0);
            shader.uniforms({
              u_texture: 0,
              u_aberration: aberration,
              u_distortion: distortion,
              u_blur: blur
            }).draw(mesh);
          });
          this.setOutputData(0, this._tex);
        };
        LGraphFXLens.pixel_shader = "precision highp float;\n					precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform vec2 u_camera_planes;\n					uniform float u_aberration;\n					uniform float u_distortion;\n					uniform float u_blur;\n					\n					void main() {\n						vec2 coord = v_coord;\n						float dist = distance(vec2(0.5), coord);\n						vec2 dist_coord = coord - vec2(0.5);\n						float percent = 1.0 + ((0.5 - dist) / 0.5) * u_distortion;\n						dist_coord *= percent;\n						coord = dist_coord + vec2(0.5);\n						vec4 color = texture2D(u_texture,coord, u_blur * dist);\n						color.r = texture2D(u_texture,vec2(0.5) + dist_coord * (1.0+0.01*u_aberration), u_blur * dist ).r;\n						color.b = texture2D(u_texture,vec2(0.5) + dist_coord * (1.0-0.01*u_aberration), u_blur * dist ).b;\n						gl_FragColor = color;\n					}\n					";
        LiteGraph2.registerNodeType("fx/lens", LGraphFXLens);
        global2.LGraphFXLens = LGraphFXLens;
        LGraphFXBokeh.title = "Bokeh";
        LGraphFXBokeh.desc = "applies an Bokeh effect";
        LGraphFXBokeh.widgets_info = { shape: { widget: "texture" } };
        LGraphFXBokeh.prototype.onExecute = function() {
          var tex = this.getInputData(0);
          var blurred_tex = this.getInputData(1);
          var mask_tex = this.getInputData(2);
          if (!tex || !mask_tex || !this.properties.shape) {
            this.setOutputData(0, tex);
            return;
          }
          if (!blurred_tex) {
            blurred_tex = tex;
          }
          var shape_tex = LGraphTexture2.getTexture(this.properties.shape);
          if (!shape_tex) {
            return;
          }
          var threshold = this.properties.threshold;
          if (this.isInputConnected(3)) {
            threshold = this.getInputData(3);
            this.properties.threshold = threshold;
          }
          var precision = gl.UNSIGNED_BYTE;
          if (this.properties.high_precision) {
            precision = gl.half_float_ext ? gl.HALF_FLOAT_OES : gl.FLOAT;
          }
          if (!this._temp_texture || this._temp_texture.type != precision || this._temp_texture.width != tex.width || this._temp_texture.height != tex.height) {
            this._temp_texture = new GL.Texture(tex.width, tex.height, {
              type: precision,
              format: gl.RGBA,
              filter: gl.LINEAR
            });
          }
          this.properties.size;
          var first_shader = LGraphFXBokeh._first_shader;
          if (!first_shader) {
            first_shader = LGraphFXBokeh._first_shader = new GL.Shader(
              Shader.SCREEN_VERTEX_SHADER,
              LGraphFXBokeh._first_pixel_shader
            );
          }
          var second_shader = LGraphFXBokeh._second_shader;
          if (!second_shader) {
            second_shader = LGraphFXBokeh._second_shader = new GL.Shader(
              LGraphFXBokeh._second_vertex_shader,
              LGraphFXBokeh._second_pixel_shader
            );
          }
          var points_mesh = this._points_mesh;
          if (!points_mesh || points_mesh._width != tex.width || points_mesh._height != tex.height || points_mesh._spacing != 2) {
            points_mesh = this.createPointsMesh(tex.width, tex.height, 2);
          }
          var screen_mesh = Mesh.getScreenQuad();
          var point_size = this.properties.size;
          this.properties.min_light;
          var alpha = this.properties.alpha;
          gl.disable(gl.DEPTH_TEST);
          gl.disable(gl.BLEND);
          this._temp_texture.drawTo(function() {
            tex.bind(0);
            blurred_tex.bind(1);
            mask_tex.bind(2);
            first_shader.uniforms({
              u_texture: 0,
              u_texture_blur: 1,
              u_mask: 2,
              u_texsize: [tex.width, tex.height]
            }).draw(screen_mesh);
          });
          this._temp_texture.drawTo(function() {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);
            tex.bind(0);
            shape_tex.bind(3);
            second_shader.uniforms({
              u_texture: 0,
              u_mask: 2,
              u_shape: 3,
              u_alpha: alpha,
              u_threshold: threshold,
              u_pointSize: point_size,
              u_itexsize: [1 / tex.width, 1 / tex.height]
            }).draw(points_mesh, gl.POINTS);
          });
          this.setOutputData(0, this._temp_texture);
        };
        LGraphFXBokeh.prototype.createPointsMesh = function(width2, height, spacing) {
          var nwidth = Math.round(width2 / spacing);
          var nheight = Math.round(height / spacing);
          var vertices = new Float32Array(nwidth * nheight * 2);
          var ny = -1;
          var dx = 2 / width2 * spacing;
          var dy = 2 / height * spacing;
          for (var y2 = 0; y2 < nheight; ++y2) {
            var nx = -1;
            for (var x2 = 0; x2 < nwidth; ++x2) {
              var pos2 = y2 * nwidth * 2 + x2 * 2;
              vertices[pos2] = nx;
              vertices[pos2 + 1] = ny;
              nx += dx;
            }
            ny += dy;
          }
          this._points_mesh = GL.Mesh.load({ vertices2D: vertices });
          this._points_mesh._width = width2;
          this._points_mesh._height = height;
          this._points_mesh._spacing = spacing;
          return this._points_mesh;
        };
        LGraphFXBokeh._first_pixel_shader = "precision highp float;\n					precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform sampler2D u_texture_blur;\n					uniform sampler2D u_mask;\n					\n					void main() {\n						vec4 color = texture2D(u_texture, v_coord);\n						vec4 blurred_color = texture2D(u_texture_blur, v_coord);\n						float mask = texture2D(u_mask, v_coord).x;\n					   gl_FragColor = mix(color, blurred_color, mask);\n					}\n					";
        LGraphFXBokeh._second_vertex_shader = "precision highp float;\n					attribute vec2 a_vertex2D;\n					varying vec4 v_color;\n					uniform sampler2D u_texture;\n					uniform sampler2D u_mask;\n					uniform vec2 u_itexsize;\n					uniform float u_pointSize;\n					uniform float u_threshold;\n					void main() {\n						vec2 coord = a_vertex2D * 0.5 + 0.5;\n						v_color = texture2D( u_texture, coord );\n						v_color += texture2D( u_texture, coord + vec2(u_itexsize.x, 0.0) );\n						v_color += texture2D( u_texture, coord + vec2(0.0, u_itexsize.y));\n						v_color += texture2D( u_texture, coord + u_itexsize);\n						v_color *= 0.25;\n						float mask = texture2D(u_mask, coord).x;\n						float luminance = length(v_color) * mask;\n						/*luminance /= (u_pointSize*u_pointSize)*0.01 */;\n						luminance -= u_threshold;\n						if(luminance < 0.0)\n						{\n							gl_Position.x = -100.0;\n							return;\n						}\n						gl_PointSize = u_pointSize;\n						gl_Position = vec4(a_vertex2D,0.0,1.0);\n					}\n					";
        LGraphFXBokeh._second_pixel_shader = "precision highp float;\n					varying vec4 v_color;\n					uniform sampler2D u_shape;\n					uniform float u_alpha;\n					\n					void main() {\n						vec4 color = texture2D( u_shape, gl_PointCoord );\n						color *= v_color * u_alpha;\n						gl_FragColor = color;\n					}\n";
        LiteGraph2.registerNodeType("fx/bokeh", LGraphFXBokeh);
        global2.LGraphFXBokeh = LGraphFXBokeh;
        LGraphFXGeneric.title = "FX";
        LGraphFXGeneric.desc = "applies an FX from a list";
        LGraphFXGeneric.widgets_info = {
          fx: {
            widget: "combo",
            values: ["halftone", "pixelate", "lowpalette", "noise", "gamma"]
          },
          precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
        };
        LGraphFXGeneric.shaders = {};
        LGraphFXGeneric.prototype.onExecute = function() {
          if (!this.isOutputConnected(0)) {
            return;
          }
          var tex = this.getInputData(0);
          if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
            this.setOutputData(0, tex);
            return;
          }
          if (!tex) {
            return;
          }
          this._tex = LGraphTexture2.getTargetTexture(
            tex,
            this._tex,
            this.properties.precision
          );
          var value1 = this.properties.value1;
          if (this.isInputConnected(1)) {
            value1 = this.getInputData(1);
            this.properties.value1 = value1;
          }
          var value2 = this.properties.value2;
          if (this.isInputConnected(2)) {
            value2 = this.getInputData(2);
            this.properties.value2 = value2;
          }
          var fx = this.properties.fx;
          var shader = LGraphFXGeneric.shaders[fx];
          if (!shader) {
            var pixel_shader_code = LGraphFXGeneric["pixel_shader_" + fx];
            if (!pixel_shader_code) {
              return;
            }
            shader = LGraphFXGeneric.shaders[fx] = new GL.Shader(
              Shader.SCREEN_VERTEX_SHADER,
              pixel_shader_code
            );
          }
          gl.disable(gl.BLEND);
          gl.disable(gl.DEPTH_TEST);
          var mesh = Mesh.getScreenQuad();
          var camera = global2.LS ? LS.Renderer._current_camera : null;
          var camera_planes;
          if (camera) {
            camera_planes = [
              LS.Renderer._current_camera.near,
              LS.Renderer._current_camera.far
            ];
          } else {
            camera_planes = [1, 100];
          }
          var noise = null;
          if (fx == "noise") {
            noise = LGraphTexture2.getNoiseTexture();
          }
          this._tex.drawTo(function() {
            tex.bind(0);
            if (fx == "noise") {
              noise.bind(1);
            }
            shader.uniforms({
              u_texture: 0,
              u_noise: 1,
              u_size: [tex.width, tex.height],
              u_rand: [Math.random(), Math.random()],
              u_value1: value1,
              u_value2: value2,
              u_camera_planes: camera_planes
            }).draw(mesh);
          });
          this.setOutputData(0, this._tex);
        };
        LGraphFXGeneric.pixel_shader_halftone = "precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform vec2 u_camera_planes;\n					uniform vec2 u_size;\n					uniform float u_value1;\n					uniform float u_value2;\n					\n					float pattern() {\n						float s = sin(u_value1 * 3.1415), c = cos(u_value1 * 3.1415);\n						vec2 tex = v_coord * u_size.xy;\n						vec2 point = vec2(\n						   c * tex.x - s * tex.y ,\n						   s * tex.x + c * tex.y \n						) * u_value2;\n						return (sin(point.x) * sin(point.y)) * 4.0;\n					}\n					void main() {\n						vec4 color = texture2D(u_texture, v_coord);\n						float average = (color.r + color.g + color.b) / 3.0;\n						gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n					}\n";
        LGraphFXGeneric.pixel_shader_pixelate = "precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform vec2 u_camera_planes;\n					uniform vec2 u_size;\n					uniform float u_value1;\n					uniform float u_value2;\n					\n					void main() {\n						vec2 coord = vec2( floor(v_coord.x * u_value1) / u_value1, floor(v_coord.y * u_value2) / u_value2 );\n						vec4 color = texture2D(u_texture, coord);\n						gl_FragColor = color;\n					}\n";
        LGraphFXGeneric.pixel_shader_lowpalette = "precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform vec2 u_camera_planes;\n					uniform vec2 u_size;\n					uniform float u_value1;\n					uniform float u_value2;\n					\n					void main() {\n						vec4 color = texture2D(u_texture, v_coord);\n						gl_FragColor = floor(color * u_value1) / u_value1;\n					}\n";
        LGraphFXGeneric.pixel_shader_noise = "precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform sampler2D u_noise;\n					uniform vec2 u_size;\n					uniform float u_value1;\n					uniform float u_value2;\n					uniform vec2 u_rand;\n					\n					void main() {\n						vec4 color = texture2D(u_texture, v_coord);\n						vec3 noise = texture2D(u_noise, v_coord * vec2(u_size.x / 512.0, u_size.y / 512.0) + u_rand).xyz - vec3(0.5);\n						gl_FragColor = vec4( color.xyz + noise * u_value1, color.a );\n					}\n";
        LGraphFXGeneric.pixel_shader_gamma = "precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform float u_value1;\n					\n					void main() {\n						vec4 color = texture2D(u_texture, v_coord);\n						float gamma = 1.0 / u_value1;\n						gl_FragColor = vec4( pow( color.xyz, vec3(gamma) ), color.a );\n					}\n";
        LiteGraph2.registerNodeType("fx/generic", LGraphFXGeneric);
        global2.LGraphFXGeneric = LGraphFXGeneric;
        LGraphFXVigneting.title = "Vigneting";
        LGraphFXVigneting.desc = "Vigneting";
        LGraphFXVigneting.widgets_info = {
          precision: { widget: "combo", values: LGraphTexture2.MODE_VALUES }
        };
        LGraphFXVigneting.prototype.onExecute = function() {
          var tex = this.getInputData(0);
          if (this.properties.precision === LGraphTexture2.PASS_THROUGH) {
            this.setOutputData(0, tex);
            return;
          }
          if (!tex) {
            return;
          }
          this._tex = LGraphTexture2.getTargetTexture(
            tex,
            this._tex,
            this.properties.precision
          );
          var intensity = this.properties.intensity;
          if (this.isInputConnected(1)) {
            intensity = this.getInputData(1);
            this.properties.intensity = intensity;
          }
          gl.disable(gl.BLEND);
          gl.disable(gl.DEPTH_TEST);
          var mesh = Mesh.getScreenQuad();
          var shader = LGraphFXVigneting._shader;
          var invert = this.properties.invert;
          this._tex.drawTo(function() {
            tex.bind(0);
            shader.uniforms({
              u_texture: 0,
              u_intensity: intensity,
              u_isize: [1 / tex.width, 1 / tex.height],
              u_invert: invert ? 1 : 0
            }).draw(mesh);
          });
          this.setOutputData(0, this._tex);
        };
        LGraphFXVigneting.pixel_shader = "precision highp float;\n					precision highp float;\n					varying vec2 v_coord;\n					uniform sampler2D u_texture;\n					uniform float u_intensity;\n					uniform int u_invert;\n					\n					void main() {\n						float luminance = 1.0 - length( v_coord - vec2(0.5) ) * 1.414;\n						vec4 color = texture2D(u_texture, v_coord);\n						if(u_invert == 1)\n							luminance = 1.0 - luminance;\n						luminance = mix(1.0, luminance, u_intensity);\n					   gl_FragColor = vec4( luminance * color.xyz, color.a);\n					}\n					";
        LiteGraph2.registerNodeType("fx/vigneting", LGraphFXVigneting);
        global2.LGraphFXVigneting = LGraphFXVigneting;
      }
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      var MIDI_COLOR = "#243";
      function MIDIEvent(data) {
        this.channel = 0;
        this.cmd = 0;
        this.data = new Uint32Array(3);
        if (data) {
          this.setup(data);
        }
      }
      LiteGraph2.MIDIEvent = MIDIEvent;
      MIDIEvent.prototype.fromJSON = function(o) {
        this.setup(o.data);
      };
      MIDIEvent.prototype.setup = function(data) {
        var raw_data = data;
        if (data.constructor === Object) {
          raw_data = data.data;
        }
        this.data.set(raw_data);
        var midiStatus = raw_data[0];
        this.status = midiStatus;
        var midiCommand = midiStatus & 240;
        if (midiStatus >= 240) {
          this.cmd = midiStatus;
        } else {
          this.cmd = midiCommand;
        }
        if (this.cmd == MIDIEvent.NOTEON && this.velocity == 0) {
          this.cmd = MIDIEvent.NOTEOFF;
        }
        this.cmd_str = MIDIEvent.commands[this.cmd] || "";
        if (midiCommand >= MIDIEvent.NOTEON || midiCommand <= MIDIEvent.NOTEOFF) {
          this.channel = midiStatus & 15;
        }
      };
      Object.defineProperty(MIDIEvent.prototype, "velocity", {
        get: function() {
          if (this.cmd == MIDIEvent.NOTEON) {
            return this.data[2];
          }
          return -1;
        },
        set: function(v2) {
          this.data[2] = v2;
        },
        enumerable: true
      });
      MIDIEvent.notes = [
        "A",
        "A#",
        "B",
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#"
      ];
      MIDIEvent.note_to_index = {
        A: 0,
        "A#": 1,
        B: 2,
        C: 3,
        "C#": 4,
        D: 5,
        "D#": 6,
        E: 7,
        F: 8,
        "F#": 9,
        G: 10,
        "G#": 11
      };
      Object.defineProperty(MIDIEvent.prototype, "note", {
        get: function() {
          if (this.cmd != MIDIEvent.NOTEON) {
            return -1;
          }
          return MIDIEvent.toNoteString(this.data[1], true);
        },
        set: function(v2) {
          throw "notes cannot be assigned this way, must modify the data[1]";
        },
        enumerable: true
      });
      Object.defineProperty(MIDIEvent.prototype, "octave", {
        get: function() {
          if (this.cmd != MIDIEvent.NOTEON) {
            return -1;
          }
          var octave = this.data[1] - 24;
          return Math.floor(octave / 12 + 1);
        },
        set: function(v2) {
          throw "octave cannot be assigned this way, must modify the data[1]";
        },
        enumerable: true
      });
      MIDIEvent.prototype.getPitch = function() {
        return Math.pow(2, (this.data[1] - 69) / 12) * 440;
      };
      MIDIEvent.computePitch = function(note) {
        return Math.pow(2, (note - 69) / 12) * 440;
      };
      MIDIEvent.prototype.getCC = function() {
        return this.data[1];
      };
      MIDIEvent.prototype.getCCValue = function() {
        return this.data[2];
      };
      MIDIEvent.prototype.getPitchBend = function() {
        return this.data[1] + (this.data[2] << 7) - 8192;
      };
      MIDIEvent.computePitchBend = function(v1, v2) {
        return v1 + (v2 << 7) - 8192;
      };
      MIDIEvent.prototype.setCommandFromString = function(str) {
        this.cmd = MIDIEvent.computeCommandFromString(str);
      };
      MIDIEvent.computeCommandFromString = function(str) {
        if (!str) {
          return 0;
        }
        if (str && str.constructor === Number) {
          return str;
        }
        str = str.toUpperCase();
        switch (str) {
          case "NOTE ON":
          case "NOTEON":
            return MIDIEvent.NOTEON;
          case "NOTE OFF":
          case "NOTEOFF":
            return MIDIEvent.NOTEON;
          case "KEY PRESSURE":
          case "KEYPRESSURE":
            return MIDIEvent.KEYPRESSURE;
          case "CONTROLLER CHANGE":
          case "CONTROLLERCHANGE":
          case "CC":
            return MIDIEvent.CONTROLLERCHANGE;
          case "PROGRAM CHANGE":
          case "PROGRAMCHANGE":
          case "PC":
            return MIDIEvent.PROGRAMCHANGE;
          case "CHANNEL PRESSURE":
          case "CHANNELPRESSURE":
            return MIDIEvent.CHANNELPRESSURE;
          case "PITCH BEND":
          case "PITCHBEND":
            return MIDIEvent.PITCHBEND;
          case "TIME TICK":
          case "TIMETICK":
            return MIDIEvent.TIMETICK;
          default:
            return Number(str);
        }
      };
      MIDIEvent.toNoteString = function(d, skip_octave) {
        d = Math.round(d);
        var note = d - 21;
        var octave = Math.floor((d - 24) / 12 + 1);
        note = note % 12;
        if (note < 0) {
          note = 12 + note;
        }
        return MIDIEvent.notes[note] + (skip_octave ? "" : octave);
      };
      MIDIEvent.NoteStringToPitch = function(str) {
        str = str.toUpperCase();
        var note = str[0];
        var octave = 4;
        if (str[1] == "#") {
          note += "#";
          if (str.length > 2) {
            octave = Number(str[2]);
          }
        } else {
          if (str.length > 1) {
            octave = Number(str[1]);
          }
        }
        var pitch = MIDIEvent.note_to_index[note];
        if (pitch == null) {
          return null;
        }
        return (octave - 1) * 12 + pitch + 21;
      };
      MIDIEvent.prototype.toString = function() {
        var str = "" + this.channel + ". ";
        switch (this.cmd) {
          case MIDIEvent.NOTEON:
            str += "NOTEON " + MIDIEvent.toNoteString(this.data[1]);
            break;
          case MIDIEvent.NOTEOFF:
            str += "NOTEOFF " + MIDIEvent.toNoteString(this.data[1]);
            break;
          case MIDIEvent.CONTROLLERCHANGE:
            str += "CC " + this.data[1] + " " + this.data[2];
            break;
          case MIDIEvent.PROGRAMCHANGE:
            str += "PC " + this.data[1];
            break;
          case MIDIEvent.PITCHBEND:
            str += "PITCHBEND " + this.getPitchBend();
            break;
          case MIDIEvent.KEYPRESSURE:
            str += "KEYPRESS " + this.data[1];
            break;
        }
        return str;
      };
      MIDIEvent.prototype.toHexString = function() {
        var str = "";
        for (var i3 = 0; i3 < this.data.length; i3++) {
          str += this.data[i3].toString(16) + " ";
        }
      };
      MIDIEvent.prototype.toJSON = function() {
        return {
          data: [this.data[0], this.data[1], this.data[2]],
          object_class: "MIDIEvent"
        };
      };
      MIDIEvent.NOTEOFF = 128;
      MIDIEvent.NOTEON = 144;
      MIDIEvent.KEYPRESSURE = 160;
      MIDIEvent.CONTROLLERCHANGE = 176;
      MIDIEvent.PROGRAMCHANGE = 192;
      MIDIEvent.CHANNELPRESSURE = 208;
      MIDIEvent.PITCHBEND = 224;
      MIDIEvent.TIMETICK = 248;
      MIDIEvent.commands = {
        128: "note off",
        144: "note on",
        160: "key pressure",
        176: "controller change",
        192: "program change",
        208: "channel pressure",
        224: "pitch bend",
        240: "system",
        242: "Song pos",
        243: "Song select",
        246: "Tune request",
        248: "time tick",
        250: "Start Song",
        251: "Continue Song",
        252: "Stop Song",
        254: "Sensing",
        255: "Reset"
      };
      MIDIEvent.commands_short = {
        128: "NOTEOFF",
        144: "NOTEOFF",
        160: "KEYP",
        176: "CC",
        192: "PC",
        208: "CP",
        224: "PB",
        240: "SYS",
        242: "POS",
        243: "SELECT",
        246: "TUNEREQ",
        248: "TT",
        250: "START",
        251: "CONTINUE",
        252: "STOP",
        254: "SENS",
        255: "RESET"
      };
      MIDIEvent.commands_reversed = {};
      for (var i2 in MIDIEvent.commands) {
        MIDIEvent.commands_reversed[MIDIEvent.commands[i2]] = i2;
      }
      function MIDIInterface(on_ready, on_error) {
        if (!navigator.requestMIDIAccess) {
          this.error = "not suppoorted";
          if (on_error) {
            on_error("Not supported");
          } else {
            console.error("MIDI NOT SUPPORTED, enable by chrome://flags");
          }
          return;
        }
        this.on_ready = on_ready;
        this.state = {
          note: [],
          cc: []
        };
        this.input_ports = null;
        this.input_ports_info = [];
        this.output_ports = null;
        this.output_ports_info = [];
        navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
      }
      MIDIInterface.input = null;
      MIDIInterface.MIDIEvent = MIDIEvent;
      MIDIInterface.prototype.onMIDISuccess = function(midiAccess) {
        console.log("MIDI ready!");
        console.log(midiAccess);
        this.midi = midiAccess;
        this.updatePorts();
        if (this.on_ready) {
          this.on_ready(this);
        }
      };
      MIDIInterface.prototype.updatePorts = function() {
        var midi = this.midi;
        this.input_ports = midi.inputs;
        this.input_ports_info = [];
        this.output_ports = midi.outputs;
        this.output_ports_info = [];
        var num = 0;
        var it = this.input_ports.values();
        var it_value = it.next();
        while (it_value && it_value.done === false) {
          var port_info = it_value.value;
          this.input_ports_info.push(port_info);
          console.log("Input port [type:'" + port_info.type + "'] id:'" + port_info.id + "' manufacturer:'" + port_info.manufacturer + "' name:'" + port_info.name + "' version:'" + port_info.version + "'");
          num++;
          it_value = it.next();
        }
        this.num_input_ports = num;
        num = 0;
        var it = this.output_ports.values();
        var it_value = it.next();
        while (it_value && it_value.done === false) {
          var port_info = it_value.value;
          this.output_ports_info.push(port_info);
          console.log("Output port [type:'" + port_info.type + "'] id:'" + port_info.id + "' manufacturer:'" + port_info.manufacturer + "' name:'" + port_info.name + "' version:'" + port_info.version + "'");
          num++;
          it_value = it.next();
        }
        this.num_output_ports = num;
      };
      MIDIInterface.prototype.onMIDIFailure = function(msg) {
        console.error("Failed to get MIDI access - " + msg);
      };
      MIDIInterface.prototype.openInputPort = function(port, callback) {
        var input_port = this.input_ports.get("input-" + port);
        if (!input_port) {
          return false;
        }
        MIDIInterface.input = this;
        var that2 = this;
        input_port.onmidimessage = function(a) {
          var midi_event = new MIDIEvent(a.data);
          that2.updateState(midi_event);
          if (callback) {
            callback(a.data, midi_event);
          }
          if (MIDIInterface.on_message) {
            MIDIInterface.on_message(a.data, midi_event);
          }
        };
        console.log("port open: ", input_port);
        return true;
      };
      MIDIInterface.parseMsg = function(data) {
      };
      MIDIInterface.prototype.updateState = function(midi_event) {
        switch (midi_event.cmd) {
          case MIDIEvent.NOTEON:
            this.state.note[midi_event.value1 | 0] = midi_event.value2;
            break;
          case MIDIEvent.NOTEOFF:
            this.state.note[midi_event.value1 | 0] = 0;
            break;
          case MIDIEvent.CONTROLLERCHANGE:
            this.state.cc[midi_event.getCC()] = midi_event.getCCValue();
            break;
        }
      };
      MIDIInterface.prototype.sendMIDI = function(port, midi_data) {
        if (!midi_data) {
          return;
        }
        var output_port = this.output_ports_info[port];
        if (!output_port) {
          return;
        }
        MIDIInterface.output = this;
        if (midi_data.constructor === MIDIEvent) {
          output_port.send(midi_data.data);
        } else {
          output_port.send(midi_data);
        }
      };
      function LGMIDIIn() {
        this.addOutput("on_midi", LiteGraph2.EVENT);
        this.addOutput("out", "midi");
        this.properties = { port: 0 };
        this._last_midi_event = null;
        this._current_midi_event = null;
        this.boxcolor = "#AAA";
        this._last_time = 0;
        var that2 = this;
        new MIDIInterface(function(midi) {
          that2._midi = midi;
          if (that2._waiting) {
            that2.onStart();
          }
          that2._waiting = false;
        });
      }
      LGMIDIIn.MIDIInterface = MIDIInterface;
      LGMIDIIn.title = "MIDI Input";
      LGMIDIIn.desc = "Reads MIDI from a input port";
      LGMIDIIn.color = MIDI_COLOR;
      LGMIDIIn.prototype.getPropertyInfo = function(name) {
        if (!this._midi) {
          return;
        }
        if (name == "port") {
          var values2 = {};
          for (var i3 = 0; i3 < this._midi.input_ports_info.length; ++i3) {
            var input = this._midi.input_ports_info[i3];
            values2[i3] = i3 + ".- " + input.name + " version:" + input.version;
          }
          return { type: "enum", values: values2 };
        }
      };
      LGMIDIIn.prototype.onStart = function() {
        if (this._midi) {
          this._midi.openInputPort(
            this.properties.port,
            this.onMIDIEvent.bind(this)
          );
        } else {
          this._waiting = true;
        }
      };
      LGMIDIIn.prototype.onMIDIEvent = function(data, midi_event) {
        this._last_midi_event = midi_event;
        this.boxcolor = "#AFA";
        this._last_time = LiteGraph2.getTime();
        this.trigger("on_midi", midi_event);
        if (midi_event.cmd == MIDIEvent.NOTEON) {
          this.trigger("on_noteon", midi_event);
        } else if (midi_event.cmd == MIDIEvent.NOTEOFF) {
          this.trigger("on_noteoff", midi_event);
        } else if (midi_event.cmd == MIDIEvent.CONTROLLERCHANGE) {
          this.trigger("on_cc", midi_event);
        } else if (midi_event.cmd == MIDIEvent.PROGRAMCHANGE) {
          this.trigger("on_pc", midi_event);
        } else if (midi_event.cmd == MIDIEvent.PITCHBEND) {
          this.trigger("on_pitchbend", midi_event);
        }
      };
      LGMIDIIn.prototype.onDrawBackground = function(ctx) {
        this.boxcolor = "#AAA";
        if (!this.flags.collapsed && this._last_midi_event) {
          ctx.fillStyle = "white";
          var now = LiteGraph2.getTime();
          var f = 1 - Math.max(0, (now - this._last_time) * 1e-3);
          if (f > 0) {
            var t = ctx.globalAlpha;
            ctx.globalAlpha *= f;
            ctx.font = "12px Tahoma";
            ctx.fillText(
              this._last_midi_event.toString(),
              2,
              this.size[1] * 0.5 + 3
            );
            ctx.globalAlpha = t;
          }
        }
      };
      LGMIDIIn.prototype.onExecute = function() {
        if (this.outputs) {
          var last = this._last_midi_event;
          for (var i3 = 0; i3 < this.outputs.length; ++i3) {
            var output = this.outputs[i3];
            var v2 = null;
            switch (output.name) {
              case "midi":
                v2 = this._midi;
                break;
              case "last_midi":
                v2 = last;
                break;
              default:
                continue;
            }
            this.setOutputData(i3, v2);
          }
        }
      };
      LGMIDIIn.prototype.onGetOutputs = function() {
        return [
          ["last_midi", "midi"],
          ["on_midi", LiteGraph2.EVENT],
          ["on_noteon", LiteGraph2.EVENT],
          ["on_noteoff", LiteGraph2.EVENT],
          ["on_cc", LiteGraph2.EVENT],
          ["on_pc", LiteGraph2.EVENT],
          ["on_pitchbend", LiteGraph2.EVENT]
        ];
      };
      LiteGraph2.registerNodeType("midi/input", LGMIDIIn);
      function LGMIDIOut() {
        this.addInput("send", LiteGraph2.EVENT);
        this.properties = { port: 0 };
        var that2 = this;
        new MIDIInterface(function(midi) {
          that2._midi = midi;
          that2.widget.options.values = that2.getMIDIOutputs();
        });
        this.widget = this.addWidget("combo", "Device", this.properties.port, { property: "port", values: this.getMIDIOutputs.bind(this) });
        this.size = [340, 60];
      }
      LGMIDIOut.MIDIInterface = MIDIInterface;
      LGMIDIOut.title = "MIDI Output";
      LGMIDIOut.desc = "Sends MIDI to output channel";
      LGMIDIOut.color = MIDI_COLOR;
      LGMIDIOut.prototype.onGetPropertyInfo = function(name) {
        if (!this._midi) {
          return;
        }
        if (name == "port") {
          var values2 = this.getMIDIOutputs();
          return { type: "enum", values: values2 };
        }
      };
      LGMIDIOut.default_ports = { 0: "unknown" };
      LGMIDIOut.prototype.getMIDIOutputs = function() {
        var values2 = {};
        if (!this._midi)
          return LGMIDIOut.default_ports;
        if (this._midi.output_ports_info)
          for (var i3 = 0; i3 < this._midi.output_ports_info.length; ++i3) {
            var output = this._midi.output_ports_info[i3];
            if (!output)
              continue;
            var name = i3 + ".- " + output.name + " version:" + output.version;
            values2[i3] = name;
          }
        return values2;
      };
      LGMIDIOut.prototype.onAction = function(event2, midi_event) {
        if (!this._midi) {
          return;
        }
        if (event2 == "send") {
          this._midi.sendMIDI(this.properties.port, midi_event);
        }
        this.trigger("midi", midi_event);
      };
      LGMIDIOut.prototype.onGetInputs = function() {
        return [["send", LiteGraph2.ACTION]];
      };
      LGMIDIOut.prototype.onGetOutputs = function() {
        return [["on_midi", LiteGraph2.EVENT]];
      };
      LiteGraph2.registerNodeType("midi/output", LGMIDIOut);
      function LGMIDIShow() {
        this.addInput("on_midi", LiteGraph2.EVENT);
        this._str = "";
        this.size = [200, 40];
      }
      LGMIDIShow.title = "MIDI Show";
      LGMIDIShow.desc = "Shows MIDI in the graph";
      LGMIDIShow.color = MIDI_COLOR;
      LGMIDIShow.prototype.getTitle = function() {
        if (this.flags.collapsed) {
          return this._str;
        }
        return this.title;
      };
      LGMIDIShow.prototype.onAction = function(event2, midi_event) {
        if (!midi_event) {
          return;
        }
        if (midi_event.constructor === MIDIEvent) {
          this._str = midi_event.toString();
        } else {
          this._str = "???";
        }
      };
      LGMIDIShow.prototype.onDrawForeground = function(ctx) {
        if (!this._str || this.flags.collapsed) {
          return;
        }
        ctx.font = "30px Arial";
        ctx.fillText(this._str, 10, this.size[1] * 0.8);
      };
      LGMIDIShow.prototype.onGetInputs = function() {
        return [["in", LiteGraph2.ACTION]];
      };
      LGMIDIShow.prototype.onGetOutputs = function() {
        return [["on_midi", LiteGraph2.EVENT]];
      };
      LiteGraph2.registerNodeType("midi/show", LGMIDIShow);
      function LGMIDIFilter() {
        this.properties = {
          channel: -1,
          cmd: -1,
          min_value: -1,
          max_value: -1
        };
        var that2 = this;
        this._learning = false;
        this.addWidget("button", "Learn", "", function() {
          that2._learning = true;
          that2.boxcolor = "#FA3";
        });
        this.addInput("in", LiteGraph2.EVENT);
        this.addOutput("on_midi", LiteGraph2.EVENT);
        this.boxcolor = "#AAA";
      }
      LGMIDIFilter.title = "MIDI Filter";
      LGMIDIFilter.desc = "Filters MIDI messages";
      LGMIDIFilter.color = MIDI_COLOR;
      LGMIDIFilter["@cmd"] = {
        type: "enum",
        title: "Command",
        values: MIDIEvent.commands_reversed
      };
      LGMIDIFilter.prototype.getTitle = function() {
        var str = null;
        if (this.properties.cmd == -1) {
          str = "Nothing";
        } else {
          str = MIDIEvent.commands_short[this.properties.cmd] || "Unknown";
        }
        if (this.properties.min_value != -1 && this.properties.max_value != -1) {
          str += " " + (this.properties.min_value == this.properties.max_value ? this.properties.max_value : this.properties.min_value + ".." + this.properties.max_value);
        }
        return "Filter: " + str;
      };
      LGMIDIFilter.prototype.onPropertyChanged = function(name, value) {
        if (name == "cmd") {
          var num = Number(value);
          if (isNaN(num)) {
            num = MIDIEvent.commands[value] || 0;
          }
          this.properties.cmd = num;
        }
      };
      LGMIDIFilter.prototype.onAction = function(event2, midi_event) {
        if (!midi_event || midi_event.constructor !== MIDIEvent) {
          return;
        }
        if (this._learning) {
          this._learning = false;
          this.boxcolor = "#AAA";
          this.properties.channel = midi_event.channel;
          this.properties.cmd = midi_event.cmd;
          this.properties.min_value = this.properties.max_value = midi_event.data[1];
        } else {
          if (this.properties.channel != -1 && midi_event.channel != this.properties.channel) {
            return;
          }
          if (this.properties.cmd != -1 && midi_event.cmd != this.properties.cmd) {
            return;
          }
          if (this.properties.min_value != -1 && midi_event.data[1] < this.properties.min_value) {
            return;
          }
          if (this.properties.max_value != -1 && midi_event.data[1] > this.properties.max_value) {
            return;
          }
        }
        this.trigger("on_midi", midi_event);
      };
      LiteGraph2.registerNodeType("midi/filter", LGMIDIFilter);
      function LGMIDIEvent() {
        this.properties = {
          channel: 0,
          cmd: 144,
          //0x90
          value1: 1,
          value2: 1
        };
        this.addInput("send", LiteGraph2.EVENT);
        this.addInput("assign", LiteGraph2.EVENT);
        this.addOutput("on_midi", LiteGraph2.EVENT);
        this.midi_event = new MIDIEvent();
        this.gate = false;
      }
      LGMIDIEvent.title = "MIDIEvent";
      LGMIDIEvent.desc = "Create a MIDI Event";
      LGMIDIEvent.color = MIDI_COLOR;
      LGMIDIEvent.prototype.onAction = function(event2, midi_event) {
        if (event2 == "assign") {
          this.properties.channel = midi_event.channel;
          this.properties.cmd = midi_event.cmd;
          this.properties.value1 = midi_event.data[1];
          this.properties.value2 = midi_event.data[2];
          if (midi_event.cmd == MIDIEvent.NOTEON) {
            this.gate = true;
          } else if (midi_event.cmd == MIDIEvent.NOTEOFF) {
            this.gate = false;
          }
          return;
        }
        var midi_event = this.midi_event;
        midi_event.channel = this.properties.channel;
        if (this.properties.cmd && this.properties.cmd.constructor === String) {
          midi_event.setCommandFromString(this.properties.cmd);
        } else {
          midi_event.cmd = this.properties.cmd;
        }
        midi_event.data[0] = midi_event.cmd | midi_event.channel;
        midi_event.data[1] = Number(this.properties.value1);
        midi_event.data[2] = Number(this.properties.value2);
        this.trigger("on_midi", midi_event);
      };
      LGMIDIEvent.prototype.onExecute = function() {
        var props = this.properties;
        if (this.inputs) {
          for (var i3 = 0; i3 < this.inputs.length; ++i3) {
            var input = this.inputs[i3];
            if (input.link == -1) {
              continue;
            }
            switch (input.name) {
              case "note":
                var v2 = this.getInputData(i3);
                if (v2 != null) {
                  if (v2.constructor === String) {
                    v2 = MIDIEvent.NoteStringToPitch(v2);
                  }
                  this.properties.value1 = (v2 | 0) % 255;
                }
                break;
              case "cmd":
                var v2 = this.getInputData(i3);
                if (v2 != null) {
                  this.properties.cmd = v2;
                }
                break;
              case "value1":
                var v2 = this.getInputData(i3);
                if (v2 != null) {
                  this.properties.value1 = clamp(v2 | 0, 0, 127);
                }
                break;
              case "value2":
                var v2 = this.getInputData(i3);
                if (v2 != null) {
                  this.properties.value2 = clamp(v2 | 0, 0, 127);
                }
                break;
            }
          }
        }
        if (this.outputs) {
          for (var i3 = 0; i3 < this.outputs.length; ++i3) {
            var output = this.outputs[i3];
            var v2 = null;
            switch (output.name) {
              case "midi":
                v2 = new MIDIEvent();
                v2.setup([props.cmd, props.value1, props.value2]);
                v2.channel = props.channel;
                break;
              case "command":
                v2 = props.cmd;
                break;
              case "cc":
                v2 = props.value1;
                break;
              case "cc_value":
                v2 = props.value2;
                break;
              case "note":
                v2 = props.cmd == MIDIEvent.NOTEON || props.cmd == MIDIEvent.NOTEOFF ? props.value1 : null;
                break;
              case "velocity":
                v2 = props.cmd == MIDIEvent.NOTEON ? props.value2 : null;
                break;
              case "pitch":
                v2 = props.cmd == MIDIEvent.NOTEON ? MIDIEvent.computePitch(props.value1) : null;
                break;
              case "pitchbend":
                v2 = props.cmd == MIDIEvent.PITCHBEND ? MIDIEvent.computePitchBend(
                  props.value1,
                  props.value2
                ) : null;
                break;
              case "gate":
                v2 = this.gate;
                break;
              default:
                continue;
            }
            if (v2 !== null) {
              this.setOutputData(i3, v2);
            }
          }
        }
      };
      LGMIDIEvent.prototype.onPropertyChanged = function(name, value) {
        if (name == "cmd") {
          this.properties.cmd = MIDIEvent.computeCommandFromString(value);
        }
      };
      LGMIDIEvent.prototype.onGetInputs = function() {
        return [["cmd", "number"], ["note", "number"], ["value1", "number"], ["value2", "number"]];
      };
      LGMIDIEvent.prototype.onGetOutputs = function() {
        return [
          ["midi", "midi"],
          ["on_midi", LiteGraph2.EVENT],
          ["command", "number"],
          ["note", "number"],
          ["velocity", "number"],
          ["cc", "number"],
          ["cc_value", "number"],
          ["pitch", "number"],
          ["gate", "bool"],
          ["pitchbend", "number"]
        ];
      };
      LiteGraph2.registerNodeType("midi/event", LGMIDIEvent);
      function LGMIDICC() {
        this.properties = {
          //		channel: 0,
          cc: 1,
          value: 0
        };
        this.addOutput("value", "number");
      }
      LGMIDICC.title = "MIDICC";
      LGMIDICC.desc = "gets a Controller Change";
      LGMIDICC.color = MIDI_COLOR;
      LGMIDICC.prototype.onExecute = function() {
        this.properties;
        if (MIDIInterface.input) {
          this.properties.value = MIDIInterface.input.state.cc[this.properties.cc];
        }
        this.setOutputData(0, this.properties.value);
      };
      LiteGraph2.registerNodeType("midi/cc", LGMIDICC);
      function LGMIDIGenerator() {
        this.addInput("generate", LiteGraph2.ACTION);
        this.addInput("scale", "string");
        this.addInput("octave", "number");
        this.addOutput("note", LiteGraph2.EVENT);
        this.properties = {
          notes: "A,A#,B,C,C#,D,D#,E,F,F#,G,G#",
          octave: 2,
          duration: 0.5,
          mode: "sequence"
        };
        this.notes_pitches = LGMIDIGenerator.processScale(
          this.properties.notes
        );
        this.sequence_index = 0;
      }
      LGMIDIGenerator.title = "MIDI Generator";
      LGMIDIGenerator.desc = "Generates a random MIDI note";
      LGMIDIGenerator.color = MIDI_COLOR;
      LGMIDIGenerator.processScale = function(scale) {
        var notes = scale.split(",");
        for (var i3 = 0; i3 < notes.length; ++i3) {
          var n = notes[i3];
          if (n.length == 2 && n[1] != "#" || n.length > 2) {
            notes[i3] = -LiteGraph2.MIDIEvent.NoteStringToPitch(n);
          } else {
            notes[i3] = MIDIEvent.note_to_index[n] || 0;
          }
        }
        return notes;
      };
      LGMIDIGenerator.prototype.onPropertyChanged = function(name, value) {
        if (name == "notes") {
          this.notes_pitches = LGMIDIGenerator.processScale(value);
        }
      };
      LGMIDIGenerator.prototype.onExecute = function() {
        var octave = this.getInputData(2);
        if (octave != null) {
          this.properties.octave = octave;
        }
        var scale = this.getInputData(1);
        if (scale) {
          this.notes_pitches = LGMIDIGenerator.processScale(scale);
        }
      };
      LGMIDIGenerator.prototype.onAction = function(event2, midi_event) {
        var pitch = 0;
        var range = this.notes_pitches.length;
        var index2 = 0;
        if (this.properties.mode == "sequence") {
          index2 = this.sequence_index = (this.sequence_index + 1) % range;
        } else if (this.properties.mode == "random") {
          index2 = Math.floor(Math.random() * range);
        }
        var note = this.notes_pitches[index2];
        if (note >= 0) {
          pitch = note + (this.properties.octave - 1) * 12 + 33;
        } else {
          pitch = -note;
        }
        var midi_event = new MIDIEvent();
        midi_event.setup([MIDIEvent.NOTEON, pitch, 10]);
        var duration = this.properties.duration || 1;
        this.trigger("note", midi_event);
        setTimeout(
          function() {
            var midi_event2 = new MIDIEvent();
            midi_event2.setup([MIDIEvent.NOTEOFF, pitch, 0]);
            this.trigger("note", midi_event2);
          }.bind(this),
          duration * 1e3
        );
      };
      LiteGraph2.registerNodeType("midi/generator", LGMIDIGenerator);
      function LGMIDITranspose() {
        this.properties = {
          amount: 0
        };
        this.addInput("in", LiteGraph2.ACTION);
        this.addInput("amount", "number");
        this.addOutput("out", LiteGraph2.EVENT);
        this.midi_event = new MIDIEvent();
      }
      LGMIDITranspose.title = "MIDI Transpose";
      LGMIDITranspose.desc = "Transpose a MIDI note";
      LGMIDITranspose.color = MIDI_COLOR;
      LGMIDITranspose.prototype.onAction = function(event2, midi_event) {
        if (!midi_event || midi_event.constructor !== MIDIEvent) {
          return;
        }
        if (midi_event.data[0] == MIDIEvent.NOTEON || midi_event.data[0] == MIDIEvent.NOTEOFF) {
          this.midi_event = new MIDIEvent();
          this.midi_event.setup(midi_event.data);
          this.midi_event.data[1] = Math.round(
            this.midi_event.data[1] + this.properties.amount
          );
          this.trigger("out", this.midi_event);
        } else {
          this.trigger("out", midi_event);
        }
      };
      LGMIDITranspose.prototype.onExecute = function() {
        var amount = this.getInputData(1);
        if (amount != null) {
          this.properties.amount = amount;
        }
      };
      LiteGraph2.registerNodeType("midi/transpose", LGMIDITranspose);
      function LGMIDIQuantize() {
        this.properties = {
          scale: "A,A#,B,C,C#,D,D#,E,F,F#,G,G#"
        };
        this.addInput("note", LiteGraph2.ACTION);
        this.addInput("scale", "string");
        this.addOutput("out", LiteGraph2.EVENT);
        this.valid_notes = new Array(12);
        this.offset_notes = new Array(12);
        this.processScale(this.properties.scale);
      }
      LGMIDIQuantize.title = "MIDI Quantize Pitch";
      LGMIDIQuantize.desc = "Transpose a MIDI note tp fit an scale";
      LGMIDIQuantize.color = MIDI_COLOR;
      LGMIDIQuantize.prototype.onPropertyChanged = function(name, value) {
        if (name == "scale") {
          this.processScale(value);
        }
      };
      LGMIDIQuantize.prototype.processScale = function(scale) {
        this._current_scale = scale;
        this.notes_pitches = LGMIDIGenerator.processScale(scale);
        for (var i3 = 0; i3 < 12; ++i3) {
          this.valid_notes[i3] = this.notes_pitches.indexOf(i3) != -1;
        }
        for (var i3 = 0; i3 < 12; ++i3) {
          if (this.valid_notes[i3]) {
            this.offset_notes[i3] = 0;
            continue;
          }
          for (var j = 1; j < 12; ++j) {
            if (this.valid_notes[(i3 - j) % 12]) {
              this.offset_notes[i3] = -j;
              break;
            }
            if (this.valid_notes[(i3 + j) % 12]) {
              this.offset_notes[i3] = j;
              break;
            }
          }
        }
      };
      LGMIDIQuantize.prototype.onAction = function(event2, midi_event) {
        if (!midi_event || midi_event.constructor !== MIDIEvent) {
          return;
        }
        if (midi_event.data[0] == MIDIEvent.NOTEON || midi_event.data[0] == MIDIEvent.NOTEOFF) {
          this.midi_event = new MIDIEvent();
          this.midi_event.setup(midi_event.data);
          var note = midi_event.note;
          var index2 = MIDIEvent.note_to_index[note];
          var offset = this.offset_notes[index2];
          this.midi_event.data[1] += offset;
          this.trigger("out", this.midi_event);
        } else {
          this.trigger("out", midi_event);
        }
      };
      LGMIDIQuantize.prototype.onExecute = function() {
        var scale = this.getInputData(1);
        if (scale != null && scale != this._current_scale) {
          this.processScale(scale);
        }
      };
      LiteGraph2.registerNodeType("midi/quantize", LGMIDIQuantize);
      function LGMIDIFromFile() {
        this.properties = {
          url: "",
          autoplay: true
        };
        this.addInput("play", LiteGraph2.ACTION);
        this.addInput("pause", LiteGraph2.ACTION);
        this.addOutput("note", LiteGraph2.EVENT);
        this._midi = null;
        this._current_time = 0;
        this._playing = false;
        if (typeof MidiParser == "undefined") {
          console.error(
            "midi-parser.js not included, LGMidiPlay requires that library: https://raw.githubusercontent.com/colxi/midi-parser-js/master/src/main.js"
          );
          this.boxcolor = "red";
        }
      }
      LGMIDIFromFile.title = "MIDI fromFile";
      LGMIDIFromFile.desc = "Plays a MIDI file";
      LGMIDIFromFile.color = MIDI_COLOR;
      LGMIDIFromFile.prototype.onAction = function(name) {
        if (name == "play")
          this.play();
        else if (name == "pause")
          this._playing = !this._playing;
      };
      LGMIDIFromFile.prototype.onPropertyChanged = function(name, value) {
        if (name == "url")
          this.loadMIDIFile(value);
      };
      LGMIDIFromFile.prototype.onExecute = function() {
        if (!this._midi)
          return;
        if (!this._playing)
          return;
        this._current_time += this.graph.elapsed_time;
        var current_time = this._current_time * 100;
        for (var i3 = 0; i3 < this._midi.tracks; ++i3) {
          var track = this._midi.track[i3];
          if (!track._last_pos) {
            track._last_pos = 0;
            track._time = 0;
          }
          var elem = track.event[track._last_pos];
          if (elem && track._time + elem.deltaTime <= current_time) {
            track._last_pos++;
            track._time += elem.deltaTime;
            if (elem.data) {
              var midi_cmd = elem.type << 4 + elem.channel;
              var midi_event = new MIDIEvent();
              midi_event.setup([midi_cmd, elem.data[0], elem.data[1]]);
              this.trigger("note", midi_event);
            }
          }
        }
      };
      LGMIDIFromFile.prototype.play = function() {
        this._playing = true;
        this._current_time = 0;
        if (!this._midi)
          return;
        for (var i3 = 0; i3 < this._midi.tracks; ++i3) {
          var track = this._midi.track[i3];
          track._last_pos = 0;
          track._time = 0;
        }
      };
      LGMIDIFromFile.prototype.loadMIDIFile = function(url) {
        var that2 = this;
        LiteGraph2.fetchFile(url, "arraybuffer", function(data) {
          that2.boxcolor = "#AFA";
          that2._midi = MidiParser.parse(new Uint8Array(data));
          if (that2.properties.autoplay)
            that2.play();
        }, function(err) {
          that2.boxcolor = "#FAA";
          that2._midi = null;
        });
      };
      LGMIDIFromFile.prototype.onDropFile = function(file) {
        this.properties.url = "";
        this.loadMIDIFile(file);
      };
      LiteGraph2.registerNodeType("midi/fromFile", LGMIDIFromFile);
      function LGMIDIPlay() {
        this.properties = {
          volume: 0.5,
          duration: 1
        };
        this.addInput("note", LiteGraph2.ACTION);
        this.addInput("volume", "number");
        this.addInput("duration", "number");
        this.addOutput("note", LiteGraph2.EVENT);
        if (typeof AudioSynth == "undefined") {
          console.error(
            "Audiosynth.js not included, LGMidiPlay requires that library"
          );
          this.boxcolor = "red";
        } else {
          var Synth = this.synth = new AudioSynth();
          this.instrument = Synth.createInstrument("piano");
        }
      }
      LGMIDIPlay.title = "MIDI Play";
      LGMIDIPlay.desc = "Plays a MIDI note";
      LGMIDIPlay.color = MIDI_COLOR;
      LGMIDIPlay.prototype.onAction = function(event2, midi_event) {
        if (!midi_event || midi_event.constructor !== MIDIEvent) {
          return;
        }
        if (this.instrument && midi_event.data[0] == MIDIEvent.NOTEON) {
          var note = midi_event.note;
          if (!note || note == "undefined" || note.constructor !== String) {
            return;
          }
          this.instrument.play(
            note,
            midi_event.octave,
            this.properties.duration,
            this.properties.volume
          );
        }
        this.trigger("note", midi_event);
      };
      LGMIDIPlay.prototype.onExecute = function() {
        var volume = this.getInputData(1);
        if (volume != null) {
          this.properties.volume = volume;
        }
        var duration = this.getInputData(2);
        if (duration != null) {
          this.properties.duration = duration;
        }
      };
      LiteGraph2.registerNodeType("midi/play", LGMIDIPlay);
      function LGMIDIKeys() {
        this.properties = {
          num_octaves: 2,
          start_octave: 2
        };
        this.addInput("note", LiteGraph2.ACTION);
        this.addInput("reset", LiteGraph2.ACTION);
        this.addOutput("note", LiteGraph2.EVENT);
        this.size = [400, 100];
        this.keys = [];
        this._last_key = -1;
      }
      LGMIDIKeys.title = "MIDI Keys";
      LGMIDIKeys.desc = "Keyboard to play notes";
      LGMIDIKeys.color = MIDI_COLOR;
      LGMIDIKeys.keys = [
        { x: 0, w: 1, h: 1, t: 0 },
        { x: 0.75, w: 0.5, h: 0.6, t: 1 },
        { x: 1, w: 1, h: 1, t: 0 },
        { x: 1.75, w: 0.5, h: 0.6, t: 1 },
        { x: 2, w: 1, h: 1, t: 0 },
        { x: 2.75, w: 0.5, h: 0.6, t: 1 },
        { x: 3, w: 1, h: 1, t: 0 },
        { x: 4, w: 1, h: 1, t: 0 },
        { x: 4.75, w: 0.5, h: 0.6, t: 1 },
        { x: 5, w: 1, h: 1, t: 0 },
        { x: 5.75, w: 0.5, h: 0.6, t: 1 },
        { x: 6, w: 1, h: 1, t: 0 }
      ];
      LGMIDIKeys.prototype.onDrawForeground = function(ctx) {
        if (this.flags.collapsed) {
          return;
        }
        var num_keys = this.properties.num_octaves * 12;
        this.keys.length = num_keys;
        var key_width = this.size[0] / (this.properties.num_octaves * 7);
        var key_height = this.size[1];
        ctx.globalAlpha = 1;
        for (var k = 0; k < 2; k++) {
          for (var i3 = 0; i3 < num_keys; ++i3) {
            var key_info = LGMIDIKeys.keys[i3 % 12];
            if (key_info.t != k) {
              continue;
            }
            var octave = Math.floor(i3 / 12);
            var x2 = octave * 7 * key_width + key_info.x * key_width;
            if (k == 0) {
              ctx.fillStyle = this.keys[i3] ? "#CCC" : "white";
            } else {
              ctx.fillStyle = this.keys[i3] ? "#333" : "black";
            }
            ctx.fillRect(
              x2 + 1,
              0,
              key_width * key_info.w - 2,
              key_height * key_info.h
            );
          }
        }
      };
      LGMIDIKeys.prototype.getKeyIndex = function(pos2) {
        this.properties.num_octaves * 12;
        var key_width = this.size[0] / (this.properties.num_octaves * 7);
        var key_height = this.size[1];
        for (var k = 1; k >= 0; k--) {
          for (var i3 = 0; i3 < this.keys.length; ++i3) {
            var key_info = LGMIDIKeys.keys[i3 % 12];
            if (key_info.t != k) {
              continue;
            }
            var octave = Math.floor(i3 / 12);
            var x2 = octave * 7 * key_width + key_info.x * key_width;
            var w2 = key_width * key_info.w;
            var h = key_height * key_info.h;
            if (pos2[0] < x2 || pos2[0] > x2 + w2 || pos2[1] > h) {
              continue;
            }
            return i3;
          }
        }
        return -1;
      };
      LGMIDIKeys.prototype.onAction = function(event2, params) {
        if (event2 == "reset") {
          for (var i3 = 0; i3 < this.keys.length; ++i3) {
            this.keys[i3] = false;
          }
          return;
        }
        if (!params || params.constructor !== MIDIEvent) {
          return;
        }
        var midi_event = params;
        var start_note = (this.properties.start_octave - 1) * 12 + 29;
        var index2 = midi_event.data[1] - start_note;
        if (index2 >= 0 && index2 < this.keys.length) {
          if (midi_event.data[0] == MIDIEvent.NOTEON) {
            this.keys[index2] = true;
          } else if (midi_event.data[0] == MIDIEvent.NOTEOFF) {
            this.keys[index2] = false;
          }
        }
        this.trigger("note", midi_event);
      };
      LGMIDIKeys.prototype.onMouseDown = function(e, pos2) {
        if (pos2[1] < 0) {
          return;
        }
        var index2 = this.getKeyIndex(pos2);
        this.keys[index2] = true;
        this._last_key = index2;
        var pitch = (this.properties.start_octave - 1) * 12 + 29 + index2;
        var midi_event = new MIDIEvent();
        midi_event.setup([MIDIEvent.NOTEON, pitch, 100]);
        this.trigger("note", midi_event);
        return true;
      };
      LGMIDIKeys.prototype.onMouseMove = function(e, pos2) {
        if (pos2[1] < 0 || this._last_key == -1) {
          return;
        }
        this.setDirtyCanvas(true);
        var index2 = this.getKeyIndex(pos2);
        if (this._last_key == index2) {
          return true;
        }
        this.keys[this._last_key] = false;
        var pitch = (this.properties.start_octave - 1) * 12 + 29 + this._last_key;
        var midi_event = new MIDIEvent();
        midi_event.setup([MIDIEvent.NOTEOFF, pitch, 100]);
        this.trigger("note", midi_event);
        this.keys[index2] = true;
        var pitch = (this.properties.start_octave - 1) * 12 + 29 + index2;
        var midi_event = new MIDIEvent();
        midi_event.setup([MIDIEvent.NOTEON, pitch, 100]);
        this.trigger("note", midi_event);
        this._last_key = index2;
        return true;
      };
      LGMIDIKeys.prototype.onMouseUp = function(e, pos2) {
        if (pos2[1] < 0) {
          return;
        }
        var index2 = this.getKeyIndex(pos2);
        this.keys[index2] = false;
        this._last_key = -1;
        var pitch = (this.properties.start_octave - 1) * 12 + 29 + index2;
        var midi_event = new MIDIEvent();
        midi_event.setup([MIDIEvent.NOTEOFF, pitch, 100]);
        this.trigger("note", midi_event);
        return true;
      };
      LiteGraph2.registerNodeType("midi/keys", LGMIDIKeys);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      var LGAudio = {};
      global2.LGAudio = LGAudio;
      LGAudio.getAudioContext = function() {
        if (!this._audio_context) {
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!window.AudioContext) {
            console.error("AudioContext not supported by browser");
            return null;
          }
          this._audio_context = new AudioContext();
          this._audio_context.onmessage = function(msg) {
            console.log("msg", msg);
          };
          this._audio_context.onended = function(msg) {
            console.log("ended", msg);
          };
          this._audio_context.oncomplete = function(msg) {
            console.log("complete", msg);
          };
        }
        return this._audio_context;
      };
      LGAudio.connect = function(audionodeA, audionodeB) {
        try {
          audionodeA.connect(audionodeB);
        } catch (err) {
          console.warn("LGraphAudio:", err);
        }
      };
      LGAudio.disconnect = function(audionodeA, audionodeB) {
        try {
          audionodeA.disconnect(audionodeB);
        } catch (err) {
          console.warn("LGraphAudio:", err);
        }
      };
      LGAudio.changeAllAudiosConnections = function(node2, connect) {
        if (node2.inputs) {
          for (var i2 = 0; i2 < node2.inputs.length; ++i2) {
            var input = node2.inputs[i2];
            var link_info = node2.graph.links[input.link];
            if (!link_info) {
              continue;
            }
            var origin_node = node2.graph.getNodeById(link_info.origin_id);
            var origin_audionode = null;
            if (origin_node.getAudioNodeInOutputSlot) {
              origin_audionode = origin_node.getAudioNodeInOutputSlot(
                link_info.origin_slot
              );
            } else {
              origin_audionode = origin_node.audionode;
            }
            var target_audionode = null;
            if (node2.getAudioNodeInInputSlot) {
              target_audionode = node2.getAudioNodeInInputSlot(i2);
            } else {
              target_audionode = node2.audionode;
            }
            if (connect) {
              LGAudio.connect(origin_audionode, target_audionode);
            } else {
              LGAudio.disconnect(origin_audionode, target_audionode);
            }
          }
        }
        if (node2.outputs) {
          for (var i2 = 0; i2 < node2.outputs.length; ++i2) {
            var output = node2.outputs[i2];
            for (var j = 0; j < output.links.length; ++j) {
              var link_info = node2.graph.links[output.links[j]];
              if (!link_info) {
                continue;
              }
              var origin_audionode = null;
              if (node2.getAudioNodeInOutputSlot) {
                origin_audionode = node2.getAudioNodeInOutputSlot(i2);
              } else {
                origin_audionode = node2.audionode;
              }
              var target_node = node2.graph.getNodeById(
                link_info.target_id
              );
              var target_audionode = null;
              if (target_node.getAudioNodeInInputSlot) {
                target_audionode = target_node.getAudioNodeInInputSlot(
                  link_info.target_slot
                );
              } else {
                target_audionode = target_node.audionode;
              }
              if (connect) {
                LGAudio.connect(origin_audionode, target_audionode);
              } else {
                LGAudio.disconnect(origin_audionode, target_audionode);
              }
            }
          }
        }
      };
      LGAudio.onConnectionsChange = function(connection, slot, connected, link_info) {
        if (connection != LiteGraph2.OUTPUT) {
          return;
        }
        var target_node = null;
        if (link_info) {
          target_node = this.graph.getNodeById(link_info.target_id);
        }
        if (!target_node) {
          return;
        }
        var local_audionode = null;
        if (this.getAudioNodeInOutputSlot) {
          local_audionode = this.getAudioNodeInOutputSlot(slot);
        } else {
          local_audionode = this.audionode;
        }
        var target_audionode = null;
        if (target_node.getAudioNodeInInputSlot) {
          target_audionode = target_node.getAudioNodeInInputSlot(
            link_info.target_slot
          );
        } else {
          target_audionode = target_node.audionode;
        }
        if (connected) {
          LGAudio.connect(local_audionode, target_audionode);
        } else {
          LGAudio.disconnect(local_audionode, target_audionode);
        }
      };
      LGAudio.createAudioNodeWrapper = function(class_object) {
        var old_func = class_object.prototype.onPropertyChanged;
        class_object.prototype.onPropertyChanged = function(name, value) {
          if (old_func) {
            old_func.call(this, name, value);
          }
          if (!this.audionode) {
            return;
          }
          if (this.audionode[name] === void 0) {
            return;
          }
          if (this.audionode[name].value !== void 0) {
            this.audionode[name].value = value;
          } else {
            this.audionode[name] = value;
          }
        };
        class_object.prototype.onConnectionsChange = LGAudio.onConnectionsChange;
      };
      LGAudio.cached_audios = {};
      LGAudio.loadSound = function(url, on_complete, on_error) {
        if (LGAudio.cached_audios[url] && url.indexOf("blob:") == -1) {
          if (on_complete) {
            on_complete(LGAudio.cached_audios[url]);
          }
          return;
        }
        if (LGAudio.onProcessAudioURL) {
          url = LGAudio.onProcessAudioURL(url);
        }
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        var context = LGAudio.getAudioContext();
        request.onload = function() {
          console.log("AudioSource loaded");
          context.decodeAudioData(
            request.response,
            function(buffer) {
              console.log("AudioSource decoded");
              LGAudio.cached_audios[url] = buffer;
              if (on_complete) {
                on_complete(buffer);
              }
            },
            onError
          );
        };
        request.send();
        function onError(err) {
          console.log("Audio loading sample error:", err);
          if (on_error) {
            on_error(err);
          }
        }
        return request;
      };
      function LGAudioSource() {
        this.properties = {
          src: "",
          gain: 0.5,
          loop: true,
          autoplay: true,
          playbackRate: 1
        };
        this._loading_audio = false;
        this._audiobuffer = null;
        this._audionodes = [];
        this._last_sourcenode = null;
        this.addOutput("out", "audio");
        this.addInput("gain", "number");
        var context = LGAudio.getAudioContext();
        this.audionode = context.createGain();
        this.audionode.graphnode = this;
        this.audionode.gain.value = this.properties.gain;
        if (this.properties.src) {
          this.loadSound(this.properties.src);
        }
      }
      LGAudioSource.desc = "Plays an audio file";
      LGAudioSource["@src"] = { widget: "resource" };
      LGAudioSource.supported_extensions = ["wav", "ogg", "mp3"];
      LGAudioSource.prototype.onAdded = function(graph) {
        if (graph.status === LGraph.STATUS_RUNNING) {
          this.onStart();
        }
      };
      LGAudioSource.prototype.onStart = function() {
        if (!this._audiobuffer) {
          return;
        }
        if (this.properties.autoplay) {
          this.playBuffer(this._audiobuffer);
        }
      };
      LGAudioSource.prototype.onStop = function() {
        this.stopAllSounds();
      };
      LGAudioSource.prototype.onPause = function() {
        this.pauseAllSounds();
      };
      LGAudioSource.prototype.onUnpause = function() {
        this.unpauseAllSounds();
      };
      LGAudioSource.prototype.onRemoved = function() {
        this.stopAllSounds();
        if (this._dropped_url) {
          URL.revokeObjectURL(this._url);
        }
      };
      LGAudioSource.prototype.stopAllSounds = function() {
        for (var i2 = 0; i2 < this._audionodes.length; ++i2) {
          if (this._audionodes[i2].started) {
            this._audionodes[i2].started = false;
            this._audionodes[i2].stop();
          }
        }
        this._audionodes.length = 0;
      };
      LGAudioSource.prototype.pauseAllSounds = function() {
        LGAudio.getAudioContext().suspend();
      };
      LGAudioSource.prototype.unpauseAllSounds = function() {
        LGAudio.getAudioContext().resume();
      };
      LGAudioSource.prototype.onExecute = function() {
        if (this.inputs) {
          for (var i2 = 0; i2 < this.inputs.length; ++i2) {
            var input = this.inputs[i2];
            if (input.link == null) {
              continue;
            }
            var v2 = this.getInputData(i2);
            if (v2 === void 0) {
              continue;
            }
            if (input.name == "gain")
              this.audionode.gain.value = v2;
            else if (input.name == "src") {
              this.setProperty("src", v2);
            } else if (input.name == "playbackRate") {
              this.properties.playbackRate = v2;
              for (var j = 0; j < this._audionodes.length; ++j) {
                this._audionodes[j].playbackRate.value = v2;
              }
            }
          }
        }
        if (this.outputs) {
          for (var i2 = 0; i2 < this.outputs.length; ++i2) {
            var output = this.outputs[i2];
            if (output.name == "buffer" && this._audiobuffer) {
              this.setOutputData(i2, this._audiobuffer);
            }
          }
        }
      };
      LGAudioSource.prototype.onAction = function(event2) {
        if (this._audiobuffer) {
          if (event2 == "Play") {
            this.playBuffer(this._audiobuffer);
          } else if (event2 == "Stop") {
            this.stopAllSounds();
          }
        }
      };
      LGAudioSource.prototype.onPropertyChanged = function(name, value) {
        if (name == "src") {
          this.loadSound(value);
        } else if (name == "gain") {
          this.audionode.gain.value = value;
        } else if (name == "playbackRate") {
          for (var j = 0; j < this._audionodes.length; ++j) {
            this._audionodes[j].playbackRate.value = value;
          }
        }
      };
      LGAudioSource.prototype.playBuffer = function(buffer) {
        var that2 = this;
        var context = LGAudio.getAudioContext();
        var audionode = context.createBufferSource();
        this._last_sourcenode = audionode;
        audionode.graphnode = this;
        audionode.buffer = buffer;
        audionode.loop = this.properties.loop;
        audionode.playbackRate.value = this.properties.playbackRate;
        this._audionodes.push(audionode);
        audionode.connect(this.audionode);
        this._audionodes.push(audionode);
        this.trigger("start");
        audionode.onended = function() {
          that2.trigger("ended");
          var index2 = that2._audionodes.indexOf(audionode);
          if (index2 != -1) {
            that2._audionodes.splice(index2, 1);
          }
        };
        if (!audionode.started) {
          audionode.started = true;
          audionode.start();
        }
        return audionode;
      };
      LGAudioSource.prototype.loadSound = function(url) {
        var that2 = this;
        if (this._request) {
          this._request.abort();
          this._request = null;
        }
        this._audiobuffer = null;
        this._loading_audio = false;
        if (!url) {
          return;
        }
        this._request = LGAudio.loadSound(url, inner);
        this._loading_audio = true;
        this.boxcolor = "#AA4";
        function inner(buffer) {
          this.boxcolor = LiteGraph2.NODE_DEFAULT_BOXCOLOR;
          that2._audiobuffer = buffer;
          that2._loading_audio = false;
          if (that2.graph && that2.graph.status === LGraph.STATUS_RUNNING) {
            that2.onStart();
          }
        }
      };
      LGAudioSource.prototype.onConnectionsChange = LGAudio.onConnectionsChange;
      LGAudioSource.prototype.onGetInputs = function() {
        return [
          ["playbackRate", "number"],
          ["src", "string"],
          ["Play", LiteGraph2.ACTION],
          ["Stop", LiteGraph2.ACTION]
        ];
      };
      LGAudioSource.prototype.onGetOutputs = function() {
        return [["buffer", "audiobuffer"], ["start", LiteGraph2.EVENT], ["ended", LiteGraph2.EVENT]];
      };
      LGAudioSource.prototype.onDropFile = function(file) {
        if (this._dropped_url) {
          URL.revokeObjectURL(this._dropped_url);
        }
        var url = URL.createObjectURL(file);
        this.properties.src = url;
        this.loadSound(url);
        this._dropped_url = url;
      };
      LGAudioSource.title = "Source";
      LGAudioSource.desc = "Plays audio";
      LiteGraph2.registerNodeType("audio/source", LGAudioSource);
      function LGAudioMediaSource() {
        this.properties = {
          gain: 0.5
        };
        this._audionodes = [];
        this._media_stream = null;
        this.addOutput("out", "audio");
        this.addInput("gain", "number");
        var context = LGAudio.getAudioContext();
        this.audionode = context.createGain();
        this.audionode.graphnode = this;
        this.audionode.gain.value = this.properties.gain;
      }
      LGAudioMediaSource.prototype.onAdded = function(graph) {
        if (graph.status === LGraph.STATUS_RUNNING) {
          this.onStart();
        }
      };
      LGAudioMediaSource.prototype.onStart = function() {
        if (this._media_stream == null && !this._waiting_confirmation) {
          this.openStream();
        }
      };
      LGAudioMediaSource.prototype.onStop = function() {
        this.audionode.gain.value = 0;
      };
      LGAudioMediaSource.prototype.onPause = function() {
        this.audionode.gain.value = 0;
      };
      LGAudioMediaSource.prototype.onUnpause = function() {
        this.audionode.gain.value = this.properties.gain;
      };
      LGAudioMediaSource.prototype.onRemoved = function() {
        this.audionode.gain.value = 0;
        if (this.audiosource_node) {
          this.audiosource_node.disconnect(this.audionode);
          this.audiosource_node = null;
        }
        if (this._media_stream) {
          var tracks = this._media_stream.getTracks();
          if (tracks.length) {
            tracks[0].stop();
          }
        }
      };
      LGAudioMediaSource.prototype.openStream = function() {
        if (!navigator.mediaDevices) {
          console.log(
            "getUserMedia() is not supported in your browser, use chrome and enable WebRTC from about://flags"
          );
          return;
        }
        this._waiting_confirmation = true;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(this.streamReady.bind(this)).catch(onFailSoHard);
        var that2 = this;
        function onFailSoHard(err) {
          console.log("Media rejected", err);
          that2._media_stream = false;
          that2.boxcolor = "red";
        }
      };
      LGAudioMediaSource.prototype.streamReady = function(localMediaStream) {
        this._media_stream = localMediaStream;
        if (this.audiosource_node) {
          this.audiosource_node.disconnect(this.audionode);
        }
        var context = LGAudio.getAudioContext();
        this.audiosource_node = context.createMediaStreamSource(
          localMediaStream
        );
        this.audiosource_node.graphnode = this;
        this.audiosource_node.connect(this.audionode);
        this.boxcolor = "white";
      };
      LGAudioMediaSource.prototype.onExecute = function() {
        if (this._media_stream == null && !this._waiting_confirmation) {
          this.openStream();
        }
        if (this.inputs) {
          for (var i2 = 0; i2 < this.inputs.length; ++i2) {
            var input = this.inputs[i2];
            if (input.link == null) {
              continue;
            }
            var v2 = this.getInputData(i2);
            if (v2 === void 0) {
              continue;
            }
            if (input.name == "gain") {
              this.audionode.gain.value = this.properties.gain = v2;
            }
          }
        }
      };
      LGAudioMediaSource.prototype.onAction = function(event2) {
        if (event2 == "Play") {
          this.audionode.gain.value = this.properties.gain;
        } else if (event2 == "Stop") {
          this.audionode.gain.value = 0;
        }
      };
      LGAudioMediaSource.prototype.onPropertyChanged = function(name, value) {
        if (name == "gain") {
          this.audionode.gain.value = value;
        }
      };
      LGAudioMediaSource.prototype.onConnectionsChange = LGAudio.onConnectionsChange;
      LGAudioMediaSource.prototype.onGetInputs = function() {
        return [
          ["playbackRate", "number"],
          ["Play", LiteGraph2.ACTION],
          ["Stop", LiteGraph2.ACTION]
        ];
      };
      LGAudioMediaSource.title = "MediaSource";
      LGAudioMediaSource.desc = "Plays microphone";
      LiteGraph2.registerNodeType("audio/media_source", LGAudioMediaSource);
      function LGAudioAnalyser() {
        this.properties = {
          fftSize: 2048,
          minDecibels: -100,
          maxDecibels: -10,
          smoothingTimeConstant: 0.5
        };
        var context = LGAudio.getAudioContext();
        this.audionode = context.createAnalyser();
        this.audionode.graphnode = this;
        this.audionode.fftSize = this.properties.fftSize;
        this.audionode.minDecibels = this.properties.minDecibels;
        this.audionode.maxDecibels = this.properties.maxDecibels;
        this.audionode.smoothingTimeConstant = this.properties.smoothingTimeConstant;
        this.addInput("in", "audio");
        this.addOutput("freqs", "array");
        this.addOutput("samples", "array");
        this._freq_bin = null;
        this._time_bin = null;
      }
      LGAudioAnalyser.prototype.onPropertyChanged = function(name, value) {
        this.audionode[name] = value;
      };
      LGAudioAnalyser.prototype.onExecute = function() {
        if (this.isOutputConnected(0)) {
          var bufferLength = this.audionode.frequencyBinCount;
          if (!this._freq_bin || this._freq_bin.length != bufferLength) {
            this._freq_bin = new Uint8Array(bufferLength);
          }
          this.audionode.getByteFrequencyData(this._freq_bin);
          this.setOutputData(0, this._freq_bin);
        }
        if (this.isOutputConnected(1)) {
          var bufferLength = this.audionode.frequencyBinCount;
          if (!this._time_bin || this._time_bin.length != bufferLength) {
            this._time_bin = new Uint8Array(bufferLength);
          }
          this.audionode.getByteTimeDomainData(this._time_bin);
          this.setOutputData(1, this._time_bin);
        }
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var input = this.inputs[i2];
          if (input.link == null) {
            continue;
          }
          var v2 = this.getInputData(i2);
          if (v2 !== void 0) {
            this.audionode[input.name].value = v2;
          }
        }
      };
      LGAudioAnalyser.prototype.onGetInputs = function() {
        return [
          ["minDecibels", "number"],
          ["maxDecibels", "number"],
          ["smoothingTimeConstant", "number"]
        ];
      };
      LGAudioAnalyser.prototype.onGetOutputs = function() {
        return [["freqs", "array"], ["samples", "array"]];
      };
      LGAudioAnalyser.title = "Analyser";
      LGAudioAnalyser.desc = "Audio Analyser";
      LiteGraph2.registerNodeType("audio/analyser", LGAudioAnalyser);
      function LGAudioGain() {
        this.properties = {
          gain: 1
        };
        this.audionode = LGAudio.getAudioContext().createGain();
        this.addInput("in", "audio");
        this.addInput("gain", "number");
        this.addOutput("out", "audio");
      }
      LGAudioGain.prototype.onExecute = function() {
        if (!this.inputs || !this.inputs.length) {
          return;
        }
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var input = this.inputs[i2];
          var v2 = this.getInputData(i2);
          if (v2 !== void 0) {
            this.audionode[input.name].value = v2;
          }
        }
      };
      LGAudio.createAudioNodeWrapper(LGAudioGain);
      LGAudioGain.title = "Gain";
      LGAudioGain.desc = "Audio gain";
      LiteGraph2.registerNodeType("audio/gain", LGAudioGain);
      function LGAudioConvolver() {
        this.properties = {
          impulse_src: "",
          normalize: true
        };
        this.audionode = LGAudio.getAudioContext().createConvolver();
        this.addInput("in", "audio");
        this.addOutput("out", "audio");
      }
      LGAudio.createAudioNodeWrapper(LGAudioConvolver);
      LGAudioConvolver.prototype.onRemove = function() {
        if (this._dropped_url) {
          URL.revokeObjectURL(this._dropped_url);
        }
      };
      LGAudioConvolver.prototype.onPropertyChanged = function(name, value) {
        if (name == "impulse_src") {
          this.loadImpulse(value);
        } else if (name == "normalize") {
          this.audionode.normalize = value;
        }
      };
      LGAudioConvolver.prototype.onDropFile = function(file) {
        if (this._dropped_url) {
          URL.revokeObjectURL(this._dropped_url);
        }
        this._dropped_url = URL.createObjectURL(file);
        this.properties.impulse_src = this._dropped_url;
        this.loadImpulse(this._dropped_url);
      };
      LGAudioConvolver.prototype.loadImpulse = function(url) {
        var that2 = this;
        if (this._request) {
          this._request.abort();
          this._request = null;
        }
        this._impulse_buffer = null;
        this._loading_impulse = false;
        if (!url) {
          return;
        }
        this._request = LGAudio.loadSound(url, inner);
        this._loading_impulse = true;
        function inner(buffer) {
          that2._impulse_buffer = buffer;
          that2.audionode.buffer = buffer;
          console.log("Impulse signal set");
          that2._loading_impulse = false;
        }
      };
      LGAudioConvolver.title = "Convolver";
      LGAudioConvolver.desc = "Convolves the signal (used for reverb)";
      LiteGraph2.registerNodeType("audio/convolver", LGAudioConvolver);
      function LGAudioDynamicsCompressor() {
        this.properties = {
          threshold: -50,
          knee: 40,
          ratio: 12,
          reduction: -20,
          attack: 0,
          release: 0.25
        };
        this.audionode = LGAudio.getAudioContext().createDynamicsCompressor();
        this.addInput("in", "audio");
        this.addOutput("out", "audio");
      }
      LGAudio.createAudioNodeWrapper(LGAudioDynamicsCompressor);
      LGAudioDynamicsCompressor.prototype.onExecute = function() {
        if (!this.inputs || !this.inputs.length) {
          return;
        }
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var input = this.inputs[i2];
          if (input.link == null) {
            continue;
          }
          var v2 = this.getInputData(i2);
          if (v2 !== void 0) {
            this.audionode[input.name].value = v2;
          }
        }
      };
      LGAudioDynamicsCompressor.prototype.onGetInputs = function() {
        return [
          ["threshold", "number"],
          ["knee", "number"],
          ["ratio", "number"],
          ["reduction", "number"],
          ["attack", "number"],
          ["release", "number"]
        ];
      };
      LGAudioDynamicsCompressor.title = "DynamicsCompressor";
      LGAudioDynamicsCompressor.desc = "Dynamics Compressor";
      LiteGraph2.registerNodeType(
        "audio/dynamicsCompressor",
        LGAudioDynamicsCompressor
      );
      function LGAudioWaveShaper() {
        this.properties = {};
        this.audionode = LGAudio.getAudioContext().createWaveShaper();
        this.addInput("in", "audio");
        this.addInput("shape", "waveshape");
        this.addOutput("out", "audio");
      }
      LGAudioWaveShaper.prototype.onExecute = function() {
        if (!this.inputs || !this.inputs.length) {
          return;
        }
        var v2 = this.getInputData(1);
        if (v2 === void 0) {
          return;
        }
        this.audionode.curve = v2;
      };
      LGAudioWaveShaper.prototype.setWaveShape = function(shape) {
        this.audionode.curve = shape;
      };
      LGAudio.createAudioNodeWrapper(LGAudioWaveShaper);
      function LGAudioMixer() {
        this.properties = {
          gain1: 0.5,
          gain2: 0.5
        };
        this.audionode = LGAudio.getAudioContext().createGain();
        this.audionode1 = LGAudio.getAudioContext().createGain();
        this.audionode1.gain.value = this.properties.gain1;
        this.audionode2 = LGAudio.getAudioContext().createGain();
        this.audionode2.gain.value = this.properties.gain2;
        this.audionode1.connect(this.audionode);
        this.audionode2.connect(this.audionode);
        this.addInput("in1", "audio");
        this.addInput("in1 gain", "number");
        this.addInput("in2", "audio");
        this.addInput("in2 gain", "number");
        this.addOutput("out", "audio");
      }
      LGAudioMixer.prototype.getAudioNodeInInputSlot = function(slot) {
        if (slot == 0) {
          return this.audionode1;
        } else if (slot == 2) {
          return this.audionode2;
        }
      };
      LGAudioMixer.prototype.onPropertyChanged = function(name, value) {
        if (name == "gain1") {
          this.audionode1.gain.value = value;
        } else if (name == "gain2") {
          this.audionode2.gain.value = value;
        }
      };
      LGAudioMixer.prototype.onExecute = function() {
        if (!this.inputs || !this.inputs.length) {
          return;
        }
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var input = this.inputs[i2];
          if (input.link == null || input.type == "audio") {
            continue;
          }
          var v2 = this.getInputData(i2);
          if (v2 === void 0) {
            continue;
          }
          if (i2 == 1) {
            this.audionode1.gain.value = v2;
          } else if (i2 == 3) {
            this.audionode2.gain.value = v2;
          }
        }
      };
      LGAudio.createAudioNodeWrapper(LGAudioMixer);
      LGAudioMixer.title = "Mixer";
      LGAudioMixer.desc = "Audio mixer";
      LiteGraph2.registerNodeType("audio/mixer", LGAudioMixer);
      function LGAudioADSR() {
        this.properties = {
          A: 0.1,
          D: 0.1,
          S: 0.1,
          R: 0.1
        };
        this.audionode = LGAudio.getAudioContext().createGain();
        this.audionode.gain.value = 0;
        this.addInput("in", "audio");
        this.addInput("gate", "boolean");
        this.addOutput("out", "audio");
        this.gate = false;
      }
      LGAudioADSR.prototype.onExecute = function() {
        var audioContext = LGAudio.getAudioContext();
        var now = audioContext.currentTime;
        var node2 = this.audionode;
        var gain = node2.gain;
        var current_gate = this.getInputData(1);
        var A = this.getInputOrProperty("A");
        var D = this.getInputOrProperty("D");
        var S = this.getInputOrProperty("S");
        var R = this.getInputOrProperty("R");
        if (!this.gate && current_gate) {
          gain.cancelScheduledValues(0);
          gain.setValueAtTime(0, now);
          gain.linearRampToValueAtTime(1, now + A);
          gain.linearRampToValueAtTime(S, now + A + D);
        } else if (this.gate && !current_gate) {
          gain.cancelScheduledValues(0);
          gain.setValueAtTime(gain.value, now);
          gain.linearRampToValueAtTime(0, now + R);
        }
        this.gate = current_gate;
      };
      LGAudioADSR.prototype.onGetInputs = function() {
        return [
          ["A", "number"],
          ["D", "number"],
          ["S", "number"],
          ["R", "number"]
        ];
      };
      LGAudio.createAudioNodeWrapper(LGAudioADSR);
      LGAudioADSR.title = "ADSR";
      LGAudioADSR.desc = "Audio envelope";
      LiteGraph2.registerNodeType("audio/adsr", LGAudioADSR);
      function LGAudioDelay() {
        this.properties = {
          delayTime: 0.5
        };
        this.audionode = LGAudio.getAudioContext().createDelay(10);
        this.audionode.delayTime.value = this.properties.delayTime;
        this.addInput("in", "audio");
        this.addInput("time", "number");
        this.addOutput("out", "audio");
      }
      LGAudio.createAudioNodeWrapper(LGAudioDelay);
      LGAudioDelay.prototype.onExecute = function() {
        var v2 = this.getInputData(1);
        if (v2 !== void 0) {
          this.audionode.delayTime.value = v2;
        }
      };
      LGAudioDelay.title = "Delay";
      LGAudioDelay.desc = "Audio delay";
      LiteGraph2.registerNodeType("audio/delay", LGAudioDelay);
      function LGAudioBiquadFilter() {
        this.properties = {
          frequency: 350,
          detune: 0,
          Q: 1
        };
        this.addProperty("type", "lowpass", "enum", {
          values: [
            "lowpass",
            "highpass",
            "bandpass",
            "lowshelf",
            "highshelf",
            "peaking",
            "notch",
            "allpass"
          ]
        });
        this.audionode = LGAudio.getAudioContext().createBiquadFilter();
        this.addInput("in", "audio");
        this.addOutput("out", "audio");
      }
      LGAudioBiquadFilter.prototype.onExecute = function() {
        if (!this.inputs || !this.inputs.length) {
          return;
        }
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var input = this.inputs[i2];
          if (input.link == null) {
            continue;
          }
          var v2 = this.getInputData(i2);
          if (v2 !== void 0) {
            this.audionode[input.name].value = v2;
          }
        }
      };
      LGAudioBiquadFilter.prototype.onGetInputs = function() {
        return [["frequency", "number"], ["detune", "number"], ["Q", "number"]];
      };
      LGAudio.createAudioNodeWrapper(LGAudioBiquadFilter);
      LGAudioBiquadFilter.title = "BiquadFilter";
      LGAudioBiquadFilter.desc = "Audio filter";
      LiteGraph2.registerNodeType("audio/biquadfilter", LGAudioBiquadFilter);
      function LGAudioOscillatorNode() {
        this.properties = {
          frequency: 440,
          detune: 0,
          type: "sine"
        };
        this.addProperty("type", "sine", "enum", {
          values: ["sine", "square", "sawtooth", "triangle", "custom"]
        });
        this.audionode = LGAudio.getAudioContext().createOscillator();
        this.addOutput("out", "audio");
      }
      LGAudioOscillatorNode.prototype.onStart = function() {
        if (!this.audionode.started) {
          this.audionode.started = true;
          try {
            this.audionode.start();
          } catch (err) {
          }
        }
      };
      LGAudioOscillatorNode.prototype.onStop = function() {
        if (this.audionode.started) {
          this.audionode.started = false;
          this.audionode.stop();
        }
      };
      LGAudioOscillatorNode.prototype.onPause = function() {
        this.onStop();
      };
      LGAudioOscillatorNode.prototype.onUnpause = function() {
        this.onStart();
      };
      LGAudioOscillatorNode.prototype.onExecute = function() {
        if (!this.inputs || !this.inputs.length) {
          return;
        }
        for (var i2 = 0; i2 < this.inputs.length; ++i2) {
          var input = this.inputs[i2];
          if (input.link == null) {
            continue;
          }
          var v2 = this.getInputData(i2);
          if (v2 !== void 0) {
            this.audionode[input.name].value = v2;
          }
        }
      };
      LGAudioOscillatorNode.prototype.onGetInputs = function() {
        return [
          ["frequency", "number"],
          ["detune", "number"],
          ["type", "string"]
        ];
      };
      LGAudio.createAudioNodeWrapper(LGAudioOscillatorNode);
      LGAudioOscillatorNode.title = "Oscillator";
      LGAudioOscillatorNode.desc = "Oscillator";
      LiteGraph2.registerNodeType("audio/oscillator", LGAudioOscillatorNode);
      function LGAudioVisualization() {
        this.properties = {
          continuous: true,
          mark: -1
        };
        this.addInput("data", "array");
        this.addInput("mark", "number");
        this.size = [300, 200];
        this._last_buffer = null;
      }
      LGAudioVisualization.prototype.onExecute = function() {
        this._last_buffer = this.getInputData(0);
        var v2 = this.getInputData(1);
        if (v2 !== void 0) {
          this.properties.mark = v2;
        }
        this.setDirtyCanvas(true, false);
      };
      LGAudioVisualization.prototype.onDrawForeground = function(ctx) {
        if (!this._last_buffer) {
          return;
        }
        var buffer = this._last_buffer;
        var delta2 = buffer.length / this.size[0];
        var h = this.size[1];
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.size[0], this.size[1]);
        ctx.strokeStyle = "white";
        ctx.beginPath();
        var x2 = 0;
        if (this.properties.continuous) {
          ctx.moveTo(x2, h);
          for (var i2 = 0; i2 < buffer.length; i2 += delta2) {
            ctx.lineTo(x2, h - buffer[i2 | 0] / 255 * h);
            x2++;
          }
        } else {
          for (var i2 = 0; i2 < buffer.length; i2 += delta2) {
            ctx.moveTo(x2 + 0.5, h);
            ctx.lineTo(x2 + 0.5, h - buffer[i2 | 0] / 255 * h);
            x2++;
          }
        }
        ctx.stroke();
        if (this.properties.mark >= 0) {
          var samplerate = LGAudio.getAudioContext().sampleRate;
          var binfreq = samplerate / buffer.length;
          var x2 = 2 * (this.properties.mark / binfreq) / delta2;
          if (x2 >= this.size[0]) {
            x2 = this.size[0] - 1;
          }
          ctx.strokeStyle = "red";
          ctx.beginPath();
          ctx.moveTo(x2, h);
          ctx.lineTo(x2, 0);
          ctx.stroke();
        }
      };
      LGAudioVisualization.title = "Visualization";
      LGAudioVisualization.desc = "Audio Visualization";
      LiteGraph2.registerNodeType("audio/visualization", LGAudioVisualization);
      function LGAudioBandSignal() {
        this.properties = {
          band: 440,
          amplitude: 1
        };
        this.addInput("freqs", "array");
        this.addOutput("signal", "number");
      }
      LGAudioBandSignal.prototype.onExecute = function() {
        this._freqs = this.getInputData(0);
        if (!this._freqs) {
          return;
        }
        var band = this.properties.band;
        var v2 = this.getInputData(1);
        if (v2 !== void 0) {
          band = v2;
        }
        var samplerate = LGAudio.getAudioContext().sampleRate;
        var binfreq = samplerate / this._freqs.length;
        var index2 = 2 * (band / binfreq);
        var v2 = 0;
        if (index2 < 0) {
          v2 = this._freqs[0];
        }
        if (index2 >= this._freqs.length) {
          v2 = this._freqs[this._freqs.length - 1];
        } else {
          var pos2 = index2 | 0;
          var v0 = this._freqs[pos2];
          var v1 = this._freqs[pos2 + 1];
          var f = index2 - pos2;
          v2 = v0 * (1 - f) + v1 * f;
        }
        this.setOutputData(0, v2 / 255 * this.properties.amplitude);
      };
      LGAudioBandSignal.prototype.onGetInputs = function() {
        return [["band", "number"]];
      };
      LGAudioBandSignal.title = "Signal";
      LGAudioBandSignal.desc = "extract the signal of some frequency";
      LiteGraph2.registerNodeType("audio/signal", LGAudioBandSignal);
      function LGAudioScript() {
        if (!LGAudioScript.default_code) {
          var code = LGAudioScript.default_function.toString();
          var index2 = code.indexOf("{") + 1;
          var index22 = code.lastIndexOf("}");
          LGAudioScript.default_code = code.substr(index2, index22 - index2);
        }
        this.properties = {
          code: LGAudioScript.default_code
        };
        var ctx = LGAudio.getAudioContext();
        if (ctx.createScriptProcessor) {
          this.audionode = ctx.createScriptProcessor(4096, 1, 1);
        } else {
          console.warn("ScriptProcessorNode deprecated");
          this.audionode = ctx.createGain();
        }
        this.processCode();
        if (!LGAudioScript._bypass_function) {
          LGAudioScript._bypass_function = this.audionode.onaudioprocess;
        }
        this.addInput("in", "audio");
        this.addOutput("out", "audio");
      }
      LGAudioScript.prototype.onAdded = function(graph) {
        if (graph.status == LGraph.STATUS_RUNNING) {
          this.audionode.onaudioprocess = this._callback;
        }
      };
      LGAudioScript["@code"] = { widget: "code", type: "code" };
      LGAudioScript.prototype.onStart = function() {
        this.audionode.onaudioprocess = this._callback;
      };
      LGAudioScript.prototype.onStop = function() {
        this.audionode.onaudioprocess = LGAudioScript._bypass_function;
      };
      LGAudioScript.prototype.onPause = function() {
        this.audionode.onaudioprocess = LGAudioScript._bypass_function;
      };
      LGAudioScript.prototype.onUnpause = function() {
        this.audionode.onaudioprocess = this._callback;
      };
      LGAudioScript.prototype.onExecute = function() {
      };
      LGAudioScript.prototype.onRemoved = function() {
        this.audionode.onaudioprocess = LGAudioScript._bypass_function;
      };
      LGAudioScript.prototype.processCode = function() {
        try {
          var func = new Function("properties", this.properties.code);
          this._script = new func(this.properties);
          this._old_code = this.properties.code;
          this._callback = this._script.onaudioprocess;
        } catch (err) {
          console.error("Error in onaudioprocess code", err);
          this._callback = LGAudioScript._bypass_function;
          this.audionode.onaudioprocess = this._callback;
        }
      };
      LGAudioScript.prototype.onPropertyChanged = function(name, value) {
        if (name == "code") {
          this.properties.code = value;
          this.processCode();
          if (this.graph && this.graph.status == LGraph.STATUS_RUNNING) {
            this.audionode.onaudioprocess = this._callback;
          }
        }
      };
      LGAudioScript.default_function = function() {
        this.onaudioprocess = function(audioProcessingEvent) {
          var inputBuffer = audioProcessingEvent.inputBuffer;
          var outputBuffer = audioProcessingEvent.outputBuffer;
          for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            var inputData = inputBuffer.getChannelData(channel);
            var outputData = outputBuffer.getChannelData(channel);
            for (var sample = 0; sample < inputBuffer.length; sample++) {
              outputData[sample] = inputData[sample];
            }
          }
        };
      };
      LGAudio.createAudioNodeWrapper(LGAudioScript);
      LGAudioScript.title = "Script";
      LGAudioScript.desc = "apply script to signal";
      LiteGraph2.registerNodeType("audio/script", LGAudioScript);
      function LGAudioDestination() {
        this.audionode = LGAudio.getAudioContext().destination;
        this.addInput("in", "audio");
      }
      LGAudioDestination.title = "Destination";
      LGAudioDestination.desc = "Audio output";
      LiteGraph2.registerNodeType("audio/destination", LGAudioDestination);
    })(litegraph);
    (function(global2) {
      var LiteGraph2 = global2.LiteGraph;
      function LGWebSocket() {
        this.size = [60, 20];
        this.addInput("send", LiteGraph2.ACTION);
        this.addOutput("received", LiteGraph2.EVENT);
        this.addInput("in", 0);
        this.addOutput("out", 0);
        this.properties = {
          url: "",
          room: "lgraph",
          //allows to filter messages,
          only_send_changes: true
        };
        this._ws = null;
        this._last_sent_data = [];
        this._last_received_data = [];
      }
      LGWebSocket.title = "WebSocket";
      LGWebSocket.desc = "Send data through a websocket";
      LGWebSocket.prototype.onPropertyChanged = function(name, value) {
        if (name == "url") {
          this.connectSocket();
        }
      };
      LGWebSocket.prototype.onExecute = function() {
        if (!this._ws && this.properties.url) {
          this.connectSocket();
        }
        if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
          return;
        }
        var room = this.properties.room;
        var only_changes = this.properties.only_send_changes;
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var data = this.getInputData(i2);
          if (data == null) {
            continue;
          }
          var json;
          try {
            json = JSON.stringify({
              type: 0,
              room,
              channel: i2,
              data
            });
          } catch (err) {
            continue;
          }
          if (only_changes && this._last_sent_data[i2] == json) {
            continue;
          }
          this._last_sent_data[i2] = json;
          this._ws.send(json);
        }
        for (var i2 = 1; i2 < this.outputs.length; ++i2) {
          this.setOutputData(i2, this._last_received_data[i2]);
        }
        if (this.boxcolor == "#AFA") {
          this.boxcolor = "#6C6";
        }
      };
      LGWebSocket.prototype.connectSocket = function() {
        var that2 = this;
        var url = this.properties.url;
        if (url.substr(0, 2) != "ws") {
          url = "ws://" + url;
        }
        this._ws = new WebSocket(url);
        this._ws.onopen = function() {
          console.log("ready");
          that2.boxcolor = "#6C6";
        };
        this._ws.onmessage = function(e) {
          that2.boxcolor = "#AFA";
          var data = JSON.parse(e.data);
          if (data.room && data.room != that2.properties.room) {
            return;
          }
          if (data.type == 1) {
            if (data.data.object_class && LiteGraph2[data.data.object_class]) {
              var obj = null;
              try {
                obj = new LiteGraph2[data.data.object_class](data.data);
                that2.triggerSlot(0, obj);
              } catch (err) {
                return;
              }
            } else {
              that2.triggerSlot(0, data.data);
            }
          } else {
            that2._last_received_data[data.channel || 0] = data.data;
          }
        };
        this._ws.onerror = function(e) {
          console.log("couldnt connect to websocket");
          that2.boxcolor = "#E88";
        };
        this._ws.onclose = function(e) {
          console.log("connection closed");
          that2.boxcolor = "#000";
        };
      };
      LGWebSocket.prototype.send = function(data) {
        if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
          return;
        }
        this._ws.send(JSON.stringify({ type: 1, msg: data }));
      };
      LGWebSocket.prototype.onAction = function(action, param) {
        if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
          return;
        }
        this._ws.send({
          type: 1,
          room: this.properties.room,
          action,
          data: param
        });
      };
      LGWebSocket.prototype.onGetInputs = function() {
        return [["in", 0]];
      };
      LGWebSocket.prototype.onGetOutputs = function() {
        return [["out", 0]];
      };
      LiteGraph2.registerNodeType("network/websocket", LGWebSocket);
      function LGSillyClient() {
        this.room_widget = this.addWidget(
          "text",
          "Room",
          "lgraph",
          this.setRoom.bind(this)
        );
        this.addWidget(
          "button",
          "Reconnect",
          null,
          this.connectSocket.bind(this)
        );
        this.addInput("send", LiteGraph2.ACTION);
        this.addOutput("received", LiteGraph2.EVENT);
        this.addInput("in", 0);
        this.addOutput("out", 0);
        this.properties = {
          url: "tamats.com:55000",
          room: "lgraph",
          only_send_changes: true
        };
        this._server = null;
        this.connectSocket();
        this._last_sent_data = [];
        this._last_received_data = [];
        if (typeof SillyClient == "undefined")
          console.warn("remember to add SillyClient.js to your project: https://tamats.com/projects/sillyserver/src/sillyclient.js");
      }
      LGSillyClient.title = "SillyClient";
      LGSillyClient.desc = "Connects to SillyServer to broadcast messages";
      LGSillyClient.prototype.onPropertyChanged = function(name, value) {
        if (name == "room") {
          this.room_widget.value = value;
        }
        this.connectSocket();
      };
      LGSillyClient.prototype.setRoom = function(room_name) {
        this.properties.room = room_name;
        this.room_widget.value = room_name;
        this.connectSocket();
      };
      LGSillyClient.prototype.onDrawForeground = function() {
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var slot = this.inputs[i2];
          slot.label = "in_" + i2;
        }
        for (var i2 = 1; i2 < this.outputs.length; ++i2) {
          var slot = this.outputs[i2];
          slot.label = "out_" + i2;
        }
      };
      LGSillyClient.prototype.onExecute = function() {
        if (!this._server || !this._server.is_connected) {
          return;
        }
        var only_send_changes = this.properties.only_send_changes;
        for (var i2 = 1; i2 < this.inputs.length; ++i2) {
          var data = this.getInputData(i2);
          var prev_data = this._last_sent_data[i2];
          if (data != null) {
            if (only_send_changes) {
              var is_equal = true;
              if (data && data.length && prev_data && prev_data.length == data.length && data.constructor !== String) {
                for (var j = 0; j < data.length; ++j)
                  if (prev_data[j] != data[j]) {
                    is_equal = false;
                    break;
                  }
              } else if (this._last_sent_data[i2] != data)
                is_equal = false;
              if (is_equal)
                continue;
            }
            this._server.sendMessage({ type: 0, channel: i2, data });
            if (data.length && data.constructor !== String) {
              if (this._last_sent_data[i2]) {
                this._last_sent_data[i2].length = data.length;
                for (var j = 0; j < data.length; ++j)
                  this._last_sent_data[i2][j] = data[j];
              } else {
                if (data.constructor === Array)
                  this._last_sent_data[i2] = data.concat();
                else
                  this._last_sent_data[i2] = new data.constructor(data);
              }
            } else
              this._last_sent_data[i2] = data;
          }
        }
        for (var i2 = 1; i2 < this.outputs.length; ++i2) {
          this.setOutputData(i2, this._last_received_data[i2]);
        }
        if (this.boxcolor == "#AFA") {
          this.boxcolor = "#6C6";
        }
      };
      LGSillyClient.prototype.connectSocket = function() {
        var that2 = this;
        if (typeof SillyClient == "undefined") {
          if (!this._error) {
            console.error(
              "SillyClient node cannot be used, you must include SillyServer.js"
            );
          }
          this._error = true;
          return;
        }
        this._server = new SillyClient();
        this._server.on_ready = function() {
          console.log("ready");
          that2.boxcolor = "#6C6";
        };
        this._server.on_message = function(id, msg) {
          var data = null;
          try {
            data = JSON.parse(msg);
          } catch (err) {
            return;
          }
          if (data.type == 1) {
            if (data.data.object_class && LiteGraph2[data.data.object_class]) {
              var obj = null;
              try {
                obj = new LiteGraph2[data.data.object_class](data.data);
                that2.triggerSlot(0, obj);
              } catch (err) {
                return;
              }
            } else {
              that2.triggerSlot(0, data.data);
            }
          } else {
            that2._last_received_data[data.channel || 0] = data.data;
          }
          that2.boxcolor = "#AFA";
        };
        this._server.on_error = function(e) {
          console.log("couldnt connect to websocket");
          that2.boxcolor = "#E88";
        };
        this._server.on_close = function(e) {
          console.log("connection closed");
          that2.boxcolor = "#000";
        };
        if (this.properties.url && this.properties.room) {
          try {
            this._server.connect(this.properties.url, this.properties.room);
          } catch (err) {
            console.error("SillyServer error: " + err);
            this._server = null;
            return;
          }
          this._final_url = this.properties.url + "/" + this.properties.room;
        }
      };
      LGSillyClient.prototype.send = function(data) {
        if (!this._server || !this._server.is_connected) {
          return;
        }
        this._server.sendMessage({ type: 1, data });
      };
      LGSillyClient.prototype.onAction = function(action, param) {
        if (!this._server || !this._server.is_connected) {
          return;
        }
        this._server.sendMessage({ type: 1, action, data: param });
      };
      LGSillyClient.prototype.onGetInputs = function() {
        return [["in", 0]];
      };
      LGSillyClient.prototype.onGetOutputs = function() {
        return [["out", 0]];
      };
      LiteGraph2.registerNodeType("network/sillyclient", LGSillyClient);
      function HTTPRequestNode() {
        this.addInput("request", LiteGraph2.ACTION);
        this.addInput("url", "string");
        this.addProperty("url", "");
        this.addOutput("ready", LiteGraph2.EVENT);
        this.addOutput("data", "string");
        this.addWidget("button", "Fetch", null, this.fetch.bind(this));
        this._data = null;
        this._fetching = null;
      }
      HTTPRequestNode.title = "HTTP Request";
      HTTPRequestNode.desc = "Fetch data through HTTP";
      HTTPRequestNode.prototype.fetch = function() {
        var url = this.properties.url;
        if (!url)
          return;
        this.boxcolor = "#FF0";
        var that2 = this;
        this._fetching = fetch(url).then((resp) => {
          if (!resp.ok) {
            this.boxcolor = "#F00";
            that2.trigger("error");
          } else {
            this.boxcolor = "#0F0";
            return resp.text();
          }
        }).then((data) => {
          that2._data = data;
          that2._fetching = null;
          that2.trigger("ready");
        });
      };
      HTTPRequestNode.prototype.onAction = function(evt) {
        if (evt == "request")
          this.fetch();
      };
      HTTPRequestNode.prototype.onExecute = function() {
        this.setOutputData(1, this._data);
      };
      HTTPRequestNode.prototype.onGetOutputs = function() {
        return [["error", LiteGraph2.EVENT]];
      };
      LiteGraph2.registerNodeType("network/httprequest", HTTPRequestNode);
    })(litegraph);
  })(litegraph);
  return litegraph;
}
var litegraphExports = requireLitegraph();
class SceneNode extends litegraphExports.LGraphNode {
  static {
    this.title = "Scene";
  }
  static {
    this.desc = "A scene in the interactive fiction";
  }
  constructor() {
    super();
    this.addInput("in", "scene");
    this.addOutput("out", "scene");
    this.properties = { sceneId: "" };
    this.title = SceneNode.title;
  }
  onExecute() {
  }
}
class ChapterNode extends litegraphExports.LGraphNode {
  static {
    this.title = "Chapter";
  }
  static {
    this.desc = "A chapter in the interactive fiction";
  }
  constructor() {
    super();
    this.addInput("in", "chapter");
    this.addOutput("out", "chapter");
    this.properties = { chapterId: "" };
    this.title = ChapterNode.title;
  }
  onExecute() {
  }
}
function GraphView($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let projectId = $$props["projectId"];
    let chapterId = $$props["chapterId"];
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<p>Loading…</p>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { projectId, chapterId });
  });
}
export {
  GraphView as G
};
