define([
  'jquery',
  'underscore',
  'backbone',
  'demo/data'
], function($, _, Backbone, demoData) {
  'use strict';
  /*jshint -W106:true */
  var routes = {};
  var responseDelay = 150;

  var uuid = function() {
    var id = '';
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return id;
  };

  var volumeGet = function(request) {
    var id;
    var volumes = [];

    for (id in demoData.volumes) {
      volumes.push(demoData.volumes[id]);
    }

    setTimeout(function() {
      request.success(volumes);
    }, responseDelay);
  };
  routes['GET+volume'] = volumeGet;

  var volumePutPost = function(request, volumeId) {
    var volume;

    if (!volumeId) {
      volumeId = uuid();
      demoData.volumes[volumeId] = {
        id: volumeId,
        percent_used: Math.random(),
        snapshot_pending: false
      };
      demoData.snapshots[volumeId] = [];
      demoData.tasks[volumeId] = [];
      demoData.events[volumeId] = [];
    }
    volume = demoData.volumes[volumeId];

    volume.name = request.data.name;
    volume.path = request.data.path;
    volume.source_path = request.data.source_path;
    volume.excludes = request.data.excludes;
    volume.schedule = request.data.schedule;
    volume.min_free_space = request.data.min_free_space;
    volume.bandwidth_limit = request.data.bandwidth_limit;

    setTimeout(function() {
      request.success({});
    }, responseDelay);
  };
  routes['PUT+volume'] = volumePutPost;
  routes['POST+volume'] = volumePutPost;

  var volumeDelete = function(request, volumeId) {
    delete demoData.volumes[volumeId];

    setTimeout(function() {
      request.success({});
    }, responseDelay);
  };
  routes['DELETE+volume'] = volumeDelete;

  var snapshotGet = function(request, volumeId) {
    setTimeout(function() {
      request.success(demoData.snapshots[volumeId]);
    }, responseDelay);
  };
  routes['GET+snapshot'] = snapshotGet;

  var snapshotPost = function(request, volumeId) {
    if (demoData.volumes[volumeId].snapshot_pending) {
      setTimeout(function() {
        request.success({});
      }, responseDelay);
      return;
    }
    demoData.volumes[volumeId].snapshot_pending = true;

    var task = {
      id: uuid(),
      type: 'create_snapshot',
      state: 'pending',
      time: Math.round(new Date().getTime() / 1000)
    };

    demoData.tasks[volumeId].unshift(task);

    demoData.events[volumeId].push({
      id: uuid(),
      type: 'tasks_updated',
      time: Math.round(new Date().getTime() / 1000)
    });
    demoData.events[volumeId].push({
      id: uuid(),
      type: 'volumes_updated',
      time: Math.round(new Date().getTime() / 1000)
    });

    setTimeout(function() {
      if (task.state === 'aborted') {
        return;
      }

      demoData.snapshots[volumeId].unshift({
        id: Math.round(new Date().getTime() / 1000),
        received: '32.00 bytes',
        runtime: '10 Seconds',
        sent: '52.12 MB',
        speed: '24.10 MB/sec',
        state: 'complete',
        volume: volumeId
      });

      demoData.volumes[volumeId].snapshot_pending = false;
      task.state = 'complete';

      demoData.events[volumeId].push({
        id: uuid(),
        type: 'volumes_updated',
        time: Math.round(new Date().getTime() / 1000)
      });
      demoData.events[volumeId].push({
        id: uuid(),
        type: 'tasks_updated',
        time: Math.round(new Date().getTime() / 1000)
      });
      demoData.events[volumeId].push({
        id: uuid(),
        type: 'snapshots_updated',
        time: Math.round(new Date().getTime() / 1000)
      });
    }, 12000);

    setTimeout(function() {
      request.success({});
    }, responseDelay);
  };
  routes['POST+snapshot'] = snapshotPost;

  var snapshotDelete = function(request, volumeId, snapshotId) {
    var i;

    for (i = 0; i < demoData.snapshots[volumeId]; i++) {
      if (demoData.snapshots[volumeId][i] === snapshotId) {
        demoData.snapshots[volumeId].splice(i, 1);
        break;
      }
    }

    setTimeout(function() {
      request.success({});
    }, responseDelay);
  };
  routes['DELETE+snapshot'] = snapshotDelete;

  var objectGet = function(request, volumeId) {
    var i;
    var x;
    var pathList = [];
    var objects = demoData.objects;
    var notFound;
    var sourcePathList = demoData.volumes[volumeId].source_path.split('/');

    for (i = 0; i < sourcePathList.length; i++) {
      if (sourcePathList[i]) {
        pathList.push(sourcePathList[i]);
      }
    }

    for (i = 3; i < arguments.length; i++) {
      pathList.push(arguments[i]);
    }

    for (i = 0; i < pathList.length; i++) {
      notFound = true;
      for (x = 0; x < objects.length; x++) {
        if (pathList[i] === objects[x].id && objects[x].objects) {
          objects = objects[x].objects;
          notFound = false;
          break;
        }
      }
      if (notFound) {
        request.error({
          status: 404,
        });
        break;
      }
    }

    setTimeout(function() {
      request.success(objects);
    }, responseDelay);
  };
  routes['GET+object'] = objectGet;

  var taskGet = function(request, volumeId) {
    var i;
    var task;
    var volumeName = demoData.volumes[volumeId].name;
    var tasks = [];

    for (i = 0; i < demoData.tasks[volumeId].length; i++) {
      task = demoData.tasks[volumeId][i];
      tasks.push({
        id: task.id,
        type: task.type,
        volume: volumeId,
        volume_name: volumeName,
        state: task.state,
        time: task.time
      });
    }

    setTimeout(function() {
      request.success(tasks);
    }, responseDelay);
  };
  routes['GET+task'] = taskGet;

  var taskPut = function(request, volumeId) {
    if (request.data.abort) {
      var i;
      var task;

      for (i = 0; i < demoData.tasks[volumeId].length; i++) {
        task = demoData.tasks[volumeId][i];
        if (task.id === request.data.id) {
          break;
        }
        task = null;
      }

      if (task && task.state !== 'aborting') {
        task.state = 'aborting';

        demoData.events[volumeId].push({
          id: uuid(),
          type: 'tasks_updated',
          time: Math.round(new Date().getTime() / 1000)
        });

        setTimeout(function() {
          task.state = 'aborted';

          demoData.events[volumeId].push({
            id: uuid(),
            type: 'tasks_updated',
            time: Math.round(new Date().getTime() / 1000)
          });

          if (task.type === 'create_snapshot') {
            demoData.volumes[volumeId].snapshot_pending = false;

            demoData.events[volumeId].push({
              id: uuid(),
              type: 'volumes_updated',
              time: Math.round(new Date().getTime() / 1000)
            });
          }
        }, 3000);
      }
    }

    setTimeout(function() {
      request.success({});
    }, responseDelay);
  };
  routes['PUT+task'] = taskPut;

  var taskDelete = function(request, volumeId, taskId) {
    var i;

    for (i = 0; i < demoData.tasks[volumeId].length; i++) {
      if (demoData.tasks[volumeId][i].id === taskId) {
        demoData.tasks[volumeId].splice(i, 1);
        break;
      }
    }

    setTimeout(function() {
      request.success({});
    }, responseDelay);
  };
  routes['DELETE+task'] = taskDelete;

  var restorePost = function(request, volumeId) {
    var task = {
      id: uuid(),
      type: 'restore_object',
      state: 'pending',
      time: Math.round(new Date().getTime() / 1000)
    };

    demoData.tasks[volumeId].unshift(task);

    demoData.events[volumeId].push({
      id: uuid(),
      type: 'tasks_updated',
      time: Math.round(new Date().getTime() / 1000)
    });

    setTimeout(function() {
      if (task.state === 'aborted') {
        return;
      }

      task.state = 'complete';

      demoData.events[volumeId].push({
        id: uuid(),
        type: 'tasks_updated',
        time: Math.round(new Date().getTime() / 1000)
      });
    }, 12000);

    setTimeout(function() {
      request.success({});
    }, responseDelay);
  };
  routes['POST+restore'] = restorePost;

  var checkEvents = function(request, volumeId, lastEvent, count) {
    setTimeout(function() {
      var i;
      var event;
      var events = [];

      for (i = 0; i < demoData.events[volumeId].length; i++) {
        event = demoData.events[volumeId][i];
        if (event.time <= lastEvent) {
          continue;
        }
        events.push(event);
      }

      if (events.length) {
        request.success(events);
      }
      else {
        count += 1;
        if (count > (5 / 0.3)) {
          request.success([]);
        }
        else {
          checkEvents(request, volumeId, lastEvent, count);
        }
      }
    }, 300);
  };

  var eventGet = function(request, volumeId, lastEvent) {
    lastEvent = parseInt(lastEvent, 10);
    if (!lastEvent) {
      request.success([{
        id: uuid(),
        type: 'time',
        time: Math.round(new Date().getTime() / 1000)
      }]);
      return;
    }

    checkEvents(request, volumeId, lastEvent, 0);
  };
  routes['GET+event'] = eventGet;

  var pathGet = function(request) {
    var i;
    var x;
    var pathList = [];
    var objects = demoData.objects;
    var notFound;

    for (i = 1; i < arguments.length; i++) {
      pathList.push(arguments[i]);
    }

    for (i = 0; i < pathList.length; i++) {
      notFound = true;
      for (x = 0; x < objects.length; x++) {
        if (pathList[i] === objects[x].id && objects[x].objects) {
          objects = objects[x].objects;
          notFound = false;
          break;
        }
      }
      if (notFound) {
        request.error({
          status: 404,
        });
        break;
      }
    }

    var path;
    var paths = [];
    if (pathList.length) {
      path = '/' + pathList.join('/') + '/';
      paths.push({
        name: '..',
        path: '/' + pathList.slice(0, -1).join('/')
      });
    }
    else {
      path = '/';
    }
    for (i = 0; i < objects.length; i++) {
      if (objects[i].type !== 'inode/directory') {
        continue;
      }
      paths.push({
        name: objects[i].id,
        path: path + objects[i].id
      });
    }

    setTimeout(function() {
      request.success(paths);
    }, responseDelay);
  };
  routes['GET+path'] = pathGet;

  var demoAjax = function(request) {
    var url = request.url.split('/');
    var method = url.splice(1, 1)[0];
    var vars = url.splice(1);
    var type = request.type;
    vars.unshift(request);

    if (request.data && request.dataType === 'json') {
      request.data = JSON.parse(request.data);
    }

    window.console.log(type, method, vars);

    if (routes[type + '+' + method]) {
      routes[type + '+' + method].apply(this, vars);
    }
  };

  return demoAjax;
});
