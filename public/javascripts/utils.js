//For hoisting
var google;


Node.prototype.createElement = function (tagname, classname = undefined, id = undefined)
{
    var tag = document.createElement(tagname);
    this.appendChild(tag);
    if(classname)
    {
        tag.className = classname;
    }
    if(id)
    {
        tag.id = id;
    }
    return tag;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getContentDiv()
{
    return document.getElementsByClassName('content')[0];
}

function clearContentDiv()
{
    var content = getContentDiv();
    content.innerHTML = "";
    return content;
}