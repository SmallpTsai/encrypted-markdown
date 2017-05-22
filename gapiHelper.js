"use strict";

var gapiHelper = {

  listFolder: function(folderId) {
    return new Promise(function(resolve, reject) {
      gapi.client.drive.files.list({
        'q':"'"+folderId+"' in parents and trashed = false",
        'fields': "files(id, appProperties)"
      }).then(response => {
        if(response.status == 200)
        {
          resolve(response.result.files);
        }
        else
        {
          reject(response);
        }
      });
    });    
  },

  createRootFolder: function(folderName) {
    return new Promise(function(resolve, reject) {
      gapi.client.drive.files.create({
        resource: {
          'name': folderName,
          'mimeType':"application/vnd.google-apps.folder"
        },
        fields: "id"
      }).then(response => {
        if(response.status == 200)
        {
          resolve(response.result.id);
        }
        else
        {
          reject(response);
        }
      });
    });
  },

  getFolderIdByName: function(folderName) {
    return new Promise(function(resolve, reject) {
      gapi.client.drive.files.list({
        'q':"name='"+folderName+"'",
        'mimeType':"application/vnd.google-apps.folder",
        'fields': "files(id, name)"
      }).then(response => {
        if(response.status == 200)
        {
          var files = response.result.files;
          if(files.length > 0)
            resolve(files[0].id);
          else
            resolve("");
        }
        else
        {
          reject(response);
        }
      });
    });
  },

  createFile: function(filename, title, contentType, contentBody, folderId) {
    return new Promise(function(resolve, reject) {
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      var metadata = {
        'name': filename,
        'appProperties': {
          "title": title
        },
        'mimeType': contentType,
        'parents': [folderId]
      };

      var path = '/upload/drive/v3/files';
      var method = 'POST';

      var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        contentBody +
        close_delim;

      gapi.client.request({
        'path': path,
        'method': method,
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
      }).execute(function (json, rsp) {
        var response = JSON.parse(rsp).gapiRequest.data;
        if(response.status == 200)
        {
          resolve(json.id);
        }
        else
        {
          reject(response);
        }
      });
    });
  },

  updateFile: function(fileId, title, contentType, contentBody) {
    return new Promise(function(resolve, reject) {
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      var metadata = {
        'appProperties': {
          "title": title
        },
        'mimeType': contentType,
      };

      var path = '/upload/drive/v3/files/' + fileId;
      var method = 'PATCH';

      var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        contentBody +
        close_delim;

      gapi.client.request({
        'path': path,
        'method': method,
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
      }).execute(function (json, rsp) {
        var response = JSON.parse(rsp).gapiRequest.data;
        if(response.status == 200)
        {
          resolve(json.id);
        }
        else
        {
          reject(response);
        }
      });
    });
  },

  readFile: function(fileId) {
    return new Promise(function(resolve, reject) {
      gapi.client.drive.files.get({
        'fileId': fileId,
        'alt': 'media'
      }).then(response => {
        if(response.status == 200)
        {
          resolve(response.body);
        }
        else
        {
          reject(response);
        }
      });
    });
  },

}

