function NewModalWindow(zlevel)
{
    var modal = document.createElement('div');
    document.body.appendChild(modal);
    modal.className = 'modal';
    modal.style.zIndex = zlevel.toString();
    var modalcontent = modal.createElement('div');
    modalcontent.className = 'modal-content';
    var modalclosebutton = modal.createElement('button');
    modalclosebutton.className = 'modalclosebutton';
    modalclosebutton.innerText = 'X';
    modalclosebutton.onclick = ()=>{
        modal.style.display = 'none';
    };

    return modal;
}

class ModalWindow
{
    constructor(zlevel = 1)
    {
        var win = NewModalWindow(zlevel);
        this.modalwindow = win;
        this.modalcontent = win.childNodes[0];
    }

    setContent(node, clone=true)
    {
        this.modalcontent.innerHTML = "";
        if(typeof(node) != String)
        {
            if(clone)
                this.modalcontent.appendChild(node.cloneNode(true));
            else
                this.modalcontent.appendChild(node);
        }
        else
        {
            this.modalcontent.innerHTML = node;
        }
    }

    toggleDisplay()
    {
        if(this.modalwindow.style.display == 'none')
        {
            this.turnOnDisplay();
        }
        else
        {
            this.turnOffDisplay();
        }
    }

    turnOnDisplay()
    {
        this.modalwindow.style.display = 'block';
    }

    turnOffDisplay()
    {
        this.modalwindow.style.display = 'none';
    }

    setZIndex(zlevel)
    {
        this.modalwindow.style.zIndex = zlevel.toString();
    }
}

document.onloadevents.push(() => {
    document.modalwindow1 = new ModalWindow()
    document.modalwindow2 = new ModalWindow(2);
    document.modalwindowerror = new ModalWindow(10);
});