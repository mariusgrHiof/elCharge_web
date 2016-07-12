<!DOCTYPE html>
<html>
  <head>
    <title>WS test</title>
    <script type="javascript/text" src="../js/libs/jQuery-min.js"></script>
  </head>
<body>

  <strong>Status</strong>
  <div id="status"></div>
  <script>
    window.onload = function(){
      var form = document.getElementById('message-form');
      var messageField = document.getElementById('message');
      var messagesList = document.getElementById('messages');
      var socketStatus = document.getElementById('status');
      var closeBtn = document.getElementById('close');

      var socket = new WebSocket('ws://realtime.nobil.no/api/v1/stream?apikey={274b68192b056e268f128ff63bfcd4a4}');
      //var socket = new WebSocket ('http://realtime.nobil.no/api/v1/stream/pingback?apikey=274b68192b056e268f128ff63bfcd4a4&url=ws://realtime.nobil.no/api/v1/stream');
      socket.onopen = function(event){
        socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.URL;
        socketStatus.className = 'open';
      };
    };
  </script>
</body>
</html>
