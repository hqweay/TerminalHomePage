$(function () {

  var input = $('#input'),
    body = $('#body'),
    inputBox = $('#input-box'),
    timeBox = $('#time'),
    supportedCommand = ['help', 'cat', 'show'];

  function cat(args) {
    console.log('cat command called');
    console.log('args: ' + args);
  }

  function show(args) {
    console.log('show command called');
    console.log('args: ' + args);
    onInput('<p>...article list...<p>');
  }

  function help(args) {
    let list = '';
    $(supportedCommand).each(function (index, el) {
      list += '<li>' + el + '</li>';
    });

    let text = '<p> Supported command list: <ul>' + list + '</ul></p>';
    text += '<p class="system"> Examples <string class="command">show --new article</string></p>'
    onInput(text);
  }

  function alwaysFocus() {
    input.focus();
    input.blur(function () {
      input.focus();
    });
  }

  function outputHelpText(command) {
    let time = new Date().format("yyyy-MM-dd hh:mm:ss");
    let p = $('<p>').addClass('system').html('[ ' + time + ' ] ' + 'tf > ' + '<span class="command">' + command + '</span>' + ' is not yet supported. See <span class="command">\'' + supportedCommand[0] + '\'</span>.');
    body.append(p);
    input.val('');
    return;
  }

  function onInput(command) {
    let time = new Date().format("yyyy-MM-dd hh:mm:ss");
    let p = $('<p>').addClass('system').html('[ ' + time + ' ] ' + 'guest > ' + command);
    body.append(p);
    input.val('');
    return;
  }

  $(document).keyup(function (event) {
    if (event.keyCode == 13) {
      let inputs = input.val().split(" --"),
        command = inputs[0],
        args = inputs[1] ? inputs[1] : '';

      alwaysFocus();
      updateInputBox();

      if (command == '') return onInput(' ');
      if ($.inArray(command, supportedCommand) < 0) return outputHelpText(command);
      onInput(command + ' ' + args);
      eval(command + "(args)");
    }
  });

  function updateInputBox() {
    var time = new Date().format("yyyy-MM-dd hh:mm:ss");
    timeBox.text('[ ' + time + ' ]');
  }

  alwaysFocus();
  updateInputBox();

});

Date.prototype.format = function (fmt) {
  fmt = fmt.replace("yyyy", this.getFullYear());
  fmt = fmt.replace("yy", this.getFullYear() % 100);
  fmt = fmt.replace("MM", fix(this.getMonth() + 1));
  fmt = fmt.replace("dd", fix(this.getDate()));
  fmt = fmt.replace("hh", fix(this.getHours()));
  fmt = fmt.replace("mm", fix(this.getMinutes()));
  fmt = fmt.replace("ss", fix(this.getSeconds()));
  return fmt;

  function fix(n) {
    return n < 10 ? "0" + n : n;
  }
}
