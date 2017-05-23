"use strict";

var uiListPage = {

  init: function(divId, itemClickFunc) {
    this._div = "#"+divId;
    this._list = "#"+divId+"-ul";
    this._click = function (e) {
      itemClickFunc($(e.target).data("act"));
      return false;
    }
  },

  pageInit: function () {
    $(this._div).css("display", "none");

    $(this._div).html("");
    $(this._div).append(
      $('<ul>').attr('style', 'list-style: none; padding: 0;').attr('id', this._list.slice(1)));
  },

  pageEnter: function (mdItems) {

    // reset to empty
    $(this._list).empty();

    $(this._list).append(
      $('<li>').attr('class', 'col-sm-3').append(
        $('<div>').attr('class', 'md-entry md-new h4').append(
          $('<a>').attr('href','#').click(this._click).append(
            $('<span>').attr('class', 'glyphicon glyphicon-plus')).append("New Note")
    ))); 

    for(var i=0;i<mdItems.length;i++)
    {
      var item = mdItems[i];
      $(this._list).append(
        $('<li>').attr('class', 'col-sm-3').append(
          $('<div>').attr('class', 'md-entry h4').append(
            $('<a>').attr('href','#').data('act',item.id).click(this._click).append(
              $('<span>').attr('class', 'glyphicon glyphicon-file')).append(item.name)
      )));
    }

    $(this._div).css("display", "block");
  },

  pageLeave: function () {
    $(this._div).css("display", "none");
  },


};