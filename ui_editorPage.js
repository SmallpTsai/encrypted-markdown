"use strict";

var uiEditorPage = {

  init: function(divId) {
    this._div = divId;
    this._noSync = false;
    this._eventHandler = {};
  },

  pageInit: function () {

    var div = this._div;
    var left = this._div + "-left";
    var code = this._div + "-code";
    var right = this._div + "-right";
    var out = this._div + "-out";
    var eventHandler = this._eventHandler;

    $("#"+div).css("display", "none");

    $("#"+div).html("");
    $("#"+div).append(
      $('<div>').attr('class', 'col-sm-6 editor-panel editor-panel-left').attr('id', left).append(
        $('<form>').append(
          $('<textarea>').attr('id', code))));

    $("#"+div).append(
      $('<div>').attr('class', 'col-sm-6 editor-panel editor-panel-right').attr('id', right).append(
        $('<div>').attr('class', 'container-fluid').attr('id', out)));

    // initialize "md to html" 
    var md = markdownit({
      html: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }

        return ''; // use external default escaping
      }
    });
    this._md = md;

    const oldRenderer = md.renderer.renderToken.bind(md.renderer)
    md.renderer.renderToken = function (tokens, idx, options) {
      let token = tokens[idx];
      if (token.map != null && token.type.endsWith('_open')) {
        token.attrPush(['data-startline', token.map[0] + 1]);
        token.attrPush(['data-endline', token.map[1]]);
      }
      return oldRenderer(tokens, idx, options);
    };


    // initialize codemirror editor
    var editor = CodeMirror.fromTextArea(document.getElementById(code), {
      mode: 'gfm',
      lineNumbers: true,
      matchBrackets: true,
      lineWrapping: true,
      theme: 'github',
      cursorScrollMargin: 20,
      extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    });
    this._editor = editor;

    editor.on('change', function (inst) {
      $('#'+out).html(md.render(inst.getValue()));

      if("change" in eventHandler && !uiEditorPage._noChangeEvent)
        eventHandler["change"]();
      uiEditorPage._noChangeEvent = false;
    });

    editor.on('scroll', function (inst) {
      if(uiEditorPage._noSync) {
        uiEditorPage._noSync = false;
        return;        
      }
      // try to scroll html side as well
      var currLine = inst.lineAtHeight(inst.getScrollInfo().top, "local");
      var elemLine;
      //console.log("line:"+currLine);

      $("#"+out + " *").each(function (){
        elemLine = $(this).attr("data-startline");
        //console.log("comp:"+currLine+"vs"+elemLine+"="+(elemLine>currLine));
        if(elemLine > currLine) {
          var top = $("#"+right).get(0);
          var obj = $(this).get(0);
          var offsetTop = 0;
          do {
            offsetTop += obj.offsetTop;
            obj = obj.offsetParent;
          } while(obj != top)

          uiEditorPage._noSync = true;
          $("#"+right).scrollTop(offsetTop);
          return false;
        }
      });
    });

    $("#"+right).scroll(function(e) {
      if(uiEditorPage._noSync) {
        uiEditorPage._noSync = false;
        return;        
      }
      console.log("scroll:" + e.currentTarget.scrollTop);

      var scrollTop = $("#"+right).scrollTop();
      var top = $("#"+right).get(0);
      var lastLine = 0;
      $("#"+out + " *").each(function (){

        var obj = $(this).get(0);
        var offsetTop = 0;
        do {
          offsetTop += obj.offsetTop;
          obj = obj.offsetParent;
        } while(obj != top)

        if(offsetTop > scrollTop) {
          var t = editor.charCoords({line: lastLine, ch: 0}, "local").top; 
          uiEditorPage._noSync = true;
          editor.scrollTo(null, t);
          return false; 
        }
        if($(this).attr("data-startline"))
          lastLine = $(this).attr("data-startline")-1;
      });
    });

    $(window).on('resize', function(e) {
      editor.setSize(null, $('#'+left).height()+"px");
    });

  },

  pageEnter: function (mdData) {
    $("#"+this._div).css("display", "block");

    this._editor.setSize(null, $('#'+this._div+"-left").height()+"px");
    if(mdData)
    {
      this._noChangeEvent = true;
      this._editor.setValue(mdData);      
    }
  },

  pageLeave: function () {
    this._editor.setValue("");
    $("#"+this._div).css("display", "none");
    if("leave" in this._eventHandler)
      this._eventHandler["leave"]();
  },

  getTitleText: function () {
    var out = document.getElementById(this._div+"-out");
    var h1 = out.getElementsByTagName("H1");
    if(h1.length > 0)
    {
      return h1[0].innerText;
    }
    return null;
  },

  getContent: function() {
    return this._editor.getValue();
  },

  on: function(event, callback) {
    this._eventHandler[event] = callback;
  },

};