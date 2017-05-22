"use strict";

var uiEditorPage = {

  init: function(divId, onSaveCallback) {
    this._div = divId;
    this._onsave = onSaveCallback;
  },

  pageInit: function () {

    var div = this._div;
    var left = this._div + "-left";
    var code = this._div + "-code";
    var right = this._div + "-right";
    var out = this._div + "-out";

    $("#"+div).css("display", "none");

    $("#"+div).html("");
    $("#"+div).append(
      $('<div>').attr('class', 'col-sm-6 editor-panel').attr('id', left).append(
        $('<form>').append(
          $('<textarea>').attr('id', code))));

    $("#"+div).append(
      $('<div>').attr('class', 'col-sm-6 editor-panel').attr('id', right).append(
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

    const oldRenderer = md.renderer.renderToken.bind(md.renderer)
    md.renderer.renderToken = function (tokens, idx, options) {
      let token = tokens[idx];
      if (token.map != null && token.type.endsWith('_open')) {
        token.attrPush(['data-startline', token.map[0] + 1]);
        token.attrPush(['data-endline', token.map[1]]);
      }
      return oldRenderer(tokens, idx, options);
    };
    this._md = md;


    // initialize codemirror editor
    var editor = CodeMirror.fromTextArea(document.getElementById(code), {
      mode: 'gfm',
      lineNumbers: true,
      matchBrackets: true,
      lineWrapping: true,
      theme: 'github',
      extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    });

    editor.on('change', function (inst) {
      /*
      this._dirty = true;
      clearTimeout(this._timer);
      this._timer = setTimeout(function () {
        this._onsave(inst.getValue());
      }, 5000);
      */
      $('#'+out).html(md.render(inst.getValue()));
    });

    editor.on('scroll', function (inst) {
      // try to scroll html side as well
      var currLine = inst.lineAtHeight(inst.getScrollInfo().top, "local");
      var elemLine;
      //console.log("line:"+currLine);

      $("#"+out + " *").each(function (){
        elemLine = $(this).attr("data-startline");
        //console.log("comp:"+currLine+"vs"+elemLine+"="+(elemLine>currLine));
        if(elemLine > currLine) {
          var fin = $("#"+right).get(0);
          var obj = $(this).get(0);
          var offsetTop = 0;
          do {
            offsetTop += obj.offsetTop;
            obj = obj.offsetParent;
          } while(obj != fin)

          $("#"+right).scrollTop(offsetTop);
          return false;
        }
      })
    });

    this._editor = editor;

    $("#"+right).scroll(function(e) {
      console.log("scroll:" + e.currentTarget.scrollTop);
    });

    $(window).on('resize', function(e) {
      editor.setSize(null, $('#'+left).height()+"px");
    });

  },

  pageEnter: function (mdData) {
    $("#"+this._div).css("display", "block");

    this._editor.setSize(null, $('#'+this._div+"-left").height()+"px");
    if(mdData)
      this._editor.setValue(mdData);
  },

  pageLeave: function () {
    this._editor.setValue("");
    $("#"+this._div).css("display", "none");
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


};