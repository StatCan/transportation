export default class CopyButton {
  constructor(pNode, options) {
    this.pNode = (pNode) ? pNode : document.createElement("div");
    this.options = (options) ? options : {};

    this.nodes = {};
    this.data = null;

    this.instanceNumber = ++CopyButton.n;
    this.class = this.options.class || "";
    /* this.data = shall be an array (i.e called rowsArray) of arrays (i.e each is called row).
      each array on rowsArray represents a row on the table.
      this.data must be set/updated by the code that uses this button
      [
        ["title"]
        ["columna1" , "columna2" ,..., "columnaN"]
        ["value1Row1", "value2Row1",..., "valueNRowN"]
        ["value1Row2", "value2Row2",..., "valueNRowN"]
      ]
    */
  }

  build(options) {
    if (options) this.options = options; // workAround;
    if (options.pNode) this.pNode = options.pNode; // workAround;
    if (options.class) this.class = options.class;// workAround;

    this.root = document.createElement("div");
    this.root.setAttribute("class", "copy-button button-" + this.instanceNumber + " " + this.class);
    this.pNode.appendChild(this.root);

    this.nodes.btnCopy = document.createElement("button");
    this.nodes.btnCopy.setAttribute("type", "button");
    this.nodes.btnCopy.setAttribute("class", "btn btn-primary copy button-" + this.instanceNumber + " " + this.class);
    this.nodes.btnCopy.setAttribute("title", this.options.title || "");
    this.root.appendChild(this.nodes.btnCopy);

    const icon = document.createElement("span");
    icon.setAttribute("class", "fa fa-clipboard clipboard button-" + this.instanceNumber + " " + this.class);
    this.nodes.btnCopy.appendChild(icon);

    const accessibility = document.createElement("span");
    accessibility.setAttribute("class", "wb-inv button-" + this.instanceNumber + " " + this.class);
    accessibility.innerHTML = this.options.accessibility || "";
    this.nodes.btnCopy.appendChild(accessibility);

    this.nodes.msgCopyConfirm = document.createElement("div");
    this.nodes.msgCopyConfirm.setAttribute("class", "copy-confirm button-" + this.instanceNumber + " " + this.class);
    this.nodes.msgCopyConfirm.setAttribute("aria-live", "polite");
    this.nodes.msgCopyConfirm.innerHTML = this.options.msgCopyConfirm || "";
    this.root.appendChild(this.nodes.msgCopyConfirm);

    this.nodes.btnCopy.addEventListener("click", this.onBtnClick.bind(this));
  }

  onBtnClick(ev) {
    this.copyData(this.data);
  }

  copyData(lines) {
    const linesTemp = (lines) ? lines : [];
    this.clipboard(this.toCSV("\t", linesTemp), this.root);

    this.fade(this.nodes.msgCopyConfirm, true);

    setTimeout(function(ev) {
      this.fade(this.nodes.msgCopyConfirm, false);
    }.bind(this), 1500);
  }

  toCSV(separator, lines) {
    const csv = lines.map((line) => line.join(separator));

    return csv.join("\r\n");
  }

  clipboard(string, target) {
    if (this.isIE()) window.clipboardData.setData("Text", string);

    else {
      // Copying the string
      const aux = document.createElement("textarea");

      aux.textContent = string;

      target.appendChild(aux);

      aux.select();

      document.execCommand("copy");
      target.removeChild(aux);
    }
  }

  fade(node, visible) {
    const clss = ["copy-confirm button-" + this.instanceNumber + " " + this.class];
    const add = visible ? "fadeIn" : "fadeOut";

    clss.push(add);

    node.setAttribute("class", clss.join(" "));
  }

  // work around for when tables are destroyed
  appendTo(pNode) {
    this.pNode = pNode;

    this.pNode.appendChild(this.root);

    this.nodes.msgCopyConfirm.setAttribute("class", "copy-confirm button-" + this.instanceNumber + " " + this.class);
  }

  isIE() {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf("MSIE ");

    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
    }

    const trident = ua.indexOf("Trident/");

    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf("rv:");
      return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
    }

    const edge = ua.indexOf("Edge/");

    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
    }

    // other browser
    return false;
  }
}

CopyButton.n = 0;
