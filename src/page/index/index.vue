<template>
  <div id="main" @click="Focus">
    <div id="command">
      <p v-for="command in commands" v-if="command === 'command' " :key="command.id">
        {{ command.message }}
      </p>
      <p v-else v-html="command.message"></p>
    </div>
    <div id="input-box">
      <span id="site">You@
        <a href="https://hqweay.cn" target="_blank" style="color: black;">Hqweay</a>:/$</span>
      <input type="text" id="input" v-model="command" @keyup.enter="matchCommand" @keydown.tab="completeCommond">
    </div>
  </div>
</template>

<script>
//获取时间对象
Date.prototype.format = function(fmt) {
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
};
export default {
  components: {},
  data() {
    return {
      blog: {
        site: "https://hqweay.cn", //网址
        archiveUrl: "https://hqweay.cn/archives/", //归档页面，暂不支持分页以及其他
        label: "h3" //标题使用标签
      },
      //支持的命令
      supportedCommands: [
        {
          command: "help",
          Attribute: []
        },
        {
          command: "ls",
          Attribute: []
        },
        {
          command: "clear",
          Attribute: []
        },
        {
          command: "show",
          Attribute: ["show about", "show archives"]
        }
      ],
      documents: ["about", "archives", "goodThings"],
      commands: [],
      command: ""
    };
  },
  //用 update 实现了当超出显示区域 输入框总置于最下方
  // https://segmentfault.com/q/1010000007028422 被忽略的答案
  updated: function() {
    document.getElementById("main").scrollTop = document.getElementById(
      "command"
    ).scrollHeight;
  },
  methods: {
    matchCommand() {
      let command = this.command;
      this.inputCommand();

      switch (command) {
        case /rm[ a-zA-Z]*/.test(command) ? command : false:
          this.Egg();
          break;
        case "clear":
          this.Clear();
          break;
        case "help":
          this.Help();
          break;
        case "ls":
          this.Ls();
          break;
        case /show[ a-zA-Z]*/.test(command) ? command : false:
          this.Show(command);
          break;
        default:
          this.Error();
          break;
      }
    },
    /**
     * Tab 补全，还没做
     */
    completeCommond() {
      console.log("补全");
      // this.Focus();
    },
    /**
     *
     */
    inputCommand() {
      let time = new Date().format("yyyy-MM-dd hh:mm:ss");
      let command = "[ " + time + " ] " + "guest > " + this.command;
      this.addCommandWithoutTime("command", command);
      this.command = "";
    },
    addCommand(type, command) {
      let time = new Date().format("yyyy-MM-dd hh:mm:ss");
      command = "[ " + time + " ] " + "guest > " + command;
      let easyCommand = {};
      easyCommand.type = "command";
      easyCommand.message = command;
      this.commands.push(easyCommand);
    },
    addCommandWithoutTime(type, command) {
      let easyCommand = {};
      easyCommand.type = "command";
      easyCommand.message = command;
      this.commands.push(easyCommand);
    },
    Focus() {
      console.log("聚焦");
      document.getElementById("input").focus();
    },
    Show(command) {
      switch (command) {
        case /[a-zA-Z ]*about/.test(command) ? command : false:
          this.showAbout();
          break;
        case /[a-zA-Z ]*archives/.test(command) ? command : false:
          this.showArchives();
          break;
        default:
          this.addCommandWithoutTime(
            "command",
            "Don`t find this document, try show about ?"
          );
          break;
      }
    },
    Error() {
      console.log("不存在此命令");
      this.addCommandWithoutTime(
        "command",
        "This command is not yet supported. Try to see 'help'."
      );
    },
    /**
     * 当用户输入 rm
     */
    Egg() {
      this.addCommandWithoutTime("command", "- 想干嘛呢宝贝儿 ~");
      this.addCommandWithoutTime(
        "command",
        "- 输入 show about, 了解我的信息。"
      );
    },
    /**
     * clear
     */
    Clear() {
      this.commands = [];
    },
    /**
     * help
     */
    Help() {
      this.addCommandWithoutTime("command", "Supported command list: ");
      for (let index in this.supportedCommands) {
        this.addCommandWithoutTime(
          "command",
          "> " + this.supportedCommands[index].command
        );
        for (let i in this.supportedCommands[index].Attribute) {
          console.log(i);
          this.addCommandWithoutTime(
            "command",
            ">> " + this.supportedCommands[index].Attribute[i]
          );
        }
      }
      this.addCommandWithoutTime("command", "Example > show about");
    },
    /**
     * ls
     */
    Ls() {
      for (let index in this.documents) {
        this.addCommandWithoutTime("command", " > " + this.documents[index]);
      }
      this.addCommandWithoutTime("command", "Try input > show about ");
    },
    /**
     * show about
     */
    showAbout() {
      this.addCommandWithoutTime(
        "command",
        "-  Hi! I`m hqweay, a student in swpu now."
      );
      this.addCommandWithoutTime(
        "command",
        "-  Connect me, u can send email to hqweay#gmail.com."
      );
      this.addCommandWithoutTime("command", "-  Thanks for your visit!");
    },
    /**
     * show archives
     * 展示博客文章相关逻辑
     * 因为用的 hexo ，文章标题需要自己去解析
     **/
    showArchives() {
      this.$ajax({
        method: "get",
        url: this.blog.archiveUrl
      }).then(response => {
        let parser = new DOMParser();
        let htmlDoc = parser.parseFromString(response.data, "text/html");

        let h3s = htmlDoc.getElementsByTagName(this.blog.label);
        console.log(htmlDoc);

        //这里出了错 index 会出现 length， item 等值
        //所以解析 xml 失败，手机上不能忽略这个错 直接加载失败
        for (let index in h3s) {
          if (!isNaN(index)) {
            let titleUrl = h3s[index].innerHTML;
            let doc = parser.parseFromString(titleUrl, "text/xml");
            let a = doc.firstChild;
            //另外设置
            a.setAttribute("href", this.blog.site + a.getAttribute("href"));
            a.setAttribute("target", "_BLANK"); //新建窗口打开文章
            a.setAttribute("style", " color: cadetblue;"); //颜色
            //标签转文字 方便插入网页
            titleUrl = a.outerHTML;
            this.addCommandWithoutTime("url", titleUrl);
          } else {
            console.log(index);
          }
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main {
  margin-left: 5px;
  overflow-y: scroll;
  color: black;
  width: 100%;
  height: 400px;
}
p {
  margin-top: 0;
  margin-bottom: 5px;
}
#input-box {
  width: 100%;
  color: #c7c7c7;
}

input {
  border: none;
  color: black;
  outline: none;
  font-size: 16px;
}
</style>
