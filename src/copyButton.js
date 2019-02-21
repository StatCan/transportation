export default class CopyButton {      
		
  constructor(pNode, options) {                

    this.pNode = (pNode) ? pNode : document.createElement("div");
    this.options = (options) ? options : {};

    this.nodes = {};
    this.data = null; 
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
              
  build(options){
    if(options) this.options = options; // workAround;
    if(options.pNode) this.pNode = options.pNode; // workAround;
  
    this.root = document.createElement("div");
    this.root.setAttribute("class","copy-button");
    this.pNode.appendChild(this.root);
    
    this.nodes.btnCopy = document.createElement("button");
    this.nodes.btnCopy.setAttribute("type","button");
    this.nodes.btnCopy.setAttribute("class","btn btn-primary copy");
    this.nodes.btnCopy.setAttribute ("title", this.options.title || "");               
    this.root.appendChild(this.nodes.btnCopy);

    let icon =   document.createElement("span");
    icon.setAttribute("class", "fa fa-clipboard clipboard");
    this.nodes.btnCopy.appendChild(icon);

    let accessibility = document.createElement("span");
    accessibility.setAttribute("class","wb-inv");
    accessibility.innerHTML = this.options.accessibility || "";
    this.nodes.btnCopy.appendChild(accessibility);    
    
    this.nodes.msgCopyConfirm =  document.createElement("div");
    this.nodes.msgCopyConfirm.setAttribute("class","copy-confirm");
    this.nodes.msgCopyConfirm.setAttribute("aria-live","polite");
    this.nodes.msgCopyConfirm.innerHTML =  this.options.msgCopyConfirm || "";
    this.root.appendChild(this.nodes.msgCopyConfirm);

    this.nodes.btnCopy.addEventListener("click", this.onBtnClick.bind(this));
  }			

  onBtnClick(ev) {					
    this.copyData(this.data);           
  }    

  copyData(lines){
    let linesTemp = (lines) ? lines : [];
    this.clipboard(this.toCSV("\t", linesTemp), this.root);
            
    this.fade(this.nodes.msgCopyConfirm, true);
    
    setTimeout(function(ev) { 
      this.fade(this.nodes.msgCopyConfirm, false); 
      this.nodes.msgCopyConfirm.setAttribute("class", "copy-confirm"); // TODO : this should not be here
    }.bind(this), 1500);            

  }

  toCSV(separator, lines) {											
    let csv = lines.map(line => line.join(separator));
    
    return csv.join("\r\n");
  }
    
  clipboard(string, target) {
  if (this.isIE()) window.clipboardData.setData('Text', string);
    
  else {
    //Copying the string
    let aux = document.createElement("textarea");
    
    aux.textContent = string;
    
    target.appendChild(aux);
    
    aux.select();
    
    document.execCommand("copy");
    target.removeChild(aux);
  }
  }

  fade(node, visible) {
      let clss = ["copy-confirm"];

      let add =  visible ? "fadeIn" : "fadeOut";

      clss.push(add);

      node.setAttribute("class", clss.join(" "));      
  }	
  
  //work around for when tables are destroyed
  appendTo(pNode){
    this.pNode = pNode;

    this.pNode.appendChild(this.root);
  }

  isIE() {
    let ua = window.navigator.userAgent;

    let msie = ua.indexOf('MSIE ');
    
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    let trident = ua.indexOf('Trident/');
    
    if (trident > 0) {
      // IE 11 => return version number
      let rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    
    let edge = ua.indexOf('Edge/');
    
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    
    // other browser
    return false;
  } 
	}