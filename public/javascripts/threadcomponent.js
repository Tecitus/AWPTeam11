class ThreadComponent extends Component
{
    constructor(data)
    {
        super()
        this.data = data;
        this.rootElement = document.createElement("div");
        this.rootElement.className = "Thread";
        this.rootElement.classList.add('backgroundgradient','bordergradient');
        this.rootElement.component = this;
        if(window[windowid].user && window[windowid].user.isadmin)
        {
            let deletebutton = this.rootElement.createElement("button");
            deletebutton.innerHTML = "<i18nstr>deletethread</i18nstr>";
            deletebutton.onclick = async () => {
                await window[windowid].socket.ioreq.Request('request', {rgroup: 'admin', request: 'adminDeleteThread', id : data.id});
                this.rootElement.remove();
            }
        }
        this.nameh3 = this.rootElement.createElement("h3");
        this.nameh3.innerText = this.data.nickname;
        this.rootElement.createElement("hr");
        this.contentp = this.rootElement.createElement("p");
        this.contentp.innerHTML = this.data.content;
    }
}

class NewThreadComponent extends Component
{
    constructor(latitude, longitude, aftersubmit, originalcontent = "")
    {
        super()
        this.rootElement = document.createElement("div");
        this.buttonsdiv = this.rootElement.createElement("div");
        let addphotobutton = this.buttonsdiv.createElement("button");
        addphotobutton.innerHTML = "<i18nstr>addphoto</i18nstr>";
        let boldbutton = this.buttonsdiv.createElement("button");
        boldbutton.innerHTML = "<b>Bold</b>";
        let italicbutton = this.buttonsdiv.createElement("button");
        italicbutton.innerHTML = "<i>Italic</i>";
        let underlinebutton = this.buttonsdiv.createElement("button");
        underlinebutton.innerHTML = "<u>Underline</u>";
        this.rootElement.createElement("hr");
        this.contentvisualdiv = this.rootElement.createElement("div");
        this.contentvisualdiv.innerHTML = originalcontent;
        this.contentvisualdiv.setAttribute("contenteditable", "true");
        this.contentvisualdiv.className = "Editor";
        function focusEditor() 
        { 
            this.contentvisualdiv.focus({preventScroll: true}); 
        }
        boldbutton.onclick = () => {document.execCommand("bold"); focusEditor();};
        italicbutton.onclick = () => {document.execCommand("italic"); focusEditor();};
        underlinebutton.onclick = () => {document.execCommand("underline"); focusEditor();};
        this.submitbutton = this.rootElement.createElement("button");
        this.submitbutton.innerHTML = "<i18nstr>submit</i18nstr>";
        let thisclass = this;
        addphotobutton.onclick = () =>{
            let addphotoinput = document.createElement("input");
            addphotoinput.type = "file";
            addphotoinput.accept = "img/*";
            addphotoinput.click();
            addphotoinput.addEventListener("change", async (event) => {
                let img = event.currentTarget;
                let reader = new FileReader();
                await reader.readAsDataURL(img.files[0]);
                reader.onload = () => {
                    let base64 = reader.result;
                    let newimg = document.createElement("img");
                    newimg.src = base64;
                    this.contentvisualdiv.innerHTML += newimg.outerHTML;
                    focusEditor();
                }
            });
        }
        this.submitbutton.onclick = async () => {
            var result = await window[windowid].socket.ioreq.Request('request', {rgroup: 'thread', request: 'makeNewThread', latitude:latitude, longitude: longitude, content: thisclass.contentvisualdiv.innerHTML});
            if(result.result)
            {
                document.modalwindow1.turnOffDisplay();
                aftersubmit();
            }
            else
            {
                alert(result.err);
            }
        };
    }
}